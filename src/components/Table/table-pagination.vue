<template>
  <el-pagination
    v-if="visible"
    class="pagination-common"
    @size-change="pageSizeChange"
    @current-change="changeHandler"
    :current-page="vModel.pageNo"
    :page-size="vModel.pageSize"
    layout="total, sizes, prev, pager, next, jumper"
    :total="total"
    size="medium"
  >
  </el-pagination>
</template>

<script>
export default {
  name: "TablePagination",
  props: {
    vModel: {
      type: Object,
      default: () => ({
        pageNo: 0,
        pageSize: 10,
      }),
    },
    total: {
      type: Number,
      default: 0,
    },
  },
  model: {
    prop: "vModel",
    event: "change",
  },
  data() {
    return {
      visible: true,
    };
  },
  watch: {
    vModel: {
      handler: function() {
        this.visible = false;
        this.$nextTick(() => {
          this.visible = true;
        });
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // console.log(this.hospital)
  },
  methods: {
    changeHandler(pageNo) {
      this.vModel.pageNo = pageNo;
      this.$emit("change", this.vModel);
    },
    pageSizeChange(pageSize) {
      // console.log(pageNo);
      this.vModel.pageSize = pageSize;
      this.changeHandler(this.vModel.pageNo);
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
