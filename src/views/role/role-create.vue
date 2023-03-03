<template>
  <div class="app-container">
    <div class="handle-box">
      <i />
      <div>
        <!-- <el-button class="pa-btn" @click="getCheckedNodes">测试按钮</el-button> -->
        <el-button class="pa-btn" @click="linkRoleSetting">返回</el-button>
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
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="ruleForm.roleName"
            placeholder="请输入角色名称，20个字以内"
            clearable
            class="pa-input form-input"
          />
        </el-form-item>
        <el-form-item label="角色类型" prop="roleSystem">
          <pa-select
            :value.sync="ruleForm.roleSystem"
            :options="roleSystemOptions"
            class="form-long-select"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="mark">
          <el-input
            v-model="ruleForm.mark"
            type="textarea"
            maxlength="100"
            show-word-limit
            class="pa-input form-input"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </el-form-item>
        <el-form-item label="基本权限" prop="limit">
          <div class="tree-box">
            <el-tree
              ref="tree"
              class="pa-tree"
              :data="treeData"
              show-checkbox
              node-key="id"
              :default-checked-keys="defaultCheckedKeys"
              :default-expanded-keys="[1]"
              :props="defaultProps"
              @check-change="treeChange"
            />
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import { set } from 'js-cookie'
export default {
  name: 'RoleCreate',
  data() {
    return {
      ruleForm: {
        roleName: '',
        roleSystem: 0,
        mark: '',
        limit: ''
      },
      rules: {
        roleName: [this.ValidateRules.InputRoleRequired, this.ValidateRules.LengthTwenty],
        roleSystem: [this.ValidateRules.SelectRoleTypeRequired],
        limit: [this.ValidateRules.SelectLimitsRequired]
      },
      roleSystemOptions: [
        {
          value: 0,
          label: '非管理员'
        }
      ],
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'funcName'
      },
      defaultCheckedKeys: [],
      roleId: '',
      treeFrom: [],
      comfirmLoading: false
    }
  },
  created() {
  },
  mounted() {
    this.getTree()
    this.$route.query.roleId ? this.initData() : ''
  },
  methods: {
    initData() {
      this.getRoleData()
      this.getLimitData()
    },
    async getRoleData() {
      const params = {}
      const result = await this.$requestPost(
        `/cloud-user/sysRole/get?id=${this.$route.query.roleId}`,
        params
      )
      const ruleFormData = {
        roleName: result.data.roleName,
        roleSystem: result.data.roleSystem,
        mark: result.data.mark
      }
      this.ruleForm = { ...ruleFormData }
    },
    async getLimitData() {
      const params = {}
      const result = await this.$requestPost(
        `/cloud-user/sysRoleFunc/queryByRoleId?roleId=${this.$route.query.roleId}`,
        params
      )
      console.log('默认选项1', result)
      this.defaultCheckedKeys = result.data.map(item => {
        item = item.id
        return item
      })
      console.log('默认选项2', this.defaultCheckedKeys)
    },
    async getTree() {
      const params = {}
      const result = await this.$requestPost(
        `/cloud-user/sysFunctionInfo/queryBySystem?systemCode=${this.$systemCode}`,
        params
      )
      console.log('tree', result.data)
      const treeData = result.data.filter(item => item.status === 1)
      
      treeData.push({
        id: null,
        funcName: '全部',
        parentId: 0
      })
      this.treeData = this.getTreeData(treeData, 0)
    },
    getTreeData(tempData, parentId) {
      const treeData = []
      tempData.forEach((item) => {
        if (item.parentId === parentId) {
          treeData.push({
            ...item,
            children: this.getTreeData(tempData, item.id)
          })
        }
      })
      return treeData
    },
    submitForm() {
      this.ruleForm.limit = this.$refs.tree.getCheckedKeys().join(',')
      
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if(!this.comfirmLoading) {
            this.submitData()
          }
        } else {
          return false
        }
      })
    },
    async submitData() {
      let result
      if (this.$route.query.roleId) {
        this.roleId = this.$route.query.roleId
        result = await this.editItem()
        result && result.code === 200 ? this.addTree() : ''
      } else {
        result = await this.addRole()
        if (result && result.code === 200 && result.data) {
          this.roleId = result.data
          this.addTree()
        }
      }
    },
    async addRole() {
      this.comfirmLoading = true
      const params = {
        ...this.ruleForm,
        systemCode: this.$systemCode
      }
      const result = await this.$requestPost(
        '/cloud-user/sysRole/insert',
        params
      )
      result && result.code === 200
        ? this.$message({
          message: '保存成功',
          type: 'success'
        })
        : ''
      this.comfirmLoading = false
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    },
    async editItem() {
      this.comfirmLoading = true
      const params = {
        ...this.ruleForm,
        id: this.$route.query.roleId,
        systemCode: this.$systemCode
      }
      const result = await this.$requestPost(
        '/cloud-user/sysRole/update',
        params
      )
      result && result.code === 200
        ? this.$message({
          message: '保存成功',
          type: 'success'
        })
        : ''
      this.comfirmLoading = false
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    },
    async addTree() {
      this.comfirmLoading = true
      let arr = this.$refs.tree.getCheckedKeys()
      arr = arr.filter(item => item != null)
      this.treeFrom = arr.map(item => {
        item = {
          roleId: this.roleId,
          funId: item,
          systemCode: this.$systemCode
        }
        return item
      })
      const params = this.treeFrom
      const result = await this.$requestPost(
        '/cloud-user/sysRoleFunc/batchInsert',
        params
      )
      setTimeout(() => {
        this.comfirmLoading = false
      }, 2000)
      
      this.linkRoleSetting()
    },
    linkRoleSetting() {
      this.$router.push({
        path: '/roleSetting'
      })
    },
    treeChange() {
      console.log('树选择', this.$refs.tree.getCheckedKeys())
      // this.ruleForm.limit = this.$refs.tree.getCheckedKeys()
      // this.ruleForm.limit = this.ruleForm.limit.join(',')
      this.ruleForm = {
        ...this.ruleForm,
        limit: this.$refs.tree.getCheckedKeys().join(',')
      }
      
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid #e8e8e8;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.tree-box {
  width: 500px;
  /* height: 400px;
  overflow: auto; */
}
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
.handle-box{
  .el-button + .el-button{
    margin-left: 16px;
  }
}
</style>
