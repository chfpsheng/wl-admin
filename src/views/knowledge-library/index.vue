<template>
  <div class="app-container">
    <div class="left-part">
      <ly-tree
        ref="lyTree"
        @updateNodeInfo="updateNodeInfo"
        @initData="initData"
      />
    </div>
    <div class="pa-right-part">
      <div class="filter-container filter-box" ref="filterWrapper">
        <div class="filter-wrapper">
          <filter-daterang-picker
            :value.sync="listQuery.datetime"
            title="创建日期"
            @change="pickerChange"
          />
          <filter-select
            title="状态"
            :value.sync="listQuery.status"
            placeholder="选择状态"
            :options="tagTypeOptions"
          ></filter-select>
          <filter-input
            class="keywork-input"
            :value.sync="listQuery.title"
            placeholder="输入文章标题"
            title="文章搜索"
          />
          <el-button
            class="pa-btn"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            查询
          </el-button>
        </div>
      </div>
      <div class="table-box">
        <div class="table-filter">
          <i />
          <el-button
            :disabled="typeNode.level <= 1"
            class="pa-btn"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >
            新增知识
          </el-button>
        </div>

        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          :height="tableHeight"
          class="pa-table"
        >
          <el-table-column label="序号" type="index" width="80" />
          <el-table-column
            label="文章标题"
            show-overflow-tooltip
            min-width="120px"
          >
            <template slot-scope="{ row }">
              <span>{{ row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column label="类型" min-width="100px" show-overflow-tooltip>
            <template slot-scope="{ row }">
              <span>{{ getTypeZh(row.type) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属科室" min-width="120px">
            <template slot-scope="{ row }">
              <span>{{ getDepetZh(row.depetNum) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="所属分类" min-width="170px">
            <template slot-scope="{ row }">
              <span>{{
                row.categories && row.categories[0]
                  ? row.categories[0].typeName
                  : ""
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="适用孕周" min-width="150px">
            <template slot-scope="{ row }">
              <span>{{
                `孕${row.gestationStart}周` + "-" + `孕${row.gestationEnd}周`
              }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="阅读量" min-width="70px">
            <template slot-scope="{ row }">
              <span>{{ row.weight }}</span>
            </template>
          </el-table-column>
          <el-table-column label="点赞数" min-width="70px">
            <template slot-scope="{ row }">
              <span>{{ row.weight }}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="创建人" show-overflow-tooltip min-width="70px">
            <template slot-scope="{ row }">
              <span>{{ row.createUserName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否启用" min-width="100px">
            <template slot-scope="scope">
              <pa-switch
                :active-value="activeValue"
                :inactive-value="inactiveValue"
                :value.sync="scope.row.status"
                @click="updateStatus(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column label="创建时间" min-width="170px">
            <template slot-scope="{ row }">
              <span>{{ row.createTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="124px">
            <template slot-scope="{ row }">
              <el-button
                class="pa-btn el-button--primary-text"
                type="primary"
                size="mini"
                @click="editItem(row)"
              >
                编辑
              </el-button>
              <el-button
                class="pa-btn el-button--primary-text"
                type="primary"
                size="mini"
                @click="deleteItem(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pa-pagination
          :current-page="pagination.pageNo"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        />
      </div>
    </div>
  </div>
</template>
<script>
import {
  labelQuery,
  labelInsert,
  labelUpdate,
  labelDelete,
  getLabel,
  labelUpdateOnly,
} from "@/api/knowledge";
import AddEditScience from "./add-edit-science.vue";
import LyTree from "./tree.vue";
import { find, cloneDeep } from "lodash";
import baseDataMixin from "@/mixins/baseData";
export default {
  name: "science",
  components: { LyTree, AddEditScience },
  mixins: [baseDataMixin],
  data() {
    return {
      treeData: [],
      title: "",
      typeNode: {},
      tableHeight: 0,
      activeValue: 1,
      inactiveValue: 0,
      labelTypeId: 1, // 当前选中的label标签分类
      isAdd: true,
      detailInfo: {
        labelTypeId: "", // 标签分类
        status: 1,
        weight: "",
        tagType: 0,
        displayOrder: 1,
        conditions: [],
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      // 查询条件
      listQuery: {
        datetime: null,
        status: "", //状态:0关闭、1启用、不传获取所有
        title: "",
        //pageNo: 1,
        //pageSize: 10,
      },
      //分页器数据
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      showReviewer: false,
      // 状态
      tagTypeOptions: [
        {
          label: "全部",
          value: "",
        },
        {
          label: "禁用",
          value: "0",
        },
        {
          label: "启用",
          value: "1",
        },
      ],
      downloadLoading: false,
      operatorOptions: [],
      ageOptions: [],
      dateOptions: [],
      productOptions: [], // 产品服务下拉
      deptOptions: [], //所属科室
      nodeArr: [],
    };
  },
  computed: {
    categoryName() {
      if (!this.detailInfo.labelTypeId) {
        return "";
      }
      const category = find(this.treeData, { id: this.detailInfo.labelTypeId });
      if (category) {
        return category.typeName;
      } else {
        return "";
      }
    },
  },
  watch: {
    labelTypeId(val) {
      this.handleFilter();
    },
  },
  created() {
    this.initApi();
    this.getList(false);
  },
  mounted() {
    window.onresize = () => {
      this.countHeight()
    }
    this.$nextTick(() => {
      this.countHeight()
    })
    // this.$nextTick(() => {
    //   this.tableHeight = this.$computeHeight(285);
    // });
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    countHeight() {
      const h = this.$refs.filterWrapper.offsetHeight
      const num = 200 + h
      this.tableHeight = this.$computeHeight(num)
    },
    // 初始化接口数据
    async initApi() {
      // 所属科室
      this.deptOptions = await this.deptDataMixins();
    },
    // 树形结构初始化
    initData(data) {
      // 找到根节点数据
      this.treeData = data.data;
      this.typeNode = data.treeData[0];
      if (data.editorName && data.editorName.length > 0) {
        this.labelTypeId = data.editorName[0].id;
        this.typeNode = data.editorName[0];
      } else {
        this.labelTypeId = this.typeNode.id;
      }
      this.getList();
    },
    // 分类对应中文
    getTypeZh(val) {
      let _valZh = "";
      if (val == null || val == undefined) {
        return _valZh;
      }
      switch (val) {
        case 0:
          _valZh = "图文";
          break;
        case 1:
          _valZh = "图文";
          break;
        case 2:
          _valZh = "图文";
          break;
        default:
          break;
      }
      console.log(_valZh);
      return _valZh;
    },
    // 科室对应中文
    getDepetZh(id) {
      let _name = "";
      if (this.deptOptions && this.deptOptions.length > 0) {
        this.deptOptions.forEach((item) => {
          if (item.value == id) {
            _name = item.label;
          }
        });
      }
      return _name;
    },
    // 树形结构更新
    updateNodeInfo(node) {
      console.log('所有数据', this.treeData, "选中的节点", node);
      if(node.parentId !== 0) {
        this.nodeArr = []
        this.nodeFor(node)
      }
      this.typeNode = node;
      console.log(node);
      this.labelTypeId = node?.id ? node.id : 0;
    },
    nodeFor(node) {
      this.nodeArr.unshift(node.id)
      if(node.parentId !== 1) {
        const parentNode = this.treeData.find(item => item.id === node.parentId)
        parentNode ? this.nodeFor(parentNode) : ''
      }
    },
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.pagination.pageNo = val;
      this.getList();
    },
    // 启用禁用状态切换
    updateStatus(item) {
      const text = item.status === 1 ? "禁用" : "启用";
      this.$confirm(`是否${text}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        item.status = item.status === 1 ? 0 : 1;
        const data = {
          id: item.id,
          status: item.status,
        };
        labelUpdateOnly(data).then((res) => {
          if (res.code === 200) {
            this.getList();
            this.$message({
              type: "success",
              message: "更新成功!",
            });
          } else {
            item.status = item.status === 1 ? 0 : 1;
            this.$message({
              type: "error",
              message: "更新失败!",
            });
          }
        });
      });
    },
    // 编辑操作
    editItem(item) {
      console.log(item);
      this.$router.push({
        path: "/knowledge/edit",
        query: {
          type: "edit",
          id: item.id,
        },
      });
    },
    // 删除操作
    deleteItem(item) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const data = {
            id: item.id,
          };

          labelDelete(data).then((response) => {
            // 重新请求表格数据
            this.getList();
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {});
    },
    cancleAdd() {
      this.$refs["ruleForm"].resetFields();
      this.detailVisible = false;
    },
    handleAdd() {
      this.$session.set('nodeArr', this.nodeArr)
      this.$router.push({
        path: "/knowledge/add",
        query: {
          type: "add",
          categoryId: this.labelTypeId,
        },
      });
    },
    // 获取列表数据
    getList(search = true) {
      this.listLoading = true;
      let data = {};
      if (search) {
        // 带查询条件
        data = {
          categoryId:this.labelTypeId,
          status:this.listQuery.status,
          title:this.listQuery.title,
          startTime:this.listQuery.startTime,
          endTime:this.listQuery.endTime,
          pageNo:this.pagination.pageNo,
          pageSize:this.pagination.pageSize,
        }
      } else {
        // 查询表格数据不带查询条件
        data = {
          categoryId: this.labelTypeId,
          ...this.listQuery,
        };
      }
      labelQuery(data)
        .then((response) => {
          this.list = response.data.rows || [];
          this.pagination.total = response.data.total;
          this.listLoading = false;
        })
        .catch((e) => {});
    },
    // 搜索
    handleFilter() {
      this.listQuery.pageNo = 1;
      this.getList();
    },
    // 时间组件事件
    pickerChange(data) {
      console.log(data);
      this.listQuery.startTime = data ? data[0] : "";
      this.listQuery.endTime = data ? data[1] : "";
      this.listQuery = {
        ...this.listQuery,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
.keywork-input >>> .filter-input {
  width: 200px !important;
}

>>> .pa-pagination {
  padding: 0px;
}

.app-container {
  display: flex;
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
.detail-item {
  display: flex;
  margin-bottom: 16px;
}
.detail-item .title {
  width: 120px;
}
.detail-item .text {
  color: #333;
}
.detail-sub-title {
  font-weight: bold;
  border-bottom: 1px dashed #ddd;
  padding-bottom: 10px;
  margin-bottom: 15px;
}
.detail-item .product img {
  width: 120px;
  height: 120px;
  margin-right: 10px;
}
.detail-container {
  font-size: 14px;
  padding-left: 20px;
  max-height: calc(100vh - 100px);
  overflow-y: scroll;
  margin-right: -20px;
}
.export-btn {
  margin-left: 0;
}
.empty img {
  width: 98px;
  height: 64px;
}
.form-input.el-textarea {
  width: 100%;
}
.drawer-content {
  padding: 0 24px;
}
::v-deep.status-container {
  display: flex;
  align-items: center;
  .switch {
    margin-left: 10px;
  }
}
.left-part {
  min-width: 250px;
  overflow: scroll;
  height: 100% !important;
  background: #fff;
}
::v-deep.left-part .ly-tree-container {
  height: 100% !important;
}
::v-deep.pa-pagination {
  position: unset !important;
}
::v-deep.ly-tree {
  height: 100%;
  .el-card {
    height: 100%;
  }
}
.el-radio-group {
  margin-left: 16px;
}
::v-deep .radio {
  .el-radio__input.is-checked + .el-radio__label,
  .el-radio__label {
    color: #333;
  }
}
::v-deep .pa-drawer .drawer-body {
  width: 100%;
  height: calc(100% - 144px);
  overflow: hidden;
  color: #333;
}
.form-items {
  margin-top: 10px;
  span + .el-form-item,
  .el-form-item + span {
    margin-left: 8px;
  }
  .el-form-item {
    overflow: visible;
  }
  > span {
    line-height: 32px;
    margin-bottom: 18px;
  }
}
::v-deep .el-form .el-checkbox {
  margin-right: 4px;
}
.input-select {
  margin-top: 10px;
  position: relative;
  .el-form-item {
    overflow: visible;
  }
  > span {
    position: absolute;
    right: 8px;
    top: 0px;
    line-height: 32px;
  }
}
::v-deep .conditions {
  position: relative;
  background-color: #f8f8f8;
  border: 1px solid #ddd;
  margin-bottom: 24px;
  &::before {
    content: "";
    position: absolute;
    left: 180px;
    top: -8px;
    width: 16px;
    height: 16px;
    border-left: 1px solid #ddd;
    border-top: 1px solid #ddd;
    background-color: #f8f8f8;
    z-index: 1;
    transform: rotate(45deg);
  }
  > .condition-title {
    padding: 0 16px;
    line-height: 48px;
    border-bottom: 1px solid #ddd;
  }
  > .condition-form {
    padding: 16px 16px 0;
    .el-form-item.is-required:not(.is-no-asterisk)
      > .el-form-item__label:before,
    .el-form-item.is-required:not(.is-no-asterisk)
      .el-form-item__label-wrap
      > .el-form-item__label:before {
      display: none;
    }
  }
}
::v-deep .filter-wrapper {
  .filter-select,
  .filter-input {
    width: 220px !important;
  }
}
.filter-box {
  padding-bottom: 0;
}
.filter-box .filter-item {
  margin-bottom: 16px!important;
}
.filter-box .pa-btn {
  margin-bottom: 16px!important;
}
.filter-wrapper {
  display: flex;
  flex-wrap: wrap;
}
</style>