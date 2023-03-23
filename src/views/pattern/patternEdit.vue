<template>
  <el-form
    :model="modelForm"
    ref="editForm"
    class="ivu-form-no-margin-bottom"
    :rules="rule"
    label-width="120px"
  >
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="commCode" label="通信方式代码">
          <el-input
            v-model="modelForm.commCode"
            placeholder="请输入通信方式代码"
            maxlength="50"
            clearable
            :disabled="isReadonly"
            @keyup.native="
              modelForm.commCode = modelForm.commCode.replace(
                /[^A-Za-z0-9_]/g,
                ''
              )
            "
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="commName" label="通信方式描述">
          <el-input
            v-model="modelForm.commName"
            placeholder="请输入通信方式描述"
            maxlength="50"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import {
  getCommPatternDetail,
  addCommPattern,
  queryCommPatternList,
  updateCommPattern,
} from "@/api/pattern.js";

export default {
  props: {
    id: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      commCodeList: [], //
      isReadonly: false,
      modelForm: {
        id: this.id,
        commCode: "",
        commName: "",
      },
      rule: {
        commCode: [
          { required: true, message: "请选择通信方式代码", trigger: "blur" },
        ],
        commName: [
          { required: true, message: "请输入通信方式描述", trigger: "blur" },
        ],
      },
      actions: [
        {
          text: "保存",
          theme: "primary",
          handle: () => {
            this.save();
          },
          loading: false,
        },
        {
          text: "取消",
          theme: "default",
          handle: () => {
            this.$emit("Close");
          },
        },
      ],
    };
  },
  mounted() {
    this.getCommCodeList();
    this.init();
  },
  methods: {
    init() {
      if (this.id) {
        this.isReadonly = true;
        this.$emit("SetTitle", "编辑通信方式信息");
      } else {
        this.isReadonly = false;
        this.$emit("SetTitle", "新增通信方式信息");
      }
      this.$emit("SetPageWidth", 700);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        getCommPatternDetail(this.id).then((res) => {
          this.modelForm = res.data;
        });
      }
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          if (this.id) {
            updateCommPattern(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success({
                    content: "保存成功",
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$message.error({
                    content: "修改失败，" + res.msg,
                    duration: 3,
                  });
                }
              })
              .finally(() => {
                this.actions[0].loading = false;
              });
          } else {
            addCommPattern(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$message.success({
                    content: "新增成功",
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$message.error({
                    content: "新增失败，" + res.msg,
                    duration: 3,
                  });
                }
              })
              .finally(() => {
                this.actions[0].loading = false;
              });
          }
        }
      });
    },
    getCommCodeList() {
      queryCommPatternList({}).then((res) => {
        this.commCodeList = res.data;

        x;
      });
    },
  },
};
</script>
