#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vNormal;

uniform vec3 uCamPos;
uniform samplerCube uSkybox;
uniform float uAmbient;
uniform float uReflectivity;

out vec4 FragColor;

void main() {
    float cx = clamp(vPosition.x,0.01,7.99); //clamp to fix edge artifacts
    float cz = clamp(vPosition.z,0.01,7.99);
    vec4 color;
    if (mod(floor(cz),2.0)==0.0){
        if (mod(floor(cx),2.0)==0.0){
            color = vec4(0.0,0.0,0.0,1.0);
        } else {
            color = vec4(1.0,1.0,1.0,1.0);
        }
    } else {
        if (mod(floor(cx),2.0)==0.0){
            color = vec4(1.0,1.0,1.0,1.0);
        } else {
            color = vec4(0.0,0.0,0.0,1.0);
        }
    }
    vec3 lightDir = normalize(vec3(1.0,-2.0,1.0));
    float light = (max(dot(vNormal,-lightDir),0.0) + uAmbient);

    vec3 ray = normalize(vPosition-uCamPos);
    FragColor = mix(color*light,texture(uSkybox,reflect(ray,vNormal)),uReflectivity);
}