<template>
  <div class="from-wrapper">
    <el-form
      label-position="top"
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      class="pa-ruleForm"
    >
      <div class="form-box">
        <el-form-item label="服务规格名称" prop="specName">
          <el-input
            v-model="ruleForm.specName"
            placeholder="输入服务规格名称"
            clearable
            class="pa-input"
          />
        </el-form-item>
        <el-form-item label="所属科室" prop="departmentId">
          <pa-select
            :value.sync="ruleForm.departmentId"
            :options="deptOptions"
            class="pa-form-select"
          />
        </el-form-item>
        <div class="cs-multi-select">
          <el-form-item class="item-specifications-warp" prop="specValues">
            <template slot="label">
            <div class="item-specifications" style="width: 100%; margin-bottom: 8px">
              <span>规格：</span>
              <el-button
                type="primary"
                class="pa-btn"
                icon="el-icon-plus"
                @click="addClick"
              >
                添加
              </el-button>
              <span class="cs-tips">备注：最多添加10个</span>
            </div>
            </template>
            <el-table class="pa-table" :data="ruleForm.specValues">
              <el-table-column label="序号" type="index" width="60" />
              <el-table-column
                prop="name"
              >
                <template slot="header">
                  <div>
                    <span style="color: #f00">*</span>
                    名称
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="`specValues.${scope.$index}.name`" :rules="[ ValidateRules.InputSpecRequired, ValidateRules.LengthTen, { validator: validateName, trigger: 'blur' } ]" class="table-form-item">
                    <el-input v-model="scope.row.name" class="pa-input" @change="tableInputChange" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                prop="num"
              >
                <template slot="header">
                  <div>
                    <span style="color: #f00">*</span>
                    排序
                  </div>
                </template>
                <template slot-scope="scope">
                  <el-form-item :prop="`specValues.${scope.$index}.num`" :rules="[ ValidateRules.InputSortRequired, { validator: validateNum, trigger: 'blur' } ]" class="table-form-item">
                    <el-input-number v-model="scope.row.num" :min="1" size="medium" :controls="false" :step="1" step-strictly class="pa-input-number" @change="tableInputChange" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    class="pa-btn el-button--primary-text"
                    :disabled="ruleForm.specValues.length === 1"
                    @click="delClick(scope.$index)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <!-- <el-form-item label="规格" prop="specValues">
            <div class="cs-btn-box">
              <cs-button
                v-for="(item, index) in specsArr"
                :key="index"
                :title="item"
                @delItem="delSpecs(index)"
              />
            </div>
          </el-form-item>
          <div style="padding-left: 110px">
            <el-input
              v-model="specs"
              placeholder="请输入规格"
              clearable
              class="pa-input"
            />
            <div class="err-tips">
              <span v-show="specsErr">{{ specsErrText }}</span>
            </div>
            <el-button type="primary" class="pa-btn" @click="addSpecs">
              添加
            </el-button>
          </div> -->
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'SpecsCreate',
  props: {
    deptOptions: {
      type: Array,
      default: () => []
    },
    visible: Boolean,
    title: {
      type: String,
      default: '标题'
    }
  },
  data() {
    return {
      ruleForm: {
        specName: '',
        departmentId: 1,
        specValues: [
          {
            name: '',
            num: 1
          }
        ]
      },
      rules: {
        specName: [
          this.ValidateRules.InputSpecNameRequired,
          this.ValidateRules.LengthTen
        ],
        departmentId: [this.ValidateRules.SelectRequired],
        specValues: [this.ValidateRules.AddRequired]
      },
      specs: '',
      specsArr: [],
      specsErr: false,
      specsErrText: '',
      postUrl: '',
      tableHeight: 500
    }
  },
  watch: {
    visible: {
      handler(val) {
        if (val) {
          const data = this.$session.get('specsData')
          this.initData(data)
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(380)
    })
  },
  methods: {
    tableInputChange() {
      this.$refs.ruleForm.validate()
    },
    validateName(rule, value, callback) {
      if (value) {
        const myreg = this.ruleForm.specValues.filter(item => item.name === value)
        myreg && myreg.length > 1 ? callback(new Error('规格已存在')) : callback()
      }
    },
    validateNum(rule, value, callback) {
      if (value) {
        const myreg = this.ruleForm.specValues.filter(item => item.num === value)
        myreg && myreg.length > 1 ? callback(new Error('排序已存在')) : callback()
      }
    },
    initData(data) {
      if (data) {
        this.ruleForm = {
          id: data.id,
          specName: data.specName,
          departmentId: data.departmentId,
          specValues: data.specValues
        }
        // 非数组才可切割
        if (typeof data.specValues !== 'object') {
          this.specsArr = data.specValues.split(',')
        }
        this.postUrl = '/cloud-hmall/serviceSpec/update'
      } else {
        this.ruleForm = {
          specName: '',
          departmentId: 1,
          specValues: [
            {
              name: '',
              num: 1
            }
          ]
        }
        this.postUrl = '/cloud-hmall/serviceSpec/insert'
      }
    },
    addSpecs() {
      if (this.specs) {
        const isRepeat = this.specsArr.filter((item) => item === this.specs)
        if (isRepeat.length > 0) {
          this.specsErrText = '添加的值有重复'
          this.specsErr = true
          setTimeout(() => {
            this.specsErr = false
          }, 2000)
        } else if (this.specs.length > 10) {
          this.specsErrText = '最多输入10个字符'
          this.specsErr = true
          setTimeout(() => {
            this.specsErr = false
          }, 2000)
        } else {
          this.specsArr.push(this.specs)
        }
      } else {
        this.specsErrText = '请输入规格'
        this.specsErr = true
        setTimeout(() => {
          this.specsErr = false
        }, 2000)
      }
      this.ruleForm.specValues = this.specsArr.join(',')
      this.checkForm()
    },
    delSpecs(index) {
      this.specsArr.splice(index, 1)
      this.ruleForm.specValues = this.specsArr.join(',')
      this.checkForm()
    },
    checkForm() {
      this.$refs.ruleForm.validateField('specValues', err => {
        if (!err) {
          return true
        } else {
          return false
        }
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.addData()
        } else {
          this.$emit('submitFinish', false, true)
          return false
        }
      })
      this.$emit('confirmStatus', false)
    },
    async addData() {
      this.$emit('confirmStatus', true)
      const params = {
        ...this.ruleForm,
        specValues: JSON.stringify(this.ruleForm.specValues)
      }
      const result = await this.$requestPost(
        this.postUrl,
        params
      )
      if (result && result.code === 200) {
        this.$message({
          message: `${this.title === '新增服务规格' ? '新增' : '编辑'}成功`,
          type: 'success'
        })
        this.$emit('submitFinish', false, false)
      } else {
        this.$emit('submitFinish', false, true)
      }
    },
    delClick(index) {
      this.ruleForm.specValues.splice(index, 1)
    },
    addClick() {
      this.ruleForm.specValues.length < 10
        ? this.ruleForm.specValues.push({
          name: '',
          num: 1
        })
        : this.$message({ message: '最多只能添加10条', type: 'warning' })
    }
  }
}
</script>
<style lang="scss" scoped>
.from-wrapper {
  width: 100%;
  padding: 0 24px 80px 24px;
}
.err-tips {
  height: 20px;
  line-height: 20px;
  color: #f56c6c;
  font-size: 12px;
}
.pa-table .el-form-item {
  margin-bottom: 24px;
}
.cs-tips{
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}
::v-deep .cs-multi-select{
  .item-specifications-warp{
    .el-form-item__label{
      &::before{
        top:8px !important;
      }
    }
  }
}
::v-deep .pa-table{
   overflow: visible;
   .el-table__body-wrapper.is-scrolling-none{
     overflow: visible;
   }
  &.el-table{
    th{
      height: 40px;
    }
    td{
      height: 48px;
      .cell{
        overflow: visible;
      }
    }
  }
  .el-form-item{
    margin-bottom: 0px;
    margin-top: 0px;
  }
}
</style>
