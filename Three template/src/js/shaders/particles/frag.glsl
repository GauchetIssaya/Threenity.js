#define USE_MAP true
uniform sampler2D uMap;
uniform float uTime;
uniform vec3 uColorCustom;

varying vec2 vUv;
varying float vOpacity;
varying float vScaleProgress;
varying float vPositionProgress;
varying float vParticleLifeTime;


void main()	{
    vec2 pixelCord = vec2(vUv);

    vec4 texture = texture2D(uMap, pixelCord);
    // float opacityAttenuation = 1.0 - pow(vOpacity * vScaleProgress, vParticleLifeTime);
    float opacityAttenuation = 1.0 - vParticleLifeTime * 0.7;

    if(texture.a<.5) /*change threshold to desired output*/
        discard;


    gl_FragColor = vec4(texture.rgb, clamp(opacityAttenuation, 0.0, 1.0));
    // gl_FragColor = vec4(texture.rgb, opacityAttenuation);
    // gl_FragColor = vec4(texture.rgb, opacityAttenuation);
}
