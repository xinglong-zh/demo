//单纯等值线的显示图层，通过url加载geojson，显示等值线，附加标值。
// ContourLayer.js是从格点场中追踪等值线，然后显示。

// import * as L from 'leaflet';

import { projectPatternOnPointPath } from './polyline-decorator/patternUtils';

var ContourLayerExt = L.GeoJSON.extend({
    options: {
        levelProp: 'level',
        minZoom: 0,
        smooth: 'quadratic',
        weight: 1,
        noClip: true,
        ccopy: false,
        worldCopyJump:false, // leaflet 效果是setPosition , 此处效果是copy 
        className: '',
        symbol: {
            font: '15px bold sans-serif',
            textAlign: 'center',
            textBaseline: 'middle',
            stroke: true,
            weight: 3,
            color: 'white',
            pattern: { offset: 200, repeat: 618, endOffset: 200 }
        }
    },
    initialize: function (options) {
        this._renderer = L.canvas({ className: 'contour-canvas ' + this.options.className });
        L.GeoJSON.prototype.initialize.call(this, null, L.extend({ renderer: this._renderer }, options));
        this.setUrl(this.options.url);
    },
    setUrl: function (url) {
        this.options.url = url;
        if (url == null)
            return this.setData(null);

        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "json";
        xhr.onload = function () {
            if (this.status == 200) {
                self.setData(this.response);
            } else if (this.status >= 400) {
                self.setData(null);
            }
        }
        xhr.onerror = function () {
            console.error('network error!');
            self.setData(null);
        }
        try {
            xhr.send();
        } catch (e) {
            console.error(e);
            self.setData(null);
        }
    },
    setData: function (fc) {
        this.clearLayers(); // 先清除layers
        if (fc) {
            this._feature = fc; // 存放最原始的feature , 方便后续计算
            if (this.options.ccopy)
                fc = this._ccopy(fc);
            this.addData(fc);
            this.nextUpdateMarkers();
            this.fire("updated")
        } else {
            this.fire("nothing");
        }
    },
    //moveend 触发updateMarkers
    onAdd: function (map) {
        this._renderer.addTo(map);
        L.GeoJSON.prototype.onAdd.call(this, map);
        map.on('moveend', this.nextUpdateMarkers, this);
    },

    onRemove: function () {
        this._map.off('moveend', this.nextUpdateMarkers, this);
        this._map.removeLayer(this._renderer);
    },
    nextUpdateMarkers: function () {
        L.Util.requestAnimFrame(this.updateMarkers, this);
        // 这里还需要一个功能 ,feature的拷贝和删除工作
        if(this.options.worldCopyJump){
            L.Util.requestAnimFrame(this._nextUpdateFeatures, this);
        }
       
    },
    // 更新等高线的标值
    updateMarkers: function () {
        // 移除旧marker
        var oldMarkers = [];
        for (let i in this._layers) {
            if (this._layers[i]._class == 'contour-marker') {
                oldMarkers.push(this._layers[i]);
            }
        }
        for (let i in oldMarkers) {
            this.removeLayer(oldMarkers[i])
        }
        // 重新添加marker
        for (var i in this._layers) {
            this._decorate(this._layers[i]);
        }
    },
    _decorate: function (polyline) {
        var map = polyline._renderer._map;
        var symbol = this.options.symbol;
        var self = this;
        (this.options.smooth == "quadratic" ? polyline._mps : polyline._parts).forEach(function (pts) {
            var markers = projectPatternOnPointPath(pts, symbol.pattern)
            markers.forEach(function (marker) {
                var latLng = map.layerPointToLatLng(marker.pt)
                marker = L.textMarker(latLng, L.extend({ fillColor: polyline.options.color }, symbol, {
                    renderer: self._renderer,
                    // rotate: marker.heading,
                    text: polyline.feature.properties[self.options.levelProp]
                }));
                marker._class = 'contour-marker';
                self.addLayer(marker);
            })
        });
    },
    /**
     * 不必拼接，保证平滑绘制时不丢失两端的值就可以了
     * @param fc
     * @return {*}
     * @private
     */
    _ccopy: function (fc) {
        //右侧的那份等值线
        const cp = JSON.parse(JSON.stringify(fc));
        //调整经度 +360
        for (let feature of cp.features) {
            for (let lngLat of feature.geometry.coordinates) {
                lngLat[0] += 360;
            }
        }
        fc.features.splice(fc.features.length, 0, ...cp.features);
        return fc;
    },
    // /**
    //  * 在右侧复制一份等值线，并拼接左尾等于右头的等值线
    //  *
    //  * 有头头、尾尾、尾头、头尾，4种情况，不好处理，放弃数据拼接；只要绘制出的效果是连续的就行了。
    //  * @param fc
    //  * @private
    //  */
    // _ccopy:function (fc) {
    //     //右侧的那份等值线
    //     const cp = JSON.parse(JSON.stringify(fc));
    //     //首点经纬度到feature的映射字典
    //     const head_feature = {};
    //     //调整经度 +360，为字典添加内容
    //     for(let feature of cp.features){
    //         for(let lngLat of feature.geometry.coordinates){
    //             lngLat[0] += 360;
    //         }
    //         head_feature[JSON.stringify(feature.geometry.coordinates[0])] = feature;
    //     }
    //
    //     //拼接
    //     //被拼接的features，来自cp，最终需要从cp中移除
    //     const splicedFeatures = [];
    //     for(let feature of fc.features){
    //         //用左尾当右头，查找右侧的等值线
    //         let coords = feature.geometry.coordinates;
    //         let tail = coords[coords.length-1];
    //         let cpf = head_feature[JSON.stringify(tail)];
    //         if(cpf){
    //             coords.splice(-1,1,...cpf.geometry.coordinates)
    //             splicedFeatures.push(cpf);
    //         }
    //     }
    //     //移除被拼接的等值线
    //     for (let i = cp.features.length-1; i>=0; i--) {
    //         let f = cp.features[i];
    //         for (let j = splicedFeatures.length-1; j>=0; j--) {
    //             if(f == splicedFeatures[j]){
    //                 cp.features.splice(i,1);
    //                 splicedFeatures.splice(j,1);
    //                 break;
    //             }
    //         }
    //     }
    //     fc.features.splice(fc.features.length, 0, ...cp.features);
    //     return fc;
    // },
    /**
     * 拷贝等高线和移除 , 目的是使等高先连续 ,类似于tile的无限拖动效果 , layers 经度 + - 360
     * 计算左右和0-360 的差值 . 然后开始复制
     */
    _nextUpdateFeatures: function () {
        let feature = JSON.parse(JSON.stringify(this._feature));
        let bounds = this._map.getBounds() // 当前bounds的值 
        // 计算左右两侧需要添加或移除的feature
        let stepR = Math.ceil((bounds._northEast.lng) / 360);  // 向上取整
        let stepL = Math.floor((bounds._southWest.lng) / 360); // 向下取整
        this.clearLayers();  
        // console.log(bounds, stepL, stepR);
        for (let i = stepL - 1; i <= stepR; i++) {
            let featureTemp = JSON.parse(JSON.stringify(feature));
            for (let fc of featureTemp.features) {
                for (let latLng of fc.geometry.coordinates) {
                    latLng[0] += 360 * i;
                }
            }
            // 两者相差不太多  , 暂时先用 requestAnimFrame
            L.Util.requestAnimFrame(this.addData(featureTemp));
            // this.addData(featureTemp);
        }
    },
});
export default ContourLayerExt;