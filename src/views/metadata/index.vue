<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="addItem()"
      >
        新增
      </el-button>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      v-loading="listLoading"
      class="pa-table"
    >
      <el-table-column prop="metadataName" label="名称" sortable width="380">
      </el-table-column>
      <el-table-column label="是否启用">
        <template slot-scope="scope">
          <pa-switch
            :value.sync="scope.row.enable"
            @click="switchClick(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="280">
      </el-table-column>
      <el-table-column prop="description" label="说明" width="380">
      </el-table-column>
      <el-table-column label="操作" min-width="150px">
        <template slot-scope="{ row }">
          <el-tooltip content="编辑" placement="top" effect="light">
            <i class="el-icon-edit mouse-pointer" @click="editItem(row)" />
          </el-tooltip>
          <el-tooltip
            content="删除"
            placement="top"
            effect="light"
            v-if="!item.children"
          >
            <i class="el-icon-delete mouse-pointer" @click="deleteItem(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
      <pa-pagination
        :current-page="listQuery.pageNum"
        :page-size="listQuery.pageSize"
        :total="pagination.total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      />
    </el-table>

    <metadata-add
      :visible.sync="visible"
      v-if="visible"
      @close="closeDialog"
      @gotoDetail="gotoDetail"
    ></metadata-add>
  </div>
</template>
<script>
import { findMetadataPageList, deleteMetadata } from "@/api/metadata.js";
import metadataAdd from "./metadataAdd.vue";
export default {
  components: { metadataAdd },
  name: "metadata",
  data() {
    return {
      visible: false,
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      visible: false,
      tableHeight: "",
      dialogType: "",
      item: {
        id: "",
        name: "",
        seq: "",
        note: "",
        metadataId: "",
        parentId: "",
        parentName: "",
        sortLevel: "",
      },
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        sortDTO: {
          fieldName: "createTime",
          orderBy: "",
        },
        condition: {
          description: "",
          metadata: "",
        },
      },
      listLoading: false, // 列表加载中
      tableData: [],
    };
  },
  mounted() {
    this.getList();
    // this.$nextTick(() => {
    //   this.tableHeight = this.$computeHeight(216);
    // });
    // window.onresize = () => {
    //   this.tableHeight = this.$computeHeight(216);
    // };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
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
        `/cloud-user/sysUser/isEnabledById?id=${row.id}&status=${
          row.status ? 0 : 1
        }`,
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
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      this.pagination.pageNum = val;
      this.getList();
    },
    closeDialog() {
      this.visible = false;
    },
    gotoDetail(id) {
      this.$router.push({ path: "/system/metadataDetail", query: { id: id } });
    },
    deleteItem(row) {
      this.$confirm("确定删除", "提示", {
        type: "warning",
      }).then(() => {
        deleteMetadata(row.id).then((res) => {
          this.$message.success("删除成功！");
          this.getList();
        });
      });
    },
    editItem(row) {
      this.gotoDetail(row.id);
    },
    addItem() {
      this.visible = true;
    },
    getList() {
      this.listLoading = false;
      this.visible = false;
      const params = {};
      findMetadataPageList(this.listQuery).then((res) => {
        console.log(res);
        this.listLoading = false;
        this.tableData = res.data.records;
        this.pagination.total = res.data.total;
      });
    },
  },
};
</script>