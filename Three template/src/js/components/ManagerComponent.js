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
         document.addEventListener("mousedown", ()=>this.threeScene.clickHandler() , false);
        document.addEventListener("touchstart",()=>this.threeScene.clickHandler(), false);
        document.addEventListener("mouseup", ()=>this.threeScene.clickHandlerUp(), false);
        document.addEventListener("touchend", ()=>this.threeScene.clickHandlerUp(), false);
        document.addEventListener("mousemove", this._mousemoveHandler, false);
        document.addEventListener("touchmove", this._mousemoveHandler, false);
 

        this._tickHandler();
    }

    createLevel() {
       // console.log("level Created")
    }
    
    start() {
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
    }



}

export default ManagerComponent;