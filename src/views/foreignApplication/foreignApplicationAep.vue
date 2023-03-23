<template>
  <div>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.masterKey" label="Master-APIkey">
          <el-input
            v-model="modelForm.masterKey"
            maxlength="50"
            clearable
            placeholder="请输入Master-APIkey"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.autoObserver" label="自动发现">
          <el-input
            v-model="modelForm.autoObserver"
            maxlength="50"
            clearable
            placeholder="请输入自动发现"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.productId" label="产品ID">
          <el-input
            v-model="modelForm.productId"
            maxlength="50"
            clearable
            placeholder="请输入产品ID"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.operator" label="操作员">
          <el-input
            v-model="modelForm.operator"
            maxlength="50"
            clearable
            placeholder="请输入操作员"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.method" label="产品模型服务方法">
          <el-input
            v-model="modelForm.method"
            maxlength="50"
            clearable
            placeholder="请输入产品模型服务方法"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.serviceId" label="产品模型服务Id">
          <el-input
            v-model="modelForm.serviceId"
            maxlength="50"
            clearable
            placeholder="请输入产品模型服务Id"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.ttl" label="ttl">
          <el-input
            v-model="modelForm.ttl"
            maxlength="50"
            clearable
            placeholder="请输入ttl"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="aepJson.level" label="设备等级">
          <el-input
            v-model="modelForm.level"
            maxlength="50"
            clearable
            placeholder="请输入设备等级"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "appAEP",
  props: {
    modelForm: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>