//双线性插值
//1--2
//4--3

import * as L from 'leaflet'
export function bilinear(p1,p2,p3,p4,ratio){
    return (p1*(1-ratio.x)+p2*ratio.x) * (1-ratio.y) +
        (p4*(1-ratio.x)+p3*ratio.x) * ratio.y;
}
//大于等于a的最小的pow(2,n)
export function pow2n(a) {
    return 1 << Math.floor(Math.log(a + a - 1)/Math.LN2)
}
setTimeout(function () {
    let barb = document.createElement('i');
    barb.style="position:absolute;z-index:-1;font-family:'barb';";
    barb.innerText='\u0001';
    document.body.insertBefore(barb,document.body.firstChild);
    let pph = document.createElement('i');
    pph.style="position:absolute;z-index:-1;font-family:'pph';";
    pph.innerText='\ue75b';
    document.body.insertBefore(pph,document.body.firstChild);
});
export function getBarb(speed){
    var code;
    if(speed<0||speed>=97)
        return '';
    if(speed < 1)
        code = 0x7f;
    else{ //>=1 有规律
        code = Math.floor((speed+1)/2) + 47;
        if(speed>=79)
            code--;
    }
    return eval('"\\u00'+ code.toString(16) +'"');
}

L.LatLng.prototype.offset = function (other) {
    return L.latLng(this.lat - other.lat, this.lng - other.lng);
}
L.LatLng.div = function (latLng, deg) {
    return L.point(latLng.lng / deg, latLng.lat / deg);
}
L.Point.mul = function (point, deg) {
    return L.latLng(point.y * deg, point.x * deg);
}
L.LatLng.fromJSON = function (latLng) {
    return L.latLng(latLng.lat,latLng.lng);
}
L.Point.fromJSON = function (point) {
    return L.point(point.x,point.y);
}
L.LatLngBounds.fromJSON=function (latLngBounds) {
    return L.latLngBounds(
        L.LatLng.fromJSON(latLngBounds._southWest),
        L.LatLng.fromJSON(latLngBounds._northEast)
    )
}
L.Bounds.fromJSON=function(bounds){
    return L.bounds(
        L.Point.fromJSON(bounds.min),
        L.Point.fromJSON(bounds.max)
    )
}