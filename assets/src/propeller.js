
cc.Class({
    extends: cc.Component,

    properties: {
        rotateSpeed: 360
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.angles = cc.v3();
    },

    update (dt) {
        this.angles.x += this.rotateSpeed * dt;
        this.node.eulerAngles = this.angles;
    },
});
