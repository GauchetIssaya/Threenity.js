//utils
//vendors
import * as THREE from "three";
import * as CANNON from "cannon";

import Threenity from "../customLibrairies/Threenity";

import CannonDebugRenderer from "../customLibrairies/CannonDebugRenderer";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";

//components
import AnimationComponent from "../components/AnimationComponent";

//sceneEntities

import Level from "../sceneEntities/Level";

import { Color, Group, Mesh, Object3D, Quaternion, Vector3 } from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Scene {
    constructor(canvas, models, textures) {
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);

        this.vsdkParameters = VSDK.getParameters();
        this._canvas = canvas;

        this.playAnimation = false;

        this._textures = textures;
        this._models = models;

        this.animationsEntities = {};

        this.delta = 0;
        this._clock = new THREE.Clock();

        this._setupRenderer();
        this._setupThreeScene();

        this.sceneEntities = {
            /*  level: new Level(
          this.vsdkParameters.ModelExample,
          this.vsdkParameters.ModelExample.name,
          this._textures,
          this._scene 
        ),*/
        };

        this._createEntities();
        this._createModels();
        this._createModelsAnimations();

        this._setupCannonWorld();

        this._setupEngine();

        // this._setupOrbitControls();
    }

    _setupRenderer() {
        this._renderer = new THREE.WebGLRenderer({
            canvas: this._canvas,
            antialias: true,
        });
    }
    _setupThreeScene() {
        this._scene = new THREE.Scene();
    }

    _setupOrbitControls() {
        if (this.vsdkParameters.Debug) {
            this._controls = new OrbitControls(
                this._scene._camera,
                this._canvas
            );
            this._controls.update();
        }
    }

    _createModelsAnimations() {
        for (let model in this.sceneEntities) {
            if (!this.sceneEntities[model].is3dModel) continue;
            if (this.sceneEntities[model].isModelAnimated) {
                console.log(this.sceneEntities[model]);
                this.animationsEntities[model] = new AnimationComponent(
                    this.sceneEntities[model]
                );
            }
        }
    }

    _createEntities() {
        for (let entity in this.sceneEntities) {
            if (this.sceneEntities[entity].is3dModel) continue;
            this.sceneEntities[entity].addToScene(this._scene);
        }
    }

    _createModels() {
        for (let model in this.sceneEntities) {
            if (!this.sceneEntities[model].is3dModel) continue;
            this.sceneEntities[model].build(this._models);
            this.sceneEntities[model].addToScene(this._scene);
        }
    }

    _setupCannonWorld() {
        this._world = new CANNON.World();
        this._world.bodies = [];
        this._world.gravity.set(0, -9.8, 0);
        this._world.solver.iterations = 10;
        this._world.broadphase = new CANNON.NaiveBroadphase();

        this.cannonDebugRenderer = new THREE.CannonDebugRenderer(
            this._scene,
            this._world
        );
    }
    _setupEngine() {
        var engine = new Threenity(
            this._models[this.vsdkParameters.ModelExample.name],
            this._scene,
            this._world,
            this._canvas
        );
    }

    _start() {
        this._isReady = true;
    }

    startGame() {}

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._scene._camera.aspect = width / height;
        this._scene._camera.updateProjectionMatrix();
        this._renderer.setSize(width, height);
    }

    clickHandler(e) {
        console.log("Click");
    }

    clickHandlerUp(e) {}

    _render() {
        this.delta = this._clock.getDelta();

        for (let entity in this.sceneEntities) {
            this.sceneEntities[entity].update(this.delta);
        }

        for (let entity in this.animationsEntities) {
            this.animationsEntities[entity].update(this.delta);
        }
        this._renderer.render(this._scene, this._scene._camera);
    }

    tick() {
        this.updatePhysics();
        this.cannonDebugRenderer.update();
        this._render();
        this.stats.update();
    }

    updatePhysics() {
        var axisAndAngle, axis, angle;
        var timeStep = 1 / 30;

        this._world.step(timeStep);

        for (var i = 0; i !== this._world.bodies.length; i++) {
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
