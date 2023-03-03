<template>
  <div class="flex flex-column">
    <div class="page-filters page-content">
      <el-row :gutter="40">
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>所属科室</label>
            <pa-select
              :value.sync="pageQuery.departmentId"
              :options="departmentOptions"
            ></pa-select>
          </div>
        </el-col>
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>活动状态</label>
            <pa-select
              :value.sync="pageQuery.status"
              :options="statusOptions"
            ></pa-select>
          </div>
        </el-col>

        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>活动名称</label>
            <el-input
              v-input-trim
              v-model="pageQuery.name"
              class="pa-input"
              placeholder="请输入活动名称"
            ></el-input>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="filter-item">
            <label>活动时间</label>
            <date-range-picker
              :pageQuery="pageQuery"
              value-format="YYYY-MM-DD HH:mm:ss"
            ></date-range-picker>
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
        <el-button type="primary" class="pa-btn" @click="createActivity()">
          <i class="iconfont icon-s_tianjia1"></i>
          <span> 新增活动</span>
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
            label="活动名称"
            prop="name"
            min-width="200"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column
            label="活动标签"
            prop="label"
            min-width="110"
          ></el-table-column>
          <el-table-column label="所属科室" width="100" show-overflow-tooltip>
            <template slot-scope="{ row }">
              {{ departmentMap[row.departmentId] }}
            </template>
          </el-table-column>
          <el-table-column
            label="开始时间"
            width="170"
            prop="beginTime"
          ></el-table-column>
          <el-table-column
            label="结束时间"
            width="170"
            prop="endTime"
          ></el-table-column>
          <el-table-column label="状态" width="90">
            <template slot-scope="{ row }">
              <span :style="{ color: statusColorMap[row.status] }">{{
                statusMap[row.status]
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否预告" width="90">
            <template slot-scope="{ row }">
              {{ row.noticeMode ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="限购数/人" width="90">
            <template slot-scope="{ row }">
              {{ row.buyLimit === -1 ? "不限购" : row.buyLimit }}
            </template>
          </el-table-column>
          <el-table-column label="成交额(元)" min-width="150">
            <template slot-scope="{ row }">
              {{ row.activitySumInfo.orderSumMoney | currency("") }}
            </template>
          </el-table-column>
          <el-table-column label="付款订单数" width="100">
            <template slot-scope="{ row }">
              {{ row.activitySumInfo.orderCount }}
            </template>
          </el-table-column>
          <el-table-column label="付款人数" width="100">
            <template slot-scope="{ row }">
              {{ row.activitySumInfo.userCount }}
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            width="170"
            prop="createTime"
          ></el-table-column>
          <el-table-column label="操作" width="184" fixed="right">
            <template slot-scope="{ row }">
              <el-button type="text" @click="edit(row)" v-if="row.status === 0"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="stop(row)"
                v-if="row.status > 0"
                :disabled="row.status !== 1"
                >结束</el-button
              >
              <el-button type="text" @click="viewDetail(row)">
                {{ row.status > 0 ? "查看" : "管理" }}
              </el-button>
              <el-button
                type="text"
                @click="deleteRow(row)"
                :disabled="row.status > 0"
              >
                删除
              </el-button>
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
import {
  getDiscountList,
  finishDiscount,
  deleteDiscount
} from "@/api/discount";
import baseDataMixin from "@/mixins/baseData";
import DateRangePicker from "@/components/Form/date-range-picker.vue";
import TablePagination from "@/components/Table/table-pagination.vue";
import Template from "../template-manage/delivery-template/template.vue";
export default {
  mixins: [baseDataMixin],
  components: {
    DateRangePicker,
    TablePagination,
    Template
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      pageQuery: {
        departmentId: "",
        status: "",
        name: "",
        beginTime: "",
        endTime: "",
        pageSize: 10,
        pageNo: 1
      },
      total: 0,
      statusMap: {
        0: "未开始",
        1: "已开始",
        2: "已结束"
      },
      statusColorMap: {
        0: "#FFB828",
        1: "#0066CC",
        2: "#333333"
      },
      departmentMap: {},
      departmentOptions: []
    };
  },
  computed: {
    statusOptions() {
      const options = [
        {
          label: "全部",
          value: ""
        }
      ];
      for (const key in this.statusMap) {
        if (Object.hasOwnProperty.call(this.statusMap, key)) {
          const label = this.statusMap[key];
          options.push({
            label,
            value: key
          });
        }
      }
      return options;
    }
  },
  created() {
    // 页面初始化先加载科室数据
    this.getDepartmentOptions().then(() => {
      this.search();
    });
  },
  methods: {
    getDepartmentOptions() {
      return this.deptDataMixins().then(res => {
        res.forEach(item => {
          Object.assign(this.departmentMap, {
            [item.value]: item.label
          });
        });
        this.departmentOptions = [
          {
            label: "全部",
            value: ""
          }
        ].concat(res);
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
        pageNo: 1
      });
      this.search();
    },
    getTableData() {
      this.tableLoading = true;
      // TODO
      getDiscountList(this.pageQuery)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    deleteRow(row) {
      this.$confirm("确定删除该活动吗？删除后将无法恢复。", "提示", {
        type: "warning"
      }).then(() => {
        deleteDiscount(row.id).then(res => {
          this.$message.success("删除成功！");
          this.getTableData();
        });
      });
    },
    createActivity() {
      this.$router.push({
        path: "/discount-create"
      });
    },
    edit(row) {
      // console.log(row);
      this.$router.push({
        path: "/discount-edit",
        query: {
          id: row?.id
        }
      });
    },
    stop(row) {
      this.$confirm("确定结束该活动吗？结束后将无法恢复。", "提示", {
        type: "warning"
      }).then(() => {
        finishDiscount(row.id).then(res => {
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
          editable: row.status > 0 ? "" : "1"
        }
      });
    }
  }
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
