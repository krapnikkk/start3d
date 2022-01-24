const vertexShader = `
void main(){
    attribute vec4 a_position;
    gl_Position = a_position;
}
`;

const fragmentShader = `
precision mediump float;
void main(){
    gl_FragColor = vec4(1.0,1.0,1.0,1.0);
}
`;

const main = ()=>{
    Start3d.init();
    let shader = new Start3d.Shader("shader");
    shader.load(vertexShader,fragmentShader);
    shader.use();

}