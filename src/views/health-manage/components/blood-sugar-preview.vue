<template>
  <div class="app-cnt">
    <el-dialog
      v-if="dlgVisible"
      class="label-dlg"
      title="预览报告"
      width="375px"
      :visible="dlgVisible"
      :append-to-body="true"
      @close="closeDlg"
    >
      <div class="blood-report">
        <div class="header">
          <div class="top">
            <div>
              <div class="title">{{report.reportName}}</div>
              <div class="date" v-show="report.reportStartTime">
                {{$dayjs(report.reportStartTime).format('YYYY.MM.DD')}} - {{$dayjs(report.reportEndTime).format('YYYY.MM.DD')}}
              </div>
            </div>
          </div>
        </div>
        <div class="process">
          <div class="content-box">
            <div class="content">
              <div>达标率</div>
              <div class="text">{{(analysis.minRatio * 100  || 0).toFixed(0)}}<i>%</i></div>
            </div>
            <i class="bubble"></i>
            <i class="bubble bubble1"></i>
            <i class="bubble bubble2"></i>
          </div>
        </div>
        <div class="static health-outer">
          <div class="inner">
            <div class="item">
              <div class="text">{{analysis.count || 0}}</div>
              <div>总记录次数</div>
            </div>
            <div class="item">
              <div class="text">{{analysis.lowCount || 0}}</div>
              <div>偏低次数</div>
            </div>
            <div class="item">
              <div class="text">{{analysis.highCount || 0}}</div>
              <div>偏高次数</div>
            </div>
            <div class="item">
              <div class="text">
                <span>{{analysis.averageTotal || 0}}</span>
                <!-- <i>mmol/L</i> -->
              </div>
              <div>平均血糖</div>
            </div>
          </div>
        </div>
        <!-- 相关建议 -->
        <div class="related health-outer" v-show="report.managerSuggestion.length">
          <div class="inner">
            <div class="cate-title">
              <i class="icon"></i>
              <span>
                <b>相关建议</b>
                <i class="icon-shadow"></i>
              </span>
            </div>
            <div class="item" v-for="(item, index) in report.managerSuggestion" :key="index">
              <span class="icon">
                <i></i>
              </span>
              <div class="content">{{item}}</div>
            </div>
          </div>
        </div>
        <!-- 食谱建议 -->
        <div class="cookbook health-outer" v-show="cookbookList.length">
          <div class="inner">
            <div class="cate-title">
              <i class="icon"></i>
              <span>
                <b>食谱建议</b>
                <i class="icon-shadow"></i>
              </span>
            </div>
            <el-carousel class="cookbook-swipe" :interval="5000">
              <el-carousel-item v-for="(item, index) in cookbookList" :key="index">
                <div class="title">
                  <span class="name">血糖管理食谱</span>
                  <span class="week">周{{item.week | weekTitle}}</span>
                </div>
                <div
                  class="food-item"
                  v-for="(food, index) in item.feeds"
                  :key="index"
                  :class="'food-item-' + food.freCode"
                >
                  <div class="name">
                    <span>{{food.freCode | foodType}}</span>
                    <div class="clock">
                      <span></span>
                      <i></i>
                    </div>
                  </div>
                  <div class="content">{{food.content}}</div>
                </div>
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
        <!-- 血糖表 -->
        <div class="report health-outer">
          <div class="inner">
            <div class="toper">
              <div class="cate-title">
                <i class="icon"></i>
                <span>
                  <b>血糖表</b>
                  <i class="icon-shadow"></i>
                </span>
              </div>
            </div>
            <table class="blood-table" v-if="tableList.length">
              <thead>
                <tr>
                  <th rowspan="2">日期</th>
                  <th class="cross" rowspan="2">凌晨</th>
                  <th colspan="2">早餐</th>
                  <th class="cross" colspan="2">午餐</th>
                  <th colspan="2">晚餐</th>
                  <th class="cross" rowspan="2">睡前</th>
                </tr>
                <tr>
                  <th>前</th>
                  <th>后</th>
                  <th class="cross">前</th>
                  <th class="cross">后</th>
                  <th>前</th>
                  <th>后</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableList" :key="index">
                  <td>{{item.recordTime}}</td>
                  <td
                    v-for="type in types"
                    :key="type"
                    :class="calcRange(item[type])"
                    @click="onRange(item[type], type + index)"
                  >
                    {{item[type] && item[type].sugarValue.toFixed(1)}}
                    <div
                      v-if="item[type]"
                      class="range-box"
                      :class="type + index"
                    >
                      <span>{{type | bloodType}}</span>
                      <span>{{item[type] && item[type].sugarDesc}}</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="blood-table-footer" v-if="tableList.length">
              <span><i></i>正常</span>
              <span><i class="low"></i>偏低</span>
              <span><i class="high"></i>偏高</span>
            </div>
            <div class="empty" v-if="!tableList.length">
              <img src="@/assets/image/health-report-empty.png" alt="">
              <div>暂无数据</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getReport, queryBloodAnalaysis, getBloodTable } from '@/api/patient'
export default {
  name: "LabelSelect",
  props: {
    // 患者id
    patientId: {
      type: Number,
      default: ''
    },
    // 报告id
    reportId: {
      type: Number,
      default: ''
    },
    dlgVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      report: {
        managerSuggestion: []
      },
      analysis: {}, // 分析详情
      types: [
        'BEFORE_DAWM', 'BEFORE_BREAKFAST', 'AFTER_BREAKFAST', 'BEFORE_LUNCH',
        'AFTER_LUNCH', 'BEFORE_DINNER', 'AFTER_DINNER', 'BEFORE_SLEEP'
      ], // 血糖类型键集合
      cookbookList: [], // 食谱建议
      tableList: []
    }
  },
  computed: {

  },
  created() {
    this.init()
  },
  mounted() {},
  methods: {
    init () {
      this.getReport()
    },

    // 获取报告详情
    async getReport () {
      await getReport(this.reportId).then(res => {
        this.report = res.data || {}
        this.getTableList(this.report.reportStartTime, this.report.reportEndTime)
        this.getResult(this.report.reportStartTime, this.report.reportEndTime)
        // 相关建议
        let suggestions = this.report.managerSuggestion ? this.report.managerSuggestion.split(/[\r\n]+/) : []
        this.report.managerSuggestion = suggestions.filter(item => {
          return item !== ''
        })
        // 食谱建议
        const foods = this.report.suggestionList || []
        // 星期集合
        const weeks = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
        let list = []
        for (let i = 0; i < weeks.length; i++) {
          // 某天的食谱集合
          let feeds = []
          for (let item of foods) {
            feeds.push({
              freCode: item.freCode, // 餐类型
              content: item[weeks[i]] || '' // 餐明细
            })
          }
          let isDayEmpty = false // 某天食谱是否为空
          for (let j of feeds) {
            if (j.content) {
              isDayEmpty = true
              break
            }
          }
          // 只有某天食谱不为空，才加入星期列表
          if (isDayEmpty) {
            list.push({
              week: i,
              feeds: feeds
            })
          }
        }
        this.cookbookList = list
      })
    },

    // 获取血糖分析结果
    async getResult(beginTime, endTime) {
      await queryBloodAnalaysis({
        patientId: this.patientId,
        beginTime: beginTime,
        endTime: endTime
      }).then(res => {
        this.analysis = res.data || null;
      });
    },

    // 获取血糖表数据
    async getTableList(beginTime, endTime) {
      let query = {
        pageNo: 1,
        pageSize: 7,
        patientId: this.patientId,
        beginTime: beginTime,
        endTime: endTime,
      }
      await getBloodTable(query).then(res => {
        let blood = res.data.rows[0] || {}
        let list = []
        // 遍历对象
        for (let key in blood) {
          let obj = {}
          for (let item of blood[key]) {
            obj[item.sugarType] = item // 血糖类型对象
          }
          obj.recordTime = this.$dayjs(key).format('MM.DD') // 记录时间
          list.push(obj)
        }
        this.tableList = list
        // 循环是否终止
        let isStop = false
        for (let i = 0; i < this.tableList.length; i++) {
          if (!isStop) {
            for (let item of this.types) {
              if (this.tableList[i][item]) {
                // 找出血糖第一条记录
                let className = `${item}${i}`
                // 显示血糖建议tooltips
                this.$nextTick(() => {
                  let dom = document.getElementsByClassName(className)[0]
                  dom.style.display = 'block'
                })
                isStop = true 
                break
              }
            }
          }
        }
      })
    },

    // 打开血糖范围
    onRange (option, className) {
      let boxs = document.querySelectorAll('.range-box')
      // step1，隐藏所有小弹框，除当前元素
      for (let item of boxs) {
        if (item.className.indexOf(className) === -1) {
          item.style.display = 'none'
        }
      }
      if (!option) {
        return
      }
      let dom = document.getElementsByClassName(className)[0]
      // 隐藏->打开，打开->隐藏
      if (!dom.style.display || dom.style.display === 'none') {
        dom.style.display = 'block'
      } else {
        dom.style.display = 'none'
      }
    },
    
    // 血糖状态
    calcRange (option) {
      if (!option) {
        return
      } else {
        if (option.sugarRange === 'HIGH') {
          return 'high'
        } else if (option.sugarRange === 'LOW') {
          return 'low'
        } else {
          return ''
        }
      }
    },

    closeDlg(){
      this.$emit("closeDlg");
    }
  }
};
</script>
<style lang="scss" scoped>
 .label-dlg ::v-deep .el-dialog .el-dialog__body{
    padding:0px;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}

/* 滚动槽 */
::-webkit-scrollbar-track {
  border-radius: 10px;
}

/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
.health-outer{
  background: rgba(255, 255, 255, 0.6);
  border-radius: 5px;
  padding: 5px;
  box-shadow: 2px 3px 8px 0 rgba(43,27,89,0.10);
}
.health-outer .inner{
  background: #fff;
  border-radius: 10px;
}
.blood-report{
  background: linear-gradient(132deg, rgba(240, 204, 210, 0.5), rgba(213, 164, 224, 0.5) 97%);
  padding-bottom: 32px;
  min-height: 70vh;
  max-height: 70vh;
  overflow-y: scroll;
}
.header{
  background: url(../../../assets/image/blood-detail-bg.png) no-repeat center center;
  background-size: 100% 100%;
  height: 238px;
}
.header .top{
  display: flex;
  justify-content: space-between;
  padding: 15px 0 0 15px;
  color: #fff;
  font-size: 12px;
}
.header .top .title{
  font-size: 16px;
  line-height: 22px;
  font-weight: 500;
}
.process{
  width: 120px;
  height: 120px;
  background: linear-gradient(180deg,rgba(255,255,255,0.35), rgba(255,255,255,0.35));
  border-radius: 50%;
  margin: -176px auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.process .content-box{
  background: linear-gradient(180deg,rgba(255,255,255,0.63), #ffffff);
  padding: 3px;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  box-shadow: 0 4px 9px 0 #bd88c9;
  position: relative;
}
.process .content-box .bubble{
  display: inline-block;
  width: 3px;
  height: 3px;
  opacity: 0.53;
  background: #ffffff;
  border-radius: 50%;
  filter: blur(1px);
  position: absolute;
  left: 49%;
  bottom: 8px;
}
.process .content-box .bubble.bubble1{
  width: 2px;
  height: 2px;
  left: 40%;
  bottom: 15px;
}
.process .content-box .bubble.bubble2{
  width: 3px;
  height: 3px;
  left: 85%;
  top: 55px;
}
.process .content{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  padding-top: 20px;
  background: url(../../../assets/image/icon-blood-report.png) no-repeat center center;
  background-size: 100% 100%;
}
.process .content .text{
  font-size: 30px;
  margin-top: 2px;
  line-height: 35px;
  font-weight: bold;
}
.process .content .text i{
  font-size: 24px;
  font-weight: 500;
  line-height: 29px;
}
.static{
  margin: 20px 10px 0;
}
.static .inner{
  padding: 15px;
  display: flex;
  background: url(../../../assets/image/report-static-bg.png) no-repeat center bottom;
  background-size: 100% 100%;
}
.static .item{
  flex: 1;
  color: #666;
  font-size: 12px;
}
.static .item .text{
  font-weight: bold;
  color: #333;
  line-height: 24px;
  font-size: 20px;
  margin-bottom: 5px;
}
.static .item .text i{
  font-size: 12px;
  line-height: 10px;
}
.related{
  margin: 15px 10px 0;
}
.related .inner{
  padding: 10px;
}
.cate-title{
  font-family: "Heiti SC", "黑体-简";
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 10px;
}
.cate-title .icon{
  display: inline-block;
  width: 19px;
  height: 18px;
  background: url(../../../assets/image/icon-inspect-common.png) no-repeat center center;
  background-size: 100% 100%;
  margin-right: 6px;
  vertical-align: bottom;
}
.cookbook .cate-title .icon{
  width: 17px;
  height: 21px;
  background: url(../../../assets/image/icon-cookbook.png) no-repeat center center;
  background-size: 100% 100%;
}
.report .cate-title .icon{
  width: 18px;
  height: 20px;
  background: url(../../../assets/image/icon-blood.png) no-repeat center center;
  background-size: 100% 100%;
}
.cate-title span{
  position: relative;
}
.cate-title span b{
  position: relative;
  z-index: 100;
  line-height: 22px;
}
.cate-title span .icon-shadow{
  display: block;
  width: 100%;
  height: 5px;
  border-radius: 2px;
  background: #EAE5FF;
  position: absolute;
  left: 0;
  bottom: 2px;
  z-index: 10;
}
.related .item{
  color: #666;
  margin-bottom: 10px;
  padding-left: 26px;
  position: relative;
}
.related .item .icon{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #DBB2E4;
  border: 3px solid #F7EDF9;
  position: absolute;
  left: 4px;
  top: 6px;
}
.related .item .content{
  line-height: 20px;
  word-break: break-word;
}
.cookbook{
  margin: 15px 10px 0;
}
.cookbook .inner{
  padding: 10px 10px 15px;
}
.cookbook .cate-title{
  margin-bottom: 8px;
}
.cookbook-swipe{
  border-radius: 5px;
  padding-bottom: 15px;
  height: 500px;
  overflow: hidden;
}
.cookbook-swipe .title{
  text-align: center;
  margin: 0 0 14px;
}
.cookbook-swipe .title .name{
  position: relative;
}
.cookbook-swipe .title .name::after{
  position: absolute;
  bottom: -5px;
  right: -9px;
  display: block;
  content: "";
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(240, 204, 211, 0.6), rgba(213, 164, 224, 0.6));
}
.cookbook-swipe .week{
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: linear-gradient(129deg, #EFCCD2, #D5A4E0);
  font-size: 10px;
  color: #fff;
  line-height: 30px;
  margin-left: 6px;
  vertical-align: bottom;
  position: relative;
}
.cookbook-swipe .week::before{
  display: block;
  content: '';
  width: 32px;
  height: 30px;
  border-radius: 50%;
  border: 1px dashed #D196FF;
  position: absolute;
  top: 0;
  right: 0;
}
.cookbook-swipe .week::after{
  display: block;
  content: '';
  width: 30px;
  height: 31px;
  border-radius: 50%;
  border: 1px dashed #fff;
  position: absolute;
  top: 0;
  right: 2px;
}
.van-swipe__track{
  height: auto;
  background: rgba(226,218,253,0.1);
}
.food-item{
  display: flex;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(219,171,255,0.25), rgba(251,229,253,0.25));
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 5px;
}
.food-item.food-item-2{
  background: linear-gradient(135deg, rgba(219,171,255,0.15), rgba(253,240,255,0.15));
}
.food-item.food-item-3{
  background: linear-gradient(135deg, rgba(198,171,255,0.25), rgba(217,179,255,0.25));
}
.food-item.food-item-4{
  background: linear-gradient(135deg, rgba(198,171,255,0.15), rgba(217,179,255,0.15));
}
.food-item.food-item-5{
  background: linear-gradient(135deg, rgba(194,171,255,0.25), rgba(174,164,255,0.25));
}
.food-item.food-item-6{
  background: linear-gradient(135deg, rgba(194,171,255,0.15), rgba(174,164,255,0.15));
}
.food-item:last-child{
  margin-bottom: 0;
}
.food-item .name{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #fff;
  text-align: center;
  line-height: 50px;
  position: relative;
}
.food-item .clock{
  position: absolute;
  line-height: 0;
  top: 31px;
  left: 1px;
  transform: rotate(225deg);
}
.food-item.food-item-2 .clock{
  top: 9px;
  left: 3px;
  transform: rotate(-45deg);
}
.food-item.food-item-3 .clock{
  top: 0;
  left: 22px;
  transform: rotate(0deg);
}
.food-item.food-item-4 .clock{
  top: 21px;
  left: 5px;
  transform: rotate(90deg);
}
.food-item.food-item-5 .clock{
  top: 44px;
  left: 22px;
  transform: rotate(180deg);
}
.food-item .clock span{
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(224,158,255,0.6), rgba(140,113,255,0.6));
}
.food-item .clock i{
  display: inline-block;
  width: 2px;
  height: 5px;
  background: #DEC7FF;
  position: absolute;
  top: 6px;
  left: 2px;
}
.food-item .content{
  width: 225px;
  font-size: 12px;
  color: #666;
  display: flex;
  align-items: center;
  word-break: break-word;
}
.report{
  margin: 15px 10px 0;
}
.report .inner{
  padding: 10px 10px 20px;
}
.report .toper{
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.report .toper .link-right{
  color: #666;
}
.report .toper .cate-title{
  margin-bottom: 0;
}
.report .empty{
  text-align: center;
  color: #999;
  padding: 35px 0 100px;
}
.report .empty img{
  width: 210px;
  margin-bottom: 10px;
}
.blood-table{
  border-collapse: collapse;
  width: 100%;
  text-align: center;
  font-size: 12px;
  border-spacing: 0;
  border-radius: 5px;
}
.blood-table td, .blood-table th{
  border: 1px solid #E9E4FD;
}
.blood-table th{
  height: 32px;
  color: #666;
  font-weight: normal;
  background: #FDF9FA;
  font-size: 10px;
}
.blood-table th.cross{
  background: #F7F1FA;
}
.blood-table td{
  height: 35px;
  width: 32px;
  font-weight: bold;
  color: #8F72F3;
  position: relative;
}
.blood-table td .range-box{
  position: absolute;
  left: 50%;
  top: -20px;
  transform: translateX(-50%);
  white-space: nowrap;
  padding: 5px 7px;
  background: linear-gradient(90deg,#dc9cff, #876eff);
  color: #fff;
  border-radius: 5px;
  font-size: 12px;
  line-height: 16px;
  display: none;
  z-index: 100;
  font-weight: 500;
}
.blood-table td .range-box>span:first-child{
  margin-right: 4px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
}
.blood-table td .range-box::after{
  display: block;
  content: '';
  width: 0;
  height: 0;
  border-width: 5px;
  border-style: solid dashed dashed dashed;
  border-color:#B386FF transparent transparent transparent;
  position: absolute;
  left: 50%;
  bottom: -9px;
  transform: translateX(-50%);
}
.blood-table td:first-child{
  font-weight: normal;
  font-size: 10px;
  color: #666;
  width: 40px;
}
.blood-table td.low{
  color: #EA3636;
  background: rgba(234, 54, 54, 0.1);
}
.blood-table td.high{
  color: #FD700C;
  background: rgba(253, 112, 12, 0.1);
}
.blood-table-footer{
  font-size: 12px;
  text-align: center;
  margin-top: 20px;
}
.blood-table-footer span{
  margin: 0 10px;
}
.blood-table-footer i{
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #8F72F3;
  border: 3px solid #D2C7F9;
  margin-right: 4px;
}
.blood-table-footer i.low{
  background: #EA3636;
  border: 3px solid #F8C2C2;
}
.blood-table-footer i.high{
  background: #FD700C;
  border: 3px solid #FED4B6;
}
::v-deep.el-carousel {
  .el-carousel__container {
    height: 485px;
  }
  .el-carousel__item:nth-child(2n) {
     background-color: #fff;
  }
  .el-carousel__item:nth-child(2n+1) {
     background-color: #fff;
  }
  .el-carousel__button{
    background-color: #876EFF;
  }
  .el-carousel__indicators--horizontal{
    bottom: -10px;
  }
}
</style>
