cc.Class({
    extends: cc.Component,

    properties: {
        backBtn:{
            default:null,
            type:cc.Button
        },        
    },

    onLoad(){
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node; //这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "back";//这个是代码文件名
        clickEventHandler.handler = "callback";
        clickEventHandler.customEventData = "loadChoose";//动画名称

        this.backBtn.clickEvents.push(clickEventHandler);
    },

    callback: function (event, customEventData) {
        //返回的动画
        var anim = this.getComponent(cc.Animation);
        anim.play(customEventData);
    },

    loadChoose:function(){
        cc.director.loadScene('Choose');
        cc.audioEngine.stopAll()
    }
});
