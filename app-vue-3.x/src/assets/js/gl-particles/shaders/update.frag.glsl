precision highp float;

const float PI = 3.141592653589793;
uniform vec4 uLngLatBounds;//等经纬度的tex的经纬度范围[西,南,东,北]
uniform float uRes; //等经纬度的tex的分辨率
uniform vec2 uScale;

uniform float u_speed_max;

uniform int uEPSG;
uniform float uPpd; //视窗分辨率（经度） pixel per degree
uniform vec4 uBounds;//视窗地图xOy像素范围 [左下右上]

uniform sampler2D u_particles;
uniform sampler2D sLngLatTex;
uniform float u_rand_seed;
uniform float u_speed_factor;
uniform float u_drop_rate;
uniform float u_drop_rate_bump;

varying vec2 v_tex_pos;
vec2 pointToLngLat(vec2 point, float ppd) {
    if(uEPSG==3857){
        float R = 180.0/PI * ppd;
        return vec2(point.x/ppd , atan(exp(point.y / R)) * 360.0/PI - 90.0 );
    }else{
        return point/ppd;
    }
}

vec2 getPosLngLat(vec2 pos){
    vec2 point = pos*(uBounds.zw-uBounds.xy)+uBounds.xy;
    vec2 lngLat = pointToLngLat(point,uPpd);
    return lngLat;
}

/*vec2 lngLatToPoint(vec2 lngLat, float ppd){
    if(uEPSG==3857){
        float R = 180.0/PI * ppd;
        return vec2( lngLat.x * ppd, R * log(tan(PI/4. + lngLat.y*PI/360.)) );
    }else{
        return lngLat * ppd;
    }
}
vec2 getLngLatPos(vec2 lngLat){
    vec2 point = lngLatToPoint(lngLat,uPpd);//地图绝对位置
    vec2 pos = (point - uBounds.xy)/(uBounds.zw-uBounds.xy);//视窗相对位置
    return pos;
}*/
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
vec2 biInterp(vec2 v00,vec2 v01,vec2 v10,vec2 v11,vec2 r){
    if(v00.x>32000.||v01.x>32000.||v10.x>32000.||v11.x>32000.||
    v00.y>32000.||v01.y>32000.||v10.y>32000.||v11.y>32000.)
        return vec2(32767.,32767.);
    return mix(mix(v00,v01,r.x),mix(v10,v11,r.x),r.y);
}

// pseudo-random generator
const vec3 rand_constants = vec3(12.9898, 78.233, 4375.85453);
float rand(const vec2 co) {
    float t = dot(rand_constants.xy, co);
    return fract(sin(t) * (rand_constants.z + t));
}

void main() {
    vec4 color = texture2D(u_particles, v_tex_pos);
    vec2 pos = vec2(
        color.r / 255.0 + color.b,
        color.g / 255.0 + color.a); // decode particle position from pixel RGBA
    vec2 lngLat = getPosLngLat(pos);

    vec2 offset = lngLat - uLngLatBounds.xy;
    vec2 size = uLngLatBounds.zw-uLngLatBounds.xy;

    float drop_rate = 1.0;
    if(offset.x<=0.||offset.y<=0.||offset.x>size.x||offset.y>size.y)
        drop_rate = 1.0;
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
       if(uv.x > 32000.)
           drop_rate = 1.0;
   /*    vec2 offsetLngLat = vec2(uv.x/cos(radians(lngLat.y)),uv.y)/(uPpd*uPpd * u_speed_factor*10.0);
       vec2 newLngLat = lngLat + offsetLngLat;
       pos = getLngLatPos(newLngLat);*/
       else{
           vec2 offset = uv/10.0/u_speed_max * 0.001 * u_speed_factor;
           if(uEPSG==4326){
               float distortion = cos(radians(lngLat.y));
               offset.x = offset.x / distortion;
           }
           //cross bounds
           pos = fract(1.0 + pos + offset);
            // drop rate is a chance a particle will restart at random position, to avoid degeneration
           drop_rate = u_drop_rate + length(uv) * u_drop_rate_bump;
       }
    }
    // a random seed to use for the particle drop
    vec2 seed = (pos + v_tex_pos) * u_rand_seed;
    float drop = step(1.0 - drop_rate, rand(seed));
    vec2 random_pos = vec2(
        rand(seed + 1.3),
        rand(seed + 2.1));
    pos = mix(pos, random_pos, drop);
    // encode the new particle position back into RGBA
    gl_FragColor = vec4(
        fract(pos * 255.0),
        floor(pos * 255.0) / 255.0);
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