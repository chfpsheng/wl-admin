<template>
  <div class="filter-item">
    <span class="filter-select-title">
      {{ title }}
    </span>
    <el-date-picker
      v-model="selectedValue"
      type="daterange"
      range-separator="至"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"
      :picker-options="pickerOptions"
      class="pa-datepicker"
      value-format="yyyy-MM-dd"
      clearable
      @change="change"
    />
  </div>
</template>
<script>
export default {
  name: 'FilterDaterangPicker',
  props: {
    value: {
      type: [String, Number, Boolean, Array]
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    },
    title: {
      type: String,
      default: '筛选条件'
    },
    pickerOptions: {
      type: Object,
      default: () => ({})
    }
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
