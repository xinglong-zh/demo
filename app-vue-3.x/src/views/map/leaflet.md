# 如何自定义 L.layer

+ The L.Map container has “map panes”, which are `<div>`s.

>(Map实例包含很多panes , 这些pane都是div元素)  

+ L.Layers are HTML elements inside a map pane .

>(L.layers 是在map.pane 中的HTML元素)

+ The map transforms all LatLngs to coordinates in the map’s CRS, and from that into absolute “pixel coordinates” (the origin of the CRS is the same as the origin of the pixel coordinates)

> map 中的坐标准换 , 通过crs : Latlng ==> coordinates ==> pixel coordinates  , 真正要使用的是 pixel coordinator

+ When the L.Map is ready (has a center LatLng and a zoom level), the absolute pixel coordinates of the top-left corner become the “pixel origin”

> 坐标位置 : **pixel origin** 处于当前的左上角.

+ Each L.Layer is offset from its map pane according to the pixel origin and the absolute pixel coordinates of the layer’s LatLngs

> layer在当前pane中的偏移(位置) , 通过计算 **pixel origin +  absolute pixel coordinates** (方式为上面的坐标转换)

+ The pixel origin is reset after each zoomend or viewreset event on the L.Map, and every L.Layer has to recalculate its position (if needed)

> pixel origin 的位置在 zoomend 和 wiewreset 之后会重新计算 ,  每个layer都需要重新计算自己的位置: (pixel origin + absolute coordinates)

+ The pixel origin is not reset when panning the map around; instead, the whole panes are repositioned.

> 平移map不会重新计算  poxel origin . 会计算整个panes .**(这里是平移画面连续的关键)** : 要触发位置的计算

## 如何计算一个位置

+ LatLng  ==> absolute pixel coordinate (inside Map crs) . `L.Map.project()` and `L.Map.unproject()` methods operate with these absolute pixel coordinates.
+ offset relative to the pixel origin =  absolute pixel coordinate of the pixel origin - absolute pixel origin .  (this offset applied to html element);

1. `L.Map.project()` and `L.Map.unproject()` methods operate with these absolute pixel coordinates.
2. `L.Map.latLngToLayerPoint()` and `L.Map.layerPointToLatLng()` work with the offset relative to the pixel origin

### 不同的计算方式

L.marker  reposition their icons
L.GridLayers : calculate **bounds of map**(in absolute pixel coordinates)  and  then calculate the list of tile coordinates to request.
vector Layers  transtorm latlng to pixels  and  drew the geometries using SVG or `canvas`.

### 实现思路

扩展 geojson
获取bounds  [89,1465] , [-89,-1230]   // 右上 , 左下
geojson的数据是在 -180 , 180 之间的
需要在移动的时候 ,进行clone() , 然后经纬加减360(环球)  , 参考gridLayer  , 由中心开始加载 ,   下一阵开始绘制, 优化性能.
是否需要扩展一个layers , 可以实现此功能 , 然后 同时继承 geojson 和 canvasLayer
