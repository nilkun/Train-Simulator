'use strict';

import Tile from './Tile.js';
import Vector from '../engine/Vector.js';
import Path from './Path.js';
import Train from './Train.js';

export default class TileManager {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.tile = new Array(this.width);
        this.tileSize = 16;  
        this.context = "";
        this.canvas = "";
        this.start = -1;
        //new Vector(2, 2);
        this.goal = -2;
        //new Vector(17, 19);
        this.origin = false;
        this.isClicked = false;  
        this.hasTrain = false;
        this.isCompleted = false;
        this.changeDirection = false;
        this.circuit = [];
        this.current = [];
        this.train = new Train;
        this.path = new Path;  
        this.tileTextures = new Image();
        this.tileTextures.src = 'src/textures/rails-basic.png'; 
        this.gridOn = true;
    }

    getPath() {
        this.current = this.path.calculate(this.tile, this.start, this.goal);
        this.render();
    }

    test() {

    }

    reset() {
        this.width = 30;
        this.height = 30;
        this.tile = new Array(this.width);
        this.tileSize = 16;  
        this.context = "";
        this.canvas = "";
        this.start = -1;
        //new Vector(2, 2);;
        this.goal = -2; //new Vector(12, 12);;
        this.origin = false;
        this.isClicked = false;  
        this.hasTrain = false;
        this.isCompleted = false;
        this.changeDirection = false;
        this.circuit = [];
        this.current = [];
        this.train = new Train;
        this.path = new Path; 
        this.gridOn = true;
        for(let i = 0; i < this.width; i++) {
            this.tile[i] = new Array(this.height);
            for(let j=0; j < this.height; j++) {
                this.tile[i][j] = new Tile;
            }
        }
        this.connectNeighbours();
    }
    switchGrid() {
        if(this.gridOn) this.gridOn = false;
        else this.gridOn = true;
    }

    setRenderContext(ctx) {
        this.context = ctx;
    }

    init(canvas) {
        this.canvas = canvas;
        for(let i = 0; i < this.width; i++) {
            this.tile[i] = new Array(this.height);
            for(let j=0; j < this.height; j++) {
                this.tile[i][j] = new Tile;
            }
        }
        this.connectNeighbours();
    }
    click(x, y) {
        if(!this.isCompleted) {
            x = Math.floor(x/this.tileSize);
            y = Math.floor(y/this.tileSize);
            if(!this.origin) {
                this.origin = new Vector(x, y);
                this.start = new Vector(this.origin.x, this.origin.y);
                this.isClicked = true;
                this.tile[this.origin.x][this.origin.y].color = "pink";
                this.circuit.push(new Vector(x, y));  
            }
            else if(this.isClicked) {
                this.goal = new Vector(x, y);
                this.getPath();
                this.current.pop();
                this.circuit = this.current.concat(this.circuit);
                this.isClicked = false;
                this.tile[this.origin.x][this.origin.y].hasTrack = false;
            }
            else {
                this.start = new Vector(this.goal.x, this.goal.y);
                this.goal = new Vector(x, y);
                this.getPath();
                // pop the first or else they are the same
                this.current.pop();
                this.circuit = this.current.concat(this.circuit);
            }
            if(this.goal.x === this.origin.x && this.goal.y === this.origin.y) {
                this.isCompleted = true;
                this.train.destination = this.circuit.slice(0);
                this.startTrain();
                this.tile[this.origin.x][this.origin.y].color = "green";
            } else {};
        }
        this.render();

    }

    startTrain() {
        console.log("Starting train...");
        this.hasTrain = true;
        this.train.init();

        this.train.position.copy(this.train.destination.pop());
        this.train.position.x *= this.tileSize;
        this.train.position.y *= this.tileSize;
    }
    updateTrain() {
        if(this.train.destination.length > 0) {
            this.train.direction.copy(this.train.destination.pop());
        } else {
            // reset!
            this.train.destination = this.circuit.slice(0);
            this.train.destination.pop();
            this.train.direction.copy(this.train.destination.pop());
        }
        this.train.setTarget(
            this.train.direction.x * this.tileSize, 
            this.train.direction.y * this.tileSize
        )
    }
    render() {
        for(let x = 0; x < this.width; x++) {
            for(let y=0; y < this.height; y++) {                        
                this.context.beginPath();
                this.context.rect(x * this.tileSize, y * this.tileSize, this.tileSize,  this.tileSize);
                this.context.fillStyle = this.tile[x][y].color;
                this.context.fill(); 
                
                if(this.gridOn) { this.context.stroke(); }
                if(this.tile[x][y].hasTrack) {
                    this.context.drawImage(this.tileTextures, 
                        this.tile[x][y].railIndex.x, this.tile[x][y].railIndex.y, 16, 16,
                        x * this.tileSize, y * this.tileSize, this.tileSize,  this.tileSize)
                } 
            }
        }
    }

    update() {
        if(this.hasTrain) {
            this.changeDirection = this.train.update();
            this.render();
            this.train.render(this.context);
            if(this.changeDirection) this.updateTrain();
        }

    }

    layTracks(x, y) {
        if(!this.isCompleted) {
            this.tile[x][y].click();
            if(!this.origin) {
                this.origin = new Vector(x, y);
                this.start = new Vector(this.origin.x, this.origin.y);
                this.isClicked = true;
                this.tile[this.origin.x][this.origin.y].color = "pink";
                this.circuit.push(new Vector(x, y));
                
            }
            else if(this.isClicked) {
                this.goal = new Vector(x, y);
                this.getPath();
                this.current.pop();
                this.circuit = this.current.concat(this.circuit);
                this.isClicked = false;
                this.tile[this.origin.x][this.origin.y].hasTrack = false;
            }
            else {
                this.start = new Vector(this.goal.x, this.goal.y);
                this.goal = new Vector(x, y);

                this.getPath();
                // pop the first or else they are the same
                this.current.pop();
                this.circuit = this.current.concat(this.circuit);
            }

            if(this.goal.x === this.origin.x && this.goal.y === this.origin.y) {
                this.isCompleted = true;
                this.train.destination = this.circuit.slice(0);
                this.startTrain();
                this.tile[this.origin.x][this.origin.y].color = "green";
            } 
        }
                   
        this.render();

    }    
// NOT READY FOR 9 DIRECTIONS!!! NOT ENOUGH ART(sic)WORK
    // connectNeighbours() {
    //     // could skip 1st row and column and last row and column to speed up (no need to check if all the time)
    //     for(let x = 0; x < this.width; ++x) {
    //         for(let y = 0; y < this.height; ++y) {

    //             // Row above
    //             if(y > 0) {
    //                 if(x>0) this.tile[x][y].neighbours.push(new Vector(x-1, y-1));
    //                 this.tile[x][y].neighbours.push(new Vector(x, y-1));
    //                 if(x<this.width-1) this.tile[x][y].neighbours.push(new Vector(x+1, y-1));
    //             }

    //             // Same row
    //             if(x>0) this.tile[x][y].neighbours.push(new Vector(x-1, y));
    //             if(x<this.width - 1) this.tile[x][y].neighbours.push(new Vector(x +1, y));

    //             // Row below
    //             if(y < this.height - 1) {
    //                 if(x>0) this.tile[x][y].neighbours.push(new Vector(x - 1, y + 1));
    //                 this.tile[x][y].neighbours.push(new Vector(x, y + 1));
    //                 if(x<this.width-1) this.tile[x][y].neighbours.push(new Vector(x + 1, y + 1));
    //             }
    //         }
    //     }
    // }
    connectNeighbours() {
        // could skip 1st row and column and last row and column to speed up (no need to check if all the time)
        for(let x = 0; x < this.width; ++x) {
            for(let y = 0; y < this.height; ++y) {

                // Row above
                if(y > 0) {
                    this.tile[x][y].neighbours.push(new Vector(x, y-1));
                }

                // Same row
                if(x>0) this.tile[x][y].neighbours.push(new Vector(x-1, y));
                if(x<this.width - 1) this.tile[x][y].neighbours.push(new Vector(x +1, y));

                // Row below
                if(y < this.height - 1) {
                    this.tile[x][y].neighbours.push(new Vector(x, y + 1));
                }
            }
        }
    }

}
