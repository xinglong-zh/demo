import * as util from '../gl-shaded/util';

import drawVert from './shaders/draw.vert.glsl';
import drawFrag from './shaders/draw.frag.glsl';

import quadVert from './shaders/quad.vert.glsl';

import screenFrag from './shaders/screen.frag.glsl';
import updateFrag from './shaders/update.frag.glsl';

import {colors} from '../gl-shaded/colors.js';
import WindLayer from "../gl-shaded/WindLayer";

import * as L from 'leaflet';

var GlParticles = WindLayer.extend({
    options: {
        density: 12,//每多少px显示一个粒子，大则稀
        speedFactor: 0.5,// 粒子运动速度系数，大则快
        fadeOpacity: 0.98, // how fast the particle trails fade on each frame，大则轨迹长
        dropRate: 0.001, // how often the particles move to a random place，小则轨迹长
        dropRateBump: 0.0001, // drop rate increase relative to individual particle speed
        
        particleSize: 2, //粒子大小
        className: ''
    },
    _initContainer: function () {
        var canvas = this.canvas = this._container = document.createElement('canvas');
        L.DomUtil.addClass(this._container, 'particles-canvas ' + this.options.className);
        //preserveDrawingBuffer 必须是false，否则粒子最终不能全透明
        var opts = {
            antialias: true,
            depth: false,
            stencil: false,
            alpha: true,
            premultipliedAlpha: true,
            preserveDrawingBuffer: false
        };
        var gl = this.gl =
            canvas.getContext('webgl', opts)||
            canvas.getContext("experimental-webgl",opts);
        //画粒子
        this.drawProgram = util.createProgram(gl, drawVert, drawFrag);
        //画背景
        this.screenProgram = util.createProgram(gl, quadVert, screenFrag);
        //更新粒子位置
        this.updateProgram = util.createProgram(gl, quadVert, updateFrag);

        this.quadBuffer = util.createBuffer(gl, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]));
        this.framebuffer = gl.createFramebuffer();

        this.setColor(colors[this.options.color],true);
    },
    deleteGlStuff:function(){        
        var gl = this.gl;
        gl.flush();
        gl.finish();

        gl.deleteBuffer(this.quadBuffer);
        gl.deleteBuffer(this.particleIndexBuffer);

        gl.deleteFramebuffer(this.framebuffer);

        gl.deleteTexture(this.particleStateTexture0);
        gl.deleteTexture(this.particleStateTexture1);
        gl.deleteTexture(this.backgroundTexture);
        gl.deleteTexture(this.screenTexture);
        gl.deleteTexture(this.windTexture);
        gl.deleteTexture(this.pltTex);

        gl.deleteProgram(this.drawProgram.program);
        gl.deleteProgram(this.screenProgram.program);
        gl.deleteProgram(this.updateProgram.program);

        gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
    hide:function(){
        util.bindFramebuffer(this.gl, null);
        this.gl.viewport(0,0,this.gl.canvas.width,this.gl.canvas.height);
        WindLayer.prototype.hide.call(this);
        this._animHandle&&L.Util.cancelAnimFrame(this._animHandle);
    },
    setNumParticles:function(numParticles) {
        if(this._numParticles==numParticles)
            return;

        const gl = this.gl;

        // we create a square texture where each pixel will hold a particle position encoded as RGBA
        const particleRes = this.particleStateResolution = Math.ceil(Math.sqrt(numParticles));
        this._numParticles = particleRes * particleRes;

        const particleState = new Uint8Array(this._numParticles * 4);
        for (let i = 0; i < particleState.length; i++) {
            particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
        }
        gl.deleteTexture(this.particleStateTexture0);
        gl.deleteTexture(this.particleStateTexture1);
        // textures to hold the particle state for the current and the next frame
        this.particleStateTexture0 = util.createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);
        this.particleStateTexture1 = util.createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);

        const particleIndices = new Float32Array(this._numParticles);
        for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;
        gl.deleteBuffer(this.particleIndexBuffer);
        this.particleIndexBuffer = util.createBuffer(gl, particleIndices);
    },
    getNumParticles() {
        return this._numParticles;
    },
    /**
     *
     * @param abv {ArrayBufferView}texture 数据源
     * @param size texture宽高
     * @param scale tex的有效范围比例
     * @param latLngBounds tex有效区范围
     * @param res tex分辨率 degree per pixel
     * @param pxBounds 视窗范围
     * @param ppd 视窗分辨率（经度） pixel per degree
     */
    render: function (abv, texSize, scale, latLngBounds, res, pxBounds, ppd) {
        this._animHandle&&L.Util.cancelAnimFrame(this._animHandle);
        var gl = this.gl;
        const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
        // screen textures to hold the drawn screen for the previous and the current frame
        gl.deleteTexture(this.backgroundTexture);
        gl.deleteTexture(this.screenTexture);
        this.backgroundTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
        this.screenTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);

        var size = pxBounds.getSize();
        this.setNumParticles(size.x * size.y/this.options.density/this.options.density);
 
        gl.deleteTexture(this.windTexture);
        var data = abv instanceof Int16Array ? new Uint16Array(abv.buffer): new Uint8Array(abv.buffer);
        this.windTexture =  util.createTexture(gl,gl.NEAREST,data,texSize.x,texSize.y);

        var epsg = this._map.options.crs.code.split(":")[1];

        this.draw({scale, latLngBounds, res, pxBounds, ppd,epsg, maxSpeed:this._maxSpeed()});
    },
    _maxSpeed:function(){
        var sample = this.getGrid(20),max = -Infinity;
        for (let i = 0; i < sample.features.length; i++) {
            var uvsd = sample.features[i].properties;
            if(uvsd.s>max)
                max = uvsd.s;
        }
        return max;
    },
    draw: function(props) {
        const gl = this.gl;
        util.bindTexture(gl, this.windTexture, 0);
        util.bindTexture(gl, this.particleStateTexture0, 1);

        this.drawScreen(props);
        this.updateParticles(props);
        return this._animHandle = L.Util.requestAnimFrame(function (){this.draw(props);},this);
    },

    drawScreen: function(props) {
        const gl = this.gl;
        // draw the screen into a temporary framebuffer to retain it as the background on the next frame
        util.bindFramebuffer(gl, this.framebuffer, this.screenTexture);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        this.drawTexture(this.backgroundTexture, this.options.fadeOpacity);
        this.drawParticles(props);
        util.bindFramebuffer(gl, null);
        // enable blending to support drawing on top of an existing background (e.g. a map)
        // gl.enable(gl.BLEND);
        // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.drawTexture(this.screenTexture, 1.0);
        // gl.disable(gl.BLEND);

        // save the current screen as the background for the next frame
        const temp = this.backgroundTexture;
        this.backgroundTexture = this.screenTexture;
        this.screenTexture = temp;
    },

    drawTexture: function(texture, opacity) {
        const gl = this.gl;
        const program = this.screenProgram;
        gl.useProgram(program.program);

        util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
        util.bindTexture(gl, texture, 2);
        gl.uniform1i(program.u_screen, 2);
        gl.uniform1f(program.u_opacity, opacity);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
    },

    drawParticles: function(props) {
        const gl = this.gl;
        const program = this.drawProgram;
        gl.useProgram(program.program);
        util.bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1);
        util.bindTexture(gl, this.pltTex, 2);
        gl.uniform1i(program.sLngLatTex, 0);
        gl.uniform1i(program.u_particles, 1);
        gl.uniform1i(program.sPltTex, 2);
        gl.uniform1f(program.u_particles_res, this.particleStateResolution);              
        gl.uniform1f(program.u_particle_size, this.options.particleSize);
        const color = this._color;
        gl.uniform3f(program.uPltMinMax, color.min, color.max, color.max - color.min);
        this.setProps(gl,program,props);
        
        gl.drawArrays(gl.POINTS, 0, this._numParticles);
    },

    updateParticles: function(props) {
        const gl = this.gl;
        util.bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1);
        gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution);

        const program = this.updateProgram;
        gl.useProgram(program.program);

        util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);

        gl.uniform1i(program.sLngLatTex, 0);
        gl.uniform1i(program.u_particles, 1);

        gl.uniform1f(program.u_rand_seed, Math.random());
        gl.uniform1f(program.u_speed_factor, this.options.speedFactor);
        gl.uniform1f(program.u_drop_rate, this.options.dropRate);
        gl.uniform1f(program.u_drop_rate_bump, this.options.dropRateBump);
        gl.uniform1f(program.u_speed_max, props.maxSpeed);
        this.setProps(gl,program,props);

        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // swap the particle state textures so the new one becomes the current one
        const temp = this.particleStateTexture0;
        this.particleStateTexture0 = this.particleStateTexture1;
        this.particleStateTexture1 = temp;
    },
    setProps: function (gl,program,props) {
        const latLngBounds = props.latLngBounds,
            res = props.res,
            scale = props.scale,
            pxBounds = props.pxBounds,
            ppd = props.ppd,
            epsg = props.epsg;
        gl.uniform4f(program.uLngLatBounds, latLngBounds.getWest(), latLngBounds.getSouth(), latLngBounds.getEast(), latLngBounds.getNorth());
        gl.uniform1f(program.uRes, res);
        gl.uniform2f(program.uScale, scale.x, scale.y);
        gl.uniform1i(program.uEPSG, epsg);
        gl.uniform1f(program.uPpd, ppd);
        gl.uniform4f(program.uBounds, pxBounds.min.x, pxBounds.min.y, pxBounds.max.x, pxBounds.max.y);
    }
})

export default GlParticles;
