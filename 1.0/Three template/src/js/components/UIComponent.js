/* import * as THREE from 'three';
//import { CSS3DRenderer, CSS3DSprite } from "three/build/three.module";
import { CSS3DRenderer, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js';
import {TEXTURES} from '../../assets/textures'

class UIComponent {

    constructor(scene,camera) {
        this.scene = scene;
        this.camera = camera;

        this.renderer = new CSS3DRenderer(); 
        this.renderer.setSize( window.innerWidth, window.innerHeight );
      //  document.createElement('container');
    

        document.getElementById( 'container' ).appendChild( this.renderer.domElement );
        document.getElementById( 'container' ).disabled = true
        document.getElementById( 'container' ).ondragstart = function() { return false; };


    }

    CreateSprite(sprite){
        const image = document.createElement( 'img' );

        image.src = TEXTURES.logo.file// sprite.image
        image.unselectable =  'on'

        image.style.pointerEvents = 'none'
        image.style.userSelect = 'none'

        const object = new CSS3DSprite( image.cloneNode() );


        this.scene.add(object)
        object.position.set(0,0,-100)


    }



    CreateText(text,width,height){
        var element = document.createElement('div');
        element.style.position = 'absolute';
        //text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
        element.style.width = width;
        element.style.height = height;
        //element.style.backgroundColor = "blue";
        element.innerHTML = text;
        element.style.top = 200 + 'px';
        element.style.left = 200 + 'px';
        document.body.appendChild(element);

        return text;
    }


    update(){
        this.renderer.render(this.scene,this.camera)
    }
}
export default UIComponent; */