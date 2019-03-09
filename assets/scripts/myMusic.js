var recorder = require("Score");
var Notes = require("song1");
cc.Class({
  extends: cc.Component,

  properties: {
    song0: {
      type: cc.AudioClip,
      default: null
    },

    song1: {
      type: cc.AudioClip,
      default: null
    },

    song2: {
      type: cc.AudioClip,
      default: null
    },

    resultAnim:{
      type:cc.Animation,
      default:null
    },

    maxCombo:{
      type:cc.Label,
      default:null
    },

    score:{
      type:cc.Label,
      default:null
    },

    execution:{
      type:cc.Label,
      default:null
    },

    lR: {
      default: null,
      type: cc.Button
    }
  },


  play: function () {
      this.audioID = cc.audioEngine.play(this['song'+Global.songIndex], false, 1);
      console.log(cc.audioEngine.getDuration(this.audioID));
      this.scheduleOnce(this.End,cc.audioEngine.getDuration(this.audioID)||91)
  },

  End:function(){
      recorder.Score = 10 * recorder.Correct + 5*recorder.maxCombo -   recorder.Miss
      var exec = (recorder.Correct / Notes.len * 100).toFixed(2);
      this.maxCombo.string = "MAXCOMBO :\n " + recorder.maxCombo;
      this.score.string = "SCORE :\n" + recorder.Score;
      this.execution.string = "EXECUTION :\n" + exec + '%';
      this.resultAnim.play('Result');
      this.lR.interactable = true;
      cc.log('here');
  },

  onLoad() {
    this.audioID;
  },

  start() {
    this.scheduleOnce(this.play, 3);
  },

  //update(dt) {}
  
});
