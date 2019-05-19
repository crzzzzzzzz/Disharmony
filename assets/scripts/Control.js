//要考虑多首歌曲的谱面存储方式
var Notes = require("song1");
var recorder = require("Score");

var buttoninfo = {
    buttonIndex: [3,3],
    fallSpeed: null,
};

cc.Class({
    extends: cc.Component,

    properties: {
        //引用三个色块的预制资源(prefab)
        color1Prefab: {
            default: null,
            type: cc.Prefab
        },

        color2Prefab: {
            default: null,
            type: cc.Prefab
        },

        color3Prefab: {
            default: null,
            type: cc.Prefab
        },

        //左边两个灯的节点
        leftRedLed: {
            default: null,
            type: cc.Node
        },

        leftGreenLed: {
            default: null,
            type: cc.Node
        },

        //左边两个灯的节点
        rightRedLed: {
            default: null,
            type: cc.Node
        },

        rightGreenLed: {
            default: null,
            type: cc.Node
        },

        //左右两个遮罩的节点
        leftCB: {
            default: null,
            type: cc.Node
        },
        rightCB: {
            default: null,
            type: cc.Node
        },

        //左右白光
        leftWhite:{
            default:null,
            type:cc.Animation
        },
        rightWhite:{
            default:null,
            type:cc.Animation
        },
        
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

    //生成新的色块的方法
    spawnNewCb: function (index, location) {
        //产生新色块
        var newColorBlock = this.prefabArr[index].get(this.prefabArr[index]);
        //设定位置
        newColorBlock.setPosition(0, 0);
        //判断位置是左还是右，显示到屏幕
        this.colorBlockQueue[location].unshift([newColorBlock, index, location]);
        //向屏幕添加的是开头的colorblock
        this.CB[location].addChild(this.colorBlockQueue[location][0][0]);
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.indicator = [
            this.leftBIndicator,
            this.leftMIndicator,
            this.leftTIndicator,
            this.rightBIndicator,
            this.rightMIndicator,
            this.rightTIndicator];
        for(let i=0;i<6;i++){
            this.indicator[i].enabled = false;
        }
        //加快运行效率使用对象池储存prefab
        //处理回收与复用的组件为ColorBlockPrefab（目前没有用到）
        this.CB1Pool = new cc.NodePool();
        this.CB2Pool = new cc.NodePool();
        this.CB3Pool = new cc.NodePool();
        //预制资源数列初始化
        this.prefabArr = new Array(this.CB1Pool, this.CB2Pool, this.CB3Pool);
        //预计屏幕上最多的单一色块数量,每个对象池存储16个色块对象
        var initCount = 20;
        for (let i = 0; i < initCount; i++) {
            let CB1 = cc.instantiate(this.color1Prefab);
            let CB2 = cc.instantiate(this.color2Prefab);
            let CB3 = cc.instantiate(this.color3Prefab);
            this.CB1Pool.put(CB1);
            this.CB2Pool.put(CB2);
            this.CB3Pool.put(CB3);
        }
    },
    indicatorChange(event,CustomEventData){
        var Data = CustomEventData.split(',')
        buttoninfo.buttonIndex[Data[2]] = Data[1];
        this.indicator[Data[0]].enabled = true;
        if(this.lastCED[Data[2]]!=null && this.lastCED[Data[2]] != Data[0]){
            this.indicator[this.lastCED[Data[2]]].enabled = false;
        }
        this.lastCED[Data[2]] = Data[0];
    },
    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.w:
                this.indicatorChangeKB([2,2,0]);
                break;
            case cc.macro.KEY.s:
                this.indicatorChangeKB([1,1,0]);
                break;
            case cc.macro.KEY.x:
                this.indicatorChangeKB([0,0,0]);
                break;
            case cc.macro.KEY.i:
                this.indicatorChangeKB([5,2,1]);
                break;
            case cc.macro.KEY.j:
                this.indicatorChangeKB([4,1,1]);
                break;
            case cc.macro.KEY.n:
                this.indicatorChangeKB([3,0,1]);
                break;
        }
    },

    indicatorChangeKB(Data){
        buttoninfo.buttonIndex[Data[2]] = Data[1];
        this.indicator[Data[0]].enabled = true;
        cc.log(Data[0]);
        cc.log('last  '+this.lastCED[Data[2]]);
        if(this.lastCED[Data[2]]!=null && this.lastCED[Data[2]] != Data[0]){
            this.indicator[this.lastCED[Data[2]]].enabled = false;
            //cc.log(this.indicator[this.lastCED[Data[2]]]);
        }
        this.lastCED[Data[2]] = Data[0];
    },

    //会变的量初始化
    start() {
        //记录上一个灯，下一个灯亮的时候要熄灭上一个
        this.lastCED = [null,null];
        this.Data;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //左右白光动画
        this.white = [this.leftWhite,this.rightWhite];
        //左右两个遮罩的节点；
        this.CB = [this.leftCB,this.rightCB];
        //负责整张谱面的计时
        this.noteTime = 0;
        //存储目前进行到的谱面的序号
        this.noteIndex = 0;
        //储存一次生成的色块数量，左右要分开
        this.noteCount = [0,0];
        //存储一次生成多个时所用到的色块序号
        this.tempNoteIndex = [0,0];
        //用队列的方式存储生成的色块,左右都需要数组
        this.colorBlockQueue = [new Array(),new Array()];
        //左右是否对
        this.isCorrect = [false,false];
        //左右能否judge
        this.judgeFlag = [false,false];
        //左右能否pop
        this.popFlag = [false,false];
        //左右能否在无操作状态时判定miss
        this.missFlag = [true,true];
        //暂时存储按钮的位置,用作无操作时期的判断
        this.tempButtonIndex = [buttoninfo.buttonIndex[0],buttoninfo.buttonIndex[1]];
        //存储提示灯
        this.redLed = [this.leftRedLed,this.rightRedLed];
        this.greenLed = [this.leftGreenLed,this.rightGreenLed];
        //为了方便判定一开始就让红色显示
        this.greenLed[0].zIndex = -1;
        this.redLed[0].zIndex = 1;
        this.greenLed[1].zIndex = -1;
        this.redLed[1].zIndex = 1;
        //参数调整
        buttoninfo.fallSpeed = Notes.fallSpeed;//色块下落速度
        //this.correctTime = Math.floor(68/(buttoninfo.fallSpeed/60))-1;//判断为miss的时间（色块前端经过判定区的时间）

    },

    //判断与处理
    judge_Processing: function (location) {
        //判定逻辑：
        if (this.colorBlockQueue[location][this.colorBlockQueue[location].length - 1][0].y < -1237 && this.colorBlockQueue[location][this.colorBlockQueue[location].length - 1][0].y > -1305 && !this.isCorrect[location]) {
            //this.meet++; cc.log(this.meet);
            //如果队列最后一个色块色块前端在判定区内，此时为 "1.判定中" 的状态
            if (this.colorBlockQueue[location][this.colorBlockQueue[location].length - 1][1] == buttoninfo.buttonIndex[location]) {
                this.isCorrect[location] = true;
            }
            //下面要judge,将JudgeFlag设为true
            this.judgeFlag[location] = true;
        } else {
            //如果色块前端超出判定区或对了
            if (this.judgeFlag[location] == true) {
                //此时仍然为 "1.判定中" 的状态
                //进行recorder处理
                if (this.isCorrect[location]) {
                    //如果在判定区内将按钮调到正确的位置，总数与连击都增加
                    recorder.All++;
                    recorder.Combo++;
                    //亮绿灯
                    this.greenLed[location].zIndex = 1;
                    this.redLed[location].zIndex = 0;
                } else {
                    //如果在判定区内没有将按钮调到正确的位置,miss增加,连击清零
                    recorder.Miss++;
                    recorder.Combo = 0;
                    //亮红灯
                    this.greenLed[location].zIndex = 0;
                    this.redLed[location].zIndex = 1;
                }
                //处理完recorder后开关关闭，标记重置
                this.judgeFlag[location] = false;
                //下面要pop,将PopFlag设为true
                this.popFlag[location] = true;
                //记录此时的按钮位置，用作无操作时期的判断
                this.tempButtonIndex[location] = buttoninfo.buttonIndex[location];
            } else if (this.popFlag[location] == true) {
                //在处理完recorder后进入 "2.判定后" 的状态，此时弹出判定后的色块，并回收到序号对应的对象池中,
                var temp = this.colorBlockQueue[location].pop();
                temp[0].color = new cc.Color(255, 255, 255);
                this.prefabArr[temp[1]].put(temp[0]);
                //播放闪烁动画
                if(this.isCorrect[location]){
                    this.white[location].play();
                }
                //处理完pop后开关关闭,判定无操作状态的开关打开
                this.popFlag[location] = false;
                this.missFlag[location] = true;
                //将正确标记置为false
                this.isCorrect[location] = false;
            } else if (this.missFlag[location] == true) {
                //此时应该是 "3.无操作状态' ，若改变了按钮的位置则判定为miss
                if (buttoninfo.buttonIndex[location] != this.tempButtonIndex[location]) {
                    //此时要进行一次miss增加，连击清零
                    recorder.Miss++;
                    //无操作状态进行操作后下一个色块仍然能判定对，但计算总分的时候不能计入这个色块，这里进行计数之后从All中减去
                    recorder.noOperate++;
                    recorder.Combo = 0;
                    //亮红灯
                    this.greenLed[location].zIndex = 0;
                    this.redLed[location].zIndex = 1;
                    //处理完判定无状态操作后关闭miss开关
                    this.missFlag[location] = false;
                }
            }
        }
        //以上为判定逻辑
    },

    update(dt) {
       
        //谱面生成
        this.noteTime++;
        //根据时间生成色块
        if (this.noteTime == Notes[this.noteIndex][0]) {
            //获取生成色块的个数,也要分左右
            this.noteCount[Notes[this.noteIndex][3]] = Notes[this.noteIndex][1];
            //生成色块 index location(location为位置序号)
            this.spawnNewCb(Notes[this.noteIndex][2], Notes[this.noteIndex][3]);
            //生成色块后个数减一
            this.noteCount[Notes[this.noteIndex][3]]--;
            //暂时存取noteIndex，如果是生成多个色块的情况要用到
            this.tempNoteIndex[Notes[this.noteIndex][3]] = this.noteIndex;
            //读取下一个色块
            if (this.noteIndex < Notes.length - 1) {
                this.noteIndex++;
            }
        }
        //如果是多个色块的情况，还要继续生成，而且要离上一个有86像素的间隔
        if (this.noteCount[0] != 0 && this.colorBlockQueue[0][0][0].y < -86){
            //生成色块 index location
            this.spawnNewCb(Notes[this.tempNoteIndex[0]][2], Notes[this.tempNoteIndex[0]][3]);
            //生成色块后个数减一
            this.noteCount[0]--;
        }
        if (this.noteCount[1] != 0 && this.colorBlockQueue[1][0][0].y < -86){
            //生成色块 index location
            this.spawnNewCb(Notes[this.tempNoteIndex[1]][2], Notes[this.tempNoteIndex[1]][3]);
            //生成色块后个数减一
            this.noteCount[1]--;
        }

        if (this.colorBlockQueue[0].length != 0) {
            //左判定
            this.judge_Processing(this.colorBlockQueue[0][this.colorBlockQueue[0].length - 1][2]);
        }

        if (this.colorBlockQueue[1].length != 0) {
            //右判定
            this.judge_Processing(this.colorBlockQueue[1][this.colorBlockQueue[1].length - 1][2])
        }
    },
});
module.exports = buttoninfo;