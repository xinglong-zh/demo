import {getBarb} from "../util";
var mobile = L.Browser.mobile;
var GridLayer = L.GeoJSON.extend({
    options:{
        bounds: mobile?[[-30,-12],[30,12]]:[[-15,-6],[15,6]],
        minZoom: 10,
        stroke: false,
        weight: 3,
        className: '',
        /*color: 'white',
        fillColor: 'black',
        background: {
            color: 'white',
            shape: 'roundRect'
        },*/
        style:function(feature){
          return {};
        },
        visible: function (feature) {
            return true;//降水feature.properties.val!==0;
        },
        filter:function (feature) {
            return this.options.type=='barb'||!isNaN(feature.properties.val)&&this.options.visible(feature)
        },
        pointToLayer:function (feature, latlng) {
            return L.textMarker(latlng,L.extend({
                text: this._getText(feature),
                rotate: this._getRotate(feature),
                font: latlng.lat>=0?this._getFont(feature):this._getFont(feature).replace(' barb',' s-barb'),
                textAlign: this.options.type=='barb'?(latlng.lat>=0?'left':'right'):'center',
                textBaseline: this.options.type=='barb'?'bottom':'middle',
                tune: this.options.tune,
                bounds:this.options.bounds,
                renderer: this._renderer,
                stroke: this.options.stroke,
                weight: this.options.weight,
                fillColor: this.options.fillColor,
                color: this.options.color||this._getColor(feature),
                background: !this.options.stroke&&(this.options.background||this._getBackGround(feature))
            },this.options.style(feature)));
        }
    },
    initialize:function (options) {
        L.GeoJSON.prototype.initialize.call(this,null,options);
        this.options.pointToLayer=L.bind(this.options.pointToLayer,this);
        this.options.filter=L.bind(this.options.filter,this);
        this.options.visible=L.bind(this.options.visible,this);
        this._renderer = L.canvas({className: 'grid-canvas '+ this.options.className});
    },
    onRemove:function () {
      L.GeoJSON.prototype.onRemove.call(this,this._map);
      //this._renderer.remove();
        L.Util.requestAnimFrame(this._renderer.remove, this._renderer);
    },
    setVisible:function(visibleFn){
        this.options.visible=visibleFn;
        if(this._data){
            this.clearLayers();
            this.setData(this._data);
        }
    },
    _getColor:function (feature) {
        return this._glLayer._color.colorInvert(feature.properties.val,1);
    },
    _getText:function(feature){
        return this.options.text?this.options.text(feature):
            this.options.type == 'barb'? getBarb(feature.properties.s) : feature.properties.val;
    },
    _getRotate:function(feature){
        return this.options.type=='barb' ? feature.properties.d * Math.PI/180 : 0 ;
    },
    _getFont:function(feature){
        return this.options.font||(
            this.options.type=='barb'? '24px barb':
            mobile?'24px sans-serif':'12px sans-serif'
        );
    },
    _getBackGround:function (feature) {
        if('barb'==this.options.type)
            return false;
        return {
            color: this._glLayer._color.color(feature.properties.val,1),
            shape: 'roundRect'
        }
    },
    /**
     * 抽稀，pixel per cell
     * @returns {number}
     */
    getPpc:function(){
        var markerWidth = [this.options.bounds[1][0] - this.options.bounds[0][0]];
        return markerWidth * 1.2;
    },
    setData:function (geojson) {
        this._data=geojson;
        this.addData(geojson);
    }
});

export default GridLayer;