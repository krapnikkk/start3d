declare let gl: WebGLRenderingContext;
declare let canvas: HTMLCanvasElement;
declare const init: (canvasId?: string) => void;
declare class Shader {
    private _name;
    private _program;
    private _attributes;
    private _uniforms;
    constructor(name: string);
    get name(): string;
    protected load(vertexSource: string, fragmentSource: string): void;
    private loadShader;
    private createProgram;
    private detectAttributes;
    private detectUniforms;
    getAttributeLocation(name: string): number;
    getUniformLocation(name: string): WebGLUniformLocation;
    use(): void;
}
export { init, gl, canvas, Shader };
//# sourceMappingURL=start3d.module.d.ts.map