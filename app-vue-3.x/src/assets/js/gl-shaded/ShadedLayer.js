import { colors } from './colors.js';
import { Mercator } from "./Mercator";
import { newWorker } from "./fakeWorker";
import { worker } from "./Tile.svc";
import { Catalog, Meta1, Meta3 } from "./Catalog";
import vs from "./shaders/vs.glsl";
import fs from "./shaders/fsi16hermite.xOy.glsl";
import * as util from "./util";
import { pow2n, bilinear } from "../util";
// import 'whatwg-fetch';
import * as L from 'leaflet';

var ShadedLayer = L.Renderer.extend({
    options: {
        padding: 0.1,
        // color: '',
        ratio: 1, //绘制时的插值率，datasource's deg/px  /  map's deg/px，越大渲染越平滑，请求的数据越小且越失真
        //低带宽或手机端可以使用2、4
        // meta: ,数据源请求参数
        typedArrayName: 'Int16Array',
        shaded: true,
        filter: 'true',
        className: '',
        animate:true, // 是否开启动画
        frame:60, //  deltaTex 计算使用间隔 , 默认为60帧, 1s内执行完成,待测试极限情况
        
    },
    /**
     * onAdd 时候 , 已经继承了  on('update',_updateaPaths,this);
     */
    onAdd: function () {
        L.Renderer.prototype.onAdd.call(this);
        /** 创建一个work 用于Tile 计算 */
        this.worker = newWorker(worker);
        this.options.shaded ? this.show(true) : this.hide();
        this.setMeta(this.options.meta, true);
        //初始化
        // this._updatePaths();
        this.deltaTex = null;  // 纹理增量数据
        this.oldMainTex = null; // 上次的纹理数据
        /**@type {Number[][]} */
        this.oldData = null;
         /**@type {Int16Array} */
        this.deltaData = new Int16Array();
    },
    onRemove: function () {
        L.Renderer.prototype.onRemove.call(this);
        this.worker.terminate();
    },
    getEvents: function () {
        var events = {
            viewreset: this._reset,
            zoom: this._onZoom,
            moveend: this._update,
            zoomend: this._onZoomEnd
        };
        if (this._zoomAnimated) {
            events.zoomanim = this._onAnimZoom;
        }
        return events;
    },
    show: function (init) {
        this.options.shaded = true;
        this.worker.onmessage = L.bind(this.texSrcLoaded, this);
        init || this.fire('update');
    },
    hide: function () {
        this.options.shaded = false;
        var gl = this.gl;
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        this.worker.onmessage = L.bind(function (ev) {
            this.setData(ev.data.result);
            this.fire('update');
        }, this);
    },
    _initContainer: function () {
        var canvas = this.canvas = this._container = document.createElement('canvas');
        L.DomUtil.addClass(this._container, 'shaded-canvas ' + this.options.className);
        /**@type {WebGLRenderingContextBase} */
        var gl = this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true }) || canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
        this.setFilter(this.options.filter, true);
        var buf = this.quadBuffer = gl.createBuffer(); // buffer 缓冲 ?
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);

        this.setColor(colors[this.options.color], true);
    },
    getVs: function () { return vs; },
    getFs: function () { return fs; },
    _destroyContainer: function () {
        L.DomUtil.remove(this._container);
        L.DomEvent.off(this._container);
        delete this._container;
        this.deleteGlStuff();
    },

    deleteGlStuff: function () {
        var gl = this.gl;
        gl.flush();
        gl.finish();

        gl.deleteBuffer(this.quadBuffer);

        gl.deleteTexture(this.mainTex);
        gl.deleteTexture(this.pltTex);

        gl.deleteProgram(this.prgObj.program);
        //ie11没有此extension
        gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
    /**
     * renderer ; moveend  , onAdd 会调用 _update 方法 , 默认私有方法
     */
    _update: function () {
        if (this._map._animatingZoom && this._bounds) {
            return;
        }

        // L.Renderer.prototype._update.call(this);
        // 不改this._center和this._zoom,放缩动画可以继续
        var p = this.options.padding,
            size = this._map.getSize(),
            min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();
        this._bounds = new L.Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
        this._latLngBounds = L.latLngBounds(
            this._map.layerPointToLatLng(this._bounds.min),
            this._map.layerPointToLatLng(this._bounds.max)
        );
        // Tell paths to redraw themselves
        this.fire('update');
    },
    /** on('update',_updateaPaths,this);
     *  响应所有的 update事件  ,  
     * 
    */
    _updatePaths: function () {

        if (this._redrawRequest) {
            // 如果当前正在绘制 , 则取消绘制 
            console.log("取消一帧");
            L.Util.cancelAnimFrame(this._redrawRequest);
        }
        var catalog = this.catalog;

        var crs = this._map.options.crs, zoom = this._map.getZoom();
        if (isNaN(zoom))
            return;
        this._pxBounds = L.bounds(
            crs.latLngToPoint(this._latLngBounds.getSouthWest(), zoom),
            crs.latLngToPoint(this._latLngBounds.getNorthEast(), zoom)
        );
        var res = this._getRes() * this.options.ratio;
        if (isNaN(res))
            return;
        var zoom = res < catalog.maxRes ? catalog.maxZoom : catalog.maxZoom - Math.ceil(Math.log(res / catalog.maxRes) / Math.log(2));
        if (zoom < 0) zoom = 0;

        // web worker 进行处理  , 由onmessage 的程序  this.texSrcLoaded  进行相应
        this.worker.postMessage({
            latLngBounds: this._latLngBounds,
            zoom: zoom,
            tileSize: catalog.tileSize,
            validBounds: catalog.validBounds[zoom],
            url: catalog.url,
            typedArrayName: catalog.typedArrayName || this.options.typedArrayName
        });

    },
    /**
     * 响应 web worker ==> _updatePaths 
     * 加载纹理使用
     * @param {*} ev 
     * imput 
     *  latLngBounds: this._latLngBounds,
        zoom: zoom,
        tileSize: catalog.tileSize,
        validBounds: catalog.validBounds[zoom],
        url: catalog.url,
        typedArrayName: catalog.typedArrayName || this.options.typedArrayName
        
        abv:

     */
    texSrcLoaded: function (ev) {
        this._redrawRequest = L.Util.requestAnimFrame(function () {
            this._redrawRequest = null;
            if (!this._map) return;//图层被移除
            var input = ev.data.input;//latLngBounds, zoom, tileSize, validBounds, url, typedArrayName
            input.latLngBounds = L.LatLngBounds.fromJSON(input.latLngBounds);
            this.setData(ev.data.result);
            if (!input.latLngBounds.equals(this._latLngBounds)) {//地图范围已经变化
                console.log("地图范围已经变化");
                return;
            }
            var data = this.data;  // this.setData 已经赋值  ev.data.result == > this.data
            if (data.allInvalid)
                this.fire("nothing");

            var crs = this._map.options.crs;
            var ppd = 1 / this._getRes();
            //视窗投影像素范围
            var xOyBounds =
                crs == L.CRS.EPSG4326
                    ? L.bounds(
                        L.LatLng.div(this._latLngBounds.getSouthWest(), 1 / ppd),
                        L.LatLng.div(this._latLngBounds.getNorthEast(), 1 / ppd)
                    )
                    : L.bounds(
                        Mercator.latlng2point(this._latLngBounds.getSouthWest(), ppd),
                        Mercator.latlng2point(this._latLngBounds.getNorthEast(), ppd)
                    );

            // 渲染函数
            const start = Date.now();
            if(this.options.animate){
                // options 开启过度动画效果
                if(this.oldData==null){
                    this.oldData = data.abv;
                }else{
                    // 判断oldData 是否和现在相等
                    if(this.oldData.join()!==data.abv){
                        //  开始创建纹理
                        let n = data.abv.length;
                        this.deltaData = new Uint16Array(n);
                        for (let i=0;i<n;i++){
                                this.deltaData[i] = (data.abv[i] - this.oldData[i])/this.options.frame;
                        }
                        // 创建纹理
                        /**@type {WebGLRenderingContextBase} */
                        let gl = this.gl;
                        this.deltaTex = util.createTexture(gl,gl.NEAREST,this.deltaData,data.size.x,data.size.y)
                        util.bindTexture(gl,this.deltaTex,2); // 绑定到纹理2
                    }

                }
            }
            this.render(data.abv, data.size, data.scale, data.latLngBounds, data.res, xOyBounds, ppd);
            console.log('渲染时间',Date.now()-start);
            this.fire("updated");

        }, this)
    },
    /**
     * @todos  no need all data  , change to fat parma
     * 
     * @param {*} data 
     * abv: abv,
        size: texSize,
        scale: scale,
        latLngBounds: self.latLngBounds,
        res: 360 / (2<<self.zoom) / self.tileSize,
        allInvalid: allInvalid
     */
    setData: function (data) {
        this.data = data;//{abv, size, scale, latLngBounds, res, allInvalid};
        data.size = L.Point.fromJSON(data.size);
        data.scale = L.Point.fromJSON(data.scale);
        data.latLngBounds = L.LatLngBounds.fromJSON(data.latLngBounds);

        var b = this._bounds,
            container = this._container,
            size = b.getSize(),
            retina = L.Browser.retina,
            m = retina ? 2 : 1;


        // The top left corner of the rectangle.   setPosition:  Sets the position of el to coordinates specified by position
        L.DomUtil.setPosition(container, b.min);

        // set canvas size (also clearing it); use double size on retina
        container.width = m * size.x;
        container.height = m * size.y;
        container.style.width = size.x + 'px';
        container.style.height = size.y + 'px';

        // Update pixel bounds of renderer container (for positioning/sizing/clipping later)
        L.Renderer.prototype._update.call(this);
        return this;
    },
    _getRes: function () {
        return (this._latLngBounds.getEast() - this._latLngBounds.getWest()) / this._pxBounds.getSize().x;
    },
    setMeta: function (meta, init) {
        if (meta.dsi || meta.tileUrl || meta.mdfs) {
            this.setMeta2(meta, init);
            return;
        }
        if (init || meta.ele != this.options.meta.ele) {
            var config = Catalog.getMeta(meta.ele);
            var latLngBounds = L.Util.isArray(config.bounds) ?
                L.latLngBounds(config.bounds) : config.bounds instanceof L.LatLngBounds ?
                    config.bounds :
                    L.LatLngBounds.fromJSON(config.bounds);
            var catalog = Catalog.init(latLngBounds, config.res)
            catalog.latLngBounds = latLngBounds;
            catalog.dsi = config.dsi;
            this.catalog = catalog;
        }
        this.catalog.url = this.catalog.dsi + '/' + meta.ele + '/' + meta.fileName + '/{z}/{x}/{y}.bin';
        this.options.meta = meta;
        this.fire('update');//_updatePaths
    },
    setColor: function (color, init) {
        if (!color) return;
        this._color = color;
        this.createGradientTexture(color);

        init || this.fire('update');
    },
    setFilter: function (filter, init) {
        var gl = this.gl;
        if (this.prgObj) {
            gl.deleteProgram(this.prgObj.program);
            this.options.filter = filter;
        }
        var fs = this.getFs() + '\nbool where(float val){\n\t return ' + filter + ';\n}';
        this.prgObj = util.createProgram(gl, this.getVs(), fs);
        init || this.fire('update');
        return this.prgObj;
    },
    //梯度纹理，用作调色板
    createGradientTexture: function (color) {
        var gl = this.gl;
        color.getColor();
        /**@type {WebGLTexture} */
        this.pltTex = util.createTexture(gl, gl.NEAREST, color.colors, color.steps, 1);
    },
    /**
     *
     * @param {*} abv {ArrayBufferView}texture 数据源
     * @param {*}size texture宽高
     * @param {*}scale tex的有效范围比例
     * @param {*} latLngBounds tex有效区范围
     * @param {*} res tex分辨率 degree per pixel
     * @param {*}pxBounds 视窗范围
     * @param {*}ppd 视窗分辨率（经度） pixel per degree
     */
    render: function (abv, texSize, scale, latLngBounds, res, pxBounds, ppd) {
        /**@type {WebGLRenderingContextBase} */
        var gl = this.gl, prgObj = this.prgObj;  // prgObj  ==> program Object  vs+fs
        var epsg = this._map.options.crs.code.split(":")[1];  // crs ==> EPSG:3857 
        var size = pxBounds.getSize(); // Returns the size of the given bounds  [x,y]
        var retina = L.Browser.retina,
            m = retina ? 2 : 1;
        size._multiplyBy(m);  // retina  * 2

        gl.useProgram(prgObj.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer); // [-1, -1, 1, -1, 1, 1, -1, 1]
        gl.enableVertexAttribArray(prgObj.aPos);//使用数组模式  a_position
        gl.vertexAttribPointer(prgObj.aPos, 2, gl.FLOAT, false, 0, 0);

        gl.viewport(0, 0, size.x, size.y);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        L.Renderer.prototype._update.call(this);

        gl.deleteTexture(this.mainTex);
        var data = abv instanceof Int16Array ? new Uint16Array(abv.buffer) : new Uint8Array(abv.buffer);
        /** FIXME: 这里计算 delta 矩阵 ,
         * 上次渲染的 data 保留 , 和这次渲染的data 计算矩阵差  ,  然后算delta ,  step  ,  此函数已经包含在requestAnimFrame 中
         * 
         */
        this.mainTex = util.createTexture(gl, gl.NEAREST, data, texSize.x, texSize.y);  // 创建主纹理
        util.bindTexture(gl, this.mainTex, 0);   // mainTex 纹理 0 , 计算坐标使用
        // uniformXXX 设置全局变量的值
        gl.uniform1i(prgObj.sLngLatTex, 0); // mainTex 复制给经纬度纹理

        gl.uniform4f(prgObj.uLngLatBounds, latLngBounds.getWest(), latLngBounds.getSouth(), latLngBounds.getEast(), latLngBounds.getNorth());
        gl.uniform1f(prgObj.uRes, res);
        gl.uniform2f(prgObj.uScale, scale.x, scale.y);
        gl.uniform1i(prgObj.uEPSG, epsg);
        gl.uniform1f(prgObj.uPpd, ppd);
        gl.uniform4f(prgObj.uBounds, pxBounds.min.x, pxBounds.min.y, pxBounds.max.x, pxBounds.max.y);
         // uniformXXX 设置全局变量的值

        var pltTex = this.pltTex, color = this._color;
        util.bindTexture(gl, pltTex, 1); // pltTex 纹理1 取色用
        gl.uniform1i(prgObj.sPltTex, 1);


        gl.uniform3f(prgObj.uPltMinMax, color.min, color.max, color.max - color.min);

        // 绑定过度纹理
        if(this.options.frame){

        }
        

        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    },
    /**
     *
     * @param latLng {L.LatLng}
     * @returns {*}
     */
    getVal: function (latLng) {
        if (!this.data) {
            return NaN;
        }
        var offset = L.LatLng.div(latLng.offset(this.data.latLngBounds.getSouthWest()), this.data.res);
        var min = offset.floor(), max = offset.ceil();
        var bounds = L.bounds(min, max);
        var ratio = offset.subtract(min);

        //暂用双线性插值取值，如果不行，再改用hermite插值
        //1--2
        //4--3
        var p1 = this._getCell(bounds.getTopLeft());
        var p2 = this._getCell(bounds.getTopRight());
        var p3 = this._getCell(bounds.getBottomRight());
        var p4 = this._getCell(bounds.getBottomLeft());

        return this.bilinear(p1, p2, p3, p4, ratio);
    },
    //双线性插值
    //1--2
    //4--3
    bilinear: function (p1, p2, p3, p4, ratio) {
        return bilinear(p1, p2, p3, p4, ratio);
    },
    _getCell: function (cell) {
        if (cell.y < 0 || cell.y >= this.data.size.y || cell.x < 0 || cell.x >= this.data.size.x)
            return NaN;
        var int16 = new DataView(this.data.abv.buffer).getInt16((cell.y * this.data.size.x + cell.x) * 2);
        if (int16 == 32767)//缺测
            return NaN;
        return int16 / 10;
    },
    getGrid: function (ppc, quad) {  //px per cell
        var geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        //得到视图内格点上的值，得到geojson，point；然后交由L.GeoJSON,TextMarker处理
        var leftBottom = L.LatLng.div(this._latLngBounds.getSouthWest().offset(this.data.latLngBounds.getSouthWest()), this.data.res)._floor();
        var rightTop = L.LatLng.div(this._latLngBounds.getNorthEast().offset(this.data.latLngBounds.getSouthWest()), this.data.res)._ceil();

        var mapRes = this._getRes();
        var skip = this.data.res / mapRes > ppc ? 1 : Math.ceil(ppc / (this.data.res / mapRes));
        //以[0,0]为基点，pow(2,n)为跳点数，调整skip及leftBottom
        skip = pow2n(skip);
        leftBottom = L.LatLng.div(this._latLngBounds.getSouthWest(), this.data.res * skip)._floor()._multiplyBy(skip)._subtract(
            L.LatLng.div(this.data.latLngBounds.getSouthWest(), this.data.res)._round()
        );

        if (quad) {
            var grid = [];
            for (var row = leftBottom.y; row <= rightTop.y; row += skip) {
                var rowData = [];
                grid.push(rowData);
                for (var col = leftBottom.x; col <= rightTop.x; col += skip) {
                    var cell = L.point(col, row);
                    var val = this._getCell(cell);
                    rowData.push(val instanceof Object ? val : { val: val });
                }
            }
            var sw = L.latLng(leftBottom.y * this.data.res + this.data.latLngBounds.getSouth(), leftBottom.x * this.data.res + this.data.latLngBounds.getWest());
            var ne = L.latLng(
                sw.lat + this.data.res * skip * (grid.length - 1),
                sw.lng + this.data.res * skip * (grid[0].length - 1));
            return { data: grid, bounds: L.latLngBounds(sw, ne), res: this.data.res * skip };
        }

        for (var row = leftBottom.y; row <= rightTop.y; row += skip) {
            for (var col = leftBottom.x; col <= rightTop.x; col += skip) {
                var cell = L.point(col, row);
                var val = this._getCell(cell);
                if (this.filter(val)) {
                    var latlng = L.latLng(row * this.data.res + this.data.latLngBounds.getSouth(), col * this.data.res + this.data.latLngBounds.getWest());
                    geojson.features.push({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [latlng.lng, latlng.lat]
                        },
                        "properties": val instanceof Object ? val : {
                            "val": val
                        }
                    });
                }
            }
        }

        return geojson;
    },
    filter: function (val) {
        return !isNaN(val);
    },
    //取指定范围内的格点矩阵
    subGrid: function (latLngBounds, prop) {
        latLngBounds = L.latLngBounds(latLngBounds);
        var leftBottom = L.LatLng.div(latLngBounds.getSouthWest().offset(this.data.latLngBounds.getSouthWest()), this.data.res)._ceil();
        var rightTop = L.LatLng.div(latLngBounds.getNorthEast().offset(this.data.latLngBounds.getSouthWest()), this.data.res)._floor();
        var data = [];
        for (var row = leftBottom.y; row <= rightTop.y; row++) {
            var rowData = [];
            for (var col = leftBottom.x; col <= rightTop.x; col++) {
                var cell = L.point(col, row);
                var val = this._getCell(cell);
                rowData.push(prop != null ? val[prop] : val);
            }
            data.push(rowData);
        }
        return {
            data: data,
            res: this.data.res,
            bounds: L.latLngBounds(
                this.data.latLngBounds.getSouthWest().offset(L.Point.mul(leftBottom, -this.data.res)),
                this.data.latLngBounds.getSouthWest().offset(L.Point.mul(rightTop, -this.data.res))
            )
        }
    },

    //----------------约定tile和meta接口，在内部获取元信息------------------------------
    setMeta2: function (meta, init) {
        this.getMeta(meta).
            then(config => {
                // {"res":0.25,"bounds":{"_southWest":{"lat":-89.875,"lng":0.0},"_northEast":{"lat":89.875,"lng":360.0}},"tileSize":256,"maxZoom":2,"maxRes":0.17578125}
                var latLngBounds = L.Util.isArray(config.bounds) ?
                    L.latLngBounds(config.bounds) : config.bounds instanceof L.LatLngBounds ?
                        config.bounds :
                        L.LatLngBounds.fromJSON(config.bounds);
                var catalog = Catalog.init(latLngBounds, config.res)
                catalog.latLngBounds = latLngBounds;
                this.catalog = catalog;
                if (meta.mdfs)
                    this.catalog.url = meta.mdfs + 'tile/' + meta.ele + '/' + meta.fileName + '/{z}/{x}/{y}.bin';
                else
                    this.catalog.url = meta.tileUrl || (meta.dsi + 'tile?dataPath=' + meta.ele + '/' + meta.fileName + '&z={z}&x={x}&y={y}' + '&_=' + new Date().getTime());
                this.options.meta = meta;
                this.fire('update');//_updatePaths  -- 继承自 renderer onAdd  onRemove
            });
    },
    /**
     * 
     * @param {*} meta  meta对象
     * @returns {Promise} 返fetch 的promise
     * {"res":0.25,"bounds":{"_southWest":{"lat":-89.875,"lng":0.0},"_northEast":{"lat":89.875,"lng":360.0}},"tileSize":256,"maxZoom":2,"maxRes":0.17578125}
     */
    getMeta: function (meta) {
        let url;
        if (meta.mdfs)
            url = meta.mdfs + "meta?dataPath=" + meta.ele;
        else
            url = meta.metaUrl || (meta.dsi + "meta?dataPath=" + meta.ele + '/' + meta.fileName);

        return fetch(url).then(res => res.json())
    },
});

export default ShadedLayer;