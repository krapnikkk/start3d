// const vertexShader = `
// attribute vec4 a_Position;
// void main(){
//     gl_Position = a_Position;
// }
// `;

// const fragmentShader = `
// precision mediump float;
// void main(){
//     gl_FragColor = vec4(1.0,0.0,0.0,1.0);
// }
// `;

// const main = () => {
//     Start3d.init();
//     let shader = new Start3d.Shader("shader");
//     shader.load(vertexShader, fragmentShader);
//     shader.use();
//     shader.mapAttributeSemantic(Start3d.VertexSemantic.POSITION, "a_Position")

//     let mesh = createMesh();
//     Start3d.gl.clearColor(0, 0, 0, 1);
//     Start3d.gl.clear(Start3d.gl.COLOR_BUFFER_BIT);
//     mesh.render(shader);
// }

// function createMesh() {
//     let format = new Start3d.VertexFormat();
//     format.addAttrib(Start3d.VertexSemantic.POSITION, 3);
//     let vertices = [
//         0.5, 0.5, 0.0,   // 右上角
//         0.5, -0.5, 0.0,  // 右下角
//         -0.5, -0.5, 0.0, // 左下角
//         -0.5, 0.5, 0.0   // 左上角
//     ];
//     let indices = [
//         0, 1, 3, // 第一个三角形
//         1, 2, 3  // 第二个三角形
//     ];
//     let mesh = new Start3d.Mesh(format);

//     mesh.setVertexData(Start3d.VertexSemantic.POSITION, vertices);
//     mesh.setTriangles(indices);
//     mesh.upload();
//     return mesh;
// }