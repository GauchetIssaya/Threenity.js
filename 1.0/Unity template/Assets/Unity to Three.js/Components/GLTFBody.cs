using System.Collections.Generic;
using UniGLTF;
using UnityEngine;

 public class GLTFBody 
        {
            
            public string name { get; set; } 
            public int id { get; set; }
            
            public bool isBody { get; set; }
            public float mass { get; set; }
            public int isKinematic { get; set; }
            
            public string collider { get; set; }
            
            public List<GLTFCollider> colliders { get; set; }

            
            
            public Vector3 extents { get; set; }
            public Vector3 center { get; set; }
            
            public Vector3 constraints { get; set; }

            
            public GLTFBody(Rigidbody rb)
            { 
                // or set properties in default constructor to generate sample data
                name = "RigidBody";
                
                
                
                isBody = true;
                
                if (rb.isKinematic == true)
                {
                    isKinematic = 2;
                    mass = 0;

                }

                else
                {
                    isKinematic = 1;
                    mass = rb.mass;
                }

//                Debug.Log( rb.constraints);


                if (rb.constraints == RigidbodyConstraints.FreezePosition)
                {
                    Debug.Log("ALL");
                    constraints = new Vector3(1,1,1);
                }
                
                else if (rb.constraints == RigidbodyConstraints.FreezePositionX)
                {
                    Debug.Log("X");
                    constraints = new Vector3(1,0,0);

                }
                
                else if (rb.constraints == RigidbodyConstraints.FreezePositionY)
                {
                    Debug.Log("Y");
                    constraints = new Vector3(0,1,0);

                }
                
                else if (rb.constraints == RigidbodyConstraints.FreezePositionZ)
                {
                    Debug.Log("Z");
                    constraints = new Vector3(0,0,1);

                }
                
                 else if (rb.constraints == (RigidbodyConstraints.FreezePositionX | RigidbodyConstraints.FreezePositionY))
                 {
                     Debug.Log("X and Y");
                     constraints = new Vector3(1,1,0);

                 }
                
                else if (rb.constraints == (RigidbodyConstraints.FreezePositionX | RigidbodyConstraints.FreezePositionZ))
                {
                    Debug.Log("X and Z");
                    constraints = new Vector3(1,0,1);

                }
                
                else if (rb.constraints == (RigidbodyConstraints.FreezePositionY | RigidbodyConstraints.FreezePositionZ))
                {
                    Debug.Log("Y and Z");
                    constraints = new Vector3(0,1,1);

                }
                
            
                
                
                
                
                
                 // foreach (var colli in rb.GetComponents<Collider>())
                 // {
                 //     colliders.Add(new GLTFCollider(colli));
                 // }
                 
                 
                if (rb.TryGetComponent(out BoxCollider bc))
                {
                    
              


                    collider = "box";
                    center = bc.center;
                    extents = bc.size;
                    
                }
                
                if (rb.TryGetComponent(out CapsuleCollider cc))
                {
                    collider = "box";
                    center = cc.center;
                    extents = cc.bounds.extents;
                }
                
                
                
                else if (rb.TryGetComponent(out SphereCollider sc))
                {
                    collider = "sphere";
                    center = sc.center;
                    
                    extents = new Vector3(sc.radius,sc.radius,sc.radius);
                }
                
                
            }
        }
