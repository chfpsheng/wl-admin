<template>
  <pa-drawer
    :title="title"
    size="400px"
    :closable="true"
    :visible.sync="visible"
    :confirm-loading="confirmLoading"
    @ok="handleOK"
    @cancel="handleCancel"
  >
    <div class="follow-plan-box">
      <div class="from-wrapper">
        <el-form
          label-position="top"
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          class="pa-ruleForm"
        >
          <div class="form-box">
            <el-form-item label="患者" prop="patientId" class="special----el-form-item">
              <div class="information-box">
                <div class="img-box">
                  <img
                    :src="defaultPatient.headUrl ? defaultPatient.headUrl : 'https://hlwyy-dev-1306402234.cos.ap-guangzhou.myqcloud.com/163004889569347.png'"
                    class="img-type"
                  />
                </div>
                <span style="margin-left: 8px;">{{defaultPatient.name}}</span>
                <span style="font-size: 12px; margin-left: 16px;">{{defaultPatient.sex === 1 ? '男' : '女'}}</span>
                <span style="font-size: 12px; white-space: pre;" v-if="defaultPatient.age"> | {{defaultPatient.age}}岁</span>
              </div>
            </el-form-item>
            <el-form-item label="随访时间" prop="followUpTime">
              <follow-date-picker
                :value.sync="ruleForm.followUpTime"
                :patientId="ruleForm.patientId"
                @change="followDateChange"
                :disabled="type === 'edit'"
                class="pa-form-select"
              />
            </el-form-item>
            <el-form-item label="随访人" prop="followUpUser">
              <pa-select
                :value.sync="ruleForm.followUpUser"
                :options="followUpUserOptions"
                class="pa-form-select"
                :disabled="!ruleForm.followUpTime"
              />
            </el-form-item>
            <el-form-item label="随访任务" prop="followUpPlanTaskInsertParamDTOList">
              <div class="tips---text">
                最多可添加5条任务
              </div>
              <div class="add-box" v-if="ruleForm.followUpPlanTaskInsertParamDTOList.length === 0 && ruleForm.followUpTime">
                <el-tooltip content="添加随访任务" placement="top" effect="light">
                  <i
                    class="el-icon-plus mouse-pointer"
                    style="margin-right: 8px;"
                    @click="addItem"
                  />
                </el-tooltip>
              </div>
              <div class="task-box" v-for="(item, index) in ruleForm.followUpPlanTaskInsertParamDTOList" :key="index">
                <div class="left-box">
                  <el-form-item :prop="`followUpPlanTaskInsertParamDTOList.${index}.taskType`">
                    <pa-select
                      :value.sync="item.taskType"
                      :options="taskTypeOptions"
                      :clearable="false"
                      :disabled="item.taskStatus !== 0"
                      class="pa-form-select"
                    />
                  </el-form-item>
                  <el-form-item :prop="`followUpPlanTaskInsertParamDTOList.${index}.taskContent`">
                    <el-input
                      type="textarea"
                      v-model="item.taskContent"
                      placeholder="请输入任务内容"
                      clearable
                      class="pa-input"
                      show-word-limit
                      maxlength="200"
                      rows="7"
                      :disabled="item.taskStatus !== 0"
                    />
                  </el-form-item>
                </div>
                <div class="right-box">
                  <el-tooltip content="添加随访任务" placement="top" effect="light">
                    <i
                      v-if="index === ruleForm.followUpPlanTaskInsertParamDTOList.length - 1 && ruleForm.followUpPlanTaskInsertParamDTOList.length < 5"
                      class="el-icon-plus mouse-pointer"
                      style="margin-right: 8px;"
                      @click="addItem"
                    />
                  </el-tooltip>
                  <el-tooltip content="删除随访任务" placement="top" effect="light" v-if="item.taskStatus === 0">
                    <i class="el-icon-delete mouse-pointer" @click="delItem(index)" />
                  </el-tooltip>
                  <i class="el-icon-delete" style="color: #c0c4cc; margin-left: 8px" v-if="item.taskStatus !== 0" />
                </div>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
  </pa-drawer>
</template>
<script>
import { mapState } from 'vuex'
import FollowDatePicker from './FollowDatePicker'
import { addFollowPlan, editFollowPlan, getTaskTypeOptions, getEditFollowUpData, getFollowUpData } from '@/api/workbench'
import { queryAssigner } from '@/api/patient'
import baseDataMixin from '@/mixins/baseData'
export default {
  name: 'FollowPlan',
  mixins: [baseDataMixin],
  components: {
    FollowDatePicker
  },
  props: {
    title: {
      type: String,
      default: '新增随访计划'
    },
    parentVisible: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'add'
    },
    planId: {
      type: Number | String,
      default: ''
    },
    defaultDay: {
      type: String,
      default: ''
    }
  },
  watch: {
    parentVisible: {
      handler(val) {
        this.visible = val
      },
      immediate: true
    },
    visible: {
      handler(val) {
        this.$emit('update:parentVisible', val)
      },
      immediate: true
    }
  },
  data() {
    return {
      confirmLoading: false,
      visible: true,
      ruleForm: {
        followUpMode: '', // 随访方式-要去掉
        patientId: '', // 患者id
        planType: 'PLAN', // 记录类型 PLAN：随访计划 LOG：日志
        followUpTime: '', // 随访时间
        followUpUser: '', // 随访人
        followUpPlanTaskInsertParamDTOList: [], // 随访任务
      },
      rules: {
        patientId: [this.ValidateRules.InputRequired],
        followUpTime: [this.ValidateRules.SelectRequiredFollowTime],
        followUpUser: [this.ValidateRules.SelectRequiredFollowUser],
      },
      followUpUserOptions: [], // 随访人
      // 随访任务
      taskTypeOptions: [],
      taskTypeObj: null,
    }
  },
  computed: {
    ...mapState({
      defaultPatient: (state) => state.defaultPatient.patient,  // 患者信息
    }),
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      console.log('defaultPatient', this.defaultPatient)
      this.ruleForm.patientId = this.defaultPatient.id
      this.getFollowUpUserData()
      this.getTaskTypeOptionsData()
      if(this.type === 'edit') {
        this.getEditData()
      } else {
        const today = this.$dayjs().format('YYYY-MM-DD')
        this.ruleForm.followUpTime = this.defaultDay ? this.defaultDay : today
        const userData = this.$local.get('userData')
        if(userData.duty === '4') {
          this.ruleForm.followUpUser = parseInt(userData.userId)
        }
      }
    },
    // 获取编辑的随访计划
    getEditData() {
      getEditFollowUpData(this.planId).then((res) => {
        console.log('获取编辑的随访计划', res)
        this.ruleForm = {
          ...res.data,
          followUpPlanTaskInsertParamDTOList: res.data.followUpPlanTaskList
        }
      })
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
        let defaultVal = this.taskTypeOptions.filter(item => item.label === '其他')
        this.taskTypeObj = defaultVal[0]
        console.log('随访任务下拉选项数据', this.taskTypeOptions, this.taskTypeObj)
      })
    },
    // 随访人选项数据
    async getFollowUpUserData() {
      let dutyOptions = await this.dicDataMixins('duty') // 岗位
      let code = ''
      // 查找专属管家的id，再去根据id获取
      dutyOptions.forEach(item => {
        code = item.label === '线上专属管家' ? item.value : ''
      })
      const params = {
        duty: code,
        pageNo: 1,
        pageSize: 1000
      }
      queryAssigner(params).then((res) => {
        this.followUpUserOptions = (res.data.rows || []).map(item => {
          item = {
            label: item.displayName,
            value: item.id
          }
          return item
        })
        console.log('随访人', this.followUpUserOptions)
      })
    },
    openDrawer(val) {
      this.visible = val
    },
    handleOK() {
      this.submitForm()
    },
    handleCancel() {
      this.visible = false
    },
    followDateChange(val, planTimeArr) {
      console.log('随访日期', val, planTimeArr)
      if(planTimeArr.indexOf(val) > -1) {
        this.getCurrentDayFollow(val)
      } else {
        this.ruleForm.id = ''
        this.ruleForm.followUpPlanTaskInsertParamDTOList = []
      }
    },
    // 查询当天的随访任务
    getCurrentDayFollow(followUpTime) {
      const params = {
        patientId: this.ruleForm.patientId,
        followUpTime,
      }
      getFollowUpData(params).then((res) => {
        this.ruleForm.id = res.data.id
        this.ruleForm.followUpUser = res.data.followUpUser
        this.ruleForm.followUpPlanTaskInsertParamDTOList = (res.data.followUpPlanTaskList || []).map((item) => {
          item = {
            taskType: item.taskType,
            taskStatus: item.taskStatus,
            taskContent: item.taskContent
          }
          return item
        })
        console.log('查询当天的随访任务', res, this.ruleForm.followUpPlanTaskInsertParamDTOList)
      })
    },
    // 添加任务
    addItem() {
      const item = {
        taskType: this.taskTypeObj.value, // 任务类型
        taskContent: '', // 任务内容
        taskStatus: 0, // 任务状态：1 已完成 0 代办 -1 已过期
      }
      this.ruleForm.followUpPlanTaskInsertParamDTOList.push(item)
    },
    delItem(index) {
      this.ruleForm.followUpPlanTaskInsertParamDTOList.splice(index, 1)
      console.log(this.ruleForm.followUpPlanTaskInsertParamDTOList)
    },
    // 提交-校验表单数据
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.ruleForm.id ? this.editFollowData() : this.addFollowData()
        } else {
          console.log(valid)
          return false
        }
      })
    },
    // 新增随访计划
    addFollowData() {
      this.confirmLoading = true
      const params = {
        ...this.ruleForm
      }
      addFollowPlan(params).then(() => {
        this.$message.success('新增随访计划成功')
        this.visible = false
        this.confirmLoading = false
        this.$emit('success')
      }).catch(() => {
        this.confirmLoading = false
      })
    },
    // 更新随访计划
    editFollowData() {
      this.confirmLoading = true
      const params = {
        ...this.ruleForm
      }
      editFollowPlan(params).then(() => {
        this.$message.success(`${this.type === 'add' ? '新增' : '编辑'}随访计划成功`)
        this.visible = false
        this.confirmLoading = false
        this.$emit('success')
      }).catch(() => {
        this.confirmLoading = false
      })
    },
  }
}
</script>
<style scoped lang="scss">
@import '../workbench.scss';
</style>
