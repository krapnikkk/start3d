import { init,gl,VertexSemantic,VertexFormat,Mesh,Shader } from "../../build/start3d.module.js";

const vertexShader = `
attribute vec4 a_Position;
void main(){
    gl_Position = a_Position;
}
`;

const fragmentShader = `
precision mediump float;
void main(){
    gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`;

window.onload = ()=>{
    main();
}

const main = () => {
    init();
    let shader = new Shader();
    shader.load(vertexShader, fragmentShader);
    shader.use();
    shader.mapAttributeSemantic(VertexSemantic.POSITION, "a_Position")

    let mesh = createMesh();
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    mesh.render(shader);
}

function createMesh() {
    let format = new VertexFormat();
    format.addAttrib(VertexSemantic.POSITION, 3);
    let vertices = [
        0.5, 0.5, 0.0,   // 右上角
        0.5, -0.5, 0.0,  // 右下角
        -0.5, -0.5, 0.0, // 左下角
        -0.5, 0.5, 0.0   // 左上角
    ];
    let indices = [
        0, 1, 3, // 第一个三角形
        1, 2, 3  // 第二个三角形
    ];
    let mesh = new Mesh(format);

    mesh.setVertexData(VertexSemantic.POSITION, vertices);
    mesh.setTriangles(indices);
    mesh.upload();
    return mesh;
}