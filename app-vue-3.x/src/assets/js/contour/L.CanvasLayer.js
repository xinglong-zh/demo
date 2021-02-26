import { DomUtil } from 'leaflet';
import { Point } from 'leaflet';
import { Browser } from 'leaflet';
import { Layer } from 'leaflet';
import { Util } from 'leaflet';
/**
 * 自定义class  , 继承自 L.Class 
 *  源链接 https://github.com/linghuam/ocean-weather/blob/master/src/js/leaflet.canvasLayer.js
 */
export var CanvasLayer = Layer.extend({
    options:{
        // 定义默认的属性
    },
    /**
     * @override
     * @param {*} url 
     * @param {*} options 
     */
    initialize:function(options){
        Util.setOptions(this,options);
        this._canvas = null;  // 操作使用的canvas
        this._map = null; // 地图的map 对象
        this._frame =null ; // 当前帧
        this._delegate = null ; // 代表 

    },
    /**
     * 生命周期 , layer add
     * @param {Map}  map leaflet 实例
     */
    onAdd:function(map){
        this._map = map; // 共享 Layer 的map
        this._canvas = DomUtil.create('canvas','leaflet-layer');
        // 设置 canvas 的宽高 ,和map的size等大
        let size = this._map.getSize();
        this._canvas.width = size.x;
        this._canvas.height = size.y;

        // 开启css3 的动画支持
        let animated = this._map.options.zoomAnimation && Browser.any3d; //true for all browsers supporting CSS transforms.
        DomUtil.addClass(this._canvas,`leaflet-zoom-${animated?'animated':'hide'}`);  // 提升性能? FIXME:// 


        map._panes.overlayPane.appendChild(this._canvas);  // canvas 加入 overlay 层
        map.on(this.getEvents(),this);
        console.log('canvas-layer',this._canvas);


    }, 
    onRemove:function(){
        // 移除canvas
        this._map.getPanes().overlayPane.removeChild(this._canvas);


        this._map.off(this.getEvents(),this);
        this._canvas =null ; // 通知垃圾回收
    },
    /**
     * @override 复写layer 的方法
     * This optional method should return an object like { viewreset: this._reset } for addEventListener. T
     * he event handlers in this object will be automatically added and removed from the map with your layer.
     */
    getEvents:function(){
      let events ={
          resize:this._onLayerDidResize,
          moveend:this._onLayerDidMove,
      }

      // 是否支持动画css transform
      if(this._map.options.zoomAnimation&&Browser.any3d){
        //   events.zoomanim = this._animateZoom;  FIXME: offset 的值怎么计算 
      }

      return events;
    },
    beforeAdd:function(){

    },
    /**
     * map  resize 事件的响应
     * @param {import('leaflet').ResizeEvent} resizeEvent 
     */
    _onLayerDidResize:function(resizeEvent){
        // resize canvas  
        let {x,y}  = resizeEvent.newSize;
        this._canvas.width = x;
        this._canvas.height = y;
    },
    /**
     *  moveend 事件的响应
     * setPosition
     * Sets the position of el to coordinates specified by position, using CSS translate or top/left positioning depending on the browser (used by Leaflet internally to position its layers).
     */
    _onLayerDidMove:function(){
        // 获取当前容器的左上角相对于 坐标原点的偏移
        let topLeft = this._map.containerPointToLayerPoint(new Point(0,0));
        DomUtil.setPosition(this._canvas,topLeft);
        // 然后开始重新绘图

        this.drawLayer();


    },
    addTo:function(map){
        map.addLayer(this);
        return this;
    },
    /**
     * 使用css动画 , 提升性能
     * @param {*} e  事件
     * a set of coefficients a, b, c, d for transforming a point of a form (x, y) into (a*x + b, c*y + d) and doing the reverse. Used by Leaflet in its projections code.
     * setTransform(<HTMLElement> el, <Point> offset, <Number> scale?)
     *  Resets the 3D CSS transform of el so it is translated by offset pixels and optionally scaled by scale. Does not have an effect if the browser doesn't support 3D CSS transforms.
     * 
     *  FIXME: 如何计算offset 的值.
     */
    _animateZoom:function(){

    },
    // 事件处理, 私有方法

    // 公有方法,重新绘制
    drawLayer(){
        // 获取当前的ctx , 用于绘制
        let ctx = this._canvas.getContext('2d'); 
        ctx.fillStyle = 'rgba(66,133,244,0.5)';
        ctx.fillRect(0,0,this._canvas.width,this._canvas.height);
    }

})





export function canvasLayer(options){
    return new CanvasLayer(options);
}