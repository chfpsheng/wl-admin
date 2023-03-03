<template>
  <div
    ref="chart"
    class="chart"
    id="main"
    :class="changeClass()"
  ></div>
</template>
<script>
import * as echarts from 'echarts'
import resize from '@/mixins/chartReset'
export default {
  props: {
    labelList: {
      type: Array,
      default: () => [],
    },
    gestationInfo: {
      type: Object,
      default: () => {},
    },
  },
  mixins: [resize],
  data() {
    return {
      chart: null,
      // PS: 值顺序为 横坐标 纵坐标  颜色  半径 label名称
      showData: [
        [76, 72, '#F5A5C1'],
        [31, 58, '#72AAF6'],
        [34, 76, '#CF8BF3'],
        [71, 62, '#F1C15A'],
        [93, 66, '#65E5B7'],

        [20, 64, '#F1C15A'],
        [85, 63, '#72AAF6'],
        [28, 40, '#F5A5C1'],
        [90, 79, '#CF8BF3'],
        [12, 79, '#65E6B7'],

        [68, 78, '#F5A5C1'],
        [8, 64, '#72AAF6'],
        [70, 40, '#F1C15A'],
        [11, 46, '#CF8BF3'],
        [81, 45, '#65E5B7'],

        [21, 55, '#F1C15A'],
        [76, 53, '#72AAF6'],
        [20, 75, '#F5A5C1'],
        [94, 55, '#CF8BF3'],
        [30, 68, '#65E6B7'],
      ],
    }
  },
  watch: {
    labelList: {
      handler: function (val) {
        if (val) {
          this.chartInit()
        }
      },
      deep: true,
    },
  },
  methods: {
    changeClass() {
      // classOne  未怀孕 | classTwo 孕早期  | classZero 孕中期 | classThree 孕后期
      if (this.gestationInfo?.status === 0) {
        return 'classOne'
      }
      if (this.gestationInfo?.status === 1) {
        return 'classTwo'
      }
      if (this.gestationInfo?.status === 2) {
        return 'classZero'
      }
      if (this.gestationInfo?.status === 3) {
        return 'classThree'
      }
      if (!this.gestationInfo?.status) {
        return 'classOne'
      }
    },
    chartInit() {
      var option
      // 如果标签大于20，也只取前20位
      var showList = []
      if (this.labelList.length >= 20) {
        showList = this.labelList.slice(0, 20)
      }else{
        showList = this.labelList
      }
      const chartData = showList?.map((item, index) => {
        const itemOption = this.showData[index]
        const itemStyle = {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            {
              offset: 0,
              color: '#FFF',
            },
            {
              offset: 1,
              color: item.weight >= 0 ? itemOption[2] : '#3C3D45',
            },
          ]),
        }
        const label = {
          color: item.weight >= 0 ? itemOption[2] : '#3C3D45',
          fontSize: Math.max(Math.abs(item.weight) * 0.66 + 62, 70) / 6,
          lineHeight: Math.max(Math.abs(item.weight) * 0.66 + 62, 70) / 5,
        }
        return {
          itemStyle,
          label,
          name: item.labelName,
          value: [itemOption[0], itemOption[1]],
          symbolSize: Math.max(Math.abs(item.weight) * 0.66 + 62, 70),
        }
      })
      ;(option = {
        grid: {
          left: '8%',
          top: '10%',
        },
        xAxis: {
          show: false,
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          max: 100,
          min: 0,
        },
        yAxis: {
          show: false,
          splitLine: {
            lineStyle: {
              type: 'dashed',
            },
          },
          max: 80,
          min: 30,
          scale: true,
        },
        series: [
          {
            data: chartData,
            type: 'scatter',
            emphasis: {
              focus: 'series',
              label: {
                normal: {
                  show: true,
                  formatter: function (param) {
                    const name = params.name
                    if (name) {
                      if (
                        name.length > 3 &&
                        name.length < 8 &&
                        name.length != 4
                      ) {
                        const str = name.slice(0, 3) + '\n' + name.slice(3, 7)
                        return str
                      } else if (name.length > 7) {
                        const str =
                          name.slice(0, 3) +
                          '\n' +
                          name.slice(3, 7) +
                          '\n' +
                          name.slice(7, 10)
                        return str
                      } else {
                        return name
                      }
                    } else {
                      return ''
                    }
                  },
                },
              },
            },
            itemStyle: {
              // shadowBlur: 10,
              // shadowColor: 'rgba(120,36,50,1)',
              shadowOffsetY: 0,
            },
            label: {
              normal: {
                show: true,
                formatter: (params) => {
                  const name = params.name
                  if (name) {
                    if (
                      name.length > 3 &&
                      name.length < 8 &&
                      name.length != 4
                    ) {
                      const str = name.slice(0, 3) + '\n' + name.slice(3, 7)
                      return str
                    } else if (name.length > 7) {
                      const str =
                        name.slice(0, 3) +
                        '\n' +
                        name.slice(3, 7) +
                        '\n' +
                        name.slice(7, 10)
                      return str
                    } else {
                      return name
                    }
                  } else {
                    return ''
                  }
                },
              },
            },
          },
        ],
      }),
        option && this.chart.setOption(option)
      // 此处可以监听到对应的点击Label
       this.chart.on('click', function (params) {})
    },
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart)
    this.chartInit()
  },
}
</script>

<style lang="scss" scoped>
.chart {
  height: 100%;
}
.classOne {
  background: url('../../assets/image/001.png') no-repeat center !important; /*注意：最高权重必须要给，不然样式会被覆盖掉*/
}
.classZero {
  background: url('../../assets/image/004.png') no-repeat center !important; /*注意：最高权重必须要给，不然样式会被覆盖掉*/
}
.classTwo {
  background: url('../../assets/image/002.png') no-repeat center !important; /*注意：最高权重必须要给，不然样式会被覆盖掉*/
}
.classThree {
  background: url('../../assets/image/003.png') no-repeat center !important; /*注意：最高权重必须要给，不然样式会被覆盖掉*/
}
</style>
