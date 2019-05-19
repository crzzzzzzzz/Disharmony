
var buttoninfo = require("Control");

cc.Class({
    extends: cc.Component,


     update(dt) {
        this.node.y -= dt * buttoninfo.fallSpeed;
        if(this.node.y < -1237){
            this.node.color = new cc.Color(59, 252, 136);
        }
     },
});
