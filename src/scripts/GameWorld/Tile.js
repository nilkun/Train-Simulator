import Vector from '../engine/Vector.js';

export default class Tile {
    constructor() {  
        this.type = "";
        this.color = "green";
        this.hasTrack = false;
        this.neighbours = [];
        this.connections = [];
        this.railIndex = [];
        this.heading = "";    
    }
    connect() {
        this.color = "red";
    }

    activate(parent, child, current) {
        if(parent) {
            this.connections.push(new Vector(parent.x, parent.y));
        }
        if(child) {
            this.connections.push(new Vector(child.x, child.y));
            this.heading = new Vector(child.x, child.y);
        }
        this.hasTrack = true;
        this.setIndex(current)
    }
    setIndex(current) {
        let index = 0;
        this.connections.forEach(connection => {
            const x = connection.x - current.x;
            const y = connection.y - current.y;
            if(x === -1) index += 2;
            else if(x === 1) index += 8;
            else if(y === -1) index += 4;
            else if(y === 1) index += 1; 
        });
        switch(index) {
            case 3: {
                this.railIndex = new Vector(16, 16);
                break;
            }
            case 1:
            case 4:
            case 5: {
                this.railIndex = new Vector(16, 0);
                break;
            }
            case 9: {
                this.railIndex = new Vector(0, 16);
                break;
            }
            case 6: {
                this.railIndex = new Vector(16, 32);
                break;
            }
            case 10: {
                this.railIndex = new Vector(0, 0);
                break;
            }
            case 12: {
                this.railIndex = new Vector(0, 32);
                break;
            }
            default: {
                this.railIndex = new Vector(0, 0);
                break;
            }
        }
    }

    isValid() {
        if(this.hasTrack===true) return false;
        return true;
        // if(this.hasTrack) return false;
        // else return true;
    }

    getPosition() {
        return this.position;
    }
    render() {
        // RENDER TILE
    }
    click() {
        // this.color = "black";
        // this.hasTrack = true;
    }
    setColor() {
        const rdm = Math.floor(Math.random()*3);
        switch(rdm) {
            case 0: {
                this.color = "red";
                break;
            }
            case 1: {
                this.color = "green";
                break;
            }
            case 2: {
                this.color = "blue";
                break;
            }
        }
    }
}