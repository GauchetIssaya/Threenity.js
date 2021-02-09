import Scene from '../scene/Scene';

class ManagerComponent {
    constructor() {
        this.canvas = document.querySelector('.canvas');
    }
    
    setup(models, textures) {
        this._setupThree(models, textures);
        this.resize();
        this._setupEventListeners();
    }

    _setupThree(models, textures) {
        this.threeScene = new Scene(this.canvas, models, textures);
    }

    _setupEventListeners() {

        document.addEventListener("mousedown", (e)=>this.threeScene.clickHandler(e) , false);
        document.addEventListener("touchstart",(e)=>this.threeScene.clickHandler(e), false);
        document.addEventListener("mouseup", (e)=>this.threeScene.clickHandlerUp(e), false);
        document.addEventListener("touchend", (e)=>this.threeScene.clickHandlerUp(e), false);
        document.addEventListener("mousemove",  (e)=>this.threeScene.clickMove(e), false);
        document.addEventListener("touchmove",  (e)=>this.threeScene.clickMove(e), false);
 

        
        this._tickHandler();
    }

    createLevel() {
        console.log("level Created")
    }
    
    start() {
        console.log("level Started")
        this.threeScene.startGame()
    }

    pause() {
        console.log("paused")
    }

    resize() {
        this._width = window.innerWidth;
        this._height = window.innerHeight;

        this.canvas.width = this._width;
        this.canvas.height = this._height;

        this.threeScene.resize(this._width, this._height);
    }

    _tick() {
        this.threeScene.tick();
    }

    _tickHandler() {
        this._tick();
        
        window.requestAnimationFrame(() => this._tickHandler());
    }

    _mousemoveHandler(e) {
        this._mousePosition = {
            x: e.clientX - this._width/2,
            y: e.clientY - this._height/2,
        }
        this.threeScene.mouseMoveHandler(e);
    }

}

export default ManagerComponent;