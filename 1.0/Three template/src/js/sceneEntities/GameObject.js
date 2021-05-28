import * as THREE from 'three';
import { Object3D } from 'three';

export default class GameObject extends Object3D{
    constructor(object,fromUnity = false) {
        super();
        this.components = object.components;

        this.is3dModel = true;
        if(this.components['Animations'] != undefined){
            this.isModelAnimated = true;
        }
        this.fromUnity = fromUnity;
        this.model = object;
        
        this.setupCustomParams();
    }
    
    setupCustomParams() {
      this.speed = 0.1;
      this.sinValue = 0;
    }
 
    build(){

    }


    addToScene(scene) {
        scene.add(this.model);
    }

    update(delta) {
    //   this.sinValue += 0.1
    //   this.model.scene.position.x += Math.sin(this.sinValue) * this.speed;
    }
}
