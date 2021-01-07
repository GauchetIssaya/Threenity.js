import { MODELS } from '../assetsImport/models'
import { TEXTURES } from '../assetsImport/textures'

import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

class LoadingComponent {
    constructor() {
        this._promises = [];
        this.models = {};
        this.textures = {};
        this._modelsLoaded = 0;
        this.gltfLoader = new GLTFLoader();
    }
    
    loadAssets() {
        for (const model in MODELS) {
            let promise = new Promise((resolve, reject) => {
            this.gltfLoader.load(MODELS[model].file, resolve)
            this.models[model] = {}
            })
            .then(result => {
                this.models[model] = result
            })
            this._promises.push(promise);
        }
        for (const texture in TEXTURES) {
            let promise = new Promise((resolve, reject) => {
            new THREE.TextureLoader().load(TEXTURES[texture].file, resolve);
            this.textures[texture] = {}
            })
            .then(result => {
                result.encoding = THREE.sRGBEncoding;
                result.flipY = false;
                this.textures[texture] = result
            })
            this._promises.push(promise);
        }
        return Promise.all(this._promises);

    }

    getModels() {
        return this.models
    }

    getTextures() {
        return this.textures
    }
}

export default LoadingComponent;