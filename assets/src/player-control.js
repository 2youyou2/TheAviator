
function normalize(v,vmin,vmax,tmin, tmax){
    let nv = Math.max(Math.min(v,vmax), vmin);
    let dv = vmax-vmin;
    let pc = (nv-vmin)/dv;
    let dt = tmax-tmin;
    let tv = tmin + (pc*dt);
    return tv;
}

cc.Class({
    extends: cc.Component,

    properties: {
        defaultY: 100,
        yRange: 80,
        xRange: 100,
        
        moveSensivity: 5,
        rotXSensivity: 0.8,
        rotZSensivity: 0.4,

        camera: cc.Camera,
        cameraSensivity: 2
    },
    
    onLoad () {
        this.touchPos = cc.v2();
        this.rotation = this.node.eulerAngles;
    },

    start () {
        let canvas = cc.find('Canvas');
        canvas.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.on(cc.Node.EventType.MOUSE_MOVE, this.onMoseMove, this);
    },

    onTouchMove (event) {
        let touches = event.getTouches();
        this._setTouchPos( touches[0].getLocation() );
    },

    onMoseMove (event) {
        this._setTouchPos (event.getLocation() );
    },

    _setTouchPos (pos) {
        // the value range is -1 - 1
        this.touchPos.x = -1 + pos.x / cc.visibleRect.width * 2;
        this.touchPos.y = -1 + pos.y / cc.visibleRect.height * 2;
    },

    update (dt) {
        let touchPos = this.touchPos;

        let targetY = normalize(touchPos.y, -.75,.75, this.defaultY-this.yRange, this.defaultY+this.yRange);
        let targetX = normalize(touchPos.x, -1,1, -this.xRange*0.7, -this.xRange);

        this.node.y += (targetY - this.node.y) * dt * this.moveSensivity;
        this.node.x += (targetX - this.node.x) * dt * this.moveSensivity;

        this.rotation.z = (targetY - this.node.y) * dt * this.rotZSensivity;
        this.rotation.x = (this.node.y - targetY) * dt * this.rotXSensivity;
        this.node.eulerAngles = this.rotation;

        let camera = this.camera;
        camera.fov = normalize(touchPos.x, -1,1, 40,80);
        camera.node.y += (this.node.y - camera.node.y) * dt * this.cameraSensivity;
    },
});
