#version 300 es

layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;

uniform mat4 uVP;

out vec3 vPosition;
out vec3 vNormal;

void main() {
    gl_Position = uVP * vec4(aPosition,1.0);
    vPosition = aPosition;
    vNormal = aNormal;
}