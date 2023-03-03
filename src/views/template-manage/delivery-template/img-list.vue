<template>
  <div class="img-container">
    <upload-imgs
      class="img-list"
      :limit="3"
      :img-list="posterImgsList"
      @fileChange="posterImgsChange"
      :fileSizeLimit="1"
    />
  </div>
</template>
<script>
/* 就诊流程中的图片列 */
export default {
  name: "ImgList",
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: "",
    activeType: {
      // show or delete
      type: String,
      default: "show",
    },
  },
  data() {
    return {
      posterImgsList: [],
    };
  },
  created() {
    if (this.value) {
      const posterImgsArr = this.value.split(";");
      this.posterImgsList = posterImgsArr.map((item) => {
        item = {
          url: item,
        };
        return item;
      });
    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.activeType == "delete") {
          if (val) {
            const posterImgsArr = val.split(";");
            this.posterImgsList = posterImgsArr.map((item) => {
              item = {
                url: item,
              };
              return item;
            });
          } else {
            this.posterImgsList = [];
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    posterImgsChange(data) {
      let _value = data.join(";");
      this.$emit("change", _value);
    },
  },
};
</script>
<style lang="scss" scoped>
.img-container {
  width: 240px;
  margin-bottom: 20px;
}
::v-deep .img-list {
  .el-upload-list {
    li:nth-child(3) {
      margin-right: 0 !important;
    }
  }
  .el-upload.el-upload--picture-card {
    width: 62px;
    height: 62px;
    line-height: 62px;
  }
  .el-upload-list--picture-card .el-upload-list__item {
    width: 62px !important;
    height: 62px !important;
    margin: 0 8px 0 0;
  }
}
</style>