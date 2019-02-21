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

  },

  play: function () {
      this.audioID = cc.audioEngine.play(this['song'+Global.songIndex], false, 1);
      this.scheduleOnce(this.End,cc.audioEngine.getDuration(this.audioID))
      cc.log(cc.audioEngine.getDuration(this.audioID));
  },

  End:function(){
      var finalScore = 4 * recorder.Correct + 5*recorder.maxCombo - 2 * recorder.Miss
      var exec = (recorder.Correct / Notes.length * 100).toFixed(2);
      this.maxCombo.string = "MAXCOMBO :\n " + recorder.maxCombo;
      this.score.string = "SCORE :\n" + finalScore;
      this.execution.string = "EXECUTION :\n" + exec + '%';
      this.resultAnim.play('Result');
  },

  onLoad() {
    this.audioID;
  },

  start() {
    this.scheduleOnce(this.play, 3);
  },

  //update(dt) {}
  
});
