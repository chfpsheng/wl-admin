<template>
  <div class="weight-chart-container">
    <div class="header">
      <slot name="header-left" />
      <div class="label">建议体重</div>
    </div>
    <div id="weightChart" :style="{ height: height + 'px' }"></div>
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

export default {
  name: "WeightChart",
  props: {
    height: {
      type: Number,
      default: 500
    },
    // 建议体重最小值
    minData: {
      type: Array,
      default: () => []
    },
    // 建议体重最大值
    maxData: {
      type: Array,
      default: () => []
    },
    // 实际体重
    recordData: {
      type: Array,
      default: () => []
    },
    // 横坐标起始点
    startValue: {
      type: Number,
      default: 0
    },
    // 横坐标结束点
    endValue: {
      type: Number,
      default: 6
    },
    // 纵坐标起始点
    min: {
      type: Number,
      default: 0
    },
    // 纵坐标结束点
    max: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      option: null //图表参数
    };
  },
  computed: {
    dValueList() { // 差值列表
      const list = this.maxData.map((item, index) => {
        item = item === null ? null : item - this.minData[index]
        if(item) {
          item = Number(item.toFixed(2))
        }
        return item
      })
      return list
    }
  },
  created() {},
  mounted() {
    // console.log(21111, 'max', this.maxData)
    // console.log(21111, 'min', this.minData)
    // console.log(21111, 'a', this.recordData)
    let chartDom = document.getElementById("weightChart");
    let myChart = echarts.init(chartDom);
    this.option = {
      title: {
        // text: "体重曲线",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "cross",
          label: {
            backgroundColor: "#F26334"
          }
        },
        formatter: function(params) {
        	let str = '';
          let max = '';
          let min = '';
          let real = '';
        	params.forEach((item, index) => {
            if(item.seriesName === '建议最大值' && item) {
              // console.log(99999, item.seriesName, item.data, params[params.length - 2].data)
              max = item.data + params[params.length - 2].data
              max = max.toFixed(2)
              //str += `${item.marker}${item.seriesName}: ${max}`
            } else if (item.seriesName === '实际值' && item) {
              real = item.data[1]
              str += '<div class="real" style="font-size:14px;color:#fff">' + real + '</div>' 
              //str += `${item.marker}${item.seriesName}: ${item.data[1]}`
            } else {
              min = item.data
              //str += `${item.marker}${item.seriesName}: ${item.data}`
            }
            
            if(max && min){
              str += '<div style="font-size:12px;color:#fff">建议：' + min +  "-" + max + 'kg' + '</div>' 
            }
        		// str += index === params.length -1? '': '<br/>'
        	})
        	return '<div style="padding:9px;background: #666666;box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.25);margin:-12px">' + str + '</div>'
        }
      },
      grid: {
        top: "24px",
        left: "10px",
        right: "16px",
        bottom: "16px",
        containLabel: true
      },
      xAxis: [
        {
          type: "category",
          splitLine: { show: true },
          boundaryGap: false,
          axisTick: { // y轴刻度线
            show: false
          },
          axisLine: { // y轴
            show: false
          },
          data: [
            "3周",
            "4周",
            "5周",
            "6周",
            "7周",
            "8周",
            "9周",
            "10周",
            "11周",
            "12周",
            "13周",
            "14周",
            "15周",
            "16周",
            "17周",
            "18周",
            "19周",
            "20周",
            "21周",
            "22周",
            "23周",
            "24周",
            "25周",
            "26周",
            "27周",
            "28周",
            "29周",
            "30周",
            "31周",
            "32周",
            "33周",
            "34周",
            "35周",
            "36周",
            "37周",
            "38周",
            "39周",
            "40周"
          ]
        }
      ],
      yAxis: [
        {
          show: true,
          type: "value",
          splitLine: { show: true },
          min: this.min,
          max: this.max,
          axisLabel: {
            formatter: "{value} kg"
          },
          axisTick: {
            inside: false,
            show: false
          },
        }
      ],
      dataZoom: [
        {
          type: "inside",
          realtime: true, //拖动滚动条时是否动态的更新图表数据
          // start: 10, //滚动条开始位置（共100等份）
          // end: 65, //结束位置（共100等份）
          zoomLock: true,
          startValue: this.startValue,
          endValue: this.endValue
        }
      ],
      series: [
        {
          name: "实际值",
          stack: 'actual',
          type: "line",
          symbol: "circle",
          symbolSize: 4,
          lineStyle: {
            width: 1,
            color: "#f26334"
          },
          itemStyle: {
            normal: {
              color: "#f26334",
              borderColor: "#f26334"
            }
          },
          data: this.recordData
        },
        {
          name: "建议最小值",
          stack: 'reference',
          type: "line",
          smooth: 0.6,
          symbol: "none",
          lineStyle: {
            opacity: 0  //隐藏线
          },
          areaStyle: {
            opacity: 0
          },
          data: this.minData
        },
        {
          name: "建议最大值", // 这个不能改  祖传的
          type: "line",
          stack: 'reference',
          smooth: 0.6,
          symbol: "none",
          lineStyle: {
            opacity: 0 // 隐藏线
          },
          areaStyle: {
            color: "rgba(242,99,52,0.2)" // 上限区域  
          },
          emphasis: {
            focus: "series"
          },
          // data: this.maxData
          data: this.dValueList
        }
      ]
    };
    console.log("this.startValue", this.startValue, this.endValue);
    this.option.dataZoom.startValue = this.startValue;
    this.option.dataZoom.endValue = this.endValue;
    this.option && myChart.setOption(this.option);
  }
};
</script>
<style lang="scss" scoped>
.weight-chart-container {
  height: inherit;
  .header {
    display: flex;
    justify-content: space-between;
    .label {
      display: flex;
      align-items: center;
      height: 17px;
      font-size: 12px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #666666;
      line-height: 17px;
      &::before {
        content: "";
        background-color: #f26334;
        width: 12px;
        height: 4px;
        border-radius: 3px;
        display: inline-block;
        margin-right: 5px;
      }
    }
  }
}
#weightChart {
  height: inherit;
  width: inherit;
}

::v-deep .tip-cnt{
  background-color: #333333;
}

::v-deep .commend{
  font-size: 12px;
  color: red;
}

::v-deep .real{

}


</style>
