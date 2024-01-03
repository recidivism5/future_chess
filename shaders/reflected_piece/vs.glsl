#version 300 es

layout(location=0) in vec3 aPosition;
layout(location=1) in vec3 aNormal;

uniform vec3 uTranslation;
uniform mat4 uVP;

out vec3 vPosition;
out vec3 vInvPos;
out vec3 vNormal;

void main() {
    vInvPos = aPosition;
    vInvPos.y = -vInvPos.y;
    vInvPos += uTranslation;
    vPosition = aPosition + uTranslation;
    gl_Position = uVP * vec4(vInvPos,1.0);
    vNormal = aNormal;
}