export var Catalog = {
    origin: L.latLng(-90, -180),
    tileSkip: {
        getMaxZoom:function(dataRes) {
            var globalSize = this.getGlobalWidth(dataRes);
            var tileSize = this.getTileSize(dataRes);
            return Math.log(globalSize / tileSize) / Math.log(2) - 1;
        },
        getGlobalWidth:function(dataRes){
            return 360/dataRes;
        },
        getTileSize:function (dataRes) {
            var tileSize = this.getGlobalWidth(dataRes);
            while (tileSize % 2 == 0) {
                tileSize /= 2;
                if (tileSize > 128 && tileSize <= 256)
                    break;
            }
            return tileSize;
        }
    },
    tile256: {
        getMaxZoom:function(dataRes){
            var res = 360/this.getTileSize(dataRes);
            var n = -1;
            while(res > dataRes){
                res/=2;
                n+=1;
            }
            return n;
        },
        getTileSize:function (dataRes) {
            return 256;
        }
    },
    init: function(latLngBounds,dataRes){
        var iTile = this.whichITile(dataRes,latLngBounds);
        var tileSize = iTile.getTileSize(dataRes);
        var maxZoom = iTile.getMaxZoom(dataRes);
        var maxRes = 360/(2<<maxZoom)/tileSize;
        var validBounds = this.allValidBounds(latLngBounds,maxZoom);
        return {tileSize:tileSize,maxZoom:maxZoom,maxRes: maxRes,validBounds:validBounds};
    },
    allValidBounds: function(latLngBounds,maxZoom){
        var validBounds = {};
        for (var z = 0; z <= maxZoom; z++) {
            validBounds[z] = this.getValidBounds(latLngBounds,z);
        }
        return validBounds;
    },
    //获取有效瓦片编号范围
    getValidBounds: function(latLngBounds,zoom){
        //瓦片的跨度
        var span = 360/(2<<zoom);
        var bounds = L.bounds(
            L.LatLng.div(latLngBounds.getSouthWest().offset(this.origin), span).floor(),
            L.LatLng.div(latLngBounds.getNorthEast().offset(this.origin), span).floor()
        )
        return bounds;
    },
    /**
     * 根据分辨率判断是否支持跳点切块
     */
    canSkip: function(dataRes,bounds){
        return this.canDivided(360,dataRes) //整除才能跳点
            && this.canDivided(bounds._southWest.lat,dataRes)
            && this.canDivided(bounds._southWest.lng,dataRes)
            && ( this.tileSkip.getTileSize(dataRes) <= 256 );
    },
    /**
     * 是否可以整除
     * @param {Number} dividend 被除数 
     * @param {Number} divisor 除数
     */
    canDivided: function(dividend,divisor){
        return Math.round(dividend/divisor) * 1e6 == Math.round(dividend/divisor * 1e6);
    },
    whichITile:function(dataRes, bounds) {
        return this.canSkip(dataRes, bounds) ? this.tileSkip : this.tile256;
    }
    // getMeta:function () { return {bounds, res, dsi} } 外部实现
}
export function Meta(ele,fileName) {
    this.ele=ele;
    this.fileName = fileName;
}
export function Meta1(mdfs, ele,fileName) {
    this.mdfs = mdfs;
    this.ele=ele;
    this.fileName = fileName;
}

export function Meta2(dsi,ele,fileName) {
    this.dsi = dsi;
    this.ele=ele;
    this.fileName = fileName;
}

export function Meta3(tileUrl,metaUrl){
    this.tileUrl = tileUrl;
    this.metaUrl = metaUrl;
}