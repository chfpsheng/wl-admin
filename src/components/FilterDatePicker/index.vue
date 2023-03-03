<template>
  <div class="filter-item">
    <span class="filter-select-title">
      {{ title }}
    </span>
    <el-date-picker
      v-model="selectedValue"
      type="date"
      :placeholder="placeholder"
      value-format="yyyy-MM-dd"
      :clearable="clearable"
      :editable="editable"
      @change="change"
      class="pa-date-picker">
    </el-date-picker>
  </div>
</template>
<script>
export default {
  name: 'FilterDaterangPicker',
  props: {
    value: {
      type: [String, Number, Boolean, Array]
    },
    title: {
      type: String,
      default: '筛选条件'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    editable: {
      type: Boolean,
      default: true
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
      console.log(val)
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
