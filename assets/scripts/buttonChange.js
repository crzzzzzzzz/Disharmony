var buttoninfo = require("Control");
cc.Class({
    extends: cc.Component,

    properties: {
        
        leftBBtn: {
            default: null,
            type: cc.Button
        },

        leftMBtn: {
            default: null,
            type: cc.Button
        },

        leftTBtn: {
            default: null,
            type: cc.Button
        },
        
        rightBBtn: {
            default: null,
            type: cc.Button
        },

        rightMBtn: {
            default: null,
            type: cc.Button
        },

        rightTBtn: {
            default: null,
            type: cc.Button
        },

        leftBIndicator: {
            default: null,
            type:cc.Sprite
        },

        leftMIndicator:{
            default:null,
            type:cc.Sprite
        },

        leftTIndicator:{
            default:null,
            type:cc.Sprite
        },

        rightBIndicator: {
            default: null,
            type:cc.Sprite
        },

        rightMIndicator:{
            default:null,
            type:cc.Sprite
        },

        rightTIndicator:{
            default:null,
            type:cc.Sprite
        },
    },

    start() {
        this.leftBIndicator.enabled = false;
        this.leftMIndicator.enabled = false;
        this.leftTIndicator.enabled = false;
        this.rightBIndicator.enabled = false;
        this.rightMIndicator.enabled = false;
        this.rightTIndicator.enabled = false;
        //记录上一个灯，下一个灯亮的时候要熄灭上一个
        this.leftLastCED = "";
        this.rightLastCED = "";
    },

    indicatorChange(event,CustomEventData){
        var Data = CustomEventData.split(',')
        //cc.log(Data[0]);
        buttoninfo[Data[2]+'ButtonIndex'] = Data[1];
        //cc.log(buttoninfo[Data[2]+'ButtonIndex']);
        this[Data[0]+'Indicator'].enabled = true;
        if(this[Data[2]+'LastCED'] && this[Data[2]+'LastCED'] != Data[0]){
            this[this[Data[2]+'LastCED']+'Indicator'].enabled = false;
        }
        this[Data[2]+'LastCED'] = Data[0];
    },
});
