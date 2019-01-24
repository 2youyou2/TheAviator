const Primitive = require('./primitive/primitive');

let v3_tmp = cc.v3();

cc.Class({
    extends: cc.Component,

    properties: {
        cloudCount: 20,
        cloudColor: cc.color().fromHEX('0xF7D9AA'),

        rotateSpeed: 360,
    },

    start () {
        this._initMesh();

        let clouds = new Array(this.cloudCount);
        let stepAngle = Math.PI * 2 / this.cloudCount;
        for (let i = 0; i < this.cloudCount; i++) {
            let cloud = this.createCloud();
            clouds[i] = cloud;

            let a = stepAngle * i;
            let h = game.seaHeight + game.skyHeight + Math.random() * game.skyHeightRange;

            cloud.y = Math.sin(a) * h;
            cloud.x = Math.cos(a) * h;
            cloud.z = -300 - Math.random() * 500;

            v3_tmp.x = v3_tmp.y = 0;
            v3_tmp.z = a + Math.PI / 2;
            cloud.eulerAngles = v3_tmp;

            cloud.scale = 1 + Math.random() * 2;

            cloud.parent = this.node;
        }

        this.clouds = clouds;
    },

    // for use the same mesh
    _initMesh () {
        let data = cc.primitive.box(1, 1, 1);
        let mesh = Primitive.createMesh(data, this.cloudColor);
        this._mesh = mesh;
    },

    createCloud () {
        let cloud = new cc.Node('cloud');
        cloud.is3DNode = true;

        let nBlocks = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < nBlocks; i++) {
            let block = window.game.createMeshNode('barrier', this._mesh);

            block.x = i * 15;
            block.y = Math.random() * 10;
            block.z = Math.random() * 10;

            let angle = cc.v3();
            angle.z = Math.random() * Math.PI * 2;
            angle.y = Math.random() * Math.PI * 2;
            block._eulerAngles = angle;

            block.scale = 20 * (0.3 + Math.random() * 0.7);

            block.parent = cloud;
        }

        return cloud;
    },

    update (dt) {
        for (let i = 0; i < this.clouds.length; i++) {
            let cloud = this.clouds[i];

            for (let j = 0; j < cloud.children.length; j++) {
                let block = cloud.children[j];
                block._eulerAngles.z += Math.random() * 0.5 * (j + 1);
                block._eulerAngles.y += Math.random() * 0.2 * (j + 1);
                block.eulerAngles = block._eulerAngles;
            }
        }
    },
});
