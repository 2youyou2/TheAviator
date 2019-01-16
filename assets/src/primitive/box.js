const Primitive = require('./primitive');

cc.Class({
    extends: Primitive,

    properties: {
        width: {
            default: 100,
            notify () {
                this.delayInit();
            }
        },
        height: {
            default: 100,
            notify () {
                this.delayInit();
            }
        },
        length: {
            default: 100,
            notify () {
                this.delayInit();
            }
        }
    },
    _createData () {
        return cc.primitive.box(this.width, this.height, this.length);
    }
});
