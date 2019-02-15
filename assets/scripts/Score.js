
var recorder = {
    Score: null ,//记录分数
    Combo: null ,//记录连击数
    Miss: null, //记录失误数
    All: null //记录总数
 };

cc.Class({
    extends: cc.Component,

    properties: {
        Miss:{
            default:null,
            type:cc.Label
        },

        All:{
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

    //start () {},

    update (dt) {
    this.All.string = "All：" + recorder.All;
    this.Combo.string = "Combo：" + recorder.Combo;
    this.Miss.string = "Miss：" + recorder.Miss;
    },
});

module.exports = recorder;
