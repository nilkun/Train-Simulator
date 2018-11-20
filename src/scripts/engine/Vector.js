export default class Vector {
    constructor(x = 0.0, y = 0.0) {
        this.x = x;
        this.y = y;
    }

    add(vector2) {
        this.x += vector2.x;
        this.y += vector2.y;
    }

    sub(vector2) {
        this.x -= vector2.x;
        this.y -= vector2.y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    reset() {
        this.x = 0;
        this.y = 0;
    }

    scale(size) {
        this.x *= size;
        this.y *= size;
    }

    setMag(mag) {
        const currentMagnitude = 
            Math.sqrt(
                this.x * 
                this.x + 
                this.y * 
                this.y
            );
        const scalingFactor = mag / currentMagnitude;
        this.x *= scalingFactor;
        this.y *= scalingFactor;
    }
    getMag() {
        return Math.sqrt(
            this.x * 
            this.x + 
            this.y * 
            this.y
        );
    }
    copy(v) {
        this.x = v.x;
        this.y = v.y;
    }

    clone() {
        return new Vector(this.x, this.y);
    }

    rotate(radians) {
        // x' = x cos θ − y sin θ
        // y' = x sin θ + y cos θ

        // unit vector along X axis = <1, 0>
        // x' = 1 cos 90 − 0 sin 90 = 0
        // y' = 1 sin 90 + 0 cos 90 = 1

        const x = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians));
        const y = (this.x * Math.sin(radians)) + (this.y * Math.cos(radians));

        this.set(x, y);
    }

    setRotation() {

    }

    nRotate(radians) {
        this.x = (this.x * Math.cos(radians)) - (this.y * Math.sin(radians));
        this.y = (this.x * Math.sin(radians)) + (this.y * Math.cos(radians));
    }
    setNRotate(radians) {
        this.x = Math.cos(radians);
        this.y = Math.sin(radians);

        // this.x = Math.sin(radians);
        // this.y = Math.cos(radians);
    }

    limit(max) {
        this.setMag(this.getMag()*max);
    }
}