<template>
  <div class="pa-im-box-container">
    <div class="words-box">
      <div class="header-handle-box">
        <div class="title">
          <i class="el-icon-close close-icon" @click="closeWords" />
          话术
        </div>
      </div>
      <div class="search-box">
        <el-input
          v-model.trim="inputCondition"
          placeholder="话术标题"
          clearable
          class="pa-input pa-im-input"
          @keyup.enter.native="searchFn"
          @clear="inputClear"
        >
          <template slot="prepend">
            <i class="el-icon-search" @click="searchFn" />
          </template>
        </el-input>
      </div>
      <el-tabs v-model="activeName" class="pa-im-child-tabs" @tab-click="handleClick">
        <el-tab-pane label="文本" name="1">
          <div v-show="!condition" class="tab-item-box pa-img-tree-box">
            <el-tree
              :data="treeData"
              :props="defaultProps"
              node-key="id"
              :default-expanded-keys="textExpanded"
            >
              <div slot-scope="{ node, data }" class="custom-tree-node">
                <span v-if="!data.content">
                  {{ node.label }}
                </span>
                <el-popover
                  v-if="data.content"
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :append-to-body="false"
                  popper-class="text-poper" 
                >
                  <div style="width: 100%; white-space: break-spaces" @dblclick="treeCilck(data)">{{data.content}}</div>
                  <div slot="reference" class="pa-tree-node-content" @dblclick="treeCilck(data)">
                    <i class="iconfont icon-a-content-icon1 im-tree-icon" />
                    {{data.tittle}}
                  </div>
                </el-popover>
              </div>
            </el-tree>
          </div>
          <div v-show="condition" class="infinite-list-wrapper" style="overflow: auto">
            <ul
              v-infinite-scroll="textLoad"
              class="list"
              :infinite-scroll-disabled="textDisabled"
            >
              <li v-for="(item, index) in textList" :key="index" class="list-item">
                <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  :append-to-body="false"
                >
                  <div style="width: 100%; white-space: break-spaces">{{item.content}}</div>
                  <div slot="reference" class="pa-tree-node-content" @dblclick="treeCilck(item)">
                    <i class="iconfont icon-a-content-icon1 im-tree-icon" />
                    {{ item.tittle }}
                  </div>
                </el-popover>
              </li>
            </ul>
            <p v-if="textLoading" class="loading-tips">加载中...</p>
            <p v-if="textNoMore" class="loading-tips">没有更多了</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="图片" name="2">
          <div v-show="!condition" class="tab-item-box pa-img-tree-box pa-image-tree-box">
            <el-tree
              :data="imgTreeData"
              :props="defaultProps"
              node-key="id"
              :default-expanded-keys="imgExpanded"
            >
              <div slot-scope="{ node, data }" class="custom-tree-node">
                <span v-if="!data.content" slot="reference">{{ node.label }}</span>
                <el-popover
                  v-if="data.content"
                  placement="top-start"
                  trigger="hover"
                  :append-to-body="false"
                >
                  <img :src="data.content" style="width: 140px; height: 140px" @dblclick="treeCilck(data)">
                  <div slot="reference" class="pa-tree-node-content" @dblclick="treeCilck(data)">
                    <i class="iconfont icon-a-content-icon1 im-tree-icon" />
                    {{ data.tittle }}
                  </div>
                </el-popover>
              </div>
            </el-tree>
          </div>
          <div v-show="condition" class="infinite-list-wrapper pa-image-tree-box" style="overflow: auto">
            <ul
              v-infinite-scroll="imgLoad"
              class="list"
              :infinite-scroll-disabled="imgDisabled"
            >
              <li v-for="(item, index) in imgList" :key="index" class="list-item">
                <el-popover
                  v-if="item.content"
                  placement="top-start"
                  trigger="hover"
                  :append-to-body="false"
                >
                  <img :src="item.content" style="width: 140px; height: 140px" @dblclick="treeCilck(item)">
                  <span slot="reference" @dblclick="treeCilck(item)">
                    <i class="iconfont icon-a-content-icon1 im-tree-icon" />
                    {{ item.tittle }}
                  </span>
                </el-popover>
              </li>
            </ul>
            <p v-if="imgLoading" class="loading-tips">加载中...</p>
            <p v-if="imgNoMore" class="loading-tips">没有更多了</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="链接" name="3">
          <div v-show="!condition" class="tab-item-box pa-img-tree-box">
            <el-tree
              :data="linkTreeData"
              :props="defaultProps"
              node-key="id"
              :default-expanded-keys="linkExpanded"
            >
              <div slot-scope="{ node, data }">
                <div class="pa-tree-node-content" @dblclick="treeCilck(data)">
                  <span v-if="!data.content">{{ node.label }}</span>
                  <img v-if="data.content" :src="data.url ? data.url : require('../../assets/image/defaultLink.png')" style="width: 16px; height: 14px; margin-right: 8px">
                  <span v-if="data.content">{{ data.tittle }}</span>
                </div>
              </div>
            </el-tree>
          </div>
          <div v-show="condition" class="infinite-list-wrapper" style="overflow: auto">
            <ul
              v-infinite-scroll="linkLoad"
              class="list"
              :infinite-scroll-disabled="linkDisabled"
            >
              <li v-for="(item, index) in linkList" :key="index" class="list-item">
                <div class="custom-tree-node" @dblclick="treeCilck(item)">
                  <img :src="item.url ? item.url : require('../../assets/image/defaultLink.png')" style="width: 16px; height: 14px; margin-right: 8px">
                  <span>{{ item.tittle }}</span>
                </div>
              </li>
            </ul>
            <p v-if="linkLoading" class="loading-tips">加载中...</p>
            <p v-if="linkNoMore" class="loading-tips">没有更多了</p>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WordsBox',
  data() {
    return {
      inputValue: '',
      activeName: '1',
      treeData: [],
      imgTreeData: [],
      linkTreeData: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      inputCondition: '',
      condition: '',
      textList: [],
      textLoading: false,
      imgList: [],
      imgLoading: false,
      linkList: [],
      linkLoading: false,
      pagination: {
        pageNo: 1,
        pageSize: 40,
        total: 0
      },
      textExpanded: [],
      imgExpanded: [],
      linkExpanded: [],
    }
  },
  computed: {
    textNoMore() {
      return this.textList.length >= this.pagination.total && !this.textLoading
    },
    textDisabled() {
      return this.textLoading || this.textNoMore
    },
    imgNoMore() {
      return this.imgList.length >= this.pagination.total && !this.imgLoading
    },
    imgDisabled() {
      return this.imgLoading || this.imgNoMore
    },
    linkNoMore() {
      return this.linkList.length >= this.pagination.total && !this.linkLoading
    },
    linkDisabled() {
      return this.linkLoading || this.linkNoMore
    }
  },
  created() {},
  mounted() {
    this.initData()
  },
  methods: {
    async initData() {
      this.getTreeNew('1')
      this.getTreeNew('2')
      this.getTreeNew('3')
    },
    searchFn() {
      const a = this.activeName === '1' && this.textLoading
      const b = this.activeName === '2' && this.imgLoading
      const c = this.activeName === '3' && this.linkLoading
      if(a || b || c) {
        return
      }
      console.log(this.textLoading, this.imgLoading, this.linkLoading)
      if (this.inputCondition) {
        this.textList = []
        this.imgList = []
        this.linkList = []
        this.pagination = {
          pageNo: 1,
          pageSize: 20,
          total: 0
        }
        this.searchData()
      } else {
        this.inputClear()
      }
    },
    handleClick() {
      this.pagination.pageNo = 1
      this.textList = []
      this.imgList = []
      this.linkList = []
      this.textLoading = false
      this.imgLoading = false
      this.linkLoading = false
      if (this.condition) {
        this.searchFn()
      }
    },
    async searchData() {
      if (this.activeName === '1') {
        this.textLoading = true
      } else if (this.activeName === '2') {
        this.imgLoading = true
      } else {
        this.linkLoading = true
      }
      this.condition = this.inputCondition
      console.log(this.pagination.pageNo)
      const result = await this.getTree(this.activeName, this.condition, this.pagination)
      if (result && result.code === 200) {
        // let resultData = result.data.rows.filter(item => item.status !== 0)
        // resultData = resultData.filter(item => !!item.content)
        let resultData = result.data.rows
        this.pagination.total = result.data.total
        if (this.activeName === '1') {
          resultData = resultData.map(item => {
            let content = item.content
            if (content) {
              content = content.replace(/\[patientName\]/g, '[患者姓名]')
              content = content.replace(/\[gestation\]/g, '[孕周]')
              content = content.replace(/\[dueDate\]/g, '[预产期]')
            } else {
              content = ''
            }
            item = {
              ...item,
              content
            }
            return item
          })
          this.textList = this.textList.concat(resultData)
        } else if (this.activeName === '2') {
          this.imgList = this.imgList.concat(resultData)
          
        } else {
          this.linkList = this.linkList.concat(resultData)
        }
        this.pagination.pageNo++
      }
      setTimeout(() => {
        if (this.activeName === '1') {
          this.textLoading = false
        } else if (this.activeName === '2') {
          this.imgLoading = false
        } else {
          this.linkLoading = false
        }
      }, 300)
    },
    async getTree(classifyType, condition, pagination) {
      const params = {
        status: 1,
        condition: condition || '',
        classifyType,
        pageNo: pagination ? pagination.pageNo : 1,
        pageSize: pagination ? pagination.pageSize : 300,
        typeOfInter: 2
      }
      const result = await this.$requestPost(
        `/cloud-consult/speechcraftInfo/queryByCondition`,
        params
      )
      return new Promise((resolve, reject) => {
        resolve(result)
      })
    },
    async getTreeNew(classifyType) {
      const result = await this.$requestPost(
        `/cloud-consult/speechcraftInfo/queryByType?classifyType=${classifyType}`,
        {}
      )
      if (result && result.code === 200) {
        let treeData = result.data.filter(item => item.status !== 0)
        // let treeData = result.data.rows
        if(treeData && treeData.length > 0) {
          const node = treeData.filter(item => !item.content)
          const content = treeData.filter(item => item.content)
          treeData = [...content, ...node]
        }
        // 默认展开一二级
        const textArr = treeData.filter(item => item.level === 1 || item.level === 2)
        
        if (classifyType === '1') {
          treeData = treeData.map(item => {
            let content = item.content
            if (content) {
              content = content.replace(/\[patientName\]/g, '[患者姓名]')
              content = content.replace(/\[gestation\]/g, '[孕周]')
              content = content.replace(/\[dueDate\]/g, '[预产期]')
            } else {
              content = ''
            }
            item = {
              ...item,
              content
            }
            return item
          })
          this.textExpanded = textArr.map(item => {
            item = item.id
            return item
          })
          this.treeData = this.getTreeData(treeData, 0)
          
        } else if (classifyType === '2') {
          this.imgExpanded = textArr.map(item => {
            item = item.id
            return item
          })
          this.imgTreeData = this.getTreeData(treeData, 0)
          
        } else {
          this.linkExpanded = textArr.map(item => {
            item = item.id
            return item
          })
          this.linkTreeData = this.getTreeData(treeData, 0)
          
        }
      }
    },
    getTreeData(tempData, parentId) {
      let treeData = []
      tempData.forEach((item) => {
        if (item.parentId === parentId) {
          treeData.push({
            ...item,
            children: this.getTreeData(tempData, item.id)
          })
        }
      })
      if(treeData && treeData.length > 0) {
        const node = treeData.filter(item => !item.content)
        const content = treeData.filter(item => item.content)
        treeData = [...content, ...node]
      }
      return treeData
    },
    treeCilck(data) {
      this.$emit('sendCustomMessage', data, this.activeName)
    },
    textLoad() {
      this.textLoading = true
      this.searchData()
    },
    imgLoad() {
      this.imgLoading = true
      this.searchData()
    },
    linkLoad() {
      this.linkLoading = true
      this.searchData()
    },
    inputClear() {
      this.inputCondition = ''
      this.condition = ''
      this.pagination = {
        pageNo: 1,
        pageSize: 20,
        total: 0
      }
    },
    closeWords() {
      this.$emit('closeWords', false);
    }
  }
}
</script>
<style scoped>
.words-box {
  width: 100%;
  height: 100%;
}
.filter-box {
  width: 100%;
}
.search-box {
  width: 100%;
  display: flex;
}
.tab-item-box {
  width: 100%;
  position: relative;
}
.custom-tree-node {
  display: flex;
  align-items: center;
}
.el-input-group {
  height: 48px;
}
.search-box .el-input__inner {
  height: 48px;
}
.pa-im-box-container {
  height: 100%;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.list-item {
  height: 28px;
  line-height: 28px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}
.header-handle-box {
  width: 100%;
  height: 48px;
  position: relative;
  margin-bottom: 16px;
}
.header-handle-box .title {
  position: absolute;
  top: 0;
  left: -16px;
  width: 114px;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #dfe4ed;
  border-right: 1px solid #dfe4ed;
  color: #06c;
}
.close-icon {
  position: absolute;
  right: 8px;
  font-size: 14px;
  color: #979797;
  top: 18px;
  cursor: pointer;
}
</style>
