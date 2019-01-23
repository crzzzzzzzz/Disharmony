
window.Global = {
    Score: null ,//记录分数
    Combo: null ,//记录连击数
    Miss: null, //记录失误数
    All: null //记录总数
 };
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    //LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    
    },

    update (dt) {
    //cc.log(this.node.getChildByName("Combo").getComponent(cc.Label).string);
    //this.node.getChildByName("All").getComponent(cc.Label).string = "总数：" + Global.All;
    //this.node.getChildByName("Combo").getComponent(cc.Label).string = "连击：" + Global.Combo;
    //this.node.getChildByName("Miss").getComponent(cc.Label).string = "失误：" + Global.Miss;
    },

});
