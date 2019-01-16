const Primitive = require('./primitive/primitive');

let v3_tmp = cc.v3();

cc.Class({
    extends: cc.Component,

    properties: {
        cloudCount: 20,

        groundHeight: 600,
        skyHeight: 150,
        skyHeightRange: 200,

        rotateSpeed: 360,

        material: cc.Material,
        blockPrefab: cc.Prefab
    },

    start () {
        this._initMesh();

        let clouds = new Array(this.cloudCount);
        let stepAngle = Math.PI * 2 / this.cloudCount;
        for (let i = 0; i < this.cloudCount; i++) {
            let cloud = this.createCloud();
            clouds[i] = cloud;

            let a = stepAngle * i;
            let h = this.groundHeight + this.skyHeight + Math.random() * this.skyHeightRange;

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
        let color = '0xF7D9AA';//'0xd8d0d1'
        let mesh = Primitive.createMesh(data, cc.color().fromHEX(color));
        this._mesh = mesh;
    },

    createBlock () {
        let block = new cc.Node('block');
        block.is3DNode = true;
        let renderer = block.addComponent(cc.MeshRenderer);
        renderer.setMaterial(0, this.material);
        renderer.mesh = this._mesh;

        // let block = cc.instantiate(this.blockPrefab);
        return block;
    },

    createCloud () {
        let cloud = new cc.Node('cloud');
        cloud.is3DNode = true;

        let nBlocks = 3 + Math.floor(Math.random() * 3);
        for (let i = 0; i < nBlocks; i++) {
            let block = this.createBlock();

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
        this.node._eulerAngles.z += this.rotateSpeed * dt;
        this.node.eulerAngles = this.node._eulerAngles;

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
