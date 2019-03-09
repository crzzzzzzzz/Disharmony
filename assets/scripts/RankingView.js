var recorder = require("Score");
cc.Class({
    extends: cc.Component,
    properties: {
        rankingScrollView: cc.Sprite,//显示排行榜
        score:{
            default:null,
            type:cc.Label
        }
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
        this.score.string = "本次得分："+recorder.Score;
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
