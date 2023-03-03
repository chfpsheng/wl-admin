<template>
  <div style="display: flex;overflow:auto;height: 100%;">
    <div class="left-part">
      <ly-tree :classify-type="classifyType" @updateNodeInfo="updateNodeInfo" @initData="initData" />
    </div>
    <div class="pa-right-part">
      <div class="filter-container filter-box">
        <div class="filter-wrapper">
          <filter-input class="keywork-input" :value.sync="listQuery.condition" placeholder="请输入标题" title="链接搜索" />

          <el-button v-waves class="pa-btn" type="primary" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button
            v-waves
            :disabled="labelTypeId ? false : true"
            class="pa-btn"
            type="primary"
            icon="el-icon-plus"
            @click="handleAdd"
          >
            新增链接
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
        <el-table-column label="图片" min-width="170px">
          <template slot-scope="{ row }">
            <div style="display: flex;align-items: center;padding: 5px 0;">
              <el-image v-if="row.url" style="width: 50px; height: 50px" :src="row.url" fit="fill" />
              <img v-else src="@/assets/image/speechArtLinkDefault.png" alt="" style="width: 50px; height: 50px">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="标题" min-width="170px" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.tittle }}</span>
          </template>
        </el-table-column>
        <el-table-column label="链接地址" width="200px" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.content }}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" min-width="170px" show-overflow-tooltip>
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
            <el-button class="pa-btn el-button--primary-text" type="primary" size="mini" @click="editItem(row)">
              编辑
            </el-button>
            <el-button class="pa-btn el-button--primary-text" type="primary" size="mini" @click="deleteItem(row)">
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

      <pa-drawer :title="title" :visible.sync="detailVisible" @ok="submitForm" @cancel="cancleAdd">
        <div class="drawer-content">
          <el-form ref="ruleForm" label-position="top" :model="ruleForm" :rules="rules" class="demo-ruleForm">
            <el-form-item label="所属分类" prop="name">
              <el-input  class="pa-input" v-model="typeNode.name" disabled />
            </el-form-item>
            <el-form-item label="标题" prop="tittle">
              <el-input  class="pa-input" v-model="ruleForm.tittle" maxlength="10" />
            </el-form-item>
            <el-form-item label="首图" prop="url">
              <upload-img :limit="1" :img-list="coverImgList" @fileChange="coverImgChange" />
              <span class="form-item-tips">图片支持png、jpg、jpeg格式，大小不超过1M</span>
              <!-- <upload-img :img-url="ruleForm.content" @imgChange="handleImgChang" /> -->
            </el-form-item>
            <el-form-item label="链接地址" prop="content">
              <el-input  class="pa-input" v-model="ruleForm.content" maxlength="200" />
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
  labelUpdate,
  labelStuUpdate,
  labelDelete
} from '@/api/textTree'
import waves from '@/directive/waves' // waves directive
// import {
//   parseTime
// } from '@/utils'
// import {
//   getToken
// } from '@/utils/auth'
const {
  deepClone
} = require('../../../utils')
import LyTree from '@/components/textTree/src/tree.vue'

export default {
  name: 'Links',
  components: {
    LyTree
  },
  directives: {
    waves
  },
  data() {
    const isTrueUrl = (rule, value, callback) => {
      const reg = /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的链接'))
      } else {
        callback()
      }
    }
    return {
      classifyType: '3',
      activeName: 'version',
      title: '',
      typeNode: {
        name:''
      },
      coverImgList: [],
      tableHeight: 500,
      activeValue: 1,
      inactiveValue: 0,
      labelTypeId: '', // 当前选中的label标签分类
      isAdd: true,
      ruleForm: {
        status: 1,
        url: ''
      },
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      detailVisible: false, // 是否显示详情弹框
      listQuery: {
        pageNo: 1,
        pageSize: 10,
        type: undefined,
        sortField: 'createTime' // 排序字段
      },
      showReviewer: false,
      pvData: [],
      departmentOptions: [{
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
      positionOptions: [{
        label: '医生',
        key: 1
      },
      {
        label: '护士',
        key: 2
      }
      ],
      rules: {
        // url: [
        //   this.ValidateRules.ImgRequired
        // ],
        //
        content: [{
          required: true,
          message: '请输入链接地址',
          trigger: 'blur'
        },
        {
          validator: isTrueUrl,
          trigger: 'blur'
        }
        ],
        tittle: [{
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
        ],
        labelTypeId: [{
          required: true,
          message: '请选择标签类型',
          trigger: 'change'
        }]
      },
      downloadLoading: false
    }
  },
  watch: {
    labelTypeId(val) {
      this.getList(false)
    }
  },
  created() {},
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = this.$computeHeight(324)
    })
  },
  methods: {
    coverImgChange(data) {
      this.ruleForm.url = data.join(',')
      this.ruleForm = this.$lodash.cloneDeep(this.ruleForm)
      // setTimeout(() => {
      //   this.validateCoverImg()
      // }, 10)
    },

    handleClick() {},
    initData(data) {
      // 找到根节点数据
      this.typeNode = data.treeData[0]
      //this.labelTypeId = this.typeNode?.id
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
        labelStuUpdate(item).then((response) => {
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
      // this.ruleForm.coverImgList = []
      // this.ruleForm = {}
      this.isAdd = false
      this.title = '编辑链接'
      this.ruleForm = deepClone(item)
      this.coverImgList = item.url?[{
        url: item.url
      }]:[]
      setTimeout(() => {
        this.detailVisible = true
      }, 100)
    },
    deleteItem(item) {
      this.$confirm('是否确定删除链接话术', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: item.id
        }

        labelDelete(data).then((response) => {
          // 重新请求表格数据
          // this.getList(false)
          this.getList()
          if (response.data) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败!'
            })
          }
        })
      })
        .catch(() => {
          //   this.$message({
          //     type: 'info',
          //     message: '已取消删除'
          //   });
        })
    },
    submitForm() {
      this.ruleForm.classifyType = '3'
      this.ruleForm.name = this.typeNode.name
      this.ruleForm.parentId = this.typeNode.id
      if (this.isAdd) {
        // this.ruleForm.url = this.ruleForm.url
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            labelInsert(this.ruleForm).then((response) => {
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: '新增成功!'
                })
              }
              // 重新请求表格数据
              this.detailVisible = false
              this.coverImgList = []
              this.ruleForm = {}
              // this.getList(false)
              this.getList()
            })
          } else {
            return false
          }
        })
      } else {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            labelUpdate(this.ruleForm).then((response) => {
              if (response.code === 200) {
                this.$message({
                  type: 'success',
                  message: '编辑成功!'
                })
              }
              this.coverImgList = []
              this.ruleForm = {}
              this.detailVisible = false
              // this.getList(false)
              this.getList()
            })
          } else {
            return false
          }
        })
      }
    },
    cancleAdd() {
      this.detailVisible = false
      this.coverImgList = []
      this.$refs['ruleForm'].resetFields()
    },
    handleAdd() {
      setTimeout(() => {
        this.detailVisible = true
      }, 10)
      this.title = '新增链接'
      this.ruleForm = {}
      this.coverImgList = []
      this.isAdd = true
      this.ruleForm.labelTypeId = this.labelTypeId
    },
    // 根据value找出对于的label
    findLabelByValue(value, arr) {
      value = Number(value)
      let label = ''
      arr.forEach((element) => {
        if (element.key === value) {
          label = element.label
        }
      })
      return label
    },

    // 获取订单列表
    getList(search = true) {
      this.listLoading = true
      let data = {}
      if (search) {
        // 带查询条件
        data = this.listQuery
        data.classifyType = '3'
        data.id = this.labelTypeId
        data.typeOfInter = 1
      } else {
        // 查询表格数据不带查询条件
        data = {
          id: this.labelTypeId,
          sortField: this.listQuery.sortField,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          classifyType: '3',
          typeOfInter: 1
        }
      }
      labelQuery(data)
        .then((response) => {
          this.list = response.data.rows.filter(item => item.content) || []
          // 数据重置
          this.total = response.data.total
          this.listLoading = false
          // this.coverImgList = ''
        })
        .catch((e) => {

        })
    },

    // 搜索
    handleFilter() {
      this.getList()
    }
  }
}

</script>
<style scoped lang="scss">
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
    flex-grow: 1;
    margin-left: 12px;
    position: relative;
    overflow: scroll;
  }

  .left-part {
    min-width: 250px;
    overflow: auto;
  }

  .el-tabs__header {
    background-color: #fff;
  }

  .app-container {
    overflow: auto;
  }

  .el-tabs__header {
    padding-top: 24px;
  }

  .el-table ::v-deep .cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .form-item-tips {
    font-size: 12px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #999999;
    line-height: 17px;
    margin-top: 8px;
  }
::v-deep.left-part {
  border-right: 1px solid #ebebeb;
  .el-card{
    height: 100%;
    overflow-y: scroll;
  }
  .ly-tree-container{
    height:100% !important;
  }
}
::v-deep.pa-pagination{
  position: unset !important;
}
.drawer-content{
  padding: 0 24px;
}
::v-deep.pa-pagination{
  position: unset !important;
}
.left-part,.pa-right-part{
  padding-top: 15px;
}
</style>
