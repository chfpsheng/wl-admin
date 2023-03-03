<template>
  <el-date-picker
    v-model="selectedValue"
    :type="type"
    :placeholder="placeholder"
    class="pa-select"
    :disabled="disabled"
    :clearable="clearable"
    :format="format"
    :value-format="valueFormat"
    @change="change"
    @clear="clear">
  </el-date-picker>
</template>
<script>
export default {
  name: 'PaSelect',
  props: {
    value: {
      type: [String, Number, Boolean, Array],
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    type: {
      type: String,
      default: 'date'
    },
  },
  data() {
    return {
      selectedValue: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.selectedValue = val
      },
      immediate: true
    },
    selectedValue: {
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
