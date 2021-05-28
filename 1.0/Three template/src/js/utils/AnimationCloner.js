import AnimationComponent from '../components/AnimationComponent';

export default class AnimationCloner {
    constructor(model) {
        this.model = model.clone();
        this.model.components = model.components

        //Foreach to account for multiple clips

        this.model.components['Animations'].clips.forEach(clip => {
            clip = clip.clone()
            this.model.components['Animations'].mixer  = new AnimationComponent(this.model,clip)

        });

        console.log(this.model)
        this.model.components['Animations'].mixer.actions.forEach(action => {
            action._propertyBindings.forEach(element => {
            this.model.traverse((children) => {
          if(children.userData.name == element.binding.parsedPath.nodeName){
                 element.binding.node = children;
                 return;
                 
               }    
            });
        });

          
       }); 

        this.clone = this.getClonedModel();
    }

    getClonedModel() {
        
        let clonedGltf = this.cloneGltf(this.model);

        let clonedMesh = clonedGltf.scene
        return { clonedGltf, clonedMesh };
    }

    cloneGltf(gltf) {
        const clone = {
            animations: gltf.components['Animations'],
            scene: gltf.clone(true),
        };

        const skinnedMeshes = {};

        gltf.traverse((node) => {
            if (node.isSkinnedMesh) {
                skinnedMeshes[node.name] = node;
            }
        });

        const cloneBones = {};
        const cloneSkinnedMeshes = {};

        clone.scene.traverse((node) => {
            if (node.isBone) {
                cloneBones[node.name] = node;
            }

            if (node.isSkinnedMesh) {
                cloneSkinnedMeshes[node.name] = node;
            }
        });

        for (let name in skinnedMeshes) {
            const skinnedMesh = skinnedMeshes[name];
            const skeleton = skinnedMesh.skeleton;
            const cloneSkinnedMesh = cloneSkinnedMeshes[name];

            const orderedCloneBones = [];

            for (let i = 0; i < skeleton.bones.length; ++i) {
                const cloneBone = cloneBones[skeleton.bones[i].name];
                orderedCloneBones.push(cloneBone);
            }

            cloneSkinnedMesh.bind(
                new THREE.Skeleton(orderedCloneBones, skeleton.boneInverses),
                cloneSkinnedMesh.matrixWorld
            );
        }
        return clone;
    }

}