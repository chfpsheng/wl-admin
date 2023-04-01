<template>
  <div>
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
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="sortName" label="名称" sortable width="380">
      </el-table-column>
      <el-table-column prop="sortIndex" label="排序" sortable width="200">
      </el-table-column>
      <el-table-column prop="metadataName" label="物模型" sortable width="280">
      </el-table-column>
      <el-table-column prop="description" label="说明" width="380">
      </el-table-column>
      <el-table-column label="操作" min-width="150px">
        <template slot-scope="{ row }">
          <el-tooltip content="新增" placement="top" effect="light">
            <i class="el-icon-plus mouse-pointer" @click="addItem(row)" />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top" effect="light">
            <i class="el-icon-edit mouse-pointer" @click="editItem(row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top" effect="light">
            <i class="el-icon-delete mouse-pointer" @click="deleteItem(row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <product-type-edit
      :dialogType="dialogType"
      :item="item"
      :visible.sync="visible"
      v-if="visible"
      @refreshTable="getList"
      @close="closeDialog"
    ></product-type-edit>
    <!-- <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :load="load"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table> -->
  </div>
</template>
<script>
import productTypeEdit from "./productTypeEdit.vue";
import { getProductTypeList, addType, deleteType } from "@/api/productType.js";
export default {
  name: "LabelSelectT",
  components: {
    productTypeEdit,
  },
  data() {
    return {
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
      listLoading: false, // 列表加载中
      tableData: [
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
    closeDialog() {
      this.visible = false;
    },
    deleteItem(row) {
      console.log("deleteItem", row);
      let id = row.id;
      deleteType(id).then((res) => {
        console.log(res);
        this.getList();
      });
    },
    editItem(row) {
      this.dialogType = "edit";
      console.log("edit", row);
      //   this.item = row;
      this.item = { ...row };

      this.visible = true;
      this.$session.set("employeeItem", this.item);
      console.log("edit", this.item);
    },
    addItem(row) {
      this.dialogType = "add";
      console.log("add", row);
      if (row) {
        //编辑
        this.item.parentId = row.id;
        this.item.sortLevel = row.sortLevel;
      } else {
        this.item.parentId = "";
        this.item.sortLevel = 1;
      }
      this.visible = true;
      console.log("add", this.item);
    },
    getList() {
      this.listLoading = false;
      this.visible = false;
      const params = {};
      getProductTypeList({}).then((res) => {
        console.log(res);
        this.listLoading = false;
        this.tableData = res.data;
      });
    },
  },
};
</script>