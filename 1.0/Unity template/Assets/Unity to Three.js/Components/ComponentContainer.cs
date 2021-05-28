using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UniGLTF;
using UnityEngine;

public class ComponentContainer
{
    public List<GLTFTexture> TextureProperties { get; set; }
    public List<GLTFAnimation> AnimationProperties { get; set; }

    public List<GLTFBody> Rigidbodies { get; set; }
    public List<GLTFCollider> Colliders { get; set; }

    public List<GLTFLight> Lights { get; set; }
    public List<GLTFCamera> Cameras { get; set; }

    public ComponentContainer()
    {
        TextureProperties = new List<GLTFTexture>();
        AnimationProperties = new List<GLTFAnimation>();
        Rigidbodies = new List<GLTFBody>();
        Colliders = new List<GLTFCollider>();
        Lights = new List<GLTFLight>();
        Cameras = new List<GLTFCamera>();
    }
    
    
    public static ComponentContainer GetComponents(GameObject go)
         {

             ComponentContainer componentContainer = new ComponentContainer();

             CustomProperties.TextureProperties[] textureProperties;

             textureProperties = go.GetComponents<CustomProperties.TextureProperties>();


             if (textureProperties.Length > 0)
             {

                 foreach (var texture in textureProperties)
                 {
                     var text = new GLTFTexture(texture);
                     componentContainer.TextureProperties.Add(text);
                 }

             }
             /////Animation shit

             var Animationclips = new List<AnimationClip>();
             var animato = go.GetComponent<Animator>();
             var animatio = go.GetComponent<Animation>();
             if (animato != null)
             {
                 Animationclips = AnimationExporter.GetAnimationClips(animato);
             }

             if (animatio != null)
             {


                 Animationclips = AnimationExporter.GetAnimationClips(animatio);
             }

             if (Animationclips.Any())
             {

                 foreach (AnimationClip clip in Animationclips)
                 {

                     Debug.Log(clip.name);



                     //Assign animation
                     var properties = go.AddComponent<CustomProperties.AnimationProperties>();
                     Debug.Log("Remember to turn off when not exporting anims");
                     properties.animationAccessor = clip.name;


                 }

                 CustomProperties.AnimationProperties[] animationProperties;
                 animationProperties = go.GetComponents<CustomProperties.AnimationProperties>();



                 if (animationProperties.Length > 0)
                 {
                     foreach (var animation in animationProperties)
                     {
                         var anim = new GLTFAnimation(animation);
                         componentContainer.AnimationProperties.Add(anim);

                     }

                 }



             }




             Rigidbody[] rigidBodies;

             rigidBodies = go.GetComponents<Rigidbody>();

             if (rigidBodies.Length > 0)
             {

                 foreach (var body in rigidBodies)
                 {
                     if (body.TryGetComponent(out Collider collider))
                     {
                         //Debug.Log(collider.GetType());
                         if (collider.GetType() != typeof(MeshCollider))
                         {
                             var rigid = new GLTFBody(body);
                             componentContainer.Rigidbodies.Add(rigid);
                         }
                     }
                 }

             }


             Collider[] colliders;

             colliders = go.GetComponents<Collider>();
           // Debug.Log(go.name + "  " + colliders.Length);
             if (colliders.Length > 0)
             {
                 foreach (var collider in colliders)
                 {

                     var colli = new GLTFCollider(collider);
                     componentContainer.Colliders.Add(colli);
                     

                 }

             }
         

         Light[] lights;
            
            lights = go.GetComponents<Light>();

            if (lights.Length > 0)
            {

                foreach (var light in lights)
                {
                    var gltfL = new GLTFLight(light);
                    componentContainer.Lights.Add(gltfL);
                }
  
            }
            
            Camera[] cameras;
            
            cameras = go.GetComponents<Camera>();

            if (cameras.Length > 0)
            {

                foreach (var camera in cameras)
                {
                    var gltf = new GLTFCamera(camera);
                    componentContainer.Cameras.Add(gltf);
                }
  
            }
            
            
            
            
            return componentContainer;
        }
}