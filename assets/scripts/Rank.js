cc.Class({
    extends: cc.Component,

    loadRankingView:function(){
        cc.audioEngine.stopAll();
        cc.director.loadScene("RankingView");
    }
 
});
