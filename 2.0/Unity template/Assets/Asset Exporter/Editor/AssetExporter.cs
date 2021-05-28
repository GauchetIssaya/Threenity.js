using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using UniGLTF;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.PackageManager.UI;
using UnityEngine;
using Debug = UnityEngine.Debug;


#pragma warning disable 0649 // variable declared but not used.



public class AssetExporter : EditorWindow
{
    static float version = 0.8f;

    public List<GameObject> allGameObjects = new List<GameObject>();
    public List<Mesh> allMeshes = new List<Mesh>();
    public List<Material> allMaterials = new List<Material>();
    public List<Texture> AllTextures = new List<Texture>();

    
        
    public GameObject scene;
    private Texture2D m_Logo = null;

    bool converted;
    bool exportAnimation;
    bool exportActive;

    [MenuItem("Unity To Three/Asset Exporter", false, 0)]
    public static void ShowWindow()
    {
        GetWindow<AssetExporter>("Asset Exporter" + version);
    }

    private static string name;
    private string bru;

    bool DracoCompress;

    static bool CreateFile;



    private void OnValidate()
    {
    }

    void OnGUI()
    {
        
        m_Logo = (Texture2D) AssetDatabase.LoadAssetAtPath("Assets/Unity to Three.js/MISC/logo.png", typeof(Texture2D));
        GUILayout.Label(m_Logo);
        GUILayout.Label("Unity to GLTF : ", EditorStyles.largeLabel);
        GUILayout.Space(30);
        scene = EditorGUILayout.ObjectField("Scene container", scene, typeof(GameObject), true) as GameObject;


        


        CreateFile = GUILayout.Toggle(CreateFile, "Create File");

        if (CreateFile)
        {
            GUILayout.Label("Name : ", EditorStyles.largeLabel);
            name = scene.name;
            name = GUILayout.TextField(name);
        }

        else
        {
            name = "Level";
        }

        exportAnimation = GUILayout.Toggle(exportAnimation, "Export Animations");
        exportActive = GUILayout.Toggle(exportActive, "Export Inactive Objects");
        DracoCompress = GUILayout.Toggle(DracoCompress, "Compress File");

        if (GUILayout.Button("Export ", GUILayout.Height(50)))
        {

            Traverse();
      
           
            


        }
    }

    void Traverse()
    {
        allGameObjects = GameObject.FindObjectsOfType<GameObject>().ToList();	
        foreach (var gameObject in allGameObjects)
        {
            
            //if root
            if (gameObject.transform.parent == null)
            {
		
            } 
            

            if (gameObject.TryGetComponent(out MeshFilter meshFilter) && meshFilter.sharedMesh != null)
            {
                if (!allMeshes.Contains(meshFilter.sharedMesh))
                {
                    allMeshes.Add(meshFilter.sharedMesh);
                }
            }
            
            if (gameObject.TryGetComponent(out MeshRenderer meshRenderer) && meshRenderer.sharedMaterials != null)
            {
                foreach (var material in meshRenderer.sharedMaterials)
                {
                    if (!allMaterials.Contains(material))
                    {
                        allMaterials.Add(material);

                        if (material.GetTexture("_MainTex") != null && !AllTextures.Contains(material.GetTexture("_MainTex")))
                        {
                            AllTextures.Add(material.GetTexture("_MainTex"));
                        }
                    }
                }
                
            }
            
            
            
            
            
            

        }

        foreach (var mesh in allMeshes)
        {
            Debug.Log(mesh.name);
        }
        
        foreach (var material in allMaterials)
        {
            Debug.Log(material.name);
        }
        
        foreach (var texture in AllTextures)
        {
          //  Debug.Log(texture);
            SaveTexture(texture);
        }
        
        
        
    }

    void SaveTexture(Texture texture)
    {
        RenderTexture renderTex = RenderTexture.GetTemporary(
            texture.width,
            texture.height,
            0,
            RenderTextureFormat.Default,
            RenderTextureReadWrite.Linear);

        Graphics.Blit(texture, renderTex);
        RenderTexture previous = RenderTexture.active;                                                                        
        RenderTexture.active = renderTex;
        Texture2D readableText = new Texture2D(texture.width,texture.height);
        readableText.ReadPixels(new Rect(0, 0, renderTex.width, renderTex.height), 0, 0);
        readableText.Apply();
        RenderTexture.active = previous;
        RenderTexture.ReleaseTemporary(renderTex);
        
        File.WriteAllBytes("C:/Users/Issaya/Desktop/Unity-to-Three.js/1.0/Three template/src/assets/modelTextures/"+texture.name+".png", readableText.EncodeToPNG());

        
        // Texture2D texture2D = new Texture2D(texture.width,texture.height,TextureFormat.RGB24,false);
        // byte[] bytes = texture2D.EncodeToPNG();
        //
        // var dirPath = "C:/Users/Issaya/Desktop/Unity-to-Three.js/1.0/Three template/src/assets/modelTextures/";
        // if(!Directory.Exists(dirPath)) {
        //     Directory.CreateDirectory(dirPath);
        // }
        // File.WriteAllBytes(dirPath + texture.name + ".png", bytes);
        // Debug.Log(texture.name);
        
        
        
        /*var filename = texturePath + "/" + properties.textureAccessor + ".png";
        texturesNames.Add(material.mainTexture.name);

        RenderTexture renderTex = RenderTexture. RenderTexture.GetTemporary(
            material.mainTexture.width,
            material.mainTexture.height,
            0,
            RenderTextureFormat.Default,
            RenderTextureReadWrite.Linear);

        Graphics.Blit(material.mainTexture, renderTex);
        RenderTexture previous = RenderTexture.active;
        RenderTexture.active = renderTex;
        Texture2D readableText = new Texture2D(material.mainTexture.width,material.mainTexture.height);
        readableText.ReadPixels(new Rect(0, 0, renderTex.width, renderTex.height), 0, 0);
        readableText.Apply();
        RenderTexture.active = previous;
        RenderTexture.ReleaseTemporary(renderTex);

        File.WriteAllBytes(filename, readableText.EncodeToPNG());*/
    }
    

}