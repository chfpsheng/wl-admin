<template>
  <div>
    <pa-drawer
      title="属性定义"
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
          <el-form-item label="标志" prop="standardOutKey">
            <el-input
              v-model="ruleForm.standardOutKey"
              class="pa-input form-input"
            />
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input
              :disabled="ruleForm.name"
              v-model="ruleForm.name"
              class="pa-input form-input"
            />
          </el-form-item>
          <el-form-item label="数据类型" prop="name">
            <pa-select
              :value.sync="ruleForm.valueType.type"
              :options="typeList"
            ></pa-select>
          </el-form-item>
          <el-form-item label="说明" prop="description">
            <el-input
              v-model="ruleForm.description"
              :autosize="{ minRows: 2, maxRows: 4 }"
              type="textarea"
              placeholder="说明"
            />
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
    addFlag: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      ruleForm: {
        description: "",
        name: "",
        standardOutKey: "",
        decodeMatchKey: "",
        valueType: {
          //值类型
          type: "double", //类型标识,见类型表
          scale: 2, //精度
          unit: "percent", //单位
        },
      },
      typeList: [
        {
          label: "int(整数型)",
          value: "int",
          scale: 2,
          unit: "percent",
        },
        {
          label: "float(单精度浮点型)",
          value: "floats",
          scale: 2,
          unit: "percent",
        },
        {
          label: "double(双精度浮点数)",
          value: "double",
          scale: 2,
          unit: "percent",
        },
        {
          label: "text(字符串)",
          value: "text",
          scale: 2,
          unit: "percent",
        },
        {
          label: "boolean(布尔型)",
          value: "boolean",
          scale: 2,
          unit: "percent",
        },
        {
          label: "date(时间型)",
          value: "date",
          scale: 2,
          unit: "percent",
        },
      ],
      rules: {},
    };
  },
  mounted() {
    if (!this.addFlag) {
      this.ruleForm = this.initInfo;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    submitForm() {
      console.log(this.ruleForm);
      if (this.addFlag) {
        this.ruleForm.decodeMatchKey = this.ruleForm.standardOutKey;
      }

      this.$emit("save-success", this.ruleForm, this.addFlag);

      this.$emit("close");
    },
    cancleAdd() {
      this.close();
    },
    // 更新数据
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