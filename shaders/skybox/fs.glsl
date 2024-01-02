#version 300 es
precision highp float;

in vec4 vPosition;

uniform samplerCube uSkybox;
uniform mat4 uInvVP;

out vec4 FragColor;

void main(){
    vec4 t = uInvVP * vPosition;
    FragColor = texture(uSkybox,normalize(t.xyz / t.w));
}