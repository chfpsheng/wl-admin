<template>
  <div class="flex flex-column">
    <div class="page-filters page-content" v-if="!showIframe">
      <el-row :gutter="40">
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>通信方式代码</label>
            <pa-select
              :value.sync="pageQuery.commPatternId"
              :options="patternList"
            ></pa-select>
          </div>
        </el-col>
        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>主从方式</label>
            <pa-select
              :value.sync="pageQuery.masterSlave"
              :options="masterSlaveList"
            ></pa-select>
          </div>
        </el-col>

        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>通信端口</label>
            <el-input
              v-input-trim
              v-model="pageQuery.serverPort"
              class="pa-input"
              placeholder="请输入通信端口"
            ></el-input>
          </div>
        </el-col>

        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>IP地址/调用地址</label>
            <el-input
              v-input-trim
              v-model="pageQuery.ipAddress"
              class="pa-input"
              placeholder="请输入IP地址/调用地址"
            ></el-input>
          </div>
        </el-col>

        <el-col :span="8" :xl="4">
          <div class="filter-item">
            <label>回调地址URI</label>
            <el-input
              v-input-trim
              v-model="pageQuery.callbackUri"
              class="pa-input"
              placeholder="请输入回调地址URI"
            ></el-input>
          </div>
        </el-col>

        <el-col :span="6" :xl="4">
          <el-button type="primary" class="pa-btn" @click="search">
            <i class="iconfont icon-s_sousuo"></i>
            <span> 查询</span>
          </el-button>
          <el-button class="pa-btn" @click="reset">
            <i class="iconfont icon-s_chongzhi"></i>
            <span> 重置</span>
          </el-button>
        </el-col>
      </el-row>
    </div>
    <div
      v-if="!showIframe"
      class="flex-main table-view page-content flex flex-column"
    >
      <div class="table-handler text-right">
        <el-button type="primary" class="pa-btn" @click="onAdd()">
          <i class="iconfont icon-s_tianjia1"></i>
          <span> 新增</span>
        </el-button>
        <el-button type="primary" class="pa-btn" @click="onQueryCache()">
          <i class="iconfont icon-s_tianjia1"></i>
          <span> 查看缓存</span>
        </el-button>
        <el-button type="primary" class="pa-btn" @click="openNodeRed()">
          <i class="iconfont"></i>
          <span>打开node-red</span>
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
            label="通信方式代码"
            prop="commCode"
            min-width="200"
            show-overflow-tooltip
            fixed="left"
          ></el-table-column>
          <el-table-column label="主从方式" prop="masterSlave" min-width="110">
            <template slot-scope="{ row }">
              {{ getMasterSlaveName[row.masterSlave] }}
            </template>
          </el-table-column>

          <el-table-column
            label="IP地址/调用地址"
            width="170"
            prop="ipAddress"
          ></el-table-column>
          <el-table-column
            label="端口"
            width="170"
            prop="serverPort"
          ></el-table-column>
          <el-table-column
            label="回调地址"
            width="170"
            prop="callbackUri"
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

          <el-table-column label="创建时间" width="170" prop="createTime"
            ><template slot-scope="{ row }">
              {{
                row.createTime
                  ? new Date(row.createTime).Format("yyyy-MM-dd hh:mm:ss")
                  : ""
              }}
            </template></el-table-column
          >

          <el-table-column
            label="更新人姓名"
            width="170"
            prop="updateUserName"
          ></el-table-column>

          <el-table-column label="更新时间" width="170" prop="updateTime"
            ><template slot-scope="{ row }">
              {{
                row.updateTime
                  ? new Date(row.updateTime).Format("yyyy-MM-dd hh:mm:ss")
                  : ""
              }}
            </template>
          </el-table-column>
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
    <div v-if="showIframe && tags.length > 1">
      <el-tag
        v-for="(tag, index) in tags"
        :key="tag.name"
        :closable="tag.closable === false ? false : true"
        :type="tag.type"
        @close="closeTag(index)"
      >
        {{ tag.name }}
      </el-tag>
    </div>
    <iframe v-if="showIframe" :src="src" style="width: 100%; height: 97%">
    </iframe>
  </div>
</template>

<script>
import {
  queryCommPortListPage,
  getCommPortCacheById,
  deleteCommPort,
} from "@/api/port.js";
import baseDataMixin from "@/mixins/baseData";
import TablePagination from "@/components/Table/table-pagination.vue";
import { queryCommPatternList } from "@/api/pattern.js";
import { getValueSet } from "@/api/common.js";
import portEdit from "./portEdit.vue";
import codeBox from "@/components/CodeBox";
export default {
  mixins: [baseDataMixin],
  components: {
    TablePagination,
  },
  data() {
    return {
      tags: [{ name: "原页面", type: "", closable: false }],
      showIframe: false,
      iframeNum: 0,
      src: "",
      tableLoading: false,
      isloading: false,
      showMore: false,
      selectedIdList: [],
      patternList: [],
      masterSlaveList: [],
      tableData: [],
      pageQuery: {
        id: "",
        commPatternId: null,
        serverPort: "",
        ipAddress: "",
        callbackUri: "",
        remark: "",
        masterSlave: "",
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
  mounted() {
    this.getPatternList();
    this.getMasterSlaveList();
    this.search();
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
    this.search();
    this.getPatternList();
    this.getPlatformNameList();
  },
  methods: {
    loadData({ responseProcess, param }) {
      queryCommPortListPage(param).then((res) => responseProcess(res.data));
    },
    openNodeRed() {
      this.showIframe = true;
      this.iframeNum++;
      this.tags.push({ name: "node-red", type: "" });
      this.src = "http://123.249.107.44:1880/";
      //window.open("http://123.249.107.44:1880/", "_blank");
      //   window.location.href = "http://123.249.107.44:1880/";
    },
    onQueryCache() {
      if (this.selectedIdList.length !== 1) {
        this.$Message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }
      getCommPortCacheById(this.selectedIdList[0]).then((result) => {
        new this.$pageModal(codeBox, {
          props: {
            code: result,
          },
        });
      });
    },
    search(page = 1) {
      //   this.$refs["pageTable"].load(this.searchForm, page);
      this.loadData(this.pageQuery);
    },
    reset() {
      this.pageQuery = {
        id: "",
        commPatternId: null,
        serverPort: "",
        ipAddress: "",
        callbackUri: "",
        remark: "",
        masterSlave: "",
        pageSize: 10,
        pageNo: 1,
      };
      this.search(1);
    },
    onAdd() {
      new this.$pageModal(
        portEdit,
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
    onEdit() {
      if (this.selectedIdList.length !== 1) {
        this.$Message.warning({
          content: "请选择一条数据",
          duration: 3,
        });
        return;
      }
      const id = this.selectedIdList[0];
      new this.$pageModal(
        portEdit,
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
    closeTag(index) {
      if (index == 1) {
        this.showIframe = false;
        this.iframeNum = 0;
        this.tags = [{ name: "原页面", type: "", closeable: false }];
      }
      this.iframeNum--;
    },
    getTableData() {
      this.tableLoading = true;
      // TODO
      const params = {
        ...this.pageQuery,
      };
      queryCommPortListPage(params)
        .then((res) => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
    onDelete() {
      if (this.selectedIdList.length < 1) {
        this.$Message.warning({
          content: "请选择要删除的数据",
          duration: 3,
        });
        return;
      }
      const id = this.selectedIdList.join(",");
      new $confirm("确认删除？", this).then(() => {
        this.isloading = true;
        deleteCommPort(id)
          .then((res) => {
            if (res.code === 0) {
              this.$Message.success({
                content: "删除成功",
                duration: 3,
              });
              this.search();
            } else {
              this.$Message.error({
                content: res.msg,
                duration: 3,
              });
            }
          })
          .finally(() => {
            this.isloading = false;
          });
      });
    },
    onSelectionChange(selectArr) {
      this.selectedIdList = selectArr.map((item) => {
        return item.id;
      });
    },
    getPatternList() {
      queryCommPatternList({}).then((res) => {
        this.patternList = res.data;
      });
    },
    //获取主从方式
    getMasterSlaveList() {
      getValueSet({ vsCode: "MASTER_SLAVE" }).then((res) => {
        this.masterSlaveList = res.data;
      });
    },
    //根据key获取接入方式名称
    getMasterSlaveName(key) {
      const masterSlave = this.masterSlaveList.find(
        (item) => item.vsiKey === key
      );
      if (masterSlave) {
        return masterSlave.vsiValue;
      } else {
        return "";
      }
    },
    //根据分页列表中的协议列表对象获取协议名称
    getProtocolNameList(protocolList) {
      if (protocolList) {
        let nameList = "";
        for (let i = 0; i < protocolList.length; i++) {
          const element = protocolList[i];
          nameList += element.protocolName + "，";
        }
        return nameList.substr(0, nameList.length - 1);
      } else {
        return "";
      }
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
