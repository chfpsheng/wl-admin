<template>
  <el-form :model="modelForm" ref="editForm" :rules="rule" label-width="100">
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="productName" label="产品名称">
          <el-input
            v-model="modelForm.productName"
            clearable
            style="width: 215px"
            placeholder="请输入产品名称"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="productName" label="产品分类">
          <!-- <el-select
            v-model="modelForm.productCategoryId"
            placeholder="请选择"
            :popper-append-to-body="false"
          >
            <el-option :value="selectTree" class="setstyle" disabled>
              <el-tree
                :data="productCategoryList"
                :props="defaultProps"
                ref="tree"
                :highlight-current="true"
                @node-click="handleNodeClick"
                default-expand-all
              ></el-tree>
            </el-option>
          </el-select> -->
          <el-tree-select
            :styles="styles"
            v-model="modelForm.productCategoryId"
            :selectParams="selectParams"
            :treeParams="treeParams"
            :treeRenderFun="_renderFun"
            @node-click="_nodeClickFun"
            ref="treeSelect"
            style="width: 280px"
          />
          <el-select
            multiple
            v-model="test"
            placeholder="请选择"
            @change="_selectChange"
            style="display: none"
          >
            <el-option
              v-for="item in treeParams.data"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="productModel" label="产品型号">
          <el-input
            v-model="modelForm.productModel"
            clearable
            style="width: 215px"
            placeholder="请输入产品型号"
          />
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="deviceType" label="设备类型">
          <el-select
            v-model="modelForm.deviceType"
            clearable
            filterable
            placeholder="请选择设备类型"
            transfer
          >
            <el-option
              v-for="item in deviceTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="networkComponentsId" label="网络组件">
          <el-select
            v-model="modelForm.networkComponentsId"
            clearable
            filterable
            placeholder="请选择网络组件"
            transfer
          >
            <el-option
              v-for="item in networkComponentsList"
              :key="item.id"
              :label="item.commCode"
              :value="item.id"
              >{{ item.commCode }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="lineType" label="连接类型">
          <el-select
            v-model="modelForm.lineType"
            clearable
            filterable
            placeholder="请选择连接类型"
            transfer
          >
            <el-option
              v-for="item in lineTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="networkType" label="网络类型">
          <el-select
            v-model="modelForm.networkType"
            clearable
            filterable
            placeholder="请选择网络类型"
            transfer
          >
            <el-option
              v-for="item in networkTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12" style="border: none">
        <el-form-item prop="accessMode" label="接入方式">
          <el-select
            v-model="modelForm.accessMode"
            clearable
            filterable
            placeholder="请选择接入方式"
            transfer
          >
            <el-option
              v-for="item in accessModeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
              >{{ item.name }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      class="code-row-bg"
      v-if="modelForm.accessMode === '2'"
    >
      <el-col :span="24" style="border: none">
        <el-form-item prop="httpUrl" label="回调地址">
          <el-input
            v-model="modelForm.httpUrl"
            clearable
            placeholder="请输入回调地址1"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      class="code-row-bg"
      v-if="modelForm.accessMode === '2'"
    >
      <el-col :span="24" style="border: none">
        <el-form-item prop="httpSecret" label="密钥">
          <el-input
            v-model="modelForm.httpSecret"
            clearable
            placeholder="请输入密钥"
          />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row
      :gutter="20"
      class="code-row-bg"
      v-if="modelForm.accessMode === '1'"
    >
      <el-col :span="24" style="border: none">
        <el-form-item label="说明">
          <div style="color: #ff0000">
            <div>
              数据是永久存储;MQ交换机类型使用direct，使用产品ID作为交换机、队列和路由的占位符
            </div>
            <div>
              交换机: 'ecs.sto.%s.subscription.exchange'、队列:
              'ecs.sto.%s.subscription.queue'、路由:
              'ecs.sto.%s.subscription.routing'
            </div>
          </div>
        </el-form-item>
      </el-col>
    </el-row>
    <!--    <el-row :gutter="20" class="code-row-bg">-->
    <!--      <el-col span="24" style="border:none;">-->
    <!--      <el-form-item prop="parameters" label="参数">-->
    <!--        <el-input v-model="modelForm.parameters" clearable placeholder="请输入参数" />-->
    <!--      </el-form-item>-->
    <!--      </el-col>-->
    <!--    </el-row>-->
    <el-row :gutter="20" class="code-row-bg">
      <el-col :span="12" style="border: none">
        <el-form-item prop="ecsApplicationId" label="应用名称">
          <el-select
            v-model="modelForm.ecsApplicationId"
            :disabled="isEdit"
            clearable
            filterable
            placeholder="请选择应用名称"
            transfer
          >
            <el-option
              v-for="item in applicationList"
              :key="item.id"
              :label="item.applicationName"
              :value="item.id"
              >{{ getAppNames(item) }}</el-option
            >
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24" style="border: none">
        <el-form-item prop="remark" label="备注">
          <el-input
            v-model="modelForm.remark"
            clearable
            placeholder="请输入备注"
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
import { getProductDetail, updateProduct, addProduct } from "@/api/product.js";
import { queryApplicationList } from "@/api/application.js";
import { getValueSet } from "@/api/valueSet.js";
import { queryCommPortList } from "@/api/port.js";
import { getProductTypeList } from "@/api/productType.js";

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
      styles: {
        width: "300px",
      },
      test: "",
      values: "5",
      selectParams: {
        multiple: true,
        clearable: true,
        placeholder: "请输入内容",
      },
      treeParams: {
        clickParent: false,
        filterable: true,
        "check-strictly": true,
        "default-expand-all": true,
        "expand-on-click-node": false,
        data: [],
        props: {
          children: "children",
          label: "sortName",
          disabled: "disabled",
          value: "id",
        },
      },

      //TODO:隔离

      defaultProps: {
        children: "children",
        label: "label",
      },
      selectTree: [],
      isEdit: false, //是否编辑
      applicationList: [], //应用名称
      deviceTypeList: [], //设备类型
      networkTypeList: [], //网络类型
      accessModeList: [],
      networkComponentsList: [], //网络组件
      flattedProductTypeList: [],
      productCategoryList: [
        {
          id: 1,
          seq: 1,
          name: "产品分类1",
          note: "note",
        },
        {
          id: 2,
          seq: 2,
          name: "产品分类2",
          note: "note",
        },
        {
          id: 3,
          seq: 2,
          name: "智慧工业",
          note: "note",
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "生活区域",
              note: "note",
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "生产区域",
              note: "note",
            },
          ],
        },
      ],
      lineTypeList: [
        {
          name: "直连",
          id: 1,
        },
        {
          name: "网关",
          id: 2,
        },
        {
          name: "网关子设备",
          id: 3,
        },
      ], //连接类型
      modelForm: {
        accessMode: "",
        id: this.id,
        ecsApplicationId: "",
        productName: "",
        productModel: "",
        lineType: "",
        deviceType: "",
        networkType: "",
        remark: "",
        createUserName: "",
        updateUserName: "",
        httpUrl: "",
        httpSecret: "",
        productCategoryId: 1,
      },
      rule: {
        ecsApplicationId: [
          {
            required: true,
            message: "请选择应用名称",
            trigger: "change",
          },
        ],
        productName: [
          {
            required: true,
            message: "请输入产品名称",
            trigger: "blur",
          },
        ],
        lineType: [
          {
            required: true,
            message: "请选择连接类型",
            trigger: "change",
          },
        ],
        productModel: [
          {
            required: true,
            message: "请选择产品型号",
            trigger: "change",
          },
        ],
        deviceType: [
          {
            required: true,
            message: "请选择设备类型",
            trigger: "change",
          },
        ],
        networkType: [
          {
            required: true,
            message: "请选择网络类型",
            trigger: "change",
          },
        ],
        accessMode: [
          {
            required: true,
            message: "请输入接入方式",
            trigger: "blur",
          },
        ],
        // parameters: [{ required: true, message: "请输入参数", trigger: 'blur' }],
        httpUrl: [
          {
            required: true,
            message: "请输入回调地址",
            trigger: "blur",
          },
        ],
        httpSecret: [
          { required: true, message: "请输入密钥", trigger: "blur" },
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
    console.log("33333333333", this.selectTree);
    this.getApplicationList();
    this.getDeviceTypeList();
    this.getNetworkTypeList();
    this.getAccessModeList();
    this.getNetworkComponentsList();
    this.getProductTypeList();

    this.init();
  },
  methods: {
    getProductTypeList() {
      console.log("getProductTypeList");
      getProductTypeList({}).then((res) => {
        console.log(res);
        //this.selectTree = this.flatten(res.data);

        //todo 模拟数据将模拟数据代替data
        this.treeParams.data = res.data;
        this.$refs.treeSelect.treeDataUpdateFun(res.data);
      });
    },
    // 树点击
    _nodeClickFun(data, node, vm) {
      this.modelForm.productCategoryId = data.id;
      console.log("this _nodeClickFun", this.values, data, node);
    },
    // 下拉框修改
    _selectChange(val) {
      console.log(val, "<-select change");
    },
    // 自定义render
    _renderFun(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
          <span>{node.label}</span>
        </span>
      );
    },
    flatten(arr) {
      return [].concat(
        ...arr.map((item) => {
          if (item.children) {
            let arr = [].concat(item, ...this.flatten(item.children));
            delete item.children;
            return arr;
          }
          return [].concat(item);
        })
      );
    },
    handleNodeClick(data, self, child) {
      console.log("data", data);
      this.modelForm.productCategoryId = data.id;
      // this.labelData = data.label; //展示部分
      // this.valueData = data.id; //传参---id
    },
    getAppNames(item) {
      return `${item.applicationName}(${item.applicationCode})`;
    },
    init() {
      if (this.id) {
        this.$emit("SetTitle", "编辑产品信息");
      } else {
        this.$emit("SetTitle", "新增产品信息");
      }
      this.$emit("SetPageWidth", 800);
      this.$emit("SetPageActions", this.actions);
      if (this.id) {
        this.isEdit = true;
        getProductDetail(this.id).then((res) => {
          this.modelForm = res.data;
          if (this.modelForm.accessMode === "2") {
            const httpMode = JSON.parse(this.modelForm.parameters);
            this.modelForm.httpUrl = httpMode.url || "";
            this.modelForm.httpSecret = httpMode.secret || "";
          }
        });
      }
    },
    save() {
      this.$refs["editForm"].validate((valid) => {
        if (valid) {
          this.actions[0].loading = true;
          if (this.modelForm.accessMode === "2") {
            const httpMode = {
              url: this.modelForm.httpUrl,
              secret: this.modelForm.httpSecret,
            };
            this.modelForm.parameters = JSON.stringify(httpMode);
          }
          if (this.id) {
            updateProduct(this.modelForm)
              .then((res) => {
                if (res.code === 200) {
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
            addProduct(this.modelForm)
              .then((res) => {
                if (res.code === 200) {
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
    //应用名称
    getApplicationList() {
      queryApplicationList({}).then((res) => {
        this.applicationList = res.data;
        console.log(this.applicationList);
      });
    },
    //设备类型
    getDeviceTypeList() {
      getValueSet({ vsCode: "DEVICE_TYPE" }).then((res) => {
        console.log(2222221, res, res.data);
        this.deviceTypeList = res["DEVICE_TYPE"];
        console.log(this.deviceTypeList);
      });
    },
    //网络类型
    getNetworkTypeList() {
      getValueSet({ vsCode: "NETWORK_TYPE" }).then((res) => {
        this.networkTypeList = res["NETWORK_TYPE"];
        console.log(333, this.networkTypeList);
      });
    },
    //获取接入方式
    getAccessModeList() {
      getValueSet({ vsCode: "ACCESS_MODE" }).then((res) => {
        this.accessModeList = res["ACCESS_MODE"];
        console.log(444, this.accessModeList);
      });
    },
    //获取网络组件
    getNetworkComponentsList() {
      queryCommPortList({}).then((res) => {
        this.networkComponentsList = res.data;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-popover__reference {
  width: 150px !important;
}
</style>
