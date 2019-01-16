
function calcFaceNormals (positions, indices, normals) {
    normals = normals || new Array(positions.length);
    for (let i = 0, l = normals.length; i < l; i++) {
        normals[i] = 0;
    }

    let vA, vB, vC;
    let pA = cc.v3(), pB = cc.v3(), pC = cc.v3();
    let cb = cc.v3(), ab = cc.v3();
    let vec3 = cc.vmath.vec3;

    function fromArray (out, a, offset) {
        out.x = a[offset];
        out.y = a[offset+1];
        out.z = a[offset+2];
    }

    for (let i = 0, il = indices.length; i < il; i += 3) {

        vA = indices[i + 0] * 3;
        vB = indices[i + 1] * 3;
        vC = indices[i + 2] * 3;

        fromArray(pA, positions, vA);
        fromArray(pB, positions, vB);
        fromArray(pC, positions, vC);

        vec3.sub(cb, pC, pB);
        vec3.sub(ab, pA, pB);
        vec3.cross(cb, cb, ab);

        normals[vA] += cb.x;
        normals[vA + 1] += cb.y;
        normals[vA + 2] += cb.z;

        normals[vB] += cb.x;
        normals[vB + 1] += cb.y;
        normals[vB + 2] += cb.z;

        normals[vC] += cb.x;
        normals[vC + 1] += cb.y;
        normals[vC + 2] += cb.z;
    }

    let tempNormal = cc.v3();
    for (let i = 0, l = normals.length; i < l; i+=3) {
        tempNormal.x = normals[i];
        tempNormal.y = normals[i+1];
        tempNormal.z = normals[i+2];

        tempNormal.normalizeSelf();

        normals[i] = tempNormal.x;
        normals[i+1] = tempNormal.y;
        normals[i+2] = tempNormal.z;
    }

    return normals;
}

function calcVertexNormals (positions, indices, normals) {
    normals = normals || new Array(positions.length);
    for (let i = 0, l = normals.length; i < l; i++) {
        normals[i] = 0;
    }

    let vA, vB, vC;
    let pA = cc.v3(), pB = cc.v3(), pC = cc.v3();
    let cb = cc.v3(), ab = cc.v3();
    let vec3 = cc.vmath.vec3;

    function fromArray (out, a, offset) {
        out.x = a[offset];
        out.y = a[offset+1];
        out.z = a[offset+2];
    }

    for (let i = 0, il = indices.length; i < il; i += 3) {

        vA = indices[i + 0] * 3;
        vB = indices[i + 1] * 3;
        vC = indices[i + 2] * 3;

        fromArray(pA, positions, vA);
        fromArray(pB, positions, vB);
        fromArray(pC, positions, vC);

        vec3.sub(cb, pC, pB);
        vec3.sub(ab, pA, pB);
        vec3.cross(cb, cb, ab);

        normals[vA] += cb.x;
        normals[vA + 1] += cb.y;
        normals[vA + 2] += cb.z;

        normals[vB] += cb.x;
        normals[vB + 1] += cb.y;
        normals[vB + 2] += cb.z;

        normals[vC] += cb.x;
        normals[vC + 1] += cb.y;
        normals[vC + 2] += cb.z;
    }

    let tempNormal = cc.v3();
    for (let i = 0, l = normals.length; i < l; i+=3) {
        tempNormal.x = normals[i];
        tempNormal.y = normals[i+1];
        tempNormal.z = normals[i+2];

        tempNormal.normalizeSelf();

        normals[i] = tempNormal.x;
        normals[i+1] = tempNormal.y;
        normals[i+2] = tempNormal.z;
    }

    return normals;
}

cc.Class({
    extends: cc.Component,

    properties: {
        rotateSpeed: 360,
        wavesMinAmp: 5,
        wavesMaxAmp: 20,
        wavesMinSpeed: 0.001,
        wavesMaxSpeed: 0.003,
    },

    start () {
        this.node._eulerAngles = cc.v3(-90, 0, 0);
        let data = this.data = this.getComponent('cylinder').data;

        this.waves = [];
        let positions = data.positions;
        for (let i = 0, l = data.positions.length; i < l; i += 3) {
            this.waves.push({
                x: positions[i], y: positions[i + 1], z: positions[i + 2],
                ang: Math.random() * Math.PI * 2,
                amp: this.wavesMinAmp + Math.random() * (this.wavesMaxAmp - this.wavesMinAmp),
                speed: this.wavesMinSpeed + Math.random() * (this.wavesMaxSpeed - this.wavesMinSpeed)
            });
        };

        this.mesh = this.getComponent(cc.MeshRenderer).mesh;
    },

    update (dt) {
        this.node._eulerAngles.z += this.rotateSpeed * dt;
        this.node.eulerAngles = this.node._eulerAngles;

        let positions = this.data.positions;
        for (let i = 0, l = positions.length; i < l; i += 3) {
            let vprops = this.waves[i / 3];
            positions[i] = vprops.x + Math.cos(vprops.ang) * vprops.amp;
            positions[i + 1] = vprops.y + Math.sin(vprops.ang) * vprops.amp;
            vprops.ang += vprops.speed * dt;
        }
        this.mesh.setVertices(cc.gfx.ATTR_POSITION, positions);

        // let normals = calcVertexNormals(positions, this.data.indices, this.data.normals);
        // this.mesh.setVertices(cc.gfx.ATTR_NORMAL, normals);
    },
});
