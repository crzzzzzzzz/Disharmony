cc.Class({
    extends: cc.Component,

    onLoad () {
        this.picArr = ['龙卷风','9(After Coachella)','Tell Your World']
        var self = this;
        cc.loader.loadRes(this.picArr[Global.songIndex],cc.SpriteFrame,function(err,spriteFrame){
            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
        })
    },
});
