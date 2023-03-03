<template>
  <div class="app-container">
    <el-tabs v-model="activeName" class="pa-tabs workbench-tabs" @tab-click="handleClick">
      <el-tab-pane name="first">
        <span slot="label">{{labelData.firstLabel}} ({{unDoPlanNum}})</span>
        <follow-today @activeNameChange="activeNameChange" @getData="getData" />
      </el-tab-pane>
      <!-- <el-tab-pane :label="labelData.secondLabel" name="second">
        <pending-orders />
      </el-tab-pane> -->
      <el-tab-pane :label="labelData.thirdLabel" name="third">
        <follow-expired />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import FollowToday from './components/FollowToday' // 今日随访
import PendingOrders from './components/PendingOrders' // 待处理订单
import FollowExpired from './components/FollowExpired' // 今日随访
import { getTaskTypeOptions } from '@/api/workbench'
export default {
  name: 'Workbench',
  components: {
    FollowToday,
    PendingOrders,
    FollowExpired
  },
  data() {
    return {
      activeName: 'first',
      labelData: {
        firstLabel: '今日随访',
        secondLabel: '待处理订单',
        thirdLabel: '已过期随访'
      },
      taskTypeOptions: [],
      unDoPlanNum: 0,
    }
  },
  created() {},
  mounted() {
    this.getTaskTypeOptionsData()
  },
  destroyed() {},
  methods: {
    handleClick(val) {
      console.log(val)
    },
    activeNameChange(val) {
      this.activeName = val
    },
    // 随访任务下拉选项数据
    getTaskTypeOptionsData() {
      getTaskTypeOptions().then((res) => {
        this.taskTypeOptions = res.data.map(item => {
          item = {
            value: item.itemCode,
            label: item.itemName
          }
          return item
        })
        this.$session.set('taskTypeOptions', JSON.stringify(this.taskTypeOptions))
        console.log('随访任务下拉选项数据', this.taskTypeOptions)
      })
    },
    getData(data) {
      if(data.unDoPlanList && data.unDoPlanList.length > 0) {
        this.unDoPlanNum = data.unDoPlanList.length
      } else {
        this.unDoPlanNum = 0
      }
    }
  }
}
</script>
<style scoped lang="scss">
@import './workbench.scss';
</style>
