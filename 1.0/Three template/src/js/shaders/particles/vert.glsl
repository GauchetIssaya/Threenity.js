
uniform float uTime;
uniform float uPosition;

uniform float uOffset;
uniform vec2 uSize;

uniform vec3 uEmitterPosition;
uniform vec3 uParticleVelocity;

uniform float uParticleSpeed;
uniform float uParticleLifeTime;



attribute vec4 aPosition;
attribute vec2 aColor;
 

varying vec2 vUv;
varying float vOpacity;
varying float vScaleProgress;
varying float vPositionProgress;
varying float vParticleLifeTime;

// varying float vScale;



void main()	{

    vec4 modelPos = modelMatrix * vec4(position, 1.0);
    vec4 viewPos = viewMatrix * modelPos;
    vec4 projectedPos = projectionMatrix * viewPos;
    
    float speed = uParticleSpeed * uTime;
    float scale = aPosition.w * uSize.x;
    
    float scaleProgress = scale * speed;
    vec3 transformed = position.xyz;
    
    transformed += aPosition.xyz;

    transformed += uParticleVelocity + speed;


    float maxScale = mod(scaleProgress, uSize.y);
    
    // transformed.xy *= maxScale + uSize.x;


    float positionYMax = mod(speed, uParticleLifeTime);
    // transformed.y += positionYMax;

    float distanceFromStart = (transformed.y * positionYMax);
    
    vUv = uv;
    vOpacity = aColor.y;
    vScaleProgress = scaleProgress;
    vPositionProgress = transformed.y;
    vParticleLifeTime = maxScale;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
    gl_PointSize *= (1.0 / viewPos.z);
}
