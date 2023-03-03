<template>
  <el-date-picker
    v-model="selectedValue"
    :type="type"
    :placeholder="placeholder"
    class="pa-select"
    :disabled="disabled"
    :clearable="clearable"
    :format="format"
    :value-format="valueFormat"
    :picker-options="pickerOptions"
    @change="change"
    @clear="clear">
  </el-date-picker>
</template>
<script>
import { getPatientFollowPlan } from '@/api/workbench'
export default {
  name: 'FollowDatePicker',
  props: {
    value: {
      type: [String, Number, Boolean, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    type: {
      type: String,
      default: 'date'
    },
    patientId: {
      type: Number | String,
      default: ''
    },
    limitDay: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectedValue: '',
      planTimeArr: [], //保存计划的数组
      planTimeArrTask: [],  //保存任务的数组
      pickerOptions: {}
    }
  },
  watch: {
    patientId: {
      handler(val) {
        this.initData()
        this.getPatientFollowPlanData()
      },
      immediate: false
    },
    value: {
      handler(val) {
        this.selectedValue = val
      },
      immediate: true
    },
    selectedValue: {
      handler(val) {
        this.$emit('update:value', val)
      },
      immediate: true
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.getPatientFollowPlanData()
  },
  methods: {
    initData() {
      if(this.limitDay) {
        this.pickerOptions = {
          disabledDate: (time) => {
            const date = this.$dayjs().subtract(1, 'day')
            if(time.getTime() < date) {
              return true
            }
          },
          cellClassName: (time) => {
            const sTime = this.$dayjs(time).format('YYYY-MM-DD')
            if(this.planTimeArrTask.includes(sTime)) {
              return 'plan-day'
            }
          }
        }
      } else {
        this.pickerOptions = {
          cellClassName: (time) => {
            const sTime = this.$dayjs(time).format('YYYY-MM-DD')
            if(this.planTimeArrTask.includes(sTime)) {
              return 'plan-day'
            }
          }
        }
      }
    },
    change(val) {
      this.$emit('change', val, this.planTimeArr)
    },
    clear() {
      this.$emit('clear')
    },
    // 通过患者id查随访计划
    getPatientFollowPlanData() {
      const params = {
        patientId: this.patientId
      }
      getPatientFollowPlan(params).then((res) => {
        this.planTimeArr = (res.data || []).map((item) => {
            item = item.followUpTime
            return item
        })
        this.planTimeArrTask = (res.data || []).map((item) => {
          //运营要求根据任务而不是计划进行判断
          console.log("getPatientFollowPlan222", item)
          if(item.followUpPlanTaskList && item.followUpPlanTaskList.length > 0){
            item = item.followUpTime
            return item
          }
          else{
            return ""
          }
        })
        this.planTimeArrTask = [...new Set(this.planTimeArrTask)]
        this.planTimeArr = [...new Set(this.planTimeArr)]
        this.selectedValue ? this.$emit('change', this.selectedValue, this.planTimeArr) : ''
        console.log('通过患者id查随访计划-时间数组', this.planTimeArr)
      })
    },
  }
}
</script>
<style scoped>
</style>
