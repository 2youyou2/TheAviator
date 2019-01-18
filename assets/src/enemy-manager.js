const Primitive = require('./primitive/primitive');

cc.Class({
    extends: cc.Component,

    properties: {
        enemyCount: 10,
        enemyColor: cc.color().fromHEX('0xf25346'),
        rotateSpeed: 360,
    },

    _initMesh () {
        let data = cc.primitive.box(10, 10, 10);
        let mesh = Primitive.createMesh(data, this.enemyColor);
        this._mesh = mesh;
    },

    start () {
        this._initMesh();

        this.enemyInUse = [];
        let enemyPool = this.enemyPool = [];
        for (let i = 0; i < this.enemyCount; i++) {
            let node = this.createEnemy();
            enemyPool.push(node);
        }

        this.spawnEnemy();
    },

    createEnemy () {
        return window.game.createMeshNode('enemy', this._mesh, true);
    },

    spawnEnemy () {
        let nEnemies = window.game.level;
        let pool = this.enemyPool;
        let enemies = this.enemyInUse;
        for (let i = 0; i < nEnemies; i++) {
            let enemy = pool.pop();
            if (!enemy) {
                enemy = this.createEnemy();
            }
            let angle = - (i*0.1);
            let distance = game.seaHeight + game.playerDefaultY + (-1 + Math.random() * 2) * (game.playerYRange-20);
            enemy.x = Math.cos(angle) * distance;
            enemy.y = Math.sin(angle) * distance;

            enemy.parent = this.node;
            enemies.push(enemy);
        }
    },

    update (dt) {
        let enemies = this.enemyInUse;
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            enemy._eulerAngles.x += Math.random() ;
            enemy._eulerAngles.y += Math.random() ;
            enemy.eulerAngles = enemy._eulerAngles;
        }
    }
});
