using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using SoxwareInteractive.AnimationConversion;
using UniGLTF;
using UnityEditor;
using UnityEditor.Animations;
using UnityEditor.PackageManager.UI;
using UnityEngine;
using Debug = UnityEngine.Debug;

public class ExporterWindow : EditorWindow
{
    static float version = 0.5f;

    public GameObject scene;
    private Texture2D m_Logo = null;

    bool converted;
    bool exportAnimation;
    bool exportActive;

    [MenuItem("Unity To Three/Exporter", false, 0)]
    public static void ShowWindow()
    {
        GetWindow<ExporterWindow>("Exporter " + version);
    }

    private new string name;

    bool DracoCompress;
    bool SeparateTextures;
    bool CreateFile;

    void OnGUI()
    {
        m_Logo = (Texture2D) AssetDatabase.LoadAssetAtPath("Assets/Unity to Three.js/MISC/logo.png", typeof(Texture2D));
        GUILayout.Label(m_Logo);
        GUILayout.Label("Unity to GLTF : ", EditorStyles.largeLabel);
        GUILayout.Space(30);
        scene = EditorGUILayout.ObjectField("Scene container", scene, typeof(GameObject), true) as GameObject;
        CreateFile = GUILayout.Toggle(CreateFile, "Create File");
        if (!CreateFile)
        {
            if (GUILayout.Button("Export File : " + originalpath))
            {
                GetPathFile();
            }
        }

        else
        {
            if (GUILayout.Button("Export Folder : " + originalpath))
            {
                GetPathFolder();
            }
        }


        GUILayout.Label("Name : ", EditorStyles.largeLabel);
        name = GUILayout.TextField(name);

        SeparateTextures = GUILayout.Toggle(SeparateTextures, "Separate Textures");
        if (SeparateTextures)
        {
            if (GUILayout.Button("Export Folder Textures : " + originalTexturePath))
            {
                GetPathFolderTextures();
            }
        }

        exportAnimation = GUILayout.Toggle(exportAnimation, "Export Animations");
        exportActive = GUILayout.Toggle(exportActive, "Export Inactive Objects");
        DracoCompress = GUILayout.Toggle(DracoCompress, "Compress File");

        if (GUILayout.Button("Export ", GUILayout.Height(50)))
        {
            if (name == String.Empty)
            {
                name = scene.name;
            }

            if (path != String.Empty)
            {
                if (SeparateTextures && originalTexturePath != String.Empty)
                {
                    UniGLTF(scene);
                }

                else if (!SeparateTextures)
                {
                    UniGLTF(scene);
                }
            }
        }
    }

    private GameObject go;
    private List<Texture> textures;
    private List<string> texturesNames;

    private void UniGLTF(GameObject gameObject)
    {
        texturesNames = new List<string>();
        go = Instantiate(gameObject);

        var childs = go.transform.Traverse().ToList();

        foreach (var child in childs)
        {
            if (child != null)
            {
                if (!child.gameObject.activeInHierarchy)
                {
                    DestroyImmediate(child.gameObject);
                }

                if (SeparateTextures && child.TryGetComponent(out MeshRenderer mR))
                {
                    foreach (var material in mR.materials)
                    {
                        if (material.mainTexture != null)
                        {
                            var properties = child.gameObject.AddComponent<TextureProperties>();

                            properties.textureAccessor = material.mainTexture.name;
                            properties.textureOffset = material.mainTextureOffset;
                            properties.textureRepeat = material.mainTextureScale;

                            if (!texturesNames.Contains(material.mainTexture.name))
                            {
                                var filename = originalTexturePath + "/" + properties.textureAccessor + ".png";
                                texturesNames.Add(material.mainTexture.name);

                                RenderTexture renderTex = RenderTexture.GetTemporary(
                                    material.mainTexture.width,
                                    material.mainTexture.height,
                                    0,
                                    RenderTextureFormat.Default,
                                    RenderTextureReadWrite.Linear);

                                Graphics.Blit(material.mainTexture, renderTex);
                                RenderTexture previous = RenderTexture.active;
                                RenderTexture.active = renderTex;
                                Texture2D readableText = new Texture2D(material.mainTexture.width,
                                    material.mainTexture.height);
                                readableText.ReadPixels(new Rect(0, 0, renderTex.width, renderTex.height), 0, 0);
                                readableText.Apply();
                                RenderTexture.active = previous;
                                RenderTexture.ReleaseTemporary(renderTex);

                                File.WriteAllBytes(filename, readableText.EncodeToPNG());
                            }

                            material.mainTexture = null;
                        }
                    }
                }
            }
        }


        converted = false;
        prefabPaths = new List<string>();
        ConvertAnimation(go);

        if (converted)
        {
           // Debug.Log("GO : " + go + " New Object : :" + newObject);
            //go = newObject;
        }


        var gltf = new glTF();
        using (var exporter = new gltfExporter(gltf))
        {
            exporter.Prepare(go, exportAnimation, exportActive);
            exporter.Export(exportActive);
        }

        var bytes = gltf.ToGlbBytes();


        if (CreateFile)
        {
            path += "/" + name + ".glb";
        }

        Debug.Log("Exported to : " + path);


        File.WriteAllBytes(path, bytes);

        if (DracoCompress)
            Compress();

        Debug.Log("Finished");

        Cleanup();
    }

    private void ConvertAnimation(GameObject go)
    {
        if (exportAnimation)
        {
            if (go != null)
            {
                foreach (Transform child in go.transform)
                {
                    if (child.childCount > 0)
                    {
                        foreach (Transform child2 in child.transform)
                        {
                            if (child2.TryGetComponent(out Animator a))
                            {
                                Convert(child2);
                            }
                        }
                    }

                    if (child.TryGetComponent(out Animator ab))
                    {
                        Convert(child);
                    }
                }

                if (go.TryGetComponent(out Animator parentAnimator))
                {
                    Convert(go.transform);
                }
            }
        }
    }

    public void Convert(Transform toConvert)
    {
        Debug.Log("Conversion");
        AnimationClip[] l;
        l = AnimationUtility.GetAnimationClips(toConvert.gameObject);
        var pref = GetPrefabPair(toConvert.gameObject);

        for (int i = 0; i < l.Length; i++)
        {
            AnimationConverter.Configuration config = new AnimationConverter.Configuration();

            config.Prefabs = new AnimationConverter.PrefabPair[] {pref};
            config.DestinationAnimationType = AnimationConverter.AnimationType.Generic;
            config.OutputDirectory = "Assets/Unity to Three.js/Temporary/Animations";

            if (AnimationConverter.GetAnimationType(l[i]) == AnimationConverter.AnimationType.Humanoid)
            {
                AnimationConverter.Convert(l[i], config, out string b);
               
            }
        }

        ApplyAnimator();
    }


    private void Compress()
    {
        Process process;
        string strCmdText;

        string[] newString = path.Split('.');
        string newPath = newString[0];
        string extension;


        if (DracoCompress)
        {
            newPath += "(Draco)";
            extension = ".gltf";
            strCmdText = "/C gltf-pipeline -i " + path + " -o  " + newPath + extension + " -d";

            process = Process.Start("cmd.exe", strCmdText);
            process.WaitForExit();

            extension = ".glb";
            strCmdText = "/C gltf-pipeline -i " + newPath + ".gltf" + " -o " + newPath + "(GLB)" + extension;

            process = Process.Start("cmd.exe", strCmdText);
            process.WaitForExit();
        }
    }

    private static string[] files;
    private static string path;

    private static string pathTextures;
    //public 


    private static string originalpath;
    private static string originalTexturePath;

    private static void GetPathFile()
    {
        path = EditorUtility.OpenFilePanel("Export Path", "", "glb,gltf");
        originalpath = path;
    }

    private static void GetPathFolder()
    {
        path = EditorUtility.OpenFolderPanel("Export Folder", "", "");
        originalpath = path;
    }

    private static void GetPathFolderTextures()
    {
        pathTextures = EditorUtility.OpenFolderPanel("Export Textures Folder", "", "");
        originalTexturePath = pathTextures;
    }


    public static List<string> prefabPaths = new List<string>();
    public static List<string> createdPaths = new List<string>();
    public static List<string> stringList = new List<string>();
    private static AnimationConverter.PrefabPair pair;
    static string path2 = "Assets/Safe";
    private static GameObject newPrefab;
    public GameObject goToConvert;
    public string toConvertPath;

    public AnimationConverter.PrefabPair GetPrefabPair(GameObject toPrefab)
    {
        stringList = new List<string>();
        path2 = String.Empty;
        converted = false;


        if (toPrefab.TryGetComponent(out MeshFilter rendererparent) && !stringList.Contains(path2))
        {
            path2 = AssetDatabase.GetAssetPath(rendererparent.sharedMesh);
            stringList.Add(path2);
            converted = true;
        }

        else if (toPrefab.TryGetComponent(out SkinnedMeshRenderer skinnedparent) && !stringList.Contains(path2))
        {
            path2 = AssetDatabase.GetAssetPath(skinnedparent.sharedMesh);
            stringList.Add(path2);
            converted = true;
        }

        else
        {
            foreach (Transform child in toPrefab.transform)
            {
                if (child.TryGetComponent(out SkinnedMeshRenderer skinned) && !stringList.Contains(path2))
                {
                    path2 = AssetDatabase.GetAssetPath(skinned.sharedMesh);
                    stringList.Add(path2);
                    converted = true;
                    break;
                }

                if (child.TryGetComponent(out MeshFilter renderer) && !stringList.Contains(path2))
                {
                    path2 = AssetDatabase.GetAssetPath(renderer.sharedMesh);
                    stringList.Add(path2);
                    converted = true;

                    break;
                }
            }
        }


        if (converted)
        {
            GameObject prefab = AssetDatabase.LoadAssetAtPath(path2, typeof(GameObject)) as GameObject;
            AssetDatabase.CopyAsset(path2, "Assets/Unity to Three.js/Temporary/Mesh/" + toPrefab.name + ".fbx");
            createdPaths.Add("Assets/Unity to Three.js/Temporary/Mesh/" + toPrefab.name + ".fbx");
            newPrefab = AssetDatabase.LoadAssetAtPath(
                "Assets/Unity to Three.js/Temporary/Mesh/" + toPrefab.name + ".fbx", typeof(GameObject)) as GameObject;
            //Debug.Log(newPrefab);
            AssetDatabase.Refresh();


            pair.SourcePrefab = prefab;
            pair.DestinationPrefab = newPrefab;
        }

        var newPath = "Assets/Unity to Three.js/Temporary/Mesh/Original/" + toPrefab.name + ".prefab";
        PrefabUtility.SaveAsPrefabAsset(toPrefab, newPath);
        prefabPaths.Add(newPath);
        createdPaths.Add(newPath);
        //toConvertPath = "Assets/Unity to Three.js/Temporary/Mesh/Original" + toPrefab.name + ".fbx";

        Replace(toPrefab, newPrefab);

        return pair;
    }


    private static List<GameObject> newObjects;
    public GameObject newObject;

    private void Replace(GameObject toReplace, GameObject replacement)
    {
        newObjects = new List<GameObject>();
        newObject = new GameObject();
        var selected = toReplace;

        var prefabType = PrefabUtility.GetPrefabAssetType(replacement);

        if (prefabType == PrefabAssetType.Regular)
        {
            newObject = (GameObject) PrefabUtility.InstantiatePrefab(replacement);
        }
        else
        {
            newObject = Instantiate(replacement);
            newObject.name = replacement.name;
        }

        if (newObject == null)
        {
            Debug.LogError("Error instantiating prefab");
        }

        Undo.RegisterCreatedObjectUndo(newObject, "Replace With Prefabs");
        newObject.transform.parent = selected.transform.parent;
        newObject.transform.localPosition = selected.transform.localPosition;
        newObject.transform.localRotation = selected.transform.localRotation;
        newObject.transform.localScale = selected.transform.localScale;
        newObject.transform.SetSiblingIndex(selected.transform.GetSiblingIndex());
//        Debug.Log(newObject.transform.localScale);
        newObjects.Add(newObject);

        Undo.DestroyObjectImmediate(selected);
    }


    private static void ApplyAnimator()
    {
        foreach (var newObject in newObjects)
        {
            if (newObject.TryGetComponent(out Animator animator))
            {
                var controller = AnimatorController.CreateAnimatorControllerAtPath(
                    "Assets/Unity to Three.js/Temporary/Animations/Controllers/Controller.controller");
                createdPaths.Add("Assets/Unity to Three.js/Temporary/Animations/Controllers/Controller.controller");
                var rootStateMachine = controller.layers[0].stateMachine;

                var files = Directory.GetFiles("Assets/Unity to Three.js/Temporary/Animations");


                foreach (var file in files)
                {
                    if (!file.EndsWith(".meta"))
                    {
                        createdPaths.Add(file);
                        var asset = AssetDatabase.LoadAssetAtPath(file, typeof(AnimationClip)) as AnimationClip;
                        var stateA1 = rootStateMachine.AddState("stateA1");
                        stateA1.motion = asset;
                        Debug.Log("Exported animation : "+asset.name);
                    }
                }

                animator.runtimeAnimatorController = controller;
            }
        }
    }

    private void Cleanup()
    {
        DestroyImmediate(go);
        path = originalpath;

        if (converted)
        {
            foreach (var path in prefabPaths)
            {
                var toConvert = AssetDatabase.LoadAssetAtPath(path, typeof(GameObject)) as GameObject;
              //  Debug.Log("newPrefab : " + newPrefab + " toConvert : " + toConvert);
                foreach (var created in createdPaths)
                {
                    AssetDatabase.DeleteAsset(created);
                }
            }
        }
    }
}