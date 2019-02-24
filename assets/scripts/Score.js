var Notes = require("song1");
var recorder = {
    Score: 0 ,//记录分数
    Combo: 0 ,//记录连击数
    maxCombo: 0,//记录最大连击数
    Miss: 0, //记录失误数
    All: 0,//计算正确数
    Correct :0,//记录正确数
    noOperate: 0,//暂时记录误操作
 };

cc.Class({
    extends: cc.Component,

    properties: {
        Miss:{
            default:null,
            type:cc.Label
        },

        Correct:{
            default:null,
            type:cc.Label
        },

        Combo:{
            default:null,
            type:cc.Label
        }
    },

    //LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        for(var item in recorder){
            recorder[item] = 0;
        }
    },

    update (dt) {
    recorder.Correct = recorder.All-recorder.noOperate;
    this.Correct.string = "CORRECT：" + recorder.Correct;
    this.Combo.string = "COMBO：" + recorder.Combo;
    this.Miss.string = "MISS：" + recorder.Miss;
    //更新最大连击数
    recorder.maxCombo = recorder.Combo>recorder.maxCombo?recorder.Combo:recorder.maxCombo;
    },
});

module.exports = recorder;
