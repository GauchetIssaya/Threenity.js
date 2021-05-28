using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GLTFCamera
{
            
    public string name { get; set; } 
    public string projection { get; set; } 
    public float fov { get; set; } 
    public float aspect { get; set; } 
           
    public Vector2 clippingPlanes { get; set; }

    public int id { get; set; }
           
    public bool main { get; set; }
    public bool active { get; set; }


    public GLTFCamera(Camera camera)
    { 
        name = "Camera";
               
        if (!camera.orthographic)
            projection = "perspective";
        else
            projection = "orthographique";
               
        fov = camera.fieldOfView;
        aspect = camera.aspect;
        active = camera.isActiveAndEnabled;

        clippingPlanes = new Vector2(camera.nearClipPlane,camera.farClipPlane);
               
        if (camera.gameObject.CompareTag("MainCamera"))
            main = true;
        else
            main = false;


    }
}