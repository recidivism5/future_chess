#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vNormal;

uniform vec3 uCamPos;
uniform samplerCube uSkybox;
uniform vec4 uColor;
uniform float uAmbient;
uniform float uReflectivity;

out vec4 FragColor;

void main(){
    vec3 lightDir = normalize(vec3(1.0,-2.0,1.0));
    float light = (max(dot(vNormal,-lightDir),0.0) + uAmbient);

    vec3 ray = normalize(vPosition-uCamPos);
    FragColor = mix(uColor*light,texture(uSkybox,reflect(ray,normalize(vNormal))),uReflectivity);
}