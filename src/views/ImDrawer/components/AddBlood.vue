<!--
 * @Author: your name
 * @Date: 2021-11-03 17:24:57
 * @LastEditTime: 2021-12-08 16:03:28
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \management-system\src\views\ImDrawer\components\AddBlood.vue
-->
<template>
  <div class="app-cnt">
    <el-dialog
      v-if="dlgVisible"
      class="label-dlg pa--label-dlg"
      title="记血糖"
      :visible="dlgVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="closeDlg"
      width="436px"
    >
      <div class="dlg-cnt-div">
        <div class="from-wrapper">
          <el-form
            label-width="76px"
            :model="bloodItem"
            ref="ruleFormBlood"
            :rules="rules"
            class="pa-ruleForm"
            label-position="left"
          >
            <el-form-item label="测量时间" prop="recordTime">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="bloodItem.recordTime"
                type="datetime"
                size="small"
                placeholder="选择测量时间"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                :default-time="$dayjs().format('YYYY-MM-DD HH:mm')"
                class="flex-main"
                @change="selectSugarType"
                prefix-icon="iconfont icon-s_riqixuanzheqi"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="血糖类型" prop="sugarType">
              <!-- <pa-select
                :value.sync="bloodItem.sugarType"
                :options="typeOptions"
                :clearable="false"
                class="pa-form-select"
                placeholder="选择血糖类型"
              /> -->
              <div class="flex">
                <div
                  class="time-item"
                  :class="bloodItem.sugarType === item.value ? 'choosed' : ''"
                  v-for="(item,index) in typeOptions"
                  :key="index"
                  @click="selectItem(item)"
                >
                  {{ item.label }}
                </div>
              </div>
            </el-form-item>

            <el-form-item label="血糖" prop="sugarValue">
              <div class="pa--sugar-type">
                <el-input-number
                  placeholder="请输入血糖"
                  v-model="bloodItem.sugarValue"
                  :min="2.0"
                  :max="20.0"
                  :step="0.1"
                  step-strictly
                  size="medium"
                  :controls="false"
                  class="pa-input-number"
                  @change="currentPriceChange()"
                />
                <div class="unit">mmol/L</div>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="btn-cnt">
        <el-button class="pa-btn" type="primary" @click="bloodItemInsert()"
          >确定</el-button
        >
        <el-button class="pa-btn" @click="cancleAdd">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSugarTypeList } from "@/api/patient/";

export default {
  name: "LabelSelect",
  props: {
    // 血糖一次记录
    option: {
      type: Object,
      default: () => ({})
    },
    dlgVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      typeOptions: [
       
      ],
      bloodItem: {
        time: "",
        sugarType: "",
        recordTime:this.$dayjs().format('YYYY-MM-DD HH:mm'),
        sugarValue: ""
      },
      rules: {
        recordTime: [{ required: true, message: "请选择测量时间" }],
        sugarType: [{ required: true, message: "请选择血糖类型", trigger: "blur" }],
        sugarValue: [
          { required: true, message: "请填写血糖值", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    // 编辑血糖
    if (this.option.id) {
      this.bloodItem = Object.assign({}, this.option)
      this.bloodItem.recordTime = this.$dayjs(this.bloodItem.recordTime).format('YYYY-MM-DD HH:mm:ss')
    } else {
      // 新增血糖
      // 取上一次输入的值
      this.bloodItem.sugarValue = localStorage.getItem("bloodValue") || 5;
    }
    getSugarTypeList().then(res => {
      this.typeOptions = res.data.map(item => {
        return {
          label: item.itemName,
          value: item.itemCode
        };
      });
      // 新增才计算血糖类型
      !this.option.id && this.selectSugarType(this.bloodItem.recordTime)
    });
  },
  mounted() {},
  methods: {
    selectSugarType(val){
      console.log("selectSugarType", val)
      let time = this.$dayjs(val).hour()*3600 + this.$dayjs(val).minute()*60+this.$dayjs(val).second()
      if(time <= 4*3600+59*60+59){
        console.log("04:59:59",time)
        this.bloodItem.sugarType = "BEFORE_DAWM"
      }else if(time <= 8*3600+59*60+59){
        console.log("08:59:59",time)
        this.bloodItem.sugarType = "BEFORE_BREAKFAST"
      }else if(time <= 10*3600+59*60+59){
        console.log("10:59:59",time)
        this.bloodItem.sugarType = "AFTER_BREAKFAST"
      }else if(time <= 12*3600+59*60+59){
        console.log("12:59:59",time)
        this.bloodItem.sugarType = "BEFORE_LUNCH"
      }else if(time <= 15*3600+59*60+59){
        console.log("15:59:59",time)
        this.bloodItem.sugarType = "AFTER_LUNCH"
      }else if(time <= 16*3600+59*60+59){
        console.log("16:59:59",time)
        this.bloodItem.sugarType = "BEFORE_DINNER"
      }else if(time <= 21*3600+59*60+59){
        console.log("21:59:59",time)
        this.bloodItem.sugarType = "AFTER_DINNER"
      }else if(time <= 23*3600+59*60+59){
        console.log("23:59:59",time)
        this.bloodItem.sugarType = "BEFORE_SLEEP"
      }
      this.$forceUpdate()
      // "BEFORE_DAWM"  "BEFORE_BREAKFAST"  "AFTER_BREAKFAST"  "BEFORE_LUNCH"  "AFTER_LUNCH"  "BEFORE_DINNER"  "AFTER_DINNER"  "BEFORE_SLEEP"
    },
    selectItem(item) {
      this.bloodItem.sugarType = item.value;
      this.$forceUpdate()
    },
    currentPriceChange(i) {},
    cancleAdd() {
      this.$emit("closeDlg");
    },
    bloodItemInsert() {
      console.log("bloodItemInsert");
      this.$refs.ruleFormBlood.validate(valid => {
        console.log("validate22222", valid);
        if (valid) {
          this.$emit("submitData", {
            recordTime: this.bloodItem.recordTime+":00",
            sugarType: this.bloodItem.sugarType,
            sugarValue: this.bloodItem.sugarValue,
            id: this.bloodItem.id || "" // 血糖id
          });
          // 下次输入保存上一次填入的值
          localStorage.setItem("bloodValue", this.bloodItem.sugarValue);
          this.$emit("closeDlg");
        } else {
          return false;
        }
      });
    },
    closeDlg() {
      this.$emit("closeDlg");
    }
  },
  watch: {
    option(n, o) {
      console.log(n)
      this.bloodItem = n;
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-cnt {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  padding: 24px 24px 0 24px;
  border-top: 1px solid #ebebeb;
  .el-button + .el-button {
    margin-left: 24px;
  }
}

.flex{
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.time-item{
  width: 68px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 2px;
  text-align: center;
  margin-bottom: 8px;
  cursor: pointer;
  color:#333333;
}

.choosed{
  border: 1px solid #0066cc;
  color: #0066cc;
}
::v-deep .el-dialog__body {
  overflow: hidden;
}
::v-deep .el-form-item__label::before {
  content: "";
  color: #ff4949;
  margin-right: 12px
}
::v-deep .el-form-item__label {
  padding-right: 8px;
}
</style>
