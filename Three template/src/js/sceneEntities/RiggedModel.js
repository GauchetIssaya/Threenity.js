import * as THREE from 'three';

class RiggedModel{
    constructor(vsdkParamaters, modelName, textures) {
        this.params = vsdkParamaters;
        this.modelName = modelName;
        this.textureName = this.params.texture;
        this.textures = textures;
        this.isModelAnimated = true;
        this.is3dModel = true;
        this.model;
        
        this.setupCustomParams();
    }
    
    setupCustomParams() {
      this.speed = 0.1;
      this.sinValue = 0;
    }

    build(models) {
        let modelTexture = this.textures[this.textureName];
        this.model = models[this.modelName]
        this.mesh = this.model.scene.children[0].children[0].children[1]

        let material = new THREE.MeshLambertMaterial({
            side: THREE.DoubleSide,
            color: this.params.color ? this.params.color : 0xFFFFFF,
            skinning: true,
            map: modelTexture
        });
        this.mesh.material = material
        
        this.model.scene.position.x = this.params.xPos;
        this.model.scene.rotation.y = Math.PI
        this.model.scene.scale.set(this.params.size, this.params.size, this.params.size);
   
    }

    addToScene(scene) {
        scene.add(this.model.scene);
    }

    update(delta) {
      this.sinValue += 0.1
      this.model.scene.position.x += Math.sin(this.sinValue) * this.speed;
    }
}
    

export default RiggedModel;