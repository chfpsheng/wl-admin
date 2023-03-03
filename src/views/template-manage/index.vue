<template>
  <div class="app-container">
    <div class="filter-container filter-box">
      <div class="filter-wrapper">
        <filter-select
          class="common-select"
          :value.sync="filter.deptId"
          :options="deptOptions"
          title="所属科室"
        />
        <filter-select
          class="common-select"
          :value.sync="filter.status"
          :options="stateOptions"
          title="状态"
        />
        <div class="btn-group">
          <el-button type="primary" class="pa-btn" @click="queryList">
            <i class="el-icon-search" />
            查询
          </el-button>
          <el-button
            class="pa-btn"
            icon="iconfont icon-zhongzhi"
            style="margin: 0 16px 16px 0"
            @click="handleReset"
          >
            重置
          </el-button>
        </div>
      </div>
    </div>
    <div class="table-box">
      <div class="table-filter">
        <i />
        <el-button type="primary" class="pa-btn" @click="addTemplate">
          <i class="el-icon-plus" />
          新增模板
        </el-button>
      </div>
      <el-table
        v-loading="listLoading"
        class="pa-table"
        :data="tableData"
        :height="tableHeight"
      >
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column
          label="模板名称"
          show-overflow-tooltip
          prop="templateName"
        />
        <el-table-column label="所属科室" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ deptIdFormat(scope.row.deptId) }}
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="mark" show-overflow-tooltip />
        <el-table-column label="是否启用">
          <template slot-scope="scope">
            <pa-switch
              :value.sync="scope.row.status"
              @click="switchClick(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          prop="createTime"
          show-overflow-tooltip
        />
        <el-table-column label="操作" fixed="right" width="128">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="editItem(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="text"
              class="pa-btn el-button--primary-text"
              @click="delClick(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pa-pagination
      :current-page="pagination.pageNo"
      :page-size="pagination.pageSize"
      :total="pagination.total"
      @sizeChange="sizeChange"
      @currentChange="currentChange"
    />
  </div>
</template>
<script>
import baseDataMixin from "@/mixins/baseData";
export default {
  name: "TemplateManage",
  mixins: [baseDataMixin],
  data() {
    return {
      filter: {
        deptId: null,
        status: null,
      },
      deptOptions: [], //科室下拉
      //状态下拉
      stateOptions: [
        {
          label: "已启用",
          value: 1,
        },
        {
          label: "已禁用",
          value: 0,
        },
      ],
      listLoading: false, //table加载状态
      tableData: [], //table数据
      tableHeight: 500, //table列表的高度撑满计算
      //分页器数据
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
    };
  },
  async mounted() {
    await this.initData();
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(288);
    });
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(288);
    };
  },
  methods: {
    async initData() {
      this.deptOptions = await this.deptDataMixins(); // 科室
      await this.getList();
    },
    deptIdFormat(code) {
      let _text = "";
      if (code.toString() && this.deptOptions) {
        this.deptOptions.forEach((item) => {
          if (item.value == code) {
            _text = item.label;
          }
        });
      }
      return _text;
    },
    // 重置按钮
    handleReset() {
      this.filter = {
        deptId: null,
        status: null,
      };
      this.pagination.pageNo = 1;
      this.pagination.pageSize = 10;
      this.getList();
    },
    // 查询
    queryList() {
      this.pagination.pageNo = 1;
      this.getList();
    },
    async getList() {
      const params = {
        deptId: this.filter.deptId,
        status: this.filter.status,
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
      };
      const result = await this.$requestPost(
        "/cloud-consult/pregnancyTemplate/query",
        params
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.pagination.total = result.data.total;
          this.tableData = result.data.rows.map((item) => {
            item = {
              ...item,
              status: !!item.status,
            };
            return item;
          });
        } else {
          this.pagination.total = 0;
          this.tableData = [];
        }
      }
    },
    // 新增模板
    addTemplate() {
      this.$router.push({
        path: "/template/add",
      });
    },
    // 编辑模板
    editItem(item) {
      localStorage.setItem("template_edit_data", JSON.stringify(item));
      this.$router.push({
        path: "/template/edit",
        query: {
          id: item.id,
        },
      });
    },
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList()
    },
    currentChange(val) {
      this.pagination.pageNo = val;
      this.getList()
    },

    // 删除btn
    delClick(row) {
      this.$confirm(`是否确定删除模板？`, "确定删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.delItem(row);
      });
    },
    // 状态改变
    switchClick(row) {
      const text = row.status ? "禁用" : "启用";
      this.$confirm(`是否${text}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.switchStatus(row);
      });
    },
    async switchStatus(row) {
      const params = {};
      const result = await this.$requestPost(
        `/cloud-consult/pregnancyTemplate/updateStatus?templateId=${
          row.id
        }&status=${row.status ? 0 : 1}`,
        params
      );
      if (result && result.code === 200) {
        this.$message({
          message: `${row.status ? "禁用" : "启用"}成功`,
          type: "success",
        });
      }
      this.getList();
    },
    // 删除请求接口
    async delItem(row) {
      const params = {};
      const result = await this.$requestPost(
        `/cloud-consult/pregnancy/delete?id=${row.id}`,
        params
      );
      result && result.code === 200
        ? this.$message({
            message: "删除成功",
            type: "success",
          })
        : "";
      this.getList();
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .btn-group {
  display: inline-flex;
  align-items: center;
  .el-button--default {
    margin: 0 0 0 16px !important;
  }
}
::v-deep.common-select {
  .el-select {
    width: 200px;
  }
}
</style>
