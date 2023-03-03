<template>
  <div class="weight-report health">
    <div class="h-header">
      <div class="title">{{ title }}</div>
      <div class="btn-group">
        <el-button class="pa-btn go-back" @click="goBackBtn">返回 </el-button>
        <el-button type="primary" class="pa-btn" @click="saveBtn">
          保存
        </el-button>
      </div>
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
      </div>
      <div class="h-dom">
        <el-form
          :model="report"
          :rules="rules"
          ref="ruleForm"
          class="form-content"
        >
          <el-form-item label="报告名称：" required class="text-item">
            <span>{{ report.reportName }}</span>
          </el-form-item>
          <el-form-item label="制定人：" class="text-item">
            <span>{{ report.createName ||  $local.get('userData').name }}</span>
          </el-form-item>
          <el-form-item label="体重测量时间"  prop="dateRange">
            <el-date-picker
              class="pa-datepicker"
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="pickerChange"
              value-format="yyyy-MM-dd"
              :default-value="dateRange"
              :picker-options="pickerOptions"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="对应孕周：" class="text-item">
            <span v-show="weeks.start">孕{{ weeks.start }}周</span>
            <span v-show="!weeks.start">暂无</span>
            <i> - </i>
            <span v-show="weeks.end">孕{{ weeks.end }}周</span>
            <span v-show="!weeks.end">暂无</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="head-subtitle">孕期基本数据</div>
      <div class="base-data">
        <div class="item-warp">
          <div class="item">
            <span class="title">孕前体重：</span>
            <span class="value"
              ><span>{{ patientInfo.weight }} kg</span></span
            >
          </div>
          <div class="item">
            <span class="title">身高：</span>
            <span class="value">{{ patientInfo.height * 100 }} cm</span>
          </div>
          <div class="item">
            <span class="title">孕前BMI：</span>
            <span class="value">{{
              calcBMI(patientInfo.height, patientInfo.weight)
            }}</span>
          </div>
        </div>
        <div class="item-warp">
          <div class="item">
            <span class="title">孕期体重：</span>
            <span class="value">{{ weightData && weightData.weight }} kg</span>
            <span v-html="getWeightStatus(weightData)"></span>
          </div>
          <div class="item">
            <span class="title">体重增长：</span>
            <span class="value">{{ weightData && weightData.alreadyAddWeight }} kg</span>
            <span v-html="getWeightStatus2(weightData)"></span>
          </div>
          <div class="item">
            <span class="title">建议体重：</span>
            <span class="value">
              <span
                >{{getSuggestWeight(weightData)}}</span
              ></span
            >
          </div>
        </div>
        <div class="item-warp">
          <div class="title">孕期体重增长：</div>
          <el-radio-group v-model="weightGrowRate">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">过快</el-radio>
            <el-radio :label="3">较慢</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="head-subtitle">孕期体重数据</div>
      <div class="weight-target">
        <div class="item">
          <div class="number">
            <span>{{ weightData && weightData.alreadyAddWeight }}</span>
            <div class="title">孕期体重增长 (kg)</div>
          </div>
          <b class="target-add">
            <i class="iconfont icon-yizengzhong"></i>
          </b>
        </div>
        <div class="item">
          <div class="number">
            <span>{{ weightData && weightData.minTargetWeight }} - {{ weightData && weightData.maxTargetWeight }}</span>
            <div class="title">目标增重 (kg)</div>
          </div>
          <b class="already-add">
            <i class="iconfont icon-mubiaozengzhong" style="padding: 12px 0 0 30px"></i>
          </b>
        </div>
        <div class="item">
          <div class="number">
            <span>{{getRate(weightData)}}</span>
            <div class="title">建议增重速率 (kg/周)</div>
          </div>
          <b>
            <i class="iconfont icon-jianyitizhong"></i>
          </b>
        </div>
      </div>
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
        <div class="title" slot="header-left">体重表</div>
      </WeightChart>
      <div class="head-subtitle" style="margin-top: 10px">孕期体重管理建议</div>
      <div class="weight-suggest">
        <el-input
          v-model="report.managerSuggestion"
          class="textarea"
          type="textarea"
          placeholder="请输入相关建议"
          rows="12"
          maxlength="500"
          show-word-limit
        >
        </el-input>
      </div>
      <div class="import-excel">
        <div class="head-subtitle">孕期食谱建议</div>
        <el-button class="pa-btn" @click="onImport"
          ><i class="iconfont icon-daoru"></i>导入</el-button
        >
      </div>
      <!-- 建议食谱 -->
      <div class="recipes-warp">
        <Recipes
          ref="recipe"
          :foodData="report.suggestionList"
        />
      </div>
      <!-- 导入食谱 -->
      <RecipesImport
        :foodData="foodData"
        :importShow="importShow"
        @close="importShow = false"
        @upload="onFile"
      />
      <!-- 导入表单 -->
    <form enctype="multipart/form-data" method="post">
      <input
        ref="upload"
        type="file"
        style="display: none"
        accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        multiple="multiple"
        @change="uploadFile"
      >
    </form>
    </div>
  </div>
</template>
<script>
import { querynearweightinfo } from "@/api/weight";
import RecipesImport from "./components/recipes-import.vue";
import {
  addReport,
  updateReport,
  getReport,
  getDays,
  weightQueryLinechart,
  importCookbook
} from "@/api/patient";
import WeightChart from "./components/weight-chart.vue";
import Recipes from "./components/recipes.vue";
import defaultPatientImg from "@/assets/image/default-patient.png";
export default {
  name: "WeightReport",
  props: {
    patientId: {
      type: Number | String,
      default: "141"
    }
  },
  components: {
    WeightChart,
    RecipesImport,
    Recipes
  },
  data() {
    const validateDateRange = (rule, value, callback) => {
      if(!value){
        callback(new Error("请输入身高"));
      }
      if (value && value.length == 0) {
        callback(new Error("请输入身高"));
      }
      if (Number(value) === 0) {
        callback(new Error("身高要大于0"));
      }
      if (Number(value) >= 200) {
        callback(new Error("身高不能大于200"));
      }
      callback();
    };
    return {
      weightGrowRate:'',
      id:'',
      min: 0, //折线图y坐标的最小最大值
      max: 0,
      showEchart: false,
      title: "新增体重报告", //页面标题
      dateRange: "",
      radio: 3,
      ruleForm: {
        
      },
      rules: {
        // dateRange: [{ required: true, message: '体重测量时间不能为空',  trigger: 'blur' }],
      },
      foodData: [],
      weeks: {
        start: 0,
        end: 0
      },
      importShow: false,
      defaultPatientImg: defaultPatientImg,
      patientInfo: {}, //患者信息
      report: {
        reportType: 1,
        reportName: "体重管理报告",
        managerSuggestion: "",
        suggestionList: []
      }, // 报告详情
      listQuery: {
        datetime: "",
        patientId: "",
        startTime: "",
        endTime: "",
        pageNo: 1,
        pageSize: 10
      },
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
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      }
    };
  },
  created() {
    

    let _id = this.$route?.query?.patientId || this.patientId;
    this.id = this.$route?.query?.id;
    this.getPatientInfo(_id);
    if (this.id) {
      this.title = "编辑体重报告";
      // this.getReport(this.id);//这里不能去读报告数据，因为还没有取到预产期
    } else {
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
      this.dateRange = [this.listQuery.startTime, this.listQuery.endTime]; //新增
    }
  },
  methods: {
    getStartValue(startTime){
      //如果没有预产期，则从第三周开始
      if (!this.patientInfo.expectedDate) {
        return 0;
      }
      //计算开始的周数，如果开始周数小于3，则从第三周开始
      let days = this.$dayjs(this.patientInfo.expectedDate).diff(
        startTime,
        "days"
      );
      return 36 - parseInt(days / 7) > 0 ? 36 - parseInt(days / 7) : 0;
    },
    getEndValue(){
      return this.startValue + 20 > 40 ? 40 : this.startValue + 20;
    },
    getRate(weightData){
      if(!weightData || !weightData.minGrowRate || !weightData.maxGrowRate){
        return ''
      }
      return weightData.minGrowRate + "-" + weightData.maxGrowRate
      //之前从前端取，现在改成从后端取
      
      // if(!this.patientInfo.gestationInfo || !this.weightData.minSuggestWeight || !this.weightData.maxSuggestWeight){
      //   return ''
      // }
      // const table = {
      //   '1':{
      //     'low':{
      //       '0':'0.04-0.17',
      //       '1':'0.44-0.58',
      //       '2':'0.44-0.58',
      //     },
      //     'normal':{
      //       '0':'0.04-0.17',
      //       '1':'0.35-0.50',
      //       '2':'0.35-0.50',
      //     },
      //     'high':{
      //       '0':'0.04-0.17',
      //       '1':'0.23-0.33',
      //       '2':'0.23-0.33',
      //     },
      //     'fat':{
      //       '0':'0.04-0.17',
      //       '1':'0.17-0.27',
      //       '2':'0.17-0.27',
      //     },
      //   },
      //   '2':{
      //     'low':{
      //       '0':'',
      //       '1':'',
      //       '2':'',
      //     },
      //     'normal':{
      //       '0':'0.04-0.17',
      //       '1':'0.46-0.68',
      //       '2':'0.46-0.68',
      //     },
      //     'high':{
      //       '0':'0.04-0.17',
      //       '1':'0.38-0.62',
      //       '2':'0.38-0.62',
      //     },
      //     'fat':{
      //       '0':'0.04-0.17',
      //       '1':'0.30-0.51',
      //       '2':'0.30-0.51',
      //     },
      //   },
      // }
      // let fetus = this.patientInfo.fetus + ""
      // let bmiLevel = ''
      // let bmi = this.calcBMI(this.patientInfo.height, this.patientInfo.weight)
      // if(bmi < 18.5){
      //   bmiLevel = 'low'
      // }else if(bmi < 25){
      //   bmiLevel = 'normal'
      // }else if(bmi < 30){
      //   bmiLevel = 'high'
      // }else{
      //   bmiLevel = 'fat'
      // }
      // console.log("rate",  fetus,bmi,  bmiLevel, this.patientInfo.gestationInfo.status)
      // let status = this.patientInfo.gestationInfo.status-1 + ''   //1孕早期 2孕中期 3孕晚期
      // return table[fetus][bmiLevel][status]
    },
    getWeightStatus(weightData) {
      if(!weightData || !weightData.maxSuggestWeight  || !weightData.minSuggestWeight){
        return "";
      }
      return weightData.weight > weightData.maxSuggestWeight
        ? '<span class="higher"><i class="iconfont icon-piangao1"></i>偏重</span'
        : weightData.weight < weightData.minSuggestWeight
        ? '<span class="lower"><i class="iconfont icon-piandi1"></i>偏瘦</span'
        : "";
    },
    getWeightStatus2(weightData) {
      if(!weightData || !weightData.maxTargetWeight  || !weightData.minTargetWeight){
        return "";
      }
      console.log("getWeightStatus", weightData);
      return weightData.alreadyAddWeight > weightData.maxTargetWeight
        ? '<span class="higher"><i class="iconfont icon-piangao1"></i>过快</span'
        : weightData.alreadyAddWeight < weightData.minTargetWeight
        ? '<span class="lower"><i class="iconfont icon-piandi1"></i>较慢</span'
        : "";
    },
    getSuggestWeight(weightData){
      if(!weightData){
        return "";
      }
      if(!weightData.minSuggestWeight || !weightData.maxSuggestWeight ){
        return  ''
      }
      return weightData.minSuggestWeight + '-' +  weightData.maxSuggestWeight + 'kg'
    },
    // 接收食谱上传返回的数据
    acceptFoods(data) {
      this.importShow = false;
      this.report.suggestionList = data || [];
    },
    pickerChange(val) {
      // let dayRange = this.$dayjs(val).format('YYYY-MM-DD')
      if (this.listQuery && this.dateRange) {
        this.listQuery.startTime = this.dateRange[0] + " 00:00:00";
        this.listQuery.endTime = this.dateRange[1] + " 23:59:59";
        //需要去请求对应的孕周
        // console.log("this.getGestWeeks")
        //时间改变需要去重新查找所有数据
        this.getPatientInfo(this.$route.query.patientId, true);  
        this.getGestWeeks(this.patientInfo.expectedDate, 0);
        this.getGestWeeks(this.patientInfo.expectedDate, 1);
        
      }
    },
    goBackBtn() {
      //跳回体重详情页面
      this.$router.push({
        path: "/im/weightDetail",
        query: {
          id: this.patientInfo.id
        }
      });
    },
    // 获取报告详情
    async getReport(id) {
      await getReport(id).then(res => {
        this.report = res.data || {};
        this.dateRange = [
          this.report.reportStartTime,
          this.report.reportEndTime
        ]; //编辑
          this.listQuery.startTime = this.$dayjs(this.dateRange[0]).format("YYYY-MM-DD") + " 00:00:00";
          this.listQuery.endTime = this.$dayjs(this.dateRange[1]).format("YYYY-MM-DD") + " 23:59:59";
      
        
        this.getGestWeeks(this.patientInfo.expectedDate, 0);
        this.getGestWeeks(this.patientInfo.expectedDate, 1);
      });
    },
    // 获取测量时间对应我孕期
    async getGestWeeks(expectedDate, flag) {
      if(!this.dateRange){
        return;
      }
      const recordDate = this.$dayjs(this.dateRange[flag]).format(
        "YYYY-MM-DD HH:mm:ss"
      );
      await getDays({
        pregnancyDate: expectedDate, // 预产期
        recordDate: recordDate // 测量时间
      }).then(res => {
        if (flag === 1) {
          if(res.data.week > 40 || res.data.week < 0){
            this.weeks.end = 0
          }else{
            this.weeks.end = res.data.week;
          }
        } else {
          if(res.data.week > 40 || res.data.week < 0){
            this.weeks.start = 0
          }else{
            this.weeks.start = res.data.week;
          }
        }
      });
    },
    saveBtn() {
      
      // 报告时间
      if(this.dateRange && this.dateRange[0] &&  this.dateRange[1]){
        this.report.reportStartTime = this.$dayjs(this.dateRange[0]).format("YYYY-MM-DD") + ' 00:00:00';
          this.report.reportEndTime = this.$dayjs(this.dateRange[1]).format("YYYY-MM-DD") + ' 23:59:59';
          const patientId = this.$route.query.patientId || this.patientId;
          const id = this.$route.query.id;
          // 建议食谱
          const foodList = this.$refs.recipe.tableData || [];
          foodList.forEach(item => {
            (item.reportId = id),
              (item.patientId = patientId),
              (item.reportType = 1); // 血糖
          });
          this.report.suggestionList = foodList || [];

          //同步速率
          this.report.weightGrowRate = this.weightGrowRate
          if (id) {
            // 编辑
            this.updateReport();
          } else {
            // 新增
            this.report.patientId = patientId;
            this.addReport();
          }
      }
      else{
        this.$message.error("体重测量时间不能为空")
      }
      
    },
    // 新增报告
    async addReport() {
      await addReport(this.report).then(res => {
        this.$router.push({
          path: "/im/weightDetail",
          query: {
            id: this.patientInfo.id
          }
        });
      });
    },
    // 计算BMI
    calcBMI(height, weight) {
      if (height > 0) {
        // BMI= 孕前体重(kg) / 孕前身高²(m²)
        return (weight / (height * height)).toFixed(2);
      } else {
        return "";
      }
    },
    // 编辑报告
    async updateReport() {
      this.report.reportName = "体重管理报告";
      await updateReport(this.report).then(res => {
        this.$router.push({
          path: "/im/weightDetail",
          query: {
            id: this.patientInfo.id
          }
        });
      });
    },
    // 查询患者信息
    async getPatientInfo(id, noReort) {
      const baseId = window.btoa(id);
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/getPatientDTO?id=${baseId}`
      );
      if (result && result.code === 200) {
        if (result.data) {
          this.patientInfo = result.data;
          // 根据患者信息查询孕周
          // this.queryPregnancyWeek();
          this.patientInfo.name = decodeURIComponent(
            escape(window.atob(result.data.name))
          );
        }
      }

      let reportId = this.$route?.query?.id;
      if (reportId && !noReort) {
        await this.getReport(reportId);
      }

      // 体重数据
      this.listQuery.patientId = id;
      await querynearweightinfo(this.listQuery).then(res => {
        this.weightData = res.data;
        if(!this.id){  //如果是新增
          this.getGestWeeks(this.patientInfo.expectedDate, 0);
          this.getGestWeeks(this.patientInfo.expectedDate, 1);
          this.weightGrowRate = this.report.weightGrowRate //新增应该是算出来的
        }
        //如果是新增，将初始值赋值给report的变量
        if(!this.weightData || !this.weightData.minTargetWeight || !this.weightData.maxTargetWeight){
          this.report.weightGrowRate = 1;
          this.weightGrowRate = this.report.weightGrowRate
          return;
        }
        if(!this.weightData.weightCode){
          this.report.weightGrowRate = 2
        }else{
          this.report.weightGrowRate = this.weightData.weightCode;
        }
        this.weightGrowRate = this.report.weightGrowRate 
      });

      //报告数据应该放在综合数据之后查询，因为报告的增长速率应该要覆盖综合数据的这个值，报告要请求两次，因为综合数据是需要报告的记录时间
      
      if (reportId && !noReort) {
        await this.getReport(reportId);
        this.weightGrowRate = this.report.weightGrowRate //编辑时应该从报告数据中取
      }

      // 体重echarts图数据
      await this.getLinechartData({
        id: id,
        startTime:this.$dayjs(this.dateRange[0]).format("YYYY-MM-DD") + ' 00:00:00',
        endTime: this.$dayjs(this.dateRange[1]).format("YYYY-MM-DD") + ' 23:59:59'
      });
    },
    getLinechartData({ id, startTime, endTime }) {
      weightQueryLinechart({
        patientId: id,
        startTime: startTime,
        endTime: endTime
      }).then(res => {
        this.chartData = res.data;
        //数据调整成chart需要的数据格式
        this.chartData.minList = this.chartData.minList.map(item => {
          return item.weight;
        });
        this.min = Math.min(...this.chartData.minList);
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
        
        this.min = parseInt(this.min - 2 > 0 ? this.min - 2 : 0, 10);
        this.max = parseInt(this.max + 2, 10);
        this.startValue = this.getStartValue(this.listQuery.startTime)
        this.endValue = this.getEndValue()
        //更新rchart图形的起始值


        this.showEchart = false;
        this.$nextTick(() => {
          this.showEchart = true;
        });
      });
    },
    // 导入
    onImport() {
      this.foodData = this.$refs.recipe.catchFood()
      this.importShow = true;
    },
    onFile () {
      this.$refs.upload.click()
    },
    // 导入
    async uploadFile (e) {
      let file = this.$refs.upload.files[0]
      let formData = new FormData()
      formData.append('file', file)
      await importCookbook(formData).then(res => {
        e.target.value = ''
        let list = res.data || []
        list.forEach(item =>{
          item.freCode = this.setCode(item.frequency)
        })
        this.report.suggestionList = list
        res.msg && this.$message.error(res.msg)
      }).catch(() => {
        e.target.value = ''
      })
    },

    // 编译成code
    setCode (name) {
      let arr = ['早餐', '早点', '午餐', '午点', '晚餐', '晚点']
      let index = arr.indexOf(name)
      return String(index + 1)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "./health.scss";
.patient-warp {
  display: flex;
  justify-content: space-between;
  .btn-group {
    display: flex;
  }
}
.weight-report {
  background-color: #ffffff;
  ::v-deep.form-content {
    .el-form-item {
      display: inline-flex;
      margin-right: 40px;
    }
  }
  .base-data {
    .item-warp {
      display: flex;
      padding: 16px;
      .item {
        margin-right: 40px;
        min-width: 200px;
        .title {
          color: #333333;
          min-width: 120px;
        }
        .value {
          font-weight: 400;
          color: #333333;
        }
      }
    }
  }
  .weight-target {
    padding: 16px 0 24px 6px;
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
        flex-direction: column;
        span {
          font-size: 24px;
          line-height: 32px;
          // font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          color: #333333;
          margin-bottom: 4px;
        }
      }
      b {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 58px;
        height: 58px;
        background: #76b5f7;
        border-radius: 50%;
        text-align: center;
        line-height: 58px;
        font-weight: normal;
        &.already-add {
          background: #f59170;
        }
        &.target-add {
          background: #98ce75
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
          padding-top: 8px;
          padding-left: 25px;
        }
      }
      img {
        height: 58px;
        width: 58px;
        border-radius: 58px;
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
  .weight-suggest {
    padding: 8px 0 24px 6px;
    .textarea {
      font-size: 14px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
  }
  .import-excel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .recipes {
    margin-top: 8px;
  }

  ::v-deep .lower {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #f26334;
    line-height: 20px;
  }

  ::v-deep .higher {
    height: 20px;
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #f26334;
    line-height: 20px;
  }
}
.patient-name {
  min-width: auto!important;
  margin-right: 0!important;
}
.base-data {
  padding: 16px 0 8px 6px;
}
.weight-report .base-data .item-warp {
  padding: 0;
  margin-bottom: 16px;
}
.weight-report .weight-target {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
.weight-report .item {
  width: 32.4%;
}
.weight-report .weight-target .item {
  padding: 24px;
  padding-left: 34px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
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
::v-deep .table-contianer .frist-coloumn, ::v-deep .table-contianer .frist-row {
  text-align: center;
}
.h-header {
  font-size: 16px;
  font-weight: 400;
  color: #333333;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #ebebeb;
}
.recipes-warp {
  padding-left: 6px;
}
::v-deep .lower .icon-piandi1 {
  margin: 0 8px;
}
.base-data ::v-deep .el-radio-group {
  display: flex!important;
  align-items: center!important;
  padding-top: 2px!important;
}
.base-data ::v-deep .el-radio-group .el-radio {
  margin-right: 24px!important;
}
.h-dom ::v-deep .el-form-item__label {
  padding-right: 8px;
}
::v-deep .text-item .el-form-item__label {
  padding: 0;
}
::v-deep .el-table--border td:first-child .cell, ::v-deep .el-table--border th:first-child .cell {
  padding-left: 0!important;
}
.base-data * {
  color: #333;
}
::v-deep .gestation-weeks-title, ::v-deep .gestation-weeks-date {
  font-size: 14px!important;
}

.base-data * {
  color: #333;
}


</style>
