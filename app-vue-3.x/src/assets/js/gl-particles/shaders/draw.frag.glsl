precision highp float;

const float PI = 3.141592653589793;
uniform vec4 uLngLatBounds;//等经纬度的tex的经纬度范围[西,南,东,北]
uniform float uRes; //等经纬度的tex的分辨率
uniform sampler2D sLngLatTex; //等经纬度的tex
uniform vec2 uScale;

uniform sampler2D sPltTex;//调色板
uniform vec3 uPltMinMax; //x min ,y max, z (max-min)

uniform int uEPSG;
uniform float uPpd; //视窗分辨率（经度） pixel per degree
uniform vec4 uBounds;//视窗地图xOy像素范围 [左下右上]
varying vec2 vPos;//(0,0)~(1,1)

vec2 pointToLngLat(vec2 point, float ppd) {
    if(uEPSG==3857){
        float R = 180.0/PI * ppd;
        return vec2(point.x/ppd , atan(exp(point.y / R)) * 360.0/PI - 90.0 );
    }else{
        return point/ppd;
    }
}

vec2 getPxLngLat(){
    vec2 point = vPos*(uBounds.zw-uBounds.xy)+uBounds.xy;
    vec2 lngLat = pointToLngLat(point,uPpd);
    return lngLat;
}
float b2f(float m0, float m1);
float b2f(vec2 v){
    return b2f(v.x,v.y);
}
vec2 getVal(vec2 p){
    if(p.x<0.||p.y<0.||p.x>=1.||p.y>=1.)
        return vec2(32767.,32767.);
    vec4 rawVal = texture2D(sLngLatTex,p*uScale)*255.;
    return vec2(b2f(rawVal.xy),b2f(rawVal.zw));
}
vec4 getColor(vec2 uv){
    //无效值设置为最大值32767
    if(uv.x>32766.||uv.y>32766.)
        return vec4(0,0,0,0);
    float val = length(uv)/10.;
    return texture2D(sPltTex,vec2((val-uPltMinMax.x)/uPltMinMax.z,0.5));
}
vec2 biInterp(vec2 v00,vec2 v01,vec2 v10,vec2 v11,vec2 r){
    if(v00.x>32000.||v01.x>32000.||v10.x>32000.||v11.x>32000.||
    v00.y>32000.||v01.y>32000.||v10.y>32000.||v11.y>32000.)
        return vec2(32767.,32767.);
    return mix(mix(v00,v01,r.x),mix(v10,v11,r.x),r.y);
}

void main() {
    vec2 size = uLngLatBounds.zw-uLngLatBounds.xy;//等经纬tex的有效区经纬度大小，deg
    vec2 pxLngLat = getPxLngLat();
    vec2 offset = (pxLngLat - uLngLatBounds.xy); //vPx的偏移量，deg
    if(offset.x<0.||offset.y<0.||offset.x>size.x||offset.y>size.y)
        gl_FragColor = vec4(0,0,0,0);
    else{
       vec2 r = fract(offset/vec2(uRes,uRes)); //Position ratio
       vec2 p00 = offset + vec2(-r.x*uRes,-r.y*uRes);
       vec2 p01 = offset + vec2((1.-r.x)*uRes,-r.y*uRes);
       vec2 p10 = offset + vec2(-r.x*uRes,(1.-r.y)*uRes);
       vec2 p11 = offset + vec2((1.-r.x)*uRes,(1.-r.y)*uRes);
       vec2 uv = biInterp(
           getVal(p00/size),
           getVal(p01/size),
           getVal(p10/size),
           getVal(p11/size),
           r
       );
       gl_FragColor = getColor(uv);
    }
}

//uint8 转 int16
float b2f(float m0, float m1){
    //补码
    float com = m0*256.+m1;
    if(com<32768.)//2^15
        return com;
    else{//补码的补码是原码
        //-1 * (32767-(com-32768) + 1)
        return com - 65536.0;
    }
}