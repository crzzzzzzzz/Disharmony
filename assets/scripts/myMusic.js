var songTime;
var audioID;
var g = 0;
cc.Class({
    extends: cc.Component,

    properties: {
      audioSource: {
            type: cc.AudioClip,
            default: null
        },
    },

    play: function () {
        audioID = cc.audioEngine.play(this.audioSource, false, 0.8);
    },
   
    // onLoad () {},
    start () {
      this.scheduleOnce(this.play,2.4);
    },

     update (dt) {
     if(audioID != null){
        songTime  = cc.audioEngine.getCurrentTime(audioID);
        cc.log(songTime);
     if(songTime == 0){
        alert("stop");
     }
     }
     },
});
