import * as THREE from 'three';

class AnimationComponent{
    constructor(model,animations) {
        this.model = model.model ? model.model : model;

        
        this.animations = this.model.components['Animations'];
      //  console.log( this.animations)

        this.actions = [];
        this.actionType = {};
        this.mixer = null;
        this.currentAnim = null;
        this.setupMixer();
        
        for (let index = 0; index < this.model.components['Animations'].clips.length; index++) {

            let animation = this.model.components['Animations'].clips[index]

            this.setupAnimations(animation, animation.name, index);
        }

        this.activateAllActions();
    }

    setupMixer() {

        this.mixer = new THREE.AnimationMixer(this.model);

    }
    
    setupAnimations(action, actionName, animationNumber) {

        this.actionType[actionName] = this.mixer.clipAction(action)
        this.actions.push(this.actionType[actionName]);
    }

    activateAllActions(action, actionWeight) {
        this.actions.forEach(action => {
            this.setWeight(action, 1.0);
        });
    }

    pauseAllActions() {
        this.actions.forEach(( action ) => {
            action.paused = true;
        } );
    }

    unPauseAllActions() {
        this.actions.forEach(( action ) => {
            action.paused = false;
        } );
    }

    setWeight( action, weight ) {
        action.enabled = true;
        action.setEffectiveTimeScale( 1 );
        action.setEffectiveWeight( weight );
    }

    playAnimation(action) {
       // this.currentAnim = action.getClip().name

        action.play();
    }
    
    pauseAnimation(action) {
        action.pause();
    }

    animFade(startAction, endAction, defaultDuration, notRestarting) {
        if(notRestarting) {
            endAction.loop = THREE.LoopOnce;
            endAction.clampWhenFinished = true;
        }

        this.unPauseAllActions();
        this.setWeight(endAction, 1);
        endAction.time = 0;
        startAction.crossFadeTo(endAction, defaultDuration, true);

        this.playAnimation(endAction)
    }

    getCurrentAnim() {
        return this.currentAnim;
    }
    
    update(delta) {
        this.mixer.update(delta);
    }
}

export default AnimationComponent;