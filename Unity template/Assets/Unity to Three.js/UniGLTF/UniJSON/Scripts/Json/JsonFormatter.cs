using System;
using System.Linq;
using System.Collections.Generic;
using System.Text;
using System.Linq.Expressions;
using System.Globalization;
using System.Reflection;
using UniGLTF;
using Object = UnityEngine.Object;
#if UNIJSON_PROFILING
public struct Vector3
{
    public float x;
    public float y;
    public float z;
}
#else
using UnityEngine;
#endif

namespace UniJSON
{
    public class JsonFormatter
    {
        IStore m_w;
        protected IStore Store
        {
            get { return m_w; }
        }

        enum Current
        {
            ROOT,
            ARRAY,
            OBJECT
        }

        class Context
        {
            public Current Current;
            public int Count;

            public Context(Current current)
            {
                Current = current;
                Count = 0;
            }
        }

        Stack<Context> m_stack = new Stack<Context>();

        string m_indent;
        void Indent()
        {
            if (!string.IsNullOrEmpty(m_indent))
            {
                m_w.Write('\n');
                for (int i = 0; i < m_stack.Count - 1; ++i)
                {
                    m_w.Write(m_indent);
                }
            }
        }

        string m_colon;

        public JsonFormatter(int indent = 0)
            : this(new StringBuilderStore(new StringBuilder()))
        {
            m_indent = new string(Enumerable.Range(0, indent).Select(x => ' ').ToArray());
            m_colon = indent == 0 ? ":" : ": ";
        }

        public JsonFormatter(IStore w)
        {
            m_w = w;
            m_stack.Push(new Context(Current.ROOT));
        }

        public override string ToString()
        {
            var bytes = GetStore().Bytes;
            return Encoding.UTF8.GetString(bytes.Array, bytes.Offset, bytes.Count);
        }

        public IStore GetStore()
        {
            return m_w;
        }

        public void Clear()
        {
            m_w.Clear();
            m_stack.Clear();
            m_stack.Push(new Context(Current.ROOT));
        }

        protected void CommaCheck(bool isKey = false)
        {
            var top = m_stack.Pop();
            switch (top.Current)
            {
                case Current.ROOT:
                    {
                        if (top.Count != 0) throw new JsonFormatException("multiple root value");
                    }
                    break;

                case Current.ARRAY:
                    {
                        if (top.Count != 0)
                        {
                            m_w.Write(',');
                        }
                    }
                    break;

                case Current.OBJECT:
                    {
                        if (top.Count % 2 == 0)
                        {
                            if (!isKey) throw new JsonFormatException("key exptected");
                            if (top.Count != 0)
                            {
                                m_w.Write(',');
                            }
                        }
                        else
                        {
                            if (isKey) throw new JsonFormatException("key not exptected");
                        }
                    }
                    break;
            }
            top.Count += 1;
            /*
            {
                var debug = string.Format("{0} {1} = {2}", m_stack.Count, top.Current, top.Count);
                Debug.Log(debug);
            }
            */
            m_stack.Push(top);
        }

        public void Null()
        {
            CommaCheck();
            m_w.Write("null");
        }

        public ActionDisposer BeginList()
        {
            CommaCheck();
            m_w.Write('[');
            m_stack.Push(new Context(Current.ARRAY));
            return new ActionDisposer(EndList);
        }

        public void EndList()
        {
            if (m_stack.Peek().Current != Current.ARRAY)
            {
                throw new InvalidOperationException();
            }
            m_w.Write(']');
            m_stack.Pop();
        }

        public ActionDisposer BeginMap()
        {
            CommaCheck();
            m_w.Write('{');
            m_stack.Push(new Context(Current.OBJECT));
            return new ActionDisposer(EndMap);
        }

        public void EndMap()
        {
            if (m_stack.Peek().Current != Current.OBJECT)
            {
                throw new InvalidOperationException();
            }
            m_stack.Pop();
            Indent();
            m_w.Write('}');
        }

        protected virtual System.Reflection.MethodInfo GetMethod<T>(Expression<Func<T>> expression)
        {
            var formatterType = GetType();
            var method = formatterType.GetMethod("Value", new Type[] { typeof(T) });
            return method;
        }

        public void KeyValue<T>(Expression<Func<T>> expression)
        {
            var func = expression.Compile();
            var value = func();
            if (value != null)
            {
                var body = expression.Body as MemberExpression;
                if (body == null)
                {
                    body = ((UnaryExpression)expression.Body).Operand as MemberExpression;
                }
                Key(body.Member.Name);

                var method = GetMethod(expression);
                method.Invoke(this, new object[] { value });
            }
        }

        public void Key(String key)
        {
            
            CommaCheck(true);
            Indent();
            m_w.Write(JsonString.Quote(key));
            
            m_w.Write(m_colon);
        }
        
        public void CustomKey(String key)
        {
            
            //CommaCheck(true);
            //Indent();
            m_w.Write("{");
            m_w.Write(JsonString.Quote(key));

            m_w.Write(m_colon);
        }
        

        public void Value(String key)
        {
            CommaCheck();
            m_w.Write(JsonString.Quote(key));
        }

        public void Value(Boolean x)
        {
            CommaCheck();
            m_w.Write(x ? "true" : "false");
        }

        public void Value(JsonNode node)
        {
            CommaCheck();
            m_w.Write(node.Value.Segment.ToString());
        }

        /*
        public void Value<T>(T x) where T : struct, IConvertible
        {
            Value(Convert.ToInt32(x));
        }
        */

        public void Value(SByte x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }
        public void Value(Int16 x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }
        public void Value(Int32 x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }
        public void Value(Int64 x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }

        public void Value(Byte x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }
        public void Value(UInt16 x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }
        public void Value(UInt32 x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }
        public void Value(UInt64 x)
        {
            CommaCheck();
            m_w.Write(x.ToString());
        }

        public void Value(Single x)
        {
            CommaCheck();
            m_w.Write(x.ToString("R", CultureInfo.InvariantCulture));
        }
        public void Value(Double x)
        {
            CommaCheck();
            m_w.Write(x.ToString("R", CultureInfo.InvariantCulture));
        }
        public void Value(Vector3 v)
        {
            //CommaCheck();
            BeginMap();
            Key("x"); Value(v.x);
            Key("y"); Value(v.y);
            Key("z"); Value(v.z);
            EndMap();
        }
        
        public void Value(Vector4 v)
        {
            //CommaCheck();
            BeginMap();
            Key("x"); Value(v.x);
            Key("y"); Value(v.y);
            Key("z"); Value(v.z);
            Key("w"); Value(v.w);

            EndMap();
        }
        
        
        public void Value(Vector2 v)
        {
            //CommaCheck();
            BeginMap();
            Key("x"); Value(v.x);
            Key("y"); Value(v.y);
            EndMap();
        }
        
        

        public void Value(string[] a)
        {
            BeginList();
            foreach (var x in a)
            {
                Value(x);
            }
            EndList();
        }
        public void Value(List<string> a)
        {
            BeginList();
            foreach (var x in a)
            {
                Value(x);
            }
            EndList();
        }
        
        public void Value(List<gltfExporter.GLTFBody> a)
        {
            BeginList();
//            Debug.Log(a[0]);
            foreach (var x in a)
            {
                
                    
                    Debug.Log(x);
                  //  Value();
                    
                
                
            }
            EndList();
        }
        
        public void Value(List<int> a)
        {
            BeginList();
//            Debug.Log(a[0]);
            foreach (var x in a)
            {
                Value(x);
                
            }
            EndList();
        }
        
        public void Value(gltfExporter.ComponentContainer a)
        {
            BeginList();

            if(a.TextureProperties != null){
                foreach (var texture in a.TextureProperties)
                {
                    
                    
                    BeginMap();
                    
                    Key("name"); Value("Texture");
                    Key("textureAccessor"); Value(texture.textureAccessor);
                    Key("textureOffset"); Value(texture.textureOffset);
                    Key("textureRepeat");Value(texture.textureRepeat);

                    EndMap();
                    
                }
                
            }
            
            if(a.AnimationProperties != null){
                foreach (var animation in a.AnimationProperties)
                {

                    BeginMap();
                    
                    Key("name"); Value("Animations");
                    Key("animationAccessor"); Value(animation.animationAccessor);
                    EndMap();
                    
                }
                
            }
            
            
            
            
            
            if(a.Rigidbodies != null){
                foreach (var rigidBody in a.Rigidbodies)
                {
                    
                    
                    BeginMap();
                    
                    Key("name"); Value(rigidBody.name);
                    Key("isBody"); Value(rigidBody.isBody);
                    Key("collider"); Value(rigidBody.collider);
                    Key("extents"); Value(rigidBody.extents);
                    Key("mass"); Value(rigidBody.mass);
                    Key("center"); Value(rigidBody.center);
                    Key("id"); Value(rigidBody.id);
                    
                    EndMap();
                    
                }
                
            }
            
            if(a.Colliders.Count > 0){
                BeginMap();
                Key("name"); Value("Colliders");

                int index = 0;
             
                foreach (var collider in a.Colliders)
                {
                     Key("Collider : " + index); Value(collider);
                    index++;
                }
                EndMap();

            }
                
                
            
            
            
             if(a.Lights != null){
                 foreach (var light in a.Lights)
                 {
            
                     BeginMap();
                    
                     Key("name"); Value(light.name);
                     Key("intensity"); Value(light.intensity);
                     Key("range"); Value(light.range);
                     Key("type"); Value(light.type);
                     Key("color"); Value(light.color);
                     Key("active"); Value(light.active);
                    
                     EndMap();
                     
                     
            
                 }
             }
             
             if(a.Cameras != null){
                 foreach (var camera in a.Cameras)
                 {
            
                     BeginMap();
                    
                     Key("name"); Value(camera.name);
                     Key("projection"); Value(camera.projection);
                     Key("aspect"); Value(camera.aspect);
                     Key("fov"); Value(camera.fov);
                     Key("active"); Value(camera.active);
                     Key("clippingPlanes"); Value(camera.clippingPlanes);
                     Key("main"); Value(camera.main);
                    
                     EndMap();
                     
                     
            
                 }
             }
             
             
            
            EndList();
        }

        public void Value(gltfExporter.GLTFCollider colli)
        {
             
                BeginMap();
                    
                Key("name"); Value(colli.name +" : ");
                Key("collider"); Value(colli.collider);
                Key("center"); Value(colli.center);
                Key("extents"); Value(colli.extents);

                    
                EndMap();
             

            
        }



        // public void Value(gltfExporter.Contact x)
        // {
        //
        //     foreach (var p in x.GetType().GetProperties().Where(p => !p.GetGetMethod().GetParameters().Any())) {
        //         CommaCheck();
        //         m_w.Write(p.GetValue(x, null).ToString());
        //
        //     }
        //     
        // }

        public void Value(double[] a)
        {
            BeginList();
            foreach (var x in a)
            {
                Value(x);
            }
            EndList();
        }

        public void Value(float[] a)
        {
            BeginList();
            foreach (var x in a)
            {
                Value(x);
            }
            EndList();
        }

        public void Value(int[] a)
        {
            BeginList();
            foreach (var x in a)
            {
                Value(x);
            }
            EndList();
        }

        public void Bytes(ArraySegment<Byte> x)
        {
            CommaCheck();
            m_w.Write('"');
            m_w.Write(Convert.ToBase64String(x.Array, x.Offset, x.Count));
            m_w.Write('"');
        }

        public void Bytes(IEnumerable<byte> raw, int count)
        {
            Bytes(new ArraySegment<byte>(raw.Take(count).ToArray()));
        }

        public void Dump(ArraySegment<Byte> formated)
        {
            CommaCheck();
            m_w.Write(formated);
        }
    }
}
