import Viewport from '../engine/Viewport.js';
import TileManager from '../GameWorld/TileManager.js';

let world = new TileManager();
let viewport = new Viewport(480, 480);

viewport.init();

world.init(viewport.canvas);
world.setRenderContext(viewport.context);
world.render();

const startDemo = () => {
    world.layTracks(3, 3);
    world.layTracks(26, 3);
    world.layTracks(26, 26);
    world.layTracks(3, 26);
    world.layTracks(3, 3);
    updateInterval = setInterval(demo, 1000/ 60);
}



const startGame = () => {
    clearInterval(updateInterval);
    viewport.canvas.removeEventListener('mousedown', startGame);

    world.reset();
    world.setRenderContext(viewport.context);
    world.render();
    updateInterval = setInterval(() => update(), 1000/ 60);

    viewport.canvas.addEventListener('mousedown', (e) => {
        world.update();
        world.click(e.x, e.y);
    })


}

const demo = () => {
    world.update();
    viewport.context.fillStyle = "white";
    viewport.context.font = "30px Arial";
    viewport.context.fillText("TRAIN SIMULATOR!!!", 100, 200); 
    viewport.context.font = "15px Arial";
    viewport.context.fillText("click to start...", 190, 230); 
    viewport.context.stroke();   
}

const update = () => {
    world.update();
}

let updateInterval;
document.getElementById('btn5').addEventListener('click', () => world.switchGrid());
viewport.canvas.addEventListener('mousedown', startGame);
viewport.canvas.addEventListener('mousedown', startGame);
startDemo();


