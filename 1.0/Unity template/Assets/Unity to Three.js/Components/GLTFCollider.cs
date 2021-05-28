   
using System.Collections.Generic;
using UniGLTF;
using UnityEngine;

        public class GLTFCollider 
        {
            
            public string name { get; set; }
            public string collider { get; set; }
            
            public List<int> colliders { get; set; }

            public int direction { get; set; }
            public float radius { get; set; }
            public float height { get; set; }

            
            public Vector3 extents { get; set; }
            public Vector3 center { get; set; }

            public bool trigger;
            public GLTFCollider(Collider coll)
            { 
                // or set properties in default constructor to generate sample data
                name = "Collider";
                trigger = coll.isTrigger;

                if (coll.GetType().ToString() == "UnityEngine.BoxCollider")
                {
                    var boxCollider = coll.GetComponent<BoxCollider>();
                    collider = "box";
                    center = boxCollider.center;
                    extents = boxCollider.size;
                    Object.DestroyImmediate(boxCollider);

                }

                if (coll.GetType().ToString() == "UnityEngine.SphereCollider")
                {
                    var sphereCollider = coll.GetComponent<SphereCollider>();
                    collider = "sphere";
                    center = sphereCollider.center;
                    extents = new Vector3(sphereCollider.radius,sphereCollider.radius,sphereCollider.radius);
                    Object.DestroyImmediate(sphereCollider);
                }
                
                

                
                if (coll.GetType().ToString() == "UnityEngine.CapsuleCollider")
                {
                    Debug.LogWarning("Cylinder not implemented");
                    var capsuleCollider = coll.GetComponent<CapsuleCollider>();
                    collider = "capsule";
                    center = capsuleCollider.center;
                    extents = capsuleCollider.bounds.extents;
                    radius = capsuleCollider.radius;
                    height = capsuleCollider.height;
                    direction = capsuleCollider.direction;
                    Object.DestroyImmediate(capsuleCollider);

                }
                
                
         
                
            }
        }