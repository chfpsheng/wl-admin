<template>
  <div>
    <div class="name">{{ detailObj.metadataName }}</div>
    <div class="status">
      <el-switch v-model="detailObj.enable" class="drawer-switch" />
    </div>
    <el-tabs v-model="activeName" class="el-tabs" @tab-click="handleClick">
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
          :addFlag="addFlag"
          @save-success="saveSuccess"
          @close="propertyVisible = false"
        />
      </el-tab-pane>
      <el-tab-pane label="功能" name="functions">
        <div class="filter-container">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            @click="addItemFun()"
          >
            新增
          </el-button>
        </div>
        <el-table
          :data="tableDataFun"
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
                <i
                  class="el-icon-edit mouse-pointer"
                  @click="editItemFun(row)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top" effect="light">
                <i
                  class="el-icon-delete mouse-pointer"
                  @click="deleteItemFun(row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <fun-edit
          v-if="funVisible"
          :visible="funVisible"
          :initInfo="funInfo"
          :addFlag="addFlag"
          @save-success="saveSuccessFun"
          @close="funVisible = false"
        />
      </el-tab-pane>
      <el-tab-pane label="事件" name="events">
        <el-table
          :data="tableDataEvent"
          style="width: 100%; margin-bottom: 20px"
          row-key="id"
          class="pa-table"
        >
          <el-table-column
            prop="decodeMatchKey"
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
                <i
                  class="el-icon-edit mouse-pointer"
                  @click="editItemEvent(row)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top" effect="light">
                <i
                  class="el-icon-delete mouse-pointer"
                  @click="deleteItemEvent(row)"
                />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <event-edit
          v-if="eventVisible"
          :visible="eventVisible"
          :initInfo="eventInfo"
          :addFlag="addFlag"
          @save-success="saveSuccessEvent"
          @close="eventVisible = false"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { findMetadataPageList, addMetadata } from "@/api/metadata.js";
import propertyEdit from "./propertyEdit.vue";
import funEdit from "./funEdit.vue";
import eventEdit from "./eventEdit.vue";
export default {
  name: "metadataAdd",
  components: {
    propertyEdit,
    funEdit,
    eventEdit,
  },
  data() {
    return {
      addFlag: false,
      propertyVisible: false,
      propertyInfo: {},
      funVisible: false,
      funInfo: {},
      eventVisible: false,
      eventInfo: {},
      id: "",
      activeName: "property",
      tableData: [],
      tableDataFun: [],
      tableDataEvent: [],
      detailObj: {},
      metadataObj: {
        properties: [],
        functions: [],
        events: [],
      },
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
        this.tableDataFun = this.metadataObj.functions;
      });
    },
    editItemFun(row) {
      this.addFlag = false;
      this.funInfo = row;
      console.log("editItemFun", row);
      this.funVisible = true;
    },
    deleteItemFun(row) {
      let name = row.name; //properties里面没有id，所以用name比较
      let functions = this.metadataObj.functions;

      let delIndex = 0;
      functions.forEach((item, index) => {
        if (item.name == name) {
          delIndex = index;
        }
      });

      this.metadataObj.functions.splice(delIndex, 1);
      this.detailObj.metadata = JSON.stringify(this.metadataObj);
      addMetadata(this.detailObj).then((res) => {
        //刷新详情页
        this.getList(this.id);
      });
    },
    editItem(row) {
      this.addFlag = false;
      this.propertyVisible = true;
      this.propertyInfo = row;
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
    saveSuccess(propertyObj, addFlag) {
      console.log("propertyObj", propertyObj, this.metadataObj);

      if (addFlag) {
        this.metadataObj.properties.push(propertyObj);
      } else {
        this.metadataObj.properties = this.metadataObj.properties.map(
          (item) => {
            if (item.name === propertyObj.name) {
              return propertyObj;
            } else {
              return item;
            }
          }
        );
      }
      this.detailObj.metadata = JSON.stringify(this.metadataObj);
      console.log("this.detailObj", this.detailObj);
      addMetadata(this.detailObj).then((res) => {
        //刷新详情页
        this.getList(this.id);
      });
    },
    saveSuccessFun(funObj, addFlag) {
      console.log("saveSuccessFun", funObj);
      if (addFlag) {
        this.metadataObj.functions.push(funObj);
      } else {
        this.metadataObj.functions = this.metadataObj.functions.map((item) => {
          if (item.name === funObj.name) {
            return funObj;
          } else {
            return item;
          }
        });
      }
      //否则需要通过名字去查找更新的是哪一条

      this.detailObj.metadata = JSON.stringify(this.metadataObj);
      console.log("this.detailObj", this.detailObj);
      addMetadata(this.detailObj).then((res) => {
        //刷新详情页
        this.getList(this.id);
      });
    },
    handleClick(tab, event) {
      this.activeName = tab.name;
    },
    addItem() {
      this.addFlag = true;
      this.propertyVisible = true;
      this.propertyInfo = {};
    },
    addItemFun() {
      this.addFlag = true;
      this.funVisible = true;
      this.funInfo = {};
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
