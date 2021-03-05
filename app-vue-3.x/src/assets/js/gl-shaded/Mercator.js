export var Mercator={
    /**
     * 任一投影点对应的经纬度
     * @param point
     * @param ppd pixel per degree
     * @returns {*}
     */
    point2latlng:function (point,ppd) {
        var R = this.getR(ppd);
        return L.latLng(
            Math.atan(Math.pow(Math.E,point.y/R)) * 360/Math.PI - 90,
            point.x/ppd
        );
    },
    /**
     * 以经纬度(0,0)点的投影为中心（平面直角坐标系），任一经纬度对应的投影位置
     * @param latlng
     * @param ppd pixel per degree
     * @returns {*}
     */
    latlng2point:function (latlng,ppd) {
        var R = this.getR(ppd);
        return L.point(
            latlng.lng * ppd,
            R * Math.log( Math.tan(Math.PI/4 + latlng.lat*Math.PI/360) )
            );
    },
    /**
     * 球心到幕布的距离
     * @param ppd pixel per degree
     * @returns {number}
     */
    getR:function(ppd){
        return 180/Math.PI * ppd;
    }
};