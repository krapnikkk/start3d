declare let gl: WebGLRenderingContext;
declare let canvas: HTMLCanvasElement;
declare const init: (canvasId?: string) => void;
declare class Shader {
    private _program;
    private _attributes;
    private _uniforms;
    private _semanticToAttribMap;
    mapAttributeSemantic(semantic: string, attribName: string): void;
    protected load(vertexSource: string, fragmentSource: string): void;
    private loadShader;
    private createProgram;
    queryAttributes(): void;
    queryUniforms(): void;
    getAttributeLocation(semantic: string): number;
    setUniform(name: string, value: Float32List | number): void;
    use(): void;
}
declare class VertexFormat {
    private _vertexSize;
    attribs: string[];
    attribSizeMap: {};
    constructor();
    get attribCount(): number;
    addAttrib(attribSemantic: string, size: number): void;
    getVertexSize(): number;
    updateVertexSize(): void;
}
declare class VertexAttribInfo {
    offset: number;
    size: number;
    semantic: string;
    data: Array<number>;
    constructor(attribSemantic: string, attribSize: number);
}
declare class VertexBuffer {
    private _vertexCount;
    private _vertexStride; // 步进
    private _vertexFormat;
    private _attribInfoMap;
    private _vbo;
    private _bufferData;
    BYTES_PER_ELEMENT: number; // // for Float32Array
    constructor(vertexFormat: VertexFormat);
    get vbo(): WebGLBuffer;
    get vertexCount(): number;
    get vertexStride(): number;
    setData(semantic: string, data: VertexAttribInfo): void;
    private _compile;
    upload(): void;
    bindAttrib(shader: Shader): void;
    unbindAttrb(shader: Shader): void;
    destroy(): void;
}
declare class Mesh {
    private _vertexBuffer;
    private _indexBuffer;
    constructor(vertexFormat: VertexFormat);
    setVertexData(semantic: string, data: VertexAttribInfo): void;
    setTriangle(data: number[]): void;
    upload(): void;
    render(shader: Shader): void;
    destroy(): void;
}
export { init, gl, canvas, Shader, VertexFormat, VertexBuffer, Mesh };
//# sourceMappingURL=start3d.d.ts.map