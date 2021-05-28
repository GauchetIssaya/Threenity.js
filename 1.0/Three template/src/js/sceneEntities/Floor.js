import * as THREE from 'three';

export default class Floor{
    constructor(sdkParameters, textures) {
        this.params = sdkParameters
        this.textureName = this.params.texture;
        this.textures = textures;
        this._setup();
    }

    _setup() {
        let objectTexture = this.textures[this.textureName];

        let geometry = new THREE.PlaneGeometry(50, 50, 2);
        let material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: this.params.color,
            map: objectTexture
        });
        
        this._floor = new THREE.Mesh(geometry, material);
        this._floor.rotation.x = Math.PI/2;

    }

    addToScene(scene) {
        scene.add(this._floor);
    }

    update(delta) {
    }
}