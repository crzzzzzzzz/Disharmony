var audioID = require("myMusic");
cc.Class({
    extends: cc.Component,

    properties: {
        backBtn:{
            default:null,
            type:cc.Button
        },
       
        leftMask:{
            default:null,
            type:cc.Node
        },

        rightMask:{
            default:null,
            type:cc.Node
        },    
    },

    onLoad(){
        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;//这个 node 节点是你的事件处理代码组件所属的节点
        clickEventHandler.component = "loadChoose";//这个是代码文件名
        clickEventHandler.handler = "callback";
        clickEventHandler.customEventData = "loadChoose";//动画名称

        this.backBtn.clickEvents.push(clickEventHandler);
    },

    callback: function (event, customEventData) {
        //返回的动画
        var anim = this.getComponent(cc.Animation);
        anim.play(customEventData);
        this.leftMask.active = false;
        this.rightMask.active = false;
        cc.audioEngine.setCurrentTime(audioID, 0);
        cc.audioEngine.stopAll();
        cc.audioEngine.uncacheAll();
    },

    loadChoose:function(){
        cc.director.loadScene('Choose');
    }
});
