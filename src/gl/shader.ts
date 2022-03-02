import { gl } from "./gl";

class UniformInfo {
    public name: string;
    public location: WebGLUniformLocation;
    public type: number;
    public size: number;
    public isArray: boolean;
    constructor(name: string, location: WebGLUniformLocation, type: number, size: number, isArray: boolean) {
        this.name = name;
        this.location = location;
        this.type = type;
        this.size = size;
        this.isArray = isArray;
    }
}

export class Shader {
    private _program: WebGLProgram;
    private _attributes: { [name: string]: number } = {};
    private _uniforms: { [name: string]: UniformInfo } = {};
    private _semanticToAttribMap:{[name:string]:string} = {};

    public mapAttributeSemantic(semantic:string,attribName:string):void{
        this._semanticToAttribMap[semantic] = attribName;
    }

    public load(vertexSource: string, fragmentSource: string) {
        let vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        let fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);
        this.createProgram(vertexShader, fragmentShader);

        this.queryAttributes();
        this.queryUniforms();
    }

    private loadShader(source: string, type: GLenum): WebGLShader {
        let shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            let error = gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader:" + error);
            }
        }
        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): void {
        this._program = gl.createProgram();

        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);

        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            let error = gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error('Failed to link program: ' + error);
            }
        }
    }

    public queryAttributes() {
        let attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributeCount; i++) {
            let info: WebGLActiveInfo = gl.getActiveAttrib(this._program, i);
            if (!info) {
                break;
            }
            this._attributes[info.name] = gl.getAttribLocation(this._program, info.name);
        }
    }

    public queryUniforms() {
        let uniformCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformCount; i++) {
            let info = gl.getActiveUniform(this._program, i);
            if (!info) {
                break;
            }
            let location = gl.getUniformLocation(this._program, info.name);
            let isArray = info.size > 1 && info.name.substr(-3) === '[0]';
            let uniformInfo = new UniformInfo(info.name, location, info.type, info.size, isArray)
            this._uniforms[info.name] = uniformInfo;
        }
    }

    public getAttributeLocation(semantic: string): number {
        let name = this._semanticToAttribMap[semantic];
        if(name){
            let location = this._attributes[name];
            return location;
        } else {
            console.error('Shader: can not find attribute for semantic '+semantic);
            return -1;
        }
    }

    public setUniform(name: string, value: Float32List | number): void {
        let info = this._uniforms[name];
        if (info === null) {
            console.error("can not find uniform named " + name);
            return;
        }
        switch (info.type) {
            case gl.FLOAT:
                if (info.isArray) {
                    gl.uniform1fv(info.location, value as Float32List);
                } else {
                    gl.uniform1f(info.location, value as number);
                }
                break;
            case gl.FLOAT_VEC2:
                gl.uniform2fv(info.location, value as Float32List);
                break;
            case gl.FLOAT_VEC3:
                gl.uniform3fv(info.location, value as Float32List);
                break;
            case gl.FLOAT_VEC4:
                gl.uniform4fv(info.location, value as Float32List);
                break;
            case gl.FLOAT_MAT4:
                gl.uniformMatrix4fv(info.location,false, value as Float32List);
                break;
            default:
                console.error("uniform type not support ", info.type);
                break;
        }
    }


    public use(): void {
        if (this._program) {
            gl.useProgram(this._program);
        } else {
            console.error("create progarm first!");
        }
    }

}