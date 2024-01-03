#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vInvPos;
in vec3 vNormal;

uniform vec3 uCamPos;
uniform samplerCube uSkybox;
uniform vec4 uColor;
uniform float uAmbient;
uniform float uReflectivity;

out vec4 FragColor;

void main(){

    vec3 lightDir = normalize(vec3(1.0,-2.0,1.0));
    float boardLight = (max(dot(vec3(0.0,1.0,0.0),-lightDir),0.0) + uAmbient);
    float pieceLight = (max(dot(vNormal,-lightDir),0.0) + uAmbient);

    vec3 ray = normalize(vPosition-uCamPos);
    vec3 invRay = normalize(vInvPos-uCamPos);

    vec3 boardPoint = uCamPos + ((1.0 - uCamPos.y) / invRay.y) * invRay;
    if (
        boardPoint.x < 0.07 || 
        boardPoint.x > (8.0-0.07) ||
        boardPoint.z < 0.07 || 
        boardPoint.z > (8.0-0.07)
    ){
        discard;
    }
    float cx = clamp(boardPoint.x,0.01,7.99); //clamp to fix edge artifacts
    float cz = clamp(boardPoint.z,0.01,7.99);
    vec4 boardColor;
    if (mod(floor(cz),2.0)==0.0){
        if (mod(floor(cx),2.0)==0.0){
            boardColor = vec4(0.0,0.0,0.0,1.0);
        } else {
            boardColor = vec4(1.0,1.0,1.0,1.0);
        }
    } else {
        if (mod(floor(cx),2.0)==0.0){
            boardColor = vec4(1.0,1.0,1.0,1.0);
        } else {
            boardColor = vec4(0.0,0.0,0.0,1.0);
        }
    }

    FragColor = mix(
        boardColor*boardLight,
        mix(uColor*pieceLight,texture(uSkybox,reflect(ray,normalize(vNormal))),uReflectivity),
        uReflectivity
    );
}