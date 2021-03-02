//utils
//vendors
import * as THREE from 'three';
import * as CANNON from 'cannon';


import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'three/examples/jsm/libs/dat.gui.module.js';

//components
import AnimationComponent from '../components/AnimationComponent';

//sceneEntities
import Lights from '../sceneEntities/Lights';

import Threenity from '../components/Threenity';
import ParticleSystemComponent from '../components/ParticleSystemComponent';
import AnimationCloner from '../utils/AnimationCloner';



import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"

import DebugRenderer from "../utils/CannonDebugRenderer"

class Scene {
    constructor(canvas, models, textures) {
        const gui = new GUI();
     
        let camera = gui.addFolder('camera');

        this.vsdkParameters = VSDK.getParameters();
        this._canvas = canvas;

        this.playAnimation = false;

        this.isEngineReady = false;
        this._textures = textures;
        this._models = models;

        this.animationsEntities = [];
        this.particleSystem = [];


        this.delta = 0;
        this._clock = new THREE.Clock();

        this._setupRenderer();
        this._setupStats();

        this._setupThreeScene();
        this._setupCannonWorld();

        this._createEngine();
        this._setupOrbitControls();

        this._setupParticleSystem();

        // starting animation
     // this.animationsEntities.riggedModel.playAnimation(this.animationsEntities.riggedModel.actionType.Run)
     // this.animationsEntities.riggedModel.getCurrentAnim();
    }


    clickHandler(e){
        console.log("Click")
        //this.element.style.pointerEvents = 'none'
    }

    clickMove(e){

    }

    clickHandlerUp(e){

    }

    _setupStats() {
        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );
    }

    _setupRenderer() {
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true
        });

        this._renderer.outputEncoding = THREE.sRGBEncoding;

    }

    _setupThreeScene() {
        this._scene = new THREE.Scene();
    }


    _setupCamera() {
        this._camera = new THREE.PerspectiveCamera(this.vsdkParameters.Camera.fov, this._canvas.width / this._canvas.height, 1, 1000);

        this._camera.position.x = this.vsdkParameters.Camera.xPos;
        this._camera.position.y = this.vsdkParameters.Camera.yPos;
        this._camera.position.z = this.vsdkParameters.Camera.zPos;

        this._camera.lookAt(this.vsdkParameters.Camera.lookAtX, this.vsdkParameters.Camera.lookAtY, this.vsdkParameters.Camera.lookAtZ);
        return this._camera;
    }

    _setupOrbitControls() {
        if(this.vsdkParameters.Debug) {
            this._controls = new OrbitControls(this._camera, this._canvas);
            this._controls.update();
        }
    }

    _setupParticleSystem() {
        let particleSystemComponent = new ParticleSystemComponent(new THREE.Object3D(), this._textures.uvMap, 100, 1.2, 10, 10, 1, 2);
        this.particleSystem.push(particleSystemComponent);
        this.particleSystem[0].addToScene(this._scene);
    }

    _createModels() {
        for (let model in this.sceneEntities) {
            if (!this.sceneEntities[model].is3dModel && !this.sceneEntities[model].fromUnity ) continue;
            this.sceneEntities[model]?.build(this._models);
            this.sceneEntities[model].addToScene(this._scene);
        }
    }

    _createModelsAnimations() {

        
        this.animationsEntities = this.animationsEntities.concat(this._engine.animators);
        for (let model in this.sceneEntities) {
            if (!this.sceneEntities[model].is3dModel) continue;
            if(this.sceneEntities[model].isModelAnimated) {
                if(this.sceneEntities[model].fromUnity){
                    console.log(this.sceneEntities[model].model)
                    this.animationsEntities[model] = new AnimationComponent(this.sceneEntities[model].model)
                }

                else{
                this.animationsEntities[model] = new AnimationComponent(this.sceneEntities[model])
                }
            }
        }



    }
    
    _createEntities() {

        this.sceneEntities = {
            lights: new Lights(this.vsdkParameters.LightsSettings, this._engine.lights),
            // building: new Building(this.vsdkParameters.ModelExample, this.vsdkParameters.ModelExample.name, this._textures),
            //riggedModel: new RiggedModel(this.vsdkParameters.RiggedModelExample, this.vsdkParameters.RiggedModelExample.name, this._textures),
        };
    
        
        for (let entity in this.sceneEntities) {
            if (this.sceneEntities[entity].is3dModel) continue;
            this.sceneEntities[entity].addToScene(this._scene);
        } 

       /*  this._engine.modelScene.children.forEach(children => {
            if(children.name === "Interactive") {
                 children.children.forEach(object => {
                    console.log(object)
                    this.sceneEntities[object.name] = new GameObject(object,true).copy(object);
                }); 
            } 
        }); */



    }
    
    _setupCannonWorld() {
        this._world = new CANNON.World();
        this._world.bodies = [];
        this._world.gravity.set(0, -9.8, 0);
        this._world.solver.iterations = 10;
        this._world.broadphase = new CANNON.NaiveBroadphase();
        this.DebugRenderer = new THREE.CannonDebugRenderer(
            this._scene,
            this._world
        );     }

    _createEngine() {

        this._engine = new Threenity(
            this._models[this.vsdkParameters.MainScene.name],
            this._scene,
            this._world,
            this._canvas,
            this._textures
        );
        this._createEntities();
        this._createModels();
        this._createModelsAnimations();
        this._camera  = this._engine.camera ? this._engine.camera : this._setupCamera()
    }

 
    
    _start() {
        // this._createModels();
        this._isReady = true;
    }

    startGame() {

        //Copy animation example
 
/*         console.log(this._engine.entities["ferris wheel"])
        this.wheel = new AnimationCloner(this._engine.entities["ferris wheel"]).model;
  

        this.animationsEntities.push(this.wheel.components['Animations'].mixer)

        this._scene.add(this.wheel)
        this.wheel.position.set(150.5,.5,this._engine.entities["ferris wheel"].getWorldPosition().z) 

 */
        
        for (let index = 0; index < this.animationsEntities.length; index++) {
            this.animationsEntities[index].playAnimation(this.animationsEntities[index].actions[0])
    
        } 

    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    }

    tick() {
        this.stats.begin();

        this.delta = this._clock.getDelta();
        this.elapsedTime = this._clock.getElapsedTime();

        for (let entity in this.sceneEntities) {
            this.sceneEntities[entity].update(this.delta);
        }   

        for(let entity in this.animationsEntities) {
           // console.log(entity)
            this.animationsEntities[entity].update(this.delta)
        }

        for(let particleSystem in this.particleSystem) {
        //    this.particleSystem[particleSystem].update(this.delta, this.sceneEntities.riggedModel.model.scene.position)
        }

        this.updatePhysics();
        this.DebugRenderer.update();
        this._renderer.render(this._scene, this._camera);
        this.stats.end();

    }

    updatePhysics() {
        var timeStep = 1 / 30;

        this._world.step(timeStep);
        for (var i = 0; i < this._world.bodies.length; i++) {
            if (this._world.bodies[i].object != null) {
                this._world.bodies[i].object.updateMatrixWorld(true);
                let parent = this._world.bodies[i].object.parent;
                this._scene.attach(this._world.bodies[i].object);
                this._world.bodies[i].object.position.copy(
                    this._world.bodies[i].position
                );
                this._world.bodies[i].object.quaternion.copy(
                    this._world.bodies[i].quaternion
                );
                parent.attach(this._world.bodies[i].object);
            }
        }
    }

    _assetsLoadedHandler() {
        this._models = this._loader.getModels();
        this._textures = this._loader.getTextures();
        this._start();
    }


}

export default Scene;