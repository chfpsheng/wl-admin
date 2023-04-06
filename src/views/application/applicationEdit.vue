<template>
  <el-form :model="modelForm" ref="editForm" :rules="rule" label-width="100">
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="ecsTenantId" label="租户名称">
          <el-select
            v-model="modelForm.ecsTenantId"
            clearable
            filterable
            placeholder="请选择租户名称"
            transfer
          >
            <el-option
              v-for="item in tenantList"
              :key="item.id"
              :value="item.id"
              >{{ item.tenantName }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="applicationCode" label="应用编码">
          <el-input
            v-model.trim="modelForm.applicationCode"
            maxlength="50"
            clearable
            @keyup.native="
              modelForm.applicationCode = modelForm.applicationCode.replace(
                /[^A-Za-z0-9_\-]/g,
                ''
              )
            "
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="applicationName" label="应用名称">
          <el-input
            v-model.trim="modelForm.applicationName"
            maxlength="50"
            clearable
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="description" label="描述">
          <el-input
            v-model.trim="modelForm.description"
            maxlength="100"
            clearable
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="certification" label="证书">
          <el-input v-model.trim="modelForm.certification" clearable />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="24" style="border: none">
        <el-form-item prop="remark" label="备注">
          <el-input
            v-model.trim="modelForm.remark"
            type="textarea"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-col>
    </el-row>
  </el-form>
</template>
<script>
import { applicationApi } from "@/api/application.js";
import { valueSet } from "@/api/valueSet.js";
import { tenantApi } from "@/api/tenant.js";
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
    // const validateApplicationCode = (rule, value, callback) => {
    //   let reg = /^[a-z0-9]+$/i;
    //   if (value.trim() === '') {
    //     callback(new Error('请输入应用编码'));
    //   }
    //   else if (!reg.test(value)) {
    //     callback(new Error('应用编码只能为字母或数字'));
    //   } else {
    //     callback();
    //   }
    // };
    return {
      tenantList: [],
      // accessModeList: [],
      modelForm: {
        id: this.id,
        ecsTenantId: "",
        applicationCode: "",
        applicationName: "",
        description: "",
        certification: "",
        // accessMode: "",
        remark: "",
      },
      rule: {
        ecsTenantId: [
          { required: true, message: "请选择租户名称", trigger: "change" },
        ],
        applicationCode: [
          { required: true, message: "请选择应用编码", trigger: "blur" },
        ],
        applicationName: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
        ],
        // accessMode: [
        //   { required: true, message: "请选择接入方式", trigger: "change" },
        // ],
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
    this.getTenantList();
    // this.getAccessModeList()
  },
  methods: {
    init() {
      if (this.id) {
        this.$emit("SetTitle", "编辑应用信息表");
      } else {
        this.$emit("SetTitle", "新增应用信息表");
      }
      this.$emit("SetPageWidth", 700);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        applicationApi.getApplicationDetail(this.id).then((res) => {
          this.modelForm = res.data;
        });
      }
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          if (this.id) {
            applicationApi
              .updateApplication(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: "保存成功",
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$Message.error({
                    content: "修改失败，" + res.msg,
                    duration: 3,
                  });
                }
              })
              .finally(() => {
                this.actions[0].loading = false;
              });
          } else {
            applicationApi
              .addApplication(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: "新增成功",
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$Message.error({
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
    getTenantList() {
      tenantApi.queryTenantList({}).then((res) => {
        this.tenantList = res.data;
      });
    },
    //获取接入方式
    // getAccessModeList() {
    //   valueSetApi.getValueSet({ vsCode: "ACCESS_MODE" }).then((res) => {
    //     this.accessModeList = res.data;
    //   });
    // },
  },
};
</script>
