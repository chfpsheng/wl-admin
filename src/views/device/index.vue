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
          <el-col v-if="!factoryPermission" :span="6">
            <el-form-item prop="factoryCode" label="厂家名称">
              <el-select
                v-model="searchForm.factoryCode"
                clearable
                filterable
                placeholder="请选择厂家名称"
                transfer
              >
                <el-option
                  v-for="item in factoryList"
                  :key="item.vsiKey"
                  :value="item.vsiKey"
                  >{{ item.vsiValue }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="deviceNumber" label="设备编码">
              <el-input
                type="text"
                :maxlength="50"
                v-model.trim="searchForm.deviceNumber"
                @on-enter="search"
                placeholder="请输入设备编码"
                clearable
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="ecsProductId" label="产品名称">
              <el-select
                v-model="searchForm.ecsProductId"
                clearable
                filterable
                placeholder="请选择产品名称"
                transfer
              >
                <el-option
                  v-for="item in productList"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.productName }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" class="handle-bar-one">
            <el-form-item prop="button" label-width="0">
              <div>
                <!-- <RPButton optType="search" @click="search" />
                <RPButton optType="reset" @click="reset" />
                <Button @click="showMore = !showMore">
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
            <el-form-item prop="ecsProtocolId" label="设备类型">
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
                  >{{ item.vsiValue }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="commCode" label="通信方式">
              <el-select
                v-model="searchForm.commCode"
                clearable
                filterable
                placeholder="请选择网络类型"
                transfer
              >
                <el-option
                  v-for="item in commCodeList"
                  :key="item.value"
                  :value="item.value"
                  >{{ item.name }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="onlineStatus" label="在线状态">
              <el-select
                v-model="searchForm.onlineStatus"
                clearable
                filterable
                placeholder="请选择在线状态"
                transfer
              >
                <el-option
                  v-for="item in onlineStatusList"
                  :key="item.vsiKey"
                  :value="item.vsiKey"
                  >{{ item.vsiValue }}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="45" v-if="showMore">
          <el-col :span="6">
            <el-form-item prop="onlineMode" label="在线方式">
              <el-select
                v-model="searchForm.onlineMode"
                clearable
                filterable
                placeholder="请选择在线方式"
                transfer
              >
                <el-option
                  v-for="item in onlineModeList"
                  :key="item.vsiKey"
                  :value="item.vsiKey"
                  >{{ item.vsiValue }}
                </el-option>
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
      <el-button class="filter-item" type="primary" @click="onForceDelete">
        强制删除
      </el-button>
      <!-- <el-button class="filter-item" type="primary" @click="onFirmwareUpdate">
                    固件升级
                </el-button> -->
      <el-button class="filter-item" type="primary" @click="onQueryCache">
        查看缓存
      </el-button>
      <el-button class="filter-item" type="primary" @click="onRefreshCache">
        刷新缓存
      </el-button>
      <el-button class="filter-item" type="primary" @click="importFile">
        资料导入/出
      </el-button>
    </div>
    <!-- <div v-if="!factoryPermission" slot="table-bar">
                <RPButton optType="create" v-permission="AuthEnum.DEVICE_ADD" @click="onAdd" icon="md-add"/>
                <RPButton optType="modify" v-permission="AuthEnum.DEVICE_EDIT" @click="onEdit" icon="md-create"/>
                <RPButton optType="delete" v-permission="AuthEnum.DEVICE_DEL" @click="onDelete" icon="md-trash"/>
                <Button icon="md-trash" v-permission="AuthEnum.DEVICE_MUST_DEL" @click="onForceDelete">强制删除</Button>
                <Button icon="upload" v-permission="AuthEnum.DEVICE_UPGROUDE" @click="onFirmwareUpdate"
                >固件升级
                </Button
                >
                <RPButton
                        optType="common"
                        v-permission="AuthEnum.DEVICE_SEE_CACHE"
                        @click="onQueryCache"
                        text="查看缓存"
                />
                <RPButton
                        optType="common"
                        v-permission="AuthEnum.DEVICE_REFRESH_CACHE"
                        @click="onRefreshCache"
                        text="刷新缓存"
                />
                <RPButton
                        optType="importFile"
                        v-permission="AuthEnum.DEVICE_ADD"
                        @click="importFile"
                        text="资料导入/出"
                />
            </div> -->
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      :height="tableHeight"
      v-loading="listLoading"
      ref="list"
      class="pa-table"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column
        label="序号"
        type="index"
        width="80"
        fixed="left"
      ></el-table-column>

      <el-table-column
        prop="unique_device_identifier"
        label="唯一设备码"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="deviceNumber" label="设备编码" width="180">
        <template slot-scope="scope">
          <!-- <div>{{ handleLink(scope.row) }}</div> -->
          {{ scope.row.deviceNumber }}
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="产品名称" sortable width="180">
      </el-table-column>
      <el-table-column label="协议名称" prop="protocolName"> </el-table-column>
      <el-table-column prop="factoryName" label="厂家名称" sortable width="180">
      </el-table-column>

      <el-table-column prop="deviceType" label="设备类型" width="180">
        <template slot-scope="scope">
          <div>
            {{ getValueSetName(scope.row.deviceType, deviceTypeList) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称" width="180">
      </el-table-column>
      <el-table-column prop="createType" label="建档来源" width="180">
        <template slot-scope="scope">
          <div>
            {{ getValueSetName(scope.row.createType, createTypeList) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="currentKey" label="当前密钥" width="180">
      </el-table-column>
      <el-table-column prop="foreignDeviceId" label="外部设备ID" width="180">
      </el-table-column>
      <el-table-column prop="commCode" label="通信方式" width="180">
      </el-table-column>
      <el-table-column prop="dataModelName" label="数据模型" width="180">
      </el-table-column>
      <el-table-column prop="deviceServerIp" label="设备连接IP" width="180">
      </el-table-column>
      <el-table-column prop="deviceServerPort" label="设备连接端口" width="180">
      </el-table-column>
      <el-table-column prop="deviceMarking" label="设备型号" width="180">
      </el-table-column>
      <el-table-column
        prop="firmwareVersionName"
        label="固件版本名称"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="firmwareVersion" label="固件版本" width="180">
      </el-table-column>
      <el-table-column prop="onlineMode" label="在线方式" width="180">
      </el-table-column>
      <el-table-column prop="onlineStatus" label="在线状态" width="180">
      </el-table-column>
      <el-table-column prop="extend" label="扩展JSON" width="180">
      </el-table-column>
      <el-table-column prop="createUserName" label="创建人" width="180">
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180">
      </el-table-column>
      <el-table-column prop="updateUserName" label="更新人" width="180">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180">
      </el-table-column>

      <el-table-column prop="remark" label="备注" width="180">
      </el-table-column>
      <el-table-column label="操作" min-width="150px" fixed="right">
        <template slot-scope="{ row }">
          <el-tooltip content="编辑" placement="top" effect="light">
            <i class="el-icon-edit mouse-pointer" @click="onEdit(row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <i class="el-icon-delete mouse-pointer" @click="onDelete(row)" />
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
</template>
<script>
import { deviceApi } from "@/api/device.js";
import { queryProductList } from "@/api/product.js";
import deviceProperty from "./deviceProperty";
import deviceEdit from "./deviceEdit.vue";
// import FirmwareSelect from "./FirmwareSelect";
import codeBox from "@/components/CodeBox";
import { mapActions } from "vuex";
import { getValueSet } from "@/api/valueSet.js";
import { commonBaseApi } from "@/api/commonBase.js";
// import UpLoadModal from "@/components/upLoadModal";

export default {
  name: "ecs-device-manage",
  data() {
    return {
      showMore: false,
      factoryPermission: "",
      selectedIdList: [],
      selectedRows: [], //选中的行
      productList: [], //产品列表
      factoryList: [], //厂家列表
      deviceTypeList: [], //设备类型
      onlineStatusList: [], //在线状态
      onlineModeList: [], //在线方式
      commCodeList: [], //运营商
      createTypeList: [], //网络类型
      searchForm: {
        ecsProtocolId: "",
        factoryCode: "",
        commCode: "",
        onlineStatus: "",
        onlineMode: "",
        deviceType: "",
      },
      //   pageTableConfig: {
      //     autoFirst: false,
      //     loadDataFn: this.loadData,
      //     columnsFn: this.generateColumns,
      //     onSelectionChange: this.onSelectionChange,
      //   },
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
      tableHeight: 500,
    };
  },
  computed: {
    factoryCode() {
      return this.$route.query.factoryCode;
    },
    field() {
      return this.$route.query.field;
    },
    val() {
      return this.$route.query.val;
    },
  },
  destroyed() {
    window.onresize = null;
  },
  mounted() {
    getValueSet({
      vsCode:
        "FACTORY_CODE,DEVICE_TYPE, ONOFFLINE,ONLINE_MODE,CARRIER_OPERATOR,CREATE_TYPE",
    }).then((reslut) => {
      const res = reslut.data;
      this.factoryList = this.getValueSetList(res, "FACTORY_CODE");
      this.deviceTypeList = this.getValueSetList(res, "DEVICE_TYPE");
      this.onlineStatusList = this.getValueSetList(res, "ONOFFLINE");
      this.onlineModeList = this.getValueSetList(res, "ONLINE_MODE");
      this.createTypeList = this.getValueSetList(res, "CREATE_TYPE");
    });
    this.getProductList();
    this.getCommCodeList();
    this.getList();
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(288);
    });
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(288);
    };
  },
  activated() {
    this.handleParams();
  },
  methods: {
    ...mapActions(["getFactoryCode"]),
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getList();
    },
    getCommCodeList() {
      commonBaseApi.getCommCodeSelectVO({}).then((res) => {
        this.commCodeList = res.data;
      });
    },
    getValueSetList(sList, key) {
      return sList.filter((item) => {
        return item.vsCode === key;
      });
    },
    getValueSetName(key, list) {
      const vsi = list.find((item) => item.value === key);
      if (vsi) {
        return vsi.name;
      } else {
        return key;
      }
    },
    handleParams() {
      this.searchForm.factoryCode = this.factoryCode;
      if (this.field === "onlineStatus") {
        this.searchForm.onlineStatus = this.val;
      } else if (this.field === "deviceType") {
        this.searchForm.deviceType = this.val;
      } else {
        this.searchForm.commCode = this.val;
      }
    },
    // responseProcess为InnerPageTable提供的回调函数，会自动处理返回的数据
    // param会自动将searchForm中的参数注入
    loadData({ responseProcess, param }) {
      deviceApi
        .queryDeviceListPage(param)
        .then((res) => responseProcess(res.data));
    },
    getList() {
      this.listLoading = true;
      deviceApi.queryDeviceListPage(this.listQuery).then((res) => {
        this.tableData = res.data && res.data.records;
        this.listLoading = false;
        this.tableData = res.data.records;
        this.pagination.total = res.data.total;
      });
    },
    search(page = 1) {
      this.$refs["searchForm"].validate((valid) => {
        if (valid) {
          this.$refs["pageTable"].load(this.searchForm, page);
        }
      });
    },
    reset() {
      this.$refs["searchForm"].resetFields();
      this.search(1);
    },
    onAdd() {
      new this.$pageModal(
        deviceEdit,
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
    importFile() {
      new this.$pageModal(
        UpLoadModal,
        {
          props: {
            title: "资料导入",
            downTemplateUrl: this.$BASE_URL.getDeviceUploadModel,
            uploadUrl: this.$BASE_URL.deviceUpload,
            downResultUrl: this.$BASE_URL.downDeviceUploadErrorInfo,
          },
        },
        (result) => {
          if (result) {
            this.search(1);
            console.log("-------------------------");
            console.log(result);
            console.log("-------------------------");
            // if (result.status === false) {
            //     //有导入失败的数据要进行弹窗进行是否下载导入失败的数据
            //
            //     this.downFailData({
            //         batchNo: result.batchNo,
            //         failCount: result.failCount
            //     })
            // }
          }
        }
      );
    },
    // handleLink(selectedRow) {
    //   new this.$sidelipPage(
    //     deviceProperty,
    //     {
    //       props: {
    //         id: selectedRow.id,
    //       },
    //     },
    //     (data) => {
    //       if (data) {
    //         this.search();
    //       }
    //     }
    //   );
    // },
    onEdit(row) {
      const id = row.id;
      new this.$pageModal(
        deviceEdit,
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
    onDelete(row) {
      if (row.createType === "1") {
        this.$message({
          message: "导入的设备不允许删除",
          type: "warning",
        });
        return;
      }
      const id = row.id;
      this.$confirm("确定删除", "提示", {
        type: "warning",
      }).then(() => {
        deviceApi.deleteDevice(id).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
          } else {
            this.$message.error({
              content: res.msg,
              duration: 3,
            });
          }
          this.getList();
        });
      });
    },
    onForceDelete() {
      this.selectedIdList = this.$refs["list"].selection;
      if (this.selectedIdList.length !== 1) {
        this.$message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }
      const id = this.selectedIdList[0];
      new $confirm("确认删除？", this).then(() => {
        deviceApi.deleteDevice(id).then((res) => {
          if (res.code === 0) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
          } else {
            this.$message.error({
              content: res.msg,
              duration: 3,
            });
          }
          this.getList();
        });
      });
    },
    onFirmwareUpdate() {
      if (this.selectedIdList.length <= 0) {
        this.$message.warning({
          content: "至少选择一条数据",
          duration: 3,
        });
        return;
      }
      new this.$pageModal(
        FirmwareSelect,
        {
          props: {
            // id: id
          },
        },
        (data) => {
          if (data) {
            deviceApi
              .upgradeDevice(this.selectedIdList.join(","), data)
              .then((res) => {
                this.$message.success({
                  content: "已成功下发估计升级指令",
                  duration: 3,
                });
              });
            // this.search()
          }
        }
      );
    },
    onSelectionChange(selectArr) {
      this.selectedIdList = selectArr.map((item) => {
        return item.id;
      });
      this.selectedRows = selectArr;
    },
    //产品列表
    getProductList() {
      queryProductList({}).then((res) => {
        this.productList = res.data;
      });
    },
    onQueryCache() {
      if (this.selectedRows.length !== 1) {
        this.$message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }

      deviceApi
        .getDeviceCache(this.selectedRows[0].uniqueDeviceIdentifier)
        .then((result) => {
          new this.$pageModal(codeBox, {
            props: {
              code: result,
            },
          });
        });
    },
    onRefreshCache() {
      if (this.selectedRows.length !== 1) {
        this.$message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }

      deviceApi.refreshDeviceCache(this.selectedRows[0].id).then((result) => {
        this.$message.success({
          content: "刷新缓存成功！",
          duration: 3,
        });
      });
    },
  },
};
</script>
