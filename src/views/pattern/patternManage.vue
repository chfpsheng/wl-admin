<template>
  <div class="flex flex-column">
    <div class="page-filters page-content">
      <el-row :gutter="40">
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>通信方式代码</label>
            <!-- <el-input
              v-input-trim
              v-model="pageQuery.name"
              class="pa-input"
              placeholder="请输入通信方式代码"
            ></el-input> -->
            <pa-select
              :value.sync="pageQuery.commCode"
              :options="commCodeList"
            ></pa-select>
          </div>
        </el-col>
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>通信方式描述</label>
            <el-input
              v-input-trim
              v-model="pageQuery.commName"
              class="pa-input"
              placeholder="请输入通信方式描述"
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
            label="实例IP"
            prop="controlIp"
            min-width="200"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column
            label="实例端口"
            prop="controlPort"
            min-width="110"
          ></el-table-column>
          <el-table-column label="启动状态" width="100" show-overflow-tooltip>
            <template slot-scope="{ row }">
              {{ statusList[row.departmentId] }}
            </template>
          </el-table-column>
          <el-table-column label="网络类型" width="170" prop="beginTime">
            <template slot-scope="{ row }">
              {{ networkTypeList[row.networkType] }}
            </template>
          </el-table-column>
          <el-table-column
            label="终端上线数"
            width="170"
            prop="upperLimit"
          ></el-table-column>
          <el-table-column
            label="CPU内核数"
            width="170"
            prop="cpuKernelNumber"
          ></el-table-column>
          <el-table-column
            label="主线程数量"
            width="170"
            prop="mainThreadNumber"
          ></el-table-column>
          <el-table-column
            label="从线程数量"
            width="170"
            prop="fromThreadNumber"
          ></el-table-column>
          <el-table-column
            label="上线时间"
            width="170"
            prop="upTime"
          ></el-table-column>
          <el-table-column
            label="下线时间"
            width="170"
            prop="downTime"
          ></el-table-column>
          <el-table-column
            label="创建人姓名"
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
          <el-table-column label="操作" width="184" fixed="right">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                @click="edit(row)"
                v-if="row.status !== STATUS_START"
                >启动</el-button
              >
              <el-button
                type="text"
                @click="edit(row)"
                v-if="row.status === STATUS_START"
                >停止</el-button
              >
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
import { queryCommPatternList } from "@/api/pattern.js";
import { getValueSet } from "@/api/common.js";
import baseDataMixin from "@/mixins/baseData";
import TablePagination from "@/components/Table/table-pagination.vue";
import Template from "../template-manage/delivery-template/template.vue";
import patternEdit from "./patternEdit.vue";
export default {
  mixins: [baseDataMixin],
  components: {
    TablePagination,
    Template,
  },
  data() {
    return {
      isloading: false,
      commCodeList: [],
      selectedIdList: [],
      pageQuery: {
        commCode: "",
        commName: "",
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
  mounted() {
    this.getCommCodeList();
  },
  methods: {
    getCommCodeList() {
      queryCommPatternList({}).then((res) => {
        this.commCodeList = res.data;
      });
    },
    onAdd() {
      new this.$pageModal(
        patternEdit,
        {
          props: {
            valueTypeList: this.valueTypeList,
            encodingCodeList: this.encodingCodeList,
          },
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
    onStart() {
      //   if (this.selectedIdList.length !== 1) {
      //     this.$message.warning({
      //       content: "只能选择一条数据",
      //       duration: 3,
      //     });
      //     return;
      //   }
      //   if (this.selectedList[0].startingStatus === this.STATUS_START) {
      //     this.$message.warning({
      //       content: "前置机已经启动。",
      //       duration: 3,
      //     });
      //     return;
      //   }
      const id = this.selectedIdList[0];
      startServer(id).then((res) => {
        if (res.code === 0) {
          this.$message.success({
            content: res.msg,
            duration: 3,
          });
          this.search();
        } else {
          this.$message.error({
            content: res.msg,
            duration: 3,
          });
        }
      });
    },
    edit(row) {
      // console.log(row);
      this.$router.push({
        path: "/discount-edit",
        query: {
          id: row?.id,
        },
      });
    },
    stop(row) {
      this.$confirm("确定结束该活动吗？结束后将无法恢复。", "提示", {
        type: "warning",
      }).then(() => {
        finishDiscount(row.id).then((res) => {
          // console.log(res);
          this.$message.success("操作成功！");
          this.getTableData();
        });
      });
    },
    viewDetail(row) {
      // console.log(row);
      this.$router.push({
        path: row.status > 0 ? "/discount-detail" : "/discount-setting",
        query: {
          id: row?.id,
          editable: row.status > 0 ? "" : "1",
        },
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
