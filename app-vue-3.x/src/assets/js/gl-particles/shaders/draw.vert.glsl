precision mediump float;

attribute float a_index;

uniform sampler2D u_particles;
uniform float u_particles_res;
uniform float u_particle_size;

varying vec2 vPos;

void main() {
    vec4 color = texture2D(u_particles, vec2(
        fract(a_index / u_particles_res),
        floor(a_index / u_particles_res) / u_particles_res));

    // decode current particle position from the pixel's RGBA value
    vPos = vec2(
        color.r / 255.0 + color.b,
        color.g / 255.0 + color.a);

    gl_PointSize = u_particle_size;
    gl_Position = vec4(2.0 * vPos.x - 1.0, 2.0 * vPos.y - 1.0, 0, 1);
}
