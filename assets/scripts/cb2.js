

cc.Class({
    extends: cc.Component,

    properties: {
        //色块消失时与判定器的距离
        VanishingDistance : 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

     update (dt) {
        var dy = dt * Global.leftSpeed;
        this.node.y -= dy;
        //碰到判定器后消失
        if(this.node.y <= -2000){
             this.node.removeFromParent();
             this.destroy();
        }
     },
});
