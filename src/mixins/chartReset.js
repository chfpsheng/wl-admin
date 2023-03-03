import {throttle} from 'lodash'
const elementResizeDetectorMaker = require("element-resize-detector");
export default {
  mounted() {
    const erd = elementResizeDetectorMaker();
    erd.listenTo(this.$refs.chart, throttle(()=> {
      // console.log('resize');
      this.resize()
    }, 100))
  },
  methods: {
    resize() {
      if(this.chart){
        this.chart.resize();
      }
    }
  }
}