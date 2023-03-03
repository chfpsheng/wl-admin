<template>
  <div class="filter-item">
    <span class="filter-select-title">
      {{ title }}
    </span>
    <el-input
      v-model="inputValue"
      :placeholder="placeholder"
      :clearable="clearable"
      class="pa-input filter-input"
      @change="change"
      @clear="clear"
    />
  </div>
</template>
<script>
export default {
  name: 'ServiceManage',
  props: {
    value: {
      type: [String, Number, Boolean, Array]
    },
    options: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: '筛选条件'
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      inputValue: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.inputValue = val
      },
      immediate: true
    },
    inputValue: {
      handler(val) {
        this.$emit('update:value', val)
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    change(val) {
      this.$emit('change', val)
    },
    clear() {
      this.$emit('clear')
    }
  }
}
</script>
<style scoped>
</style>
