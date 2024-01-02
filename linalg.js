function mat4_translate(translation){
    return [
        [1.0,0.0,0.0,0.0],
        [0.0,1.0,0.0,0.0],
        [0.0,0.0,1.0,0.0],
        [translation[0],translation[1],translation[2],1.0]
    ];
}

function mat4_persp(fovRadians, aspectRatio, near, far){
    s = 1.0 / Math.tan(fovRadians * 0.5);
    d = near - far;

    return [
        [s/aspectRatio,0.0,0.0,0.0],
        [0.0,s,0.0,0.0],
        [0.0,0.0,(far+near)/d,-1.0],
        [0.0,0.0,(2.0*far*near)/d,0.0]
    ];
}

function mat4_euler_zyx(euler){
    var 
    sx = Math.sin(angles[0]), cx = Math.cos(angles[0]),
    sy = Math.sin(angles[1]), cy = Math.cos(angles[1]),
    sz = Math.sin(angles[2]), cz = Math.cos(angles[2]);

    var czsx = cz * sx;
    var cxcz = cx * cz;
    var sysz = sy * sz;

    return [
        [cy*cz,cy*sz,-sy,0.0],
        [czsx*sy-cx*sz,cxcz+sx*sysz,cy*sx,0.0],
        [cxcz*sy+sx*sz,-czsx+cx*sysz,cx*cy,0.0],
        [0.0,0.0,0.0,1.0]
    ];
}

function mat4_mul(a,b){
    var out = [
        [0.0,0.0,0.0,0.0],
        [0.0,0.0,0.0,0.0],
        [0.0,0.0,0.0,0.0],
        [0.0,0.0,0.0,0.0],
    ];
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            out[i][j] = a[0][j]*b[i][0] + a[1][j]*b[i][1] + a[2][j]*b[i][2] + a[3][j]*b[i][3];
        }
    }
    return out;
}

function vec3_sub(a, b){
    return [a[0]-b[0],a[1]-b[1],a[2]-b[2]];
}

function vec3_norm(v){
    var f = v.slice();
    var fMag = Math.sqrt(f[0]*f[0]+f[1]*f[1]+f[2]*f[2]);
    f[0] /= fMag;
    f[1] /= fMag;
    f[2] /= fMag;
    return f;
}

function vec3_cross(a,b){
    return [
        a[1]*b[2]-a[2]*b[1],
        a[2]*b[0]-a[0]*b[2],
        a[0]*b[1]-a[1]*b[0]
    ];
}

function vec3_dot(a,b){
    return a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
}

function mat4_lookat(eye, target, up){
    var f = vec3_norm(vec3_sub(target,eye));
    var s = vec3_norm(vec3_cross(f,up));
    var u = vec3_cross(s,f);

    return [
        [s[0],u[0],-f[0],0.0],
        [s[1],u[1],-f[1],0.0],
        [s[2],u[2],-f[2],0.0],
        [-vec3_dot(s,eye),-vec3_dot(u,eye),vec3_dot(f,eye),1.0]
    ];
}

function mat4_invert(mat){
    var dest = [
        [0.0,0.0,0.0,0.0],
        [0.0,0.0,0.0,0.0],
        [0.0,0.0,0.0,0.0],
        [0.0,0.0,0.0,0.0],
    ];
    var t = [0.0,0.0,0.0,0.0,0.0,0.0];
    var a = mat[0][0], b = mat[0][1], c = mat[0][2], d = mat[0][3],
        e = mat[1][0], f = mat[1][1], g = mat[1][2], h = mat[1][3],
        i = mat[2][0], j = mat[2][1], k = mat[2][2], l = mat[2][3],
        m = mat[3][0], n = mat[3][1], o = mat[3][2], p = mat[3][3];

    t[0] = k * p - o * l; t[1] = j * p - n * l; t[2] = j * o - n * k;
    t[3] = i * p - m * l; t[4] = i * o - m * k; t[5] = i * n - m * j;

    dest[0][0] =  f * t[0] - g * t[1] + h * t[2];
    dest[1][0] =-(e * t[0] - g * t[3] + h * t[4]);
    dest[2][0] =  e * t[1] - f * t[3] + h * t[5];
    dest[3][0] =-(e * t[2] - f * t[4] + g * t[5]);

    dest[0][1] =-(b * t[0] - c * t[1] + d * t[2]);
    dest[1][1] =  a * t[0] - c * t[3] + d * t[4];
    dest[2][1] =-(a * t[1] - b * t[3] + d * t[5]);
    dest[3][1] =  a * t[2] - b * t[4] + c * t[5];

    t[0] = g * p - o * h; t[1] = f * p - n * h; t[2] = f * o - n * g;
    t[3] = e * p - m * h; t[4] = e * o - m * g; t[5] = e * n - m * f;

    dest[0][2] =  b * t[0] - c * t[1] + d * t[2];
    dest[1][2] =-(a * t[0] - c * t[3] + d * t[4]);
    dest[2][2] =  a * t[1] - b * t[3] + d * t[5];
    dest[3][2] =-(a * t[2] - b * t[4] + c * t[5]);

    t[0] = g * l - k * h; t[1] = f * l - j * h; t[2] = f * k - j * g;
    t[3] = e * l - i * h; t[4] = e * k - i * g; t[5] = e * j - i * f;

    dest[0][3] =-(b * t[0] - c * t[1] + d * t[2]);
    dest[1][3] =  a * t[0] - c * t[3] + d * t[4];
    dest[2][3] =-(a * t[1] - b * t[3] + d * t[5]);
    dest[3][3] =  a * t[2] - b * t[4] + c * t[5];

    det = 1.0 / (a * dest[0][0] + b * dest[1][0]
                + c * dest[2][0] + d * dest[3][0]);

    for (var y = 0; y < 4; y++){
        for (var x = 0; x < 4; x++){
            dest[y][x] *= det;
        }
    }

    return dest;
}