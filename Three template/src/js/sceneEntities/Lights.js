import * as THREE from 'three';

export default class Lights{
    constructor(sdkParameters, lights) {
        this.params = sdkParameters;
        this.lights = lights;
        this.lightHelpers = [];

        this._setupHelpers();
    }

    _setupHelpers() {
        this.lights.forEach(light => {
            switch (light.type) {
                case "PointLight":
                    let pointLightHelper = new THREE.PointLightHelper(light, 5, 0xff0000);
                    this.lightHelpers.push(pointLightHelper);
                break;
                case "DirectionalLight":
                    let directionnalLightHelper = new THREE.DirectionalLightHelper(light, 5, 0xff0000);
                    this.lightHelpers.push(directionnalLightHelper);
                break;
                case "SpotLight":
                    let spotLightHelper = new THREE.SpotLightHelper(light, 5, 0xff0000);      
                    this.lightHelpers.push(spotLightHelper);
                break;
            }
        });
    }

    addToScene(scene) {
        this.lights.forEach(light => {
            scene.add(light);
        });
        this.lightHelpers.forEach(lightHelper => {
            scene.add(lightHelper);
        });
    }

    update(delta) {
    }
}