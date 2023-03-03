<template>
  <div class="app-cnt">
    <el-dialog
      v-if="dlgVisible"
      width="400px"
      height="292px"
      class="label-dlg"
      title="选择在线管家"
      :visible="dlgVisible"
      :append-to-body="true"
      @close="closeDlg"
    >
      <div class="content-cnt">
        <div class="content">
          <div v-if="initData.length > 0" class="">
            选择转接人
          </div>
          <div v-if="initData.length > 0" class="dlg-cnt-div">
            <pa-select
              :value.sync="imUserId"
              :options="initData"
              placeholder="选择在线管家"
            />
          </div>
          <div v-if="initData.length === 0" class="">
            没有可转接的在线管家
          </div>
        </div>
      </div>
      <div class="el-message-box__btns">
        <el-button class="pa-btn" @click="closeDlg">取消</el-button>
        <el-button type="primary" class="pa-btn" @click="submitForm">确定</el-button>
      </div>

    </el-dialog>
  </div>
</template>

<script>

export default {
  name: 'LabelSelect',
  props: {
    dlgVisible: {
      type: Boolean,
      default: false
    },
    initData: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      imUserId: '',
      destroyOnClose: true
    }
  },
  created() {

  },
  methods: {
    submitForm() {
      if (!this.imUserId && this.initData.length > 0) {
        this.$message({
          message: '请至少选择一个专属管家',
          type: 'error',
          duration: 5 * 2000
        })
        return
      }
      this.$emit('getSwitchUser', this.imUserId)
      // this.dlgVisible = false
    },
    closeDlg() {
      this.$emit('closeDlg')
    },
    cancleAdd() {
      this.$emit('closeDlg')
    }
  }
}
</script>
<style  scoped>
.dlg-cnt-div {

  overflow: auto;
}

.content-cnt{
    height: 142px;
    display: flex;
    align-content: center;
    padding:0px 32px;
    justify-content: center;
    flex-direction: column;
}

>>> .el-dialog__title{
    line-height: 22px;
    font-size: 16px;
    color: #333333;
    height: 22px;
}

>>> .el-dialog__header{
    padding: 24px;
    border-bottom: 1px solid #ebebeb;
}

>>> .el-dialog__body{
    padding:0px;
    height: 222px;
}

.el-message-box__btns{
    padding: 24px;
    text-align: right;
}
</style>
