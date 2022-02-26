// 语义化vertex shader中常见attribute
enum VertexSemantic {
    POSITION = "position",
    NORMAL = "normal",
    TANGENT = "tangent",
    COLOR = "color",
    UV0 = "uv0",
    UV1 = "uv1",
    UV2 = "uv2",
    UV3 = "uv3",
}

class VertexFormat {
    private _vertexSize: number = 0;
    public attribs: string[] = [];
    public attribSizeMap: {} = {};

    constructor() {

    }

    public get attribCount():number{
        return this.attribs.length;
    }

    addAttrib(attribSemantic: string, size: number): void {
        this.attribs.push(attribSemantic);
        this.attribSizeMap[attribSemantic] = size;
    }

    getVertexSize():number{
        this.updateVertexSize();
        return this._vertexSize;
    }

    updateVertexSize():void{
        // if(this._vertexSize === 0){
            this._vertexSize = 0;
            for(let i = 0;i<this.attribs.length;i++){
                let semantic = this.attribs[i];
                this._vertexSize += this.attribSizeMap[semantic];
            }
        // }
    }
}

export { VertexFormat, VertexSemantic };