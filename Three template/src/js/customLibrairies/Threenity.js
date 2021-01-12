import * as THREE from "three";
import * as CANNON from "cannon-es";
import { threeToCannon } from 'three-to-cannon';
import {
    Camera,
    Color,
    DirectionalLight,
    Light,
    PerspectiveCamera,
    Quaternion,
    Vector2,
    Vector3,
} from "three";

export default class Threenity {
    constructor(gltf, scene, world, canvas) {
        this.model = gltf;
        this.modelScene = gltf.scene;
        this.scene = scene;
        this.world = world;
        this.bodies = new Array();
        this.lights = new Array();
        this.canvas = canvas;

        scene.add(gltf.scene);
        this.setupComponents();
    }

    setupComponents() {
        var that = this;

        this.modelScene.traverse(function (child) {
            let index = child.userData.name;

            var node = that.model.parser.json.nodes.find(function (element) {
                return element.name == index;
            });

            if (node == null && node != that.modelScene[0]) {
                console.log("Node not found :", child);
            } else if (node != null) {
                child.node = node;

                if (child.node.hasOwnProperty("components")) {
                    child.components = child.node.components;

                    var box, shape;
                    var size = new Vector3();
                    var scale = new Vector3();
                    child.getWorldScale(scale);
                    var position = new Vector3();
                    child.getWorldPosition(position);
                    var quaternion = new Quaternion();
                    child.getWorldQuaternion(quaternion);

                    child.node.components.forEach((component) => {
                        if (component.name === "RigidBody") {
                            child.body = new CANNON.Body({
                                mass: component.mass,
                            });

                            // Collider shapes //

                             if (component.collider == "box") {
                                 shape = threeToCannon(child, {type: threeToCannon.Type.BOX});

                            } else if (component.collider == "sphere") {
                                 shape = threeToCannon(child, {type: threeToCannon.Type.SPHERE});
                            }

                            else if (component.collider == "mesh") {
                                shape = threeToCannon(child, {type: threeToCannon.Type.MESH});
                                
                           }
 
                            // Body copies mesh //

                            child.body.addShape(shape);
                            child.body.quaternion.copy(quaternion);
                            child.body.position.copy(position);

                            // Push to system //

                            child.body.object = child;
                            that.bodies.push(child.body);
                            that.world.addBody(child.body);


                        }

                        if (component.name === "Light") {
                            var color = new THREE.Color(
                                component.color.x,
                                component.color.y,
                                component.color.z
                            );

                            if (component.type == "Point") {
                                child.light = new THREE.PointLight(
                                    color,
                                    component.intensity,
                                    component.range
                                );
                            } else if (component.type == "Directional") {
                                child.light = new THREE.DirectionalLight(
                                    color,
                                    component.intensity
                                );

                                child.light.target = child.children[0];
                            }

                            if (!component.active) {
                                child.light.intensity = 0;
                            }

                            child.light.position.copy(position);
                            that.scene.add(child.light);
                        }

                        if (component.name === "Camera") {
                            var camera;

                            if (component.projection == "orthographique")
                                console.log("Camera Otrtho to implement !");
                            else
                                camera = new PerspectiveCamera(
                                    component.fov,
                                    that.canvas.width / that.canvas.height,
                                    component.clippingPlanes.x,
                                    component.clippingPlanes.y
                                );

                            camera.position.copy(position);
                            camera.quaternion.copy(quaternion);

                            that.scene.add(camera);
                            that.scene._camera = camera;
                        }
                    });

                    console.log(child);
                }
            }
        });
    }

    getChildContains(index) {
        let found;
        var toReturn = new Array();
        let i;

        this.modelScene.traverse(function (child) {
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
