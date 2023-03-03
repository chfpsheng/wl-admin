<template>
  <div class="version--box">
    <div class="left-part">
      <ly-tree
        class="ly-tree"
        :classify-type="classifyType"
        @updateNodeInfo="updateNodeInfo"
        @initData="initData"
      />
    </div>
    <div class="pa-right-part">
      <div class="filter-container filter-box">
        <div class="filter-wrapper">
          <filter-input
            class="keywork-input"
            :value.sync="listQuery.condition"
            placeholder="请输入标题"
            title="文本搜索"
          />
          <el-button
            v-waves
            class="pa-btn"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >
            查询
          </el-button>
          <el-button
            v-waves
            :disabled="labelTypeId ? false : true"
            class="pa-btn"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd()"
          >
            新增话术
          </el-button>
        </div>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        :height="tableHeight"
        class="pa-table"
      >
       <!-- :height="tableHeight" -->
        <el-table-column label="序号" type="index" width="80" />
        <el-table-column label="标题" min-width="170px" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.tittle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" width="340px">
          <template slot-scope="{ row }">
            <span v-if="replactContent(row).length<20">{{ replactContent(row) }}</span>
            <el-tooltip v-else class="item" effect="dark" :content="replactContent(row)" placement="top">
              <span>{{replactContent(row).substr(0,20)+'...'}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="排序" width="100px">
          <template slot-scope="{ row }">
            <span>{{ row.seq }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          min-width="170px"
          show-overflow-tooltip
        >
          <template slot-scope="{ row }">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>

        <el-table-column label="是否启用" min-width="100px">
          <template slot-scope="scope">
            <pa-switch
              :active-value="activeValue"
              :inactive-value="inactiveValue"
              :value.sync="scope.row.status"
              @click="updateStatus(scope.row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="操作" fixed="right" width="150px">
          <template slot-scope="{ row }">
            <el-button
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              @click="editItem(row)"
            >
              编辑
            </el-button>
            <el-button
              class="pa-btn el-button--primary-text"
              type="primary"
              size="mini"
              @click="deleteItem(row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pa-pagination
        :current-page="listQuery.pageNo"
        :page-size="listQuery.pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      />

      <pa-drawer
        :title="title"
        v-if="detailVisible"
        :visible.sync="detailVisible"
        @ok="submitForm"
        @cancel="cancleAdd"
      >
        <div class="drawer-content">
          <el-form
            label-position="top"
            ref="ruleForm"
            :model="ruleForm"
            :rules="rules"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="所属分类" prop="name">
              <el-input  class="pa-input" v-model="typeNode.name" disabled />
            </el-form-item>
            <el-form-item label="标题" prop="tittle">
              <el-input  class="pa-input" v-model="ruleForm.tittle" maxlength="10" />
            </el-form-item>
            <el-form-item label="排序" prop="seq">
              <el-input  class="pa-input" v-model="ruleForm.seq" maxlength="5" />
            </el-form-item>
            <el-form-item label="内容" prop="content" class="content-item">
              <div slot="label" class="content-title">
                <span class="title">内容</span>
                <span class="info">选择下方参数，则发送时会自动替换成对应用户信息</span>
              </div>
              <el-input
                ref="inputTextarea"
                id="useDescription"
                v-model="ruleForm.content"
                type="textarea"
                placeholder="请输入话术内容"
                maxlength="200"
                show-word-limit
                class="pa-input form-input"
                :autosize="{ minRows: 4, maxRows: 16 }"
                @blur="useDescriptionBlur"
              />
              <el-radio-group
                v-model="ruleForm.contentType"
                style="margin: 16px 0 "
                @change="contentTypeChange"
              >
                <el-radio-button
                  :label="1"
                  border
                  class="pa-radio-button"
                >患者姓名</el-radio-button>
                <el-radio-button
                  :label="2"
                  border
                  class="pa-radio-button"
                >孕周</el-radio-button>
                <el-radio-button
                  :label="3"
                  border
                  class="pa-radio-button"
                >预产期</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </pa-drawer>
    </div>
  </div>
</template>
<script>
import {
  labelQuery,
  labelInsert,
  labelStuUpdate,
  labelDelete,
  labelUpdate
} from '@/api/textTree'
import waves from '@/directive/waves' // waves directive
const { deepClone } = require('../../../utils')
import LyTree from '@/components/textTree/src/tree.vue'

export default {
  name: 'Version',
  components: {
    LyTree
  },
  directives: {
    waves
  },
  props: ['parentId'],
  data() {
    const regular = {
      num: /^[0-9]*$/ // 密码
    }
    var validateNum = (rule, value, callback) => {
      if (value && !regular.num.test(value)) {
        return callback(new Error('序号只能是数字'))
      } else {
        callback()
      }
    }
    return {
      classifyType: '1',
      activeName: 'version',
      title: '',
      typeNode: {},
      tableHeight: 500,
      activeValue: 1,
      inactiveValue: 0,
      labelTypeId: '', // 当前选中的label标签分类
      isAdd: true,
      ruleForm: {
        contentType: '',
        content: '',
        seq:1
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      detailVisible: false, // 是否显示详情弹框
      listQuery: {
        condition: '',
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        sortField: 'createTime' // 排序字段
        // asc: true // 是否升序
      },
      cursurPosition: 0,
      showReviewer: false,
      pvData: [],
      departmentOptions: [
        {
          label: '新生儿科',
          key: 0
        },
        {
          label: '儿科',
          key: 1
        },
        {
          label: '重症医学科',
          key: 2
        },
        {
          label: '产科',
          key: 3
        }
      ],
      positionOptions: [
        {
          label: '医生',
          key: 1
        },
        {
          label: '护士',
          key: 2
        }
      ],
      rules: {
        content: [
          {
            required: true,
            message: '请输入内容',
            trigger: 'blur'
          },
          {
            max: 200,
            message: '长度不能超过200个字符',
            trigger: 'blur'
          }
        ],
        seq: [
          {
            validator: validateNum,
            trigger: 'blur'
          }
        ],
        tittle: [
          {
            required: true,
            message: '请输入名称',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 10,
            message: '长度不能超过10个字符',
            trigger: 'blur'
          }
        ]
        // name: [{
        //   required: true,
        //   message: '请选择标签类型',
        //   trigger: 'blur'
        // }]
      },
      downloadLoading: false
    }
  },
  watch: {
    labelTypeId(val) {
      this.getList(false)
    }
  },
  created() {
    // this.getList(false)

  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(324)
    })
  },
  methods: {
    handleClick() {

    },
    initData(data) {
      // 找到根节点数据


      this.typeNode = data.treeData[0];
      if(data.editorName&&data.editorName.length>0){
         this.labelTypeId = data.editorName[0].id
         this.typeNode = data.editorName[0]
      }else{
         this.labelTypeId = this.typeNode.id
      }
      this.getList();
    },

    updateNodeInfo(node) {
      this.typeNode = node
      this.labelTypeId = node?.id?node.id:-1
      this.ruleForm.labelTypeId = node?.id?node.id:-1
      // this.ruleForm.labelTypeName = node.name
    },
    // 分页器方法
    sizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    currentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    getlabelType() {
      // 通过id查找名字
      return ''
    },
    updateStatus(item) {

      const text = item.status === 1 ? '禁用' : '启用'
      this.$confirm(`是否${text}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        item.dataStatus = item.status === 1 ? 0 : 1
        labelStuUpdate(item).then(response => {
          // 重新请求表格数据
          this.getList(false)
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
        })
      })
    },
    editItem(item) {
      this.isAdd = false
      this.title = '编辑话术'
      this.ruleForm = deepClone(item)
      this.detailVisible = true
    },
    deleteItem(item) {
      this.$confirm(`是否确认删除【${item.tittle}】`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const data = {
            id: item.id
          }

          labelDelete(data).then(response => {
            // 重新请求表格数据
            // this.getList(false);
            this.getList()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
        })
        .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          //   });
        })
    },
    replace() {
      let content = this.ruleForm.content
      //content = content.replace(/\[|]/g, '')
      var newWorld = '[patientName]'
      content = content.replace(/\[患者姓名\]/g, newWorld)
      newWorld = '[gestation]'
      content = content.replace(/\[孕周\]/g, newWorld)
      newWorld = '[dueDate]'
      content = content.replace(/\[预产期\]/g, newWorld)
      const data = {
        ...this.ruleForm,
        content
      }
      return data
    },
    // 替换
    submitForm() {
      this.ruleForm.classifyType = '1'
      this.ruleForm.name = this.typeNode.name
      this.ruleForm.parentId = this.typeNode.id
      if (!this.ruleForm.parentId) {
        this.$message({
          type: 'error',
          message: '请先选择分类!'
        })
        return
      }
      if (this.isAdd) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const data = this.replace()
            labelInsert(data).then(response => {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              // 重新请求表格数据
              this.detailVisible = false
              // this.getList(false);
              this.getList()
            })
          } else {
            return false
          }
        })
      } else {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            const data = this.replace()
            labelUpdate(data).then(response => {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })

              this.detailVisible = false
              // 重新请求表格数据
              // this.getList(false);
              this.getList()
            })
          } else {
            return false
          }
        })
      }
    },
    useDescriptionBlur() {
      const txt = document.getElementById('useDescription')
      this.cursurPosition = 0
      this.cursurPosition = txt.selectionStart // 得到光标下标位置
    },
    contentTypeChange(val) {
      let sVal
      if (val === 1) {
        sVal = '[患者姓名]'
      } else if (val === 2) {
        sVal = '[孕周]'
      } else if (val === 3) {
        sVal = '[预产期]'
      }
      /* if (this.ruleForm.content) {
        this.ruleForm.content = this.insertStr(
          this.ruleForm.content,
          this.cursurPosition,
          sVal
        )
      } else {
        this.ruleForm.content = sVal
      } */
      // this.ruleForm.content = (this.ruleForm.content?this.ruleForm.content:"") + sVal;
      let _content = (this.ruleForm.content?this.ruleForm.content:"") + sVal;
      this.$set(this.ruleForm,'content',_content)
      this.$refs.inputTextarea.focus()
      //this.$forceUpdate()
    },
    insertStr(str, start, newStr) {
      return str.slice(0, start) + newStr + str.slice(start)
    },
    cancleAdd() {
      this.detailVisible = false
      this.$refs['ruleForm'].resetFields()
    },
    handleAdd() {
      this.isAdd = true
      this.title = '新增话术'
      this.ruleForm = {
        seq:1
      }
      this.ruleForm.labelTypeId = this.labelTypeId;
      this.detailVisible = true
    },
    // 根据value找出对于的label
    findLabelByValue(value, arr) {
      value = Number(value)
      let label = ''
      arr.forEach(element => {
        if (element.key === value) {
          label = element.label
        }
      })
      return label
    },
    replactContent(item) {
      item.content = item.content.replace(/\[patientName\]/g, '[患者姓名]').replace(/\[gestation\]/g, '[孕周]').replace(/\[dueDate\]/g, '[预产期]');
      return item.content
    },
    // 获取订单列表
    getList(search = true) {
      this.listLoading = true
      let data = {}
      if (search) {
        data = this.listQuery
        data.id = this.labelTypeId
        data.classifyType = '1'
        data.typeOfInter = 1
      } else {
        data = {
          id: this.labelTypeId,
          sortField: this.listQuery.sortField,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          classifyType: '1',
          typeOfInter: 1
        }
      }
      // typeofinter=1
      labelQuery(data)
        .then(response => {
          this.list = response.data.rows || []
          // 数据重置
          this.total = response.data.total
          this.listLoading = false
        })
        .catch(e => {

        })
    },
    handleFilter() {
      this.getList()
    },
    // 保留两位小数
    setDecimal(value) {
      if (!value) {
        return
      }
      return value.toFixed(2)
    }
  }
}
</script>
<style scoped lang="scss">
.version--box {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: auto;
}
.el-tabs__nav {
  padding-left: 24px;
}
.form-input.el-input,
.form-input.el-textarea {
  width: 229px;
}

.el-tabs__header {
  background-color: #fff;
  margin: 0;
  padding: 20px;
}

.app-container {
  background-color: #fff;
}

.left {
  width: 30%;
}

.right {
  width: 70%;
}

.pa-right-part {
  overflow: scroll;
  flex-grow: 1;
  margin-left: 12px;
  position: relative;
}

.left-part {
  min-width: 250px;
  overflow: scroll;
  height: 100% !important;
  border-right: 1px solid #ebebeb;
}
.left-part,.pa-right-part{
  padding-top: 15px;
}
.el-tabs__header {
  background-color: #fff;
}

.app-container {
  overflow: auto;
}

.el-radio-group {
  margin-top: 30px;
}

.el-tabs__header {
  padding-top: 24px;
}

.el-table ::v-deep .cell {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.drawer-box ::v-deep .el-form-item:nth-child(4) ::after {
  content: "*111111";
  color: #ff4949;
  margin-right: 4px;
}
::v-deep.left-part .ly-tree-container{
  height:100% !important;
}
::v-deep.pa-pagination{
  position: unset !important;
}
::v-deep.ly-tree{
  height: 100%;
  .el-card {
    height: 100%;
    overflow-y: scroll;
  }
}
::v-deep.content-item{
  .el-form-item__label{
    width: 100% !important;
    .content-title{
      .info{
        margin-left: 8px;
        font-size: 12px;
        // font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        color: #999999;
      }
    }
  }
}
.drawer-content{
  padding: 0 24px;
}
</style>
<style>
.el-tooltip__popper{
  white-space: break-spaces !important;
}
</style>
