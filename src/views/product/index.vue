<template>
  <div class="profile-set-manage searchAdapt-OneTwo">
    <el-form
      :model="searchForm"
      ref="searchForm"
      slot="search-bar"
      label-position="left"
      label-width="72"
      class="ivu-form-no-margin-bottom"
      inline
    >
      <template>
        <el-row :gutter="45">
          <el-col :span="6">
            <el-form-item prop="ecsApplicationId" label="应用名称">
              <el-select
                v-model="searchForm.ecsApplicationId"
                clearable
                filterable
                placeholder="请选择应用名称"
                transfer
              >
                <el-option
                  v-for="item in applicationList"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.applicationName }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="productName" label="产品名称">
              <el-input
                type="text"
                :maxlength="50"
                v-model.trim="searchForm.productName"
                @on-enter="search"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="deviceType" label="设备类型">
              <el-select
                v-model="searchForm.deviceType"
                clearable
                filterable
                placeholder="请选择设备类型"
                transfer
              >
                <el-option
                  v-for="item in deviceTypeList"
                  :key="item.vsiKey"
                  :value="item.vsiKey"
                  >{{ item.vsiValue }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="handle-bar-one">
            <el-form-item prop="button" label-width="0">
              <div>
                <!-- <el-button optType="search" @click="search">搜索</el-button> -->
                <el-button type="primary" icon="el-icon-search" @click="search"
                  >搜索</el-button
                >
                <el-button type="primary" @click="reset">重置</el-button>
                <!-- <el-button optType="reset" @click="reset">搜索</el-button> -->
                <!-- <Button @click="showMore = !showMore">
                  更多
                  <Icon type="ios-arrow-down" v-if="!showMore" />
                  <Icon type="ios-arrow-up" v-else />
                </Button> -->
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="45" v-if="showMore">
          <el-col :span="6">
            <el-form-item prop="networkType" label="网络类型">
              <el-select
                v-model="searchForm.networkType"
                clearable
                filterable
                placeholder="请选择网络类型"
                transfer
              >
                <el-option
                  v-for="item in networkTypeList"
                  :key="item.vsiKey"
                  :value="item.vsiKey"
                  >{{ item.vsiValue }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" style="border: none">
            <el-form-item prop="accessMode" label="接入方式">
              <el-select
                v-model="searchForm.accessMode"
                clearable
                filterable
                placeholder="请选择接入方式"
                transfer
              >
                <el-option
                  v-for="item in accessModeList"
                  :key="item.vsiKey"
                  :value="item.vsiKey"
                  >{{ item.vsiValue }}</el-option
                >
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </el-form>

    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="onAdd"
      >
        新增
      </el-button>
      <el-button class="filter-item" type="primary" @click="onQueryCache">
        查看缓存
      </el-button>
    </div>
    <!-- <el-button optType="create" @click="onAdd" icon="md-add"></el-button>
        <el-button optType="common" @click="onQueryCache" text="查看缓存" /> -->

    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :height="tableHeight"
      v-loading="listLoading"
      class="pa-table"
    >
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column
        label="序号"
        type="index"
        width="80"
        fixed="left"
      ></el-table-column>
      <el-table-column prop="productName" label="产品名称" width="180">
      </el-table-column>
      <el-table-column
        prop="applicationName"
        label="应用名称"
        sortable
        width="180"
      >
      </el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          <pa-switch
            :value.sync="scope.row.enable"
            @click="switchClick(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="id" label="产品ID" sortable width="180">
      </el-table-column>

      <el-table-column prop="deviceType" label="设备类型" width="180">
      </el-table-column>
      <el-table-column prop="productModel" label="产品型号" width="180">
      </el-table-column>
      <el-table-column prop="networkType" label="网络类型" width="180">
        <template slot-scope="scope">
          <div>{{ getNetworkTypeName(scope.row.networkType) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="accessMode" label="接入方式" width="180">
        <template slot-scope="scope">
          <div>{{ getAccessModeName(scope.row.accessMode) }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="parameters" label="参数" width="180">
      </el-table-column>
      <el-table-column prop="remark" label="备注" width="180">
      </el-table-column>
      <el-table-column label="操作" min-width="150px" fixed="right">
        <template slot-scope="{ row }">
          <el-tooltip content="编辑" placement="top" effect="light">
            <i class="el-icon-edit mouse-pointer" @click="editItem(row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <i class="el-icon-delete mouse-pointer" @click="deleteItem(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <pa-pagination
      :current-page="listQuery.pageNum"
      :page-size="listQuery.pageSize"
      :total="pagination.total"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
  </div>
</template>m 
<script>
import { deleteProduct, queryProductListPage } from "@/api/product.js";
import { queryApplicationList } from "@/api/application.js";
import { getValueSet } from "@/api/valueSet.js";
import productEdit from "./productEdit";
import productSubscribe from "./productSubscribe";
import codeBox from "@/components/CodeBox";

export default {
  name: "ecs-product-manage",
  data() {
    return {
      tableHeight: "500",
      isloading: false,
      showMore: false,
      selectedIdList: [],
      applicationList: [], //应用名称
      deviceTypeList: [], //设备类型
      networkTypeList: [], //网络类型
      accessModeList: [], //接入方式
      searchForm: {
        ecsApplicationId: "",
        productName: "",
        deviceType: "",
        networkType: "",
        accessMode: "",
      },
      listQuery: {
        pageNum: 1,
        pageSize: 10,
        condition: {},
      },
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      listLoading: false, // 列表加载中
      tableData: [],
      // pageTableConfig: {
      //   autoFirst: true,
      //   getListFn: this.getList,
      //   columnsFn: this.generateColumns,
      //   onSelectionChange: this.onSelectionChange,
      // },
    };
  },
  mounted() {
    this.getApplicationList();
    this.getDeviceTypeList();
    this.getNetworkTypeList();
    this.getAccessModeList();
    console.log(111);
    this.getNetworkTypeName();
    console.log(222);
    this.getList();
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(288);
    });
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(288);
    };
  },

  methods: {
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    deleteItem(row) {
      this.$confirm("确定删除", "提示", {
        type: "warning",
      }).then(() => {
        deleteProduct(row.id).then((res) => {
          this.$message.success("删除成功！");
          this.getList();
        });
      });
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getList();
    },
    // responseProcess为InnerPageTable提供的回调函数，会自动处理返回的数据
    // param会自动将searchForm中的参数注入
    getList() {
      this.listQuery.condition = this.searchForm;
      this.listQuery.pageSize = this.pagination.pageSize;
      // this.listQuery = Object.assign(params, queryObj);
      queryProductListPage(this.listQuery).then((res) => {
        console.log(2222222222, res);
        this.tableData = res.data.records;
        this.pagination.total = res.data.total;
      });
    },
    onQueryCache() {
      if (this.selectedIdList.length !== 1) {
        this.$Message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }
      productApi.getProductCacheById(this.selectedIdList[0]).then((result) => {
        new this.$pageModal(codeBox, {
          props: {
            code: result,
          },
        });
      });
    },
    generateColumns() {
      return [
        {
          type: "selection",
          width: 55,
          show: true,
          align: "right",
        },
        {
          title: "应用名称",
          key: "applicationName",
          sortable: "custom",
          align: "left",
          width: 150,
          ellipsis: true,
          resizable: true,
        },
        {
          title: "产品ID",
          key: "id",
          sortable: "custom",
          align: "left",
          width: 180,
          ellipsis: true,
          resizable: true,
        },
        {
          title: "产品名称",
          key: "productName",
          sortable: "custom",
          align: "left",
          width: 150,
          ellipsis: true,
          resizable: true,
        },
        {
          title: "设备类型",
          key: "deviceType",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: this.getDeviceTypeName(params.row.deviceType),
                },
              },
              this.getDeviceTypeName(params.row.deviceType)
            );
          },
        },
        {
          title: "产品型号",
          key: "productModel",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.productModel,
                },
              },
              params.row.productModel
            );
          },
        },
        // {
        //   title: '型号',
        //   key: 'productModel',
        //   sortable: 'custom',
        //   align: 'left',
        //   width: 150,
        //   render: (h, params) => {
        //     return h(
        //       'div',
        //       {
        //         attrs: {
        //           class: 'ivu-table-cell-ellipsis',
        //           title: params.row.productModel
        //         }
        //       },
        //       params.row.productModel
        //     )
        //   }
        // },
        {
          title: "网络类型",
          key: "networkType",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: this.getNetworkTypeName(params.row.networkType),
                },
              },
              this.getNetworkTypeName(params.row.networkType)
            );
          },
        },
        {
          title: "接入方式",
          key: "accessMode",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: this.getAccessModeName(params.row.accessMode),
                },
              },
              this.getAccessModeName(params.row.accessMode)
            );
          },
        },
        {
          title: "参数",
          key: "parameters",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.parameters,
                },
              },
              params.row.parameters
            );
          },
        },
        {
          title: "备注",
          key: "remark",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.remark,
                },
              },
              params.row.remark
            );
          },
        },
        {
          title: "创建人",
          key: "createUserName",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.createUserName,
                },
              },
              params.row.createUserName
            );
          },
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.createTime
                    ? new Date(params.row.createTime).Format(
                        "yyyy-MM-dd hh:mm:ss"
                      )
                    : "",
                },
              },
              params.row.createTime
                ? new Date(params.row.createTime).Format("yyyy-MM-dd hh:mm:ss")
                : ""
            );
          },
        },
        {
          title: "更新人",
          key: "updateUserName",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.updateUserName,
                },
              },
              params.row.updateUserName
            );
          },
        },
        {
          title: "更新时间",
          key: "updateTime",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.updateTime
                    ? new Date(params.row.updateTime).Format(
                        "yyyy-MM-dd hh:mm:ss"
                      )
                    : "",
                },
              },
              params.row.updateTime
                ? new Date(params.row.updateTime).Format("yyyy-MM-dd hh:mm:ss")
                : ""
            );
          },
        },
      ];
    },
    search(page = 1) {
      this.$refs["pageTable"].load(this.searchForm, page);
    },
    reset() {
      this.$refs["searchForm"].resetFields();
      this.search(1);
    },
    onAdd() {
      new this.$pageModal(
        productEdit,
        {
          props: {},
        },
        (data) => {
          if (data) {
            this.getList();
          }
        }
      );
    },
    editItem(row) {
      const id = row.id;
      console.log(12345, id);
      new this.$pageModal(
        productEdit,
        {
          props: {
            id: id,
          },
        },
        (data) => {
          if (data) {
            this.getList();
          }
        }
      );
    },
    onDelete() {
      // if (this.selectedIdList.length !== 1) {
      //   this.$Message.warning({
      //     content: "请选择一条数据",
      //     duration: 3,
      //   });
      //   return;
      // }
      const id = this.selectedIdList.join(",");
      new $confirm("确认删除？", this).then(() => {
        this.isloading = true;
        productApi
          .deleteProduct(id)
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
            this.search();
          })
          .finally(() => {
            this.isloading = false;
          });
      });
    },
    onSubscribe() {
      if (this.selectedIdList.length !== 1) {
        this.$Message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }
      const id = this.selectedIdList[0];
      new this.$pageModal(
        productSubscribe,
        {
          props: {
            id: id,
          },
        },
        (data) => {
          if (data) {
            this.search();
          }
        }
      );
    },
    onSelectionChange(selectArr) {
      this.selectedIdList = selectArr.map((item) => {
        return item.id;
      });
    },
    //应用名称
    getApplicationList() {
      queryApplicationList({}).then((res) => {
        console.log("2222", res);
        this.applicationList = res.data;
      });
    },
    //设备类型
    getDeviceTypeList() {
      getValueSet({ vsCode: "DEVICE_TYPE" }).then((res) => {
        this.deviceTypeList = res["DEVICE_TYPE"];
      });
    },
    //根据key获取设备类型名称
    getDeviceTypeName(key) {
      const deviceType = this.deviceTypeList.find(
        (item) => item.vsiKey === key
      );
      if (deviceType) {
        return deviceType.vsiValue;
      } else {
        return "";
      }
    },
    //网络类型
    getNetworkTypeList() {
      getValueSet({ vsCode: "NETWORK_TYPE" }).then((res) => {
        this.networkTypeList = res["NETWORK_TYPE"];
        console.log(456, this.networkTypeList);
        s;
      });
    },
    //获取接入方式
    getAccessModeList() {
      getValueSet({ vsCode: "ACCESS_MODE" }).then((res) => {
        this.accessModeList = res["ACCESS_MODE"];
      });
    },
    //根据key获取接入方式名称
    getAccessModeName(key) {
      const accessMode = this.accessModeList.find(
        (item) => item.vsiKey === key
      );
      if (accessMode) {
        return accessMode.vsiValue;
      } else {
        return "";
      }
    },
    //根据key获取接入方式名称
    getNetworkTypeName(key) {
      const networkType = this.networkTypeList.find(
        (item) => item.value === key
      );
      if (networkType) {
        return networkType.name;
      } else {
        return "";
      }
    },
  },
};
</script>
