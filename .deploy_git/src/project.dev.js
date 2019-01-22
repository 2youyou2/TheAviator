window.__require = function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var b = o.split("/");
        b = b[b.length - 1];
        if (!t[b]) {
          var a = "function" == typeof __require && __require;
          if (!u && a) return a(b, !0);
          if (i) return i(b, !0);
          throw new Error("Cannot find module '" + o + "'");
        }
      }
      var f = n[o] = {
        exports: {}
      };
      t[o][0].call(f.exports, function(e) {
        var n = t[o][1][e];
        return s(n || e);
      }, f, f.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = "function" == typeof __require && __require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
}({
  box: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "a70270Fvd9Mn66Upk302M+8", "box");
    "use strict";
    var Primitive = require("./primitive");
    cc.Class({
      extends: Primitive,
      properties: {
        width: {
          default: 100,
          notify: function notify() {
            this.delayInit();
          }
        },
        height: {
          default: 100,
          notify: function notify() {
            this.delayInit();
          }
        },
        length: {
          default: 100,
          notify: function notify() {
            this.delayInit();
          }
        }
      },
      _createData: function _createData() {
        return cc.primitive.box(this.width, this.height, this.length);
      }
    });
    cc._RF.pop();
  }, {
    "./primitive": "primitive"
  } ],
  cylinder: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "44dc5bGoJVG973D/qrBQr94", "cylinder");
    "use strict";
    var Primitive = require("./primitive");
    cc.Class({
      extends: Primitive,
      properties: {
        radiusTop: {
          default: 30,
          notify: function notify() {
            this.delayInit();
          }
        },
        radiusBottom: {
          default: 30,
          notify: function notify() {
            this.delayInit();
          }
        },
        height: {
          default: 100,
          notify: function notify() {
            this.delayInit();
          }
        },
        radiusSegments: {
          default: 32,
          notify: function notify() {
            this.delayInit();
          }
        },
        heightSegments: {
          default: 1,
          notify: function notify() {
            this.delayInit();
          }
        }
      },
      _createData: function _createData() {
        return cc.primitive.cylinder(this.radiusTop, this.radiusBottom, this.height, {
          radialSegments: this.radiusSegments,
          heightSegments: this.heightSegments
        });
      }
    });
    cc._RF.pop();
  }, {
    "./primitive": "primitive"
  } ],
  "enemy-manager": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "09ddf+1UthOJqlpZy+ajb5j", "enemy-manager");
    "use strict";
    var Primitive = require("./primitive/primitive");
    cc.Class({
      extends: cc.Component,
      properties: {
        enemyCount: 10,
        enemyColor: cc.color().fromHEX("0xf25346"),
        rotateSpeed: 360
      },
      _initMesh: function _initMesh() {
        var data = cc.primitive.box(10, 10, 10);
        var mesh = Primitive.createMesh(data, this.enemyColor);
        this._mesh = mesh;
      },
      start: function start() {
        this._initMesh();
        this.enemyInUse = [];
        var enemyPool = this.enemyPool = [];
        for (var i = 0; i < this.enemyCount; i++) {
          var node = this.createEnemy();
          enemyPool.push(node);
        }
        this.spawnEnemy();
      },
      createEnemy: function createEnemy() {
        return window.game.createMeshNode("enemy", this._mesh, true);
      },
      spawnEnemy: function spawnEnemy() {
        var nEnemies = window.game.level;
        var pool = this.enemyPool;
        var enemies = this.enemyInUse;
        for (var i = 0; i < nEnemies; i++) {
          var enemy = pool.pop();
          enemy || (enemy = this.createEnemy());
          var angle = -.1 * i;
          var distance = game.seaHeight + game.playerDefaultY + (2 * Math.random() - 1) * (game.playerYRange - 20);
          enemy.x = Math.cos(angle) * distance;
          enemy.y = Math.sin(angle) * distance;
          enemy.parent = this.node;
          enemies.push(enemy);
        }
      },
      update: function update(dt) {
        var enemies = this.enemyInUse;
        for (var i = 0; i < enemies.length; i++) {
          var enemy = enemies[i];
          enemy._eulerAngles.x += Math.random();
          enemy._eulerAngles.y += Math.random();
          enemy.eulerAngles = enemy._eulerAngles;
        }
      }
    });
    cc._RF.pop();
  }, {
    "./primitive/primitive": "primitive"
  } ],
  game: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "b201btp/JxCdaQYiSCLDnTl", "game");
    "use strict";
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
        ratioSpeedDistance: .05,
        material: cc.Material,
        level: 1,
        distanceLabel: cc.Label,
        levelLabel: cc.Label
      },
      onLoad: function onLoad() {
        window.game = this;
        this.reset();
      },
      reset: function reset() {
        this.angles = cc.v3();
        this.distance = 0;
      },
      createMeshNode: function createMeshNode(name, mesh, shadowCast) {
        var node = new cc.Node(name);
        node.is3DNode = true;
        var renderer = node.addComponent(cc.MeshRenderer);
        renderer.setMaterial(0, this.material);
        renderer.mesh = mesh;
        renderer.shadowCastingMode = !!shadowCast && cc.MeshRenderer.ShadowCastingMode.ON;
        return node;
      },
      update: function update(dt) {
        this.angles.z += this.speed * dt;
        this.world.eulerAngles = this.angles;
        this.distance += this.speed * dt * this.ratioSpeedDistance;
        this.updateUI();
      },
      updateUI: function updateUI() {
        this.distanceLabel.string = 0 | this.distance;
        this.levelLabel.string = this.level;
      }
    });
    cc._RF.pop();
  }, {} ],
  "player-control": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "d53b1LPmLJOtL/2J/ZOSrA7", "player-control");
    "use strict";
    function normalize(v, vmin, vmax, tmin, tmax) {
      var nv = Math.max(Math.min(v, vmax), vmin);
      var dv = vmax - vmin;
      var pc = (nv - vmin) / dv;
      var dt = tmax - tmin;
      var tv = tmin + pc * dt;
      return tv;
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        moveSensivity: 5,
        rotXSensivity: .8,
        rotZSensivity: .4,
        camera: cc.Camera,
        cameraSensivity: 2
      },
      onLoad: function onLoad() {
        this.reset();
      },
      reset: function reset() {
        this.angles = cc.v3();
        this.node.position = cc.v3(0, game.playerDefaultY, 0);
        this.touchPos = cc.v2();
      },
      start: function start() {
        var canvas = cc.find("Canvas");
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.on(cc.Node.EventType.MOUSE_MOVE, this.onMoseMove, this);
      },
      onTouchMove: function onTouchMove(event) {
        var touches = event.getTouches();
        this._setTouchPos(touches[0].getLocation());
      },
      onMoseMove: function onMoseMove(event) {
        this._setTouchPos(event.getLocation());
      },
      _setTouchPos: function _setTouchPos(pos) {
        this.touchPos.x = pos.x / cc.visibleRect.width * 2 - 1;
        this.touchPos.y = pos.y / cc.visibleRect.height * 2 - 1;
      },
      update: function update(dt) {
        var touchPos = this.touchPos;
        var targetY = normalize(touchPos.y, -.75, .75, game.playerDefaultY - game.playerYRange, game.playerDefaultY + game.playerYRange);
        var targetX = normalize(touchPos.x, -1, 1, .7 * -game.playerXRange, -game.playerXRange);
        this.node.y += (targetY - this.node.y) * dt * this.moveSensivity;
        this.node.x += (targetX - this.node.x) * dt * this.moveSensivity;
        this.angles.z = (targetY - this.node.y) * dt * this.rotZSensivity;
        this.angles.x = (this.node.y - targetY) * dt * this.rotXSensivity;
        this.node.eulerAngles = this.angles;
        var camera = this.camera;
        camera.fov = normalize(touchPos.x, -1, 1, 40, 80);
        camera.node.y += (this.node.y - camera.node.y) * dt * this.cameraSensivity;
      }
    });
    cc._RF.pop();
  }, {} ],
  primitive: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "17327Iro65DFIL3lynXAorV", "primitive");
    "use strict";
    var Primitive = cc.Class({
      extends: cc.Component,
      editor: {
        executeInEditMode: true,
        requireComponent: cc.MeshRenderer
      },
      properties: {
        color: {
          default: cc.Color.WHITE,
          notify: function notify() {
            this.delayInit();
          }
        }
      },
      onLoad: function onLoad() {
        this.init();
      },
      init: function init() {
        var data = this._createData();
        var mesh = Primitive.createMesh(data, this.color);
        var renderer = this.getComponent(cc.MeshRenderer);
        renderer.mesh = mesh;
        this.data = data;
        this._delatIniting = false;
      },
      delayInit: function delayInit() {
        false;
        if (this._delatIniting) return;
        this._delatIniting = true;
        this.scheduleOnce(this.init);
      },
      _createData: function _createData() {
        return {};
      }
    });
    Primitive.createMesh = function(data, color) {
      var gfx = cc.gfx;
      var vfmt = new gfx.VertexFormat([ {
        name: gfx.ATTR_POSITION,
        type: gfx.ATTR_TYPE_FLOAT32,
        num: 3
      }, {
        name: gfx.ATTR_NORMAL,
        type: gfx.ATTR_TYPE_FLOAT32,
        num: 3
      }, {
        name: gfx.ATTR_COLOR,
        type: gfx.ATTR_TYPE_UINT8,
        num: 4,
        normalize: true
      } ]);
      var colors = [];
      for (var i = 0; i < data.positions.length; i++) colors.push(color);
      var mesh = new cc.Mesh();
      mesh.init(vfmt, data.positions.length);
      mesh.setVertices(gfx.ATTR_POSITION, data.positions);
      mesh.setVertices(gfx.ATTR_NORMAL, data.normals);
      mesh.setVertices(gfx.ATTR_COLOR, colors);
      mesh.setIndices(data.indices);
      mesh.setBoundingBox(data.minPos, data.maxPos);
      return mesh;
    };
    module.exports = Primitive;
    cc._RF.pop();
  }, {} ],
  propeller: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "cb92dR/FtVI558n2xXaixEz", "propeller");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        rotateSpeed: 360
      },
      start: function start() {
        this.angles = cc.v3();
      },
      update: function update(dt) {
        this.angles.x += this.rotateSpeed * dt;
        this.node.eulerAngles = this.angles;
      }
    });
    cc._RF.pop();
  }, {} ],
  "scene-ambient": [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "f8bd8ThP5VFOrMtn2xMutCw", "scene-ambient");
    "use strict";
    cc.Class({
      extends: cc.Component,
      editor: {
        executeInEditMode: true
      },
      properties: {
        _ambient: cc.Color,
        ambient: {
          get: function get() {
            return this._ambient;
          },
          set: function set(val) {
            this._ambient = val;
            this._updateSceneAmbient();
          }
        }
      },
      start: function start() {
        this._updateSceneAmbient();
      },
      _updateSceneAmbient: function _updateSceneAmbient() {
        cc.renderer._forward.sceneAmbient = this.ambient;
      }
    });
    cc._RF.pop();
  }, {} ],
  sea: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "786dftT62NLJKOjBpXgOP5B", "sea");
    "use strict";
    function calcFaceNormals(positions, indices, normals) {
      normals = normals || new Array(positions.length);
      for (var i = 0, l = normals.length; i < l; i++) normals[i] = 0;
      var vA = void 0, vB = void 0, vC = void 0;
      var pA = cc.v3(), pB = cc.v3(), pC = cc.v3();
      var cb = cc.v3(), ab = cc.v3();
      var vec3 = cc.vmath.vec3;
      function fromArray(out, a, offset) {
        out.x = a[offset];
        out.y = a[offset + 1];
        out.z = a[offset + 2];
      }
      for (var _i = 0, il = indices.length; _i < il; _i += 3) {
        vA = 3 * indices[_i + 0];
        vB = 3 * indices[_i + 1];
        vC = 3 * indices[_i + 2];
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
      var tempNormal = cc.v3();
      for (var _i2 = 0, _l = normals.length; _i2 < _l; _i2 += 3) {
        tempNormal.x = normals[_i2];
        tempNormal.y = normals[_i2 + 1];
        tempNormal.z = normals[_i2 + 2];
        tempNormal.normalizeSelf();
        normals[_i2] = tempNormal.x;
        normals[_i2 + 1] = tempNormal.y;
        normals[_i2 + 2] = tempNormal.z;
      }
      return normals;
    }
    function calcVertexNormals(positions, indices, normals) {
      normals = normals || new Array(positions.length);
      for (var i = 0, l = normals.length; i < l; i++) normals[i] = 0;
      var vA = void 0, vB = void 0, vC = void 0;
      var pA = cc.v3(), pB = cc.v3(), pC = cc.v3();
      var cb = cc.v3(), ab = cc.v3();
      var vec3 = cc.vmath.vec3;
      function fromArray(out, a, offset) {
        out.x = a[offset];
        out.y = a[offset + 1];
        out.z = a[offset + 2];
      }
      for (var _i3 = 0, il = indices.length; _i3 < il; _i3 += 3) {
        vA = 3 * indices[_i3 + 0];
        vB = 3 * indices[_i3 + 1];
        vC = 3 * indices[_i3 + 2];
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
      var tempNormal = cc.v3();
      for (var _i4 = 0, _l2 = normals.length; _i4 < _l2; _i4 += 3) {
        tempNormal.x = normals[_i4];
        tempNormal.y = normals[_i4 + 1];
        tempNormal.z = normals[_i4 + 2];
        tempNormal.normalizeSelf();
        normals[_i4] = tempNormal.x;
        normals[_i4 + 1] = tempNormal.y;
        normals[_i4 + 2] = tempNormal.z;
      }
      return normals;
    }
    cc.Class({
      extends: cc.Component,
      properties: {
        rotateSpeed: 360,
        wavesMinAmp: 5,
        wavesMaxAmp: 20,
        wavesMinSpeed: .001,
        wavesMaxSpeed: .003
      },
      start: function start() {
        this.node._eulerAngles = cc.v3(-90, 0, 0);
        var data = this.data = this.getComponent("cylinder").data;
        this.waves = [];
        var positions = data.positions;
        for (var i = 0, l = data.positions.length; i < l; i += 3) this.waves.push({
          x: positions[i],
          y: positions[i + 1],
          z: positions[i + 2],
          ang: Math.random() * Math.PI * 2,
          amp: this.wavesMinAmp + Math.random() * (this.wavesMaxAmp - this.wavesMinAmp),
          speed: this.wavesMinSpeed + Math.random() * (this.wavesMaxSpeed - this.wavesMinSpeed)
        });
        this.mesh = this.getComponent(cc.MeshRenderer).mesh;
      },
      update: function update(dt) {
        var positions = this.data.positions;
        for (var i = 0, l = positions.length; i < l; i += 3) {
          var vprops = this.waves[i / 3];
          positions[i] = vprops.x + Math.cos(vprops.ang) * vprops.amp;
          positions[i + 1] = vprops.y + Math.sin(vprops.ang) * vprops.amp;
          vprops.ang += vprops.speed * dt;
        }
        this.mesh.setVertices(cc.gfx.ATTR_POSITION, positions);
      }
    });
    cc._RF.pop();
  }, {} ],
  sky: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "857eaB/7qJL5YogoKjv/zE1", "sky");
    "use strict";
    var Primitive = require("./primitive/primitive");
    var v3_tmp = cc.v3();
    cc.Class({
      extends: cc.Component,
      properties: {
        cloudCount: 20,
        cloudColor: cc.color().fromHEX("0xF7D9AA"),
        rotateSpeed: 360,
        blockPrefab: cc.Prefab
      },
      start: function start() {
        this._initMesh();
        var clouds = new Array(this.cloudCount);
        var stepAngle = 2 * Math.PI / this.cloudCount;
        for (var i = 0; i < this.cloudCount; i++) {
          var cloud = this.createCloud();
          clouds[i] = cloud;
          var a = stepAngle * i;
          var h = game.seaHeight + game.skyHeight + Math.random() * game.skyHeightRange;
          cloud.y = Math.sin(a) * h;
          cloud.x = Math.cos(a) * h;
          cloud.z = -300 - 500 * Math.random();
          v3_tmp.x = v3_tmp.y = 0;
          v3_tmp.z = a + Math.PI / 2;
          cloud.eulerAngles = v3_tmp;
          cloud.scale = 1 + 2 * Math.random();
          cloud.parent = this.node;
        }
        this.clouds = clouds;
      },
      _initMesh: function _initMesh() {
        var data = cc.primitive.box(1, 1, 1);
        var mesh = Primitive.createMesh(data, this.cloudColor);
        this._mesh = mesh;
      },
      createCloud: function createCloud() {
        var cloud = new cc.Node("cloud");
        cloud.is3DNode = true;
        var nBlocks = 3 + Math.floor(3 * Math.random());
        for (var i = 0; i < nBlocks; i++) {
          var block = window.game.createMeshNode("barrier", this._mesh);
          block.x = 15 * i;
          block.y = 10 * Math.random();
          block.z = 10 * Math.random();
          var angle = cc.v3();
          angle.z = Math.random() * Math.PI * 2;
          angle.y = Math.random() * Math.PI * 2;
          block._eulerAngles = angle;
          block.scale = 20 * (.3 + .7 * Math.random());
          block.parent = cloud;
        }
        return cloud;
      },
      update: function update(dt) {
        for (var i = 0; i < this.clouds.length; i++) {
          var cloud = this.clouds[i];
          for (var j = 0; j < cloud.children.length; j++) {
            var block = cloud.children[j];
            block._eulerAngles.z += .5 * Math.random() * (j + 1);
            block._eulerAngles.y += .2 * Math.random() * (j + 1);
            block.eulerAngles = block._eulerAngles;
          }
        }
      }
    });
    cc._RF.pop();
  }, {
    "./primitive/primitive": "primitive"
  } ],
  sphere: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ce4b6wXjklDp5eO/hh8VSzY", "sphere");
    "use strict";
    var Primitive = require("./primitive");
    cc.Class({
      extends: Primitive,
      properties: {
        radius: {
          default: 25,
          notify: function notify() {
            this.delayInit();
          }
        },
        segments: {
          default: 32,
          notify: function notify() {
            this.delayInit();
          }
        }
      },
      _createData: function _createData() {
        return cc.primitive.sphere(this.radius, {
          segments: this.segments
        });
      }
    });
    cc._RF.pop();
  }, {
    "./primitive": "primitive"
  } ]
}, {}, [ "enemy-manager", "game", "player-control", "box", "cylinder", "primitive", "sphere", "propeller", "scene-ambient", "sea", "sky" ]);
//# sourceMappingURL=project.dev.js.map