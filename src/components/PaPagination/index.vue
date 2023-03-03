<template>
  <div class="pa-pagination">
    <div class="pa-pagination-box">
      <div>
        <span v-show="selectedShow" class="pa-pagination-selected">
          已选
          <span class="pa-pagination-selected-total">{{ selectedTotal }}</span>
          条
        </span>
      </div>
      <el-pagination
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'ServiceManage',
  props: {
    total: {
      type: Number,
      default: 0
    },
    currentPage: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    selectedTotal: {
      type: Number,
      default: 0
    },
    selectedShow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selectedValue: ''
    }
  },
  created() {},
  mounted() {
    document.getElementsByClassName('el-pagination__jump')[0].childNodes[0].nodeValue = '跳转'
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('sizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('currentChange', val)
    }
  }
}
</script>
<style scoped>
</style>
