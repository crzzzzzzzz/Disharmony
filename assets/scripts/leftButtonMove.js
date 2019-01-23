var LeftSlider;
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        LeftSlider = this.getComponent(cc.Slider);
    },

    //判断按钮位置
     update (dt) {
        if(LeftSlider.progress <= 0.333){
            Global.leftButtonIndex = 0;
        }else if(LeftSlider.progress > 0.333 && LeftSlider.progress <= 0.666){
            Global.leftButtonIndex = 1;
        }else if(LeftSlider.progress > 0.666 && LeftSlider.progress <= 1){
            Global.leftButtonIndex = 2;
        }
     },
});
