<template>
  <div class="weight-detail-container health">
    <div class="h--header">
      <div class="title">体重详情</div>
      <el-button type="primary" class="pa-btn" @click="onAddReport">
        <i class="iconfont icon-s_tianjia1" />
        新增报告
      </el-button>
    </div>
    <div class="content-container">
      <div class="patient-container">
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
        <div class="info">
          <span class="foetus">{{
            patientInfo.fetus == 1 ? "单胎" : "多胎"
          }}</span>
          <span class="pr-16"
            >孕前体重：<span>{{ patientInfo.weight }} kg</span></span
          >
          <span class="pr-16"
            >孕前身高：<span>{{ patientInfo.height * 100 }} cm</span></span
          >
          <span class="pr-16"
            >孕前BMI
            <span>{{
              (patientInfo.weight / Math.pow(patientInfo.height, 2)).toFixed(2)
            }}</span></span
          >
          <i class="iconfont icon-s_xiugai" @click="addWeight(true, (type = 'userWeight'))" style="color: #06c; cursor: pointer" />
        </div>
      </div>
      <div class="head-subtitle" v-if="reportList.length > 0">体重报告</div>
      <div class="report-list" v-if="reportList.length > 0">
        <el-row :gutter="16">
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
                <span class="title">{{ item.reportName }}</span>
                <div class="icon-container">
                  <i
                    class="iconfont icon-daisuifang"
                    style="color: #0066CC"
                    v-show="item.send"
                    title="已推送"
                  ></i>
                  <i
                    class="iconfont icon-daisuifang"
                    style="color: #999"
                    v-show="!item.send"
                    title="未推送"
                  ></i>
                  <i
                    class="iconfont icon-weichakan"
                    style="color: #0066CC"
                    v-show="item.view"
                    title="已查看"
                  ></i>
                  <i
                    class="iconfont icon-weichakan"
                    style="color: #999"
                    v-show="!item.view"
                    title="未查看"
                  ></i>
                </div>
              </div>
              <div class="date">
                <span
                  >{{ moment(item.reportStartTime).format("YYYY-MM-DD") }} -
                  {{ moment(item.reportEndTime).format("YYYY-MM-DD") }}
                </span>
              </div>
              <div class="btn-group">
                <i class="iconfont icon-s_xiugai" @click="editReport(item)"
                  >修改</i
                >
                <i
                  class="iconfont icon-s_shanchu1"
                  :class="item.send === 1 ? 'disabled' : ''"
                  @click="deleteReport(item.id, item)"
                  >删除</i
                >
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="title-title">
        <div class="head-subtitle">
          体重数据
        </div>
        <el-button
          icon="el-icon-plus"
          class="pa-btn"
          type="primary"
          @click="addWeight(false, (type = 'addNewWeight'))"
        >
          记体重
        </el-button>
      </div>
      <div class="weight-target">
        <el-row :gutter="16">
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{ weightData && weightData.weight }}</span>
                <b>
                  <i class="iconfont icon-zuijinyici"></i>
                </b>
              </div>
              <div class="title">最近一次值 (kg)</div>
              <div class="title-sub" :title="`${weightData && weightData.recordDate}${getWeekday(weightData)}`">
                {{ weightData && weightData.recordDate }}
                {{ getWeekday(weightData) }}
              </div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{ weightData && weightData.alreadyAddWeight }}</span>
                <b class="already-add">
                  <i class="iconfont icon-yizengzhong"></i>
                </b>
              </div>
              <div class="title">孕期已增重 (kg)</div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span
                  >{{ weightData && weightData.minTargetWeight }} -
                  {{ weightData && weightData.maxTargetWeight }}</span
                >
                <b class="target-add">
                  <i class="iconfont icon-mubiaozengzhong" style="margin-top: 4px"></i>
                </b>
              </div>
              <div class="title">目标增重 (kg)</div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span
                  >{{ weightData && weightData.minSuggestWeight }} -
                  {{ weightData && weightData.maxSuggestWeight }}</span
                >
                <b class="recommend-add">
                  <i class="iconfont icon-jianyitizhong"></i>
                </b>
              </div>
              <div class="title">建议体重 (kg)</div>
            </div>
          </el-col>
          <el-col :xs="4" :sm="8" :md="6" :lg="6" :xl="6">
            <div class="item">
              <div class="number">
                <span>{{ weightData && weightData.total }}</span>
                <b class="total-record">
                  <i class="iconfont icon-zongjilucishu" style="margin-top: 3px"></i>
                </b>
              </div>
              <div class="title">总记录次数 (次)</div>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="search-warp">
        <filter-daterang-picker
          :value.sync="listQuery.datetime"
          title="日期"
          :picker-options="pickerOptions"
          @change="pickerChange"
        />
        <el-button class="pa-btn" @click="searchData">
          <i class="el-icon-search" />
          查询
        </el-button>
      </div>
      <div>
        <WeightChart
          v-if="showEchart"
          class="weight-chart"
          :height="400"
          :minData="chartData.minList"
          :maxData="chartData.maxList"
          :recordData="chartData.patientWeightList"
          :startValue="startValue"
          :endValue="endValue"
          :min="min"
          :max="max"
        >
          <div class="title title-1" slot="header-left">体重表</div>
        </WeightChart>
      </div>
      <div class="head-subtitle title-1">体重记录</div>
      <div class="pa--table--box">
        <el-table class="pa-table" :data="tableData" border style="width: 100%">
          <el-table-column prop="recordDate" label="记录时间" width="180">
            <template slot-scope="{ row }">
              {{ getRecordDate(row) }}
            </template>
          </el-table-column>
          <el-table-column label="孕周" width="180">
            <template slot-scope="{ row }">
              {{ getWeekday(row, true) }}
            </template>
          </el-table-column>
          <el-table-column prop="weight" label="体重（kg）" />
          <el-table-column prop="weightType" label="体重监测">
            <template slot-scope="{ row }">
              <div :class="getRecordType(row.weightCode)">
                {{
                  (row.week > 40 || row.week < 0 || !row.weightCode) ? '' : (row.weightCode === 3 ? "偏瘦" : row.weightCode === 2 ? "偏重": "正常")
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="建议体重（kg）">
            <template slot-scope="{ row }">
              {{  (row.week > 40 || row.week < 0 || !row.minWeight  || !row.maxWeight)? '' : row.minWeight + "-" + row.maxWeight }}
            </template>
          </el-table-column>
          <el-table-column label="数据来源">
            <template slot-scope="{ row }">
              {{ translateDataFrom(row.recordType) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button
                type="text"
                class="pa-btn el-button--primary-text"
                @click="modify(true, row, (type = 'modify'))"
              >
                编辑
              </el-button>
              <el-button
                type="text"
                class="pa-btn el-button--primary-text"
                @click="deleteItem(row)"
                :disabled="row.recordType == 1"
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
    <add-weight
      v-if="addWeightDlg"
      :firstRecord="firstRecord"
      :dlgVisible="addWeightDlg"
      :weightParam="weightParam"
      :hiddenCurrentWeight="hiddenCurrentWeight"
      :isModify="isModify"
      @closeDlg="closeDlg"
      @submitData="submitData"
    ></add-weight>
  </div>
</template>
<script>
import {
  querynearweightinfo,
  getPatientRecord,
  updateWeightInfo,
  upDataWeightinfo,
  addNewWeightinfo,
  delatePatientRecord,
  deletePatientReport
} from "@/api/weight";
import { getReportList, weightQueryLinechart } from "@/api/patient";
import AddWeight from "@/views/ImDrawer/components/AddWeight.vue";
import defaultPatientImg from "@/assets/image/default-patient.png";
import WeightChart from "./components/weight-chart.vue";
import { mapState } from "vuex";
export default {
  name: "WeightDetail",
  components: {
    WeightChart,
    AddWeight
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      startValue:0,
      endValue:37,
      min: 0, //折线图y坐标的最小最大值
      max: 0,
      showEchart: false,
      hiddenCurrentWeight: false, //隐藏当前体重
      defaultPatientImg,
      patientInfo: {}, //患者信息
      firstRecord: true,
      addWeightDlg: false,
      listQuery: {
        datetime: [],
        patientId: "",
        startTime: "",
        endTime: "",
        pageNo: 1,
        pageSize: 10
      },
      minData: [],
      maxData: [],
      chartData: {
        minList: [],
        maxList: [],
        patientWeightList: []
      },
      recordData: [],
      isModify: false,
      // 给编辑体重弹窗传递的数据源
      weightParam: {
        typeName: "", // 类型
        height: "", // 身高
        weightBefore: "", // 孕前体重
        weight: "", // 当前体重
        bmi: "", // 孕前BMI
        fetus: "" // 单双保胎
      },
      reportList: [],
      weightData: {
        // 体重数据
        weight: "",
        recordDate: "",
        week: "",
        days: "",
        total: "",
        minSuggestWeight: "",
        maxSuggestWeight: "",
        minTargetWeight: "",
        maxTargetWeight: "",
        alreadyAddWeight: ""
      },
      tableData: [],
      dataTypeList: [
        {
          itemCode: 1,
          itemValue: "用户录入"
        },
        {
          itemCode: 2,
          itemValue: "后台录入"
        }
      ],
      currentPage4: 4,
      //分页器数据
      pagination: {
        pageNo: 1,
        pageSize: 10,
        total: 0
      }
    };
  },
  computed: {
    ...mapState({
      defaultPatient: state => state.defaultPatient.patient //患者信息
    }),
    // startValue() {
    //   //如果没有预产期，则从第三周开始
    //   console.log("startValue2222", this.patientInfo);

    //   if (!this.patientInfo.expectedDate) {
    //     console.log("startValue2222 return 3");
    //     return 0;
    //   }
    //   //计算开始的周数，如果开始周数小于3，则从第三周开始
    //   let days = this.$dayjs(this.patientInfo.expectedDate).diff(
    //     this.listQuery.startTime,
    //     "days"
    //   );
    //   console.log("startValue2222", days);
    //   return 40 - days / 7 > 0 ? 40 - days / 7 : 0;
    // },
    // endValue() {
    //   console.log(
    //     "endValue",
    //     this.startValue + 20 > 40 ? 40 : this.startValue + 20
    //   );
    //   return this.startValue + 20 > 40 ? 40 : this.startValue + 20;
    // }
  },
  watch: {
    "defaultPatient.id": {
      handler(val) {
        if (val) {
          // this.getPatientBaseInfo(val);
          // this.getPatientReportList(val);
          // this.getLinechartData(val);
        }
      },
      immediate: true
    },
    // startValue: {
    //   handler(val) {
    //     this.showEchart = false;
    //     this.$nextTick(() => {
    //       this.showEchart = true;
    //     });
    //   },
    //   immediate: true
    // }
  },
  created() {
    this.listQuery.datetime = [
      this.$dayjs()
        .subtract(1, "month")
        .format("YYYY-MM-DD"),
      this.$dayjs().format("YYYY-MM-DD")
    ];
    this.listQuery.startTime =
      this.$dayjs()
        .subtract(1, "month")
        .format("YYYY-MM-DD") + " 00:00:00";
    this.listQuery.endTime = this.$dayjs().format("YYYY-MM-DD") + " 23:59:59";
    this.getPatientInfo(this.$route.query.id);
  },
  methods: {
    getStartValue(startTime){
      //如果没有预产期，则从第三周开始
      console.log("startValue2222", this.patientInfo, startTime);
      if (!this.patientInfo.expectedDate) {
        console.log("startValue2222 return 3");
        return 0;
      }
      //计算开始的周数，如果开始周数小于3，则从第三周开始
      let days = this.$dayjs(this.patientInfo.expectedDate).diff(
        startTime,
        "days"
      );
      console.log("startValue2222", days, 36 - parseInt(days / 7) > 0 ? 36 - parseInt(days / 7) : 0);
      return 36 - parseInt(days / 7) > 0 ? 36 - parseInt(days / 7) : 0;
    },
    getEndValue(){
      return this.startValue + 20 > 40 ? 40 : this.startValue + 20;
    },
    getWeightSugguest(row){
      if (row) {
        if (row.week > 40 || row.week < 0  || row.days < 0) {
          return "";
        }
        return row.minWeight + "-" + row.maxWeight
      } else {
        return "";
      }
    },
    getWeightCode(row){
      if (row) {
        if (row.week > 40 || row.week < 0  || row.days < 0) {
          return "";
        }
        return row.weightCode === 1 ? "偏瘦" : (row.weightCode === 3  ? "偏重"  : "正常")
      } else {
        return "";
      }
    },
    getRecordDate(row){
      return this.$dayjs(row.recordDate).format('YYYY-MM-DD HH:mm')
    },
    getWeekday(weightData, noFlag) {
      if (weightData) {
        if (weightData.week > 40 || weightData.week < 0  || weightData.days < 0) {
          return "";
        }
        if(noFlag){
          if(weightData.days > 0){
            return `孕${weightData.week}周+${weightData.days} `;
          }
          return `孕${weightData.week}周`;
        }else{
          if(weightData.days > 0){
            return `（孕${weightData.week}周+${weightData.days} ）`;
          }
          return `（孕${weightData.week}周+${weightData.days > 0 ? weightData.days : ""} ）`;
        }
      } else {
        return "";
      }
    },
    getLinechartData({ id, startTime, endTime }) {
      weightQueryLinechart({
        patientId: id,
        startTime: startTime,
        endTime: endTime
      }).then(res => {
        console.log("getLinechartData", res);
        this.chartData = res.data;
        //数据调整成chart需要的数据格式
        this.chartData.minList = this.chartData.minList.map(item => {
          return item.weight;
        });
        this.min = Math.min(...this.chartData.minList);
        // this.chartData.maxList 
        this.chartData.maxList = this.chartData.maxList.map(item => {
          return item.weight;
        });
        this.max = Math.max(...this.chartData.maxList);
        this.chartData.patientWeightList = this.chartData.patientWeightList.map(
          item => {
            if (item.weight) {
              //比较更新最大最小值
              if (item.weight < this.min) {
                this.min = item.weight;
              }
              if (item.weight > this.max) {
                this.max = item.weight;
              }
              return [item.week - 3, item.weight];
            } else {
            }
          }
        );

        this.chartData.patientWeightList = this.chartData.patientWeightList.filter(
          item => {
            if (typeof item === "undefined") {
              return false;
            } else {
              return true;
            }
          }
        );
        console.log("getLinechartData", this.chartData, this.min, this.max);
        this.min = parseInt(this.min - 2 > 0 ? this.min - 2 : 0, 10);
        this.max = parseInt(this.max + 2, 10);


        this.startValue = this.getStartValue(this.listQuery.startTime)
        this.endValue = this.getEndValue()
        this.showEchart = false;
        this.$nextTick(() => {
            this.showEchart = true;
        });
      });
    },
    isAlready(item) {
      return item === 1 ? "already" : "";
    },
    deleteReport(id, item) {
      if(item.send === 1){
        return;
      }
      this.$confirm("是否确定删除报告？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.deleteReportApi(id);
      });
    },
    deleteReportApi(id) {
      deletePatientReport(id).then(res => {
        console.log("deleteReportApi");
        //刷新数据
        this.getPatientInfo(this.$route.query.id);
      });
    },

    // 新增报告
    onAddReport() {
      this.$router.push({
        path: "/im/weightReport",
        query: {
          patientId: this.patientInfo.id
        }
      });
    },
    editReport(item) {
      //跳转到体重报告页面
      this.$router.push({
        path: "/im/weightReport",
        query: {
          patientId: item.patientId,
          id: item.id
        }
      });
    },

    addWeight(val, typeName) {
      this.isModify = true;
      if (val == true) {
        this.weightParam = {
          typeName: typeName,
          height: this.patientInfo.height, // 身高
          weightBefore: this.patientInfo.weight, // 孕前体重
          weight: this.patientInfo.weight, // 当前体重
          bmi: (
            this.patientInfo.weight / Math.pow(this.patientInfo.height, 2)
          ).toFixed(2), // 孕前BMI
          fetus: this.patientInfo.fetus // 单双保胎
        };
      } else {
        console.log("454545", typeName);
        this.weightParam = {
          typeName: typeName
        };
        this.isModify = false;
      }
      this.firstRecord = val;
      this.addWeightDlg = true;
      this.hiddenCurrentWeight = true;
    },
    // 查询患者信息
    async getPatientInfo(id) {
      this.listQuery.patientId = id;
      const baseId = window.btoa(id);
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/getPatientDTO?id=${baseId}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.patientInfo = result.data;
          this.patientInfo.name = decodeURIComponent(
            escape(window.atob(result.data.name))
          );
          // 根据患者信息查询孕周
          //this.queryPregnancyWeek();
        }
      }
      // 体重echarts图数据
      await this.getLinechartData({
        id: id
      });

      // 体重报告
      this.listQuery.pageSize = 300;
      await getReportList({
        patientId: this.$route.query.id,
        reportType: 1
      }).then(res => {
        console.log("getReportList", res);
        this.reportList = res.data;
      });
      // 体重数据
      await querynearweightinfo({
        pageNo: 1,
        pageSize: 300,
        patientId: this.listQuery.patientId,
      }).then(res => {
        
        this.weightData = res.data;
        this.weightData.recordDate = this.weightData.recordDate ? this.$dayjs(this.weightData.recordDate).format('YYYY-MM-DD HH:mm') : ''
        // this.reportList = res.data?.rows
      });

      // 体重记录列表数据
      await this.searchRecord();
      this.showEchart = false;
      this.$nextTick(() => {
          this.showEchart = true;
      });
      this.$forceUpdate()
    },
    searchRecord() {
      console.log("searchRecord");
      this.minData = [];
      this.maxData = [];
      this.recordData = [];
      this.listQuery.pageNo = this.pagination.pageNo;
      this.listQuery.pageSize = this.pagination.pageSize;
      getPatientRecord(this.listQuery).then(res => {
        this.tableData = res.data?.rows;
        console.log("getPatientRecord", this.tableData);
        this.pagination.total = res.data.total;
        // this.tableData.reverse().forEach((item) => {
        //   this.minData.push(item.minWeight)
        //   this.maxData.push(item.maxWeight)
        //   this.recordData.push(item.weight)
        // })
      });
    },
    // 关闭体重编辑弹窗
    closeDlg() {
      this.addWeightDlg = false;
      this.isModify = false;
    },
    // 提交体重编辑
    submitData(weightItem) {
      console.log("00---", weightItem);
      // 用户BMI的体重弹窗
      if (weightItem.typeName == "userWeight") {
        this.$confirm("体重数据修改，将重新计算所有历史数据?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          updateWeightInfo({
            height: weightItem.height / 100,
            patientId: this.$route.query.id || 15,
            weight: weightItem.weightBefore,
            fetus: weightItem.fetus,
            recordDate:
              this.$dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss") ||
              weightItem.recordDate,
            recordType: 2
          }).then(() => {
            this.getPatientInfo(this.$route.query.id );
          });
        });
      }
      // 体重列表的 编辑功能
      if (weightItem.typeName == "modify") {
        upDataWeightinfo({
          id: weightItem.id,
          // height: weightItem.height,
          patientId: this.$route.query.id,
          weight: weightItem.weight,
          // fetus: weightItem.fetus,
          recordDate: weightItem.recordDate,
          recordType: 2
        }).then(() => {
          this.getPatientInfo(this.$route.query.id || 15);
        });
      }
      // 体重列表的 新增体重功能(计体重)
      if (weightItem.typeName == "addNewWeight") {
        addNewWeightinfo({
          patientId: this.$route.query.id,
          weight: weightItem.weight,
          recordDate: weightItem.recordDate,
          recordType: 2
        }).then(() => {
          this.getPatientInfo(this.$route.query.id);
        });
      }
      this.addWeightDlg = false;
      this.isModify = false;
      this.addWeightDlg = false;
    },
    translateNo(No) {
      let result = "";
      if (No == 1) {
        result = "已发送";
      } else if (No == 0) {
        result = "未发送";
      }
      return result;
    },
    translateView(No) {
      let result = "";
      if (No == 1) {
        result = "已查看";
      } else if (No == 0) {
        result = "未查看";
      }
      return result;
    },
    translateDataFrom(type) {
      let result = "";
      this.dataTypeList.forEach(item => {
        if (item.itemCode == type) {
          result = item.itemValue;
        }
      });
      return result;
    },
    getRecordType(weightCode) {
      return weightCode === 3
        ? "lower"
        : weightCode === 2
        ? "higher"
        : "normal";
    },
    searchData() { //查询按钮，首先要更新图标的开始值和结束值
      this.startValue = this.getStartValue(this.listQuery.startTime)
      this.endValue = this.getEndValue()
      this.showEchart = false;
      this.$nextTick(() => {
          this.showEchart = true;
      });
      // 体重记录列表数据
      this.pagination.pageNo = 1
      this.searchRecord();
      
    },
    pickerChange() {
      if (this.listQuery && this.listQuery.datetime) {
        this.listQuery.startTime = this.listQuery.datetime[0] + " 00:00:00";
        this.listQuery.endTime = this.listQuery.datetime[1] + " 23:59:59";
      }
    },
    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.searchRecord();
      //this.getList()
    },
    currentChange(val) {
      this.pagination.pageNo = val;
      this.searchRecord();
      //this.getList()
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
    },
    // 删除操作
    deleteItem(item) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const data = {
            id: item.id
          };

          delatePatientRecord(data).then(response => {
            // 重新请求表格数据
            this.getPatientInfo(this.$route.query.id);
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          });
        })
        .catch(() => {});
    },
    modify(val, row, typeName) {
      this.firstRecord = val ? false : true;
      this.weightParam.typeName = typeName;
      this.weightParam.id = row.id;
      this.weightParam.recordDate = row?.recordDate;
      this.weightParam.weight = row?.weight;
      this.isModify = true;
      this.addWeightDlg = true;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./health.scss";
.weight-detail-container {
  background-color: #ffffff;
  .patient-container {
    display: flex;
    justify-content: flex-start;
    padding-bottom: 24px;
    .patient-info {
      width: unset;
    }
    .info {
      display: flex;
      align-items: center;
      .foetus {
        margin: 0 24px 0 16px;
        width: 54px;
        height: 24px;
        background: rgba(242, 99, 52, 0.1);
        border-radius: 14px;
        font-size: 12px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #f26334;
        line-height: 24px;
      }
    }
  }
  ::v-deep .report-list {
    padding-top: 16px;
    margin-bottom: 24px;
    border-bottom: 1px solid #ebebeb;
    padding-left: 6px;
    .el-col {
      margin-bottom: 16px;
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
            font-size: 12px;
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
          font-size: 12px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #0066cc;
          &.disabled{
            color: #ccc;
            cursor: not-allowed;
          }
        }
        .iconfont:nth-child(1) {
          margin-right: 16px;
        }
      }
    }
  }
  ::v-deep.search-warp {
    display: flex;
    padding-bottom: 16px;
    padding-left: 6px;
    .el-date-editor--daterange {
      width: 336px !important;
    }
    .el-button {
      margin-left: 24px;
    }
  }
  .weight-target {
    padding: 10px 0 8px 6px;
    .item {
      height: 120px;
      background: #ffffff;
      border: 1px solid #ebebeb;
      display: flex;
      flex-direction: column;
      padding: 16px 14px 8px 16px;
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
        b {
          display: inline-block;
          width: 58px;
          height: 58px;
          background: #76b5f7;
          border-radius: 50%;
          text-align: center;
          line-height: 58px;
          font-weight: normal;
          &.already-add {
            background: #98ce75;
          }
          &.target-add {
            background: #98ce75;
          }
          &.target-add {
            background: #f59170;
          }
          &.recommend-add {
            background: #f6a6c2;
          }
          &.total-record {
            background: #be8fd0;
          }
          i {
            color: #fff;
            display: inline-block;
            font-size: 48px;
            padding-top: 4px;
            padding-left: 11px;
          }
        }
        img {
          height: 58px;
          width: 58px;
          border-radius: 58px;
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
        width: 100%;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
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
.weight-chart {
  .title {
    height: 20px;
    font-size: 14px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 20px;
  }
}
.pa-table {
  margin-top: 8px;
}
@media only screen and (min-width: 1420px) {
  ::v-deep.el-col-lg-6 {
    width: 20%;
  }
}
.bianji {
  cursor: pointer;
  padding-left: 16px;
}
.bianji:hover {
  color: blue;
}
.pr-16 {
  padding-right: 24px;
}

.already {
  color: #0066cc;
}

.higher {
  color: #faad14;
}

.lower {
  color: #EF4F3C;
}

// new
.patient-name {
  min-width: auto!important;
  margin-right: 0!important;
}
.weight-detail-container .weight-target .item {
  margin-bottom: 16px;
}
.title-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep .el-col-lg-6 {
  min-width: 268px;
}
.health .header .title {
  font-size: 14px;
  // font-family: PingFangSC, PingFangSC-Regular;
  font-weight: 400;
  color: #333333;
  line-height: 14px;
  position: relative;
  padding-left: 6px;
  border-left: 2px solid #06c;
  height: 14px;
  margin-bottom: 8px;
}
.health .header .title-1 {
  border-left: 2px solid #fff;
}
.health .title-1::before {
  border-left: 2px solid #fff;
}
::v-deep .el-table .cell {
  padding-left: 24px!important;
}
.pr-16 {
  color: #333;
}
.patient-info * {
  font-size: 14px;
  color: #333;
}
.gestation-weeks-title, .gestation-weeks-date {
  font-size: 14px!important;
}
.pa--table--box {
  width: 100%;
  padding-left: 6px;
}
.sex-age {
  font-size: 12px;
  margin-left: 8px;
}
::v-deep .filter-select-title {
  color: #333;
  margin-right: 8px;
}
.gestation-weeks-date {
  margin-right: 0!important;
}
.el-row{
  padding-bottom: 8px;
}
</style>
