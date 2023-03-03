<template>
  <div class="follow-item-box">
    <div class="top-box">
      <div class="left-box">
        <div class="img-box img-box2">
          <img :src="baseData.patientImageUrl ? baseData.patientImageUrl : defaultPatientImg" class="img-type" />
        </div>
        <span class="name">{{baseData.patientName}}</span>
        <span class="time" v-if="baseData.weekDesc">孕周：{{baseData.weekDesc}}</span>
        <span class="keeper" v-if="activeName !== 'timeout'">随访人：{{baseData.followUpUserName}}</span>
        <span class="keeper" v-if="activeName === 'timeout'">随访时间：{{baseData.followUpTime}}</span>
      </div>
      <div class="right-box">
        <el-tooltip content="会话" placement="top" effect="light">
          <i class="iconfont icon-huanzhexiaoxiicon handle-icon" v-if="(type === 'follow' || type === 'expired') && duty === '4'" @click="followUpPlan" />
        </el-tooltip>
        <el-tooltip content="编辑" placement="top" effect="light">
          <i class="iconfont icon-bianji handle-icon" v-if="type === 'follow' && !disabled && duty === '4'" @click="editPlan" />
        </el-tooltip>
        <el-tooltip content="删除" placement="top" effect="light">
          <i class="iconfont icon-shanchu handle-icon" v-if="type === 'follow' && !disabled && duty === '4'" @click="delPlan" />
        </el-tooltip>
        <el-tooltip content="查看" placement="top" effect="light">
          <i class="iconfont icon-s_chakan handle-icon" v-if="type === 'completed'" @click="seePlan" />
        </el-tooltip>
      </div>
    </div>
    <div class="bottom-box">
      <div v-for="(item, index) in baseData.followUpPlanTaskList" :key="index" :class="item.taskStatus | filtersType">
        <div class="status">
          <div class="status-box">
            <i class="dot" />
            {{item.taskStatus | filtersStatus}}
          </div>
        </div>
        <el-tooltip :content="item.taskContent" placement="top" :disabled="isDisabledTooltip" popper-class="follow-tooltip">
          <div class="test test-box" @mouseover="onMouseOver(item.id)">
            <span :id="`tooltip${item.id}`">{{filtersTaskType(item.taskType)}}：{{item.taskContent}}</span>
          </div>
        </el-tooltip>
      </div>
    </div>
    <follow-plan ref="followPlan" title="编辑随访计划" type="edit" :planId="this.baseData.id" :parentVisible.sync="parentVisible" v-if="parentVisible" @success="success" />
    <follow-plan-detail ref="FollowPlanDetail" :detailData="detailData" />
  </div>
</template>
<script>
import { delFollowPlan, getEditFollowUpData } from '@/api/workbench'
import { getPatientById } from '@/api/patient'
import FollowPlan from './FollowPlan' // 编辑随访计划
import FollowPlanDetail from './FollowPlanDetail' // 查看详情
export default {
  name: 'FollowItem',
  components: {
    FollowPlan, // 编辑随访计划
    FollowPlanDetail, // 查看详情
  },
  props: {
    type: {
      type: String,
      default: 'follow'
    },
    activeName: {
      type: String,
      default: 'today'
    },
    baseData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      parentVisible: false,
      detailData: {},
      defaultPatientImg: 'https://hlwyy-dev-1306402234.cos.ap-guangzhou.myqcloud.com/163004889569347.png',
      isDisabledTooltip: true,
      disabled: false,
      duty: '',
    }
  },
  watch: {
    baseData: {
      handler(val){
        const obj = val.followUpPlanTaskList.find(item => item.taskStatus === 1)
        this.disabled = obj ? true : false
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.duty = this.$local.get('userData').duty
  },
  filters: {
    filtersStatus(val) {
      const status = val === 0 ? '待办' : (val === 1 ? '已完成' : '已过期')
      return status
    },
    filtersType(val) {
      let type = val === 0 ? 'list-box-type2' : (val === 1 ? 'list-box-type1' : 'list-box-type3')
      return `list-box ${type}`
    },
  },
  methods: {
    filtersTaskType(val) {
      const obj = JSON.parse(this.$session.get('taskTypeOptions')).find(item => item.value === val)
      const label = obj && obj.label ? obj.label : ''
      return label
    },
    editPlan() {
      console.log('编辑数据', this.baseData)
      getPatientById(this.baseData.patientId).then((res) => {
        this.$store.commit('updateDefaultPatient', res.data)
        this.parentVisible = true
      })
    },
    // 删除随访计划
    delPlan() {
      this.$confirm(`是否确定删除随访计划？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delPlanData()
      }).catch((err) => {
        console.log(err)
      })
    },
    delPlanData(){
      delFollowPlan(this.baseData.id).then((res) => {
        console.log(res)
        this.$message({
          message: '删除随访计划成功',
          type: 'success'
        })
        this.$emit('success');
      })
    },
    // 查看
    seePlan() {
      getEditFollowUpData(this.baseData.id).then((res) => {
        console.log('详情', res)
        this.detailData = res.data
        this.$refs.FollowPlanDetail.openDrawer(true)
      })
    },
    // 会话
    async followUpPlan() {
      const userData = this.$local.get('userData')
      const params = {
        imKeeperId: userData.imUserId,
        patientId: this.baseData.patientId
      }
      const result = await this.$requestPost(
        `/cloud-im/chatSession/beginForKeeper`,
        params
      )
      if (result && result.code === 200) {
        this.linkIm(result.data)
      } else if (result && result.code === 5011) {
        this.$message.error('用户未发起咨询，无法发起会话')
      } else if (result && result.code === 5007) {
        this.$message.error('已有管家正在进行对话，请等候')
      }
    },
    linkIm(conversationId) {
      getPatientById(this.baseData.patientId).then((res) => {
        this.$store.state.selectedConversation.selectedConversationId = conversationId
        this.$store.commit('updateDefaultPatient', res.data)
        this.$router.push({
          path: '/Im/index',
          query: {
            followUpTime: this.baseData.followUpTime,
            tab: 'three'
          }
        })
      })
    },
    success() {
      this.$emit('success');
    },
    onMouseOver(id) {
      const contentWidth = document.getElementById(`tooltip${id}`).offsetWidth
      const parentWidth = document.getElementById(`tooltip${id}`).parentNode.offsetWidth
      // console.log(id, parentWidth, contentWidth)
      // 判断是否禁用tooltip功能
      this.isDisabledTooltip = contentWidth <= parentWidth
    },
  }
}
</script>
<style scoped lang="scss">
@import '../workbench.scss';
</style>
