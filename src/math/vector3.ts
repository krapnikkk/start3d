export class Vector3 {
    public x: number;
    public y: number;
    public z: number;

    constructor(x:number = 0, y:number = 0, z:number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public set(x:number,y:number,z:number):Vector3{
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
    }

    public length():number{
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public equals(v: Vector3): boolean {
        return this.x == v.x && this.y == v.y && this.z == v.z;
    }

    public copyFrom(v:Vector3):Vector3{
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
    }

    public clone():Vector3{
        return new Vector3(this.x,this.y,this.z);
    }

    public add(v:Vector3):Vector3{
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }
    public sub(v:Vector3):Vector3{
        this.x -= this.x;
        this.y -= this.y;
        this.z -= this.z;
        return this;
    }
    public multiply(v:Vector3):Vector3{
        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
    }

    public divide(v: Vector3): Vector3 {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
    }

    public static get zero(): Vector3 {
        return new Vector3();
    }

    public static get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    public static distance(a: Vector3, b: Vector3): number {
        let diff = a.sub(b);
        return Math.sqrt(diff.x * diff.x + diff.y * diff.y + diff.z * diff.z);
    }
}