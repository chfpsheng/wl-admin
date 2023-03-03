<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="375px"
    class="iframe-dialog"
  >
    <div v-loading="loading" class="iframe-box">
      <div class="box">
        111111
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'PaIframe',
  props: {
    title: {
      type: String,
      default: '详情预览'
    },
    visible: {
      type: Boolean,
      default: false
    },
    pathUrl: {
      type: String,
      default: '/'
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: false
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true
    },
    dialogVisible: {
      handler(val) {
        this.$emit('update:visible', val)
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    loadingFn() {
      this.loading = false
    }
  }
}
</script>
<style scoped>
</style>
