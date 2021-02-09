import * as THREE from 'three';
import { color } from 'three/examples/jsm/libs/dat.gui.module';
import particlesFragment from '../shaders/particles/frag.glsl'
import particlesVertex from '../shaders/particles/vert.glsl'
import ObjectPooling from '../utils/ObjectPooling';


export default class ParticleSystemComponent{
    constructor(emitter, particleTexture, numberParticles, speed, lifeTime, spawnRadius, minParticleSize, maxParticleSize) {
        // this.particleEmitter = emitter;

        this.particleProperties = {
            emitter: emitter,
            texture: particleTexture,
            numberParticles: numberParticles,
            speed: speed, 
            lifeTime,
            spawnRadius: spawnRadius,
            minSize: minParticleSize,
            maxSize: maxParticleSize
        } 
        // this.particleProps = {
        //     scale: Math.random() * 0.2,
        // }

        this._scale = 0;
        this._setupUniforms();
        this._createAttributes();
    }
    
    _setupUniforms() {
        this.uniforms = {
            uMap: {value: this.particleProperties.texture}, 
            uTime: {value: 0.0}, 
            uSize: {value : new THREE.Vector2(this.particleProperties.minSize, this.particleProperties.maxSize) },
            uPosition: {value: 0.0},
            uEmitterPosition: {value: new THREE.Vector3()},
            uParticleVelocity: {value: new THREE.Vector3(10, 10, 0)},
            uParticleSpeed: {value: this.particleProperties.speed},
            uParticleLifeTime: {value: this.particleProperties.lifeTime},
            // offsetIndex: {value: ennemyIndex}, 
            uColorCustom: {value: new THREE.Color(1, 1, 1)}
        }
    }

    _createAttributes() {
        let positionAttributes = [];
        let colorAttributes = [];

        for (let i = 0; i < this.particleProperties.numberParticles; i++) {
            let scale = Math.random() + 0.2;

            let posX = (Math.random() - 0.5) * this.particleProperties.spawnRadius;
            let posY = Math.random() + 0.5;
            let posZ = (Math.random() - 0.5) * this.particleProperties.spawnRadius;
            
            let opacity = 1;
            colorAttributes.push(this.particleProperties.lifeTime, opacity);
            positionAttributes.push(posX, posY, posZ, scale);
        }          

        this.positionBuffer = new Float32Array(positionAttributes);
        this.colorBuffer = new Float32Array(colorAttributes);
        this._setupGeometry();
    }

    _setupGeometry() {
        let baseGeometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1);
        let instancedGeometry = new THREE.InstancedBufferGeometry().copy(baseGeometry);

        instancedGeometry.instanceCount = this.particleProperties.numberParticles;
        // instancedGeometry.instanceCount = 100;

        this._particleMaterial = new THREE.ShaderMaterial({
            fragmentShader: particlesFragment,
            vertexShader: particlesVertex,
            uniforms: this.uniforms,
            transparent: true,
            alphaTest: 0.5,
            // side: THREE.DoubleSide,
        });

        this._particleMesh = new THREE.Mesh(instancedGeometry, this._particleMaterial);

        this._setAttributes(instancedGeometry);
    }

    _setAttributes(instancedGeometry) {
        instancedGeometry.setAttribute(
            "aPosition",
            new THREE.InstancedBufferAttribute(this.positionBuffer, 4, false).setUsage(THREE.DynamicDrawUsage)
        );
  
        instancedGeometry.setAttribute(
            "aColor",
            new THREE.InstancedBufferAttribute(this.colorBuffer, 2, false).setUsage(THREE.DynamicDrawUsage)
        );
    }

    update(delta, playerPos) {
        this._particleMaterial.uniforms.uTime.value += delta;
        // this._particleMaterial.uniforms.uPosition.value += delta;
        this._particleMaterial.uniforms.uEmitterPosition.value = playerPos;
        // this._particleMaterial.uniforms.uParticleSpeed.value = this.particleProperties.speed;
        // this._particleMaterial.uniforms.uLifeDuration.value = this.particleProperties.lifeTime;

        this._particleMesh.position.copy(playerPos);        
    }

    addToScene(scene) {
        scene.add(this._particleMesh );
    }
}
