const Primitive = require('./primitive');

cc.Class({
    extends: Primitive,

    properties: {
        radiusTop: {
            default: 30,
            notify () {
                this.delayInit();
            }
        },
        radiusBottom: {
            default: 30,
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
        radiusSegments: {
            default: 32,
            notify () {
                this.delayInit();
            }
        },
        heightSegments: {
            default: 1,
            notify () {
                this.delayInit();
            }
        }
    },
    _createData () {
        return cc.primitive.cylinder(this.radiusTop, this.radiusBottom, this.height, {
            radialSegments: this.radiusSegments,
            heightSegments: this.heightSegments
        });
    }
});
