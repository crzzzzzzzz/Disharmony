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

        leftBlue:{
            default:null,
            type:cc.Sprite
        },

        leftYellow:{
            default:null,
            type:cc.Sprite
        },

        leftRed:{
            default:null,
            type:cc.Sprite
        },

        rightBlue:{
            default:null,
            type:cc.Sprite
        },

        rightYellow:{
            default:null,
            type:cc.Sprite
        },

        rightRed:{
            default:null,
            type:cc.Sprite
        },
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad() {},

    start() {
        this.leftBlue.enabled = false;
        this.leftYellow.enabled = false;
        this.leftRed.enabled = false;
        this.rightBlue.enabled = false;
        this.rightYellow.enabled = false;
        this.rightRed.enabled = false;
    },

    //判断按钮位置
    update(dt) {
        //左边滑杆
        if (this.LeftSlider.progress <= 0.333) {
            buttoninfo.leftButtonIndex = 0;
            this.leftBlue.enabled = true;
            this.leftYellow.enabled = false;
            this.leftRed.enabled = false;
        } else if (this.LeftSlider.progress > 0.333 && this.LeftSlider.progress <= 0.666) {
            buttoninfo.leftButtonIndex = 1;
            this.leftBlue.enabled = false;
            this.leftYellow.enabled = true;
            this.leftRed.enabled = false;
        } else if (this.LeftSlider.progress > 0.666 && this.LeftSlider.progress <= 1) {
            buttoninfo.leftButtonIndex = 2;
            this.leftBlue.enabled = false;
            this.leftYellow.enabled = false;
            this.leftRed.enabled = true;
        }
        //右边滑杆
        if (this.RightSlider.progress <= 0.333) {
            buttoninfo.rightButtonIndex = 0;
            this.rightBlue.enabled = true;
            this.rightYellow.enabled = false;
            this.rightRed.enabled = false;
        } else if (this.RightSlider.progress > 0.333 && this.RightSlider.progress <= 0.666) {
            buttoninfo.rightButtonIndex = 1;
            this.rightBlue.enabled = false;
            this.rightYellow.enabled = true;
            this.rightRed.enabled = false;
        } else if (this.RightSlider.progress > 0.666 && this.RightSlider.progress <= 1) {
            buttoninfo.rightButtonIndex = 2;
            this.rightBlue.enabled = false;
            this.rightYellow.enabled = false;
            this.rightRed.enabled = true;
        }
    },
});
