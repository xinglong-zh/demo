import GlLayer from './gl-shaded/ShadedLayer.js'
import GridLayer from './2d-grid/GridLayer.js';
import WindLayer from "./gl-shaded/WindLayer";
import ContourLayer from "./2d-contour/ContourLayer"
import GlParticles from "./gl-particles/GlParticles";
import * as L from 'leaflet';

export default L.LayerGroup.extend({
    /*options:{
        padding:0.1,
        ratio: 1, //绘制时的插值率，datasource's deg/px  /  map's deg/px，越大渲染越平滑，请求的数据越小且越失真
        //低带宽或手机端可以使用2、4
        // color: '',
        // meta: ,数据源请求参数
        marker: {
            bounds: [[-15,-6],[15,6]],
            font: '12px sans-serif',
            minZoom: 10,
            visible: function (feature) {
                return true;
            }
        }
    },*/
    initialize:function (options) {
        L.setOptions(this,options);
        this._glLayerOptions = this.options;
        this.glLayer = this.options.type == 'particles' ? new GlParticles(this._glLayerOptions):
            this.options.type == "wind" ? new WindLayer(this._glLayerOptions): new GlLayer(this._glLayerOptions);
        this._layers={ glLayer: this.glLayer };
        this.bindMarker(this.options);
        this.bindContour(this.options);
    },
    bindMarker:function(options){
        if(!options.marker)
            return;
        this._markerOptions = options.marker;
        if((options.type == "wind"||options.type == 'particles')&&!this._markerOptions.type){
            this._markerOptions.type = 'barb';
            // this._markerOptions.tune = [-4,12];
            // this._markerOptions.bounds = [[-24,-24],[24,24]]
        }
        this.markerLayer = new GridLayer(this._markerOptions);
        this.bindGlLayer(this.markerLayer,this.__setData);
        this._layers.markerLayer = this.markerLayer;
    },
    bindContour:function(options){
        if(!options.contour)
            return;
        this._contourOptions = options.contour;
        if((options.type == "wind"||options.type == 'particles')&&!this._contourOptions.levelProp){
            this._contourOptions.levelProp = 's'
        }
        this.contourLayer = new ContourLayer(this._contourOptions);
        this.bindGlLayer(this.contourLayer,this.__setData2);
        this._layers.contourLayer = this.contourLayer;
    },
    bindGlLayer:function(layer,fn){
        layer._glLayer&&layer._glLayer.off('updated',fn,layer);
        layer._glLayer = this.glLayer;
        this.glLayer.on('updated',fn,layer);
    },
    //以FeatureList<Feature<Point>>组织数据
    __setData:function () {
        this.clearLayers();
        if(this._glLayer._map.getZoom()>=this.options.minZoom) {
            this.setData(this._glLayer.getGrid(this.getPpc()));
        }
    },
    //以矩阵组织格点数据
    __setData2:function () {
        this.clearLayers();
        if(this._glLayer._map.getZoom()>=this.options.minZoom) {
            this.setData(this._glLayer.getGrid(this.getPpc(),true));
        }
    },
    /**
     * 获取指定经纬度的格点值（双线性插值）
     * @param latlng {L.LatLng}
     * @returns {*} 例如：{val:0.1} 或者 {u:1.0,v:1.0,s:1.414,d:225}
     */
    getVal:function (latlng) {
        return this.glLayer.getVal(latlng);
    },
    /**
     * 设置调色板
     * @param {Color} color
     */
    setColor:function (color) {
        this.glLayer.setColor(color);
    },
    /**
     * 设置图层数据源参数
     * @param {Meta|Meta3} meta
     */
    setMeta:function (meta) {
        this.glLayer.setMeta(meta);
    },
    /**
     * 设置marker的显隐过滤条件 
     * @param {Function} visibleFn 例如：function(feature){return feature.properties.val>0;}
     */
    setMarkerVisibleFn:function (visibleFn) {
        this.markerLayer.setVisible(visibleFn);
    },
    /**
     * 设置图层的CSS#zIndex，控制图层的叠加顺序
     * @param layer {String} 图层名，marker|contour
     * @param zIndex {Number}
     */
    setZIndex:function (layer, zIndex) {
        var layer = this._layers[layer+'Layer'];
        var canvas = layer._container||layer._renderer._container;
        if(canvas) {
            canvas.style.zIndex = zIndex;
        }
    },
     /**
     * 设置填色过滤条件
     * @param filter {String} 例如: "val>=10.0" 或者 "val>10.0&&val<=50.0" 或者 "val<-10.0||val>30.0"
     */
    setFilter: function(filter){
        this.glLayer.setFilter(filter);
    },
    /**
     * 获取指定范围内的格点值
     * @param latLngBounds {L.LatLngBounds|[[],[]]}
     * @param prop 属性名，取分量时传递此参数例如风：'u'|'v'|'s'
     * @returns {{data, res, bounds}}
     */
    subGrid:function(latLngBounds,prop){
        return this.glLayer.subGrid(latLngBounds,prop);
    }
})