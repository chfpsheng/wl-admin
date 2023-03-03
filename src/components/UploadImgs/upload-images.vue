<template>
  <upload-imgs
    :imgList="imgList"
    @fileChange="fileChange"
    :limit="3"
    :fileSizeLimit="1"
    :disabled="disabled"
  ></upload-imgs>
</template>

<script>
import UploadImgs from "./index.vue";
export default {
  components: {
    UploadImgs
  },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    vModel: {
      type: String,
      default: ""
    }
  },
  model: {
    prop: "vModel",
    event: "change"
  },
  data() {
    return {
      uploaded: false,
      imgList: []
    };
  },
  watch: {
    vModel: {
      handler: function() {
        if (this.vModel && !this.uploaded) {
          let data = [];
          // 兼容逗号与分号分割
          if (this.vModel.includes(";")) {
            data = this.vModel.split(";");
          } else {
            data = this.vModel.split(",");
          }
          this.imgList = data.map(item => {
            return {
              url: item
            };
          });
        }
      }
    }
  },

  methods: {
    fileChange(data) {
      this.uploaded = true;
      // console.log(this.imgList);
      // console.log(data);
      let result = "";
      if (data.length) {
        result = data.join(",");
      }
      this.$emit("change", result);
    }
  }
};
</script>

<style></style>
