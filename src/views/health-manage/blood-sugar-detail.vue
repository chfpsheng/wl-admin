<template>
  <div class="blood-detail-container health">
    <div class="header">
      <div class="title">血糖详情</div>
      <el-button type="primary" class="pa-btn" @click="onAddReport">
        <i class="iconfont icon-s_tianjia1" />
        新增报告
      </el-button>
    </div>
    <div class="content-container">
      <div class="patient-warp">
        <div class="patient-info">
          <img
            class="patient-avatar"
            :src="patientInfo.headUrl ? patientInfo.headUrl : defaultPatientImg"
            alt="头像"
          />
          <span class="patient-name">{{ patientInfo.name }}</span>
          <span class="sex-age"
            >{{ patientInfo.sex == 1 ? "男" : "女" }} <span style="color:#ebebeb">|</span>
            {{ patientInfo.age }}</span
          >
          <span class="gestation-weeks-title" v-if="patientInfo.gestationInfo"
            >孕周：</span
          >
          <span class="gestation-weeks-date" v-if="patientInfo.gestationInfo">
            {{
              patientInfo.gestationInfo
                ? patientInfo.gestationInfo.totalWeeks +
                  "周" +
                  (patientInfo.gestationInfo.weekDays > 0
                    ? "+" + patientInfo.gestationInfo.weekDays
                    : "")
                : ""
            }}
          </span>
        </div>
        <div class="diabetes-type">糖尿病类型</div>
        <el-select
          class="pa-select"
          v-model="patientInfo.diabetes"
          placeholder="请选择"
          @change="onChangeSick"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <!-- 血糖报告 -->
      <div class="head-subtitle" v-show="reportList.length">血糖报告</div>
      <div class="report-list" v-show="reportList.length">
        <el-row :gutter="24">
          <el-col
            :xs="4"
            :sm="8"
            :md="8"
            :lg="6"
            :xl="6"
            v-for="(item, index) in reportList"
            :key="index"
          >
            <div class="report-item">
              <div class="status">
                <span class="title">{{item.reportName}}</span>
                <div class="icon-container">
                  <i class="iconfont icon-daisuifang" style="color: #0066CC" v-show="item.send" title="已推送"></i>
                  <i class="iconfont icon-fasong" v-show="!item.send" title="未推送"></i>
                  <i class="iconfont icon-weichakan" style="color: #0066CC" v-show="item.view" title="已查看"></i>
                  <i class="iconfont icon-yulan" v-show="!item.view" title="未查看"></i>
                </div>
              </div>
              <div class="date">
                <span>{{$dayjs(item.reportStartTime).format('YYYY.MM.DD')}} - {{$dayjs(item.reportEndTime).format('YYYY.MM.DD')}}</span>
              </div>
              <div class="btn-group">
                <i class="iconfont icon-s_xiugai" @click="onEditReport(item.id)">修改</i>
                <i
                  class="iconfont icon-s_shanchu1"
                  @click="onDeleteReport(item)"
                  :class="item.send === 1 ? 'disabled' : ''"
                >删除</i>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 血糖数据 -->
      <div class="head-subtitle-warp">
        <div class="head-subtitle">血糖数据</div>
        <el-button class="pa-btn" @click="onAddBlood">
          <i class="iconfont icon-s_tianjia1" />
          记血糖
        </el-button>
      </div>
      <div class="blood-target">
        <el-row :gutter="16">
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{result.sugarValue}}</span>
                <b>
                  <i class="iconfont icon-zuijinyici1"></i>
                </b>
              </div>
              <div class="title">最近一次值 (mmol/L)</div>
              <div class="title-sub">{{result.recordTime}}</div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{result.count || 0}}</span>
                <b class="total">
                  <i class="iconfont icon-zongjilucishu"></i>
                </b>
              </div>
              <div class="title">总记录次数（次）</div>
              <div class="title-sub"></div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{result.midCount || 0}}</span>
                <b class="reach">
                  <i class="iconfont icon-dabiao"></i>
                </b>
              </div>
              <div class="title">达标次数</div>
              <div class="title-sub">达标率{{(result.minRatio * 100).toFixed(0) || 0}}%</div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{result.lowCount || 0}}</span>
                <b class="low">
                  <i class="iconfont icon-piandi"></i>
                </b>
              </div>
              <div class="title">偏低次数</div>
              <div class="title-sub">偏低率{{(result.lowRatio * 100).toFixed(0) || 0}}%</div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{result.highCount || 0}}</span>
                <b class="high">
                  <i class="iconfont icon-piangao"></i>
                </b>
              </div>
              <div class="title">偏高次数</div>
              <div class="title-sub">偏高率{{(result.highRatio * 100).toFixed(0) || 0}}%</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-warp">
        <filter-daterang-picker
          :value.sync="dateRange"
          title="日期"
          :picker-options="pickerOptions"
        />
        <el-button class="pa-btn" @click="searchData">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
      <BloodSugarTable
        class="blood-sugar-warp"
        :tableData="tableData"
      >
        <div class="head-subtitle blood-label-before" slot="label-before">
          血糖表
        </div>
      </BloodSugarTable>
      <pa-pagination
        :current-page="query.pageNo"
        :page-size="query.pageSize"
        :total="query.total"
        @sizeChange="onPagesize"
        @currentChange="onPageCurrent"
      />
      <!-- 血糖记录 -->
      <div class="head-subtitle blood-record-head">血糖记录</div>
      <el-table class="pa-table inner-table" :data="bloodList" border style="width: 100%">
        <el-table-column prop="recordTime" label="记录时间"  width="200px"/>
        <el-table-column prop="week" label="孕周" width="200px">
          <template slot-scope="{ row }">
            <span
              v-show="row.week > 0 && row.week <= 40 && row.days >=0 "
            >
              <i>孕{{row.week}}周</i>
              <i v-show="row.days">+{{row.days}}</i>
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sugarType" label="血糖类型" width="150px">
          <template slot-scope="{ row }">
            {{row.sugarType | bloodType}}
          </template>
        </el-table-column>
        <el-table-column prop="sugarValue" label="血糖（mmol/L）" width="200px"/>
        <el-table-column prop="sugarRange" label="血糖监测" width="150px">
          <template slot-scope="{ row }">
            <span
              :style="{color: row.sugarRange === 'HIGH' ? '#FAAD14' : (row.sugarRange === 'LOW' ? '#EF4F3C' : '#333')}"
            >
              {{row.sugarRange === 'HIGH' ? '偏高' : (row.sugarRange === 'LOW' ? '偏低' : '正常')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="sugarDesc" label="目标血糖（mmol/L）" width="200px" />
        <el-table-column prop="dataSources" label="数据来源" min-width="150px">
          <template slot-scope="{ row }">
            {{row.dataSources === '2' ? '后台录入' : '用户录入'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150px">
          <template slot-scope="{ row }">
            <el-button
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              @click="onEditBlood(row)"
            >
              编辑
            </el-button>
            <el-button
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              :disabled="row.dataSources === '1'"
              @click="onDeleteBlood(row.id)"
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
    <AddBlood
      :dlgVisible="bloodShow"
      :option="bloodItem"
      @submitData="saveBlood"
      @closeDlg="bloodShow = false"
      v-if="bloodShow"
    />
  </div>
</template>
<script>
import defaultPatientImg from "@/assets/image/default-patient.png";
import BloodSugarTable from "./components/blood-sugar-table.vue";
import AddBlood from '../ImDrawer/components/AddBlood.vue';
import {
  getReportList,
  queryBloodAnalaysis,
  getBloods,
  getBloodTable,
  deleteReport,
  deleteBlood,
  bloodItemInsert,
  bloodItemUpdate
} from '@/api/patient';
import { updateWeightInfo } from '@/api/weight';
export default {
  name: "BloodSugarDetail",
  components: {
    BloodSugarTable,
    AddBlood
  },
  data() {
    return {
      defaultPatientImg,
      bloodShow: false, // 血糖录入弹框
      dateRange: '',
      patientInfo: {}, //患者信息
      result: {}, // 血糖数据
      bloodItem: {},
      options: [
        {
          value: "0",
          label: "无",
        },
        {
          value: "1",
          label: "糖尿病合并妊娠",
        },
        {
          value: "2",
          label: "妊娠期糖尿病",
        },
      ],
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime()
        }
      },
      query: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      //分页器数据
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      },
      tableData: [],
      reportList: [],
      bloodList: []
    }
  },
  created() {
    // 时间范围默认7天
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
    this.dateRange = [start, end]
    this.query.beginTime = this.$dayjs(start).format('YYYY-MM-DD')
    this.query.endTime = this.$dayjs(end).format('YYYY-MM-DD')
    this.pagination.beginTime = this.$dayjs(start).format('YYYY-MM-DD')
    this.pagination.endTime = this.$dayjs(end).format('YYYY-MM-DD')
    let _id = this.$route?.query?.id || this.patientId;
    this.getPatientInfo(_id);
  },
  methods: {
    // 查询患者信息
    async getPatientInfo(id) {
      const baseId = window.btoa(id)
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/getPatientDTO?id=${baseId}`
      )
      if (result && result.code === 200) {
        if (result.data) {
          this.patientInfo = result.data;
          this.patientInfo.diabetes = String(this.patientInfo.diabetes)
          this.patientInfo.name = decodeURIComponent(escape(window.atob(result.data.name)))
          // 根据患者信息查询孕周
          this.getReportList(this.patientInfo.id)
          this.getResult(this.patientInfo.id)
          this.getBloodList(this.patientInfo.id)
          this.getTableList(this.patientInfo.id)
        }
      }
    },

    // 糖尿病类型
    onChangeSick (value) {
      this.patientInfo.patientId = this.patientInfo.id
      this.patientInfo.diabetes = value
      this.patientInfo.recordType = 2
      updateWeightInfo(this.patientInfo).then(() => {
        this.$message.success('保存成功')
      })
    },

    // 获取历史报告
    async getReportList (patientId) {
      await getReportList({ patientId: patientId, reportType: 2}).then(res => {
        this.reportList = res.data || []
      })
    },

    // 获取血糖分析结果
    async getResult (patientId) {
      await queryBloodAnalaysis({ patientId: patientId}).then(res => {
        this.result = res.data || {}
      })
    },

    // 获取血糖表数据
    async getTableList (patientId) {
      this.query.patientId = patientId
      await getBloodTable(this.query).then(res => {
        this.tableData = res.data.rows || []
        this.query.total = res.data.total || 0
      })
    },

    // 获取血糖记录
    async getBloodList (patientId) {
      this.pagination.patientId = patientId
      await getBloods(this.pagination).then(res => {
        this.bloodList = res.data.rows || []
        this.pagination.total = res.data.total || 0
      })
    },

    // 查询血糖记录
    searchData () {
      let dates = this.dateRange
      this.query.pageNo = 1
      this.pagination.pageNo = 1
      if (dates) {
        this.query.beginTime = dates[0]
        this.query.endTime = dates[1]
        this.pagination.beginTime = dates[0]
        this.pagination.endTime = dates[1]
        this.getTableList(this.patientInfo.id)
        this.getBloodList(this.patientInfo.id)
      }
    },

    // 新增报告
    onAddReport () {
      this.$router.push({
        path: '/im/sugarReport',
        query: {
          patientId: this.patientInfo.id
        }
      })
    },

    // 修改报告
    onEditReport (id) {
      this.$router.push({
        path: '/im/sugarReport',
        query: {
          patientId: this.patientInfo.id,
          id: id
        }
      })
    },

    // 删除报告
    onDeleteReport (item) {
      if (item.send !== 1) {
        this.$confirm('是否确定删除报告？', '提示', {
          type: 'warning'
        }).then(() => {
          deleteReport(item.id).then(() => {
            this.$message.success('删除成功')
            this.getReportList(this.patientInfo.id)
          })
        })
      }
    },

    // 新增血糖
    onAddBlood () {
      this.bloodItem = {}
      this.bloodShow = true
    },

    // 编辑血糖
    onEditBlood (option) {
      this.bloodItem = option
      this.bloodShow = true
    },

    // 保存血糖
    saveBlood (data) {
      this.bloodShow = false
      data.patientId = this.patientInfo.id
      // data.id存在，为编辑
      if (data.id) {
        bloodItemUpdate(data).then(() => {
          this.$message.success('保存成功')
          this.getBloodList(this.patientInfo.id)
          this.getResult(this.patientInfo.id)
          this.getTableList(this.patientInfo.id)
        })
      } else {
        bloodItemInsert(data).then(() => {
          this.$message.success('保存成功')
          this.getBloodList(this.patientInfo.id)
          this.getResult(this.patientInfo.id)
          this.getTableList(this.patientInfo.id)
        })
      }
    },

    // 删除血糖
    onDeleteBlood (id) {
      this.$confirm('是否确定删除记录？', '提示', {
        type: 'warning'
      }).then(() => {
        deleteBlood(id).then(() => {
          this.$message.success('删除成功')
          this.getBloodList(this.patientInfo.id)
          this.getResult(this.patientInfo.id)
          this.getTableList(this.patientInfo.id)
        })
      })
    },

    // 分页器方法
    sizeChange (val) {
      this.pagination.pageSize = val;
      this.getBloodList(this.patientInfo.id)
    },
    currentChange (val) {
      this.pagination.pageNo = val;
      this.getBloodList(this.patientInfo.id)
    },
    onPagesize (val) {
      this.query.pageSize = val;
      this.getTableList(this.patientInfo.id)
    },
    onPageCurrent (val) {
      this.query.pageNo = val;
      this.getTableList(this.patientInfo.id)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./health.scss";

.patient-warp {
  margin: 0 0 24px 0;
  display: flex;
  align-content: center;
  .diabetes-type {
    line-height: 32px;
    margin: 0 8px 0 24px;
    font-size: 14px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
  }
  .btn-group {
    display: flex;
  }
}
.blood-detail-container {
  background-color: #ffffff;
  .patient-warp{
    .patient-info{
      width: unset;
      color:#333;
    }
  }
  ::v-deep.report-list {
    padding-top: 16px;
    border-bottom: 1px solid #ebebeb;
    margin-bottom: 24px;
    padding-left: 6px;
    padding-bottom: 8px;
    .el-col {
      margin-bottom: 16px;
      padding-left: 8px !important;
      padding-right: 8px !important;
    }
    .report-item {
      height: 107px;
      border: 1px solid #ebebeb;
      background-color: #ffffff;
      border-radius: 2px;
      display: flex;
      flex-direction: column;
      .status {
        display: flex;
        justify-content: space-between;
        padding: 16px 16px 8px 16px;
        .title {
          font-size: 14px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #333333;
        }
        .icon-container {
          .iconfont {
            font-size: 14px;
          }
          i {
            margin-left: 16px;
          }
        }
      }
      .date {
        font-size: 12px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
        padding: 0 16px 16px 16px;
      }
      .btn-group {
        border-top: 1px solid #ebebeb;
        flex: 1;
        display: flex;
        align-items: center;
        padding: 0 16px;
        .iconfont {
          cursor: pointer;
          font-size: 14px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #0066cc;
          &.disabled{
            color: #ccc;
            cursor: not-allowed;
          }
          &::before{
            margin-right: 4px;
          }
        }
        .iconfont:nth-child(1) {
          margin-right: 16px;
        }
      }
    }
  }
  .head-subtitle-warp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .head-subtitle {
      margin: 0;
      padding: 0;
    }
  }

  .search-warp {
    display: flex;
    margin: 0 0 16px 0;
    .el-button {
      margin-left: 24px;
    }
  }
  .blood-target {
    margin-top: 8px;
    padding-left: 6px;
    .item {
      height: 120px;
      background: #ffffff;
      border: 1px solid #ebebeb;
      display: flex;
      flex-direction: column;
      padding: 16px 14px 8px 16px;
      margin-bottom: 24px;
      .number {
        height: 58px;
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        span {
          font-size: 24px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #333333;
        }
        b{
          display: inline-block;
          width: 58px;
          height: 58px;
          background: #76b5f7;
          border-radius: 50%;
          text-align: center;
          line-height: 58px;
          font-weight: normal;
          &.total{
            background: #BF8FD2;
          }
          &.reach{
            background: #98CE75;
          }
          &.low{
            background: #F59170;
          }
          &.high{
            background: #F6A6C2;
          }
          i {
            color: #fff;
            display: inline-block;
            font-size: 48px;
            padding-top: 5px;
            padding-left: 13px;
          }
        }
      }
      .title {
        height: 20px;
        font-size: 14px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
      }
      .title-sub {
        height: 16px;
        font-size: 12px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
        line-height: 16px;
      }
    }
  }
  .blood-record-head {
    margin: 0 0 8px 0;
  }
  ::v-deep.blood-sugar-warp {
    .label-warp {
      margin-bottom: 8px;
    }
    .blood-label-before {
      margin: 0;
      padding: 0;
    }
  }

  .pa-pagination {
    position: static;
    padding: 0px;
    .pa-pagination-box {
      padding: 0px;
    }
  }
}
@media only screen and (min-width: 1420px) {
  ::v-deep.el-col-lg-6 {
    width: 20%;
  }
}
.sex-age{
  font-size: 12px;
  color: #333;
}
::v-deep .el-table{
  margin-left: 6px;
}
::v-deep .el-table__header, ::v-deep .el-table__body {
  width: 100%!important;
  td{
    height: 48px !important;
  }
}

::v-deep .filter-select-title{
  color:#333333 !important;
  margin-right: 8px;
}
</style>