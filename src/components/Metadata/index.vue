<template>
  <div>
    <div class="name">{{ detailObj.metadataName }}</div>
    <div class="status">
      <el-switch v-model="detailObj.enable" class="drawer-switch" />
    </div>
    <el-tabs v-model="activeName" class="el-tabs">
      <el-tab-pane label="属性定义" name="property">
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
          class="pa-table"
        >
          <el-table-column
            prop="standardOutKey"
            label="标志"
            sortable
            width="380"
          >
          </el-table-column>
          <el-table-column prop="name" label="名称"> </el-table-column>

          <el-table-column prop="description" label="说明" width="380">
          </el-table-column>
          <el-table-column prop="valueType.type" label="数据类型" width="380">
          </el-table-column>
          <el-table-column label="操作" min-width="150px">
            <template slot-scope="{ row }">
              <el-tooltip content="编辑" placement="top" effect="light">
                <i class="el-icon-edit mouse-pointer" @click="editItem(row)" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top" effect="light">
                <i
                  class="el-icon-delete mouse-pointer"
                  @click="deleteItem(row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <property-edit
          v-if="propertyVisible"
          :visible="propertyVisible"
          :initInfo="propertyInfo"
          @save-success="saveSuccess"
          @close="propertyVisible = false"
        />
      </el-tab-pane>
      <el-tab-pane label="功能" name="functions"> </el-tab-pane>
      <el-tab-pane label="事件" name="events"> </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { findMetadataPageList, addMetadata } from "@/api/metadata.js";
import propertyEdit from "./propertyEdit.vue";
export default {
  name: "metadataAdd",
  components: {
    propertyEdit,
  },
  data() {
    return {
      propertyVisible: false,
      id: "",
      activeName: "property",
      tableData: [],
      detailObj: {},
      metadataObj: {
        properties: [],
        functions: [],
        events: [],
      },
      propertyInfo: {},
    };
  },
  created() {
    this.id = this.$route.query.id;
    this.getList(this.id);
  },
  methods: {
    getList(id) {
      findMetadataPageList({ condition: { id: id } }).then((res) => {
        console.log(res);
        this.detailObj = res.data[0];
        console.log(this.detailObj.metadata);
        if (this.detailObj.metadata) {
          this.metadataObj = JSON.parse(this.detailObj.metadata);
        } else {
          this.metadataObj = {
            properties: [],
            functions: [],
            events: [],
          };
        }
        this.tableData = this.metadataObj.properties;
      });
    },
    deleteItem(row) {
      let name = row.name; //properties里面没有id，所以用name比较
      let properties = this.metadataObj.properties;

      let delIndex = 0;
      properties.forEach((item, index) => {
        if (item.name == name) {
          delIndex = index;
        }
      });

      this.metadataObj.properties.splice(delIndex, 1);
      this.detailObj.metadata = JSON.stringify(this.metadataObj);
      addMetadata(this.detailObj).then((res) => {
        //刷新详情页
        this.getList(this.id);
      });
    },
    saveSuccess(propertyObj) {
      console.log("propertyObj", propertyObj, this.metadataObj);
      this.metadataObj.properties.push(propertyObj);
      this.detailObj.metadata = JSON.stringify(this.metadataObj);
      console.log("this.detailObj", this.detailObj);
      addMetadata(this.detailObj).then((res) => {
        //刷新详情页
        this.getList(this.id);
      });
    },
    addItem() {
      this.propertyVisible = true;
      this.propertyInfo = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.pa-ruleForm {
  padding-left: 40px;
  padding-right: 40px;
}
.form-input {
  width: 100%;
}
.name {
  font-size: 32px;
  font-weight: 600;
}
</style>