import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

class LoadingComponent {
    constructor() {
        console.log("test")
        this._promises = [];
        this.models = {};
        this.textures = {};
        this.sounds = {};
        this._modelsLoaded = 0;
        this.gltfLoader = new GLTFLoader();
        this.textureLoader = new THREE.TextureLoader();
        this.cache = {};

    }
    
    loadAssets() {

         //Models 

         let modelCache = []
         //find better solution to load Unity Exported textures
         this.importAll(require.context('../../assets/models/', true,/\.(?:glb|gltf)$/i),modelCache);
 
     
        for (const model in modelCache) {

            let promise = new Promise((resolve, reject) => {
            this.gltfLoader.load(modelCache[model].default, resolve)
            this.models[model] = {}
            })
            .then(result => {
                this.models[model] = result
            })
            this._promises.push(promise);
        }

        //Textures 


        let textureCache = []
        //find better solution to load Unity Exported textures
        this.importAll(require.context('../../assets/modelTextures/', true,/\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i),textureCache);
        this.importAll(require.context('../../assets/images/', true,/\.(?:ico|gif|png|jpg|jpeg|webp|svg)$/i),textureCache);


         for (const texture in textureCache) {
            let promise = new Promise((resolve, reject) => {
            this.textureLoader.load(textureCache[texture].default, resolve);
            this.textures[texture] = {}
            })
            .then(result => {
                result.encoding = THREE.sRGBEncoding;
                result.flipY = false;
                this.textures[texture] = result
            })

            this._promises.push(promise);

           //Sound 

            let soundCache = []

            this.importAll(require.context('../../assets/sounds/', true,/\.(?:ogg|mp3|wav|mpe?g)$/i),soundCache);
 
  
            for (const sound in soundCache) {
                let promise = new Promise((resolve, reject) => {
                new THREE.AudioLoader().load(soundCache[sound].default, resolve);
                this.sounds[sound] = {}
                })
                .then(result => {
                    
                    this.sounds[sound] = result
                })
                this._promises.push(promise);
    
            }  
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

    
    importAll(r,cache) {
        r.keys().forEach((key) => (cache[key] = r(key)));
      }

      
}

export default LoadingComponent;