<template>
  <div class="reset-container">
    <div class="handle-box">
      <i />
      <div>
        <el-button class="pa-btn" @click="onCancel">返回</el-button>
        <el-button type="primary" class="pa-btn" @click="onSave">
          保存
        </el-button>
      </div>
    </div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      class="reset-form"
    >
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" disabled placeholder="请输入手机号" />
      </el-form-item>
      <!-- <el-form-item label="角色">
        <el-input v-model="roles" disabled />
      </el-form-item> -->
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input v-model="form.oldPassword" type="password" placeholder="请输入旧密码" />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model="form.newPassword" type="password" placeholder="8-16个字，包含数字、字母、特殊字符，区分大小写" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="repeat">
        <el-input v-model="form.repeat" type="password" placeholder="请再次输入密码" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePassWord, getUser } from '@/api/user'
export default {
  data() {
    const regular = {
      password: /^([a-zA-Z0-9]){8,16}$/ // 密码
    }
    var validatePass = (rule, value, callback) => {
      if (value && !regular.password.test(value)) {
        return callback(new Error('密码格式输入有误'))
      } else {
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      // if (value && !regular.password.test(value)) {
      //   return callback(new Error('密码格式输入有误'))
      // } else 
      if (value !== this.form.newPassword) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      roles: '', // 角色
      form: {},
      rules: {
        oldPassword: [
          { required: true, message: '旧密码不能为空', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          {
            pattern: /[a-z]/g,
            message: '必须包含小写字母',
            trigger: "blur",
          }, {
            pattern: /[A-Z]/g,
            message: '必须包含大写字母',
            trigger: "blur",
          }, {
            pattern: /[0-9]/g,
            message: '必须包含数字',
            trigger: "blur",
          },
          {
            pattern: /[\W_!@#$%^&*`~()-+=]/g,
            message: '必须包含特殊字符',
            trigger: "blur",
          },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
          //{ validator: validatePass, trigger: 'blur' },
        ],
        repeat: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          {
            pattern: /[a-z]/g,
            message: '必须包含小写字母',
            trigger: "blur",
          }, {
            pattern: /[A-Z]/g,
            message: '必须包含大写字母',
            trigger: "blur",
          }, {
            pattern: /[0-9]/g,
            message: '必须包含数字',
            trigger: "blur",
          },
          {
            pattern: /[\W_!@#$%^&*`~()-+=]/g,
            message: '必须包含特殊字符',
            trigger: "blur",
          },
          { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      const user = JSON.parse(localStorage.getItem('userData') || '{}')
      // 当前用户信息
      getUser([user.userId]).then(res => {
        const list = []
        for (const item of res.data || []) {
          list.push(item.roleName)
        }
        // 提取角色名称
        this.roles = list.join(',')
      })
      const form = {
        name: user.name,
        phone: user.phone,
        roleName: user.roleName,
        userId: user.userId
      }
      this.form = form
    },
    onCancel() {
      this.$router.go(-1)
    },
    onSave() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.form.oldPassword = this.$md5(this.form.oldPassword)
          this.form.newPassword = this.$md5(this.form.newPassword)
          this.form.repeat = this.$md5(this.form.newPassword)
          changePassWord(this.form).then(res => {
            if (res && res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              setTimeout(() => {
                this.$router.push('/login')
              }, 1000)
            }
          })
        } else {
          return false
        }
      })
    },

    onBack() {
      this.$router.push('/')
    }
  }
}
</script>
<style lang="scss" scoped>
.reset-container{
  background: #fff;
  height: 100%;
}
.reset-form {
  width: 600px;
  margin: 0 auto;
  padding-top: 70px;
}
.btn-box{
  padding-top: 18px;
  button{
    width: 110px;
    height: 40px;
    margin-left: 118px;
  }
}
</style>
