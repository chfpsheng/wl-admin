<template>
  <div>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.appSecret" label="应用密钥">
          <el-input
            v-model="modelForm.appSecret"
            maxlength="50"
            clearable
            placeholder="请输入应用密钥"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.model" label="产品模型型号">
          <el-input
            v-model="modelForm.model"
            maxlength="50"
            clearable
            placeholder="请输入产品模型型号"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.protocolType" label="产品模型协议类型">
          <el-input
            v-model="modelForm.protocolType"
            maxlength="50"
            clearable
            placeholder="请输入产品模型协议类型"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.method" label="产品模型命令">
          <el-input
            v-model="modelForm.method"
            maxlength="50"
            clearable
            placeholder="请输入产品模型命令"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.serviceId" label="产品模型服务ID">
          <el-input
            v-model="modelForm.serviceId"
            maxlength="50"
            clearable
            placeholder="请输入产品模型服务Id"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.deviceType" label="产品模型设备类型">
          <el-input
            v-model="modelForm.deviceType"
            maxlength="50"
            clearable
            placeholder="请输入产品模型设备类型"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.manufacturerId" label="产品模型厂商ID">
          <el-input
            v-model="modelForm.manufacturerId"
            maxlength="50"
            clearable
            placeholder="请输入产品模型厂商ID"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.manufacturerName" label="产品模型厂商名称">
          <el-input
            v-model="modelForm.manufacturerName"
            maxlength="50"
            clearable
            placeholder="请输入产品模型厂商名称"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.cmdMode" label="命令模式">
          <el-input
            v-model="modelForm.cmdMode"
            maxlength="50"
            clearable
            placeholder="请输入命令模式"
          />
        </el-form-item>
      </el-col>
      <el-col span="12" style="border: none">
        <el-form-item prop="ocJson.cmdWord" label="命令码">
          <el-input
            v-model="modelForm.cmdWord"
            maxlength="50"
            clearable
            placeholder="请输入命令码"
          />
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "appOC",
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