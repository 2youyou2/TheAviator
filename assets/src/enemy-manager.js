const Primitive = require('./primitive/primitive');

cc.Class({
    extends: cc.Component,

    properties: {
        enemyCount: 10,
        enemyColor: cc.color().fromHEX('0xf25346'),
        rotateSpeed: 360,
    },

    _initMesh () {
        let data = cc.primitive.polyhedron ? cc.primitive.polyhedron(4, 8) : cc.primitive.box(8, 8, 8);
        let mesh = Primitive.createMesh(data, this.enemyColor);
        this._mesh = mesh;
    },

    start () {
        this._initMesh();

        this.enemies = [];
        let enemyPool = this.enemyPool = [];
        for (let i = 0; i < this.enemyCount; i++) {
            let node = this.createEnemy();
            enemyPool.push(node);
        }

        this.spawnEnemy();

        window.game.node.on('level-upgrade', this.spawnEnemy, this);
        window.game.node.on('collide-enemy', this.onCollider, this);
    },

    createEnemy () {
        return window.game.createMeshNode('enemy', this._mesh, true);
    },

    spawnEnemy () {
        let nEnemies = window.game.level;
        let pool = this.enemyPool;
        let enemies = this.enemies;
        for (let i = 0; i < nEnemies; i++) {
            let enemy = pool.pop();
            if (!enemy) {
                enemy = this.createEnemy();
            }
            let angle = -window.game.angles.z - (i*0.1);
            let distance = game.seaHeight + game.playerDefaultY + (-1 + Math.random() * 2) * (game.playerYRange-20);
            enemy.x = Math.cos(angle) * distance;
            enemy.y = Math.sin(angle) * distance;

            enemy.parent = this.node;
            enemies.push(enemy);
        }
    },

    onCollider ({enemy}) {
        this.enemies.splice(this.enemies.indexOf(enemy), 1);
        this.enemyPool.push(enemy);
        enemy.parent = null;
    },

    update (dt) {
        let enemies = this.enemies;
        for (let i = 0; i < enemies.length; i++) {
            let enemy = enemies[i];
            enemy._eulerAngles.x += Math.random() ;
            enemy._eulerAngles.y += Math.random() ;
            enemy.eulerAngles = enemy._eulerAngles;
        }
    }
});
