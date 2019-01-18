
module.exports = cc.Class({
    extends: cc.Component,

    properties: {
        playerXRange: 100,
        playerYRange: 80,
        playerDefaultY: 100,

        seaHeight: 600, 

        skyHeight: 150,
        skyHeightRange: 200,

        world: cc.Node,
        speed: 30,
        ratioSpeedDistance: 0.05,

        material: cc.Material,
        level: 1,

        distanceLabel: cc.Label,
        levelLabel: cc.Label
    },
    onLoad () {
        window.game = this;
        this.reset();
    },
    reset () {
        this.angles = cc.v3();
        this.distance = 0;
    },

    createMeshNode (name, mesh, shadowCast) {
        let node = new cc.Node(name);
        node.is3DNode = true;
        let renderer = node.addComponent(cc.MeshRenderer);
        renderer.setMaterial(0, this.material);
        renderer.mesh = mesh;
        renderer.shadowCastingMode = shadowCast ? cc.MeshRenderer.ShadowCastingMode.ON : false;
        return node;
    },

    update (dt) {
        this.angles.z += this.speed * dt;
        this.world.eulerAngles = this.angles;
        this.distance += this.speed * dt * this.ratioSpeedDistance;
    
        this.updateUI();
    },
    updateUI () {
        this.distanceLabel.string = this.distance | 0;
        this.levelLabel.string = this.level;
    }
});
