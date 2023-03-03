<template>
  <div style="display: flex;overflow:auto;height: inherit;">
    <div class="left-part">
      <ly-tree class="ly-tree" :classify-type="classifyType" @updateNodeInfo="updateNodeInfo" @initData="initData" />
    </div>
    <div class="pa-right-part" style="flex: 1;">
      <pictures @successCBK="successCBK" />
      <div v-if="list&&list.length" class="pic-bottom">
        <div
          v-for="(item,index) in list"
          :key="index"
          class="pic-item"
          @mouseleave="leave()"
          @mouseenter="enter(index)"
        >
          <el-image style="width: 118px; height: 118px" :src="item.content" fit="fit" :preview-src-list="srcList" />
          <div v-show="seen&&index==current" class="mask">
            <i class="iconfont icon-xiugaiiconbeifen1" @click="editItem(item,index)" />
            <i class="iconfont icon-shanchu" @click="deleteItem(item)" />
            <i class="el-icon-zoom-in" @click="readImg(item)" />
          </div>
          <div class="img-title">
            <div v-if="index===currentIndex" class="edit">
              <el-input v-model="item.tittle" />
              <i class="el-icon-check" @click="check(item)" />
              <i class="el-icon-close" @click="close()" />
            </div>
            <div v-else class="title">{{ item.tittle }}</div>
          </div>
        </div>
      </div>
      <div v-else class="el-table__empty-block" style="width:100%; height: 100%;">
        <span class="el-table__empty-text">暂无数据</span>
      </div>

    </div>

    <el-dialog :visible.sync="dialogVisible" :before-close="handleClose">
      <div class="block">
        <el-image style="width: 100%; height: 100%;" :src="imgItem.content" fit="fit" />
      </div>
    </el-dialog>
    <!--
    <div class="table-box" v-if="show">
      <div class="table-filter">
        <i />
        <el-button type="primary" class="pa-btn" @click="addItem">
          <i class="el-icon-plus" :disabled="labelTypeId ? false : true"/>
          上传图片
        </el-button>
      </div>
      <div v-if="list&&list.length"  class="demo-image" style="display: flex;">
        <div  @mouseleave="leave()" @mouseenter="enter(index)" class="block"
          v-for="(item,index) in list" :key="index">
          <div class="el-img">
            <el-image style="width: 118px; height: 118px" :src="item.content" fit="fit"></el-image>
            <div class="mask" v-show="seen&&index==current">
              <i class="iconfont icon-xiugaiiconbeifen1" @click="editItem(item)"></i>
              <i class="iconfont icon-shanchu" @click="deleteItem(item)"></i>
            </div>
          </div>
          <span class="demonstration">{{item.tittle}}</span>
        </div>
         ; -->
    <!-- </div>
      <div v-else class="el-table__empty-block" style="width: 940px; height: 100%;">
        <span class="el-table__empty-text">暂无数据</span>
      </div>
    </div> -->

    <!--
    <pa-drawer :title="title" :visible.sync="detailVisible" @ok="submitForm" @cancel="cancleAdd">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="所属分类" prop="name">
          <el-input v-model="typeNode.name" disabled />
        </el-form-item>
        <el-form-item label="图片名称" prop="tittle">
          <el-input v-model="ruleForm.tittle" maxlength="10" />
        </el-form-item>
        <el-form-item label="图片" prop="coverImgList">
          <span class="form-item-tips">上传png、jpg、jpeg格式图片，1M以内大小，只能上传一张</span>
          <upload-img :limit="1" :img-list="ruleForm.coverImgList" @fileChange="coverImgChange" />
        </el-form-item>
      </el-form>
    </pa-drawer> -->

  </div>
</template>
<script>
const {
  deepClone
} = require('../../../utils')
import LyTree from '@/components/textTree/src/tree.vue'
import pictures from './pictures.vue'
import {
  labelQuery,
  labelInsert,
  labelUpdate,
  labelDelete,
  imgInsert
} from '@/api/textTree'
export default {
  name: 'Photograph',
  components: {
    LyTree,
    pictures
  },
  data() {
    return {
      imgItem: {},
      currentIndex: -1,
      show: false,
      isAdd: false, // 是否是添加
      seen: false,
      current: 0,
      rules: {
        coverImgList: [
          this.ValidateRules.ImgRequired
        ],
        tittle: [{
          required: true,
          message: '请输入图片名称',
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
      ruleForm: {
        url: ''
      },
      classifyType: '2',
      title: '',
      typeNode: {

      },
      tableHeight: 0,
      activeValue: 1,
      inactiveValue: 0,
      labelTypeId: '', // 当前选中的label标签分类
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: false,
      detailVisible: false, // 是否显示详情弹框
      listQuery: {},
      srcList: [],
      dialogVisible: false
    }
  },
  computed: {
    listLen() {
      return this.list.length
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
      this.tableHeight = this.$computeHeight(178)
    })
  },
  methods: {
    check(item) {
      if (!item.tittle) {
        this.$message({
          type: 'error',
          message: '请填写名称!'
        })
      }else if(item.tittle.length>10){
        this.$message({
          type: 'error',
          message: '图片名称不超过10个字符'
        })
      }else {
        const data = {
          id: item.id,
          classifyType: '2',
          name: this.typeNode.name,
          parentId: this.typeNode.id,
          tittle: item.tittle
        }
        labelUpdate(data).then((response) => {
          if (response.code === 200) {
            this.$message({
              type: 'success',
              message: '编辑成功!'
            })
            this.currentIndex = -1
          }
          this.getList(false)
        })
      }
    },
    handleClose() {
      this.imgItem = {}
      this.dialogVisible = false
    },
    close() {
      this.currentIndex = -1
    },
    readImg(item) {
      this.dialogVisible = true
      this.imgItem = item
    },
    successCBK(e) {
      const data = []
      for (let i = 0; i < e.length; i++) {
        data.push({
          classifyType: '2',
          name: this.typeNode.name,
          parentId: this.typeNode.id,
          content: e[i].url,
          tittle: e[i].name
        })
      }
      if (data.length === 0) {
        return
      }
      imgInsert(data).then(res => {

        if (res.data!== 0) {
          const h = this.$createElement;
          /* this.$msgbox({
            title: '提示',
            message: h('div', {
              style: 'display: flex;align-items: center',
            }, [
              h('i', {
                style: 'font-size: 25px;margin-right: 5px;',
                attrs: {
                    class:'el-icon-info'
                },
               }, null),
               h('span', null, `已成功上传${res.data}张图片`),
            ]),
            showCancelButton:false,
            showConfirmButton:false
          }) */
          this.$message({
            type: 'success',
            message: `新增${res.data}张图片`
          })
        }
        if (res.data === 0) {
          this.$message({
            type: 'error',
            message: '图片已存在！'
          })
        }

        this.getList(false)
      })
    },
    editItem(item, index) {
      this.currentIndex = index

      // this.coverImgList = []
      this.isAdd = false
      this.title = '编辑链接'
      this.ruleForm = deepClone(item)
      this.ruleForm.coverImgList = [{
        url: this.ruleForm.content
      }]
      // this.detailVisible = true
    },
    deleteItem(item) {
      this.$confirm('是否确认删除图片话术', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const data = {
          id: item.id
        }
        labelDelete(data).then((response) => {
          // 重新请求表格数据
          this.getList(false)
          if (response.data) {
            this.$message({
              type: 'success',
              message: `删除成功`
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
    enter(index) {
      this.seen = true
      this.current = index
    },
    leave() {
      this.seen = false
      this.current = null
    },
    coverImgChange(data) {
      this.ruleForm.url = data.join(',')
      this.ruleForm.coverImgList = [{
        url: this.ruleForm.url
      }]
      this.validateCoverImg()
    },
    validateCoverImg() {
      this.$refs.ruleForm.validateField('coverImgList', err => {
        if (!err) {
          return true
        } else {
          return false
        }
      })
    },
    cancleAdd() {
      this.$refs['ruleForm'].resetFields()
      this.ruleForm.coverImgList = []
      this.detailVisible = false
    },
    getList() {
      this.listLoading = true
      const data = {
        condition: '',
        id: this.labelTypeId,
        classifyType: '2',
        pageNo: 1,
        pageSize: 500,
        typeOfInter: 1
      }
      labelQuery(data)
        .then((response) => {
          this.list = []
          this.list = response.data.rows.filter(item => item.content) || []

          this.total = response.data.total
          this.listLoading = false
        })
        .catch((e) => {

        })
    },
    submitForm() {
      if (this.isAdd) {
        const data = {
          classifyType: '2',
          name: this.typeNode.name,
          parentId: this.typeNode.id,
          content: this.ruleForm.url,
          tittle: this.ruleForm.tittle
        }

        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.detailVisible = false
            labelInsert(data).then((response) => {
              this.$message({
                type: 'success',
                message: '新增成功!'
              })
              this.detailVisible = false
              this.getList(false)
              this.ruleForm.url = ''
              this.ruleForm.coverImgList = []
            })
          } else {
            return false
          }
        })
      } else {
        this.ruleForm.classifyType = '2'
        this.ruleForm.name = this.typeNode.name
        this.ruleForm.parentId = this.typeNode.id
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.detailVisible = false
            labelUpdate(this.ruleForm).then((response) => {
              this.$message({
                type: 'success',
                message: '编辑成功!'
              })
              this.detailVisible = false
              this.ruleForm.url = ''
              this.ruleForm.coverImgList = []
              this.getList(false)
            })
          } else {
            return false
          }
        })
      }
    },
    addItem() {
      this.ruleForm = {}
      this.ruleForm.coverImgList = []
      this.isAdd = true
      this.title = '上传图片'
      this.detailVisible = true
    },
    updateNodeInfo(node) {

      this.typeNode = node
      this.labelTypeId = node?.id?node.id:-1
      this.ruleForm.labelTypeId = node?.id?node.id:-1
      this.ruleForm.labelTypeName = node.name
    },
    handleClick() {

    },
    initData(data) {

      // 找到根节点数据
      this.typeNode = data.treeData[0];
      if(data?.editorName[0]?.id){
        this.labelTypeId = data.editorName[0].id
        this.typeNode = data.editorName[0]
      }else{
        this.labelTypeId = this.typeNode?.id?this.typeNode.id:-1
      }
       this.getList();
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

  // .pa-right-part {
  //   flex-grow: 1;
  //   margin-left: 12px;
  //   position: relative;
  // }

  .left-part {
    width: 250px;
    overflow: auto;
    border-right: 1px solid #ebebeb;
  }

  .el-tabs__header {
    background-color: #fff;
  }

  .app-container {
    overflow: auto;
  }

  .demo-image {
    display: flex;
    flex-wrap: wrap;
    margin-top: 30px;
  }

  .block {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-left: 32px;
    margin-bottom: 32px;
  }

  .demonstration {
    margin-top: 8px;
  }

  .el-image {
    width: 100%;
    height: 100%;
  }

  .el-img {
    width: 118px;
    height: 118px;
    position: relative;
  }

  .mask {
    background-color: rgba(0, 0, 0, .5);
    position: absolute;
    width: 118px;
    height: 118px;
    left: 0;
    top: 0;
    z-index: 11;
    padding: 10px;
    transition: opacity 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .mask .iconfont {
    display: inline-block;
    font-size: 16px;
    color: #fff;
    margin-right: 10px;
    font-weight: 700;
  }

  ::v-deep .el-icon-zoom-in {
    display: inline-block;
    font-size: 16px;
    color: #fff;
    margin-right: 10px;
    font-weight: 700;
  }

  .mask .iconfont:hover {
    opacity: 1;
  }

  .el-tabs__header {
    padding-top: 24px;
  }

  .pic-bottom {
    display: flex;
    flex-wrap: wrap;
    margin-top: 16px;
    padding-left: 30px;
  }

  .pic-item {
    width: 118px;
    height: 170px;
    margin-right: 20px;
    position: relative;
  }

  .img-title {
    width: 118px;
    margin-top: 10px;
    text-align: left;
  }

  .img-title .title {
    width: 118px;
    margin-top: 10px;
    text-align: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .img-title .edit {
    display: flex;
    align-items: center;
  }

  ::v-deep .el-input__inner {
    padding: 5px;
    width: 80px;
    height: 22px;

  }
.left-part,.pa-right-part{
  padding-top: 8px;
}
::v-deep.ly-tree{
  height: 100%;
  .el-card {
    height: 100%;
    overflow-y: scroll;
  }
  .ly-tree-container{
    .ly-edit__text{
      min-width: 105px;
    }
    .ly-visible{
      width: unset;
    }
  }
}
::v-deep.left-part .ly-tree-container{
  height:100% !important;
  width: unset;
  padding-left: 0px;
  padding-right: 0px;
  .el-tree.el-tree--highlight-current{
    min-width: none;
  }
}
</style>
