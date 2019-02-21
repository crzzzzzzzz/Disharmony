
//要考虑多首歌曲的谱面存储方式
var Notes = require("song1");
var recorder = require("Score");

var buttoninfo = {
    leftButtonIndex: 0,
    rightButtonIndex: 0,
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
    },

    //生成新的色块的方法
    spawnNewCb: function (index, location) {
        //产生新色块
        let newColorBlock = this.prefabArr[index].get(this.prefabArr[index]);
        //设定位置
        newColorBlock.setPosition(0, 0);
        //判断位置是左还是右，显示到屏幕
        this[location+'ColorBlockQueue'].unshift([newColorBlock, index, location]);
        this[location+'CB'].addChild(this[location+'ColorBlockQueue'][0][0])
        /*switch (location) {
            case 'left':
                //向左队列首部添加信息,包括色块节点，色块颜色序号，色块位置（左还是右）
                this.leftColorBlockQueue.unshift([newColorBlock, index, location]);
                this.leftCB.addChild(this.leftColorBlockQueue[0][0]);
                break;
            case 'right':
                //向右队列首部添加信息,包括色块节点，色块颜色序号，色块位置（左还是右）
                this.rightColorBlockQueue.unshift([newColorBlock, index, location])
                this.rightCB.addChild(this.rightColorBlockQueue[0][0]);
                break;
        }*/
    },
    // LIFE-CYCLE CALLBACKS:

    //不会变的量初始化
    onLoad() {
        //加快运行效率使用对象池储存prefab
        //处理回收与复用的组件为ColorBlockPrefab（目前没有用到）
        this.CB1Pool = new cc.NodePool('ColorBlockPrefab');
        this.CB2Pool = new cc.NodePool('ColorBlockPrefab');
        this.CB3Pool = new cc.NodePool('ColorBlockPrefab');
        //预制资源数列初始化
        this.prefabArr = new Array(this.CB1Pool, this.CB2Pool, this.CB3Pool);
        //预计屏幕上最多的单一色块数量,每个对象池存储16个色块对象
        let initCount = 34;
        for (let i = 0; i < initCount; i++) {
            let CB1 = cc.instantiate(this.color1Prefab);
            let CB2 = cc.instantiate(this.color2Prefab);
            let CB3 = cc.instantiate(this.color3Prefab);
            this.CB1Pool.put(CB1);
            this.CB2Pool.put(CB2);
            this.CB3Pool.put(CB3);
        }


    },

    //会变的量初始化
    start() {
        //负责整张谱面的计时
        this.noteTime = 0;
        //存储目前进行到的谱面的序号
        this.noteIndex = 0;
        //储存一次生成的色块数量，左右要分开
        this.rightNoteCount = 0;
        this.leftNoteCount = 0;
        //存储一次生成多个时所用到的色块序号
        this.leftTempNoteIndex;
        this.rightTempNoteIndex;
        //用队列的方式存储生成的色块,左右都需要数组
        this.leftColorBlockQueue = [];
        this.rightColorBlockQueue = [];
        //左边
        this.leftIsCorrect = false;//左边是否对
        this.leftJudgeFlag = false;//能否judge
        this.leftPopFlag = false;//能否pop
        this.leftMissFlag = true;//能否在无操作状态时判定miss
        this.leftTempButtonIndex = buttoninfo.leftButtonIndex;//暂时存储按钮的位置,用作无操作时期的判断
        //右边
        this.rightIsCorrect = false;//右边是否对
        this.rightJudgeFlag = false;//能否judge
        this.rightPopFlag = false;//能否pop
        this.rightMissFlag = true;//能否在无操作状态时判定miss
        this.rightTempButtonIndex = buttoninfo.rightButtonIndex;//暂时存储按钮的位置,用作无操作时期的判断
        //是否完成关卡
        this.isFinish = false;
        //为了方便判定一开始就让红色显示
        this.leftGreenLed.zIndex = -1;
        this.leftRedLed.zIndex = 1;
        this.rightGreenLed.zIndex = -1;
        this.rightRedLed.zIndex = 1;
        //参数调整
        this.maxCB = 15;//屏幕最多色块数目
        buttoninfo.fallSpeed = Notes.fallSpeed;//色块下落速度
        //this.correctTime = Math.floor(68/(buttoninfo.fallSpeed/60))-1;//判断为miss的时间（色块前端经过判定区的时间）
        //cc.log('correct  '+this.correctTime)
    },

    //判断与处理
    judge_Processing: function (location) {
        //判定逻辑：（水平太菜以及js就这尿性导致写的很尿）
        /*1.判定中的色块对还是错：色块前端接触判定区时开始计时,在这个区间内当按钮位置与颜色对应的时候
         停止计时，等色块前端越过判定区后进行判定，如果计时小于correctTime判定为正确，否则判定为错误，之后计时清零，因为只需要判定一次，
         因此要设定一个开关JudgeFlag，处理recorder前为true，处理recorder后为false,之后转到2。
  
         2.判定后的色块的处理：色块前端越过判定线之后应该从队列中pop掉,同时pop返回的数组[newColorBlock,index]中
         的newColorBlock对象回收到对象池中(pop是浅拷贝)，pop也只需要进行一次，所以也要设置一个开关PopFlag,处理
         pop前，之后转到3

         3.无操作区：玩家此时不该操作，若操作则判定为miss*/
        if (this[location+'ColorBlockQueue'][this[location+'ColorBlockQueue'].length - 1][0].y < -1237 && this[location+'ColorBlockQueue'][this[location+'ColorBlockQueue'].length - 1][0].y > -1305) {
            //this.meet++; cc.log(this.meet);
            //如果最后一个色块色块前端在判定区内，此时为 "1.判定中" 的状态
            if (this[location+'ColorBlockQueue'][this[location+'ColorBlockQueue'].length - 1][1] == buttoninfo[location+'ButtonIndex']) {
                this[location+'IsCorrect'] = true;
            }
            //下面要judge,将JudgeFlag设为true
            this[location+'JudgeFlag'] = true;
            //cc.log('here');
        } else {
            //this.meet = 0;
            //如果色块前端超出判定区
            if (this[location+'JudgeFlag'] == true) {
                //此时仍然为 "1.判定中" 的状态
                //进行recorder处理
                if (this[location+'IsCorrect']) {
                    //如果在判定区内将按钮调到正确的位置，总数与连击都增加
                    recorder.All++;
                    recorder.Combo++;
                    //亮绿灯
                    this[location+'GreenLed'].zIndex = 1;
                    this[location+'RedLed'].zIndex = 0;
                } else {
                    //如果在判定区内没有将按钮调到正确的位置,miss增加,连击清零
                    recorder.Miss++;
                    recorder.Combo = 0;
                    //亮红灯
                    this[location+'GreenLed'].zIndex = 0;
                    this[location+'RedLed'].zIndex = 1;
                }
                //处理完recorder后开关关闭，标记重置
                this[location+'JudgeFlag'] = false;
                this[location+'IsCorrect'] = false;
                //下面要pop,将PopFlag设为true
                this[location+'PopFlag'] = true;
                //记录此时的按钮位置，用作无操作时期的判断
                this[location+'TempButtonIndex'] = buttoninfo[location+'ButtonIndex'];
            } else if (this[location+'PopFlag'] == true) {
                //在处理完recorder后进入 "2.判定后" 的状态，此时弹出判定后的色块，并回收到序号对应的对象池中,
                let temp = this[location+'ColorBlockQueue'].pop();
                this.prefabArr[temp[1]].put(temp[0]);
                //播放闪烁动画
                this[location+'White'].play();
                //处理完pop后开关关闭,判定无操作状态的开关打开
                this[location+'PopFlag'] = false;
                this[location+'MissFlag'] == true;
            } else if (this[location+'MissFlag'] == true) {
                //此时应该是 "3.无操作状态' ，若改变了按钮的位置则判定为miss
                if (buttoninfo[location+'ButtonIndex'] != this[location+'TempButtonIndex']) {
                    //cc.log(buttoninfo[location+'ButtonIndex'] + '    '+this[location+'TempButtonIndex'])
                    //此时要进行一次miss增加，连击清零
                    recorder.Miss++;
                    //无操作状态进行操作后下一个色块仍然能判定对，但计算总分的时候不能计入这个色块，这里进行计数之后从All中减去
                    recorder.noOperate++;
                    recorder.Combo = 0;
                    //亮红灯
                    this[location+'GreenLed'].zIndex = 0;
                    this[location+'RedLed'].zIndex = 1;
                    //处理完判定无状态操作后关闭miss开关
                    this[location+'MissFlag'] = false;
                }
            }
        }
        //以上为判定逻辑
    },

    update(dt) {
       
        //谱面生成
        this.noteTime++;
        //cc.log('noteTime' + this.noteTime);
        //根据时间生成色块
        if (this.noteTime == Notes[this.noteIndex][0]) {
            //cc.log(this.noteIndex);
            //获取生成色块的个数,也要分左右
            this[Notes[this.noteIndex][3]+'NoteCount'] = Notes[this.noteIndex][1];
            //生成色块 index location
            this.spawnNewCb(Notes[this.noteIndex][2], Notes[this.noteIndex][3]);
            //生成色块后个数减一
            this[Notes[this.noteIndex][3]+'NoteCount']--;
            //暂时存取noteIndex，如果是生成多个色块的情况要用到
            this[Notes[this.noteIndex][3]+'TempNoteIndex'] = this.noteIndex;
            //读取下一个色块
            if (this.noteIndex < Notes.length - 1) {
                this.noteIndex++;
            }else{
                //待补充，结算页面
            }
        }
        //如果是多个色块的情况，还要继续生成，而且要离上一个有86像素的间隔
        if (this.leftNoteCount != 0 && this.leftColorBlockQueue[0][0].y < -86){
            //生成色块 index location
            this.spawnNewCb(Notes[this.leftTempNoteIndex][2], Notes[this.leftTempNoteIndex][3]);
            //生成色块后个数减一
            this.leftNoteCount--;
        }
        if (this.rightNoteCount != 0 && this.rightColorBlockQueue[0][0].y < -86){
            //生成色块 index location
            this.spawnNewCb(Notes[this.rightTempNoteIndex][2], Notes[this.rightTempNoteIndex][3]);
            //生成色块后个数减一
            this.rightNoteCount--;
        }

        
        if (this.leftColorBlockQueue.length != 0) {
            //左判定
            this.judge_Processing(this.leftColorBlockQueue[this.leftColorBlockQueue.length - 1][2]);
        }

        if (this.rightColorBlockQueue.length != 0) {
            //右判定
            this.judge_Processing(this.rightColorBlockQueue[this.rightColorBlockQueue.length - 1][2])
        }

    },
});
module.exports = buttoninfo;
