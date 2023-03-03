<template>
  <div class="app-cnt">
    <el-dialog
      v-if="dlgVisible"
      class="label-dlg"
      title="选择标签"
      :visible="dlgVisible"
      :append-to-body="true"
      @close="closeDlg"
    >
      <div class="dlg-cnt-div">
        <div>
          <!-- <div class="search-cnt">
            <el-input class="pa-input" v-model="labelName" placeholder="请输入名称查询" />
            <el-button
              class="pa-btn"
              type="primary"
              @click="queryLabel()"
            >查询</el-button>
          </div> -->
          <div class="slted-cnt">
            <span class="title">已选</span>
            <!-- <div
            v-for="(item, index) in sltedData"
            :key="index"
            class="label-item-slted"
            @click="deleteItem(item, index)"
          ><el-button>{{ item.labelName }}<i class="iconfont icon-guanbiicon iconsize" /></el-button></div> -->
            <span
              v-for="(item, index) in sltedData"
              :key="index"
              class="label-item-slted"
            >
              {{ item.labelName }}
              <i
                class="iconfont icon-guanbiicon icon-error iconsize"
                @click="deleteItem(item, index)"
              />
            </span>
          </div>
        </div>
        <hr class="level-line" />
        <div class="label-cnt">
          <div class="tree-cnt flex flex-column">
            <div class="search-cnt">
              <el-input
                v-model.trim="labelName"
                clearable
                prefix-icon="iconfont icon-sousuo"
                placeholder="请输入名称查询"
                style="height: 48px"
                @keyup.enter.native="queryLabel()"
              />
            </div>
            <div class="flex-main">
              <div class="ly-tree-container">
                <el-tree
                  :data="treeData"
                  :props="defaultProps"
                  icon-class="icon iconfont icon-s_shouqi"
                  @node-click="handleNodeClick"
                  highlight-current
                >
                  <span class="custom-tree-node" slot-scope="{ node }">
                    <span> {{ node.label }}</span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
          <div class="label-to-list">
            <span
              v-for="(item, index) in toSltedData"
              :key="index"
              :class="{ isSelect: item.isSelected }"
              class="label-item cur-sty"
              @click="changeSltedStatus(item)"
            >
              {{ item.labelName }}
            </span>
          </div>
        </div>
        <div class="btn-cnt">
          <el-button class="pa-btn" type="primary" @click="submitForm()"
            >确定</el-button
          >
          <el-button class="pa-btn" @click="cancleAdd">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { labelTypeQuery, labelQuery } from '@/api/patient/'

export default {
  name: 'LabelSelect',
  props: {
    dlgVisible: {
      type: Boolean,
      default: false,
    },
    initData: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      destroyOnClose: true,
      // dlgVisible: true,
      treeData: [],
      currentNodeKey: '',
      labelName: '', // 搜索的标签名
      // sltedData: this.initData,
      toSltedData: [],
      defaultProps: {
        children: 'child',
        label: 'name',
      },
    }
  },
  computed: {
    sltedData() {
      return this.initData
    },
  },
  created() {
    const data = {
      pageNo: 1,
      pageSize: 1000,
    }
    labelTypeQuery(data).then((res) => {
      this.treeData = this.getTreeData(res.data.rows, 0) // 获取层次为1的数组
    })
  },
  mounted() {
    this.queryLabel()
  },
  methods: {
    submitForm() {
      // if (this.sltedData.length === 0) {
      //   this.$message({
      //     message: '请至少选择一个标签',
      //     type: 'error',
      //     duration: 5 * 2000,
      //   })
      //   return
      // }
      this.$emit('updateLabelList', this.sltedData)
      // this.dlgVisible = false
    },
    cancleAdd() {
      // this.dlgVisible = false
      this.$emit('closeDlg')
    },
    deleteItem(item, index) {
      this.sltedData.splice(index, 1)
      // 删除后要复原之前选中的
      this.toSltedData.map((item2) => {
        if (item2.id === item.id) {
          item2.isSelected = false
        }
      })
      this.$forceUpdate()
    },
    queryLabel() {
      this.toSltedData = []
      labelQuery({
        labelName: this.labelName,
        pageNo: 1,
        pageSize: 300,
      })
        .then((response) => {
          const arr = []
          response.data.rows.forEach((item, index) => {
            // 0代表手动标签 1 代表自动标签 数字类型  状态是启用
            if (item.tagType === 0 && item.status === 1) {
              arr.push(item)
            }
          })
          this.toSltedData = arr || []
          //可选列表中是否有已选中的
          this.toSltedData.forEach((item) => {
            let index = this.sltedData.findIndex((sltedDataItem) => {
              if (sltedDataItem.id === item.id) {
                return true
              }
            })

            if (index > -1) {
              item.isSelected = true
            }
          })
        })
        .catch((e) => {})
    },
    closeDlg() {
      this.$emit('closeDlg')
    },
    handleNodeClick(data) {
      const id = data.id
      this.toSltedData = []
      this.currentNodeKey = data.id
      labelQuery({
        labelTypeId: id,
        pageNo: 1,
        pageSize: 300,
      })
        .then((response) => {
          const arr = []
          response.data.rows.forEach((item, index) => {
            // 0代表手动标签 1 代表自动标签 数字类型  状态是启用
            if (item.tagType === 0 && item.status === 1) {
              arr.push(item)
            }
          })
          this.toSltedData = arr
          //可选列表中是否有已选中的
          this.toSltedData.forEach((item) => {
            let index = this.sltedData.findIndex((sltedDataItem) => {
              if (sltedDataItem.id === item.id) {
                return true
              }
            })

            if (index > -1) {
              item.isSelected = true
            }
          })
        })
        .catch((e) => {})
    },
    getTreeData(tempData, parentId) {
      const treeData = []
      tempData.forEach((item) => {
        // 必须是手动标签才存入
        if (item.parentId === parentId) {
          treeData.push({
            id: item.id,
            parentId: item.parentId,
            level: item.level,
            name: item.typeName,
            $treeNodeId: item.id,
            child: this.getTreeData(tempData, item.id),
          })
        }
      })
      return treeData
    },
    changeSltedStatus(item) {
      if (!item.isSelected) {
        item.isSelected = !item.isSelected // 之前没选中的时候，选中，并将数据加入已选中数据
        //选中标签之前要检查是否已经存在；如果存在跳过
        let index = this.sltedData.findIndex((sltedItem) => {
          if (sltedItem.id === item.id) {
            return true
          }
        })

        if (index < 0) {
          this.sltedData.push(item)
        }
        this.$forceUpdate()
      } else {
        // 已经选中的，不做任何改变
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.dlg-cnt-div {
  padding: 0px 24px;
  .level-line {
    height: 1px;
    background: #ebebeb;
    border: 0;
    margin: 8px 0 16px 0;
  }
}
.el-tree {
  display: inline-block;
  min-width: 100%;
}
.btn-cnt {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  padding: 24px 0px 0 24px;
  border-top: 1px solid #ebebeb;
  .el-button + .el-button {
    margin-left: 24px;
  }
}
.app-cnt >>> .el-dialog {
  height: auto;
}
>>> .el-dialog {
  min-height: 600px !important;
}
.label-dlg {
  min-height: 600px;
}
::v-deep .tree-cnt .el-input__prefix {
  left: 8px;
}
::v-deep .tree-cnt .el-input__inner {
  height: 48px;
}
::v-deep .tree-cnt .el-input__icon {
  line-height: 48px;
}
.slted-cnt {
  display: flex;
  align-items: center;
  margin: 8px 0px 0px 0px;
  flex-wrap: wrap;
}
.title {
  margin-right: 8px;
}
.label-item-slted {
  display: inline-block;
  text-align: center;
  padding: 8px;
  margin: 8px;
  display: flex;
  align-items: center;
  background: #f2f7fc;
  border-radius: 2px;
  height: 32px;
  cursor: pointer;
  .iconfont.icon-guanbiicon {
    font-size: 14px;
  }
}
.search-cnt {
  display: flex;
  align-items: center;
  .pa-input {
    width: 260px;
  }
  .pa-btn {
    margin-left: 24px;
  }
}
.pa-btn {
  margin-left: 10px;
}

::v-deep .tree-cnt {
  // padding: 16px;
  width: 220px;
  border: 1px solid #cccccc;
  height: 230px;
  overflow: auto;
  flex-shrink: 0;
  // .el-tree-node:focus > .el-tree-node__content {
  //   background-color: #f2f7fc;
  // }
  .el-tree-node__content {
    height: 40px;
  }
}
.label-item {
  display: inline-flex;
  align-items: center;
  background: #f2f7fc;
  border-radius: 2px;
  color: #333333;
  text-align: center;
  padding: 8px;
  margin-right: 8px;
  margin-left: 8px;
  height: 32px;
  word-break: keep-all;
  margin-bottom: 16px;
}
.label-to-list {
  padding: 0px 8px;
  font-size: 14px;
  height: 220px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.isSelect {
  height: 32px;
  color: #0066cc;
  text-align: center;
}
.label-cnt {
  display: flex;
}
::v-deep.label-dlg {
  .el-dialog__header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    padding: 20px 24px;
    height: 64px;
    .el-dialog__title {
      height: 21px;
      opacity: 1;
      font-size: 16px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
    .el-dialog__headerbtn {
      height: 24px;
    }
  }
  .el-dialog__body {
    padding: 0 0 24px 0;
  }
}
.pa-btn {
  min-width: 72px;
}
.mr-8 {
  margin-right: 8px;
}
.ly-tree-container {
  padding: 0;
  height: 100%;
  width: 100%;
}
.cur-sty {
  cursor: pointer;
}
</style>
