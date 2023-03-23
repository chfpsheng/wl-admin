<template>
  <el-form :model="modelForm" ref="editForm" :rules="rule" label-width="100px">
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="tenantName" label="租户名称">
          <Input
            v-model="modelForm.tenantName"
            placeholder="请输入租户名称"
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="tenantEmail" label="租户邮箱">
          <Input
            v-model="modelForm.tenantEmail"
            placeholder="请输入租户邮箱"
            maxlength="100"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="userName" label="用户名称">
          <Input
            v-model="modelForm.userName"
            placeholder="请输入用户名称"
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="userPhone" label="用户电话">
          <Input
            v-model="modelForm.userPhone"
            placeholder="请输入用户电话"
            type="tel"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="loginUser" label="账号信息">
          <Input
            v-model="modelForm.loginUser"
            placeholder="请输入账号信息"
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="loginPassword" label="密码">
          <Input
            v-model="modelForm.loginPassword"
            type="password"
            placeholder="请输入密码"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="faxNumber" label="传真">
          <Input
            v-model="modelForm.faxNumber"
            placeholder="请输入传真"
            maxlength="50"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="industry" label="行业">
          <Input
            v-model="modelForm.industry"
            placeholder="请输入行业"
            maxlength="100"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="24" style="border: none">
        <el-form-item prop="assetCertificate" label="资质证明">
          <Input
            v-model="modelForm.assetCertificate"
            placeholder="请输入资质证明"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="24" style="border: none">
        <el-form-item prop="remark" label="备注">
          <Input
            v-model="modelForm.remark"
            type="textarea"
            maxlength="200"
            show-word-limit
            placeholder="请输入备注"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { getTenantDetail, updateTenant, addTenant } from "@/api//tenant.js";

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
    const validatePhone = (rule, value, callback) => {
      if (value.trim() === "") {
        callback(new Error("请输入用户电话"));
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("请输入正确的用户电话"));
      } else {
        callback();
      }
    };
    return {
      modelForm: {
        id: this.id,
        tenantName: "",
        tenantEmail: "",
        userName: "",
        userPhone: "",
        assetCertificate: "",
        faxNumber: "",
        loginUser: "",
        loginPassword: "",
        industry: "",
        remark: "",
      },
      rule: {
        tenantName: [
          { required: true, message: "请输入租户名称", trigger: "blur" },
        ],
        tenantEmail: [
          { required: true, message: "请输入租户邮箱", trigger: "blur" },
          { type: "email", message: "邮箱格式不正确", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
        ],
        userPhone: {
          required: true,
          validator: validatePhone,
          trigger: "blur",
        },
        loginUser: [
          { required: true, message: "请输入账号信息", trigger: "blur" },
        ],
        loginPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
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
    this.init();
  },
  methods: {
    init() {
      if (this.id) {
        this.$emit("SetTitle", "编辑租户信息");
      } else {
        this.$emit("SetTitle", "新增租户信息");
      }
      this.$emit("SetPageWidth", 700);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        getTenantDetail(this.id).then((res) => {
          this.modelForm = res.data;
        });
      }
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          if (this.id) {
            updateTenant(this.modelForm)
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
            addTenant(this.modelForm)
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
  },
};
</script>
