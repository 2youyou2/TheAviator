
const Primitive = require('./primitive');

cc.Class({
    extends: Primitive,

    properties: {
        radius: {
            default: 25,
            notify () {
                this.delayInit();
            }
        },

        segments: {
            default: 32,
            notify () {
                this.delayInit();
            }
        }
    },

    _createData () {
        return cc.primitive.sphere(this.radius, { segments: this.segments });
    }
});
