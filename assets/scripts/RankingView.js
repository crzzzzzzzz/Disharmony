var recorder = require("Score");
cc.Class({
    extends: cc.Component,
    properties: {
        rankingScrollView: cc.Sprite,//显示排行榜
    },
    onLoad() {
    },

    loadChoose:function(){
        cc.director.loadScene('Choose');
    },
    
    start() {
        if (CC_WECHATGAME) {
            window.wx.showShareMenu({withShareTicket: true});//设置分享按钮，方便获取群id展示群排行榜
            this.tex = new cc.Texture2D();
            window.sharedCanvas.width = 720;
            window.sharedCanvas.height = 1280;
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "song1"
            });
        }
    },

    friendButtonFunc(event) {
        if (CC_WECHATGAME) {
            //发消息给子域
            window.wx.postMessage({
                messageType: 1,
                MAIN_MENU_NUM: "song1"
            });
        } else {
            cc.log("获取好友排行榜数据。song1");
        }
    },

    submitScoreButtonFunc(){
        let score = recorder.Score;
        if (CC_WECHATGAME) {
            window.wx.postMessage({
                messageType: 3,
                MAIN_MENU_NUM: "song1",
                score: score,
            });
        } else {
            cc.log("提交得分: song1 : " + score)
        }
    },

    // 刷新子域的纹理
    _updateSubDomainCanvas() {
        if (window.sharedCanvas != undefined) {
            //加载子域
            this.tex.initWithElement(window.sharedCanvas);
            this.tex.handleLoadedTexture();
            this.rankingScrollView.spriteFrame = new cc.SpriteFrame(this.tex);
        }
    },
    update() {
        this._updateSubDomainCanvas();
    },
});
