import { MODELS } from '../assetsImport/models'
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

class LoadingComponent {
    constructor() {
        this._promises = [];
        this.models = {};
        this.textures = {};
        this._modelsLoaded = 0;
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.cache = {};

    }
    
    loadAssets() {


        //find better solution to load Unity Exported textures
        this.importAll(require.context('../../assets/modelTextures/', true,/\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i));
        this.importAll(require.context('../../assets/images/', true,/\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i));

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

         for (const texture in this.cache) {
            let promise = new Promise((resolve, reject) => {
            this.textureLoader.load(this.cache[texture].default, resolve);
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

    getGLTFLoader(){
        return this.gltfLoader;
    }

    getModels() {
        return this.models
    }

    getTextures() {
        return this.textures
    }

    
    importAll(r) {
        r.keys().forEach((key) => (this.cache[key] = r(key)));
      }

      
}

export default LoadingComponent;