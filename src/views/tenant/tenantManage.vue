<template>
  <div class="flex flex-column">
    <div class="page-filters page-content">
      <el-row :gutter="40">
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>租户名称</label>
            <el-input
              v-input-trim
              v-model="pageQuery.tenantName"
              class="pa-input"
              placeholder="请输入租户名称"
            ></el-input>
          </div>
        </el-col>

        <el-col :span="6" :xl="4">
          <el-button type="primary" class="pa-btn" @click="search">
            <i class="iconfont icon-s_sousuo"></i>
            <span> 查询</span>
          </el-button>
          <el-button class="pa-btn" @click="resetSearch">
            <i class="iconfont icon-s_chongzhi"></i>
            <span> 重置</span>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div class="flex-main table-view page-content flex flex-column">
      <div class="table-handler text-right">
        <el-button type="primary" class="pa-btn" @click="onAdd()">
          <i class="iconfont icon-s_tianjia1"></i>
          <span> 新增</span>
        </el-button>
      </div>
      <div class="flex-main">
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          height="100%"
          class="pa-table"
        >
          <el-table-column
            type="index"
            label="序号"
            width="60"
            fixed="left"
          ></el-table-column>
          <el-table-column
            label="租户名称"
            prop="tenantName"
            min-width="200"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column
            label="租户邮箱"
            prop="tenantEmail"
            min-width="110"
          ></el-table-column>
          <el-table-column
            label="用户名称"
            prop="userName"
            width="100"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column label="租户邮箱" prop="userPhone" width="170">
            <template slot-scope="{ row }">
              {{ networkTypeList[row.networkType] }}
            </template>
          </el-table-column>
          <el-table-column
            label="登录账号"
            width="170"
            prop="loginUser"
          ></el-table-column>
          <el-table-column
            label="资质证明"
            width="170"
            prop="assetCertificate"
          ></el-table-column>
          <el-table-column
            label="传真"
            width="170"
            prop="faxNumber"
          ></el-table-column>
          <el-table-column
            label="行业"
            width="170"
            prop="industry"
          ></el-table-column>
          <el-table-column
            label="备注"
            width="170"
            prop="remark"
          ></el-table-column>
          <el-table-column
            label="创建人"
            width="170"
            prop="createUserName"
          ></el-table-column>
          <el-table-column
            label="创建时间"
            width="170"
            prop="createTime"
          ></el-table-column>

          <el-table-column
            label="更新人姓名"
            width="170"
            prop="updateUserName"
          ></el-table-column>

          <el-table-column
            label="更新时间"
            width="170"
            prop="updateTime"
          ></el-table-column>
          <el-table-column label="操作" width="184" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" @click="onEdit(row)">修改</el-button>
              <el-button type="text" @click="onDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <table-pagination
        :total="total"
        v-model="pageQuery"
        @change="getTableData"
      ></table-pagination>
    </div>
  </div>
</template>

<script>
import { getDiscountList, startServer, stopServer } from "@/api/commControl.js";
import { getValueSet } from "@/api/common.js";
import baseDataMixin from "@/mixins/baseData";
import TablePagination from "@/components/Table/table-pagination.vue";
import Template from "../template-manage/delivery-template/template.vue";
import tenantEdit from "./tenantEdit.vue";
export default {
  mixins: [baseDataMixin],
  components: {
    TablePagination,
    Template,
  },
  data() {
    return {
      STATUS_START: "1",
      statusList: [],
      tableData: [],
      networkTypeList: [],
      statusList: [],
      tableLoading: false,
      pageQuery: {
        departmentId: "",
        status: "",
        name: "",
        beginTime: "",
        endTime: "",
        pageSize: 10,
        pageNo: 1,
      },
      total: 0,
      statusMap: {
        0: "未开始",
        1: "已开始",
        2: "已结束",
      },
      statusColorMap: {
        0: "#FFB828",
        1: "#0066CC",
        2: "#333333",
      },
      departmentMap: {},
      departmentOptions: [],
    };
  },
  computed: {
    statusOptions() {
      const options = [
        {
          label: "全部",
          value: "",
        },
      ];
      for (const key in this.statusMap) {
        if (Object.hasOwnProperty.call(this.statusMap, key)) {
          const label = this.statusMap[key];
          options.push({
            label,
            value: key,
          });
        }
      }
      return options;
    },
  },
  created() {
    this.initValueSet();
  },
  methods: {
    onAdd() {
      new this.$pageModal(
        tenantEdit,
        {
          props: {},
        },
        (data) => {
          if (data) {
            this.search();
          }
        }
      );
    },
    initValueSet() {
      getValueSet({ vsCode: "NETWORK_TYPE" }).then((res) => {
        this.networkTypeList = res.data;
      });
      getValueSet({ vsCode: "STARTING_STATUS" }).then((res) => {
        this.statusList = res.data;
      });
    },
    search() {
      this.pageQuery.pageNo = 1;
      this.getTableData();
    },
    resetSearch() {
      Object.assign(this.pageQuery, {
        departmentId: "",
        status: "",
        name: "",
        beginTime: "",
        endTime: "",
        pageSize: 10,
        pageNo: 1,
      });
      this.search();
    },
    getTableData() {
      this.tableLoading = true;
      // TODO
      getDiscountList(this.pageQuery)
        .then((res) => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    deleteRow(row) {
      this.$confirm("确定删除该活动吗？删除后将无法恢复。", "提示", {
        type: "warning",
      }).then(() => {
        deleteDiscount(row.id).then((res) => {
          this.$message.success("删除成功！");
          this.getTableData();
        });
      });
    },
    onEdit(row) {
      //   if (this.selectedIdList.length !== 1) {
      //     this.$message.warning({
      //       content: "请选择一条数据",
      //       duration: 3,
      //     });
      //     return;
      //   }
      const id = row.id;
      new this.$pageModal(
        tenantEdit,
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
    onDelete(row) {
      //   if (this.selectedIdList.length === 0) {
      //     this.$message.warning({
      //       content: "请至少选择一条数据",
      //       duration: 3,
      //     });
      //     return;
      //   }
      const id = row.id;
      new $confirm("确认删除？", this).then(() => {
        this.isloading = true;
        tenantApi
          .deleteTenant(id)
          .then((res) => {
            if (res.code === 0) {
              this.$message.success({
                content: res.msg,
                duration: 3,
              });
            } else {
              this.$message.error({
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
  },
};
</script>

<style lang="scss" scoped>
.page-filters {
  padding-top: 0;
  margin-bottom: 8px;
  color: #333;
  .search-handler {
    margin-left: 0;
  }
  > .el-row {
    flex: auto;
    > div {
      margin-top: 16px;
    }
  }
}
</style>
