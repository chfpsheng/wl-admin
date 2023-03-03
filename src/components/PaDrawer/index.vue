<template>
  <el-drawer
    class="pa-drawer"
    :title="title"
    :visible.sync="drawerVisible"
    :direction="direction"
    :append-to-body="appendToBody"
    :close-on-press-escape="closeOnPressEscape"
    :destroy-on-close="destroyOnClose"
    :modal="modal"
    :modal-append-to-body="modalAppendToBody"
    :show-close="showClose"
    :size="size"
    :wrapper-closable="wrapperClosable"
    :with-header="false"
    @open="open"
    @opened="opened"
    @close="close"
    @closed="closed"
  >
    <div class="drawer-box">
      <div v-if="withHeader" class="drawer-header">
        <span>{{ title }}</span>
        <!-- <el-popconfirm v-if="withPopconfirm" title="确定关闭" @confirm="console.log(111)">
          <button type="button" class="el-drawer__close-btn" slot="reference">
            <i class="el-icon-close"></i>
          </button>
        </el-popconfirm> -->
        <button v-if="!withPopconfirm" type="button" class="el-drawer__close-btn" @click="confirm">
          <i class="el-icon-close" />
        </button>
      </div>
      <div class="drawer-body">
        <div class="drawer-body-box">
          <slot />
        </div>
      </div>
      <div v-if="withFooter" class="drawer-footer">
        <el-button class="pa-btn" @click="handleCancel">
          {{ cancelButtonText }}
        </el-button>
        <el-button type="primary" :loading="confirmLoading" class="pa-btn" @click="handleOK">
          {{ confirmButtonText }}
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>
export default {
  name: 'PaDrawer',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'rtl'
    },
    title: {
      type: String,
      default: '标题'
    },
    withFooter: {
      type: Boolean,
      default: true
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    confirmLoading: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    customClass: String,
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    modalAppendToBody: {
      type: Boolean,
      default: true
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: [Number, String],
      default: '400px'
    },
    wrapperClosable: {
      type: Boolean,
      default: false
    },
    withHeader: {
      type: Boolean,
      default: true
    },
    withPopconfirm: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      drawerVisible: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.drawerVisible = val
      },
      immediate: true
    },
    drawerVisible: {
      handler(val) {
        this.$emit('update:visible', val)
      },
      immediate: true
    }
  },
  methods: {
    handleOK() {
      this.$emit('ok')
    },
    handleCancel() {
      this.$emit('cancel')
    },
    open() {
      this.$emit('open')
    },
    opened() {
      this.$emit('opened')
    },
    close() {
      this.$emit('close')
    },
    closed() {
      this.$emit('closed')
    },
    confirm() {
      this.drawerVisible = false
      this.$emit('close')
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
