#ifdef GL_ES
precision mediump float;
#endif

varying vec3 v_Color;

void main(){
    gl_FragColor = vec4(v_Color,1.0);
}