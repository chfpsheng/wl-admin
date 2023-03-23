<template>
  <div class="run-modal-style">
    <el-form
      label-width="100px"
      :model="formValidate"
      :rules="ruleValidate"
      class="formTabelList"
      ref="formList"
    >
      <Row :gutter="24" justify="center">
        <i-col span="12">
          <el-form-item label="代码名称" class="el-form-item" prop="codeName">
            <Input
              placeholder="请输入代码名称"
              v-model="formValidate.codeName"
              maxlength="16"
            />
          </el-form-item>
        </i-col>
        <i-col span="12">
          <el-form-item label="代码值" class="el-form-item" prop="codeValue">
            <Input
              placeholder="请输入代码值"
              v-model="formValidate.codeValue"
              maxlength="16"
            />
          </el-form-item>
        </i-col>
      </Row>
      <Row :gutter="24" justify="center">
        <i-col span="12">
          <el-form-item label="排序值" class="el-form-item" prop="fieldSort">
            <Input
              placeholder="请输入排序值"
              v-model="formValidate.fieldSort"
              maxlength="8"
            />
          </el-form-item>
        </i-col>
      </Row>
    </el-form>
  </div>
</template>
<script>
// import { px2wpx } from "@/utils/utils";
// import { memberCompanyHttp, createTabelListHttp } from "@/apis/common.api";
export default {
  components: {},
  props: {
    title: {
      type: String,
      default() {
        return "";
      },
    },
    typeCode: { type: String },
    level: { type: String },
    selectedRow: { type: Object },
    treeNodeId: { type: String },
    ceateType: { type: String },
  },
  data() {
    return {
      spinShow: false,
      companyList: [],
      formValidate: {
        codeName: "",
        codeValue: "",
        endTime: "",
        startTime: "",
        fieldSort: "",
        remarks1: "",
        pid: "",
        orgNo: "",
      },
      ruleValidate: {
        codeName: [{ required: true, message: "请输入代码名称" }],
        codeValue: [{ required: true, message: "请输入代码值" }],
        startTime: [
          {
            validator: (rule, value) => {
              return new Promise((resolve, reject) => {
                if (
                  new Date(value).getTime() >
                  new Date(this.formValidate.endTime)
                ) {
                  reject("生效期必须在失效期前");
                } else {
                  resolve();
                }
              });
            },
          },
        ],
        endTime: [
          {
            validator: (rule, value) => {
              return new Promise((resolve, reject) => {
                if (
                  new Date(value).getTime() <
                  new Date(this.formValidate.startTime)
                ) {
                  reject("生效期必须在失效期前");
                } else {
                  resolve();
                }
              });
            },
          },
        ],
      },
    };
  },
  created() {
    /*  memberCompanyHttp().then((result) => {
      if (result.status == 200) {
        if (result.status == 200) {
          this.companyList = result.data.dataResult || [];
        }
      }
    }); */

    if (this.$props.ceateType == "edit") {
      let row = this.$props.selectedRow;
      this.formValidate.codeName = row.codeName;
      this.formValidate.codeValue = row.codeValue;
      /*    this.formValidate.endTime = row.endTime;
      this.formValidate.startTime = row.startTime;
      this.formValidate.remarks1 = row.remarks1;
      this.formValidate.pid = row.pid; */
      this.formValidate.fieldSort = row.fieldSort;
      this.formValidate.orgNo = row.orgNo;
      this.formValidate.typeCode = row.typeCode;
    } else {
      this.formValidate.typeCode = this.typeCode;
    }
    this.$emit("SetTitle", "新增代码类型");
    this.$emit("SetPageWidth", 800);
    this.$emit("SetPageActions", [
      {
        text: "保存",
        theme: "primary",
        handle: () => {
          this.formValidae().then(() => {
            let paramsObj = {};
            paramsObj.standardCodeTypeId = this.$props.treeNodeId;
            if (
              this.$props.ceateType == "add" &&
              this.$props.level == "lowerLevel"
            ) {
              paramsObj.pid = this.$props.selectedRow.standardCodeListId;
            }
            if (this.$props.ceateType == "edit") {
              paramsObj.standardCodeListId =
                this.$props.selectedRow.standardCodeListId;
            }
            let params = Object.assign(this.formValidate, paramsObj);
            this.spinShow = true;
            // createTabelListHttp(params)
            //   .then((resultData) => {
            //     this.$parent.actions[1].disabled = false;
            //     this.spinShow = false;

            //     if (resultData.data.code == "0") {
            //       this.$Message.success(resultData.data.msg);
            //       this.$emit("Close", {
            //         state: "save",
            //         ceateType: this.$props.ceateType,
            //       });
            //     } else {
            //       this.$Message.error(resultData.data.msg);
            //     }
            //   })
            //   .catch((err) => {
            //     this.spinShow = false;
            //     this.$Message.error(err);
            //   });
          });
        },
      },
      {
        text: "取消",
        theme: "default",
        handle: () => {
          this.$emit("Close", { state: "close" });
        },
      },
    ]);
  },
  methods: {
    px2wpx(width) {
      return px2wpx(width);
    },
    formValidae() {
      return new Promise((resolve, reject) => {
        this.$refs.formList.validate((valid) => {
          if (!valid) {
            this.$Message.error("表单验证未通过，请修改!");
            reject();
          } else {
            resolve();
          }
        });
      });
    },
    startTimeChange(time) {
      this.formValidate.startTime = time;
    },
    endTimeChange(time) {
      this.formValidate.endTime = time;
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
