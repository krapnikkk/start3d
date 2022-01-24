(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.Start3d = {}));
})(this, (function (exports) { 'use strict';

    exports.gl = void 0;
    exports.canvas = void 0;
    var init = function (canvasId) {
        if (canvasId) {
            exports.canvas = document.getElementById(canvasId);
            if (exports.canvas === undefined) {
                throw new Error("Cannot find a canvas element by Id:" + canvasId);
            }
        }
        else {
            exports.canvas = document.createElement("canvas");
            exports.canvas.id = "start3d";
            document.body.appendChild(exports.canvas);
        }
        exports.canvas.width = Math.floor(exports.canvas.clientWidth * window.devicePixelRatio);
        exports.canvas.height = Math.floor(exports.canvas.clientHeight * window.devicePixelRatio);
        exports.gl = exports.canvas.getContext("webgl");
        exports.gl.viewport(0, 0, exports.canvas.width, exports.canvas.height);
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
            var vertexShader = this.loadShader(vertexSource, exports.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, exports.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.detectAttributes();
            this.detectUniforms();
        };
        Shader.prototype.loadShader = function (source, type) {
            var shader = exports.gl.createShader(type);
            exports.gl.shaderSource(shader, source);
            exports.gl.compileShader(shader);
            if (!exports.gl.getShaderParameter(shader, exports.gl.COMPILE_STATUS)) {
                var error = exports.gl.getShaderInfoLog(shader);
                if (error !== "") {
                    throw new Error("Error compiling shader:" + error);
                }
            }
            return shader;
        };
        Shader.prototype.createProgram = function (vertexShader, fragmentShader) {
            this._program = exports.gl.createProgram();
            exports.gl.attachShader(this._program, vertexShader);
            exports.gl.attachShader(this._program, fragmentShader);
            exports.gl.linkProgram(this._program);
            if (!exports.gl.getProgramParameter(this._program, exports.gl.LINK_STATUS)) {
                var error = exports.gl.getProgramInfoLog(this._program);
                if (error !== "") {
                    throw new Error("Error linking shader " + this._name + ":" + error);
                }
            }
        };
        Shader.prototype.detectAttributes = function () {
            var attributeCount = exports.gl.getProgramParameter(this._program, exports.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; i++) {
                var attributeInfo = exports.gl.getActiveAttrib(this._program, i);
                if (!attributeInfo) {
                    break;
                }
                var name_1 = attributeInfo.name;
                this._attributes[name_1] = exports.gl.getAttribLocation(this._program, name_1);
            }
        };
        Shader.prototype.detectUniforms = function () {
            var attributeCount = exports.gl.getProgramParameter(this._program, exports.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < attributeCount; i++) {
                var uniformInfo = exports.gl.getActiveUniform(this._program, i);
                if (!uniformInfo) {
                    break;
                }
                var name_2 = uniformInfo.name;
                this._uniforms[name_2] = exports.gl.getUniformLocation(this._program, name_2);
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
            exports.gl.useProgram(this._program);
        };
        return Shader;
    }());

    exports.Shader = Shader;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
