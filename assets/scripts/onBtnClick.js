window.Global = {
    //存储本场景歌曲序号，下一场景加载对应序号的歌曲和谱面
    songIndex: 1,
};

cc.Class({
    extends: cc.Component,

    properties: {
        playBtn:{
            default:null,
            type:cc.Button
        },
        pages:{
            default:null,
            type:cc.PageView
        },
        message:{
            default:null,
            type:cc.Animation
        }
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "onBtnClick";//这个是代码文件名
        clickEventHandler.handler = "callback";
        clickEventHandler.customEventData = "Out";//动画名称

        this.playBtn.clickEvents.push(clickEventHandler);
    },

    callback: function (event, customEventData) {
        //返回的动画
        cc.log('here');
        var anim = this.getComponent(cc.Animation);
        Global.songIndex = this.pages.getCurrentPageIndex();
        cc.log(Global.songIndex);
        if(Global.songIndex == 1){
            anim.play("Out");
        }else{
            this.message.play();
        }
    },

    loadPlay: function(){
        cc.director.loadScene('Game');
    },
    //update (dt) {},
});
