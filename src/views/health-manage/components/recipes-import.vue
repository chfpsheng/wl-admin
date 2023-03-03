<template>
  <div class="app-cnt">
    <el-dialog
      v-if="importShow"
      width='408px'
      class="label-dlg"
      title="导入"
      :visible="importShow"
      :append-to-body="true"
      @close="close"
    >
      <div>
        <div class="warn">
          <i class="iconfont icon-jinggao"></i>
          <span>食谱导入，导入前请先下载模板，按模板填写好数据后上传表格 !</span>
        </div>
        <div class="main">
          <div class="item" @click="onExport">
            <span>
              <i class="iconfont icon-xiazai"></i>
            </span>
            <div>下载模板</div>
          </div>
          <div class="item" @click="onImport">
            <span><i class="iconfont icon-shangchuan"></i></span>
            <div>上传表格</div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { exportCookbook } from '@/api/patient'
export default {
  name: 'RecipesImport',
  props: {
    importShow: {
      type: Boolean,
      default: false
    },
    foodData: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
    // 下载
    async onExport () {
      await exportCookbook({}).then(res => {
        if (res.data) {
          // 超链接下载
          location.href = res.data
        }
      })
    },

    // 导入文件
    onImport () {
      let isEmpty = false
      let days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
      for (let item of this.foodData) {
        for (let day of days) {
          if (item[day]) {
            isEmpty = true
            break
          }
        }
      }
      this.$emit('close')
      if (isEmpty) {
        this.$confirm('食谱将被覆盖，是否确认导入？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$emit('upload')
        })
      } else {
        this.$emit('upload')
      }
    },

    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
.warn{
  font-size: 12px;
  color: #FAAD14;
  margin: 8px 20px 45px;
  i{
    font-size: 14px;
    vertical-align: bottom;
    margin-right: 4px;
  }
}
.main{
  display: flex;
  justify-content: center;
  padding-bottom: 54px;
  .item{
    text-align: center;
    font-size: 12px;
    cursor: pointer;
    &:first-child{
      margin-right: 48px;
    }
    &:last-child{
      margin-left: 48px;
    }
    span{
      display: inline-block;
      width: 44px;
      height: 44px;
      background: #E5EFF9;
      border-radius: 50%;
      margin-bottom: 8px;
      line-height: 44px;
      i{
        font-size: 24px;
        color: #0066CC;
      }
    }
  }
}
</style>
