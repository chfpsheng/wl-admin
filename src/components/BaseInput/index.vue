<template>
  <div class="box-scrol">
    <el-container style="height: 100%">
      <el-main style="padding: 0 0 24px 0">
        <div
          class="title flex flex-between header box-mr"
          style="width: 100%; padding-left: 24px; overflow-x: hidden"
        >
          <div><span class="bgTitle">基本信息</span></div>
        </div>
        <div class="base-main">
          <el-form
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            :label-position="'top'"
          >
            <el-form-item label="患者姓名" prop="name">
              <el-input
                placeholder="请输入患者姓名"
                class="pa-input"
                v-model="ruleForm.name"
              />
            </el-form-item>
            <el-form-item label="联系电话" prop="mobile">
              <el-input
                v-model="ruleForm.mobile"
                class="pa-input"
                placeholder="请输入用户联系电话"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="预产期"
              prop="expectedDate"
              style="width: 100%"
            >
              <el-date-picker
                v-model="ruleForm.expectedDate"
                type="date"
                class="pa-input"
                value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="请选择日期"
                :picker-options="pickerOptions"
              />
            </el-form-item>
            <el-form-item label="专属管家" style="width: 100%">
              <el-select
                v-model="ruleForm.assignKeeper"
                placeholder="请选择"
                class="pa-input"
                style="width: 100%"
                @change="changeAssignKeeper"
                :clearable="true"
              >
                <el-option
                  v-for="(item, index) in housekeeperOptions"
                  :key="index"
                  :label="item.label"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
              <el-input
                class="pa-input"
                v-model="ruleForm.idCard"
                @change="changeIdCard()"
              />
            </el-form-item>
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="ruleForm.birthDate"
                type="date"
                class="pa-input"
                value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择日期"
                :picker-options="{
                  disabledDate: (time) => {
                    return time.getTime() > Date.now()
                  },
                }"
              />
            </el-form-item>
            <el-form-item label="性别" class="flex">
              <el-radio-group v-model="ruleForm.sex" style="margin-left: 16px">
                <el-radio v-model="ruleForm.sex" :label="1">男</el-radio>
                <el-radio v-model="ruleForm.sex" :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="微信号" prop="wechatNo">
              <el-input
                class="pa-input"
                v-model="ruleForm.wechatNo"
                placeholder="请输入用户微信号"
              ></el-input>
            </el-form-item>
            <!-- TODO: 暂时不做 -->
            <!-- <el-form-item label="所属机构" style="width: 100%">
              <el-select
                class="pa-input"
                v-model="ruleForm.hospitalCode"
                placeholder="请选择机构"
                style="width: 100%"
                :clearable="true"
              >
                <el-option
                  v-for="(item, index) in hospitalList"
                  :key="index"
                  :label="item.itemName"
                  :value="item.itemCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="所属科室">
              <el-select
                v-model="ruleForm.deptNum"
                placeholder="请选择"
                class="pa-input"
                style="width: 100%"
                :clearable="true"
              >
                <el-option
                  v-for="(item, index) in deptOptions"
                  :key="index"
                  class="pa-input"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item label="胎次">
              <el-select
                v-model="ruleForm.parity"
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
            <el-form-item label="生产日期">
              <el-date-picker
                class="pa-input"
                v-model="ruleForm.bornChildDate"
                type="date"
                value-format="yyyy-MM-dd hh:mm:ss"
                placeholder="选择日期"
                :clearable="true"
              />
            </el-form-item>
            <el-form-item label="患者标签" prop="labelList">
              <div class="flex">
                <div
                  class="label-list-cnt"
                  v-html="showLabelList(ruleForm.labelList)"
                />
                <i
                  class="
                    iconfont
                    icon-xiugaiiconbeifen1 icon-error
                    iconsize
                    bianji
                  "
                  @click="viewItemLabel(ruleForm)"
                />
              </div>
            </el-form-item>
            <div class="title flex flex-between header box-mr">
              <div><span class="bgTitle">更多信息</span></div>
            </div>
            <el-form-item label="居住地址">
              <div class="flex">
                <el-select
                  v-model="ruleForm.province"
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
                  v-model="ruleForm.city"
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
                v-model="ruleForm.address"
                maxlength="50"
              ></el-input>
            </el-form-item>
            <el-form-item label="职业">
              <el-select
                v-model="ruleForm.profession"
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
                v-model="ruleForm.education"
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
                v-model="ruleForm.income"
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
            <el-form-item label="患者备注" class="pa-input tat">
              <el-input
                v-model="ruleForm.description"
                type="textarea"
                placeholder="输入患者备注"
                maxlength="200"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 16 }"
              />
            </el-form-item>
          </el-form>
        </div>
        <label-select
          v-if="dlgVisible"
          :dlg-visible="dlgVisible"
          :init-data="initLableData"
          @closeDlg="closeDlg"
          @updateLabelList="updateLabelList"
        />
      </el-main>
      <el-footer
        style="padding: 12px 24px; border-top: 1px solid #ebebeb; height: 80px"
      >
        <div
          class="title flex header box-mr fix-footer"
          style="width: 100%; justify-content: flex-end"
        >
          <el-button @click="cancel()" class="pa-btn">取消</el-button>
          <el-button
            type="primary"
            size="small"
            class="font-b pa-btn"
            @click="submitForm()"
            >保存</el-button
          >
        </div>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  getNewPatientById,
  getSysDictionary,
  queryAssigner,
  getProvince,
  getCity,
  getDept,
  patientUpdate,
} from '@/api/patient'
import baseDataMixin from '@/mixins/baseData'
import LabelSelect from '@/components/LabelSelect'
import { checkIDCard } from '@/utils/validate'
const validatePhone = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error('请输入正确的手机号'))
    } else {
      callback()
    }
  }
}
export default {
  name: 'LabelSelectT',
  components: {
    LabelSelect,
  },
  mixins: [baseDataMixin],
  props: {
    detailInfo: {
      type: Object,
      default: false,
    },
  },
  data() {
    return {
      patientId: '',
      pickerOptions: {
        // 预产期
        disabledDate: (time) => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate() + 280))
          return time > nowData
        },
      },
      ruleForm: {
        name: '', // 姓名
        // mobile: '', // 电话
        assignKeeperName: '', // 专属管家
        // idCard: '', // 身份证号
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
        labelIds: '',
      },
      dutyOptions: [],
      // 省份列表
      provinceList: [],
      // 市区列表
      cityList: [],
      // 管家
      housekeeperOptions: [],
      initLableData: [],
      dlgVisible: false,
      // 学历
      educationList: [],
      // 年收入
      incomeList: [],
      // 职业
      professionList: [],
      // 科室
      deptOptions: [],
      // 机构
      hospitalList: [],
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
      rules: {
        name: [
          { required: true, message: '患者姓名不能为空', trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
        ],
        wechatNo: [{ validator: this.validateWechatNo, trigger: 'blur' }],
        expectedDate: [
          { required: true, message: '请选择日期', trigger: 'blur' },
        ],
        idCard: [{ validator: this.validID, trigger: 'blur' }],
        labelList: [
          {
            required: true,
            message: '请至少选择一个患者标签',
            trigger: 'change',
          },
        ],
        expectedDate: [this.ValidateRules.DateRequired],
      },
    }
  },
  created() {
  },
  methods: {
    // 微信号验证
    validateWechatNo(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (value !== '') {
        if (!/^\w{6,20}$/.test(value)) {
          callback(new Error('请输入正确的微信号'))
        } else {
          callback()
        }
      }
    },
    // 身份证验证
    validID(rule, value, callback) {
      if (!value) {
        callback()
      }
      if (!this.detailInfo.idCard) {
        callback()
      }
      if (checkIDCard(value)) {
        this.identity(value.length)
        callback()
      } else {
        callback(new Error('身份证号码不正确'))
      }
    },
    // 改变身份证号触发时间
    changeIdCard() {
      if (checkIDCard(this.ruleForm.idCard)) {
        if (this.ruleForm.idCard) {
          // 获得出生日期
          this.ruleForm.birthDate = this.getBirth(this.ruleForm.idCard)
        } else {
          // 或者性别
          this.ruleForm.sex = this.getSex(this.ruleForm.idCard)
        }
      }
    },
    // 根据身份证获得对应出生日期
    getBirth(idCard) {
      var birthday = ''
      if (idCard != null && idCard != '') {
        if (idCard.length == 15) {
          birthday = '19' + idCard.slice(6, 12)
        } else if (idCard.length == 18) {
          birthday = idCard.slice(6, 14)
        }
        birthday = birthday.replace(/(.{4})(.{2})/, '$1-$2-')
        //通过正则表达式来指定输出格式为:1990-01-01
      }
      return birthday
    },
    // 根据身份证获得性别
    getSex(idCard) {
      var sexStr = ''
      if (parseInt(idCard.slice(-2, -1)) % 2 == 1) {
        sexStr = 1
      } else {
        sexStr = 2
      }
      return sexStr
    },
    changePro(val) {
      if (val) {
        this.ruleForm.city = ''
      }
      getCity(this.ruleForm.province).then((res) => {
        this.cityList = res.data
      })
    },
    identity(val) {
      const iden = this.ruleForm.idCard
      let sex = null
      let birth = null
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
      this.ruleForm.sex = sex
      this.ruleForm.birthDate = birth + ' ' + '23:00:00'
    },
    // 初始化页面
    initData() {
      this.ruleForm = this.$lodash.cloneDeep(this.detailInfo)
      // 查询字典
      this.searchZIDIAN()
      // 查询管家
      this.searchHourse()
      // 查询省份
      this.searchProvince()
      if (this.ruleForm.city) {
        this.changePro(false)
      }
      if (this.ruleForm.province && !this.ruleForm.city) {
        this.changePro(true)
      }
    },
    // 查询标签
    searchPatientById() {
      //  根据个人ID 查询扩展信息包含标签信息
      getNewPatientById(this.patientId).then((response) => {
        this.ruleForm.labelList = response.data.labelList
      })
    },
    // 查询省份
    searchProvince() {
      getProvince().then((res) => {
        this.provinceList = res.data
      })
    },
    // 切换管家
    changeAssignKeeper(newVal, oldVal) {
      if (typeof newVal === 'undefined') {
        return
      } else {
        // 通过值查找管家名字，传给底层
        if (newVal === '') {
          this.ruleForm.assignKeeperName = ''
          return
        }
        this.housekeeperOptions.forEach((item) => {
          if (item.id === newVal) {
            this.ruleForm.assignKeeperName = item.label
          }
        })
      }
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
    // 查询管家
    async searchHourse() {
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
      }).then(async (res) => {
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
      })
    },
    async searchZIDIAN() {
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
      // 查询机构
      await getSysDictionary({
        dicType: 'hospital_code',
      }).then((response) => {
        this.hospitalList = response.data
      })
      // 查询科室
      await getDept({
      }).then((response) => {
        this.deptOptions = response.data
      })
    },
    // 点击编辑标签
    viewItemLabel(item) {
      if (!item.labelList) {
        this.initLableData = []
      } else {
        this.initLableData = this.$lodash.cloneDeep(item.labelList)
      }
      this.patientId = item.id
      this.dlgVisible = true
    },
    closeDlg() {
      this.dlgVisible = false
    },
    async updateLabelList(labellist) {
      // 获取到标签列表
      this.dlgVisible = false
      const params = {
        patientId: this.patientId,
        tagType: 1,
        tagIds: labellist.map((item) => {
          item = item.id
          return item
        }),
      }
      const result = await this.$requestPost(
        `/cloud-baseinfo/patientTag/save`,
        params
      )
      if (result && result.code === 200) {
        this.$message.success('患者标签编辑成功')
        this.ruleForm.labelList = []
        this.ruleForm.labelIds = []
        labellist.forEach((item) => {
          this.ruleForm.labelList.push(item)
          this.ruleForm.labelIds.push(item.id)
        })
        this.initData()
        // 查询标签
        this.searchPatientById()
      }
    },
    // 保存按钮
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.submitData()
        } else {
          return false
        }
      })
    },
    submitData() {
      patientUpdate(this.ruleForm)
        .then((res) => {
          this.$message({
            message: '保存成功',
            type: 'success',
          })
          this.$emit('isCancel', 'success')
        })
        .catch((err) => {})
    },
    // 取消按钮
    cancel() {
      this.$emit('isCancel')
    },
  },
  mounted() {
    this.initData()
    this.patientId = this.detailInfo.id
  },
}
</script>
<style scoped>
.base-main {
  margin: 0 24px;
}
.box-scrol {
  width: 100%;
  height: 100%;
}
.base-main >>> .el-form--label-top .el-form-item__label {
  padding: 0;
}
.box-scrol .el-form-item {
  margin-bottom: 16px;
}
.title {
  font-size: 16px;
  font-weight: bold;
  margin-right: 8px;
}
.flex {
  display: flex;
}
.flex-between {
  justify-content: space-between;
}
.box-scrol .header {
  line-height: 32px;
}
.box-mr {
  padding: 12px 0px;
}
.shoudong {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  background-color: gray;
  color: black;
  padding: 8px;
  font-size: 12px;
  max-width: 50%;
}
.zidong {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  background-color: yellow;
  color: black;
  padding: 8px;
  font-size: 12px;
  max-width: 50%;
}
.bianji {
  margin-left: 5px;
  cursor: pointer;
}
.label-list-cnt {
  display: inline-block;
}
.el-form-item {
  margin-bottom: 16px;
}
.el-main >>> .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
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
.bgTitle {
  font-size: 14px;
  font-weight: bold;
  padding-left: 8px;
  border-left: 3px solid #0066cc;
  display: inline-block;
  height: 14px;
  line-height: 14px;
}
.footer-box {
  height: 80px;
  /* background: rgba(255, 255, 255, 1); */
  border-top: 1px solid #ddd;
  position: fixed;
  bottom: 0;
}
.flex-end {
  display: flex;
  justify-content: flex-end;
}
.font-b {
  font-size: 14px;
  height: 32px;
}
.tat >>> .el-textarea__inner{
    font-family: Microsoft YaHei;
}
</style>
