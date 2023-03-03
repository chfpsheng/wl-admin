<template>
  <div>
    <pa-drawer
      title="管家备注"
      :visible.sync="visible"
      @close="close"
      @ok="submitForm"
      @cancel="cancleAdd"
    >
      <div class="drawer-content">
        <el-form
          label-position="top"
          ref="ruleForm"
          :model="ruleForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="管家备注" prop="orderMark">
            <el-input
              v-model="ruleForm.orderMark"
              type="textarea"
              placeholder="输入备注"
              maxlength="500"
              show-word-limit
              class="pa-input form-input"
              :autosize="{ minRows: 5, maxRows: 16 }"
            />
          </el-form-item>
          <el-form-item label="服务状态" prop="serviceState" v-if="showServiceState">
            <el-select
              class="pa-select filter-select"
              v-model="ruleForm.serviceState"
              placeholder="请选择"
            >
              <el-option
                v-for="item in serviceStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </pa-drawer>
  </div>
</template>
<script>
export default {
  name: "OrderMark",
  props: {
    initInfo: {
      type: Object,
      default: () => {},
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      serviceStatusOptions: [
        { value: 2, label: "待使用" },
        { value: 1, label: "已完成" },
        { value: 3, label: "使用中" },
      ],
      ruleForm: {
        orderMark: "",
        serviceState: null
      },
      rules: {},
      orderId: "",
      showServiceState:false,
    };
  },
  mounted() {
    if (this.initInfo?.order?.id) {
      this.orderId = this.initInfo?.order?.id;
      this.ruleForm.orderMark = this.initInfo?.order?.adminRemark;
    }
    console.log(777777777777, this.initInfo.order.payStatus)
    if(this.initInfo?.order?.payStatus==1 || this.initInfo?.order?.payStatus==6){
       this.showServiceState = true;
       this.ruleForm.serviceState = this.initInfo?.order?.useStatus?Number(this.initInfo.order.useStatus):null;
    }  
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submitForm() {
      this.updateOrder();
    },
    cancleAdd() {
      this.close();
    },
    // 更新数据
    async updateOrder() {
      const params = {
        id: this.orderId,
        adminRemark: this.ruleForm.orderMark
      };
      if(this.showServiceState){
        params.useStatus = this.ruleForm.serviceState
      }
      let _url = "/cloud-hmall/order/update";
      const result = await this.$requestPost(`${_url}`, params);
      if (result && result.code === 200) {
        this.$message({
          message: "管家备注成功",
          type: "success",
        });
        this.$emit("save-success");
        this.cancleAdd();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.drawer-content {
  margin-top: 12px;
  font-size: 14px;
  padding-left: 20px;
  margin-right: 20px;
  .pa-select {
    width: 100%;
  }
}
</style>