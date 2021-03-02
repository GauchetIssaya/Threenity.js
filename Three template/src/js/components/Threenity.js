import * as THREE from "three";
import * as CANNON from "cannon";
import {  PerspectiveCamera, Quaternion, Vector3 } from "three";
import AnimationComponent from "../components/AnimationComponent";

export default class Threenity {
    constructor(gltf, scene, world, canvas, textures) {
        this.model = gltf;
        this.modelScene = gltf.scene;
        this.scene = scene;
        this.world = world;
        this.textures = textures;
        this.entities = [];
        this.bodies = [];
        this.lights = [];
        this.camera;
        this.canvas = canvas;
        this.animators = [];
        this.clips = [];
        this.once = false;
        this._setupComponents();
    }

    _setupAnimations(component, child) {
        if (child.animations == null) {
            child.components["Animations"].clips = [];
        }

        this.model.animations.forEach((clip) => {
            if (clip.name === component.animationAccessor) {
                child.components["Animations"].clips.push(clip);

                child.components["Animations"].mixer = new AnimationComponent(
                    child,
                    clip
                );

                child.components[
                    "Animations"
                ].mixer.actions[0]._propertyBindings.forEach((element) => {
                    child.traverse((children) => {
                        if (
                            children.userData.name ==
                            element.binding.parsedPath.nodeName
                        ) {
                            element.binding.node = children;
                            return;
                        }
                    });
                });
                this.animators.push(child.components["Animations"].mixer);
            }
        });
    }

    _setupComponents() {
        this.modelScene.traverse((child) => {
            let gameObjectName = child.userData.name;
            let node = this.model.parser.json.nodes.find((element) => {
                return element.name == gameObjectName;
            });

            if (node == null && node != this.modelScene[0]) {
                console.log("Node not found :", child);
            } else if (node != null) {
                child.node = node;
                //   console.log(child.name,"  ", child.node.name)
                child.name = child.node.name;
                this.entities[child.name] = child;
                if (child.node.hasOwnProperty("components")) {
                    child.components = []; //child.node.components;

                    let box, shape;
                    let size = new Vector3();

                    let transform = {
                        scale: new Vector3(),
                        position: new Vector3(),
                        quaternion: new Quaternion(),
                    };

                    child.getWorldScale(transform.scale);
                    child.getWorldPosition(transform.position);
                    child.getWorldQuaternion(transform.quaternion);

                    child.node.components.forEach((component) => {
                        child.components[component.name] = component;

                        switch (component.name) {
                            case "Texture":
                                this.applyTexture(component, child);
                                break;
                            case "Animations":
                                this._setupAnimations(component, child);
                                break;
                            case "RigidBody":
                                this.setupPhysics(
                                    component,
                                    child,
                                    box,
                                    shape,
                                    size,
                                    transform
                                );
                                break;
                            case "Light":
                                this.setupLights(
                                    component,
                                    child,
                                    transform.position
                                );
                                break;
                            case "Camera":
                                this.setupCamera(
                                    component,
                                    transform.quaternion,
                                    transform.position,
                                    child
                                );
                                break;
                        }
                    });
                }

                //  console.log(child)
            }
        });
        this.setupMainScene();
    }

    applyTexture(component, child) {
        child.material = child.material.clone();
        let texture = this.textures[component.textureAccessor];
        texture.encoding = THREE.sRGBEncoding;
        child.material.map = texture;
        child.material.map.flipY = false;
        child.material.map.wrapS = THREE.RepeatWrapping;
        child.material.map.wrapT = THREE.RepeatWrapping;
        child.material.map.repeat = component.textureRepeat;
        child.material.map.offset = component.textureOffset;
    }

    setupMainScene() {
        this.scene.add(this.model.scene);
    }

    setupCamera(component, quaternion, position, child) {
        if (component.projection == "orthographique") {
            console.log("Camera Ortho to implement !");
        } else {
            this.camera = new PerspectiveCamera(
                component.fov,
                this.canvas.width / this.canvas.height,
                component.clippingPlanes.x,
                component.clippingPlanes.y
            );
        }

        this.camera.position.copy(position);
        this.camera.quaternion.copy(quaternion);
    }

    setupLights(light, child, position) {
        let color = new THREE.Color(
            light.color.x,
            light.color.y,
            light.color.z
        ).convertSRGBToLinear();

        switch (light.type) {
            case "Point":
                child.light = new THREE.PointLight(
                    color,
                    light.intensity,
                    light.range
                );
                break;
            case "Directional":
                child.light = new THREE.DirectionalLight(
                    color,
                    light.intensity
                );

                child.light.target = child.children[0];
                break;
            case "Ambient":
                child.light = new THREE.AmbientLight(color, light.intensity);
                break;
            case "Spot":
                child.light = new THREE.SpotLight(
                    color,
                    light.intensity,
                    light.distance,
                    light.angle
                );
                child.light.target = child.children[0];
                break;
            case "Rectangle":
                child.light = new THREE.RectAreaLight(color, light.intensity);
                break;
            default:
                child.light = null;
                break;
        }

        if (!light.active) {
            child.light.intensity = 0;
        }

        child.light.position.copy(position);
        this.lights.push(child.light);
    }

    setupPhysics(component, child, box, shape, size, transform) {
        child.body = new CANNON.Body({
            mass: component.mass,
        });

        // Collider shapes //
        if (component.collider == "box") {
            box = child.geometry.boundingBox;
            box.getSize(size);
            size.multiply(transform.scale);

            shape = new CANNON.Box(
                new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2)
            );
        } else if (component.collider == "sphere") {
            shape = new CANNON.Sphere(component.extents.z * transform.scale.x);
        }
        // Body copies mesh //
        child.body.addShape(shape);
        child.body.quaternion.copy(transform.quaternion);
        child.body.position.copy(transform.position);

        // Push to system //
        child.body.object = child;
        this.bodies.push(child.body);
        this.world.bodies.push(child.body);
        this.world.add(child.body);
    }

    getChildContains(index) {
        let found;
        let toReturn = [];

        this.modelScene.traverse((child) => {
            if (child.name.includes(index)) {
                found = true;
                toReturn.push(child);
            }
        });

        if (found) {
            return toReturn;
        } else {
            console.log("Child not found");
        }
    }
}
