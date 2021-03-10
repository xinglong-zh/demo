//直角坐标系直接换算投影位置
precision highp float;

const float PI = 3.141592653589793;
uniform vec4 uLngLatBounds;//等经纬度的tex的经纬度范围[西,南,东,北]
uniform float uRes; //等经纬度的tex的分辨率
uniform sampler2D sLngLatTex; //等经纬度的tex
uniform vec2 uScale;

uniform sampler2D sPltTex;//调色板
uniform vec3 uPltMinMax; //x min ,y max, z (max-min)

uniform sampler2D uLastTex; // 上次的纹理使用
uniform vec4 uMainTexRatio ; // 主纹理的使用比例  [0.0,0.0,0.0,0.0] -[1.0,1.0,1.0,1.0] 向量和向量的点击  ,上次纹理  1- ratio

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

float b2f(float m0, float m1, float m2, float m3);
float b2f(vec4 b){
    return b2f(b.z,b.w,b.x,b.y);//小端
}
float getVal(vec2 p){
    if(p.x<0.||p.y<0.||p.x>=1.||p.y>=1.)
        return 32767.;
    // vec4 rawVal = texture2D(sLngLatTex,p*uScale);  // 原始代码
    // 每次取值的时候加上delta ,最后一次不加 todo
    vec4 rawVal = uMainTexRatio*texture2D(sLngLatTex,p*uScale)+(vec4(1.0,1.0,1.0,1.0)-uMainTexRatio)*texture2D(uLastTex,p*uScale);
    return b2f(rawVal*15.);
}
bool where(float val);

vec4 getColor(float f){
    //无效值设置为最大值32767
    if(f>32766.||!where(f/10.))
        return vec4(0,0,0,0);
    float val = f/10.;
    return texture2D(sPltTex,vec2((val-uPltMinMax.x)/uPltMinMax.z,0.5));
    // texture2D(u_texture, texcoord);  提取纹理数据 (纹理 , 坐标);
}
// 差值算法
float cubicHermite(float A, float B, float C, float D, float t) {
    float max = 32000.;
    if(A>max||B>max||C>max||D>max)
        return 32767.;
    float a = -A * 0.5 + (3.0*B) * 0.5 - (3.0*C) * 0.5 + D * 0.5;
    float b = A - (5.0*B) * 0.5 + 2.0 * C - D * 0.5;
    float c = -A * 0.5 + C * 0.5;
    float d = B;
    return a*t*t*t + b*t*t + c*t + d;
}
void main() {
    vec2 size = uLngLatBounds.zw-uLngLatBounds.xy;//等经纬tex的有效区经纬度大小，deg
    vec2 pxLngLat = getPxLngLat();
    vec2 offset = (pxLngLat - uLngLatBounds.xy); //vPx的偏移量，deg
    if(offset.x<0.||offset.y<0.||offset.x>size.x||offset.y>size.y)
        gl_FragColor = vec4(0,0,0,0);
    else{
        vec2 r = fract(offset/vec2(uRes,uRes)); //Position ratio

        vec2 p11 = offset + vec2(-r.x*uRes,-r.y*uRes);
        vec2 p12 = offset + vec2((1.-r.x)*uRes,-r.y*uRes);
        vec2 p10 = p11 - vec2(uRes,0);
        vec2 p13 = p12 + vec2(uRes,0);
        vec2 p21 = offset + vec2(-r.x*uRes,(1.-r.y)*uRes);
        vec2 p22 = offset + vec2((1.-r.x)*uRes,(1.-r.y)*uRes);
        vec2 p20 = p21 - vec2(uRes,0);
        vec2 p23 = p22 + vec2(uRes,0);
        vec2 p00 = p10 - vec2(0,uRes);
        vec2 p01 = p11 - vec2(0,uRes);
        vec2 p02 = p12 - vec2(0,uRes);
        vec2 p03 = p13 - vec2(0,uRes);
        vec2 p30 = p20 + vec2(0,uRes);
        vec2 p31 = p21 + vec2(0,uRes);
        vec2 p32 = p22 + vec2(0,uRes);
        vec2 p33 = p23 + vec2(0,uRes);
        // 数据差值
        float v = cubicHermite(
            cubicHermite(getVal(p00/size),getVal(p01/size),getVal(p02/size),getVal(p03/size),r.x),
            cubicHermite(getVal(p10/size),getVal(p11/size),getVal(p12/size),getVal(p13/size),r.x),
            cubicHermite(getVal(p20/size),getVal(p21/size),getVal(p22/size),getVal(p23/size),r.x),
            cubicHermite(getVal(p30/size),getVal(p31/size),getVal(p32/size),getVal(p33/size),r.x),
            r.y
        );
        //vec4 rawVal = texture2D(sLngLatTex,offset/size);
        // 叠加渐变纹理
        // sLngLatTex  = sLngLatTex + deltaTex;
        gl_FragColor = getColor(v);
    }
}
//参考 uint4 转 int16
float b2f(float m0, float m1, float m2, float m3){
    //补码
    float com = m0*16.*16.*16.+m1*16.*16.+m2*16.+m3;
    if(com<32768.)//2^15
        return com;
    else{//补码的补码是原码
        //-1 * (32767-(com-32768) + 1)
        return com - 65536.0;
    }
}