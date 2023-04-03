<template>
  <Form :model="modelForm" ref="editForm" :rules="rule" :label-width="100">
    <Row :gutter="20" class="code-row-bg">
      <Col span="12" style="border: none">
        <Form-item prop="productName" label="产品名称">
          <Input v-model="modelForm.productName" disabled />
        </Form-item>
      </Col>
      <Col span="12" style="border: none">
        <Form-item prop="accessMode" label="接入方式">
          <Select
            v-model="modelForm.accessMode"
            clearable
            filterable
            placeholder="请选择接入方式"
            transfer
          >
            <Option
              v-for="item in accessModeList"
              :key="item.vsiKey"
              :value="item.vsiKey"
              >{{ item.vsiValue }}</Option
            >
          </Select>
        </Form-item>
      </Col>
    </Row>
    <Row :gutter="20" class="code-row-bg">
      <Col span="12" style="border: none">
        <Form-item prop="parameters" label="参数">
          <Input
            v-model="modelForm.parameters"
            clearable
            placeholder="请输入参数"
          />
        </Form-item>
      </Col>
    </Row>
    <Row :gutter="20" class="code-row-bg">
      <Col span="24" style="border: none">
        <Form-item prop="remark" label="备注">
          <Input
            v-model="modelForm.remark"
            clearable
            placeholder="请输入备注"
            type="textarea"
            maxlength="200"
            show-word-limit
          />
        </Form-item>
      </Col>
    </Row>
  </Form>
</template>
<script>
import { productSubscribeApi } from "@/api/productSubscribe.js";
import { getProductDetail } from "@/api/product.js";
import { getValueSet } from "@/api/valueSet.js";

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
      accessModeList: [],
      modelForm: {
        id: this.id,
        ecsProductId: "",
        productName: "",
        accessMode: "",
        parameters: "",
        remark: "",
        createUserName: "",
        updateUserName: "",
      },
      rule: {
        ecsProductId: [
          { required: true, message: "请输入产品ID", trigger: "blur" },
        ],
        accessMode: [
          { required: true, message: "请输入接入方式", trigger: "blur" },
        ],
        parameters: [
          { required: true, message: "请输入参数", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.init();
    this.getAccessModeList();
  },
  methods: {
    init() {
      this.modelForm.ecsProductId = this.id;
      this.$emit("SetTitle", "编辑产品订阅");
      this.$emit("SetPageWidth", 800);
      this.$emit("SetPageActions", [
        {
          text: "保存",
          theme: "primary",
          handle: () => {
            this.save();
          },
        },
        {
          text: "取消",
          theme: "default",
          handle: () => {
            this.$emit("Close");
          },
        },
      ]);
      if (this.id) {
        getProductDetail(this.id).then((res) => {
          this.modelForm.productName = res.data.productName;
        });
      }
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          if (false) {
            productSubscribeApi
              .updateProductSubscribe(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: "保存成功",
                    duration: 3,
                  });
                } else {
                  this.$Message.error({
                    content: "修改失败，" + res.msg,
                    duration: 3,
                  });
                }
                this.$emit("Close", 1);
              });
          } else {
            productSubscribeApi
              .addProductSubscribe(this.modelForm)
              .then((res) => {
                if (res.code === 0) {
                  this.$Message.success({
                    content: res.msg,
                    duration: 3,
                  });
                } else {
                  this.$Message.error({
                    content: res.msg,
                    duration: 3,
                  });
                }
                this.$emit("Close", 1);
              });
          }
        }
      });
    },
    //获取接入方式
    getAccessModeList() {
      getValueSet({ vsCode: "ACCESS_MODE" }).then((res) => {
        this.accessModeList = res.data;
      });
    },
  },
};
</script>
