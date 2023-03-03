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
          <div
            class="content-box"
            :class="report.weightGrowRate === 2 ? 'high' : (report.weightGrowRate === 3 ? 'low' : '')"
          >
            <div class="content">
              <div>体重增长</div>
              <div class="text">{{report.weightGrowRate | growRate}}</div>
            </div>
            <i class="bubble"></i>
            <i class="bubble bubble1"></i>
            <i class="bubble bubble2"></i>
          </div>
        </div>
        <div class="static health-outer">
          <div class="inner">
            <div class="item">
              <div class="text">
                <span>{{grow.alreadyAddWeight}}</span>
                <b>kg</b>
                <i class="icon-grow" :class="grow.alreadyAddWeight > 0 ? '' : 'drop' " v-show="grow.alreadyAddWeight"></i>
              </div>
              <div>孕期体重增长</div>
            </div>
            <div class="item">
              <div class="text" v-if="grow.minGrowRate && grow.maxGrowRate">
                <span>{{grow.minGrowRate}} - {{grow.maxGrowRate}}</span>
                <b>kg</b>
                <i class="icon">周</i>
              </div>
              <div class="tip" v-else>
                暂无
              </div>
              <div>建议增重速率</div>
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
        <!-- 体重曲线 -->
        <div class="report health-outer">
          <div class="inner">
            <div class="toper">
              <div class="cate-title">
                <i class="icon"></i>
                <span>
                  <b>体重曲线</b>
                  <i class="icon-shadow"></i>
                </span>
              </div>
            </div>
            <div class="chart-container" v-show="isExist">
              <div class="guide">
                <i></i>
                <span>建议体重</span>
              </div>
              <!-- 曲线图 -->
              <div id="weightLine" style="width: 325px; height: 250px;"></div>
            </div>
            <div class="empty" v-show="!isExist">
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
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from "echarts/core";
// 引入折线图图表，图表后缀都为 Chart
import { LineChart } from "echarts/charts";
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  DatasetComponentOption,
  TransformComponent,
  DataZoomComponent
} from "echarts/components";
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from "echarts/features";
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from "echarts/renderers";

// 注册必须的组件
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
  DataZoomComponent
]);
import { getReport, weightQueryLinechart, getDays } from '@/api/patient'
import { querynearweightinfo} from '@/api/weight'
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
    // 预产期
    expectedDate: {
      type: String,
      default: ''
    },
    dlgVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isExist: false,
      report: {
        managerSuggestion: []
      },
      grow: {
        alreadyAddWeight: 0,
        minGrowRate: 0,
        maxGrowRate: 0
      }, // 体重增长信息
      cookbookList: [] // 食谱建议
    };
  },
  computed: {

  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init () {
      this.getReport()
    },

    // 获取报告详情
    async getReport () {
      await getReport(this.reportId).then(res => {
        this.report = res.data || {}
        this.getResult(this.report.reportStartTime, this.report.reportEndTime)
        this.getStartWeek(this.report.reportStartTime, this.report.reportEndTime)
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
      await querynearweightinfo({
        patientId: this.patientId,
        beginTime: beginTime,
        endTime: endTime
      }).then(res => {
        this.grow = res.data || null
      })
    },

    // 获取起始孕周
    getStartWeek (startTime, endTime) {
      // 预产期
      if (this.expectedDate) {
        getDays({
          pregnancyDate: this.expectedDate, // 预产期
          recordDate: startTime // 测量时间
        }).then(res => {
          this.getWeightLine(startTime, endTime, res.data.week)
        })
      } else {
        this.getWeightLine(startTime, endTime)
      }
    },

    // 获取血糖分析结果
    async getWeightLine(startTime, endTime, startWeek) {
      await weightQueryLinechart({
        patientId: this.patientId,
        startTime: startTime,
        endTime: endTime
      }).then(res => {
        this.$nextTick(() => {
          this.$nextTick(() => {
            let chartDom = document.getElementById('weightLine')
            let chart = echarts.init(chartDom)
            this.isExist = res.data
            let weekList = []
            let maxList = []
            let minList = []
            let weightList = []
            let dataList = []
            let diffList = []
            // 最大值
            for (let item of res.data.maxList) {
              if (item.week <= 40) {
                weekList.push(item.week + '周')
                maxList.push(item.weight || '')
              }
            }
            // 最小值
            for (let item of res.data.minList) {
              if (item.week <= 40) {
                minList.push(item.weight || '')
              }
            }
            // 实际值
            for (let item of res.data.patientWeightList) {
              if (item.week <= 40) {
                weightList.push(item.weight || '')
                if (item.weight) {
                  dataList.push([item.week - 3, item.weight])
                }
              }
            }
            // 最大 - 最小
            diffList = maxList.map((item, index) => {
              item = item === null ? null : item - minList[index]
              if(item) {
                item = Number(item.toFixed(2))
              }
              return item
            })
            // 孕周信息 --- 计算横轴起始位置
            let startX = startWeek - 3 || 0
            startX = startX > 0 ? startX : 0
            // 实际体重过滤掉不存在的值
            let weights = weightList.filter(item => {
              return item
            })
            // 合并三个数组(所有体重数据)
            let allList = [...minList, ...maxList, ...weights]
            // 体重最大值和最小值
            let minY = Math.floor(Math.min(...allList)) - 2
            let maxY =  Math.ceil(Math.max(...allList)) + 2
            minY = minY > 0 ? minY : 0
            let option = {
              tooltip: {
                trigger: 'axis',
                position: function (point, params, dom, rect, size) {
                  // 鼠标坐标和提示框位置的参考坐标系是：以外层div的左上角那一点为原点，x轴向右，y轴向下
                  // 提示框位置
                  var x = 0 // x坐标位置
                  var y = 0 // y坐标位置
                  // 当前鼠标位置
                  var pointX = point[0]
                  var pointY = point[1]
                  // 外层div大小
                  // var viewWidth = size.viewSize[0];
                  // var viewHeight = size.viewSize[1];
                  // 提示框大小
                  var boxWidth = size.contentSize[0]
                  var boxHeight = size.contentSize[1]
                  // boxWidth > pointX 说明鼠标左边放不下提示框
                  if (boxWidth > pointX) {
                    x = 5 // 自己定个x坐标值，以防出屏
                    y -= 15 // 防止点被覆盖住，可根据情况自行调节 
                  } else { // 左边放的下
                    x = pointX - boxWidth - 15
                  }
                  // boxHeight > pointY 说明鼠标上边放不下提示框
                  if (boxHeight + 20 > pointY) {
                    y = pointY + 15
                  } else if (boxHeight > pointY) {
                    y = 5
                  } else { // 上边放得下
                    y += pointY - boxHeight
                  }
                  return [x, y]
                },
                formatter: (param) => {
                  let str = ''
                  // 存在当前体重
                  if (param.length === 3) {
                    // 存在建议体重
                    if (param[1].value && param[2].value) {
                      str = `<div class="line-tooltip">
                        <div class="current">${param[0].value[1]}<i>kg</i></div>
                        <div class="content">
                          <div>建议体重</div>
                          <div>${param[1].value}-${(param[1].value + param[2].value).toFixed(2)}<i>kg</i></div>
                        </div>
                      </div>`
                    } else {
                      str = `<div class="line-tooltip">
                        <div class="current">${param[0].value[1]}<i>kg</i></div>
                        <div class="content">
                          <div>暂无增重建议</div>
                        </div>
                      </div>`
                    }
                  } else { // 不存在当前值
                    // 存在建议体重
                    if (param[0].value && param[1].value) {
                      str = `<div class="line-tooltip">
                        <div class="content">
                          <div>建议体重</div>
                          <div>${param[0].value}-${(param[0].value + param[1].value).toFixed(2)}<i>kg</i></div>
                        </div>
                      </div>`
                    }
                  }
                  return str
                }
              },
              grid: {
                left: '0%',
                right: '4%',
                top: '7%',
                bottom: '5%',
                containLabel: true,
              },
              xAxis: [
                {
                  type: 'category',
                  boundaryGap: false,
                  splitLine: { //网格线
                    lineStyle: {
                      type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线
                    },
                    show: true //隐藏或显示
                  },
                  axisLabel: {
                    show: true,
                    axisName: {
                      color: '#666',
                      fontSize : 12
                    }
                  },
                  data: weekList
                },
              ],
              yAxis: [
                {
                  show: true,
                  type: 'value',
                  min : minY,
                  max : maxY,
                  splitNumber : 8,
                  axisLabel: {
                    formatter: '{value}kg',
                    axisName: {
                      color: '#666',
                      fontSize : 12
                    }
                  },
                  splitLine: { //网格线
                    lineStyle: {
                      type: 'dashed' //设置网格线类型 dotted：虚线 solid:实线
                    },
                    show: true //隐藏或显示
                  },
                  data: []
                }
              ],
              dataZoom: [
                {
                  type: 'inside',
                  throttle: 50,
                  realtime: true, //拖动滚动条时是否动态的更新图表数据
                  zoomLock: true,
                  moveOnMouseMove: true,
                  preventDefaultMouseMove: false,
                  zoomOnMouseWheel: false,
                  startValue: startX, // 数据窗口范围的起始数值 
                  endValue: startX + 6 // 数据窗口范围的结束数值。 
                }
              ],
              series: [
                {
                  name: '实际值',
                  type: 'line',
                  smooth: 0.8,
                  stack: 'actual',
                  lineStyle: {
                    color: '#876eff',
                    width: 1
                  },
                  itemStyle: {
                    color: '#876eff',
                  },
                  data: dataList
                },
                {
                  name: '建议最小值',
                  type: 'line',
                  smooth: 0.6,
                  symbol: 'none',
                  stack: 'reference',
                  lineStyle: {
                    opacity: 0
                  }, //隐藏线
                  areaStyle: {
                    opacity: 0
                  }, // 下限区域
                  data: minList
                },
                {
                  name: '建议最大值',
                  type: 'line',
                  smooth: 0.6,
                  symbol: 'none',
                  stack: 'reference',
                  lineStyle: {
                    opacity: 0
                  }, // 隐藏线
                  areaStyle: {
                    color: 'rgba(224,160,254,0.3)'
                  },
                  emphasis: {
                    focus: "series"
                  },
                  data: diffList
                }
              ]
            }
            chart.setOption(option)
          })
        })
      })
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
  background: linear-gradient(132deg, rgba(255, 213, 220, 0.3), rgba(135, 110, 255, 0.5) 97%);
  padding-bottom: 32px;
  min-height: 70vh;
  max-height: 70vh;
  overflow-y: scroll;
}
.header{
  background: url(../../../assets/image/weight-detail-bg.png) no-repeat center center;
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
  width: 115px;
  height: 115px;
  background: linear-gradient(180deg,rgba(255,255,255,0.35), rgba(255,255,255,0.35));
  border-radius: 50%;
  margin: -176px auto 0;
}
.process .content-box{
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: url(../../../assets/image/icon-report.png) no-repeat center center;
  background-size: 100% 100%;
  margin-left: -12px;
  transform: translateY(-12px);
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
  bottom: 28px;
}
.process .content-box .bubble.bubble1{
  width: 2px;
  height: 2px;
  left: 44%;
  bottom: 35px;
}
.process .content-box .bubble.bubble2{
  width: 3px;
  height: 3px;
  left: 70%;
  top: 76px;
}
.process .content{
  text-align: center;
  color: #fff;
  padding-top: 42px;
}
.process .content-box.low{
  background: url(../../../assets/image/icon-report-low.png) no-repeat center center;
  background-size: 100% 100%;
}
.process .content-box.high{
  background: url(../../../assets/image/icon-report-high.png) no-repeat center center;
  background-size: 100% 100%;
}
.process .content .text{
  font-size: 22px;
  margin-top: 2px;
  line-height: 35px;
  font-weight: 500;
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
}
.static .item .text b{
  font-size: 12px;
}
.static .item .tip{
  color: #333;
  font-size: 15px;
  line-height: 26px;
}
.static .item .text .icon{
  display: inline-block;
  width: 16px;
  height: 16px;
  background: url(../../../assets/image/icon-report-week.png) no-repeat center center;
  background-size: 100% 100%;
  margin-left: 4px;
  vertical-align: calc(4px);
  font-size: 10px;
  color: #fff;
  line-height: 16px;
  text-align: center;
}
/* 增长箭头 */
.icon-grow{
  display: inline-block;
  width: 18px;
  height: 16px;
  background: url(../../../assets/image/icon-grow-up.png) no-repeat center center;
  background-size: 100% 100%;
  position: relative;
  top: 0.04px;
}
.icon-grow.drop{
  background: url(../../../assets/image/icon-grow-down.png) no-repeat center center;
  background-size: 100% 100%;
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
  background: url(../../../assets/image/icon-weight.png) no-repeat center center;
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
.report .chart-container .guide{
  font-size: 12px;
  color: #666;
}
.report .chart-container .guide i{
  display: inline-block;
  width: 13px;
  height: 12px;
  background: linear-gradient(135deg,#f6e6fe, #fcf5ff);
  vertical-align: calc(-1px);
  margin-right: 6px;
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
