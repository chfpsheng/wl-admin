
<template>
  <div class="app-container">
    <div class="left-part">
      <BaseTree
        :isSearch="true"
        :data="treeData"
        :expandClick="false"
        @nodeClick="treeNodeClick"
        :defaultExpandedkeys="defaultExpandedkeys"
      >
        <div class="orgEditMenu" slot="rightTools" slot-scope="{ node, data }">
          <div
            class="orgEditSonMenu"
            v-if="treeNodeData.pid"
            @click="addTreeNode(node, data)"
          >
            <i title="添加功能" class="ivu-icon el-icon-plus" />
          </div>
          <div
            v-else
            class="orgEditSonMenu"
            @click="deleteTreeNode(node, data)"
          >
            <i title="删除功能" class="ivu-icon el-icon-remove-outline" />
          </div>
        </div>
      </BaseTree>
    </div>
    <div class="pa-right-part">
      <div class="flex-main table-view page-content flex flex-column">
        <div class="table-handler text-right">
          <el-button type="primary" class="pa-btn" @click="addSameLevel()">
            <i class="iconfont icon-s_tianjia1"></i>
            <span> 新增同级</span>
          </el-button>
        </div>
        <div class="flex-main">
          <el-table
            v-loading="tableLoading"
            :data="tableData"
            height="100%"
            class="pa-table"
            ref="pageTabel"
          >
            <el-table-column
              type="index"
              label="序号"
              width="60"
              fixed="left"
            ></el-table-column>
            <el-table-column
              label="代码名称"
              prop="codeName"
              min-width="200"
              show-overflow-tooltip
              fixed="left"
            ></el-table-column>
            <el-table-column
              label="代码值"
              prop="codeValue"
              min-width="110"
            ></el-table-column>

            <el-table-column
              label="分类编码"
              width="170"
              prop="typeCode"
            ></el-table-column>
            <el-table-column
              label="排序值"
              width="170"
              prop="fieldSort"
            ></el-table-column>

            <el-table-column label="操作" width="184" fixed="right">
              <template slot-scope="{ row }">
                <el-button
                  type="text"
                  @click="edit(row)"
                  v-if="row.status === 0"
                  >编辑</el-button
                >
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
  </div>
</template>

<script>
import {
  getDiscountList,
  finishDiscount,
  deleteDiscount,
} from "@/api/discount";
import baseDataMixin from "@/mixins/baseData";
import DateRangePicker from "@/components/Form/date-range-picker.vue";
import TablePagination from "@/components/Table/table-pagination.vue";
import Template from "../template-manage/delivery-template/template.vue";
import BaseTree from "@/components/BaseTree";
import AddCode from "./codeEdit.vue";
export default {
  mixins: [baseDataMixin],
  components: {
    DateRangePicker,
    TablePagination,
    Template,
    BaseTree,
  },
  data() {
    return {
      tableData: [],
      tableLoading: false,
      pageQuery: {
        departmentId: "",
        status: "",
        name: "",
        pageSize: 10,
        pageNo: 1,
        standardCodeTypeId: "",
      },
      total: 0,
      currentNode: null,
      collapsible: false,
      treeData: [
        { standardCodeTypeId: "0", label: "根节点", pid: "-1", children: [] },
      ],
      defaultExpandedkeys: [],
      //表格配置

      //树形节点点击节点id
      treeNodeId: "",
      //选中的节点数据
      treeNodeData: {},
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
  created() {},
  methods: {
    loadTabelLoadFun(page) {
      let params = { standardCodeTypeId: this.treeNodeId };
      this.pageQuery.standardCodeTypeId = this.treeNodeId;
      this.getTableData();
      // this.$refs["pageTabel"].load(params, page || 1);
    },
    treeNodeClick(data, node, slef) {
      this.treeNodeId = data.data.standardCodeTypeId;
      this.treeNodeData = data.data;
      console.log(this.treeNodeData);
      this.loadTabelLoadFun();
    },
    getDepartmentOptions() {
      return this.deptDataMixins().then((res) => {
        res.forEach((item) => {
          Object.assign(this.departmentMap, {
            [item.value]: item.label,
          });
        });
        this.departmentOptions = [
          {
            label: "全部",
            value: "",
          },
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
    addSameLevel() {
      /**
       * @function 表格新增同级
       */
      // if (this.treeNodeId.length <= 0) {
      //   this.$message.warning("请选择一条上级数据");
      //   return;
      // }
      this.addTabelItem("sameLevel");
      return false;
    },
    addTabelItem(levelText) {
      /**
       * @function 表格新增一项，
       * @param levelText 区分新增同级（sameLevel）、下级（lowerLevel）
       */
      let allSelection = this.$refs["pageTabel"].selection || [];
      // if (allSelection.length > 1) {
      //   let waringText =
      //     levelText == "sameLevel"
      //       ? "请选择一条同级数据"
      //       : "请选择一条上级数据";
      //   this.$message.warning(waringText);
      //   return;
      // }
      // if (levelText == "lowerLevel" && allSelection.length <= 0) {
      //   this.$message.warning("请选择一条上级数据");
      //   return;
      // }

      this.createTabelListMoal({
        selectedRow: allSelection[0],
        level: levelText,
        ceateType: "add",
      });
    },
    createTabelListMoal(params) {
      new this.$pageModal(
        AddCode,
        {
          props: Object.assign(
            {
              title: "新增代码类型",
              treeNodeId: this.treeNodeId,
              typeCode: this.treeNodeData.code,
            },
            params || {}
          ),
        },
        (result) => {
          if (result.state == "save") {
            if (result.ceateType == "edit") {
              let currentPage = this.$refs.pageTabel.currentPage || 1;
              this.loadTabelLoadFun(currentPage);
            } else {
              this.loadTabelLoadFun();
            }
          }
        }
      );
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
.app-container {
  display: flex;
}
.left-part {
  min-width: 250px;
  overflow: scroll;
  height: 100% !important;
  background: #fff;
}
.pa-right-part {
  overflow: hidden;
  flex-grow: 1;
  margin-left: 8px;
  position: relative;
  .filter-box {
    margin-bottom: 0px;
    border-bottom: 1px solid #ebebeb;
  }
}
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
