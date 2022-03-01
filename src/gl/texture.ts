import { EventDispatcher } from "../event/eventDispatcher";
import { gl } from "./gl";

export class Texture{
    private _id:WebGLTexture = 0;;
    constructor(){
        this._id = gl.createTexture();
        if(!this._id){
            console.error("Failed to create the texture buffer");
        }
    }

    public get id():WebGLTexture{
        return this._id;
    }

    public load(image:HTMLImageElement):void{
        gl.bindTexture(gl.TEXTURE_2D,this._id);

        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

        gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);

        gl.bindTexture(gl.TEXTURE_2D,null);
    }

    public bind(uint:number = 0):void{
        gl.activeTexture(gl.TEXTURE0 + uint);
        gl.bindTexture(gl.TEXTURE_2D,this._id);
    }

    public unbind():void{
        gl.bindTexture(gl.TEXTURE_2D,null);
    }

    public destory():void{
        gl.deleteTexture(this._id);
        this._id = 0;
    }
}