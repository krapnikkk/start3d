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
// 语义化vertex shader中常见attribute
declare enum VertexSemantic {
    POSITION = "position",
    NORMAL = "normal",
    TANGENT = "tangent",
    COLOR = "color",
    UV0 = "uv0",
    UV1 = "uv1",
    UV2 = "uv2",
    UV3 = "uv3"
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
    setData(semantic: string, data: number[]): void;
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
    setVertexData(semantic: string, data: number[]): void;
    setTriangles(data: number[]): void;
    upload(): void;
    render(shader: Shader): void;
    destroy(): void;
}
// source code see:http://rodger.global-linguist.com/webgl/lib/cuon-matrix.js
declare class Matrix4 {
    elements: Float32Array;
    constructor();
    setIdentity(): Matrix4;
    set(m: Matrix4): this;
    concat(m: Matrix4): Matrix4;
    multiply(m: Matrix4): Matrix4;
    setTranslate(x: number, y: number, z: number): Matrix4;
    translate(x: number, y: number, z: number): Matrix4;
    setScale(sx: number, sy: number, sz: number): Matrix4;
    scale(sx: number, sy: number, sz: number): Matrix4;
    setRotate(angle: number, x: number, y: number, z: number): Matrix4;
    rotate(angle: number, x: number, y: number, z: number): Matrix4;
    setLookAt(eyeX: number, eyeY: number, eyeZ: number, targetX: number, targetY: number, targetZ: number, upX: number, upY: number, upZ: number): Matrix4;
    lookAt(eyeX: number, eyeY: number, eyeZ: number, targetX: number, targetY: number, targetZ: number, upX: number, upY: number, upZ: number): Matrix4;
    setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    setPerspective(fovy: number, aspect: number, near: number, far: number): Matrix4;
    setInverseOf(source: Matrix4): Matrix4;
    invert(): Matrix4;
    transpose(): Matrix4;
}
declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): Vector3;
    length(): number;
    equals(v: Vector3): boolean;
    copyFrom(v: Vector3): Vector3;
    clone(): Vector3;
    add(v: Vector3): Vector3;
    sub(v: Vector3): Vector3;
    multiply(v: Vector3): Vector3;
    divide(v: Vector3): Vector3;
    static get zero(): Vector3;
    static get one(): Vector3;
    static distance(a: Vector3, b: Vector3): number;
}
/**
 * https://github.com/mrdoob/eventdispatcher.js/
 */
interface IEvent {
    readonly type: string;
    readonly data: any;
    target: any;
}
declare class EventDispatcher {
    private _listeners;
    addEventListener(type: string, listener: Function): void;
    hasEventListener(type: string, listener: Function): boolean;
    removeEventListener(type: string, listener: Function): void;
    dispatchEvent(event: IEvent): void;
}
interface IAsset {
    readonly name: string;
    readonly data: any;
}
interface IAssetLoader {
    readonly supportedExtensions: string[];
    loadAsset(assetName: string, callback: (res: IAsset) => {}): void;
}
declare class AssetManager extends EventDispatcher {
    private static _loaders;
    private static _loaderAssets;
    private constructor();
    static initialize(): void;
    static registerLoader(loader: IAssetLoader): void;
    static loadAsset(assetName: string, onComplete: (res: IAsset) => {}): void;
    static onAssetLoaded(asset: IAsset): void;
    static isAssetLoaded(assetName: string): boolean;
    static getAsset(assetName: string): IAsset;
}
declare class Texture {
    private _id;
    constructor();
    get id(): WebGLTexture;
    load(image: HTMLImageElement): void;
    bind(uint?: number): void;
    unbind(): void;
    destory(): void;
}
declare class TextureManager {
    private static _textures;
    static getTexture(textureName: string): Texture;
    static releaseTexture(textureName: string): void;
}
export { init, gl, canvas, Shader, VertexFormat, VertexSemantic, VertexBuffer, Mesh, Matrix4, Vector3, AssetManager, TextureManager };
