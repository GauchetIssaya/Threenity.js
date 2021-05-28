using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GLTFTexture
{
            
    public string textureAccessor { get; set; } 
    public Vector2 textureOffset { get; set; } 
    public Vector2 textureRepeat { get; set; } 
             
            
    public GLTFTexture(CustomProperties.TextureProperties tp)
    {
        textureAccessor = tp.textureAccessor;
        textureOffset = tp.textureOffset;
        textureRepeat = tp.textureRepeat;
    }
}
         


