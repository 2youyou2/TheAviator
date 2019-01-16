// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    editor: {
        executeInEditMode: true,
    },

    properties: {
        _ambient: cc.Color,
        ambient: {
            get () {
                return this._ambient;
            },
            set (val) {
                this._ambient = val;
                this._updateSceneAmbient();
            }
        }
    },

    start () {
        this._updateSceneAmbient();
    },
    
    _updateSceneAmbient () {
        cc.renderer._forward.sceneAmbient = this.ambient;
    }
});
