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
        exports.gl.viewport(0, 0, exports.canvas.width, exports.canvas.height);
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

    // source code see:http://rodger.global-linguist.com/webgl/lib/cuon-matrix.js
    var Matrix4 = /** @class */ (function () {
        function Matrix4() {
            this.elements = new Float32Array([
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            ]);
        }
        Matrix4.prototype.setIdentity = function () {
            var elements = this.elements;
            elements[0] = 1;
            elements[4] = 0;
            elements[8] = 0;
            elements[12] = 0;
            elements[1] = 0;
            elements[5] = 1;
            elements[9] = 0;
            elements[13] = 0;
            elements[2] = 0;
            elements[6] = 0;
            elements[10] = 1;
            elements[14] = 0;
            elements[3] = 0;
            elements[7] = 0;
            elements[11] = 0;
            elements[15] = 1;
            return this;
        };
        Matrix4.prototype.set = function (m) {
            var src = m.elements;
            var dst = this.elements;
            if (src === dst) {
                return this;
            }
            for (var i = 0; i < 16; i++) {
                dst[i] = src[i];
            }
            return this;
        };
        Matrix4.prototype.concat = function (m) {
            // Calculate e = a * b
            var e = this.elements;
            var a = this.elements;
            var b = m.elements;
            // If e equals b, copy b to temporary matrix.
            if (e === b) {
                var b_1 = new Float32Array(16);
                for (var i = 0; i < 16; ++i) {
                    b_1[i] = e[i];
                }
            }
            for (var i = 0; i < 4; i++) {
                var ai0 = a[i];
                var ai1 = a[i + 4];
                var ai2 = a[i + 8];
                var ai3 = a[i + 12];
                e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }
            return this;
        };
        Matrix4.prototype.multiply = function (m) {
            // var i, e, a, b, ai0, ai1, ai2, ai3;
            // Calculate e = a * b
            var e = this.elements;
            var a = this.elements;
            var b = m.elements;
            // If e equals b, copy b to temporary matrix.
            if (e === b) {
                b = new Float32Array(16);
                for (var i = 0; i < 16; ++i) {
                    b[i] = e[i];
                }
            }
            for (var i = 0; i < 4; i++) {
                var ai0 = a[i];
                var ai1 = a[i + 4];
                var ai2 = a[i + 8];
                var ai3 = a[i + 12];
                e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
                e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
                e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
                e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
            }
            return this;
        };
        Matrix4.prototype.setTranslate = function (x, y, z) {
            var elements = this.elements;
            elements[0] = 1;
            elements[4] = 0;
            elements[8] = 0;
            elements[12] = x;
            elements[1] = 0;
            elements[5] = 1;
            elements[9] = 0;
            elements[13] = y;
            elements[2] = 0;
            elements[6] = 0;
            elements[10] = 1;
            elements[14] = z;
            elements[3] = 0;
            elements[7] = 0;
            elements[11] = 0;
            elements[15] = 1;
            return this;
        };
        Matrix4.prototype.translate = function (x, y, z) {
            var elements = this.elements;
            elements[12] += elements[0] * x + elements[4] * y + elements[8] * z;
            elements[13] += elements[1] * x + elements[5] * y + elements[9] * z;
            elements[14] += elements[2] * x + elements[6] * y + elements[10] * z;
            elements[15] += elements[3] * x + elements[7] * y + elements[11] * z;
            return this;
        };
        Matrix4.prototype.setScale = function (sx, sy, sz) {
            var elements = this.elements;
            elements[0] = sx;
            elements[4] = 0;
            elements[8] = 0;
            elements[12] = 0;
            elements[1] = 0;
            elements[5] = sy;
            elements[9] = 0;
            elements[13] = 0;
            elements[2] = 0;
            elements[6] = 0;
            elements[10] = sz;
            elements[14] = 0;
            elements[3] = 0;
            elements[7] = 0;
            elements[11] = 0;
            elements[15] = 1;
            return this;
        };
        Matrix4.prototype.scale = function (sx, sy, sz) {
            var elements = this.elements;
            elements[0] *= sx;
            elements[4] *= sy;
            elements[8] *= sz;
            elements[1] *= sx;
            elements[5] *= sy;
            elements[9] *= sz;
            elements[2] *= sx;
            elements[6] *= sy;
            elements[10] *= sz;
            elements[3] *= sx;
            elements[7] *= sy;
            elements[11] *= sz;
            return this;
        };
        Matrix4.prototype.setRotate = function (angle, x, y, z) {
            // let e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;
            angle = Math.PI * angle / 180;
            var e = this.elements;
            var s = Math.sin(angle);
            var c = Math.cos(angle);
            if (0 !== x && 0 === y && 0 === z) {
                // Rotation around X axis
                if (x < 0) {
                    s = -s;
                }
                e[0] = 1;
                e[4] = 0;
                e[8] = 0;
                e[12] = 0;
                e[1] = 0;
                e[5] = c;
                e[9] = -s;
                e[13] = 0;
                e[2] = 0;
                e[6] = s;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else if (0 === x && 0 !== y && 0 === z) {
                // Rotation around Y axis
                if (y < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = 0;
                e[8] = s;
                e[12] = 0;
                e[1] = 0;
                e[5] = 1;
                e[9] = 0;
                e[13] = 0;
                e[2] = -s;
                e[6] = 0;
                e[10] = c;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else if (0 === x && 0 === y && 0 !== z) {
                // Rotation around Z axis
                if (z < 0) {
                    s = -s;
                }
                e[0] = c;
                e[4] = -s;
                e[8] = 0;
                e[12] = 0;
                e[1] = s;
                e[5] = c;
                e[9] = 0;
                e[13] = 0;
                e[2] = 0;
                e[6] = 0;
                e[10] = 1;
                e[14] = 0;
                e[3] = 0;
                e[7] = 0;
                e[11] = 0;
                e[15] = 1;
            }
            else {
                // Rotation around another axis
                var len = Math.sqrt(x * x + y * y + z * z);
                if (len !== 1) {
                    var rlen = 1 / len;
                    x *= rlen;
                    y *= rlen;
                    z *= rlen;
                }
                var nc = 1 - c;
                var xy = x * y;
                var yz = y * z;
                var zx = z * x;
                var xs = x * s;
                var ys = y * s;
                var zs = z * s;
                e[0] = x * x * nc + c;
                e[1] = xy * nc + zs;
                e[2] = zx * nc - ys;
                e[3] = 0;
                e[4] = xy * nc - zs;
                e[5] = y * y * nc + c;
                e[6] = yz * nc + xs;
                e[7] = 0;
                e[8] = zx * nc + ys;
                e[9] = yz * nc - xs;
                e[10] = z * z * nc + c;
                e[11] = 0;
                e[12] = 0;
                e[13] = 0;
                e[14] = 0;
                e[15] = 1;
            }
            return this;
        };
        Matrix4.prototype.rotate = function (angle, x, y, z) {
            return this.multiply(new Matrix4().setRotate(angle, x, y, z));
        };
        Matrix4.prototype.setLookAt = function (eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ) {
            // N = eye - target
            var nx = eyeX - targetX;
            var ny = eyeY - targetY;
            var nz = eyeZ - targetZ;
            var rl = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
            nx *= rl;
            ny *= rl;
            nz *= rl;
            // U = UP cross N
            var ux = upY * nz - upZ * ny;
            var uy = upZ * nx - upX * nz;
            var uz = upX * ny - upY * nx;
            rl = 1 / Math.sqrt(ux * ux + uy * uy + uz * uz);
            ux *= rl;
            uy *= rl;
            uz *= rl;
            // V = N cross U
            var vx = ny * uz - nz * uy;
            var vy = nz * ux - nx * uz;
            var vz = nx * uy - ny * ux;
            rl = 1 / Math.sqrt(vx * vx + vy * vy + vz * vz);
            vx *= rl;
            vy *= rl;
            vz *= rl;
            var e = this.elements;
            e[0] = ux;
            e[1] = vx;
            e[2] = nx;
            e[3] = 0;
            e[4] = uy;
            e[5] = vy;
            e[6] = ny;
            e[7] = 0;
            e[8] = uz;
            e[9] = vz;
            e[10] = nz;
            e[11] = 0;
            e[12] = 0;
            e[13] = 0;
            e[14] = 0;
            e[15] = 1;
            return this.translate(-eyeX, -eyeY, -eyeZ);
        };
        Matrix4.prototype.lookAt = function (eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ) {
            return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ));
        };
        Matrix4.prototype.setOrtho = function (left, right, bottom, top, near, far) {
            if (left === right || bottom === top || near === far) {
                console.error("wrong param");
                return;
            }
            var rw = 1 / (right - left);
            var rh = 1 / (top - bottom);
            var rd = 1 / (far - near);
            var e = this.elements;
            e[0] = 2 * rw;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = 2 * rh;
            e[6] = 0;
            e[7] = 0;
            e[8] = 0;
            e[9] = 0;
            e[10] = -2 * rd;
            e[11] = 0;
            e[12] = -(right + left) * rw;
            e[13] = -(top + bottom) * rh;
            e[14] = -(far + near) * rd;
            e[15] = 1;
            return this;
        };
        Matrix4.prototype.setFrustum = function (left, right, bottom, top, near, far) {
            if (left === right || bottom === top || near === far) {
                console.error("wrong param");
                return;
            }
            if (near <= 0) {
                console.error("wrong near");
                return;
            }
            if (far <= 0) {
                console.error("wrong far");
                return;
            }
            var rw = 1 / (right - left);
            var rh = 1 / (top - bottom);
            var rd = 1 / (far - near);
            var e = this.elements;
            e[0] = 2 * near * rw;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = 2 * near * rh;
            e[6] = 0;
            e[7] = 0;
            e[8] = (right + left) * rw;
            e[9] = (top + bottom) * rh;
            e[10] = -(far + near) * rd;
            e[11] = -1;
            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;
            return this;
        };
        Matrix4.prototype.setPerspective = function (fovy, aspect, near, far) {
            if (near === far || aspect === 0 || near <= 0 || far <= 0) {
                console.error("wrong param");
                return;
            }
            var radius = fovy * Math.PI / 180 / 2;
            var sin = Math.sin(radius);
            if (sin === 0) {
                console.error("wrong param");
                return;
            }
            var cot = Math.cos(radius) / sin;
            var rd = 1 / (far - near);
            var e = this.elements;
            e[0] = cot / aspect;
            e[1] = 0;
            e[2] = 0;
            e[3] = 0;
            e[4] = 0;
            e[5] = cot;
            e[6] = 0;
            e[7] = 0;
            e[8] = 0;
            e[9] = 0;
            e[10] = -(far + near) * rd;
            e[11] = -1;
            e[12] = 0;
            e[13] = 0;
            e[14] = -2 * near * far * rd;
            e[15] = 0;
            return this;
        };
        Matrix4.prototype.setInverseOf = function (source) {
            var s = source.elements;
            var d = this.elements;
            var inv = new Float32Array(16);
            //使用标准伴随阵法计算逆矩阵：
            //标准伴随阵 = 方阵的代数余子式组成的矩阵的转置矩阵
            //逆矩阵 = 标准伴随阵/方阵的行列式
            //计算代数余子式并转置后放入inv矩阵中
            inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
                + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
            inv[4] = -s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
                - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
            inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
                + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
            inv[12] = -s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
                - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];
            inv[1] = -s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
                - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
            inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
                + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
            inv[9] = -s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
                - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
            inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
                + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];
            inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
                + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
            inv[6] = -s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
                - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
            inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
                + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
            inv[14] = -s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
                - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];
            inv[3] = -s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
                - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
            inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
                + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
            inv[11] = -s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
                - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
            inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
                + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];
            //计算行列式，选择方阵的第一列，对该列中的四个元素S[0],s[1],s[2],s[3]分别乘以对应的代数余子式，然后相加
            var det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
            //注：选择任意一行，例如第一行，也是可以的
            //let det = s[0]*inv[0] + s[4]*inv[1] + s[8]*inv[2] + s[12]*inv[3];
            if (det === 0) {
                return this;
            }
            det = 1 / det;
            for (var i = 0; i < 16; ++i) {
                d[i] = inv[i] * det;
            }
            return this;
        };
        Matrix4.prototype.invert = function () {
            return this.setInverseOf(this);
        };
        Matrix4.prototype.transpose = function () {
            var e = this.elements;
            //转置4x4矩阵，分别交换 1,4; 2,8; 3,12; 6,9; 7,13; 11,14
            var t;
            t = e[1];
            e[1] = e[4];
            e[4] = t;
            t = e[2];
            e[2] = e[8];
            e[8] = t;
            t = e[3];
            e[3] = e[12];
            e[12] = t;
            t = e[6];
            e[6] = e[9];
            e[9] = t;
            t = e[7];
            e[7] = e[13];
            e[13] = t;
            t = e[11];
            e[11] = e[14];
            e[14] = t;
            return this;
        };
        return Matrix4;
    }());

    var Vector3 = /** @class */ (function () {
        function Vector3(x, y, z) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            if (z === void 0) { z = 0; }
            this.x = x;
            this.y = y;
            this.z = z;
        }
        Vector3.prototype.set = function (x, y, z) {
            this.x = x;
            this.y = y;
            this.z = z;
            return this;
        };
        Vector3.prototype.length = function () {
            return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        };
        Vector3.prototype.equals = function (v) {
            return this.x == v.x && this.y == v.y && this.z == v.z;
        };
        Vector3.prototype.copyFrom = function (v) {
            this.x = v.x;
            this.y = v.y;
            this.z = v.z;
            return this;
        };
        Vector3.prototype.clone = function () {
            return new Vector3(this.x, this.y, this.z);
        };
        Vector3.prototype.add = function (v) {
            this.x += v.x;
            this.y += v.y;
            this.z += v.z;
            return this;
        };
        Vector3.prototype.sub = function (v) {
            this.x -= this.x;
            this.y -= this.y;
            this.z -= this.z;
            return this;
        };
        Vector3.prototype.multiply = function (v) {
            this.x *= v.x;
            this.y *= v.y;
            this.z *= v.z;
            return this;
        };
        Vector3.prototype.divide = function (v) {
            this.x /= v.x;
            this.y /= v.y;
            this.z /= v.z;
            return this;
        };
        Object.defineProperty(Vector3, "zero", {
            get: function () {
                return new Vector3();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Vector3, "one", {
            get: function () {
                return new Vector3(1, 1, 1);
            },
            enumerable: false,
            configurable: true
        });
        Vector3.distance = function (a, b) {
            var diff = a.sub(b);
            return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
        };
        return Vector3;
    }());

    exports.Matrix4 = Matrix4;
    exports.Mesh = Mesh;
    exports.Shader = Shader;
    exports.Vector3 = Vector3;
    exports.VertexBuffer = VertexBuffer;
    exports.VertexFormat = VertexFormat;
    exports.init = init;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=start3d.umd.js.map
