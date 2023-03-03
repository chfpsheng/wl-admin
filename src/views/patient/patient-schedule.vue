<template>
  <div class="app-container">
    <div class="filter-container filter-box info-warp">
      <div class="patient-warp">
        <div class="patient-info">
          <img
            class="patient-avatar"
            :src="patientInfo.headUrl ? patientInfo.headUrl : defaultPatientImg"
            alt="头像"
          />
          <span class="patient-name">{{ patientInfo.name }}</span>
          <span class="gestation-weeks-title" v-if="patientInfo.gestationInfo"
            >孕周：</span
          >
          <span class="gestation-weeks-date" v-if="patientInfo.gestationInfo">
            {{
              patientInfo.gestationInfo
                ? patientInfo.gestationInfo.totalWeeks +
                  "周" +
                  (patientInfo.gestationInfo.weekDays > 0
                    ? "+" + patientInfo.gestationInfo.weekDays
                    : "")
                : ""
            }}
          </span>
          <div class="pa-patient-tabs--box pa-special-form-item">
            <div
              v-if="patientInfo.labelList && patientInfo.labelList.length <= 4"
            >
              <el-tag
                v-for="(item, index) in patientInfo.labelList"
                :key="index"
                class="pa-el-tag"
              >
                {{ item.labelName }}
              </el-tag>
            </div>
            <el-popover
              v-if="patientInfo.labelList && patientInfo.labelList.length > 4"
              placement="bottom"
              width="400"
              trigger="hover"
            >
              <div
                style="width: 100%; max-height: 300px; overflow: auto"
                class="pa----patient-tabs"
              >
                <el-tag
                  v-for="(item1, index1) in patientInfo.labelList"
                  :key="index1"
                  class="pa-el-tag"
                >
                  {{ item1.labelName }}
                </el-tag>
              </div>
              <div slot="reference">
                <el-tag
                  v-for="(item, index) in patientInfo.labelList.slice(0, 3)"
                  :key="index"
                  class="pa-el-tag"
                >
                  {{ item.labelName }}
                </el-tag>
                <el-tag class="pa-el-tag">
                  + {{ patientInfo.labelList.length - 3 }}
                </el-tag>
              </div>
            </el-popover>
          </div>
        </div>
        <div class="btn-group">
          <el-button class="pa-btn go-back" @click="goBackBtn"
            ><i class="iconfont icon-s_jiantouzuo2"></i>返回
          </el-button>
          <el-button type="primary" class="pa-btn" @click="saveBtn">
            <i class="iconfont icon-s_baocun"></i>
            保存
          </el-button>
        </div>
      </div>
      <div class="base-info">
        <div class="base-content">
          <div class="item">
            <span class="title"><span class="star">*</span>预产期：</span>
            <span class="text">{{
              patientInfo.expectedDate
                ? patientInfo.expectedDate.slice(0, 10)
                : ""
            }}</span>
          </div>
          <div class="item">
            <span class="title"><span class="star">*</span>制定人：</span>
            <span class="text">{{ makerName }}</span>
          </div>
          <div class="item">
            <span class="title">医院：</span>
            <span class="text">深圳市罗湖区人民医院</span>
          </div>
        </div>
        <el-form
          :inline="true"
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-form-item label="模板" prop="temPlateId">
            <PatientSelectTemplate
              :selectValue="ruleForm.temPlateId"
              @changeValue="selectTemplateChange"
            />
          </el-form-item>
        </el-form>
      </div>
      <div class="divider-line"></div>
      <delivery-template
        :style="{ height: tableHeight + 'px' }"
        v-loading="templateLoading"
        element-loading-text="加载中..."
        v-if="deptId"
        :deptId="deptId"
        :initTemplateHeaderData="templateHeaderData"
        :initTemplateData="templateList"
        :initPregnancyWeek="pregnancyWeek"
        @table-header-load="templateHeaderDataLoad"
        ref="deliveryTemplate"
      />
    </div>
  </div>
</template>
<script>
import defaultPatientImg from "@/assets/image/default-patient.png";
import PatientSelectTemplate from "./patient-template/select-template.vue";
import DeliveryTemplate from "@/views/template-manage/delivery-template/template2.vue";
const validateSelectTemplate = (rule, value, callback) => {
  if (value[1] === "") {
    callback(new Error("请选择模板名称"));
  } else {
    callback();
  }
};
export default {
  name: "PatientSchedule",
  components: {
    PatientSelectTemplate,
    DeliveryTemplate,
  },
  props: {
    patientId: {
      type: Number | String,
      default: "",
    },
    type: {
      // add or edit
      type: String,
      default: "",
    },
  },
  data() {
    return {
      defaultPatientImg: defaultPatientImg,
      patientInfo: {}, //患者信息
      makerName: "", //制定人
      ruleForm: {
        temPlateId: ["", ""],
      },
      rules: {
        temPlateId: [],
      },
      templateHeaderData: [
        {
          columnName: "产检日期",
          columnType: "date",
          columnCode: "pregnancyTime",
        },
      ],
      templateList: [], //模板行数据(即填写的数据)
      pregnancyWeek: [], //孕周对应的所有产检日期
      deptId: "", //科室
      statusType: "", //编辑或者新增状态
      tableHeight: 0,
      updateBeforeData: "",
      updateAfterData: "",
      templateLoading:false,
      editTemplateId:"",//编辑时的模板id
    };
  },
  created() {
    let _userData = localStorage.getItem("userData");
    this.statusType = this.$route?.query?.type || this.type;
    if (this.$route?.query?.id || this.patientId) {
      let _id = this.$route?.query?.id || this.patientId;
      this.getPatientInfo(_id);
      if (this.statusType == "edit") {
        //编辑时
        this.queryByPatientId(_id);
        this.getMakerName(_id);
      } else if (this.statusType == "add") {
        //新增时
        if (_userData) {
          this.makerName = JSON.parse(_userData)?.name;
        }
        this.rules.temPlateId = [
          { required: true, message: "请选择模板名称", trigger: "blur" },
          { validator: validateSelectTemplate, trigger: "blur" },
        ];
      }
    }
    this.$nextTick(() => {
      this.updateBeforeData = this.getDiffData();
    });
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(259);
    });
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(259);
    };
  },
  methods: {
    // 查询患者信息
    async getPatientInfo(id) {
      let baseId = window.btoa(id)
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/getPatientDTO?id=${baseId}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.patientInfo = result.data;
          this.patientInfo.name = this.$decryptBase64(this.patientInfo.name)
          // 根据患者信息查询孕周
          this.queryPregnancyWeek();
          // this.patientInfo.name = decodeURIComponent(escape(window.atob(result.data.name)))
        }
      }
    },
    // 查询制定人
    async getMakerName(id) {
      const result = await this.$requestPost(
        `/cloud-consult/pregnancyPatientSysuser/queryByPatientId?id=${id}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.makerName = result.data?.userName;
        }
      }
    },
    // 查列表孕周日期
    async queryPregnancyWeek() {
      const result = await this.$requestPost(
        `/cloud-consult/pregnancy/queryPregnancyWeek?date=${this.patientInfo.expectedDate.slice(
          0,
          10
        )}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.pregnancyWeek = result.data;
        }
      }
    },
    // 获取孕周所有对应的孕产日期
    getPregnancyWeekDate(gestationalWeek) {
      let _value = "";
      if (this.pregnancyWeek) {
        this.pregnancyWeek.forEach((item) => {
          if (item.pregnancyWeek == gestationalWeek) {
            _value = item.date;
          }
        });
      }
      return _value;
    },
    // 模板下拉选择改变
    selectTemplateChange(val, oldValue) {
      //console.log("模板下拉选择改变", val, oldValue);
      if (this.statusType == "add" && oldValue[0] == "") {
        this.ruleForm.temPlateId = [...val];
        this.deptId = val[0];
        this.getTemplateRowData();
      } else {
        this.$confirm(`是否确定修改模板，修改后数据将初始化？`, "确定修改", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.ruleForm.temPlateId = [...val];
            this.deptId = val[0];
            this.getTemplateRowData();
          })
          .catch(() => {
            this.ruleForm.temPlateId = [...oldValue];
          });
      }
    },
    // 新增时查询模板行中的数据
    async getTemplateRowData() {
      const params = {
        id: this.ruleForm.temPlateId[1],
      };
      this.templateLoading = true;
      const result = await this.$requestPost(
        `/cloud-consult/pregnancyDetail/queryByTemplateId?templateId=${params.id}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.templateList = result.data.map((item) => {
            item = {
              id: item.id,
              attention: item.attention,
              pregnancyTime: this.getPregnancyWeekDate(item.gestationalWeek),
              commonInspect: item.commonInspect,
              concernCore: item.concernCore,
              gestationalWeek: item.gestationalWeek + "",
              inspectCore: item.inspectCore,
              pregnancyTestName: item.pregnancyTestName,
              specialInspect: item.specialInspect,
              status: item.status,
              treatmentProcess: item.treatmentProcess,
            };
            return item;
          });
          this.templateLoading = false
        }
      }
    },
    // 返回
    goBackBtn() {
      this.updateAfterData = this.getDiffData();
      console.log(this.updateAfterData);
      console.log(this.updateBeforeData);
      if (this.updateAfterData == this.updateBeforeData) {
        //this.$store.commit("updateRefresh", true);
        this.$emit("close");
        return;
      }
      this.$confirm(`当前数据未保存，确定返回?`, "确定返回", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        /* this.$router.push({
          path: "/im/index",
          query: {
            tab: "four",
          },
        }); */
        //this.$store.commit("updateRefresh", true);
        this.$emit("close");
      });
    },
    // 保存
    saveBtn() {
      const p1 = new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      const p2 = new Promise((resolve, reject) => {
        this.$refs["deliveryTemplate"].$refs["form"].validate((valid) => {
          if (valid) {
            resolve();
          } else {
            reject();
          }
        });
      });
      Promise.all([p1, p2])
        .then(() => {
          //console.log("验证通过,提交表单");
          let _modleList = this.getTemplateData();
          if (_modleList.length == 0) {
            this.$message({
              message: "至少添加一条产检计划",
              type: "warning",
            });
          } else {
            this.addAndEdit(_modleList);
          }
        })
        .catch(() => {
          this.$message({
            message: "信息输入有误，请检查",
            type: "warning",
          });
        });
    },
    // 新增和编辑完后提交
    async addAndEdit(list = []) {
      const params = list;
      let url = `/cloud-consult/pregnancyPatient/insertOrUpdate?patientId=${
        this.$route?.query?.id ? this.$route.query.id : this.patientId
      }`;
      if (this.statusType == "add") {
        url = url + `&dataStatus=${1}`;
      } else {
        url = url + `&dataStatus=${2}`;
      }
      let vm = this;
      const result = await this.$requestPost(url, params);
      if (result && result.code === 200) {
        if (this.statusType == "edit") {
          this.$message({
            message: "编辑成功",
            type: "success",
          });
        } else {
          this.$message({
            message: "新增成功",
            type: "success",
          });
        }
        console.log("refreshData");
        this.$store.commit("updateRefresh", true);
        this.$emit("close");
        // vm.$emit('refreshData')
        // this.$router.push({
        //   path: "/im/index",
        //   query: {
        //     tab: "four",
        //   },
        // });
      }
    },
    // 获取编辑完后的模板数据
    getTemplateData() {
      let modelList = this.$refs["deliveryTemplate"]?.$refs["form"]?.model.list;
      if (modelList) {
        let _templateId = this.ruleForm.temPlateId[1];
        if(this.statusType == "edit"&&!_templateId){
          _templateId = this.editTemplateId
        }
        modelList = [...modelList].map((item) => {
          return {
            patientId: this.patientInfo.id,
            templateId: _templateId,
            deptId: this.deptId,
            ...item,
          };
        });
      }
      //console.log(modelList);
      return modelList;
    },
    // 编辑时查询患者产检表
    async queryByPatientId(id) {
      this.templateLoading = true;
      const result = await this.$requestPost(
        `/cloud-consult/pregnancyPatient/queryByPatientId?id=${id}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          let _deptId = result.data[0]?.deptId || "";
          this.deptId = _deptId;
          this.editTemplateId = result.data[0]?.templateId || "";
          this.templateList = result.data.map((item) => {
            item = {
              id: item.id,
              deptId: item.deptId,
              pregnancyTime: item.pregnancyTime,
              attention: item.attention,
              commonInspect: item.commonInspect,
              concernCore: item.concernCore,
              gestationalWeek: item.gestationalWeek + "",
              inspectCore: item.inspectCore,
              pregnancyTestName: item.pregnancyTestName,
              specialInspect: item.specialInspect,
              status: item.status,
              treatmentProcess: item.treatmentProcess,
            };
            return item;
          });
          this.$nextTick(() => {
            this.updateBeforeData = this.getDiffData();
          });
        }
        this.templateLoading = false;
      }
    },
    //获取更新前的数据
    getDiffData() {
      let _ruleForm = JSON.stringify(this.ruleForm);
      let _modelList = this.getTemplateDataUpadate();
      _modelList = JSON.stringify(_modelList);
      return _ruleForm + _modelList;
    },
    //检查数据是否更新
    getTemplateDataUpadate() {
      let modelList = this.$refs["deliveryTemplate"]?.$refs["form"]?.model.list;
      if (modelList) {
        modelList = [...modelList].map((item) => {
          return {
            templateId: this.ruleForm.temPlateId[1],
            deptId: this.deptId,
            ...item,
          };
        });
      }
      return modelList;
    },
    // 模板正在加载表头数据
    templateHeaderDataLoad(val){
      if(val == 'start'){
        this.templateLoading = true
      }else if(val == 'end'){
        this.templateLoading = false
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.info-warp {
  display: block !important;
  .patient-warp {
    display: flex;
    justify-content: space-between;
    .btn-group {
      display: flex;
    }
  }
  .patient-info {
    display: flex;
    align-items: center;
    width: 100%;
    .patient-avatar {
      width: 32px;
      height: 32px;
      border-radius: 32px;
    }
    .patient-name {
      min-width: 42px;
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 20px;
      margin: 0 8px;
    }
    // .gestation-weeks-title {
    //   margin-right: 8px;
    // }
    .gestation-weeks-date {
      margin-right: 24px;
    }
    .gestation-weeks-title,
    .gestation-weeks-date {
      height: 17px;
      font-size: 12px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 17px;
    }
    .pa-patient-tabs--box {
      width: unset;
    }
    .btn-group {
      align-self: flex-end;
    }
  }
  .base-info {
    display: flex;
    align-items: center;
    margin-top: 16px;
    .base-content {
      display: flex;
      align-items: center;
      margin-bottom: 22px;
      .item {
        .title {
          width: 56px;
          height: 20px;
          font-size: 14px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
          .star {
            margin-right: 4px;
            width: 8px;
            height: 20px;
            font-size: 14px;
            // font-family: PingFangSC, PingFangSC-Regular;
            font-weight: 400;
            color: #f26334;
            line-height: 20px;
          }
        }
        .text {
          margin-right: 40px;
          height: 20px;
          font-size: 14px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #333333;
          line-height: 20px;
        }
      }
    }
  }
}
::v-deep.demo-ruleForm {
  .el-form-item {
    margin-bottom: 16px;
    .el-form-item__label {
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      height: 32px;
      line-height: 32px;
    }
    .el-form-item__content {
      height: 32px;
      line-height: 32px;
    }
  }
}

.btn-group {
  .pa-btn {
    &.go-back {
      color: #999999;
      i{
        margin-right: 4px;
      }
    }
    .icon-s_baocun,
    .icon-s_jiantouzuo2 {
      font-size: 12px;
    }
    .icon-s_jiantouzuo2 {
      color: #999999;
    }
  }
}
.divider-line {
  width: 100%;
  height: 1px;
  background: #ebebeb;
  border-radius: 1px;
}
::v-deep .el-loading-spinner .el-loading-text{
  color: #333;
}
</style>