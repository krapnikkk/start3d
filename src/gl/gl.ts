let gl:WebGLRenderingContext;
let canvas:HTMLCanvasElement;
const init = (canvasId?:string)=>{
    if(canvasId){
        canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if(canvas === undefined){
            throw new Error("Cannot find a canvas element by Id:" + canvasId);
        }
    }else{
        canvas = document.createElement("canvas");
        canvas.id = "start3d";
        document.body.appendChild(canvas);
    }
    canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);
    
    gl = canvas.getContext("webgl")!;
    gl.viewport(0, 0, canvas.width, canvas.height);
}

export {init,gl,canvas}