<template>
  <div class="app-container">
    <div class="handle-box">
      <i />
      <div>
        <el-button class="pa-btn" @click="linkManage">返回</el-button>
        <el-button
          type="primary"
          class="pa-btn"
          @click="submitForm"
        >
          保存
        </el-button>
      </div>
    </div>
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
      class="pa-ruleForm"
      style="padding-top: 24px"
    >
      <div class="form-box">
        <el-form-item label="员工姓名" prop="userName">
          <el-input
            v-model="ruleForm.userName"
            placeholder="请输入员工姓名"
            clearable
            class="pa-input form-input"
          />
        </el-form-item>
        <el-form-item label="员工编号" prop="userCode">
          <el-input
            v-model="ruleForm.userCode"
            placeholder="请输入员工编号"
            clearable
            class="pa-input form-input"
          />
        </el-form-item>
        <el-form-item label="员工头像" prop="photo">
          <span class="form-item-tips">上传png、jpg、jpeg格式图片，1M以内大小，只能上传一张</span>
          <upload-img :limit="1" :img-list="photoList" @fileChange="photoChange" />
          <!-- <upload-img :img-url="ruleForm.photo" @imgChange="handleImgChang" /> -->
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="ruleForm.phone"
            placeholder="请输入手机号"
            clearable
            class="pa-input form-input"
          />
        </el-form-item>
        <el-form-item label="出生年月" prop="birth">
          <el-date-picker
            v-model="ruleForm.birth"
            type="date"
            placeholder="选择日期"
            class="pa-date-picker form-date-picker"
            value-format="yyyy-MM-dd"
            @change="datePickerChange"
          />
        </el-form-item>
        <el-form-item label="性别" prop="sex">
          <pa-select
            :value.sync="ruleForm.sex"
            :options="sexOptions"
            class="form-long-select"
            placeholder="选择员工性别"
          />
        </el-form-item>
        <el-form-item label="所属科室" prop="deptCode">
          <pa-select
            :value.sync="ruleForm.deptCode"
            :options="deptOptions"
            disabled
            class="form-long-select"
            placeholder="选择所属科室"
          />
        </el-form-item>
        <el-form-item label="所属岗位" prop="duty">
          <pa-select
            :value.sync="ruleForm.duty"
            :options="dutyOptions"
            class="form-long-select"
          />
        </el-form-item>
        <!-- <el-form-item label="所属角色" prop="tittle">
          <pa-select
            :value.sync="ruleForm.tittle"
            :options="tittleOptions"
            class="form-long-select"
          />
        </el-form-item> -->
        <el-form-item label="其他职级" prop="otherTittle">
          <el-input
            v-model="ruleForm.otherTittle"
            placeholder="输入其他职业/荣誉"
            clearable
            class="pa-input form-input"
          />
        </el-form-item>
        <el-form-item label="简介" prop="mark">
          <el-input
            v-model="ruleForm.mark"
            type="textarea"
            placeholder="输入服务内容描述"
            maxlength="200"
            show-word-limit
            class="pa-input form-input"
            :autosize="{ minRows: 4, maxRows: 16 }"
          />
        </el-form-item>
        <el-form-item>
          <div style="width: 100%; height: 24px; line-height: 24px" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import baseDataMixin from '@/mixins/baseData'
import {randomPassword,randomBetweenNumber} from '@/utils/tools'
export default {
  name: 'EmployeeCreate',
  mixins: [baseDataMixin],
  data() {
    return {
      ruleForm: {
        id: '',
        userName: '',
        displayName: '',
        userCode: '',
        photo: '',
        password: '',
        phone: '',
        birth: '',
        sex: '',
        deptCode: 1,
        duty: '',
        tittle: '',
        otherTittle: '',
        mark: '',
        imUserId: ''
      },
      rules: {
        userName: [this.ValidateRules.InputEmployeeRequired, this.ValidateRules.LengthTen],
        userCode: [this.ValidateRules.InputEmployeeCodeRequired, this.ValidateRules.LengthTwenty],
        phone: [
          this.ValidateRules.InputEmployeePhoneRequired,
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        birth: [this.ValidateRules.BirthDateRequired],
        sex: [this.ValidateRules.SelectSexRequired],
        deptCode: [this.ValidateRules.SelectRequired],
        duty: [this.ValidateRules.SelectDutyRequired],
        tittle: [this.ValidateRules.SelectRoleRequired],
        otherTittle: [this.ValidateRules.LengthThirty]
        // photo: [this.ValidateRules.AvatarImgRequired]
      },
      sexOptions: [],
      deptOptions: [],
      dutyOptions: [],
      tittleOptions: [],
      comfirmLoading: false,
      defaultTittleId: 1,
      noRole: true,
      photoList: []
    }
  },
  created() {},
  mounted() {
    this.$route.query.id ? this.initEdit() : ''
    this.initData()
  },
  methods: {
    async initData() {
      this.tittleOptions1 = await this.roleDataMixins() // 角色
      this.sexOptions = await this.dicDataMixins('sex') // 性别
      this.dutyOptions = await this.dicDataMixins('duty') // 岗位
      this.deptOptions = await this.deptDataMixins() // 科室
      this.tittleOptions = this.tittleOptions1.filter(item=>{
        console.log("this.tittleOptions1.filter", item)
        if(this.noRole){
          if(item.roleSystem === 1){
            this.defaultTittleId = item.value
          }
        }
        if(item.roleSystem === 0){
          return true
        }else{
          return false
        }
      })
      //找到默认的角色id，提交时使用默认的角色id
    },
    async initEdit() {
      //const item = this.$session.get('employeeItem')
      const item =  await this.getInfo()
      console.log(999, item)
      this.ruleForm = {
        ...item,
        displayName: item.userName,
        deptCode: parseInt(item.deptCode),
        tittle: parseInt(item.tittle),
        status: item.status ? 1 : 0
      }
      if (this.ruleForm.photo) {
        const photo = this.ruleForm.photo.split(',')
        this.photoList = photo.map(item => {
          item = {
            url: item
          }
          return item
        })
      } else {
        this.photoList = []
      }
      
    },
    validatePhone(rule, value, callback) {
      if (value) {
        const myreg = /^1[0-9]{10}$/
        !myreg.test(value)
          ? callback(new Error('请输入正确的手机号码'))
          : callback()
      }
    },
    datePickerChange(val) {
      
    },
    photoChange(data) {
      this.ruleForm.photo = data.join(',')
      // this.validatePhoto()
    },
    // validatePhoto() {
    //   this.$refs.ruleForm.validateField('photo', err => {
    //     if (!err) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   })
    // },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if(!this.comfirmLoading) {
            this.addData()
          }
        } else {
          return false
        }
      })
    },
    async addData() {
      this.comfirmLoading = true
      const postUrl = this.$route.query.id ? '/cloud-user/sysUser/update' : '/cloud-user/sysUser/insert'
      !this.$route.query.id ? delete this.ruleForm.id : ''
      let _between = randomBetweenNumber(8,16);
      let _randomPassWord = randomPassword(_between);
      //this.ruleForm.password = this.$route.query.id ? this.ruleForm.password : this.$md5('Service' + this.ruleForm.phone.substring(this.ruleForm.phone.length - 6))
      this.ruleForm.password = this.$route.query.id ? this.ruleForm.password : this.$md5(_randomPassWord)
      
      if(this.noRole){
        //暂时去掉角色和岗位设置，用默认的岗位和角色设置进去
        // this.ruleForm.duty = 4;
        this.ruleForm.tittle = this.defaultTittleId;
      }
      
      const params = {
        ...this.ruleForm,
        displayName: this.ruleForm.userName
      }
      const result = await this.$requestPost(
        postUrl,
        params
      )
      if (result && result.code === 200) {
        let userId = result.data ? result.data : ''
        userId = this.$route.query.id ? this.$route.query.id : userId
        userId ? this.handleBatch(userId) : this.comfirmLoading = false
        this.$route.query.id ?null:this.initPassWordInfo(_randomPassWord)
      } else {
        this.comfirmLoading = false
      }
    },
    // 新增员工完成后提示初始化密码
    initPassWordInfo(password){
      this.$confirm(`您的初始密码是 ${password}`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        showCancelButton:false,
        showClose:false,
        closeOnClickModal:false,
        type: 'warning'
      }).then(() => {}).catch(() => {});
     
    },
    async handleBatch(userId) {
      const params = [{
        userId,
        roleId: this.ruleForm.tittle,
        systemCode: this.$systemCode,
        status: 1
      }]
      const result = await this.$requestPost(
        '/cloud-user/sysUserRole/batchInsert',
        params
      )
      setTimeout(() => {
        this.comfirmLoading = false
      }, 2000)
      if (result && result.code === 200) {
        this.$message({ message: '保存成功', type: 'success' })
        this.linkManage()
      }
    },
    // 通过id查询员工信息
    async getInfo() {
      let url = `/cloud-user/sysUser/get`
      const result = await this.$requestPost(
        `${url}?id=${this.$route.query.id}`
      );
      if (result && result.code === 200) {
        return result?.data
      }
    },
    linkManage() {
      this.$router.push({
        path: '/employee/index'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pa-ruleForm {
  display: flex;
  justify-content: center;
  height: calc(100% - 48px);
  overflow: auto;
}
::v-deep.form-box {
  margin-right: 24px;
  .el-form-item__label{
    padding-right: 8px;
  }
}
.form-item-tips{
  display: inline-block;
  color: #999;
  margin-bottom: 4px;  
}
.handle-box{
  .el-button + .el-button{
    margin-left: 16px;
  }
}
</style>
