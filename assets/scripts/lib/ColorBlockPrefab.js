
var buttoninfo = require("Control");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
     //this.CBManager;
    },

    //start () {},
    
    //废除
   /* 
   reuse(CBManager){
         //cc.log(CBManager);
         this.CBManager = CBManager;
         //cc.log(this.CBManager);
    },
    */



     update(dt) {
        
        
        this.node.y -= dt * buttoninfo.fallSpeed;
        
       // if(this.node.y <= -1400 && this.CBManager){}
     },
});
