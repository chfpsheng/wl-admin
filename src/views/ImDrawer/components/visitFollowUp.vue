<template>
  <div class="app-container">
    <pa-drawer title="随访跟进" :visible.sync="detailVisible" @close="close" @cancel="close" @ok="save">
      <div class="from-wrapper">
        <el-form
          label-position="top"
          ref="ruleForm"
          :model="listDataClone"
          :rules="rules"
          class="pa-ruleForm"
        >

        <!-- <div class="detail-item">
          <div class="title2">患者</div>
          <div class="text">
            <div class="img-box">
              <img
                :src="
                  defaultPatient.headUrl
                    ? defaultPatient.headUrl
                    : defaultPatientImg
                "
                class="img-type"
              />
            </div>
            <span class="name">{{ defaultPatient.name }} </span>
            <span
              >{{ defaultPatient.sex === 1 ? "男" : "女" }} |
              {{ defaultPatient.age }}
            </span>
          </div>
        </div> -->

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
        <!-- <el-form-item label="患者" prop="patientId" class="special----el-form-item">
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
            </el-form-item> -->

        <el-form-item label="随访时间" prop="followUpTime">
          <follow-date-picker
                :value.sync="listDataClone.followUpTime"
                :limitDay = "false"
                :disabled="true"
                class="pa-form-select"
              />
        </el-form-item>

        <el-form-item label="随访方式" prop="followUpMode">
          <pa-select
              :value.sync="listDataClone.followUpMode"
              :options="typeOptions"
              :clearable="false"
              class="pa-form-select"
              placeholder="选择随访方式"
            />
        </el-form-item>
        <!-- <div class="detail-item">
          <div class="title">随访方式:</div>
          <div class="text">
            <pa-select
              :value.sync="listData.followUpMode"
              :options="typeOptions"
              placeholder="选择随访方式"
            />
          </div>
        </div> -->
        <el-form-item label="随访人" prop="followUpUser">
          <pa-select
            class="pa-form-select"
            :value.sync="listDataClone.followUpUser"
            :options="visitorOptions"
            :clearable="false"
            placeholder="选择随访人"
            />
        </el-form-item>
        <!-- <div class="detail-item">
          <div class="title">随访人:</div>
          <div class="text">
            <pa-select
              :value.sync="listData.followUpUser"
              :options="visitorOptions"
              placeholder="选择随访人"
            />
          </div>
        </div> -->
        <el-form-item label="随访任务" prop="checkedTasks">
          <el-checkbox-group
              v-model="checkedTasks"
              class="task-cnt"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox v-for="task in listDataClone.followUpPlanTaskList" :label="task.id" :key="task.id">{{
                task.taskName
              }}:{{
                task.taskContent
              }}</el-checkbox>
            </el-checkbox-group>

            <!-- <el-checkbox-group
              class="shop-checkbox-group"
              :disabled="disabledCheckbox"
              v-model="checkList"
              @change="checkBoxChange"
            >
              <el-checkbox :label="1">普通商品类型</el-checkbox>
              <el-checkbox :label="0">免费领取类型</el-checkbox>
            </el-checkbox-group> -->
        </el-form-item>
        
        <el-form-item label="随访结果" prop="followUpContent">
          <el-input
              v-model="listDataClone.followUpContent"
              type="textarea"
              placeholder="输入随访结果"
              maxlength="500"
              show-word-limit
              class="pa-input"
              :autosize="{ minRows: 4, maxRows: 16 }"
            />
        </el-form-item>
        <el-form-item>
          <div class="picture-cnt"><span class="picture">图片</span><span class="form-item-tips">上传png、jpg、jpeg格式图片,1M以内大小,最多上传3张</span></div>
            <upload-imgs
              class="img-list"
              :limit="3"
              :img-list="listDataClone.url"
              @fileChange="posterImgsChange"
              :fileSizeLimit="1"
            />
        </el-form-item>
       
        </el-form>
      </div>
    </pa-drawer>
  </div>
</template>

<script>
import LabelSelect from "@/components/LabelSelect";
import { queryAssigner, updateFollowUpPlan } from "@/api/patient";
import { mapState } from "vuex";
import baseDataMixin from "@/mixins/baseData";
import defaultPatientImg from "@/assets/image/default-patient.png";
import FollowDatePicker from '../../workbench/components/FollowDatePicker'
const { deepClone } = require('@/utils')

export default {
  name: "UserData",
  props:{
    detailVisible: {
      type: Boolean,
      default: false
    },
    listData: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    LabelSelect,
    FollowDatePicker
  },
  mixins: [baseDataMixin],
  data() {
    var validateCheckedTasks = (rule, value, callback) => {
      console.log("validateCheckedTasks", rule, value, callback)
      if (value && value.length < 1) {
        return callback(new Error("请至少选择一条随访任务"));
      } else {
        callback();
      }
    };
    return {
      url:[], //数组，用来传给图片控件，
      listDataClone: {
        followUpMode: '',
        followUpUser: '',
        followUpTime:'',
        patientId: '',
      },
      rules: {
        // checkedTask: [{ validator: validateCheckedTasks, trigger: "blur" }],
        followUpTime: [this.ValidateRules.SelectRequired],
        followUpContent: [this.ValidateRules.InputRequiredContent],
        patientId: [this.ValidateRules.InputRequired],
        followUpMode: [this.ValidateRules.SelectModeRequired],
        followUpUser: [this.ValidateRules.SelectUserRequired],
      },
      defaultPatientImg,
      posterImgsList: [],
      // detailVisible: false,
      detailInfo: {},
      dutyOptions: [],
      checkedTasks: [],
      tasks: ["任务1", "任务2", "任务3"],
      typeOptions: [
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
      ],
      visitorOptions: [],
    };
  },
  created() {
      this.listDataClone = deepClone(this.listData)
      this.listDataClone.followUpUser = this.listDataClone.followUpUser || this.listDataClone.createUser
      console.log("before split", this.listDataClone, this.listDataClone.url)
      this.url = this.listDataClone.url ? this.listDataClone.url : []
      let arr = []
      console.log("this.listDataClone", this.listDataClone, this.url)
      if(!this.listData.followUpPlanTaskList){
        this.checkedTasks = []
        return;
      }
      if(this.listData.followUpPlanTaskList && this.listData.followUpPlanTaskList.length  === 0){
        this.checkedTasks = []
      }else{

        this.listData.followUpPlanTaskList.forEach(item => {
          if(item.taskStatus === 1){
            arr.push(item.id)
          }
        })
        this.checkedTasks = arr;
      }
      console.log("this.listData", this.checkedTasks)
  },
  computed: {
    ...mapState({
      userId: (state) => state.user.imUserId, // 登陆者的im ID
      defaultPatient: (state) => state.defaultPatient.patient,
    })
  },
  mounted() {
    this.initData();
  },
  destroyed() {
    // this.$bus.$off('patient')
  },
  methods: {
    handleCheckedCitiesChange() {
      console.log("handleCheckedCitiesChange");
    },
    showDrawer() {
      this.detailVisible = true;
    },
    async initData() {
      this.dutyOptions = await this.dicDataMixins("duty"); // 岗位

      let code = "";
      // 查找专属管家的id，再去根据id获取
      this.dutyOptions.forEach((item) => {
        if (item.label === "线上专属管家") {
          code = item.value;
        }
      });
      queryAssigner({
        duty: code,
        pageNo: 1,
        pageSize: 1000,
      })
        .then((res) => {
          this.visitorOptions = [];
          const vm = this;
          res.data.rows.map((item) => {
            vm.visitorOptions.push({
              label: item.displayName,
              value: item.id,
            });
          });
        })
        .catch((error) => {});
    },
    posterImgsChange(data) {
      console.log("posterImgsChange", data);
      this.url = data.map(item=>{
        return {
          url:item
        }
      });
      // this.listDataClone.url = data.map(item=>{
      //   return {
      //     url:item
      //   }
      // })
    },
    close() {
      this.$emit("closeDlg", false)
      console.log("close");
    },
    submit(){
      
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      let taskStatus = 0
      let followUpPlanTaskInsertParamDTOList = this.listData.followUpPlanTaskList.map(item => {
        console.log("followUpPlanTaskInsertParamDTOList", this.checkedTasks, item)
        if(this.checkedTasks.indexOf(item.id) > -1){
          taskStatus = 1 //已完成
        }else{
          //需要增加判断逻辑，状态不是已完成的，如果已经超过当天时间，也应该是已过期
          console.log("this.listData.followUpTime", this.listData.followUpTime)
          let after = this.$dayjs().isAfter(this.listData.followUpTime, 'day')
          console.log("after", after)
          if(after){
            taskStatus = -1  //过期
          }else{
            taskStatus = 0
          }
        }
        return {
          planId: item.planId,
          taskType:item.taskType,
          taskContent:item.taskContent,
          taskStatus,
        }
      })
      let vm  = this;
      let url = []
      this.url.forEach(item =>  {
        url.push(item.url)
      })
      updateFollowUpPlan({
        id: this.listData.id,
        followUpMode: this.listDataClone.followUpMode,
        followUpUser: this.listDataClone.followUpUser,
        followUpTime: this.listDataClone.followUpTime,
        followUpContent:this.listDataClone.followUpContent,
        patientId: this.defaultPatient.id,
        planType:"PLAN",
        url: url.join(","),
        followUpPlanTaskInsertParamDTOList:followUpPlanTaskInsertParamDTOList
      }).then(res=>{
        vm.$emit("closeDlg", true)
      })
    },
    save(){
      this.$refs.ruleForm.validate((valid) => {
        console.log("validate", valid, this.checkedTasks)
        if (valid) {
          if(this.checkedTasks && this.checkedTasks.length === 0){
            this.$message.error("请至少选择一条随访任务")
            return;
          }
          this.submit()
        } else {
          console.log(valid)
          return false
        }
      })
    }
  },
  
};
</script>
<style lang="scss" scoped>
.from-wrapper {
  width: 100%;
  height: 100%;
  padding: 0 16px 80px 24px;
  overflow: auto;
}
.pa-el-tag {
  margin: 0 8px 8px 0;
}
.left-item .title {
  font-size: 14px;
}
.pa-flex-column * {
  font-size: 14px;
}
.edit-icon {
  color: #06c;
  cursor: pointer;
  margin-left: 10px;
  font-size: 14px;
}
.tip-text {
  font-size: 12px;
  color: #999;
  margin-right: 4px;
}
.right-item {
  align-items: center;
}
.pa-list-item {
  display: flex;
  flex-direction: column;
}
::v-deep .mobile-container {
  display: flex;
  align-items: center;
  .pa-special-form-item {
    width: auto;
  }
}

.from-wrapper ::v-deep .el-checkbox__input {
  position: absolute;
  top: 0px;
  left: 0px;
}

.img-box {
  width: 32px;
  height: 32px;
  border-radius: 16px;
  overflow: hidden;
  display: inline-block;
  align-items: center;
  // margin-right: 8px;
}

.img-box .img-type {
  max-width: 32px;
  max-height: 32px;
}

.name {
  margin-right: 8px;
}

::v-deep .el-checkbox__label{
  word-break: break-all;
}


::v-deep .el-checkbox{
  margin-bottom: 8px;
  color:#333333;
  // margin-top: 8px;
}

.task-cnt ::v-deep .el-checkbox__inner {
  width:14px;
  height: 14px;
  border-radius: 0px;
  top: 2px;
}

.task-cnt ::v-deep .el-checkbox__label {
  padding-left: 20px;
}

.task-cnt ::v-deep .el-checkbox__inner::after {
  height: 7px;
  left: 4px;
  top: 1px;
}

::v-deep .img-list {
  .el-upload.el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 80px !important;
    height: 80px !important;
    margin: 0 8px 0 0;
    display: inline-block;
  }
}

.form-item-tips{
  font-size: 12px;
  color: #999999;
}

.picture{
  margin-right: 4px;
}

.picture-cnt{
  margin-bottom: 8px;
}

::v-deep .el-checkbox__input.is-checked + .el-checkbox__label{
  color: #333;
  font-weight:400;
  padding-right:0px
}

::v-deep .el-checkbox__label {
  font-weight:400
}

</style>
