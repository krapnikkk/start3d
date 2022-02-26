import {gl} from "./gl";

class IndexBuffer{
    private _indexCount:number = 0 ;
    private _mode:GLenum = gl.TRIANGLES;
    private _type:GLenum = gl.UNSIGNED_SHORT; // SEE:https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types
    private _ibo:WebGLBuffer = gl.createBuffer();
    private _bufferData:Array<number> = null;

    get ibo():WebGLBuffer{
        return this._ibo;
    }

    get indexCount():number{
        return this._indexCount;
    }

    get mode():GLenum{
        return this._mode;
    }

    get type():GLenum{
        return this._type;
    }

    setData(data:Array<number>):void{
        this._bufferData = data;
    }

    upload():void{
        if(this._bufferData==null){
            console.error("buffer data is null!");
            return;
        }
        // 节省空间&防止越界
        let useByte = this._bufferData.length<=256;
        // 二进制数组 see：https://javascript.ruanyifeng.com/stdlib/arraybuffer.html
        let buffer = useByte ? new Uint8Array(this._bufferData):new Uint16Array(this._bufferData);
        this._type = useByte ? gl.UNSIGNED_BYTE : gl.UNSIGNED_SHORT;

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,this._ibo);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,buffer,gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);

        this._indexCount = buffer.length;
        this._bufferData = null;
    }

    destroy():void{
        gl.deleteBuffer(this._ibo);
        this._ibo = null;
    }
}

export {IndexBuffer};