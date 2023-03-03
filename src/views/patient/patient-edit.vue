<template>
  <div class="app-container">
    <div class="handle-box">
      <i />
      <div>
        <el-button class="pa-btn" @click="linkManaclickge">取消</el-button>
        <el-button type="primary" class="pa-btn" @click="submitForm">
          确定
        </el-button>
      </div>
    </div>
    <el-form
      ref="ruleForm"
      :model="detailInfo"
      :rules="rules"
      label-width="100px"
      class="pa-ruleForm"
      style="padding-top: 24px"
    >
      <div class="form-box">
        <el-form-item label="患者姓名" prop="name">
          <el-input class="pa-input" v-model="detailInfo.name" />
        </el-form-item>
        <el-form-item label="联系电话" prop="mobile">
          <el-input class="pa-input" v-model="detailInfo.mobile" />
        </el-form-item>
        <el-form-item label="预产期" prop="expectedDate">
          <!-- <el-input v-model="detailInfo.expectedDate" /> -->
          <el-date-picker
            v-model="detailInfo.expectedDate"
            type="date"
            class="pa-date-picker form-date-picker"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期"
            :picker-options="pickerOptions"
          />
        </el-form-item>
        <el-form-item label="专属管家" prop="assignKeeperName">
          <el-select
            v-model="detailInfo.assignKeeper"
            class="form-long-select pa-input"
            placeholder="请选择"
            @change="changeAssignKeeper"
            :clearable="true"
          >
            <el-option
              v-for="item in housekeeperOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            class="pa-input"
            v-model="detailInfo.idCard"
            @change="idChange"
          />
        </el-form-item>
        <el-form-item label="出生日期" prop="birthDate">
          <!-- <el-input disabled v-model="detailInfo.birthDate" /> -->
          <el-date-picker
            v-model="detailInfo.birthDate"
            type="date"
            class="pa-date-picker form-date-picker"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期"
            :picker-options="{
              disabledDate: (time) => {
                return time.getTime() > Date.now()
              },
            }"
          />
          <!-- - 3600 * 1000 * 24; -->
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <el-radio v-model="detailInfo.sex" :label="1">男</el-radio>
          <el-radio v-model="detailInfo.sex" :label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="微信号" prop="wechatNo">
          <el-input
            class="pa-input"
            v-model="detailInfo.wechatNo"
            placeholder="请输入用户微信号"
          ></el-input>
        </el-form-item>
        <el-form-item label="胎次">
          <el-select
            v-model="detailInfo.parity"
            placeholder="请选择"
            class="pa-input"
            style="width: 100%"
            :clearable="true"
          >
            <el-option
              class="pa-input"
              v-for="(item, index) in parityOptions"
              :key="index"
              :label="item.itemName"
              :value="item.itemCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="生产日期" prop="bornChildDate">
          <el-date-picker
            v-model="detailInfo.bornChildDate"
            type="date"
            class="pa-date-picker form-date-picker"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="患者标签" prop="labelList">
          <div
            class="label-list-cnt"
            v-html="showLabelList(detailInfo.labelList)"
          />
          <i
            class="iconfont icon-xiugaiiconbeifen1 icon-error iconsize"
            @click="viewItemLabel(detailInfo)"
          />
        </el-form-item>
        <el-form-item label="居住地址">
          <div class="flex">
            <el-select
              v-model="detailInfo.province"
              placeholder="选择省份"
              class="pa-input"
              style="width: 50%"
              @change="changePro(true)"
            >
              <el-option
                v-for="(item, index) in provinceList"
                :key="index"
                :label="item.name"
                :value="item.provinceId"
              />
            </el-select>
            <el-select
              v-model="detailInfo.city"
              placeholder="选择市县"
              class="pa-input"
              style="width: 50%"
            >
              <el-option
                v-for="(item, index) in cityList"
                :key="index"
                :label="item.name"
                :value="item.cityId"
              />
            </el-select>
          </div>
        </el-form-item>
        <el-form-item label="居住详细地址">
          <el-input
            class="pa-input"
            v-model="detailInfo.address"
            maxlength="50"
          ></el-input>
        </el-form-item>
        <el-form-item label="职业">
          <el-select
            v-model="detailInfo.profession"
            placeholder="请选择"
            class="pa-input"
            style="width: 100%"
            :clearable="true"
          >
            <el-option
              v-for="(item, index) in professionList"
              :key="index"
              :label="item.itemName"
              :value="item.itemCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="学历" class="pa-input">
          <el-select
            v-model="detailInfo.education"
            placeholder="请选择"
            style="width: 100%"
            :clearable="true"
          >
            <el-option
              v-for="(item, index) in educationList"
              :key="index"
              :label="item.itemName"
              :value="item.itemCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="家庭年收入" class="pa-input">
          <el-select
            v-model="detailInfo.income"
            placeholder="请选择(单位人民币/元)"
            style="width: 100%"
            :clearable="true"
          >
            <el-option
              v-for="(item, index) in incomeList"
              :key="index"
              :label="item.itemName"
              :value="item.itemCode"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="所属科室" prop="departmentId">
          <el-select
            v-model="detailInfo.departmentId"
            class="form-long-select pa-input"
            disabled
            placeholder="请选择"
          >
            <el-option
              v-for="item in keshiOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->

        <!-- <el-form-item label="就诊卡号" prop="regCard">
          <el-input class="pa-input" v-model="detailInfo.regCard" maxlength="20" />
        </el-form-item> -->
        <el-form-item label="患者备注" prop="description">
          <el-input
            v-model="detailInfo.description"
            type="textarea"
            placeholder="输入患者备注"
            maxlength="200"
            show-word-limit
            class="pa-input form-input"
            :autosize="{ minRows: 4, maxRows: 16 }"
          />
        </el-form-item>
      </div>
    </el-form>
    <label-select
      v-if="dlgVisible"
      :dlg-visible="dlgVisible"
      :init-data="initLableData"
      @closeDlg="closeDlg"
      @updateLabelList="updateLabelList"
    />
  </div>
</template>

<script>
import {
  queryAssigner,
  patientUpdate,
  getProvince,
  getCity,
  getNewPatientById,
  getSysDictionary,
} from '@/api/patient'
import { checkIDCard } from '@/utils/validate'
// import * as moment from 'moment'
import baseDataMixin from '@/mixins/baseData'
import LabelSelect from '@/components/LabelSelect'
// const { deepClone } = require('../../utils')
export default {
  name: 'PatientEdit',
  components: {
    LabelSelect,
  },
  mixins: [baseDataMixin],
  props: {
    editVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if (!/^1[3456789]\d{9}$/.test(value)) {
          callback(new Error('请输入正确的手机号'))
        } else {
          callback()
        }
      }
    }
    var validateCardLen = (rule, value, callback) => {
      const reg = new RegExp('^[0-9]*$')
      if (value.toString().length > 20) {
        callback(new Error('长度不超过20'))
      } else if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      } else {
        callback()
      }
    }
    // var validateExpectedDate = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入预产期'))
    //   } else {
    //     const today = moment().add(280, 'days')
    //     if (moment(value).isBefore(today)) {
    //       callback(new Error('预产期只能在280天以内'))
    //     }
    //   }
    // }
    return {
      pickerOptions: {
        disabledDate: (time) => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() + 280))
          return time > nowData
        },
      },
      initLableData: [],
      patientId: '',
      components: {
        LabelSelect,
      },
      parityOptions: [
        {
          itemName: '头胎',
          itemCode: 1,
        },
        {
          itemName: '二胎',
          itemCode: 2,
        },
        {
          itemName: '三胎',
          itemCode: 3,
        },
        {
          itemName: '四胎',
          itemCode: 4,
        },
        {
          itemName: '四胎以上',
          itemCode: 5,
        },
      ],
      detailInfoMore: {},
      // 学历
      educationList: [],
      // 年收入
      incomeList: [],
      // 职业
      professionList: [],
      // 省份列表
      provinceList: [],
      // 市区列表
      cityList: [],
      isEditSingle: false, // 编辑单个条目的标签，用来区分通过整条条目来编辑，看是否要提交。
      dlgVisible: false,
      keshiOptions: [
        {
          label: '孕产科',
          value: 1,
        },
      ],
      housekeeperOptions: [],
      detailInfo: {
        name: '', // 姓名
        mobile: '', // 电话
        assignKeeperName: '', // 专属管家
        assignKeeper: '',
        idCard: '', // 身份证号
        birthDate: '', // 出生日期
        sex: '', // 性别
        wechatNo: '', // 微信号
        // hospitalCode: 0, // 所属机构
        // deptNum: '', //所属科室
        parity: '', // 胎次
        bornChildDate: '', // 生产日期
        province: '', // 省
        city: '', // 市
        address: '', // 居住详细地址
        profession: '', // 职业
        education: '', // 学历
        income: '', // 家庭年收入
        description: '', // 患者备注
        labelList: '', //标签
        expectedDate: '',
      },
      rules: {
        name: [
          { required: true, message: '患者姓名不能为空', trigger: 'blur' },
          { max: 10, message: '长度不超过10个字符', trigger: 'blur' },
        ],
        idCard: [
          // { required: true, message: '身份证号不能为空', trigger: 'blur' },
          { validator: this.validID, trigger: 'blur' },
        ],
        // regCard: [
        //   // { type: 'number', message: '就诊卡号必须为数字值' },
        //   { validator: validateCardLen, trigger: 'blur' }
        // ],
        mobile: [
          // { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
        ],
        labelList: [
          // {
          //   required: true,
          //   message: '请至少选择一个患者标签',
          //   trigger: 'change'
          // }
        ],
        expectedDate: [
          this.ValidateRules.DateRequired,
          // {
          //   validator: validateExpectedDate, trigger: 'blur'
          // }
        ],
      },
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 身份证验证
    validID(rule, value, callback) {
      if (!this.detailInfo.idCard) {
        callback()
      }
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      // const reg = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
      if (checkIDCard(value)) {
        this.identity(value.length)
        callback()
      } else {
        callback(new Error('身份证号码不正确'))
      }
    },
    //
    identity(val) {
      const iden = this.detailInfo?.idCard
      let sex = null
      let birth = null
      // const myDate = new Date()
      // const month = myDate.getMonth() + 1
      // const day = myDate.getDate()
      // let age
      if (val === 18) {
        // age = myDate.getFullYear() - iden.substring(6, 10) - 1
        sex = iden.substring(16, 17)
        birth =
          iden.substring(6, 10) +
          '-' +
          iden.substring(10, 12) +
          '-' +
          iden.substring(12, 14)
        // if (iden.substring(10, 12) < month || iden.substring(10, 12) === month && iden.substring(12, 14) <= day) age++
      }
      if (val === 15) {
        // age = myDate.getFullYear() - iden.substring(6, 8) - 1901
        sex = iden.substring(13, 14)
        birth =
          '19' +
          iden.substring(6, 8) +
          '-' +
          iden.substring(8, 10) +
          '-' +
          iden.substring(10, 12)
        // if (iden.substring(8, 10) < month || iden.substring(8, 10) === month && iden.substring(10, 12) <= day) age++
      }

      if (sex % 2 === 0) {
        sex = 2
      } else {
        sex = 1
      }
      this.detailInfo.sex = sex
      this.detailInfo.birthDate = birth + ' ' + '23:00:00'
    },
    idChange(e) {},
    changeAssignKeeper(newVal, oldVal) {
      if (typeof newVal === 'undefined') {
        return
      } else {
        // 通过值查找管家名字，传给底层
        if (newVal === '') {
          this.detailInfo.assignKeeperName = ''
          return
        }
        this.housekeeperOptions.forEach((item) => {
          if (item.id === newVal) {
            this.detailInfo.assignKeeperName = item.label
          }
        })
      }
    },
    updateLabelList(labellist) {
      // 获取到标签列表
      this.dlgVisible = false
      this.detailInfo.labelList = []
      this.detailInfo.labelIds = []
      labellist.forEach((item) => {
        this.detailInfo.labelList.push(item)
        this.detailInfo.labelIds.push(item.id)
      })
    },
    closeDlg() {
      this.dlgVisible = false
    },
    viewItemLabel(item) {
      if (!item.labelList) {
        this.initLableData = []
      } else {
        // this.initLableData = deepClone(item.labelList)
        this.initLableData = this.$lodash.cloneDeep(item.labelList)
      }
      this.isEditSingle = true
      this.patientId = item.id
      this.dlgVisible = true
    },
    // 查询省份
    searchProvince() {
      getProvince().then((res) => {
        this.provinceList = res.data
      })
    },
    async initData() {
      // 查询学历
      await getSysDictionary({
        dicType: 'education',
      }).then((response) => {
        this.educationList = response.data
      })
      // 查询年收入
      await getSysDictionary({
        dicType: 'income',
      }).then((response) => {
        this.incomeList = response.data
      })
      // 查询职业
      await getSysDictionary({
        dicType: 'profession',
      }).then((response) => {
        this.professionList = response.data
      })
      // 查询省份
      this.searchProvince()
      this.dutyOptions = await this.dicDataMixins('duty') // 岗位
      let code = ''
      // 查找专属管家的id，再去根据id获取
      this.dutyOptions.forEach((item) => {
        if (item.label === '线上专属管家') {
          code = item.value
        }
      })
      queryAssigner({
        duty: code,
        pageNo: 1,
        pageSize: 1000,
      })
        .then(async (res) => {
          this.labelOptions = []
          const vm = this
          res.data.rows.map((item) => {
            if (item.status === 1) {
              vm.housekeeperOptions.push({
                label: item.displayName,
                id: item.id,
              })
            }
          })
          //vm.detailInfo = JSON.parse(localStorage.getItem('patient_info'))
          //由于无法获取患者标签，直接对象覆盖手机号和身份证号
          let _patientInfo = JSON.parse(localStorage.getItem('patient_info'))
          //console.log(_patientInfo)
          let _detailInfo = await this.getInfo()
          // console.log('患者信息1', _detailInfo)
          Object.assign(vm.detailInfo, _patientInfo, {
            mobile: _detailInfo.mobile,
            idCard: _detailInfo.idCard,
          })
          this.searchMore(_detailInfo)
          // if (vm.detailInfo?.regCard) {
          //   vm.detailInfo.regCard = Number(vm.detailInfo.regCard)
          // }
        })
        .catch((error) => {})
    },
    searchMore(val) {
      //  根据个人ID 查询扩展信息包含标签信息
      getNewPatientById(val.id).then((response) => {
        this.detailInfoMore = response.data
        this.shoudongLabelList = []
        this.zidongLabelList = []
        this.detailInfoMore.labelList.forEach((item, index) => {
          if (item.tagType === 0) {
            this.shoudongLabelList.push(item)
          }
          if (item.tagType === 1) {
            this.zidongLabelList.push(item)
          }
        })
        // 初始化
        Object.assign(this.detailInfo, this.detailInfoMore)
        if (this.detailInfo.city) {
          this.changePro(false)
        }
        if (this.detailInfo.province && !this.detailInfo.city) {
          this.changePro(true)
        }
        this.detailInfo.name = this.$decryptBase64(this.detailInfo.name)
        this.detailInfo.mobile = this.$decryptBase64(this.detailInfo.mobile)
        this.detailInfo.idCard = this.$decryptBase64(this.detailInfo.idCard)
      })
    },
    changePro(val) {
      if (val) {
        this.detailInfo.city = ''
      }
      getCity(this.detailInfo.province).then((res) => {
        this.cityList = res.data
      })
    },
    showLabelList(labelList) {
      if (labelList) {
        const length = labelList.length

        let retString = ''
        for (let i = 0; i < length && i < 3; i++) {
          retString +=
            "<span class='label-item'>" + labelList[i].labelName + '</span>'
        }
        if (length > 3) {
          retString +=
            "<span class='label-num'>" + '+' + (length - 3) + '</span>'
        }
        // retString += '<button class="pa-btn el-button--primary-text" type="primary" size="mini" @click="viewItemLabel(row)">编辑</button>'
        return retString
      } else {
        return ''
      }
    },
    linkManage() {
      this.$router.push({
        path: '/',
      })
    },
    submitForm() {
      this.$refs['ruleForm'].validateField('idCard')
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          return false
        }
      })
    },
    linkManaclickge() {
      if (this.editVisible) {
        this.$emit('closePatientEdit', false)
      } else {
        this.$router.push({
          path: '/index',
          query: {
            active: this.$route.query?.active,
          },
        })
      }
    },
    submitData() {
      // debugger
      patientUpdate(this.detailInfo)
        .then(async (res) => {
          this.$message({ message: '保存成功', type: 'success' })
          if (this.editVisible) {
            this.$emit('closePatientEdit', false)
            getNewPatientById(this.detailInfo.id).then((res) => {
              console.log('患者信息', res)
              const data = {
                ...res.data,
                name: this.$decryptBase64(res.data.name)
              }
              this.$store.commit('updateDefaultPatient', data)
            })
          } else {
            this.$router.push({
              path: '/index',
              query: {
                active: this.$route.query?.active,
              },
            })
          }
        })
        .catch((err) => {})
    },
    // 查询患者信息
    async getInfo() {
      let _patientInfo = JSON.parse(localStorage.getItem('patient_info'))
      const result = await this.$requestPost(
        `/cloud-baseinfo/patient/get?id=${_patientInfo?.id}`
      )
      if (result && result.code === 200) {
        return result?.data
      }
    },
  },
}
</script>

<style scoped>
.el-form-item {
  margin-bottom: 24px;
}
.label-list-cnt {
  display: inline-block;
}
.app-container {
  background-color: #fff;
}
.reset-form {
  width: 600px;
  margin: 0 auto;
  background-color: #fff;
}

.pa-ruleForm {
  display: flex;
  justify-content: center;
  height: calc(100% - 60px);
  overflow: auto;
}
.form-box {
  margin-right: 24px;
}
.form-item-tips {
  display: inline-block;
  color: #999;
  margin-bottom: 4px;
}
>>> .label-item {
  margin-right: 7px;
  height: 15px;
  background: #f2f7fc;
  border-radius: 2px;
  padding: 8px 6px;
  word-break: keep-all;
}

>>> .label-num {
  margin-right: 8px;
  height: 15px;
  background: #f2f7fc;
  border-radius: 2px;
  padding: 8px 6px;
  word-break: keep-all;
}
</style>

