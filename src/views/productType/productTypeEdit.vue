<template>
  <div>
    <!-- https://httpbin.org/post -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="600px"
      :append-to-body="true"
      :title="dialogType === 'edit' ? '编辑分类' : '新增分类'"
    >
      <el-form
        :model="productTypeObj"
        label-width="80px"
        ref="ruleForm"
        :rules="rules"
        label-position="left"
        class="pa-ruleForm"
      >
        <el-form-item label="名称" prop="sortName">
          <el-input v-model="productTypeObj.sortName" placeholder="名称" />
        </el-form-item>
        <el-form-item label="序号">
          <el-input-number
            v-model="productTypeObj.sortIndex"
            :min="1"
            :step="1"
            step-strictly
            :controls="false"
            class="pa-input form-input form--number-input"
          />
        </el-form-item>
        <el-form-item label="物模型" prop="metadataId">
          <pa-select
            :value.sync="productTypeObj.metadataId"
            :options="metadataList"
          ></pa-select>
        </el-form-item>
        <el-form-item label="父节点">
          <el-input
            v-model="productTypeObj.parentName"
            disabled
            placeholder="名称"
          />
        </el-form-item>
        <el-form-item label="说明">
          <el-input
            v-model="productTypeObj.description"
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
// import { getToken } from 'api/qiniu'
import { getProductTypeList, addType, updateType } from "@/api/productType.js";
import { findMetadataPageList } from "@/api/metadata.js";

export default {
  name: "productTypeEdit",
  props: {
    dialogType: {
      type: String,
      default: "add",
    },
    item: {
      type: Object,
    },
    visible: {
      type: Boolean,
    },
  },
  data() {
    return {
      metadataList: [],
      dialogVisible: false,
      rules: {
        sortName: [
          { required: true, message: "名称不能为空", trigger: "blur" },
        ],
        sortIndex: [
          { required: true, message: "序号不能为空", trigger: "blur" },
        ],
        metadataId: [
          { required: true, message: "请选择物模型", trigger: "blur" },
        ],
      },
      productTypeObj: {
        id: "",
        sortName: "",
        sortIndex: 1,
        name: "",
        seq: "",
        description: "",
        metadataId: "",
        parentId: "",
        parentName: "",
        sortLevel: "",
      },
    };
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val;
        console.log("visible", this.dialogVisible);
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
  mounted() {
    this.productTypeObj = { ...this.item };
    console.log("222", this.productTypeObj);
  },
  created() {
    this.getMetadataList();
    this.productTypeObj = { ...this.item };
    console.log("333", this.productTypeObj);
  },
  methods: {
    getMetadataList() {
      findMetadataPageList().then((res) => {
        console.log(res);
        let arr = res.data;

        arr.map((item) => {
          this.metadataList.push({
            label: item.metadataName,
            value: item.id,
          });
        });
      });
    },
    Cancel() {
      this.$emit("close");
    },
    // 保存按钮
    submitForm() {
      console.log("4444", this.$refs["ruleForm"]);
      this.$refs["ruleForm"].validate((valid) => {
        console.log(valid);
        if (valid) {
          this.submitData();
        } else {
          return false;
        }
      });
    },

    submitData() {
      let obj = {};
      obj.id = this.productTypeObj.id;
      obj.sortName = this.productTypeObj.sortName;
      obj.sortKey = this.productTypeObj.sortKey;
      obj.parentId = this.productTypeObj.parentId;
      obj.metadataId = this.productTypeObj.metadataId;
      obj.description = this.productTypeObj.description;
      obj.sortIndex = this.productTypeObj.sortIndex;
      obj.sortLevel = this.productTypeObj.sortLevel;
      console.log("add", this.productTypeObj);
      if (this.dialogType == "edit") {
        updateType(obj)
          .then((res) => {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            //   this.dialogVisible = false;
            this.$emit("close");
            this.productTypeObj = {
              id: "",
              name: "",
              seq: "",
              note: "",
              metadataId: "",
              parentId: "",
              parentName: "",
              sortLevel: "",
            };
            this.$emit("refreshTable"); //发送信息刷新列表
          })
          .catch((err) => {});
      } else {
        delete obj.id;
        addType(obj)
          .then((res) => {
            this.$message({
              message: "保存成功",
              type: "success",
            });
            //   this.dialogVisible = false;
            this.productTypeObj = {
              id: "",
              name: "",
              seq: "",
              note: "",
              metadataId: "",
              parentId: "",
              parentName: "",
              sortLevel: "",
            };
            this.$emit("refreshTable"); //发送信息刷新列表
          })
          .catch((err) => {});
      }

      this.$emit("refreshTable"); //发送信息刷新列表
      this.$emit("close");
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
