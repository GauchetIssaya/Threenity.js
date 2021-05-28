//utils
//vendors
import * as THREE from "three";
import * as CANNON from "cannon";

import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

//components
import AnimationComponent from "../components/AnimationComponent";
import UIComponent from "../components/UIComponent";

//sceneEntities
import Lights from "../sceneEntities/Lights";

import Threenity from "../components/Threenity";
import ParticleSystemComponent from "../components/ParticleSystemComponent";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import DebugRenderer from "../utils/CannonDebugRenderer";
import { Object3D, Vector3 } from "three/build/three.module";

class Scene {
    constructor(canvas, models, textures, gltfLoader) {
        this.vsdkParameters = VSDK.getParameters();
        this._canvas = canvas;

        this.gltfLoader = gltfLoader;
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
        this._scene.sceneEntities = [];
        this._scene.toUpdate = [];
        this._setupCannonWorld();
        this._scene.world = this._world;

        this._createEngine();
      this._setupOrbitControls();

        this._setupParticleSystem();

        this._setup();
/* 
         this.UI = new UIComponent(this._scene,this._camera);

        this.UI.CreateText("bru",100,100)
        this.UI.CreateSprite(this._textures['logo'])  */
    }

    _setup() {


    }
    clickHandler(e) {}

    clickMove(e) {}

    clickHandlerUp(e) {}

    _setupStats() {
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }

    _setupRenderer() {
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
        });
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        this._renderer.outputEncoding = THREE.sRGBEncoding;
    }

    _setupThreeScene() {
        this._scene = new THREE.Scene();
    }

    _setupCamera() {
        this._camera = new THREE.PerspectiveCamera(
            this.vsdkParameters.Camera.fov,
            this._canvas.width / this._canvas.height,
            1,
            1000
        );

        this._camera.position.x = this.vsdkParameters.Camera.xPos;
        this._camera.position.y = this.vsdkParameters.Camera.yPos;
        this._camera.position.z = this.vsdkParameters.Camera.zPos;

        this._camera.lookAt(
            this.vsdkParameters.Camera.lookAtX,
            this.vsdkParameters.Camera.lookAtY,
            this.vsdkParameters.Camera.lookAtZ
        );
        return this._camera;
    }

    _setupOrbitControls() {
        if (this.vsdkParameters.Debug) {
            this._controls = new OrbitControls(this._camera, this._canvas);
            this._controls.update();
        }
    }

    _setupParticleSystem() {
        let particleSystemComponent = new ParticleSystemComponent(
            new THREE.Object3D(),
            this._textures.uvMap,
            100,
            1.2,
            10,
            10,
            1,
            2
        );
        this.particleSystem.push(particleSystemComponent);
        this.particleSystem[0].addToScene(this._scene);
    }

    _createModels() {
        for (let model in this._scene.sceneEntities) {
            if (
                !this._scene.sceneEntities[model].is3dModel &&
                !this._scene.sceneEntities[model].fromUnity
            )
                continue;
            this._scene.sceneEntities[model]?.build(this._models);
            this._scene.sceneEntities[model].addToScene(this._scene);
        }
    }

    _createModelsAnimations() {
        this.animationsEntities = this.animationsEntities.concat(
            this._engine.animators
        );
        for (let model in this._scene.sceneEntities) {
            if (!this._scene.sceneEntities[model].is3dModel) continue;
            if (this._scene.sceneEntities[model].isModelAnimated) {
                if (this._scene.sceneEntities[model].fromUnity) {
                    this.animationsEntities[model] = new AnimationComponent(
                        this._scene.sceneEntities[model].model
                    );
                } else {
                    this.animationsEntities[model] = new AnimationComponent(
                        this._scene.sceneEntities[model]
                    );
                }
            }
        }
    }

    _createEntities() {
        this._scene.sceneEntities["lights"] = new Lights(
            this.vsdkParameters.LightsSettings,
            this._engine.lights,
            this._scene
        );
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
        );
    }

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
        this._camera = this._engine.camera
            ? this._engine.camera
            : this._setupCamera();
    }

    _start() {
        this._isReady = true;
    }

    startGame() {
        for (let index = 0; index < this.animationsEntities.length; index++) {
            this.animationsEntities[index].playAnimation(
                this.animationsEntities[index].actions[0]
            );
        }
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
       // this.UI.renderer.setSize(width,height)
    }

    tick() {
        this.stats.begin();

        this.delta = this._clock.getDelta();
        this.elapsedTime = this._clock.getElapsedTime();

        for (let entity in this._scene.toUpdate) {
            this._scene.toUpdate[entity].update(this.delta);
        }

        for (let entity in this.animationsEntities) {
            this.animationsEntities[entity].update(this.delta);
        }

        
        this._controls.update()
        this.updatePhysics();
        this.DebugRenderer.update();
      //  this.UI.update()
        this._renderer.render(this._scene, this._camera);
        this.stats.end();
    }

    updatePhysics() {
        var timeStep = this.delta *2;



        

        this._world.step(timeStep);
        
        for (var i = 0; i < this._world.bodies.length; i++) {

            if (this._world.bodies[i].object != null) {
                this._world.bodies[i].object.updateMatrixWorld(true);


                var possition = new THREE.Vector3();
                var quaternion = new THREE.Quaternion();
                var scale = new THREE.Vector3();

             //   console.log(this._world.bodies[i])
             this._world.bodies[i].object.matrixWorld.decompose( possition, quaternion, scale );

    
                 let position = this._world.bodies[i].object.parent.worldToLocal(
                    new Vector3().copy(this._world.bodies[i].position)
                )




            //    console.log(this._world.bodies[i])
            if(this._world.bodies[i].constraints.x == 0){
                this._world.bodies[i].object.position.x = position.x
            }

            else{
                this._world.bodies[i].position.x =  this._world.bodies[i].initPosition.x
                this._world.bodies[i].velocity.x = 0
            }

            if(this._world.bodies[i].constraints.y == 0){
                this._world.bodies[i].object.position.y = position.y
            }

            else{
                this._world.bodies[i].position.y =  this._world.bodies[i].initPosition.y
                this._world.bodies[i].velocity.y = 0
            }

            if(this._world.bodies[i].constraints.z == 0){
                this._world.bodies[i].object.position.z = position.z
            }

            else{
                this._world.bodies[i].position.z =  this._world.bodies[i].initPosition.z
                this._world.bodies[i].velocity.z = 0
            } 



                this._world.bodies[i].object.quaternion.copy(
                    this._world.bodies[i].quaternion
                );
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
