!function(t){var e={};function r(n){if(e[n])return e[n].exports;var i=e[n]={i:n,l:!1,exports:{}};return t[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=t,r.c=e,r.d=function(t,e,n){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)r.d(n,i,function(e){return t[e]}.bind(null,i));return n},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=2)}([function(t,e,r){"use strict";var n,i;r.d(e,"a",(function(){return x})),r.d(e,"b",(function(){return d})),r.d(e,"c",(function(){return p})),r.d(e,"d",(function(){return u})),r.d(e,"e",(function(){return T})),r.d(e,"f",(function(){return f})),r.d(e,"g",(function(){return o})),r.d(e,"h",(function(){return i})),r.d(e,"i",(function(){return n})),r.d(e,"j",(function(){return s}));var o,s=function(t){if(t){if(void 0===(i=document.getElementById(t)))throw new Error("Cannot find a canvas element by Id:"+t)}else(i=document.createElement("canvas")).id="start3d",document.body.appendChild(i);i.setAttribute("style","position: absolute;\n        left: 50%;\n        top: 50%;\n        transform: translate(-50%,-50%);\n        width: 100vw;\n        height: 100vh;\n        display: block;"),i.width=Math.floor(i.clientWidth*window.devicePixelRatio),i.height=Math.floor(i.clientHeight*window.devicePixelRatio),(n=i.getContext("webgl")).viewport(0,0,i.width,i.height)},a=function(t,e,r,n,i){this.name=t,this.location=e,this.type=r,this.size=n,this.isArray=i},u=function(){function t(){this._attributes={},this._uniforms={},this._semanticToAttribMap={}}return t.prototype.mapAttributeSemantic=function(t,e){this._semanticToAttribMap[t]=e},t.prototype.load=function(t,e){var r=this.loadShader(t,n.VERTEX_SHADER),i=this.loadShader(e,n.FRAGMENT_SHADER);this.createProgram(r,i),this.queryAttributes(),this.queryUniforms()},t.prototype.loadShader=function(t,e){var r=n.createShader(e);if(n.shaderSource(r,t),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS)){var i=n.getShaderInfoLog(r);if(""!==i)throw new Error("Error compiling shader:"+i)}return r},t.prototype.createProgram=function(t,e){if(this._program=n.createProgram(),n.attachShader(this._program,t),n.attachShader(this._program,e),n.linkProgram(this._program),!n.getProgramParameter(this._program,n.LINK_STATUS)){var r=n.getProgramInfoLog(this._program);if(""!==r)throw new Error("Failed to link program: "+r)}},t.prototype.queryAttributes=function(){for(var t=n.getProgramParameter(this._program,n.ACTIVE_ATTRIBUTES),e=0;e<t;e++){var r=n.getActiveAttrib(this._program,e);if(!r)break;this._attributes[r.name]=n.getAttribLocation(this._program,r.name)}},t.prototype.queryUniforms=function(){for(var t=n.getProgramParameter(this._program,n.ACTIVE_UNIFORMS),e=0;e<t;e++){var r=n.getActiveUniform(this._program,e);if(!r)break;var i=n.getUniformLocation(this._program,r.name),o=r.size>1&&"[0]"===r.name.substr(-3),s=new a(r.name,i,r.type,r.size,o);this._uniforms[r.name]=s}},t.prototype.getAttributeLocation=function(t){var e=this._semanticToAttribMap[t];return e?this._attributes[e]:(console.error("Shader: can not find attribute for semantic "+t),-1)},t.prototype.setUniform=function(t,e){var r=this._uniforms[t];if(null!==r)switch(r.type){case n.FLOAT:r.isArray?n.uniform1fv(r.location,e):n.uniform1f(r.location,e);break;case n.FLOAT_VEC2:n.uniform2fv(r.location,e);break;case n.FLOAT_VEC3:n.uniform3fv(r.location,e);break;case n.FLOAT_VEC4:n.uniform4fv(r.location,e);break;case n.FLOAT_MAT4:n.uniformMatrix4fv(r.location,!1,e);break;default:console.error("uniform type not support ",r.type)}else console.error("can not find uniform named "+t)},t.prototype.use=function(){this._program?n.useProgram(this._program):console.error("create progarm first!")},t}();!function(t){t.POSITION="position",t.NORMAL="normal",t.TANGENT="tangent",t.COLOR="color",t.UV0="uv0",t.UV1="uv1",t.UV2="uv2",t.UV3="uv3"}(o||(o={}));var f=function(){function t(){this._vertexSize=0,this.attribs=[],this.attribSizeMap={}}return Object.defineProperty(t.prototype,"attribCount",{get:function(){return this.attribs.length},enumerable:!1,configurable:!0}),t.prototype.addAttrib=function(t,e){this.attribs.push(t),this.attribSizeMap[t]=e},t.prototype.getVertexSize=function(){return this.updateVertexSize(),this._vertexSize},t.prototype.updateVertexSize=function(){this._vertexSize=0;for(var t=0;t<this.attribs.length;t++){var e=this.attribs[t];this._vertexSize+=this.attribSizeMap[e]}},t}(),c=function(t,e){this.offset=0,this.size=0,this.data=null,this.semantic=t,this.size=e},l=function(){function t(t){this._vertexCount=0,this._vertexStride=0,this._attribInfoMap={},this._vbo=n.createBuffer(),this._bufferData=null,this.BYTES_PER_ELEMENT=4,this._vertexFormat=t;for(var e=this._vertexFormat.attribCount,r=0;r<e;r++){var i=this._vertexFormat.attribs[r],o=this._vertexFormat.attribSizeMap[i];if(null===o)console.error("VertexBuffer: bad semantic!");else{var s=new c(i,o);this._attribInfoMap[i]=s}}}return Object.defineProperty(t.prototype,"vbo",{get:function(){return this._vbo},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"vertexCount",{get:function(){return this._vertexCount},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"vertexStride",{get:function(){return this._vertexStride},enumerable:!1,configurable:!0}),t.prototype.setData=function(t,e){this._attribInfoMap[t].data=e},t.prototype._compile=function(){var t=this._attribInfoMap[o.POSITION];if(null===t&&console.error("VertexBuffer: no attribute position!"),null!==t.data&&0!==t.data.length){this._vertexCount=t.data.length/t.size,this._vertexStride=this._vertexFormat.getVertexSize()*this.BYTES_PER_ELEMENT,this._bufferData=[];for(var e=0;e<this._vertexCount;e++)for(var r=0,n=this._vertexFormat.attribs;r<n.length;r++){var i=n[r];if(null!==(l=this._attribInfoMap[i])&&null!==l.data)for(var s=0;s<l.size;s++){var a=l.data[e*l.size+s];void 0===a&&console.error("VertexBuffer: missing value for "+i),this._bufferData.push(a)}else console.error("VertexBuffer: bad semantic "+i)}for(var u=0,f=0,c=this._vertexFormat.attribs;f<c.length;f++){var l;i=c[f];(l=this._attribInfoMap[i]).offset=u,l.data=null,u+=l.size*this.BYTES_PER_ELEMENT}}else console.error("VertexBuffer: position data is empty!")},t.prototype.upload=function(){this._compile();var t=new Float32Array(this._bufferData);n.bindBuffer(n.ARRAY_BUFFER,this._vbo),n.bufferData(n.ARRAY_BUFFER,t,n.STATIC_DRAW),n.bindBuffer(n.ARRAY_BUFFER,null),this._bufferData=null},t.prototype.bindAttrib=function(t){for(var e=0,r=this._vertexFormat.attribs;e<r.length;e++){var i=r[e],o=this._attribInfoMap[i],s=t.getAttributeLocation(i);s>=0&&(n.vertexAttribPointer(s,o.size,n.FLOAT,!1,this._vertexStride,o.offset),n.enableVertexAttribArray(s))}},t.prototype.unbindAttrb=function(t){for(var e=0,r=this._vertexFormat.attribs;e<r.length;e++){var i=r[e],o=t.getAttributeLocation(i);o>=0&&n.disableVertexAttribArray(o)}},t.prototype.destroy=function(){n.deleteBuffer(this._vbo),this._vbo=0},t}(),h=function(){function t(){this._indexCount=0,this._mode=n.TRIANGLES,this._type=n.UNSIGNED_SHORT,this._ibo=n.createBuffer(),this._bufferData=null}return Object.defineProperty(t.prototype,"ibo",{get:function(){return this._ibo},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"indexCount",{get:function(){return this._indexCount},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"mode",{get:function(){return this._mode},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"type",{get:function(){return this._type},enumerable:!1,configurable:!0}),t.prototype.setData=function(t){this._bufferData=t},t.prototype.upload=function(){if(null!=this._bufferData){var t=this._bufferData.length<=256,e=t?new Uint8Array(this._bufferData):new Uint16Array(this._bufferData);this._type=t?n.UNSIGNED_BYTE:n.UNSIGNED_SHORT,n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,this._ibo),n.bufferData(n.ELEMENT_ARRAY_BUFFER,e,n.STATIC_DRAW),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,null),this._indexCount=e.length,this._bufferData=null}else console.error("buffer data is null!")},t.prototype.destroy=function(){n.deleteBuffer(this._ibo),this._ibo=null},t}(),p=function(){function t(t){this._vertexBuffer=new l(t)}return t.prototype.setVertexData=function(t,e){this._vertexBuffer.setData(t,e)},t.prototype.setTriangles=function(t){null==this._indexBuffer&&(this._indexBuffer=new h),this._indexBuffer.setData(t)},t.prototype.upload=function(){this._vertexBuffer.upload(),this._indexBuffer&&this._indexBuffer.upload()},t.prototype.render=function(t){if(n.bindBuffer(n.ARRAY_BUFFER,this._vertexBuffer.vbo),this._vertexBuffer.bindAttrib(t),this._indexBuffer){var e=this._indexBuffer,r=e.ibo,i=e.type,o=e.mode,s=e.indexCount;n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,r),n.drawElements(o,s,i,0),n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,null)}else n.drawArrays(n.TRIANGLES,0,this._vertexBuffer.vertexCount);this._vertexBuffer.unbindAttrb(t),n.bindBuffer(n.ARRAY_BUFFER,null)},t.prototype.destroy=function(){this._vertexBuffer.destroy(),this._indexBuffer&&this._indexBuffer.destroy()},t}(),d=function(){function t(){this.elements=new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1])}return t.prototype.setIdentity=function(){var t=this.elements;return t[0]=1,t[4]=0,t[8]=0,t[12]=0,t[1]=0,t[5]=1,t[9]=0,t[13]=0,t[2]=0,t[6]=0,t[10]=1,t[14]=0,t[3]=0,t[7]=0,t[11]=0,t[15]=1,this},t.prototype.set=function(t){var e=t.elements,r=this.elements;if(e===r)return this;for(var n=0;n<16;n++)r[n]=e[n];return this},t.prototype.concat=function(t){var e=this.elements,r=this.elements,n=t.elements;if(e===n)for(var i=new Float32Array(16),o=0;o<16;++o)i[o]=e[o];for(o=0;o<4;o++){var s=r[o],a=r[o+4],u=r[o+8],f=r[o+12];e[o]=s*n[0]+a*n[1]+u*n[2]+f*n[3],e[o+4]=s*n[4]+a*n[5]+u*n[6]+f*n[7],e[o+8]=s*n[8]+a*n[9]+u*n[10]+f*n[11],e[o+12]=s*n[12]+a*n[13]+u*n[14]+f*n[15]}return this},t.prototype.multiply=function(t){var e=this.elements,r=this.elements,n=t.elements;if(e===n){n=new Float32Array(16);for(var i=0;i<16;++i)n[i]=e[i]}for(i=0;i<4;i++){var o=r[i],s=r[i+4],a=r[i+8],u=r[i+12];e[i]=o*n[0]+s*n[1]+a*n[2]+u*n[3],e[i+4]=o*n[4]+s*n[5]+a*n[6]+u*n[7],e[i+8]=o*n[8]+s*n[9]+a*n[10]+u*n[11],e[i+12]=o*n[12]+s*n[13]+a*n[14]+u*n[15]}return this},t.prototype.setTranslate=function(t,e,r){var n=this.elements;return n[0]=1,n[4]=0,n[8]=0,n[12]=t,n[1]=0,n[5]=1,n[9]=0,n[13]=e,n[2]=0,n[6]=0,n[10]=1,n[14]=r,n[3]=0,n[7]=0,n[11]=0,n[15]=1,this},t.prototype.translate=function(t,e,r){var n=this.elements;return n[12]+=n[0]*t+n[4]*e+n[8]*r,n[13]+=n[1]*t+n[5]*e+n[9]*r,n[14]+=n[2]*t+n[6]*e+n[10]*r,n[15]+=n[3]*t+n[7]*e+n[11]*r,this},t.prototype.setScale=function(t,e,r){var n=this.elements;return n[0]=t,n[4]=0,n[8]=0,n[12]=0,n[1]=0,n[5]=e,n[9]=0,n[13]=0,n[2]=0,n[6]=0,n[10]=r,n[14]=0,n[3]=0,n[7]=0,n[11]=0,n[15]=1,this},t.prototype.scale=function(t,e,r){var n=this.elements;return n[0]*=t,n[4]*=e,n[8]*=r,n[1]*=t,n[5]*=e,n[9]*=r,n[2]*=t,n[6]*=e,n[10]*=r,n[3]*=t,n[7]*=e,n[11]*=r,this},t.prototype.setRotate=function(t,e,r,n){t=Math.PI*t/180;var i=this.elements,o=Math.sin(t),s=Math.cos(t);if(0!==e&&0===r&&0===n)e<0&&(o=-o),i[0]=1,i[4]=0,i[8]=0,i[12]=0,i[1]=0,i[5]=s,i[9]=-o,i[13]=0,i[2]=0,i[6]=o,i[10]=s,i[14]=0,i[3]=0,i[7]=0,i[11]=0,i[15]=1;else if(0===e&&0!==r&&0===n)r<0&&(o=-o),i[0]=s,i[4]=0,i[8]=o,i[12]=0,i[1]=0,i[5]=1,i[9]=0,i[13]=0,i[2]=-o,i[6]=0,i[10]=s,i[14]=0,i[3]=0,i[7]=0,i[11]=0,i[15]=1;else if(0===e&&0===r&&0!==n)n<0&&(o=-o),i[0]=s,i[4]=-o,i[8]=0,i[12]=0,i[1]=o,i[5]=s,i[9]=0,i[13]=0,i[2]=0,i[6]=0,i[10]=1,i[14]=0,i[3]=0,i[7]=0,i[11]=0,i[15]=1;else{var a=Math.sqrt(e*e+r*r+n*n);if(1!==a){var u=1/a;e*=u,r*=u,n*=u}var f=1-s,c=e*r,l=r*n,h=n*e,p=e*o,d=r*o,_=n*o;i[0]=e*e*f+s,i[1]=c*f+_,i[2]=h*f-d,i[3]=0,i[4]=c*f-_,i[5]=r*r*f+s,i[6]=l*f+p,i[7]=0,i[8]=h*f+d,i[9]=l*f-p,i[10]=n*n*f+s,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1}return this},t.prototype.rotate=function(e,r,n,i){return this.multiply((new t).setRotate(e,r,n,i))},t.prototype.setLookAt=function(t,e,r,n,i,o,s,a,u){var f=t-n,c=e-i,l=r-o,h=1/Math.sqrt(f*f+c*c+l*l),p=a*(l*=h)-u*(c*=h),d=u*(f*=h)-s*l,_=s*c-a*f,b=c*(_*=h=1/Math.sqrt(p*p+d*d+_*_))-l*(d*=h),v=l*(p*=h)-f*_,y=f*d-c*p;b*=h=1/Math.sqrt(b*b+v*v+y*y),v*=h,y*=h;var m=this.elements;return m[0]=p,m[1]=b,m[2]=f,m[3]=0,m[4]=d,m[5]=v,m[6]=c,m[7]=0,m[8]=_,m[9]=y,m[10]=l,m[11]=0,m[12]=0,m[13]=0,m[14]=0,m[15]=1,this.translate(-t,-e,-r)},t.prototype.lookAt=function(e,r,n,i,o,s,a,u,f){return this.concat((new t).setLookAt(e,r,n,i,o,s,a,u,f))},t.prototype.setOrtho=function(t,e,r,n,i,o){if(t!==e&&r!==n&&i!==o){var s=1/(e-t),a=1/(n-r),u=1/(o-i),f=this.elements;return f[0]=2*s,f[1]=0,f[2]=0,f[3]=0,f[4]=0,f[5]=2*a,f[6]=0,f[7]=0,f[8]=0,f[9]=0,f[10]=-2*u,f[11]=0,f[12]=-(e+t)*s,f[13]=-(n+r)*a,f[14]=-(o+i)*u,f[15]=1,this}console.error("wrong param")},t.prototype.setFrustum=function(t,e,r,n,i,o){if(t!==e&&r!==n&&i!==o)if(i<=0)console.error("wrong near");else{if(!(o<=0)){var s=1/(e-t),a=1/(n-r),u=1/(o-i),f=this.elements;return f[0]=2*i*s,f[1]=0,f[2]=0,f[3]=0,f[4]=0,f[5]=2*i*a,f[6]=0,f[7]=0,f[8]=(e+t)*s,f[9]=(n+r)*a,f[10]=-(o+i)*u,f[11]=-1,f[12]=0,f[13]=0,f[14]=-2*i*o*u,f[15]=0,this}console.error("wrong far")}else console.error("wrong param")},t.prototype.setPerspective=function(t,e,r,n){if(r===n||0===e||r<=0||n<=0)console.error("wrong param");else{var i=t*Math.PI/180/2,o=Math.sin(i);if(0!==o){var s=Math.cos(i)/o,a=1/(n-r),u=this.elements;return u[0]=s/e,u[1]=0,u[2]=0,u[3]=0,u[4]=0,u[5]=s,u[6]=0,u[7]=0,u[8]=0,u[9]=0,u[10]=-(n+r)*a,u[11]=-1,u[12]=0,u[13]=0,u[14]=-2*r*n*a,u[15]=0,this}console.error("wrong param")}},t.prototype.setInverseOf=function(t){var e=t.elements,r=this.elements,n=new Float32Array(16);n[0]=e[5]*e[10]*e[15]-e[5]*e[11]*e[14]-e[9]*e[6]*e[15]+e[9]*e[7]*e[14]+e[13]*e[6]*e[11]-e[13]*e[7]*e[10],n[4]=-e[4]*e[10]*e[15]+e[4]*e[11]*e[14]+e[8]*e[6]*e[15]-e[8]*e[7]*e[14]-e[12]*e[6]*e[11]+e[12]*e[7]*e[10],n[8]=e[4]*e[9]*e[15]-e[4]*e[11]*e[13]-e[8]*e[5]*e[15]+e[8]*e[7]*e[13]+e[12]*e[5]*e[11]-e[12]*e[7]*e[9],n[12]=-e[4]*e[9]*e[14]+e[4]*e[10]*e[13]+e[8]*e[5]*e[14]-e[8]*e[6]*e[13]-e[12]*e[5]*e[10]+e[12]*e[6]*e[9],n[1]=-e[1]*e[10]*e[15]+e[1]*e[11]*e[14]+e[9]*e[2]*e[15]-e[9]*e[3]*e[14]-e[13]*e[2]*e[11]+e[13]*e[3]*e[10],n[5]=e[0]*e[10]*e[15]-e[0]*e[11]*e[14]-e[8]*e[2]*e[15]+e[8]*e[3]*e[14]+e[12]*e[2]*e[11]-e[12]*e[3]*e[10],n[9]=-e[0]*e[9]*e[15]+e[0]*e[11]*e[13]+e[8]*e[1]*e[15]-e[8]*e[3]*e[13]-e[12]*e[1]*e[11]+e[12]*e[3]*e[9],n[13]=e[0]*e[9]*e[14]-e[0]*e[10]*e[13]-e[8]*e[1]*e[14]+e[8]*e[2]*e[13]+e[12]*e[1]*e[10]-e[12]*e[2]*e[9],n[2]=e[1]*e[6]*e[15]-e[1]*e[7]*e[14]-e[5]*e[2]*e[15]+e[5]*e[3]*e[14]+e[13]*e[2]*e[7]-e[13]*e[3]*e[6],n[6]=-e[0]*e[6]*e[15]+e[0]*e[7]*e[14]+e[4]*e[2]*e[15]-e[4]*e[3]*e[14]-e[12]*e[2]*e[7]+e[12]*e[3]*e[6],n[10]=e[0]*e[5]*e[15]-e[0]*e[7]*e[13]-e[4]*e[1]*e[15]+e[4]*e[3]*e[13]+e[12]*e[1]*e[7]-e[12]*e[3]*e[5],n[14]=-e[0]*e[5]*e[14]+e[0]*e[6]*e[13]+e[4]*e[1]*e[14]-e[4]*e[2]*e[13]-e[12]*e[1]*e[6]+e[12]*e[2]*e[5],n[3]=-e[1]*e[6]*e[11]+e[1]*e[7]*e[10]+e[5]*e[2]*e[11]-e[5]*e[3]*e[10]-e[9]*e[2]*e[7]+e[9]*e[3]*e[6],n[7]=e[0]*e[6]*e[11]-e[0]*e[7]*e[10]-e[4]*e[2]*e[11]+e[4]*e[3]*e[10]+e[8]*e[2]*e[7]-e[8]*e[3]*e[6],n[11]=-e[0]*e[5]*e[11]+e[0]*e[7]*e[9]+e[4]*e[1]*e[11]-e[4]*e[3]*e[9]-e[8]*e[1]*e[7]+e[8]*e[3]*e[5],n[15]=e[0]*e[5]*e[10]-e[0]*e[6]*e[9]-e[4]*e[1]*e[10]+e[4]*e[2]*e[9]+e[8]*e[1]*e[6]-e[8]*e[2]*e[5];var i=e[0]*n[0]+e[1]*n[4]+e[2]*n[8]+e[3]*n[12];if(0===i)return this;i=1/i;for(var o=0;o<16;++o)r[o]=n[o]*i;return this},t.prototype.invert=function(){return this.setInverseOf(this)},t.prototype.transpose=function(){var t,e=this.elements;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this},t}(),_=(function(){function t(t,e,r){void 0===t&&(t=0),void 0===e&&(e=0),void 0===r&&(r=0),this.x=t,this.y=e,this.z=r}t.prototype.set=function(t,e,r){return this.x=t,this.y=e,this.z=r,this},t.prototype.length=function(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)},t.prototype.equals=function(t){return this.x==t.x&&this.y==t.y&&this.z==t.z},t.prototype.copyFrom=function(t){return this.x=t.x,this.y=t.y,this.z=t.z,this},t.prototype.clone=function(){return new t(this.x,this.y,this.z)},t.prototype.add=function(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this},t.prototype.sub=function(t){return this.x-=this.x,this.y-=this.y,this.z-=this.z,this},t.prototype.multiply=function(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this},t.prototype.divide=function(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this},Object.defineProperty(t,"zero",{get:function(){return new t},enumerable:!1,configurable:!0}),Object.defineProperty(t,"one",{get:function(){return new t(1,1,1)},enumerable:!1,configurable:!0}),t.distance=function(t,e){var r=t.sub(e);return Math.sqrt(r.x*r.x+r.y*r.y+r.z*r.z)}}(),function(t,e){return(_=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,e){t.__proto__=e}||function(t,e){for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[r]=e[r])})(t,e)});var b=function(){function t(){this._listeners={}}return t.prototype.addEventListener=function(t,e){void 0===this._listeners&&(this._listeners={});var r=this._listeners;void 0===r[t]&&(r[t]=[]),-1===r[t].indexOf(e)&&r[t].push(e)},t.prototype.hasEventListener=function(t,e){if(void 0===this._listeners)return!1;var r=this._listeners;return void 0!==r[t]&&-1!==r[t].indexOf(e)},t.prototype.removeEventListener=function(t,e){if(void 0!==this._listeners){var r=this._listeners[t];if(void 0!==r){var n=r.indexOf(e);-1!==n&&r.splice(n,1)}}},t.prototype.dispatchEvent=function(t){if(void 0!==this._listeners){var e=this._listeners[t.type];if(void 0!==e){t.target=this;for(var r=e.slice(0),n=0,i=r.length;n<i;n++)r[n].call(this,t);t.target=null}}},t}(),v=function(){function t(t,e){this.data=e,this.name=t}return Object.defineProperty(t.prototype,"width",{get:function(){return this.data.width},enumerable:!1,configurable:!0}),Object.defineProperty(t.prototype,"height",{get:function(){return this.data.height},enumerable:!1,configurable:!0}),t}(),y=function(){function t(){}return Object.defineProperty(t.prototype,"supportedExtensions",{get:function(){return["png","jpg","jpeg"]},enumerable:!1,configurable:!0}),t.prototype.loadAsset=function(t,e){var r=new Image;r.onload=function(){var n=new v(t,r);e(n)},r.src=t},t}(),m=function(t,e){this.data=e,this.name=t},g=function(){function t(){}return Object.defineProperty(t.prototype,"supportedExtensions",{get:function(){return["txt","vs","fs","frag","vert","shader"]},enumerable:!1,configurable:!0}),t.prototype.loadAsset=function(t,e){var r=new XMLHttpRequest;r.onreadystatechange=function(){if(r.readyState===XMLHttpRequest.DONE&&404!==r.status){var n=new m(t,r.responseText);e&&e(n)}},r.open("GET",t,!0),r.send()},t}(),x=function(t){function e(){return t.call(this)||this}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function r(){this.constructor=t}_(t,e),t.prototype=null===e?Object.create(e):(r.prototype=e.prototype,new r)}(e,t),e.initialize=function(){e._loaders.push(new y),e._loaders.push(new g)},e.registerLoader=function(t){e._loaders.push(t)},e.loadAsset=function(t,r){if(this._loaderAssets[t])r&&r(this._loaderAssets[t]);else{for(var n=t.split(".").pop().toLowerCase(),i=0,o=e._loaders;i<o.length;i++){var s=o[i];if(-1!==s.supportedExtensions.indexOf(n))return void s.loadAsset(t,(function(t){e._loaderAssets[t.name]=t,r(t)}))}console.warn("Unable to load asset with extension "+n+"because there is no loader associated with it.")}},e.loadAssetList=function(t,e){for(var r=t.length,n=function(n){var o=t[n];i.loadAsset(o,(function(t){console.log(t),t?0===--r&&e&&e():console.error("fail to load asset "+o)}))},i=this,o=0;o<r;o++)n(o)},e.isAssetLoaded=function(t){return void 0!==e._loaderAssets[t]},e.getAsset=function(t){if(null!=e._loaderAssets[t])return e._loaderAssets[t]},e._loaders=[],e._loaderAssets={},e}(b),E=function(){function t(){this._id=0,this._id=n.createTexture(),this._id||console.error("Failed to create the texture buffer")}return Object.defineProperty(t.prototype,"id",{get:function(){return this._id},enumerable:!1,configurable:!0}),t.prototype.load=function(t){n.bindTexture(n.TEXTURE_2D,this._id),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.LINEAR),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),n.texImage2D(n.TEXTURE_2D,0,n.RGB,n.RGB,n.UNSIGNED_BYTE,t),n.bindTexture(n.TEXTURE_2D,null)},t.prototype.bind=function(t){void 0===t&&(t=0),n.activeTexture(n.TEXTURE0+t),n.bindTexture(n.TEXTURE_2D,this._id)},t.prototype.unbind=function(){n.bindTexture(n.TEXTURE_2D,null)},t.prototype.destory=function(){n.deleteTexture(this._id),this._id=0},t}(),A=function(t){this.referenceCount=1,this.texture=t},T=function(){function t(){}return t.getTexture=function(e){if(void 0===t._textures[e]){var r=new E;r.load(x.getAsset(e).data),t._textures[e]=new A(r)}else t._textures[e].referenceCount++;return t._textures[e].texture},t.releaseTexture=function(e){void 0===t._textures[e]?console.warn("A texture named ".concat(e," does not exist and therefore cannot be released.")):(t._textures[e].referenceCount--,t._textures[e].referenceCount<1&&(t._textures[e].texture.destory(),t._textures[e]=null,delete t._textures[e]))},t._textures={},t}()},,function(t,e,r){"use strict";r.r(e);var n,i=r(0),o=function(t,e,r,n){return new(r||(r=Promise))((function(i,o){function s(t){try{u(n.next(t))}catch(t){o(t)}}function a(t){try{u(n.throw(t))}catch(t){o(t)}}function u(t){var e;t.done?i(t.value):(e=t.value,e instanceof r?e:new r((function(t){t(e)}))).then(s,a)}u((n=n.apply(t,e||[])).next())}))},s=function(t,e){var r,n,i,o,s={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(o){return function(a){return function(o){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,n&&(i=2&o[0]?n.return:o[0]?n.throw||((i=n.return)&&i.call(n),0):n.next)&&!(i=i.call(n,o[1])).done)return i;switch(n=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return s.label++,{value:o[1],done:!1};case 5:s.label++,n=o[1],o=[0];continue;case 7:o=s.ops.pop(),s.trys.pop();continue;default:if(!(i=s.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){s=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){s.label=o[1];break}if(6===o[0]&&s.label<i[1]){s.label=i[1],i=o;break}if(i&&s.label<i[2]){s.label=i[2],s.ops.push(o);break}i[2]&&s.ops.pop(),s.trys.pop();continue}o=e.call(t,s)}catch(t){o=[6,t],n=0}finally{r=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,a])}}},a=0;window.onload=function(){u()};var u=function(){return o(void 0,void 0,void 0,(function(){var t,e,r,o,u;return s(this,(function(s){switch(s.label){case 0:return Object(i.j)(),t=new i.d,[4,f("../assets/glsl/basic.vs")];case 1:return e=s.sent(),[4,f("../assets/glsl/basic.fs")];case 2:return r=s.sent(),t.load(e,r),t.use(),t.mapAttributeSemantic(i.g.POSITION,"a_Position"),t.mapAttributeSemantic(i.g.COLOR,"a_Color"),o=function(){var t=new i.f;t.addAttrib(i.g.POSITION,3),t.addAttrib(i.g.COLOR,3);var e=new i.c(t);return e.setVertexData(i.g.POSITION,[1,1,1,-1,1,1,-1,-1,1,1,-1,1,1,-1,-1,1,1,-1,-1,1,-1,-1,-1,-1]),e.setVertexData(i.g.COLOR,[1,1,1,1,0,1,1,0,0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,0]),e.setTriangles([0,1,2,0,2,3,0,3,4,0,4,5,0,5,6,0,6,1,1,6,7,1,7,2,7,4,3,7,3,2,4,7,6,4,6,5]),e.upload(),e}(),(n=new i.b).setPerspective(30,i.h.width/i.h.height,1,300),n.lookAt(3,3,7,0,0,0,0,1,0),i.i.enable(i.i.DEPTH_TEST),(u=function(){!function(t,e){a+=1;var r=new i.b;r.set(n),r.rotate(a,1,0,0),r.rotate(a,0,1,0),i.i.clearColor(0,0,0,1),i.i.clear(i.i.COLOR_BUFFER_BIT|i.i.DEPTH_BUFFER_BIT),e.setUniform("u_MvpMatrix",r.elements),t.render(e)}(o,t),requestAnimationFrame(u)})(),[2]}}))}))};function f(t){return new Promise((function(e,r){fetch(t).then((function(t){return t.text()})).then((function(t){e(t)})).catch((function(t){r(t)}))}))}}]);