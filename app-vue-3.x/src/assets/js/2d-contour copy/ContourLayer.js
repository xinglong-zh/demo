// import isobands from './node_modules/@turf/isobands';
// import isolines from './node_modules/@turf/isolines';
// import {contours} from './node_modules/d3-contour'
import tracingContourLines from './Contour.js';
import { projectPatternOnPointPath} from './polyline-decorator/patternUtils.js';
var ContourLayer = L.GeoJSON.extend({
    options:{
        levelProp:'val',
        minZoom: 0,
        smooth: 'quadratic',
        symbol:{
            font: '15px bold sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
            stroke: true,
            weight: 3,
            color: 'white',
            pattern:{offset:200,repeat:618,endOffset:200}
        },
        className: ''
    },
    initialize:function (options) {
        this._renderer = L.canvas({className:'contour-canvas ' + this.options.className});
        L.GeoJSON.prototype.initialize.call(this,null,L.extend({renderer:this._renderer},options));
        this.on('layeradd',function (e) {
            if(e.layer instanceof L.Polyline){
                //转完投影后成为一条线的，移除
                if(e.layer.feature.properties.Type=='Close' && (
                    e.layer._pxBounds.max.x - e.layer._pxBounds.min.x < 3||
                    e.layer._pxBounds.max.y - e.layer._pxBounds.min.y < 3)){
                    console.debug("移除：",e.layer)
                    this.removeLayer(e.layer);
                    return;
                }
                this._decorate(e.layer);
            }
        },this);
    },
    getPpc:function () {
        return 20;
    },
    setData:function (grid) {
        this._data=grid;
        var levels = this.options.levels||this.fakeLevels();
        var fc = this.contour(grid,levels,{zProperty:this.options.levelProp});
        // var fc = isolines(geojson,levels,{zProperty:this.options.levelProp});
        this.addData(fc);
    },
    contour:function(grid,levels,props){
        var undefData = 99999;
        var data = grid.data, S0 = [];
        for (let i = 0; i < data.length; i++) {
            var row = data[i];
            S0[i] = [];
            for (let j = 0; j < row.length; j++) {
                S0[i][j] = row[j][props.zProperty];
                if(isNaN(S0[i][j]))
                    S0[i][j] = undefData;
            }
        }
        var bounds = grid.bounds,res = grid.res;
        var X =[],Y =[];
        for (let lat = bounds.getSouth(); lat <=bounds.getNorth() ; lat+=res) {
            Y.push(lat);
        }
        for (let lng = bounds.getWest(); lng <= bounds.getEast(); lng+=res) {
            X.push(lng);
        }
        var lines = tracingContourLines(S0,X,Y,levels,undefData);
        var geojson = {
            "type": "FeatureCollection",
            "features": []
        };
        for (let i = 0; i < lines.length; i++) {
            var line = lines[i];
            var coords=[],val={};
            val[props.zProperty] = line.Value;
            val.Type = line.Type;
            var ps = line.PointList;
            for (let j = 0; j < ps.length; j++) {
                coords.push([ps[j].X,ps[j].Y]);
            }
            geojson.features.push({
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": coords
                },
                "properties": val
            });
        }
        return geojson;
    },
    _decorate:function(polyline){
        var map = polyline._renderer._map;
        var symbol = this.options.symbol;
        var self = this;
        (this.options.smooth=="quadratic" ? polyline._mps : polyline._parts).forEach(function (pts) {
            var markers = projectPatternOnPointPath(pts,symbol.pattern)
            markers.forEach(function (marker) {
                var latLng = map.layerPointToLatLng(marker.pt)
                marker = L.textMarker(latLng,L.extend({fillColor:polyline.options.color},symbol,{
                    renderer:self._renderer,
                    // rotate: marker.heading,
                    text: polyline.feature.properties[self.options.levelProp]
                }));
                /*marker = L.marker(latLng,{
                    icon:L.divIcon({html:polyline.feature.properties[self.options.levelProp]})
                });*/
                self.addLayer(marker);
            })
        });
    },
    fakeLevels:function () {
        var levels;
        if(!this.options.levels){
            var min = Infinity;
            var max = -Infinity;
            var data = this._data.data
            for (let i = 0; i < data.length; i++) {
                for (let j = 0; j < data[i].length; j++) {
                    var level = data[i][j][this.options.levelProp];
                    if(!isNaN(level)) {
                        if(level<min) min=level;
                        if(level>max) max=level;
                    }
                }
            }
            levels = [];
            var step = (max - min)/10;
            for (var i=0;i<10;i++){
                levels[i]=min + step * i;
            }
        }
        return levels;
    }
});
export default ContourLayer;