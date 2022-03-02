attribute vec4 a_Position;
attribute vec3 a_Color;

uniform mat4 u_MvpMatrix;
varying vec3 v_Color;

void main(){
    gl_Position = u_MvpMatrix * a_Position;
    v_Color = a_Color;    
}