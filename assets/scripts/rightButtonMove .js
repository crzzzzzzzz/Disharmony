var rightSlider;
cc.Class({
    extends: cc.Component,

    properties: {
       
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        rightSlider = this.getComponent(cc.Slider);
    },

    //判断按钮位置
     update (dt) {
        if(rightSlider.progress <= 0.333){
            Global.rightButtonIndex = 0;
        }else if(rightSlider.progress > 0.333 && rightSlider.progress <= 0.666){
            Global.rightButtonIndex = 1;
        }else if(rightSlider.progress > 0.666 && rightSlider.progress <= 1){
            Global.rightButtonIndex = 2;
        }
     },
});
