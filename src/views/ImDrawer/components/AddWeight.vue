<!--
 * @Author: your name
 * @Date: 2021-11-03 17:24:57
 * @LastEditTime: 2021-12-09 16:57:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \management-system\src\views\ImDrawer\components\AddBlood.vue
-->
<template>
  <div class="app-cnt">
    <el-dialog
      v-if="dlgVisible"
      class="label-dlg pa--label-dlg"
      :title= title
      :visible="dlgVisible"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="closeDlg"
      width="444px"
    >
      <div class="dlg-cnt-div">
        <div class="from-wrapper">
          <el-form
            v-if="firstRecord"
            label-width="76px"
            ref="ruleFormFirst"
            :model="weightItem"
            :rules="rules"
            class="pa-ruleForm"
            label-position="left"
          >
            <el-form-item label="身高" prop="height">
              <el-input
                placeholder="请输入身高"
                v-model="weightItem.height"
                size="medium"
                :controls="false"
                class="pa-input-number"
                onkeyup="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'')}else{this.value=this.value.replace(/\D/g,'')}" 
                onafterpaste="if(this.value.length==1){this.value=this.value.replace(/[^1-9]/g,'0')}else{this.value=this.value.replace(/\D/g,'')}" 
                @change="refreshBmi()"
                ><i slot="suffix" style="font-style: normal; margin-right: 10px"
                  >cm</i
                ></el-input
              >
            </el-form-item>

            <el-form-item label="孕前体重" prop="weightBefore">
              <el-input
                placeholder="请输入孕前体重"
                v-model="weightItem.weightBefore"
                size="medium"
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                :controls="false"
                class="pa-input-number"
                @change="refreshBmi()"
                ><i slot="suffix" style="font-style: normal; margin-right: 10px"
                  >kg</i
                ></el-input
              >
            </el-form-item>

            <el-form-item label="当前体重" v-if="!hiddenCurrentWeight" prop="weight">
              <el-input
                placeholder="请输入当前体重"
                v-model="weightItem.weight"
                size="medium"
                :controls="false"
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                class="pa-input-number"
                ><i slot="suffix" style="font-style: normal; margin-right: 10px"
                  >kg</i
                ></el-input
              >
            </el-form-item>

            <el-form-item label="孕前BMI" prop="bmi">
              <el-input
                placeholder="请输入孕前BMI"
                v-model="weightItem.bmi"
                :disabled="true"
                :controls="false"
                size="medium"
                class="pa-input-number"
              ></el-input>
            </el-form-item>

            <el-form-item label="单双胎" prop="fetus">
              <el-radio-group
                v-model="weightItem.fetus"
              >
                <el-radio v-model="weightItem.fetus" :label="1">单胎</el-radio>
                <el-radio v-model="weightItem.fetus" :label="2">双胎</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <el-form
            v-else
            label-width="76px"
            ref="ruleForm"
            :model="weightItem"
            :rules="rules"
            class="pa-ruleForm"
            label-position="left"
          >
            <el-form-item label="测量时间" prop="recordDate">
              <el-date-picker
                :picker-options="pickerOptions"
                v-model="weightItem.recordDate"
                type="datetime"
                size="medium"
                placeholder="选择测量时间"
                :default-time="$dayjs().format('YYYY-MM-DD HH:mm')"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                class="flex-main"
                prefix-icon="iconfont icon-s_riqixuanzheqi"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="体重" prop="weight">
              <el-input
                placeholder="请输入体重"
                v-model="weightItem.weight"
                size="medium"
                oninput="value=value.replace(/[^0-9.]/g,'').replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3')"
                class="pa-input-number"
              >
                <i slot="suffix" style="font-style: normal; margin-right: 10px"
                  >kg</i
                >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="btn-cnt">
        <el-button class="pa-btn" type="primary" @click="submitForm()"
          >确定</el-button
        >
        <el-button class="pa-btn" @click="cancleAdd">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { labelTypeQuery, labelQuery } from '@/api/patient/'
import dayjs from 'dayjs'
export default {
  name: 'LabelSelect',
  props: {
    firstRecord: {
      type: Boolean,
      default: true,
    },
    dlgVisible: {
      type: Boolean,
      default: false,
    },
    weightParam: {
      tyle: Object,
      default() {
        return {};
      }
    },
    isModify: {
      type: Boolean,
      default: false,
    },
    //去掉当前体重的选项
    hiddenCurrentWeight: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const validateWeightBefore = (rule, value, callback) => {
      console.log(value);
      if(!value){
        callback(new Error("请输入孕前体重"));
      }
      if (value && value.length == 0) {
        callback(new Error("请输入孕前体重"));
      }
      if (Number(value) === 0) {
        callback(new Error("孕前体重要大于0"));
      }
      if (Number(value) > 300) {
        callback(new Error("孕前体重不能大于300"));
      }
      callback();
    };
    const validateWeight = (rule, value, callback) => {
      console.log(value);
      if(!value){
        callback(new Error("请输入体重"));
      }
      if (value && value.length == 0) {
        callback(new Error("请输入体重"));
      }
      if (Number(value) === 0) {
        callback(new Error("体重要大于0"));
      }
      if (Number(value) > 300) {
        callback(new Error("体重不能大于300"));
      }
      callback();
    };
    const validateHeight = (rule, value, callback) => {
      console.log(value);
      if(!value){
        callback(new Error("请输入身高"));
      }
      if (value && value.length == 0) {
        callback(new Error("请输入身高"));
      }
      if (Number(value) === 0) {
        callback(new Error("身高要大于0"));
      }
      if (Number(value) > 200) {
        callback(new Error("身高不能大于200"));
      }
      callback();
    };
    return {
      title: "记体重",
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() > new Date().getTime();
        }
      },
      weightItem: {
        typeName:'',
        fetus: 1,
        bmi:'',
        weightBefore:'',
        recordDate: this.$dayjs().format('YYYY-MM-DD HH:mm'),
        height:''
      },
      rules: {
        weightBefore: [
          { required: true, validator: validateWeightBefore, trigger: 'blur' },
        ],
        recordDate: [{ required: true, message: '请选择时间' }],
        height: [{ required: true, validator: validateHeight,  trigger: 'blur' }],
        bmi: [{ required: true, message: '请输入孕前bmi', trigger: 'change' }],
        weight: [
          { required: true, validator: validateWeight,  trigger: 'blur' } ,
        ],
        type: [{ required: true, message: '请输入单双胎', trigger: 'blur' }],
      },
    }
  },
  watch:{
     isModify: {
      handler(val) {
        if (val == true) {
          this.weightItem = this.$lodash.cloneDeep(this.weightParam)
          // this.firstRecord = true
          this.weightItem.height = this.weightItem.height*100
        }
      },
      immediate: true,
    },
  },
  created() {
    console.log('addBlood created', this.firstRecord, this.isModify)
    if(this.firstRecord){
      this.title = "孕前体重"
      if(this.isModify){
        this.title = "修改孕前体重"
      }
    }else{
      if(this.isModify){
        this.title = "编辑体重"
      }
      else{
        this.weightItem.typeName = "addNewWeight"
      }
    }
  },
  mounted() {},
  methods: {
    refreshBmi(){
      console.log("refreshBmi", this.weightItem.weightBefore, this.weightItem.height)
      if(this.weightItem.height && this.weightItem.weightBefore){
        this.weightItem.bmi = (this.weightItem.weightBefore /((this.weightItem.height/100 ) * (this.weightItem.height/100))).toFixed(2);
        console.log("refreshBmi", this.weightItem.bmi)
      }
    }, 
    currentPriceChange(i) {
      console.log(6666666, i)
    },
    cancleAdd() {
      this.$emit('closeDlg')
    },
    submitData() {
      console.log('submitData')
      this.$emit('submitData', this.weightItem)
    },
    submitForm() {
      if (this.firstRecord) {
        this.$refs.ruleFormFirst.validate((valid) => {
          if (valid) {
            this.weightItem.recordDate = dayjs(new Date()).format(
              'YYYY-MM-DD HH:mm:ss'
            )
            this.submitData()
          } else {
            return false
          }
        })
      } else {
        this.$refs.ruleForm.validate((valid) => {
          this.weightItem.recordDate = this.weightItem.recordDate + ":00"
          if (valid) {
            this.submitData()
          } else {
            return false
          }
        })
      }
    },
    closeDlg() {
      this.$emit('closeDlg')
    },
  },
}
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
::v-deep .el-dialog__body {
  overflow: hidden;
}
::v-deep .el-form-item__label::before {
  content: "";
  color: #ff4949;
  margin-right: 10px
}
::v-deep .el-form-item__label {
  padding: 0
}
</style>
