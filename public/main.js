let mvpMatrix,viewProjMatrix,currentAngle = 0.0;
const main = async () => {
    Start3d.init();
    let shader = new Start3d.Shader("shader");
    let vs = await loadFile("./basic.vs"),
        fs = await loadFile("./basic.fs");
    shader.load(vs, fs);
    shader.use();
    shader.mapAttributeSemantic(Start3d.VertexSemantic.POSITION, "a_Position")
    shader.mapAttributeSemantic(Start3d.VertexSemantic.COLOR, "a_Color")

    let mesh = createMesh();
    viewProjMatrix = new Start3d.Matrix4();
    // projection
    viewProjMatrix.setPerspective(30, Start3d.canvas.width / Start3d.canvas.height, 1, 300);
    // view
    viewProjMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);


    Start3d.gl.enable(Start3d.gl.DEPTH_TEST);

    var tick = function () {   
        draw(mesh,shader);
        requestAnimationFrame(tick);
    };

    tick();
}

function createMesh() {
    let format = new Start3d.VertexFormat();
    format.addAttrib(Start3d.VertexSemantic.POSITION, 3);
    format.addAttrib(Start3d.VertexSemantic.COLOR, 3);
    // Create a cube
    //    v6----- v5
    //   /|      /|
    //  v1------v0|
    //  | |     | |
    //  | |v7---|-|v4
    //  |/      |/
    //  v2------v3
    let vertices = [
        //顶点坐标 (xyz) & 颜色（rgb）
        1.0, 1.0, 1.0,   // v0 White
        -1.0, 1.0, 1.0,   // v1 Magenta
        -1.0, -1.0, 1.0,   // v2 Red
        1.0, -1.0, 1.0,   // v3 Yellow
        1.0, -1.0, -1.0,  // v4 Green
        1.0, 1.0, -1.0,   // v5 Cyan
        -1.0, 1.0, -1.0,   // v6 Blue
        -1.0, -1.0, -1.0   // v7 Black
    ];

    let colors = [
        1.0, 1.0, 1.0,
        1.0, 0.0, 1.0,
        1.0, 0.0, 0.0,
        1.0, 1.0, 0.0,
        0.0, 1.0, 0.0, 
        0.0, 1.0, 1.0,
        0.0, 0.0, 1.0,
        0.0, 0.0, 0.0 
    ];

    let indices = [
        0, 1, 2, 0, 2, 3,
        0, 3, 4, 0, 4, 5,
        0, 5, 6, 0, 6, 1,
        1, 6, 7, 1, 7, 2,
        7, 4, 3, 7, 3, 2,
        4, 7, 6, 4, 6, 5
    ];
    let mesh = new Start3d.Mesh(format);

    mesh.setVertexData(Start3d.VertexSemantic.POSITION, vertices);
    mesh.setVertexData(Start3d.VertexSemantic.COLOR, colors);

    mesh.setTriangles(indices);
    mesh.upload();
    return mesh;
}

function loadFile(url){
    return new Promise((resolve,reject)=>{
        fetch(url).then(res=>res.text()).then((text)=>{
            resolve(text);
        }).catch((e)=>{
            reject(e);
        })
    })
}

function draw(mesh,shader){
    currentAngle += 1;
    let g_MvpMatrix = new Start3d.Matrix4();
    g_MvpMatrix.set(viewProjMatrix);
    g_MvpMatrix.rotate(currentAngle, 1.0, 0.0, 0.0);
    g_MvpMatrix.rotate(currentAngle, 0.0, 1.0, 0.0);
    Start3d.gl.clearColor(0, 0, 0, 1);
    Start3d.gl.clear(Start3d.gl.COLOR_BUFFER_BIT|Start3d.DEPTH_BUFFER_BIT);
    shader.setUniform("u_MvpMatrix",g_MvpMatrix.elements);

    mesh.render(shader);
}