



using System.Collections.Generic;
using UniGLTF;
using UnityEngine;

public class GLTFLight 
{
            
    public string name { get; set; } 
    public string type { get; set; } 
    public float intensity { get; set; } 
    public float range { get; set; } 
    public Vector4 color { get; set; } 
             
    public int id { get; set; }
    public bool active { get; set; }


    public GLTFLight(Light light)
    { 
        name = "Light";
        type = light.type.ToString();
        intensity = light.intensity;
        active = light.isActiveAndEnabled;
        if (type == "Point" || type == "Spot")
        {
            range = light.range;
        }

                

        //color = new Vector4(light.color.r*255.0f, light.color.g*255.0f, light.color.b*255.0f, light.color.a*255.0f)  ;
        color = light.color;
//                 Debug.Log(color);


    }
}