import { gl } from "./gl";
import { IndexBuffer } from "./indexBuffer";
import { Shader } from "./shader";
import { VertexBuffer } from "./vertexBuffer";
import { VertexFormat } from "./vertexFormat";

class Mesh {
    private _vertexBuffer: VertexBuffer;
    private _indexBuffer: IndexBuffer;
    constructor(vertexFormat: VertexFormat) {
        this._vertexBuffer = new VertexBuffer(vertexFormat);
    }

    setVertexData(semantic: string, data: number[]) {
        this._vertexBuffer.setData(semantic, data);
    }

    setTriangles(data: number[]) {
        if (this._indexBuffer == null) {
            this._indexBuffer = new IndexBuffer();
        }
        this._indexBuffer.setData(data);
    }

    upload() {
        this._vertexBuffer.upload();
        if (this._indexBuffer) {
            this._indexBuffer.upload();
        }
    }

    render(shader: Shader) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuffer.vbo);

        this._vertexBuffer.bindAttrib(shader);

        if (this._indexBuffer) {
            let { ibo, type, mode, indexCount } = this._indexBuffer;
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
            gl.drawElements(mode, indexCount, type, 0);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, this._vertexBuffer.vertexCount);
        }

        this._vertexBuffer.unbindAttrb(shader);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    destroy() {
        this._vertexBuffer.destroy();
        if (this._indexBuffer) {
            this._indexBuffer.destroy();
        }
    }

}

export { Mesh };