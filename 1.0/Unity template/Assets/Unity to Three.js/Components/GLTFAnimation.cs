using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GLTFAnimation
{
    public string animationAccessor { get; set; }
    public GLTFAnimation(CustomProperties.AnimationProperties ap)
    {
        animationAccessor = ap.animationAccessor;
                 
    }
}
