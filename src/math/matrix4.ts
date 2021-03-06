// source code see:http://rodger.global-linguist.com/webgl/lib/cuon-matrix.js
export class Matrix4 {
    public elements: Float32Array;
    constructor() {
        this.elements = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);
    }

    setIdentity(): Matrix4 {
        let elements = this.elements;
        elements[0] = 1; elements[4] = 0; elements[8] = 0; elements[12] = 0;
        elements[1] = 0; elements[5] = 1; elements[9] = 0; elements[13] = 0;
        elements[2] = 0; elements[6] = 0; elements[10] = 1; elements[14] = 0;
        elements[3] = 0; elements[7] = 0; elements[11] = 0; elements[15] = 1;

        return this;
    }

    set(m: Matrix4) {
        let src = m.elements;
        let dst = this.elements;
        if (src === dst) {
            return this;
        }

        for (let i = 0; i < 16; i++) {
            dst[i] = src[i];
        }

        return this;
    }

    concat(m:Matrix4):Matrix4 {
        // Calculate e = a * b
        let e = this.elements;
        let a = this.elements;
        let b = m.elements;
        
        // If e equals b, copy b to temporary matrix.
        if (e === b) {
            let b = new Float32Array(16);
          for (let i = 0; i < 16; ++i) {
            b[i] = e[i];
          }
        }
        
        for (let i = 0; i < 4; i++) {
            let ai0=a[i];  let ai1=a[i+4];  let ai2=a[i+8];  let ai3=a[i+12];
          e[i]    = ai0 * b[0]  + ai1 * b[1]  + ai2 * b[2]  + ai3 * b[3];
          e[i+4]  = ai0 * b[4]  + ai1 * b[5]  + ai2 * b[6]  + ai3 * b[7];
          e[i+8]  = ai0 * b[8]  + ai1 * b[9]  + ai2 * b[10] + ai3 * b[11];
          e[i+12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
        }
        
        return this;
      };

    multiply(m: Matrix4): Matrix4 {
        // var i, e, a, b, ai0, ai1, ai2, ai3;

        // Calculate e = a * b
        let e = this.elements;
        let a = this.elements;
        let b = m.elements;

        // If e equals b, copy b to temporary matrix.
        if (e === b) {
            b = new Float32Array(16);
            for (let i = 0; i < 16; ++i) {
                b[i] = e[i];
            }
        }

        for (let i = 0; i < 4; i++) {
            let ai0 = a[i]; let ai1 = a[i + 4]; let ai2 = a[i + 8]; let ai3 = a[i + 12];
            e[i] = ai0 * b[0] + ai1 * b[1] + ai2 * b[2] + ai3 * b[3];
            e[i + 4] = ai0 * b[4] + ai1 * b[5] + ai2 * b[6] + ai3 * b[7];
            e[i + 8] = ai0 * b[8] + ai1 * b[9] + ai2 * b[10] + ai3 * b[11];
            e[i + 12] = ai0 * b[12] + ai1 * b[13] + ai2 * b[14] + ai3 * b[15];
        }

        return this;
    }

    setTranslate(x: number, y: number, z: number): Matrix4 {
        let elements = this.elements;
        elements[0] = 1; elements[4] = 0; elements[8] = 0; elements[12] = x;
        elements[1] = 0; elements[5] = 1; elements[9] = 0; elements[13] = y;
        elements[2] = 0; elements[6] = 0; elements[10] = 1; elements[14] = z;
        elements[3] = 0; elements[7] = 0; elements[11] = 0; elements[15] = 1;
        return this;
    }

    translate(x: number, y: number, z: number): Matrix4 {
        let elements = this.elements;
        elements[12] += elements[0] * x + elements[4] * y + elements[8] * z;
        elements[13] += elements[1] * x + elements[5] * y + elements[9] * z;
        elements[14] += elements[2] * x + elements[6] * y + elements[10] * z;
        elements[15] += elements[3] * x + elements[7] * y + elements[11] * z;
        return this;
    }

    setScale(sx: number, sy: number, sz: number): Matrix4 {
        let elements = this.elements;
        elements[0] = sx; elements[4] = 0; elements[8] = 0; elements[12] = 0;
        elements[1] = 0; elements[5] = sy; elements[9] = 0; elements[13] = 0;
        elements[2] = 0; elements[6] = 0; elements[10] = sz; elements[14] = 0;
        elements[3] = 0; elements[7] = 0; elements[11] = 0; elements[15] = 1;
        return this;
    }

    scale(sx: number, sy: number, sz: number): Matrix4 {
        let elements = this.elements;
        elements[0] *= sx; elements[4] *= sy; elements[8] *= sz;
        elements[1] *= sx; elements[5] *= sy; elements[9] *= sz;
        elements[2] *= sx; elements[6] *= sy; elements[10] *= sz;
        elements[3] *= sx; elements[7] *= sy; elements[11] *= sz;
        return this;

    }

    setRotate(angle: number, x: number, y: number, z: number): Matrix4 {
        // let e, s, c, len, rlen, nc, xy, yz, zx, xs, ys, zs;

        angle = Math.PI * angle / 180;
        let e = this.elements;

        let s = Math.sin(angle);
        let c = Math.cos(angle);

        if (0 !== x && 0 === y && 0 === z) {
            // Rotation around X axis
            if (x < 0) {
                s = -s;
            }
            e[0] = 1; e[4] = 0; e[8] = 0; e[12] = 0;
            e[1] = 0; e[5] = c; e[9] = -s; e[13] = 0;
            e[2] = 0; e[6] = s; e[10] = c; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else if (0 === x && 0 !== y && 0 === z) {
            // Rotation around Y axis
            if (y < 0) {
                s = -s;
            }
            e[0] = c; e[4] = 0; e[8] = s; e[12] = 0;
            e[1] = 0; e[5] = 1; e[9] = 0; e[13] = 0;
            e[2] = -s; e[6] = 0; e[10] = c; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else if (0 === x && 0 === y && 0 !== z) {
            // Rotation around Z axis
            if (z < 0) {
                s = -s;
            }
            e[0] = c; e[4] = -s; e[8] = 0; e[12] = 0;
            e[1] = s; e[5] = c; e[9] = 0; e[13] = 0;
            e[2] = 0; e[6] = 0; e[10] = 1; e[14] = 0;
            e[3] = 0; e[7] = 0; e[11] = 0; e[15] = 1;
        } else {
            // Rotation around another axis
            let len = Math.sqrt(x * x + y * y + z * z);
            if (len !== 1) {
                let rlen = 1 / len;
                x *= rlen;
                y *= rlen;
                z *= rlen;
            }
            let nc = 1 - c;
            let xy = x * y;
            let yz = y * z;
            let zx = z * x;
            let xs = x * s;
            let ys = y * s;
            let zs = z * s;

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
    }

    rotate(angle: number, x: number, y: number, z: number): Matrix4 {
        return this.multiply(new Matrix4().setRotate(angle, x, y, z));
    }

    setLookAt(eyeX: number, eyeY: number, eyeZ: number, targetX: number, targetY: number, targetZ: number, upX: number, upY: number, upZ: number): Matrix4 {
        // N = eye - target
        let nx = eyeX - targetX;
        let ny = eyeY - targetY;
        let nz = eyeZ - targetZ;
        let rl = 1 / Math.sqrt(nx * nx + ny * ny + nz * nz);
        nx *= rl;
        ny *= rl;
        nz *= rl;
        // U = UP cross N
        let ux = upY * nz - upZ * ny;
        let uy = upZ * nx - upX * nz;
        let uz = upX * ny - upY * nx;
        rl = 1 / Math.sqrt(ux * ux + uy * uy + uz * uz);
        ux *= rl;
        uy *= rl;
        uz *= rl;
        // V = N cross U
        let vx = ny * uz - nz * uy;
        let vy = nz * ux - nx * uz;
        let vz = nx * uy - ny * ux;
        rl = 1 / Math.sqrt(vx * vx + vy * vy + vz * vz);
        vx *= rl;
        vy *= rl;
        vz *= rl;

        let e = this.elements;
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
    }

    lookAt(eyeX: number, eyeY: number, eyeZ: number, targetX: number, targetY: number, targetZ: number, upX: number, upY: number, upZ: number){
        return this.concat(new Matrix4().setLookAt(eyeX, eyeY, eyeZ, targetX, targetY, targetZ, upX, upY, upZ));
    }

    setOrtho(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
        if (left === right || bottom === top || near === far) {
            console.error("wrong param");
            return;
        }

        let rw = 1 / (right - left);
        let rh = 1 / (top - bottom);
        let rd = 1 / (far - near);

        let e = this.elements;

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
    }

    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4 {
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

        let rw = 1 / (right - left);
        let rh = 1 / (top - bottom);
        let rd = 1 / (far - near);

        let e = this.elements;

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

        e[12] = 0
        e[13] = 0
        e[14] = -2 * near * far * rd;
        e[15] = 0;

        return this;
    }

    setPerspective(fovy: number, aspect: number, near: number, far: number): Matrix4 {
        if (near === far || aspect === 0 || near <= 0 || far <= 0) {
            console.error("wrong param");
            return;
        }

        let radius = fovy * Math.PI / 180 / 2;
        let sin = Math.sin(radius);
        if (sin === 0) {
            console.error("wrong param");
            return;
        }
        let cot = Math.cos(radius) / sin;
        let rd = 1 / (far - near);

        let e = this.elements;
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
    }

    setInverseOf(source: Matrix4): Matrix4 {
        let s = source.elements;
        let d = this.elements;
        let inv = new Float32Array(16);

        //??????????????????????????????????????????
        //??????????????? = ??????????????????????????????????????????????????????
        //????????? = ???????????????/??????????????????

        //???????????????????????????????????????inv?????????
        inv[0] = s[5] * s[10] * s[15] - s[5] * s[11] * s[14] - s[9] * s[6] * s[15]
            + s[9] * s[7] * s[14] + s[13] * s[6] * s[11] - s[13] * s[7] * s[10];
        inv[4] = - s[4] * s[10] * s[15] + s[4] * s[11] * s[14] + s[8] * s[6] * s[15]
            - s[8] * s[7] * s[14] - s[12] * s[6] * s[11] + s[12] * s[7] * s[10];
        inv[8] = s[4] * s[9] * s[15] - s[4] * s[11] * s[13] - s[8] * s[5] * s[15]
            + s[8] * s[7] * s[13] + s[12] * s[5] * s[11] - s[12] * s[7] * s[9];
        inv[12] = - s[4] * s[9] * s[14] + s[4] * s[10] * s[13] + s[8] * s[5] * s[14]
            - s[8] * s[6] * s[13] - s[12] * s[5] * s[10] + s[12] * s[6] * s[9];

        inv[1] = - s[1] * s[10] * s[15] + s[1] * s[11] * s[14] + s[9] * s[2] * s[15]
            - s[9] * s[3] * s[14] - s[13] * s[2] * s[11] + s[13] * s[3] * s[10];
        inv[5] = s[0] * s[10] * s[15] - s[0] * s[11] * s[14] - s[8] * s[2] * s[15]
            + s[8] * s[3] * s[14] + s[12] * s[2] * s[11] - s[12] * s[3] * s[10];
        inv[9] = - s[0] * s[9] * s[15] + s[0] * s[11] * s[13] + s[8] * s[1] * s[15]
            - s[8] * s[3] * s[13] - s[12] * s[1] * s[11] + s[12] * s[3] * s[9];
        inv[13] = s[0] * s[9] * s[14] - s[0] * s[10] * s[13] - s[8] * s[1] * s[14]
            + s[8] * s[2] * s[13] + s[12] * s[1] * s[10] - s[12] * s[2] * s[9];

        inv[2] = s[1] * s[6] * s[15] - s[1] * s[7] * s[14] - s[5] * s[2] * s[15]
            + s[5] * s[3] * s[14] + s[13] * s[2] * s[7] - s[13] * s[3] * s[6];
        inv[6] = - s[0] * s[6] * s[15] + s[0] * s[7] * s[14] + s[4] * s[2] * s[15]
            - s[4] * s[3] * s[14] - s[12] * s[2] * s[7] + s[12] * s[3] * s[6];
        inv[10] = s[0] * s[5] * s[15] - s[0] * s[7] * s[13] - s[4] * s[1] * s[15]
            + s[4] * s[3] * s[13] + s[12] * s[1] * s[7] - s[12] * s[3] * s[5];
        inv[14] = - s[0] * s[5] * s[14] + s[0] * s[6] * s[13] + s[4] * s[1] * s[14]
            - s[4] * s[2] * s[13] - s[12] * s[1] * s[6] + s[12] * s[2] * s[5];

        inv[3] = - s[1] * s[6] * s[11] + s[1] * s[7] * s[10] + s[5] * s[2] * s[11]
            - s[5] * s[3] * s[10] - s[9] * s[2] * s[7] + s[9] * s[3] * s[6];
        inv[7] = s[0] * s[6] * s[11] - s[0] * s[7] * s[10] - s[4] * s[2] * s[11]
            + s[4] * s[3] * s[10] + s[8] * s[2] * s[7] - s[8] * s[3] * s[6];
        inv[11] = - s[0] * s[5] * s[11] + s[0] * s[7] * s[9] + s[4] * s[1] * s[11]
            - s[4] * s[3] * s[9] - s[8] * s[1] * s[7] + s[8] * s[3] * s[5];
        inv[15] = s[0] * s[5] * s[10] - s[0] * s[6] * s[9] - s[4] * s[1] * s[10]
            + s[4] * s[2] * s[9] + s[8] * s[1] * s[6] - s[8] * s[2] * s[5];

        //????????????????????????????????????????????????????????????????????????S[0],s[1],s[2],s[3]???????????????????????????????????????????????????
        let det = s[0] * inv[0] + s[1] * inv[4] + s[2] * inv[8] + s[3] * inv[12];
        //????????????????????????????????????????????????????????????
        //let det = s[0]*inv[0] + s[4]*inv[1] + s[8]*inv[2] + s[12]*inv[3];

        if (det === 0) {
            return this;
        }

        det = 1 / det;
        for (let i = 0; i < 16; ++i) {
            d[i] = inv[i] * det;
        }

        return this;
    }

    invert(): Matrix4 {
        return this.setInverseOf(this);
    }

    transpose(): Matrix4 {
        let e = this.elements;

        //??????4x4????????????????????? 1,4; 2,8; 3,12; 6,9; 7,13; 11,14
        let t: number;
        t = e[1]; e[1] = e[4]; e[4] = t;
        t = e[2]; e[2] = e[8]; e[8] = t;
        t = e[3]; e[3] = e[12]; e[12] = t;
        t = e[6]; e[6] = e[9]; e[9] = t;
        t = e[7]; e[7] = e[13]; e[13] = t;
        t = e[11]; e[11] = e[14]; e[14] = t;

        return this;
    }

}
