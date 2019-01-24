
function equal (a, b) {
    return Math.abs(a - b) < 10e-6;
}

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
        levelDistance: 500,
        
        upgradeRatio: 1.2,

        distanceLabel: cc.Label,
        levelLabel: cc.Label,
        energyProgress: cc.ProgressBar,

        collisionDistance: 15,

        energy: 1,
        collisionDamage: 0.1,

        player: cc.Node,
        enemyManager: cc.Node
    },
    onLoad () {
        window.game = this;
        this.reset();
    },
    reset () {
        this.angles = cc.v3();
        this.distance = 0;
        this.lastLevelDistance = 0;

        this.level = 1;
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

        this.checkCollision();
        
        let distance = this.speed * dt * this.ratioSpeedDistance;
        this.distance += distance;
        this.lastLevelDistance += distance;
        
        if (this.lastLevelDistance > this.levelDistance) {
            this.level ++;
            this.lastLevelDistance = this.lastLevelDistance % this.levelDistance;
            this.speed *= this.upgradeRatio;
            this.levelDistance *= this.upgradeRatio;
            this.node.emit('level-upgrade');
        }
    
        this.updateUI();
    },

    updateUI () {
        this.distanceLabel.string = this.distance | 0;
        this.levelLabel.string = this.level;
        if (!equal(this.energyProgress.progress, this.energy)) {
            this.energyProgress.progress -= this.collisionDamage / 20;
        }
    },

    checkCollision: (function () {
        let zeroPos = cc.v2();
        let playerPos = cc.v2();
        let enemyPos = cc.v2();
        let dif = cc.v2();
        return function () {
            playerPos = this.player.convertToWorldSpaceAR(zeroPos, playerPos);

            let enemies = this.enemyManager.getComponent('enemy-manager').enemies;
            for (let i = 0; i < enemies.length; i++) {
                let enemy = enemies[i];
                enemyPos = enemies[i].convertToWorldSpaceAR(zeroPos, enemyPos);
                let distance = playerPos.sub(enemyPos, dif).mag();
                if (distance < this.collisionDistance) {
                    this.energy -= this.collisionDamage;
                    this.node.emit('collide-enemy', {dif, enemy, distance});
                    break;
                }
            }
        }
    })()
});
