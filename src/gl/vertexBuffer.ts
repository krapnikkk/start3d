import { Shader } from "./shader";
import { gl } from "./gl";
import { VertexFormat, VertexSemantic } from "./vertexFormat";


class VertexAttribInfo {
    public offset: number = 0;
    public size: number = 0;
    public semantic: string;
    public data: Array<number> = null;

    constructor(attribSemantic: string, attribSize: number) {
        this.semantic = attribSemantic;
        this.size = attribSize;
    }
}

class VertexBuffer {
    private _vertexCount: number = 0;
    private _vertexStride: number = 0; // 步进
    private _vertexFormat: VertexFormat;
    private _attribInfoMap: { [key: string]: VertexAttribInfo } = {};
    private _vbo: WebGLBuffer = gl.createBuffer();
    private _bufferData: Array<number> = null;

    public BYTES_PER_ELEMENT: number = 4; // // for Float32Array

    public constructor(vertexFormat: VertexFormat) {
        this._vertexFormat = vertexFormat;
        let attribCount = this._vertexFormat.attribCount;
        for (let i = 0; i < attribCount; i++) {
            let semantic = this._vertexFormat.attribs[i];
            let size = this._vertexFormat.attribSizeMap[semantic];
            if (size === null) {
                console.error("VertexBuffer: bad semantic!");
            } else {
                let info = new VertexAttribInfo(semantic, size);
                this._attribInfoMap[semantic] = info;
            }
        }
    }

    get vbo(): WebGLBuffer {
        return this._vbo;
    }

    get vertexCount(): number {
        return this._vertexCount;
    }

    get vertexStride(): number {
        return this._vertexStride;
    }

    public setData(semantic:string,data:number[]):void{
        this._attribInfoMap[semantic].data = data;
    }

    private _compile(): void {
        let position = this._attribInfoMap[VertexSemantic.POSITION];
        if (position === null) {
            console.error("VertexBuffer: no attribute position!");
        }
        if (position.data === null || position.data.length === 0) {
            console.error("VertexBuffer: position data is empty!");
            return;
        }

        // calculate the vertex count
        this._vertexCount = position.data.length / position.size;
        this._vertexStride = this._vertexFormat.getVertexSize() * this.BYTES_PER_ELEMENT;


        this._bufferData = [];
        for (let i = 0; i < this._vertexCount; i++) {
            for (let semantic of this._vertexFormat.attribs) {
                let info = this._attribInfoMap[semantic];
                if (info === null || info.data === null) {
                    console.error("VertexBuffer: bad semantic " + semantic);
                    continue;
                }
                for (let k = 0; k < info.size; k++) {
                    let val = info.data[i * info.size + k];
                    if (val === undefined) {
                        console.error("VertexBuffer: missing value for " + semantic);
                    }
                    this._bufferData.push(val);
                }
            }
        }

        let offset = 0;
        for (let semantic of this._vertexFormat.attribs) {
            let info = this._attribInfoMap[semantic];
            info.offset = offset;
            info.data = null;
            offset += info.size * this.BYTES_PER_ELEMENT;
        }
    }

    upload(): void {
        this._compile();

        let buffer = new Float32Array(this._bufferData);

        gl.bindBuffer(gl.ARRAY_BUFFER, this._vbo);
        gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this._bufferData = null;
    }

    bindAttrib(shader: Shader) {
        for (let semantic of this._vertexFormat.attribs) {
            let info = this._attribInfoMap[semantic];
            let location = shader.getAttributeLocation(semantic);
            if (location >= 0) {
                gl.vertexAttribPointer(
                    location, // index
                    info.size, // size
                    gl.FLOAT, // type
                    false, // normailzed
                    this._vertexStride, // stride
                    info.offset // offset
                );
                gl.enableVertexAttribArray(location);
            }
        }
    }

    unbindAttrb(shader:Shader){
        for(let semantic of this._vertexFormat.attribs){
            let location = shader.getAttributeLocation(semantic);
            if(location>=0){
                gl.disableVertexAttribArray(location);
            }
        }
    }

    destroy(): void {
        gl.deleteBuffer(this._vbo);
        this._vbo = 0;
    }
}

export { VertexBuffer, VertexAttribInfo }