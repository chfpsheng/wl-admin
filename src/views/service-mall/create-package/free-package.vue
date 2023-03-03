<template>
  <div class="free-package">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="132px"
      class="pa-ruleForm"
    >
      <el-form-item label="套餐名称" prop="name">
        <el-input
          v-model="ruleForm.name"
          placeholder="输入套餐名称30字以内"
          clearable
          class="pa-input form-input"
        />
      </el-form-item>
      <el-form-item label="所属科室" prop="departmentId">
        <pa-select
          :value.sync="ruleForm.departmentId"
          :options="deptOptions"
          class="form-long-select"
          placeholder="选择所属科室"
          @change="departmentChange"
        />
      </el-form-item>
      <el-form-item label="排序" prop="displayOrder">
        <el-input-number
          v-model="ruleForm.displayOrder"
          :min="1"
          :step="1"
          step-strictly
          :controls="false"
          class="pa-input form-input form--number-input"
        />
      </el-form-item>
      <el-form-item label="套餐首图" prop="coverImg">
        <span class="form-item-tips"
          >上传png、jpg、jpeg格式图片，1M以内大小，只能上传一张；建议尺寸580*580</span
        >
        <upload-img
          :limit="1"
          :img-list="coverImgList"
          @fileChange="coverImgChange"
        />
      </el-form-item>
      <el-form-item label="内部备注" prop="introduction">
        <el-input
          v-model="ruleForm.introduction"
          type="textarea"
          placeholder="输入服务内部备注"
          maxlength="50"
          show-word-limit
          class="pa-input form-input"
          :autosize="{ minRows: 4, maxRows: 8 }"
        />
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button
        class="pa-btn"
        type="primary"
        :loading="comfirmLoading"
        @click="submitForm('ruleForm')"
        >提交</el-button
      >
      <el-button class="pa-btn" @click="resetForm('ruleForm')">返回</el-button>
    </div>
  </div>
</template>
<script>
import baseDataMixin from "@/mixins/baseData";
export default {
  name: "FreePackage",
  mixins: [baseDataMixin],
  data() {
     // 校验序号
    var validateSN = (rule, value, callback) => {
      if (value && value < 1) {
        return callback(new Error("序号不能小于1"));
      } else if (value && value > 99999) {
        callback(new Error("序号最大为5位数字"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        name: "",
        departmentId: "",
        coverImg: "",
        introduction: "",
        displayOrder: 1,
      },
      rules: {
        name: [
          this.ValidateRules.InputProNameRequired,
          this.ValidateRules.LengthThirty,
        ],
        departmentId: [this.ValidateRules.SelectDepartmentRequired],
        coverImg: [this.ValidateRules.ImgRequired],
        introduction: [
          { required: true, message: "请输入内部备注", trigger: "blur" },
        ],
        displayOrder: [{ validator: validateSN, trigger: "blur" }]
      },
      coverImgList: [],
      deptOptions: [],
      comfirmLoading: false,
    };
  },
  created() {
    this.initData();
  },
  mounted() {},
  methods: {
    async initData() {
      this.deptOptions = await this.deptDataMixins(); // 科室
      if (this.$route?.query?.id) {
        this.initEdit();
      }
    },
    // 编辑初始化
    async initEdit() {
      const result = await this.$requestPost(
        `/cloud-hmall/product/get?id=${this.$route.query.id}`,
        {}
      );
      if (result && result.code === 200) {
        this.ruleForm = {
          id: result.data.product.id,
          name: result.data.product.name,
          departmentId: result.data.product.departmentId,
          coverImg: result.data.product.coverImg,
          introduction: result.data.product.introduction,
          displayOrder:result.data.product.displayOrder,
        };
        const coverImgArr = this.ruleForm.coverImg.split(",");
        this.coverImgList = coverImgArr.map((item) => {
          item = {
            url: item,
          };
          return item;
        });
        console.log(this.ruleForm)
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addData();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      // this.$refs[formName].resetFields();
      this.linkList();
    },
    // 图片事件
    coverImgChange(data) {
      this.ruleForm.coverImg = data.join(",");
      this.validateCoverImg();
    },
    validateCoverImg() {
      this.$refs.ruleForm.validateField("coverImg", (err) => {
        if (!err) {
          return true;
        } else {
          return false;
        }
      });
    },
    // 选择科室
    departmentChange(val) {
      const obj = this.deptOptions.find((item) => item.value === val);
      this.ruleForm.departmentName = obj.label;
    },
    //新增和更新接口
    async addData() {
      this.comfirmLoading = true;
      !this.$route.query.id ? delete this.ruleForm.id : "";
      const postUrl = !this.$route.query.id
        ? "/cloud-hmall/product/insert"
        : "/cloud-hmall/product/update";
      const params = {
        ...this.ruleForm,
        type: 0,
      };
      const result = await this.$requestPost(postUrl, params);
      if (result && result.code === 200) {
        this.$message({ message: "提交成功", type: "success" });
        this.linkList();
      }
      this.comfirmLoading = false;
    },
    // 跳转到列表页
    linkList() {
      this.$router.push({
        path: "/serviceMall",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.free-package {
  background-color: #ffffff;
  padding-bottom: 60px;
  .btn-group {
    margin-left: 297px;
    .el-button + .el-button {
      margin-left: 24px;
    }
  }
}
.form-item-tips {
  display: inline-block;
  color: #999;
  margin-bottom: 4px;
}
</style>