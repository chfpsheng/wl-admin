<template>
  <div class="app-container">
    <div class="filter-container filter-box search-part">
      <el-form
        ref="ruleForm"
        :inline="true"
        :model="formInline"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-form-item label="所属科室" prop="deptId">
          <el-select
            class="pa-select common-input"
            v-model="formInline.deptId"
            placeholder="请选择所属科室"
          >
            <el-option
              v-for="(item, index) in deptOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="模板名称" prop="templateName">
          <el-input
            class="pa-input common-input"
            v-model="formInline.templateName"
            placeholder="请输入模板名称"
            maxlength="20"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            class="pa-input common-input"
            v-model="formInline.mark"
            placeholder="请输入备注"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <div class="btn-group">
          <el-button class="pa-btn go-back" @click="goBackBtn"
            ><i class="iconfont icon-s_jiantouzuo2"></i>
            返回
          </el-button>
          <el-button type="primary" class="pa-btn" @click="saveBtn">
            <i class="iconfont icon-s_baocun"></i>
            保存
          </el-button>
        </div>
      </el-form>
    </div>
    <div class="delivery-template" :style="{ height: tableHeight + 'px' }">
      <delivery-template
        v-if="formInline.deptId"
        v-loading="templateLoading"
        element-loading-text="加载中..."
        :deptId="formInline.deptId"
        :initTemplateData="templateList"
        ref="deliveryTemplate"
      />
    </div>
  </div>
</template>
<script>
/*
 *新增和编辑产检模板
 */
import baseDataMixin from "@/mixins/baseData";
import DeliveryTemplate from "./template2.vue";
export default {
  components: {
    DeliveryTemplate,
  },
  mixins: [baseDataMixin],
  data() {
    return {
      formInline: {
        deptId: "",
        templateName: "",
        mark: "",
      },
      rules: {
        deptId: [
          { required: true, message: "请选择所属科室", trigger: "change" },
        ],
        templateName: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
        ],
      },
      deptOptions: [],
      templateList: [], //模板列表行数据
      templateEditData: null,
      tableHeight: 0,
      updateBeforeData: "",
      updateAfterData: "",
      templateLoading: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(208);
    });
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(208);
    };
    // 监听浏览器是否关闭
    // let that = this;
    // window.addEventListener("beforeunload", function(e){
    //   that.browerStatus(e);
    // });
    let _id = this.$route.query?.id;
    let _headerData = localStorage.getItem("template_edit_data");
    if (_id && _headerData) {
      this.templateEditData = JSON.parse(_headerData);
      this.formInline.deptId = this.templateEditData.deptId;
      this.formInline.templateName = this.templateEditData.templateName;
      this.formInline.mark = this.templateEditData.mark;
      this.getEditData(_id);
    }
    this.initData();
    this.$nextTick(() => {
      this.updateBeforeData = this.getDiffData();
    });
  },
  methods: {
    // 监听浏览器是否关闭
    browerStatus(e) {
      var message = "some word";
      e = e || window.event;
      if (e) {
        e.returnValue = message;
      }
      console.log("浏览器刷新 || 关闭了");
      return "浏览器关闭！";
    },
    async initData() {
      this.deptOptions = await this.deptDataMixins(); // 科室
    },
    // 编辑时查询详情
    async getEditData(_id) {
      const params = {
        id: _id,
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
            this.templateLoading = false;
          });
        }
      }
    },
    // 返回
    goBackBtn() {
      this.updateAfterData = this.getDiffData();
      console.log(this.updateAfterData);
      console.log(this.updateBeforeData);
      if (this.updateAfterData == this.updateBeforeData) {
        this.$router.push({
          path: "/template/index",
        });
        return;
      }
      this.$confirm(`当前数据未保存，确定返回?`, "确定返回", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$router.push({
          path: "/template/index",
        });
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
            this.$confirm(`还未添加产检日程，是否确定保存`, "确定保存", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(() => {
              this.addAndEdit(_modleList);
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
    async addAndEdit(list = []) {
      const params = {
        testTemplate: {
          deptId: this.formInline.deptId,
          templateName: this.formInline.templateName,
          mark: this.formInline.mark,
        },
        list: [...list],
      };
      let url = "/cloud-consult/pregnancy/insert";
      if (this.$route?.query?.id) {
        url = "/cloud-consult/pregnancy/update";
        params.testTemplate["id"] = this.$route.query.id;
        params.testTemplate["status"] = this.templateEditData.status ? 1 : 0;
      }
      const result = await this.$requestPost(url, params);
      if (result && result.code === 200) {
        if (this.$route?.query?.id) {
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

        this.$router.push({
          path: "/template/index",
        });
      }
    },
    getTemplateData() {
      let modelList = this.$refs["deliveryTemplate"]?.$refs["form"]?.model.list;
      //console.log(modelList);
      return modelList;
    },
    //获取更新前的数据
    getDiffData() {
      let _formInline = JSON.stringify(this.formInline);
      let _modelList = this.getTemplateData();
      _modelList = JSON.stringify(_modelList);
      return _formInline + _modelList;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .demo-form-inline {
  display: flex;
  width: 100%;
  .el-form-item {
    margin-bottom: 0px;
  }
}
::v-deep.common-input {
  .el-input__inner {
    width: 200px;
  }
}
.delivery-template {
  padding: 0 24px;
  background: #fff;
  height: inherit;
  padding-bottom: 24px;
}
.search-part {
  display: flex;
  justify-content: space-between;
}
::v-deep.demo-form-inline {
  .el-form-item {
    margin-right: 40px;
  }
  .el-form-item__label {
    height: 20px;
    font-size: 14px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #333333;
  }
}
::v-deep.btn-group {
  background: #fff;
  text-align: right;
  flex: 1;
  .pa-btn {
    &.go-back {
      color: #999999;
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
::v-deep .el-loading-spinner .el-loading-text {
  color: #333;
}
@media screen and (max-width: 1371px){
  .el-form--inline,.btn-group{
    display: block;
  }
  .btn-group {
    margin-top: 16px;
  }
}
</style>