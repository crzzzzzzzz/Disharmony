
cc.Class({
    extends: cc.Component,

    properties: {
      audioSource: {
            type: cc.AudioClip,
            default: null
        },
    },

    play: function () {
      this.audioID = cc.audioEngine.play(this.audioSource, false, 0.8);
    },
   
    onLoad () {
      this.songTime;
      this.audioID;
      this.g = 0;
    },

    start () {
      this.scheduleOnce(this.play,2.4);
    },

     update (dt) {
     if(this.audioID != null){
       this.songTime  = cc.audioEngine.getCurrentTime(this.audioID);
       //cc.log(this.songTime);
     if(this.songTime == 0){
        //alert("stop");
     }
     }
     },
});
