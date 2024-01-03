#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vNormal;

uniform vec3 uCamPos;
uniform samplerCube uSkybox;
uniform float uAmbient;
uniform float uReflectivity;

out vec4 FragColor;

vec3 tri(vec3 x){
    return 1.0-abs(2.0*fract(x/2.0)-1.0);
}
float checker(vec3 p){ //from Inigo Quilez: https://www.shadertoy.com/view/XlXBWs For some reason I think this version of his looks better than his more updated one. Sharper.
  vec3 w = max(abs(dFdx(p)), abs(dFdy(p))) + 0.0001; // filter kernel
  vec3 i = (tri(p+0.5*w)-tri(p-0.5*w))/w;    // analytical integral (box filter)
  return 0.5 - 0.5*i.x*i.y*i.z;              // xor pattern
}
float clampedChecker(vec3 p){
    return checker(vec3(clamp(p.x,0.01,7.99),0.5,clamp(p.z,0.01,7.99)));
}
vec4 getBoardColor(vec3 p){
    return vec4(vec3(clampedChecker(p)),1.0);
}

void main() {
    vec4 color = getBoardColor(vPosition);

    vec3 lightDir = normalize(vec3(1.0,-2.0,1.0));
    float light = (max(dot(vNormal,-lightDir),0.0) + uAmbient);

    vec3 ray = normalize(vPosition-uCamPos);
    FragColor = mix(color*light,texture(uSkybox,reflect(ray,vNormal)),uReflectivity);
}