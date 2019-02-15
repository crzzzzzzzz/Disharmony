var recorder = require("Score");

var leftinfo = {
   leftButtonIndex: null,
   leftSpeed: null,
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

      //
      LeftRedLed: {
         default: null,
         type: cc.Node
      },

      LeftGreenLed: {
         default: null,
         type: cc.Node
      },

   },

   //生成新的色块的方法
   spawnNewCb: function (index) {
      //产生新色块
      let newColorBlock = this.prefabArr[index].get(this.prefabArr[index]);
      //设定位置
      newColorBlock.setPosition(0, 0);
      /*
      //相对位置序号+1
      this.locIndex = (this.count++) % this.maxCB;
      //相对位置
      this.locArr[this.locIndex] = this.newcb;
      //颜色序号
      this.colorArr[this.locIndex] = this.leftPrefabIndex;
      */
      //向队列首部添加色块信息
      colorBlockQueue.unshift([newColorBlock, index]);
      //显示到屏幕
      this.node.addChild(colorBlockQueue[0][0]);
   },

   //不会变的量初始化
   onLoad() {
      //this.leftPrefabIndex = 0;
      /*
      //相对位置
      this.locArr = new Array(15);
      //颜色序号
      this.colorArr = new Array(15);
      this.locIndex;//储存屏幕上生成的色块前后位置关系
      this.count = 0;//按钮的位置编号 0 1 2
      this.judgeIndex;//记录判定区的色块序号
      */
      //处理回收与复用的组件为ColorBlockPrefab
      this.CB1Pool = new cc.NodePool('ColorBlockPrefab');
      this.CB2Pool = new cc.NodePool('ColorBlockPrefab');
      this.CB3Pool = new cc.NodePool('ColorBlockPrefab');
      //预制资源数列初始化
      this.prefabArr = new Array(this.CB1Pool, this.CB2Pool, this.CB3Pool);
      //预计屏幕上最多的色块数量,每个对象池存储16个色块对象
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
      // 开始延时
      /*
      var delay = 1.1;
      this.schedule(function () {
         this.leftPrefabIndex = (this.g++) % 3;
      },delay);
      */
      //用队列的方式存储生成的色块
      this.colorBlockQueue = [];
      this.redTime = 0;//红灯亮的时间
      this.judgeFlage = true;//能否judge
      this.popFlag = false;//能否pop
      this.missFlag = false;//能否在无操作状态时判定miss
      this.tempButtonIndex;//暂时存储按钮的位置,用作无操作时期的判断
      //分数变量初始化
      recorder.Score = 0;
      recorder.Combo = 0;
      recorder.Miss = 0;
      recorder.All = 0;
      //为了方便判定一开始就让红色显示
      this.LeftGreenLed.zIndex = -1;
      this.LeftRedLed.zIndex = 1;
      //参数调整
      this.maxCB = 15;//屏幕最多色块数目
      this.correctTime = 7;//判断为miss的时间（色块前端经过判定区的时间）
      this.CBDis = -85;//连续色块生成的距离间隔
      leftinfo.leftSpeed = 351;
      //测试随机生成色块
      this.spawnNewCb();
   },

   //判断色块与按钮位置能否对应
   update(dt) {

      //判定逻辑：
      /*1.判定中的色块对还是错：色块前端接触判定区时开始计时,在这个区间内当按钮位置与颜色对应的时候
       停止计时，等色块前端越过判定区后进行判定，如果计时小于correctTime判定为正确，否则判定为错误，之后计时清零，因为只需要判定一次，
       因此要设定一个开关judgeFlag，处理recorder前为true，处理recorder后为false。

       2.判定后的色块的处理：色块前端越过判定线之后应该从队列中pop掉,同时pop返回的数组[newColorBlock,index]中
       的newColorBlock对象回收到对象池中(pop是浅拷贝)，pop也只需要进行一次，所以也要设置一个开关popFlag,处理
       pop前
       3.无操作区：玩家此时不该操作，若操作则判定为miss*/

      //如果色块数列的最后一个元素在判定区内
      if (this.colorBlockQueue[this.colorBlockQueue.length-1][0].y < -1242 && this.colorBlockQueue[this.colorBlockQueue.length-1][0].y > -1294) {
         //如果色块前端在判定区内，此时为 "1.判定中" 的状态
         //下面要judge,将judgeFlag设为true
         this.judgeFlag = true;
         if (this.colorBlockQueue[this.colorBlockQueue.length-1][1] != leftinfo.leftButtonIndex) {
            this.redTime++;
         } 
      }else{
         //如果色块前端超出判定区
         if(this.judgeFlag == true){
            //此时仍然为 "1.判定中" 的状态
            //下面要pop,将popFlag设为true
            this.popFlag = true;
            //记录此时的按钮位置，用作无操作时期的判断
            this.tempButtonIndex = leftinfo.leftButtonIndex;
            //进行recorder处理
            if(this.redTime <= correctTime){
               //如果在判定区内将按钮调到正确的位置，总数与连击都增加
               recorder.All++;
               recorder.Combo++;
               //亮绿灯
               this.LeftGreenLed.zIndex = 1;
               this.LeftRedLed.zIndex = 0;
            }else{
               //如果在判定区内没有将按钮调到正确的位置,miss增加,连击清零
               recorder.Miss++;
               recorder.Combo = 0;
               //亮红灯
               this.LeftGreenLed.zIndex = 0;
               this.LeftRedLed.zIndex = 1;
            }
            //处理完recorder后开关关闭，计时清零
            this.judgeFlag = false;
            this.redTime = 0;
         }else if(this.popFlag == true){
            //在处理完recorder后进入 "2.判定后" 的状态，此时弹出判定后的色块，并回收到d序号对应的对象池中
            let temp = this.colorBlockQueue.pop();
            this.prefabArr[temp[1]].put();
            //处理完pop后开关关闭,判定无操作状态的开关打开
            this.popFlag = false;
            this.missFlag == true;
         }else if(this.missFlag == true){
            //此时应该是 "3.无操作状态' ，若改变了按钮的位置则判定为miss
            if(leftinfo.leftButtonIndex != this.tempButtonIndex){
               //此时要进行一次miss增加，连击清零
               recorder.Miss++;
               recorder.Combo = 0;
               //亮红灯
               this.LeftGreenLed.zIndex = 0;
               this.LeftRedLed.zIndex = 1;
               //处理完判定无状态操作后关闭miss开关
               this.missFlag = false;
            }
         }
      }
      //以上为游戏的判定逻辑
      
   },
});
module.exports = leftinfo;



/*原update：
           
                        if (this.colorArr[this.judgeIndex] == leftinfo.leftButtonIndex) {//判定正确的情况
                           //增加combo
                           recorder.Combo++;
                           //色块与摇杆位置一致，判定正确时，重置miss能否已增加的状态
                           this.missFlag = true;
                           this.tempButtonIndex = leftinfo.leftButtonIndex;
                           this.LeftGreenLed.zIndex = 1;
                           this.LeftRedLed.zIndex = 0;
                        } else if (this.colorArr[this.judgeIndex] != leftinfo.leftButtonIndex) {//判定错误的情况
                           this.redTime++;
                           this.LeftRedLed.zIndex = 1;
                           this.LeftGreenLed.zIndex = 0;
                        }

                  } else {
                     //色块开始区域不在判定区时重置combo能否已增加的设置
                     this.comboFlag = true;
                     this.missFlag = true;
                     this.redTime = 0;
                  }

      //如果玩家在绿灯亮的时候改变按钮位置则判定为错误
      if (this.tempButtonIndex != leftinfo.leftButtonIndex) {
         this.LeftRedLed.zIndex = 1;
         this.LeftGreenLed.zIndex = 0;
      }*/