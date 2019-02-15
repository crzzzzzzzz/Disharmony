
//要考虑多首歌曲的谱面存储方式
var Notes = require("song1");
var recorder = require("Score");

var buttoninfo = {
    leftButtonIndex: null,
    rightButtonIndex: null,
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
        }
    },

    //生成新的色块的方法
    spawnNewCb: function (index, location) {
        //产生新色块
        let newColorBlock = this.prefabArr[index].get(this.prefabArr[index]);
        //设定位置
        newColorBlock.setPosition(0, 0);
        //向队列首部添加信息,包括色块节点，色块颜色序号，色块位置（左还是右）
        this.colorBlockQueue.unshift([newColorBlock, index, location]);
        //判断位置是左还是右，显示到屏幕
        switch (location) {
            case 'left':
                this.leftCB.addChild(this.colorBlockQueue[0][0]);
                break;
            case 'right':
                this.rightCB.addChild(this.colorBlockQueue[0][0]);
                break;
        }
        //cc.log(this.colorBlockQueue[0][0].parent);
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
        let initCount = 16;
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
        //储存一次生成的色块数量
        this.noteCount = 0;
        //用队列的方式存储生成的色块
        this.colorBlockQueue = [];
        this.redTime = 0;//红灯亮的时间
        this.judgeFlage = true;//能否judge
        this.popFlag = false;//能否pop
        this.missFlag = true;//能否在无操作状态时判定miss
        this.tempButtonIndex;//暂时存储按钮的位置,用作无操作时期的判断
        //分数变量初始化
        recorder.Score = 0;
        recorder.Combo = 0;
        recorder.Miss = 0;
        recorder.All = 0;
        //为了方便判定一开始就让红色显示
        this.leftGreenLed.zIndex = -1;
        this.leftRedLed.zIndex = 1;
        this.rightGreenLed.zIndex = -1;
        this.rightRedLed.zIndex = 1;
        //参数调整
        this.maxCB = 15;//屏幕最多色块数目
        this.correctTime = 7;//判断为miss的时间（色块前端经过判定区的时间）
        this.CBDis = -85;//连续色块生成的距离间隔
        buttoninfo.fallSpeed = 351;
    },

    //判断与处理
    judge_Processing: function (location) {
        //判定逻辑：
        /*1.判定中的色块对还是错：色块前端接触判定区时开始计时,在这个区间内当按钮位置与颜色对应的时候
         停止计时，等色块前端越过判定区后进行判定，如果计时小于correctTime判定为正确，否则判定为错误，之后计时清零，因为只需要判定一次，
         因此要设定一个开关judgeFlag，处理recorder前为true，处理recorder后为false,之后转到2。
  
         2.判定后的色块的处理：色块前端越过判定线之后应该从队列中pop掉,同时pop返回的数组[newColorBlock,index]中
         的newColorBlock对象回收到对象池中(pop是浅拷贝)，pop也只需要进行一次，所以也要设置一个开关popFlag,处理
         pop前，之后转到3

         3.无操作区：玩家此时不该操作，若操作则判定为miss*/
        
        if (this.colorBlockQueue[this.colorBlockQueue.length - 1][0].y < -1242 && this.colorBlockQueue[this.colorBlockQueue.length - 1][0].y > -1294) {
            //如果最后一个色块色块前端在判定区内，此时为 "1.判定中" 的状态
            if (this.colorBlockQueue[this.colorBlockQueue.length - 1][1] != buttoninfo[location+'ButtonIndex']) {
                //如果本色块跟本色块所在的列的按钮的位置不对应则增加错误时间
                this.redTime++;
            }
            //下面要judge,将judgeFlag设为true
            this.judgeFlag = true;
        } else {
            //如果色块前端超出判定区
            if (this.judgeFlag == true) {
                //此时仍然为 "1.判定中" 的状态
                //下面要pop,将popFlag设为true
                this.popFlag = true;
                //记录此时的按钮位置，用作无操作时期的判断
                this.tempButtonIndex = buttoninfo[location+'ButtonIndex'];
                //进行recorder处理
                if (this.redTime <= this.correctTime) {
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
                //处理完recorder后开关关闭，计时清零
                this.judgeFlag = false;
                this.redTime = 0;
            } else if (this.popFlag == true) {
                //在处理完recorder后进入 "2.判定后" 的状态，此时弹出判定后的色块，并回收到序号对应的对象池中,
                let temp = this.colorBlockQueue.pop();
                this.prefabArr[temp[1]].put(temp[0]);
                cc.log('change');
                //处理完pop后开关关闭,判定无操作状态的开关打开
                this.popFlag = false;
                this.missFlag == true;
            } else if (this.missFlag == true) {
                //此时应该是 "3.无操作状态' ，若改变了按钮的位置则判定为miss
                if (buttoninfo[location+'ButtonIndex'] != this.tempButtonIndex) {
                    //此时要进行一次miss增加，连击清零
                    recorder.Miss++;
                    recorder.Combo = 0;
                    //亮红灯
                    this[location+'GreenLed'].zIndex = 0;
                    this[location+'RedLed'].zIndex = 1;
                    //处理完判定无状态操作后关闭miss开关
                    this.missFlag = false;
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
            //cc.log(Notes[this.noteIndex][0] + '     ' + this.noteTime);
            //获取生成色块的个数(待补充)
            this.noteCount = Notes[this.noteIndex][1];
            //生成色块 index location
            this.spawnNewCb(Notes[this.noteIndex][2], Notes[this.noteIndex][3]);
            if (this.noteIndex < Notes.length - 1) {
                this.noteIndex++;
            }
        }

        if (this.colorBlockQueue.length != 0) {
            //如果开始生成了就开始判定
            cc.log(this.colorBlockQueue[this.colorBlockQueue.length - 1][2]);
            this.judge_Processing(this.colorBlockQueue[this.colorBlockQueue.length - 1][2]);
        }

    },
});
module.exports = buttoninfo;
