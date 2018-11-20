import Viewport from '../engine/Viewport.js';
import TileManager from './TileManager.js';

export default class TrainSimulator {
    constructor() {
        this.path = this.currentScriptPath();
        this.world;
        this.viewport;
        this.updateInterval;
        this.play;
        this.bindPlay = this.startGame.bind(this);
        this.world = new TileManager(this.path);
        this.viewport = new Viewport(480, 480);
        this.viewport.init();
        this.world.init(this.viewport.canvas);
        this.world.setRenderContext(this.viewport.context);
        this.world.render();
        this.updateInterval;
    }
    currentScriptPath() {
        // get scripts
        const scripts = document.querySelectorAll( 'script[src]' );
        const currentScript = scripts[ scripts.length - 1 ].src;

        const currentScriptChunks = currentScript.split( '/' );
        const currentScriptFile = currentScriptChunks[ currentScriptChunks.length - 1 ];    
        return currentScript.replace( currentScriptFile, '' );
    }

    init() {
        this.world = new TileManager(path);
        this.viewport = new Viewport(480, 480);
        this.viewport.init();
        this.world.init(this.viewport.canvas);
        this.world.setRenderContext(this.viewport.context);
        this.world.render();
        this.updateInterval;

        this.runDemo();
    }

    runDemo() {  
        document.getElementById('train-btn5').addEventListener('click', () => this.world.switchGrid());
        this.viewport.canvas.addEventListener('mousedown', this.bindPlay);        
        this.world.layTracks(3, 3);
        this.world.layTracks(26, 3);
        this.world.layTracks(26, 26);
        this.world.layTracks(3, 26);
        this.world.layTracks(3, 3);
        console.log("current id: ",this.updateInterval);
        this.updateInterval = setInterval(() => this.demoMode(), 1000/ 60);
        console.log("running Demo: ", this.updateInterval);
    }
    
    startGame() {
        console.log("STARTING GAME:", this);
        console.log(this.updateInterval);
        clearInterval(this.updateInterval);

        console.log(this.updateInterval);
        this.viewport.canvas.removeEventListener('mousedown', this.bindPlay);

        this.world.reset();
        this.world.setRenderContext(this.viewport.context);
        this.world.render();
        this.updateInterval = setInterval(() => this.update(), 1000/ 60);
        console.log(this.updateInterval);
        this.viewport.canvas.addEventListener('mousedown', (e) => {
            const mousePos = this.viewport.getMouse(e);
            this.world.update();
            this.world.click(mousePos.x, mousePos.y);
        })


    }

    demoMode() {
        this.world.update();
        this.viewport.context.fillStyle = "white";
        this.viewport.context.font = "30px Arial";
        this.viewport.context.fillText("TRAIN SIMULATOR!!!", 100, 200); 
        this.viewport.context.font = "15px Arial";
        this.viewport.context.fillText("click to start...", 190, 230); 
        this.viewport.context.stroke();   
    }

    update() {
        this.world.update();
    }
}