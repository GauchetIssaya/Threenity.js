import * as THREE from 'three';

export default class Cube{
    constructor(sdkParameters, textures) {
        this.params = sdkParameters
        this.textureName = this.params.texture;
        this.textures = textures;
        this._setup();
    }

    _setup() {
        let objectTexture = this.textures[this.textureName];

        let geometry = new THREE.CubeGeometry(5, 5, 5);
        let material = new THREE.MeshPhongMaterial({
            side: THREE.DoubleSide,
            color: this.params.color,
            map: objectTexture
        });
        
        this._cube = new THREE.Mesh(geometry, material);
        this._cube.position.x = -10;
        this._cube.position.y = 5;
    }

   
    changeColor() {
        this._cube.material.color.set(this.params.Color)
    }

    addToScene(scene) {
        scene.add(this._cube);
    }

    update(delta) {
        this._cube.rotation.y += 0.001;
        this._cube.rotation.x += 0.01;

    }
}