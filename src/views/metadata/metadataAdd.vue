<template>
  <div>
    <!-- https://httpbin.org/post -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="600px"
      :append-to-body="true"
      title="新增"
    >
      <el-form
        :model="metaDataObj"
        label-width="80px"
        ref="ruleForm"
        label-position="left"
        class="pa-ruleForm"
      >
        <el-form-item label="名称">
          <el-input v-model="metaDataObj.metadataName" placeholder="名称" />
        </el-form-item>

        <el-form-item label="状态">
          <el-switch v-model="metaDataObj.enable" class="drawer-switch" />
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="metaDataObj.description"
            :autosize="{ minRows: 2, maxRows: 4 }"
            type="textarea"
            placeholder="说明"
          />
        </el-form-item>
      </el-form>

      <div style="text-align: right; padding-right: 40px">
        <el-button type="danger" @click="Cancel"> 取消 </el-button>
        <el-button type="primary" @click="submitForm"> 保存 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addMetadata } from "@/api/metadata.js";
import metadataAdd from "./metadataAdd.vue";
export default {
  name: "metadataAdd",
  props: {
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      dialogVisible: false,
      rules: {
        metadataName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
      },
      metaDataObj: {
        id: "",
        enable: true,
        metadataName: "",
        description: "",
        metadata: JSON.stringify({ properties: [], functions: [], events: [] }),
      },
    };
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val;
      },
      immediate: true,
    },
    dialogVisible: {
      handler(val) {
        this.$emit("update:visible", val);
      },
      immediate: true,
    },
  },
  mounted() {},
  created() {},
  methods: {
    Cancel() {
      this.$emit("close");
    },
    // 保存按钮
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },
    submitData() {
      console.log("add", this.metaDataObj);
      addMetadata(this.metaDataObj)
        .then((res) => {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          let id = res.data.id;
          //   this.dialogVisible = false;
          this.$emit("close");
          this.$emit("gotoDetail", id); //发送信息刷新列表

          this.metaDataObj = {
            id: "",
            metadataName: "",
            description: "",
          };
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.pa-ruleForm {
  padding-left: 40px;
  padding-right: 40px;
}
.form-input {
  width: 100%;
}
</style>
