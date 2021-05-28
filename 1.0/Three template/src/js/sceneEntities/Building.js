import * as THREE from 'three';

export default class Building{
    constructor(vsdkParamaters, modelName, textures) {
        this.params = vsdkParamaters;
        this.modelName = modelName;
        this.textureName = this.params.texture;
        this.textures = textures;
        this.is3dModel = true;
    }
    
    build(models) {
        let modelTexture = this.textures[this.textureName];
        this._building = models[this.modelName].scene;

        let material = new THREE.MeshPhongMaterial( { 
            color: this.params.color,
            map: modelTexture
        }) 

        this._building.children[0].material = material;
        
        this._building.rotation.y = Math.PI / 2;
        this._building.position.x = 10;
        this._building.position.z = -20;

        this._building.scale.x = 30;
        this._building.scale.y = 30;
        this._building.scale.z = 30;
    }

    addToScene(scene) {
        scene.add(this._building);
    }

    update(delta) {
    }
}