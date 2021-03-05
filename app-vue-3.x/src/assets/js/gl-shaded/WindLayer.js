import ShadedLayer from './ShadedLayer';
import fs from './shaders/fsi16hermite.wind.xOy.glsl';
import {bilinear} from '../util'
var WindLayer = ShadedLayer.extend({
    options:{
      typedArrayName:'Int32Array'
    },
    getFs:function(){
        return fs;
    },
    bilinear:function(p1,p2,p3,p4,ratio){
        var u = bilinear(p1.u,p2.u,p3.u,p4.u,ratio),
            v = bilinear(p1.v,p2.v,p3.v,p4.v,ratio);
        var sd = this.getSpeedAndDirection(u,v);
        return {u:u,v:v,s:sd.s,d:sd.d};
    },
    _getCell:function (cell) {
        if(cell.y<0||cell.y>=this.data.size.y||cell.x<0||cell.x>=this.data.size.x)
            return NaN;
        var dv = new DataView(this.data.abv.buffer),idx = (cell.y * this.data.size.x + cell.x)*4;
        var u = dv.getInt16(idx),v=dv.getInt16(idx+2),s,d;
        if(u==32767||v==32767)//缺测
            u=v=s=d=NaN;
        else{
            u/=10,v/=10;
            var sd = this.getSpeedAndDirection(u,v);
            s = sd.s, d = sd.d;
        }
        return {u:u,v:v,s:s,d:d};
    },
    getSpeedAndDirection:function(u,v){
        return {
            s : Math.sqrt(u*u+v*v),
            d : 180+Math.atan2(u,v)*180/Math.PI
        }
    },
    filter:function (val) {
        return !isNaN(val.s);
    }
});
export default WindLayer;