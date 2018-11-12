import Vector from '../engine/Vector.js'

export default class Train {
    constructor() {
        this.position = new Vector;
        this.velocity = new Vector;
        this.acceleration = new Vector;

        this.speed;
        this.deceleration;
        
        this.target = new Vector;
        this.maxForce;;
        this.cd = true;
        this.destination = [];
        this.direction = new Vector;
        this.sprite = new Image()
        this.sprite.src = '../textures/train.png';
    }

    init() {
        this.position.set(0, 0);
        this.velocity.set(0,0);
        this.acceleration.set(0, 0);
        this.speed = .5;
        this.deceleration = this.speed / 100;
        this.target.set(200, 200);
        this.maxForce = .005;
        this.angle = 0;
    }

    update(variable = this.target) {
        let force;
        force = this.arrive(variable);
        this.applyForce(force);

        this.position.add(this.acceleration);

        this.velocity.set(0, 0);
        this.velocity.add(this.acceleration);
        this.acceleration.reset();
        if(this.cd) {
            this.cd = false;
            return true;
        }
        return false;
    }

    applyForce(force) {
        this.acceleration.add(force);
    }

    setPos(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    setTarget(x, y) {
        let angle = 0;
        let compX = this.position.x;
        let compY = this.position.y;          

        this.target.set(Math.floor(x), Math.floor(y));

        compX -= this.target.x;
        compY -= this.target.y;
        if(compX >= 1) angle += Math.PI;
        if(compY <= -1) angle += Math.PI/2;
        else if(compY >= 1) angle -= Math.PI/2
        this.angle = angle;
    }

    render(context) {

        context.save();
        context.translate(this.position.x + 8, this.position.y + 8);
        context.rotate(this.angle);
        context.drawImage(this.sprite, -8, -8);
        // context.stroke();
        context.restore();
    }

    arrive() {
        let desired = new Vector();
        desired.add(this.target);
        desired.sub(this.position);

        let speed = this.speed;
        let d = desired.getMag();

        // just change direction for now!
        if(d<1) {
            this.cd = true;
        }
        // if(d<100) {
        //     speed = d * this.deceleration;
        //     if(d<5) speed = 0;    
        // }
        
        desired.setMag(speed);

        const steering = new Vector();
        steering.add(desired);
        // steering.sub(this.velocity);
        // steering.limit(this.maxForce);

        return steering;
    }

}
