<template>
  <div class="app-container">
    <div class="filter-container filter-box">
      <div class="filter-wrapper">
        <!-- :value.sync="filter.deptCode" -->
        <!-- <filter-daterang-picker
          title="选择时间"

        /> -->
        <div class="title">选择时间</div>
        <el-date-picker
          class="pa-datepicker"
          v-model="value1"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd"
          @change="pickerChange"
        />

        <el-button type="primary" class="pa-btn" @click="queryList">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table
        :height="tableHeight"
        v-loading="listLoading"
        class="pa-table"
        :data="tableData"
      >
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="创建时间" min-width="180px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.createTime }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="创建人">
          <template slot-scope="scope">
            <div>
              {{ scope.row.sysUserName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发送人数">
          <template slot-scope="scope">
            <div>
              {{
                scope.row.sendNum ? scope.row.sendNum + "人" : scope.row.sendNum
              }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="发送类型">
          <template slot-scope="scope">
            <div>
              {{ contentType(scope.row.contentType) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          label="发送内容"
          show-overflow-tooltip
          min-width="270px"
        >
          <template slot-scope="scope">
            <div
              class="send-content-container"
              v-if="scope.row.contentType === 2"
            >
              <el-image
                v-if="scope.row.img"
                style="width: 30px; height: 30px"
                fit="fit"
                :src="scope.row.img"
              />
              <span class="text">{{ scope.row.pushTitle }}</span>
            </div>
            <div
              class="send-content-container"
              v-if="scope.row.contentType === 3"
            >
              <el-image
                v-if="scope.row.img"
                style="width: 30px; height: 30px"
                fit="fit"
                :src="scope.row.img"
              />
              <span class="text">{{
                scope.row.imContent ? getJsonData(scope.row.imContent) : ""
              }}</span>
            </div>
            <div
              class="send-content-container"
              v-if="scope.row.contentType === 1"
            >
              <span class="text">{{
                replactContent(scope.row.pushContent)
              }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="发送状态">
          <template slot-scope="scope">
            <div>
              {{ sendStatus(scope.row.status) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="发送时间" min-width="180px">
          <template slot-scope="scope">
            <div>
              {{ scope.row.sendTime }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="128">
          <template slot-scope="scope">
            <el-button
              type="text"
              class="el-button--primary-text"
              @click="editItem(scope.row)"
              >查看</el-button
            >
            <el-button
              :disabled="scope.row.status != 0"
              type="text"
              class="pa-btn el-button--primary-text"
              @click="delClick(scope.row)"
              >取消</el-button
            >
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
    <!-- 订单详情 start -->
    <pa-drawer
      v-if="detailVisible"
      title="详情"
      :size="600"
      :with-footer="false"
      :visible.sync="detailVisible"
    >
      <div class="detail-container">
        <div class="detail-item">
          <div class="title">创建时间:</div>
          <div class="text">{{ detailInfo.createTime }}</div>
        </div>
        <div class="detail-item">
          <div class="title">消息类型:</div>
          <div class="text">{{ contentType(detailInfo.contentType) }}</div>
        </div>
        <div class="detail-item">
          <div class="title">消息内容:</div>
          <div class="text" style="flex: 1">
            <!--  {{detailInfo}} -->
            <div v-if="detailInfo.contentType === 2">
              <el-image
                v-if="detailInfo.img"
                style="width: 30px; height: 30px"
                fit="fit"
                :src="detailInfo.img"
              />
              <span>{{ detailInfo.pushTitle }}</span>
            </div>
            <div v-if="detailInfo.contentType === 3">
              <el-image
                v-if="detailInfo.img"
                style="width: 30px; height: 30px"
                fit="fit"
                :src="detailInfo.img"
              />
              <span>{{
                detailInfo.imContent ? getJsonData(detailInfo.imContent) : ""
              }}</span>
            </div>
            <div v-if="detailInfo.contentType === 1">
              <span style="word-break: break-word">{{
                replactContent(detailInfo.pushContent)
              }}</span>
            </div>
          </div>
        </div>
        <div class="detail-item">
          <div class="title">发送状态:</div>
          <div class="text">{{ sendStatus(detailInfo.status) }}</div>
        </div>
        <div class="detail-item">
          <div class="title">发送人数:</div>
          <!-- sendNum -->
          <div class="text">{{ detailInfo.sendNum }}</div>
        </div>

        <div class="detail-item">
          <div class="title">创建人:</div>
          <div class="text">{{ detailInfo.sysUserName }}</div>
        </div>
        <div class="detail-item">
          <div class="title">发送时间:</div>
          <div class="text">{{ detailInfo.sendTime }}</div>
        </div>
        <div class="addressee">收件人列表</div>

        <el-table :key="tableKey" :data="gridData" class="pa-table">
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.status==1"  style="color:#0066cc;font-size: 20px;" class="icon iconfont icon-s_right"></span>
                <i v-else-if="scope.row.status==0" style="color:#f26334;font-size: 20px;" class="icon iconfont icon-s_guanbi"></i>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="患者" show-overflow-tooltip min-width="120px">
            <template slot-scope="{ row }">
              <!--  {{row.patientPackage}} -->
              <div class="info-cnt">
                <div class="img-box">
                  <img
                    :src="
                      row.patientPackage.headUrl
                        ? row.patientPackage.headUrl
                        : defaultPatientImg
                    "
                    class="img-type"
                  />
                </div>
                <span v-if="row.patientPackage.name.length < 6" class="name"
                  >{{ row.patientPackage.name }}
                </span>
                <span v-if="row.patientPackage.name.length < 6"
                  >{{ row.patientPackage.sex === 1 ? "男" : "女" }} |
                  {{ row.patientPackage.age }}
                </span>
                <el-tooltip v-else effect="dark" placement="top">
                  <div slot="content">
                    <span class="name">{{ row.patientPackage.name }} </span>
                    <span
                      >{{ row.patientPackage.sex === 1 ? "男" : "女" }} |
                      {{ row.patientPackage.age }}
                    </span>
                  </div>
                  <span>{{
                    row.patientPackage.name.substr(0, 6) + "..."
                  }}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="手机号" min-width="120px">
            <template slot-scope="scope">
              <div class="mobile-container">
                <template v-if="scope.row.patientPackage.mobile">
                  {{ scope.row.patientPackage.mobile }}
                  <SensitiveInfoShow
                    :backupId="scope.row.batchMessageId"
                    business="sendRecord"
                    :id="scope.row.patientId"
                    type="手机号"
                    :url="sensitiveInfoInitUrl"
                  />
                </template>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <pa-pagination
          :current-page="seePagination.pageNo"
          :page-size="seePagination.pageSize"
          :total="seePagination.total"
          @sizeChange="seeSizeChange"
          @currentChange="seeCurrentChange"
        />
      </div>
    </pa-drawer>
  </div>
</template>

<script>
//import waves from '@/directive/waves' // waves directive
import {
  batchMessageQuery,
  getByBatchId,
  batchMessageUpdate,
} from "@/api/news";
import baseDataMixin from "@/mixins/baseData";
import defaultPatientImg from "@/assets/image/default-patient.png";
import SensitiveInfoShow from "@/components/SensitiveInfo/sensitive-info-show.vue";
export default {
  name: "Record",
  mixins: [baseDataMixin],
  components: {
    SensitiveInfoShow,
  },
  data() {
    return {
      defaultPatientImg: defaultPatientImg,
      value1: [],
      tableKey: 0,
      detailInfo: {},
      gridData: [],
      detailVisible: false,
      tableHeight: 500,
      listLoading: false, // 页面加载中
      filter: {
        beginTime: "",
        endTime: "",
      },
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      seePagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      dutyOptions: [],
      deptOptions: [],
      roleOptions: [],
      sensitiveInfoInitUrl: "/cloud-baseinfo/patient/getByBatchId",
    };
  },
  created() {},
  mounted() {
    this.initData();
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(305);
    });
    window.onresize = () => {
      this.tableHeight = this.$computeHeight(305);
    };
  },
  methods: {
    getJsonData(data) {
      let _data = data;
      let _Json = _data.data ? JSON.parse(_data.data) : "";
      return _Json?.name;
    },
    contentType(type) {
      if (type === 1) {
        return "文本";
      } else if (type === 2) {
        return "图片";
      } else {
        return "链接";
      }
    },
    sendStatus(status) {
      if (status === 0) {
        return "未发送";
      } else if (status === 1) {
        return "已发送";
      } else {
        return "已取消";
      }
    },
    pickerChange(time) {
      this.filter.beginTime = time
        ? this.moment(time[0]).format("YYYY-MM-DD HH:mm:ss")
        : "";
      this.filter.endTime = time
        ? this.moment(time[1]).format("YYYY-MM-DD") + " 23:59:59"
        : "";
    },
    queryList() {
      this.pagination.pageNo = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      const params = {
        pageNo: this.pagination.pageNo,
        pageSize: this.pagination.pageSize,
        ...this.filter,
      };
      batchMessageQuery(params).then((result) => {
        this.listLoading = false;
        if (result && result.code === 200) {
          if (result.data) {
            this.pagination.total = result.data.total;
            this.tableData = result.data.rows;
            for (const item of this.tableData) {
              // imContent
              if (item.contentType === 2 ) {
                item.imContent = item.imContent?JSON.parse(item.imContent):'';
                item.img = item.imContent?.imageInfoArray[0]?.url;
              }
              if ( item.contentType === 3 ) {
                item.imContent = item.imContent?JSON.parse(item.imContent):'';
                item.img = item?.imContent?.img;
              }
            }
          } else {
            this.pagination.total = 0;
            this.tableData = [];
          }
        }
      });
    },
    initData() {
      this.getList();
    },
    switchChange(val) {},
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.getList();
    },
    seeSizeChange(val) {
      this.seePagination.pageSize = val;
      this.editItem(this.detailInfo);
    },
    currentChange(val) {
      this.pagination.pageNo = val;
      this.getList();
    },
    seeCurrentChange(val) {
      this.seePagination.pageNo = val;
      this.editItem(this.detailInfo);
    },
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
    delClick(row) {
      this.$confirm(`取消发送将无法恢复，请谨慎操作`, "确认取消", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.delItem(row);
      });
    },
    delItem(row) {
      const data = this.$lodash.cloneDeep(row);
      // data.status = 2
      batchMessageUpdate(data).then((result) => {
        if (result && result.code === 200) {
          this.$message({
            message: "取消成功",
            type: "success",
          });
        }
        this.getList();
      });
    },
    replactContent(pushContent) {
      return pushContent
        .replace(/\[patientName\]/g, "[患者姓名]")
        .replace(/\[gestation\]/g, "[孕周]")
        .replace(/\[dueDate\]/g, "[预产期]");
    },
    editItem(item) {
      this.detailInfo = item;
      const data = {
        batchId: item.id,
        pageNo: this.seePagination.pageNo,
        pageSize: this.seePagination.pageSize,
      };
      getByBatchId(data).then((res) => {
        // if(res.data.co)
        if (res.code === 200) {
          this.gridData = res.data.rows || [];
          this.seePagination.total = res.data.total;
          for (const item of this.gridData) {
            item.patientPackage = JSON.parse(item.patientPackage);
          }
        } else {
          this.gridData = [];
        }
      });

      this.detailVisible = true;
    },
    addEmployee() {
      this.$router.push({
        path: "/employeeCreate",
      });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep.el-button--primary-text.el-button--text {
  span {
    margin-right: 0px !important;
  }
}
.filter-container {
  padding: 16px 0;
}
.filter-wrapper {
  width: 100%;
  max-width: 1094px;
  min-width: 992px;
  display: flex;
  align-items: center;
  .title {
    height: 20px;
    font-size: 14px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
    margin-right: 8px;
  }
}
.filter-item {
  margin-right: 0;
}

.detail-container {
  margin-top: 24px;
  width: 100%;
  font-size: 14px;
  padding-left: 24px;
  padding-right: 24px;
}
.table-box {
  padding: 0 24px 0 0;
}
.selectAll {
  position: absolute;
  bottom: 50px;
  left: 30px;
  background-color: pink;
  width: 100px;
  height: 100px;
}

.detail-item {
  display: flex;
  margin-bottom: 16px;
}
.detail-item .title {
  width: 70px;
  opacity: 1;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #999999;
  padding-right: 6px;
}
.detail-item .text {
  opacity: 1;
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  text-align: left;
  color: #333333;
}
.pa-btn {
  margin-left: 20px;
}

.el-table ::v-deep .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.addressee {
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #333333;
  margin-bottom: 16px;
  position: relative;
  &::before {
    display: block;
    content: " ";
    height: 14px;
    width: 2px;
    background-color: #0066cc;
    position: absolute;
    left: -8px;
    top: 3px;
  }
}
.info-cnt {
  display: flex;
  align-items: center;
  .name {
    margin-right: 8px;
  }

  .label-list-cnt {
    display: inline-block;
  }

  .img-box {
    width: 32px;
    height: 32px;
    border-radius: 16px;
    overflow: hidden;
    display: inline-block;
    align-items: center;
    margin-right: 8px;
  }

  .img-box .img-type {
    max-width: 32px;
    max-height: 32px;
  }
}
.el-table ::v-deep .cell {
  display: flex;
  align-items: center;
}
.el-table ::v-deep .cell span {
  margin-right: 12px;
  display: inline-block;
  //width: 220px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.operations {
  display: flex;
  justify-content: flex-start;
}
//table高度计算改好后及布局样式改好；这里样式统一去掉
::v-deep .pa-pagination {
  position: unset !important;
}
.app-container {
  height: unset !important;
}
.send-content-container {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  align-items: center;
  .text {
    display: block !important;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
  }
}
::v-deep .el-table__cell .mobile-container {
  display: flex;
  align-items: center;
  span {
    display: flex;
    align-items: center;
  }
}
::v-deep .pa-pagination {
  padding: 0;
  .pa-pagination-box {
    padding: 0;
  }
}
</style>
