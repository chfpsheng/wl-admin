<template>
  <pa-drawer
    :title="title"
    :closable="true"
    :visible.sync="visible"
    :confirm-loading="confirmLoading"
    :with-footer="false"
    @ok="handleOK"
    @cancel="handleCancel"
  >
    <div class="detail-container follow-up-plan-datail">
      <div class="detail-item">
        <div class="title">患者信息:</div>
        <div class="text special----el-form-item">
          <div class="information-box">
            <div class="img-box">
              <img
                :src="detailData.patientImageUrl ? detailData.patientImageUrl : 'https://hlwyy-dev-1306402234.cos.ap-guangzhou.myqcloud.com/163004889569347.png'"
                class="img-type"
              />
            </div>
            <span style="margin-left: 8px;">{{detailData.patientName}}</span>
            <span style="font-size: 12px; margin-left: 16px;">{{detailData.patientSex === 1 ? '男' : '女'}}</span>
            <span style="font-size: 12px; white-space: pre;"> | {{detailData.patientAge}}岁</span>
          </div>
          <!-- 刘诗诗{{detailData.patientId}} -->
        </div>
      </div>
      <div class="detail-item">
        <div class="title">随访时间:</div>
        <div class="text">{{detailData.followUpTime}}</div>
      </div>
      <div class="detail-item">
        <div class="title">随访方式:</div>
        <div class="text">{{detailData.followUpMode | filtersFollowUpMode}}</div>
      </div>
      <div class="detail-item">
        <div class="title">随访人:</div>
        <div class="text">{{detailData.followUpUserName}}</div>
      </div>
      <div class="detail-item detail-item-special2">
        <div class="title">随访任务:</div>
      </div>
      <div class="detail-item detail-item-special">
        <div class="text follow-item-box">
          <div v-for="(item, index) in detailData.followUpPlanTaskList" :key="index" :class="item.taskStatus | filtersType">
            <div class="status">
              <i class="dot" />
              {{item.taskStatus | filtersStatus}}
            </div>
            <div class="text">
              {{filtersTaskType(item.taskType)}}：{{item.taskContent}}
            </div>
          </div>
        </div>
      </div>
      <div class="detail-item">
        <div class="title">随访结果:</div>
        <div class="text">{{detailData.followUpContent}}</div>
      </div>
      <div class="detail-item">
        <div class="title">附件图片:</div>
        <div class="text pa-ruleForm">
          <upload-imgs :limit="3" :img-list="imgList" :disabled="true" :modal="false" />
        </div>
      </div>
      <div class="detail-item">
        <div class="title">创建人:</div>
        <div class="text">{{detailData.createUserName}}</div>
      </div>
      <div class="detail-item">
        <div class="title">创建时间:</div>
        <div class="text">{{detailData.createTime}}</div>
      </div>
    </div>
  </pa-drawer>
</template>
<script>
export default {
  name: 'FollowPlanDetail',
  props: {
    detailData: {
      type: Object,
      default: () => ({})
    }
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
    filtersFollowUpMode(val) {
      const typeOptions = [
        {
          label: "管家咨询im",
          value: '1',
        },
        {
          label: "电话",
          value: '2',
        },
        {
          label: "面谈",
          value: '3',
        },
        {
          label: "微信",
          value: '4',
        },
        {
          label: "其他",
          value: '5',
        },
      ]
      let mode = typeOptions.find(item => item.value === val)
      mode = mode ? mode.label : ''
      return mode
    }
  },
  data() {
    return {
      title: '随访详情',
      confirmLoading: false,
      visible: false,
      defaultPatientImg: 'https://hlwyy-dev-1306402234.cos.ap-guangzhou.myqcloud.com/163004889569347.png',
      imgList: [
        /* {
          url: 'https://hlwyy-test-1306402234.cos.ap-guangzhou.myqcloud.com/163159023877887.jpg'
        },
        {
          url: 'https://hlwyy-test-1306402234.cos.ap-guangzhou.myqcloud.com/163159023877887.jpg'
        } */
      ]
    }
  },
  watch: {
    detailData: {
      handler(val) {
        console.log(val)
        if(val.url) {
          const arr = val.url.split(',')
          this.imgList = arr.map(item => {
            item = {
              url: item
            }
            return item
          })
        }
      },
      deep: true,
      immediate: true
    },
  },
  mounted() {
  },
  methods: {
    filtersTaskType(val) {
      const obj = JSON.parse(this.$session.get('taskTypeOptions')).find(item => item.value === val)
      const label = obj && obj.label ? obj.label : ''
      return label
    },
    openDrawer(val) {
      this.visible = val
    },
    handleOK() {
      this.visible = false
      // this.confirmLoading = true
    },
    handleCancel() {
      this.visible = false
    },
  }
}
</script>
<style scoped lang="scss">
@import '../workbench.scss';
@import './followPlanDetail.scss';
</style>
