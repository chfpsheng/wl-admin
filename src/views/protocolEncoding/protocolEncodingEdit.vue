<template>
  <div class="run-modal-style">
    <el-form
      label-width="100px"
      :model="modelForm"
      ref="editForm"
      :rules="rule"
      class="formTabelList"
    >
      <el-row :gutter="24" justify="center">
        <el-col :span="12">
          <el-form-item label="编码名称" class="el-form-item" prop="codeName">
            <el-input
              placeholder="请输入编码名称"
              v-model="modelForm.codeName"
              maxlength="16"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="算法code" class="el-form-item" prop="codeValue">
            <pa-select
              class="form-item-content"
              :value.sync="modelForm.encodingCode"
              :options="encodingCodeList"
              :clearable="false"
            ></pa-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24" justify="center">
        <el-col :span="12">
          <el-form-item label="数字类型" class="el-form-item" prop="codeValue">
            <pa-select
              class="form-item-content"
              :value.sync="modelForm.type"
              :options="valueTypeList"
              :clearable="false"
            ></pa-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            label="算法描述"
            class="el-form-item"
            prop="algorithmDesc"
          >
            <el-input
              placeholder="算法描述"
              v-model="modelForm.algorithmDesc"
              maxlength="16"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
import {
  getProtocolEncodingDetail,
  updateProtocolEncoding,
  addProtocolEncoding,
} from "@/api/protocolEncoding.js";
import { getValueSet } from "@/api/valueSet.js";
export default {
  components: {},
  props: {
    id: {
      type: String,
      default() {
        return "";
      },
    },
    valueTypeList: {
      type: Array,
      default() {
        return [];
      },
    },
    encodingCodeList: {
      type: Array,
      default() {
        return [];
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
      // valueTypeList: [], //数字类型
      // valueTypeList: [], //数字类型
      modelForm: {
        id: this.id,
        valueType: "",
        name: "",
        algorithmDesc: "",
        encodingCode: "",
        createUserName: "",
        updateUserName: "",
      },
      rule: {
        name: [{ required: true, message: "请输入编码名称", trigger: "blur" }],
        encodingCode: [
          { required: true, message: "请输入算法code", trigger: "blur" },
        ],
        valueType: [
          { required: true, message: "请选择数字类型", trigger: "change" },
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
    // this.getValueTypeList()
  },
  methods: {
    init() {
      if (this.id) {
        this.$emit("SetTitle", "编辑报文数据编码信息");
      } else {
        this.$emit("SetTitle", "新增报文数据编码信息");
      }
      this.$emit("SetPageWidth", 700);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        getProtocolEncodingDetail(this.id).then((res) => {
          this.modelForm.encodingCode = res.data.encodingCode;
          this.modelForm.valueType = res.data.valueType;
          this.modelForm.algorithmDesc = res.data.algorithmDesc;
          this.modelForm.name = res.data.name;
        });
      }
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          if (this.id) {
            updateProtocolEncoding(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: res.msg,
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$Message.error({
                    content: res.msg,
                    duration: 3,
                  });
                }
              })
              .finally(() => {
                this.actions[0].loading = false;
              });
          } else {
            addProtocolEncoding(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: res.msg,
                    duration: 3,
                  });
                  this.$emit("Close", 1);
                } else {
                  this.$Message.error({
                    content: res.msg,
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
    getValueTypeList() {
      getValueSet({ vsCode: "VALUE_TYPE" }).then((res) => {
        this.valueTypeList = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
