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

   //不断生成新的色块
   spawnNewCb: function () {
     //cc.log(this.prefabArr[this.leftPrefabIndex]);
      this.newcb = this.prefabArr[this.leftPrefabIndex].get(this.prefabArr[this.leftPrefabIndex]);
      this.newcb.setPosition(0, 0);
      this.locIndex = (this.count++) % this.maxCB;
      this.locArr[this.locIndex] = this.newcb;
      this.colorArr[this.locIndex] = this.leftPrefabIndex;
      this.node.addChild(this.locArr[this.locIndex]);
   },

   onLoad() {
      this.leftPrefabIndex = 2;
      this.prefabArr = new Array(3);
      this.locArr = new Array(15);
      this.colorArr = new Array(15);
      this.locIndex;//储存屏幕上生成的色块前后位置关系
      this.count = 0;//按钮的位置编号 0 1 2
      this.redTime = 0;//红灯亮的时间
      this.g = 0;//色块随机数
      this.time = 0;
      this.comboFlag = true;//判断能否已经增加combo数
      this.missFlag = true;//判断能否已经增加miss数
      this.startJudge = false;//标记是否开始判定对错
      this.judgeIndex;//记录判定区的色块序号
      this.maxCB; //屏幕最多色块数目
      this.correctTime;//判定正确的最大容错时间
      this.CBDis;//色块生成的距离间隔
      this.tempButtonIndex;//暂时存储按钮的位置,用作的判断

      //对象池，为了加快生成的效率
      this.CB1Pool = new cc.NodePool('ColorBlockPrefab');
      this.CB2Pool = new cc.NodePool('ColorBlockPrefab');
      this.CB3Pool = new cc.NodePool('ColorBlockPrefab');
      let initCount = 18;
      for(let i = 0;i < initCount;i++){
         let CB1 = cc.instantiate(this.color1Prefab);
         let CB2 = cc.instantiate(this.color2Prefab);
         let CB3 = cc.instantiate(this.color3Prefab);
         this.CB1Pool.put(CB1);
         this.CB2Pool.put(CB2);
         this.CB3Pool.put(CB3);
      }
   },

   start() {
      // 开始延时
      var delay = 1.1;
      this.schedule(function () {
         this.leftPrefabIndex = (this.g++) % 3;
      },delay);
       //分数变量初始化
       recorder.Score = 0;
       recorder.Combo = 0;
       recorder.Miss = 0;
       recorder.All = 0;
       //预制资源数列初始化
       this.prefabArr[0] = this.CB1Pool;
       this.prefabArr[1] = this.CB2Pool;
       this.prefabArr[2] = this.CB3Pool;
       //为了方便判定一开始就让红色显示
       this.LeftGreenLed.zIndex = -1;
       this.LeftRedLed.zIndex = 1;
       //参数调整
       this.maxCB = 15;
       //判断为miss的时间（色块前端经过判定区的时间）
       this.correctTime = 7;
       this.CBDis = -84;
       leftinfo.leftSpeed = 380;
       //测试随机生成色块
       this.spawnNewCb();
   },

   //判断色块与按钮位置能否对应
   update(dt) {
      if (this.locArr[this.locIndex].y < this.CBDis) {
         this.spawnNewCb();
      }
      this.judgeIndex = (this.locIndex + 2) % this.maxCB;
      //cc.log(judgeIndex);
      if (this.locArr[this.judgeIndex] != null) {
         if (this.locArr[this.judgeIndex].y < -1242 && this.locArr[this.judgeIndex].y > -1294) {
            this.startJudge = true;
            if (this.startJudge == true) {
               //cc.log(redTime);
               if (this.redTime <= this.correctTime && this.comboFlag == false) {
                  //增加combo
                  recorder.Combo++;
                  //增加总数（miss时不清零）
                  recorder.All +=2;
                  cc.log(recorder.All);
                  //增加分数
                  recorder.Score +=(this.Combo + 2);
                  this.comboFlag = true;
                  //recorder.Score += 2 * recorder.Combo; 
               } else if (this.redTime > this.correctTime && this.missFlag == false) {
                  recorder.Combo = 0;
                  //alert("here" + redTime + missFlag);
                  recorder.Miss++;
                  this.missFlag = true;
               }
               if (this.colorArr[this.judgeIndex] == leftinfo.leftButtonIndex) {//判定正确的情况
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
         }
      }
   },
});
module.exports = leftinfo;
