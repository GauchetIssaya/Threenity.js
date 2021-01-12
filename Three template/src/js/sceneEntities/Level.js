import * as THREE from 'three';
import { Vector2, Vector3 } from 'three';

export default class Level{
    constructor(vsdkParamaters, modelName, textures,scene) {
        this.params = vsdkParamaters;
        this.modelName = modelName;
        this.textureName = this.params.texture;
        this.textures = textures;
        this.is3dModel = true;
        this.scene = scene;
 
    }
    
    build(models) {
      this.models = models;
        let modelTexture = this.textures[this.textureName];
        this.model = this.models[this.modelName];
        this._level = models[this.modelName].scene;



    }




    getChildContains(index) {
        let found;
        var toReturn = new Array();
        let i;
    
        this._level.traverse(function (child) {
          if (child.name.includes(index)) {
            found = true;
            toReturn.push(child);
          }
        });
    
        if (found) {
          return toReturn;
        } else {
          console.log("Child not found");
        }
      
    }
      
    addToScene(scene) {
        this.scene.add(this._level);
    }

    update(delta) {
    }
}