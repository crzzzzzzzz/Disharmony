cc.Class({
    extends: cc.Component,

    properties: {
        lR: {
            default: null,
            type: cc.Button
        },
    },

    start(){
        //一开始禁用排行榜
        this.lR.interactable = false;
        this.lR.enableAutoGrayEffect = true;
    },
    
    loadRankingView:function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("RankingView");
    }
});
