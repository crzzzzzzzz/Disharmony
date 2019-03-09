
var buttoninfo = require("Control");

cc.Class({
    extends: cc.Component,

    properties: {
    },

     update(dt) {
        this.node.y -= dt * buttoninfo.fallSpeed;
     },
});
