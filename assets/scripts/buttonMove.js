var buttoninfo = require("Control");
cc.Class({
    extends: cc.Component,

    properties: {
        //左右滑杆
        LeftSlider: {
            default: null,
            type: cc.Slider
        },

        RightSlider: {
            default: null,
            type: cc.Slider
        },
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad() {},

    //start() {},

    //判断按钮位置
    update(dt) {
        //左边滑杆
        if (this.LeftSlider.progress <= 0.333) {
            buttoninfo.leftButtonIndex = 0;
        } else if (this.LeftSlider.progress > 0.333 && this.LeftSlider.progress <= 0.666) {
            buttoninfo.leftButtonIndex = 1;
        } else if (this.LeftSlider.progress > 0.666 && this.LeftSlider.progress <= 1) {
            buttoninfo.leftButtonIndex = 2;
        }
        //右边滑杆
        if (this.RightSlider.progress <= 0.333) {
            buttoninfo.rightButtonIndex = 0;
        } else if (this.RightSlider.progress > 0.333 && this.RightSlider.progress <= 0.666) {
            buttoninfo.rightButtonIndex = 1;
        } else if (this.RightSlider.progress > 0.666 && this.RightSlider.progress <= 1) {
            buttoninfo.rightButtonIndex = 2;
        }
    },
});
