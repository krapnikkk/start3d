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
        exports.canvas.setAttribute("style", "position: absolute;\n        left: 50%;\n        top: 50%;\n        transform: translate(-50%,-50%);\n        width: 100vw;\n        height: 100vh;\n        display: block;");
        exports.canvas.width = Math.floor(exports.canvas.clientWidth * window.devicePixelRatio);
        exports.canvas.height = Math.floor(exports.canvas.clientHeight * window.devicePixelRatio);
        exports.gl = exports.canvas.getContext("webgl");
        // gl.viewport(0, 0, canvas.width, canvas.height);
    };

    var UniformInfo = /** @class */ (function () {
        function UniformInfo(name, location, type, size, isArray) {
            this.name = name;
            this.location = location;
            this.type = type;
            this.size = size;
            this.isArray = isArray;
        }
        return UniformInfo;
    }());
    var Shader = /** @class */ (function () {
        function Shader() {
            this._attributes = {};
            this._uniforms = {};
            this._semanticToAttribMap = {};
        }
        Shader.prototype.mapAttributeSemantic = function (semantic, attribName) {
            this._semanticToAttribMap[semantic] = attribName;
        };
        Shader.prototype.load = function (vertexSource, fragmentSource) {
            var vertexShader = this.loadShader(vertexSource, exports.gl.VERTEX_SHADER);
            var fragmentShader = this.loadShader(fragmentSource, exports.gl.FRAGMENT_SHADER);
            this.createProgram(vertexShader, fragmentShader);
            this.queryAttributes();
            this.queryUniforms();
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
                    throw new Error('Failed to link program: ' + error);
                }
            }
        };
        Shader.prototype.queryAttributes = function () {
            var attributeCount = exports.gl.getProgramParameter(this._program, exports.gl.ACTIVE_ATTRIBUTES);
            for (var i = 0; i < attributeCount; i++) {
                var info = exports.gl.getActiveAttrib(this._program, i);
                if (!info) {
                    break;
                }
                this._attributes[info.name] = exports.gl.getAttribLocation(this._program, info.name);
            }
        };
        Shader.prototype.queryUniforms = function () {
            var uniformCount = exports.gl.getProgramParameter(this._program, exports.gl.ACTIVE_UNIFORMS);
            for (var i = 0; i < uniformCount; i++) {
                var info = exports.gl.getActiveUniform(this._program, i);
                if (!info) {
                    break;
                }
                var location_1 = exports.gl.getUniformLocation(this._program, info.name);
                var isArray = info.size > 1 && info.name.substr(-3) === '[0]';
                var uniformInfo = new UniformInfo(info.name, location_1, info.type, info.size, isArray);
                this._uniforms[info.name] = uniformInfo;
            }
        };
        Shader.prototype.getAttributeLocation = function (semantic) {
            var name = this._semanticToAttribMap[semantic];
            if (name) {
                var location_2 = this._attributes[name];
                return location_2;
            }
            else {
                console.error('Shader: can not find attribute for semantic ' + semantic);
                return -1;
            }
        };
        Shader.prototype.setUniform = function (name, value) {
            var info = this._uniforms[name];
            if (info === null) {
                console.error("can not find uniform named " + name);
                return;
            }
            switch (info.type) {
                case exports.gl.FLOAT:
                    if (info.isArray) {
                        exports.gl.uniform1fv(info.location, value);
                    }
                    else {
                        exports.gl.uniform1f(info.location, value);
                    }
                    break;
                case exports.gl.FLOAT_VEC2:
                    exports.gl.uniform2fv(info.location, value);
                    break;
                case exports.gl.FLOAT_VEC3:
                    exports.gl.uniform3fv(info.location, value);
                    break;
                case exports.gl.FLOAT_VEC4:
                    exports.gl.uniform4fv(info.location, value);
                    break;
                case exports.gl.FLOAT_MAT4:
                    exports.gl.uniformMatrix4fv(info.location, false, value);
                    break;
                default:
                    console.error("uniform type not support ", info.type);
                    break;
            }
        };
        Shader.prototype.use = function () {
            if (this._program) {
                exports.gl.useProgram(this._program);
            }
            else {
                console.error("create progarm first!");
            }
        };
        return Shader;
    }());

    // 语义化vertex shader中常见attribute
    exports.VertexSemantic = void 0;
    (function (VertexSemantic) {
        VertexSemantic["POSITION"] = "position";
        VertexSemantic["NORMAL"] = "normal";
        VertexSemantic["TANGENT"] = "tangent";
        VertexSemantic["COLOR"] = "color";
        VertexSemantic["UV0"] = "uv0";
        VertexSemantic["UV1"] = "uv1";
        VertexSemantic["UV2"] = "uv2";
        VertexSemantic["UV3"] = "uv3";
    })(exports.VertexSemantic || (exports.VertexSemantic = {}));
    var VertexFormat = /** @class */ (function () {
        function VertexFormat() {
            this._vertexSize = 0;
            this.attribs = [];
            this.attribSizeMap = {};
        }
        Object.defineProperty(VertexFormat.prototype, "attribCount", {
            get: function () {
                return this.attribs.length;
            },
            enumerable: false,
            configurable: true
        });
        VertexFormat.prototype.addAttrib = function (attribSemantic, size) {
            this.attribs.push(attribSemantic);
            this.attribSizeMap[attribSemantic] = size;
        };
        VertexFormat.prototype.getVertexSize = function () {
            this.updateVertexSize();
            return this._vertexSize;
        };
        VertexFormat.prototype.updateVertexSize = function () {
            // if(this._vertexSize === 0){
            this._vertexSize = 0;
            for (var i = 0; i < this.attribs.length; i++) {
                var semantic = this.attribs[i];
                this._vertexSize += this.attribSizeMap[semantic];
            }
            // }
        };
        return VertexFormat;
    }());

    var VertexAttribInfo = /** @class */ (function () {
        function VertexAttribInfo(attribSemantic, attribSize) {
            this.offset = 0;
            this.size = 0;
            this.data = null;
            this.semantic = attribSemantic;
            this.size = attribSize;
        }
        return VertexAttribInfo;
    }());
    var VertexBuffer = /** @class */ (function () {
        function VertexBuffer(vertexFormat) {
            this._vertexCount = 0;
            this._vertexStride = 0; // 步进
            this._attribInfoMap = {};
            this._vbo = exports.gl.createBuffer();
            this._bufferData = null;
            this.BYTES_PER_ELEMENT = 4; // // for Float32Array
            this._vertexFormat = vertexFormat;
            var attribCount = this._vertexFormat.attribCount;
            for (var i = 0; i < attribCount; i++) {
                var semantic = this._vertexFormat.attribs[i];
                var size = this._vertexFormat.attribSizeMap[semantic];
                if (size === null) {
                    console.error("VertexBuffer: bad semantic!");
                }
                else {
                    var info = new VertexAttribInfo(semantic, size);
                    this._attribInfoMap[semantic] = info;
                }
            }
        }
        Object.defineProperty(VertexBuffer.prototype, "vbo", {
            get: function () {
                return this._vbo;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VertexBuffer.prototype, "vertexCount", {
            get: function () {
                return this._vertexCount;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(VertexBuffer.prototype, "vertexStride", {
            get: function () {
                return this._vertexStride;
            },
            enumerable: false,
            configurable: true
        });
        VertexBuffer.prototype.setData = function (semantic, data) {
            this._attribInfoMap[semantic].data = data;
        };
        VertexBuffer.prototype._compile = function () {
            var position = this._attribInfoMap[exports.VertexSemantic.POSITION];
            if (position === null) {
                console.error("VertexBuffer: no attribute position!");
            }
            if (position.data === null || position.data.length === 0) {
                console.error("VertexBuffer: position data is empty!");
                return;
            }
            // calculate the vertex count
            this._vertexCount = position.data.length / position.size;
            this._vertexStride = this._vertexFormat.getVertexSize() * this.BYTES_PER_ELEMENT;
            this._bufferData = [];
            for (var i = 0; i < this._vertexCount; i++) {
                for (var _i = 0, _a = this._vertexFormat.attribs; _i < _a.length; _i++) {
                    var semantic = _a[_i];
                    var info = this._attribInfoMap[semantic];
                    if (info === null || info.data === null) {
                        console.error("VertexBuffer: bad semantic " + semantic);
                        continue;
                    }
                    for (var k = 0; k < info.size; k++) {
                        var val = info.data[i * info.size + k];
                        if (val === undefined) {
                            console.error("VertexBuffer: missing value for " + semantic);
                        }
                        this._bufferData.push(val);
                    }
                }
            }
            var offset = 0;
            for (var _b = 0, _c = this._vertexFormat.attribs; _b < _c.length; _b++) {
                var semantic = _c[_b];
                var info = this._attribInfoMap[semantic];
                info.offset = offset;
                info.data = null;
                offset += info.size * this.BYTES_PER_ELEMENT;
            }
        };
        VertexBuffer.prototype.upload = function () {
            this._compile();
            var buffer = new Float32Array(this._bufferData);
            exports.gl.bindBuffer(exports.gl.ARRAY_BUFFER, this._vbo);
            exports.gl.bufferData(exports.gl.ARRAY_BUFFER, buffer, exports.gl.STATIC_DRAW);
            exports.gl.bindBuffer(exports.gl.ARRAY_BUFFER, null);
            this._bufferData = null;
        };
        VertexBuffer.prototype.bindAttrib = function (shader) {
            for (var _i = 0, _a = this._vertexFormat.attribs; _i < _a.length; _i++) {
                var semantic = _a[_i];
                var info = this._attribInfoMap[semantic];
                var location_1 = shader.getAttributeLocation(semantic);
                if (location_1 >= 0) {
                    exports.gl.vertexAttribPointer(location_1, // index
                    info.size, // size
                    exports.gl.FLOAT, // type
                    false, // normailzed
                    this._vertexStride, // stride
                    info.offset // offset
                    );
                    exports.gl.enableVertexAttribArray(location_1);
                }
            }
        };
        VertexBuffer.prototype.unbindAttrb = function (shader) {
            for (var _i = 0, _a = this._vertexFormat.attribs; _i < _a.length; _i++) {
                var semantic = _a[_i];
                var location_2 = shader.getAttributeLocation(semantic);
                if (location_2 >= 0) {
                    exports.gl.disableVertexAttribArray(location_2);
                }
            }
        };
        VertexBuffer.prototype.destroy = function () {
            exports.gl.deleteBuffer(this._vbo);
            this._vbo = 0;
        };
        return VertexBuffer;
    }());

    var IndexBuffer = /** @class */ (function () {
        function IndexBuffer() {
            this._indexCount = 0;
            this._mode = exports.gl.TRIANGLES;
            this._type = exports.gl.UNSIGNED_SHORT; // SEE:https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Types
            this._ibo = exports.gl.createBuffer();
            this._bufferData = null;
        }
        Object.defineProperty(IndexBuffer.prototype, "ibo", {
            get: function () {
                return this._ibo;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IndexBuffer.prototype, "indexCount", {
            get: function () {
                return this._indexCount;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IndexBuffer.prototype, "mode", {
            get: function () {
                return this._mode;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(IndexBuffer.prototype, "type", {
            get: function () {
                return this._type;
            },
            enumerable: false,
            configurable: true
        });
        IndexBuffer.prototype.setData = function (data) {
            this._bufferData = data;
        };
        IndexBuffer.prototype.upload = function () {
            if (this._bufferData == null) {
                console.error("buffer data is null!");
                return;
            }
            // 节省空间&防止越界
            var useByte = this._bufferData.length <= 256;
            // 二进制数组 see：https://javascript.ruanyifeng.com/stdlib/arraybuffer.html
            var buffer = useByte ? new Uint8Array(this._bufferData) : new Uint16Array(this._bufferData);
            this._type = useByte ? exports.gl.UNSIGNED_BYTE : exports.gl.UNSIGNED_SHORT;
            exports.gl.bindBuffer(exports.gl.ELEMENT_ARRAY_BUFFER, this._ibo);
            exports.gl.bufferData(exports.gl.ELEMENT_ARRAY_BUFFER, buffer, exports.gl.STATIC_DRAW);
            exports.gl.bindBuffer(exports.gl.ELEMENT_ARRAY_BUFFER, null);
            this._indexCount = buffer.length;
            this._bufferData = null;
        };
        IndexBuffer.prototype.destroy = function () {
            exports.gl.deleteBuffer(this._ibo);
            this._ibo = null;
        };
        return IndexBuffer;
    }());

    var Mesh = /** @class */ (function () {
        function Mesh(vertexFormat) {
            this._vertexBuffer = new VertexBuffer(vertexFormat);
        }
        Mesh.prototype.setVertexData = function (semantic, data) {
            this._vertexBuffer.setData(semantic, data);
        };
        Mesh.prototype.setTriangles = function (data) {
            if (this._indexBuffer == null) {
                this._indexBuffer = new IndexBuffer();
            }
            this._indexBuffer.setData(data);
        };
        Mesh.prototype.upload = function () {
            this._vertexBuffer.upload();
            if (this._indexBuffer) {
                this._indexBuffer.upload();
            }
        };
        Mesh.prototype.render = function (shader) {
            exports.gl.bindBuffer(exports.gl.ARRAY_BUFFER, this._vertexBuffer.vbo);
            this._vertexBuffer.bindAttrib(shader);
            if (this._indexBuffer) {
                var _a = this._indexBuffer, ibo = _a.ibo, type = _a.type, mode = _a.mode, indexCount = _a.indexCount;
                exports.gl.bindBuffer(exports.gl.ELEMENT_ARRAY_BUFFER, ibo);
                exports.gl.drawElements(mode, indexCount, type, 0);
                exports.gl.bindBuffer(exports.gl.ELEMENT_ARRAY_BUFFER, null);
            }
            else {
                exports.gl.drawArrays(exports.gl.TRIANGLES, 0, this._vertexBuffer.vertexCount);
            }
            this._vertexBuffer.unbindAttrb(shader);
            exports.gl.bindBuffer(exports.gl.ARRAY_BUFFER, null);
        };
        Mesh.prototype.destroy = function () {
            this._vertexBuffer.destroy();
            if (this._indexBuffer) {
                this._indexBuffer.destroy();
            }
        };
        return Mesh;
    }());

    exports.Mesh = Mesh;
    exports.Shader = Shader;
    exports.VertexBuffer = VertexBuffer;
    exports.VertexFormat = VertexFormat;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=start3d.js.map
