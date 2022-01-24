var gl;
var canvas;
var init = function (canvasId) {
    if (canvasId) {
        canvas = document.getElementById(canvasId);
        if (canvas === undefined) {
            throw new Error("Cannot find a canvas element by Id:" + canvasId);
        }
    }
    else {
        canvas = document.createElement("canvas");
        canvas.id = "start3d";
        document.body.appendChild(canvas);
    }
    canvas.width = Math.floor(canvas.clientWidth * window.devicePixelRatio);
    canvas.height = Math.floor(canvas.clientHeight * window.devicePixelRatio);
    gl = canvas.getContext("webgl");
    gl.viewport(0, 0, canvas.width, canvas.height);
};

var Shader = /** @class */ (function () {
    function Shader(name) {
        this._attributes = {};
        this._uniforms = {};
        this._name = name;
    }
    Object.defineProperty(Shader.prototype, "name", {
        get: function () {
            return this._name;
        },
        enumerable: false,
        configurable: true
    });
    Shader.prototype.load = function (vertexSource, fragmentSource) {
        var vertexShader = this.loadShader(vertexSource, gl.VERTEX_SHADER);
        var fragmentShader = this.loadShader(fragmentSource, gl.FRAGMENT_SHADER);
        this.createProgram(vertexShader, fragmentShader);
        this.detectAttributes();
        this.detectUniforms();
    };
    Shader.prototype.loadShader = function (source, type) {
        var shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            var error = gl.getShaderInfoLog(shader);
            if (error !== "") {
                throw new Error("Error compiling shader:" + error);
            }
        }
        return shader;
    };
    Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
        this._program = gl.createProgram();
        gl.attachShader(this._program, vertexShader);
        gl.attachShader(this._program, fragmentShader);
        gl.linkProgram(this._program);
        if (!gl.getProgramParameter(this._program, gl.LINK_STATUS)) {
            var error = gl.getProgramInfoLog(this._program);
            if (error !== "") {
                throw new Error("Error linking shader " + this._name + ":" + error);
            }
        }
    };
    Shader.prototype.detectAttributes = function () {
        var attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < attributeCount; i++) {
            var attributeInfo = gl.getActiveAttrib(this._program, i);
            if (!attributeInfo) {
                break;
            }
            var name_1 = attributeInfo.name;
            this._attributes[name_1] = gl.getAttribLocation(this._program, name_1);
        }
    };
    Shader.prototype.detectUniforms = function () {
        var attributeCount = gl.getProgramParameter(this._program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < attributeCount; i++) {
            var uniformInfo = gl.getActiveUniform(this._program, i);
            if (!uniformInfo) {
                break;
            }
            var name_2 = uniformInfo.name;
            this._uniforms[name_2] = gl.getUniformLocation(this._program, name_2);
        }
    };
    Shader.prototype.getAttributeLocation = function (name) {
        var attribute = this._attributes[name];
        if (attribute === undefined) {
            throw new Error("Unable to find attribute named ".concat(name, " in shader named '").concat(this._name, "'"));
        }
        return attribute;
    };
    Shader.prototype.getUniformLocation = function (name) {
        var uniform = this._uniforms[name];
        if (uniform === undefined) {
            throw new Error("Unable to find uniform named ".concat(name, " in shader named '").concat(this._name, "'"));
        }
        return uniform;
    };
    Shader.prototype.use = function () {
        gl.useProgram(this._program);
    };
    return Shader;
}());

export { Shader, canvas, gl, init };
