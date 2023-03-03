<template>
  <div>
    <el-dialog
      :title="sensitiveInfoInit.title"
      :visible.sync="visible"
      :close-on-click-modal="false"
      width="400px"
      @close="handleClose"
    >
      <div class="sensitive-container">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="demo-ruleForm"
        >
          <el-form-item prop="inputValue">
            <el-input
              class="pa-input"
              placeholder="请输入内容"
              v-model="ruleForm.inputValue"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="btn-cnt">
          <el-button class="pa-btn" type="primary" @click="updateInfo"
            >确定</el-button
          >
          <el-button class="pa-btn" @click="handleClose">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/*
*由于接口及字段不一样暂时不抽出该组件
 */
import { checkIDCard } from '@/utils/validate'
const validatePhone = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入手机号"));
  } else {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error("请输入正确的手机号"));
    } else {
      callback();
    }
  }
};
const validID = (rule, value, callback) => {
  if (value === "") {
    callback(new Error("请输入身份证号"));
  } else if (!checkIDCard(value)) {
    callback(new Error("身份证号码不正确"));
  } else {
    callback();
  }
};
export default {
  name: "SensitiveInfo",
  model: {
    prop: "visible",
    event: "change",
  },
  props: {
    visible: {
      default: false,
      type: Boolean,
    },
    sensitiveInfoInit: {
      type: Object,
      default: function () {
        return {
          title: "修改手机号",
          data: null,
        };
      },
    },
  },
  data() {
    return {
      ruleForm: {
        inputValue: "",
      },
      rules: {
        inputValue: [],
      },
      queryInfo:null,//查询返回的信息
    };
  },
  mounted() {
    if (this.sensitiveInfoInit.title == "修改手机号") {
      this.rules.inputValue = [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: validatePhone, trigger: "blur" },
      ];
    } else if (this.sensitiveInfoInit.title == "修改身份证号") {
      this.rules.inputValue = [
        { required: true, message: "请输入身份证号", trigger: "blur" },
        { validator: validID, trigger: "blur" },
      ];
    }
    this.getInfo();
  },
  methods: {
    // 查询信息
    async getInfo() {
      let url = `/cloud-user/sysUser/get`
      const result = await this.$requestPost(
        `${url}?id=${this.sensitiveInfoInit?.data?.id}`
      );
      if (result && result.code === 200) {
        this.queryInfo = JSON.parse(JSON.stringify(result.data))
        if (this.sensitiveInfoInit.title == "修改手机号") {
          this.ruleForm.inputValue = result.data?.phone;
        } else if (this.sensitiveInfoInit.title == "修改身份证号") {
          this.ruleForm.inputValue = result.data?.idCard;
        }
      }
    },
    // 更新信息
    updateInfo() {
      this.$refs["ruleForm"].validate(async (valid) => {
        if (valid) {
          const result = await this.$requestPost(
            `/cloud-user/sysUser/updatePhone?id=${this.sensitiveInfoInit?.data?.id}&phone=${this.ruleForm.inputValue}`,
           // params
          );
          if (result && result.code === 200) {
            this.$message({ message: "修改成功", type: "success" });
          }
          this.handleClose();
          this.$emit("updateList"); //修改完成后需要更新列表
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs["ruleForm"].resetFields();
    },
    handleClose() {
      this.$emit("change", false);
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0px;
}
.sensitive-container {
  padding: 24px;
  .btn-cnt {
    text-align: right;
    margin-top: 24px;
  }
}
</style>
