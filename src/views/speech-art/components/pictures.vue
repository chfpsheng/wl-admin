<template>
  <div class="upload-container sb---upload">
    <div class="upload-top">
      <el-button
        size="mini"
        type="primary"
        class="pa-btn"
        @click="dialogVisible = true"
      >
        <i class="iconfont icon-icon-upload1"></i>
        上传图片
      </el-button>
      <!-- <div class="upload-title">上传png，jpg，jpeg格式图片，10M以内大小</div> -->
    </div>

    <!-- https://httpbin.org/post -->
    <el-dialog
      class="upload-dialog"
      title="上传图片"
      :visible.sync="dialogVisible"
      width="736px"
    >
      <div slot="title" class="upload-dialog-title">
        <span class="title">添加图片</span>
        <span class="mark">上传png，jpg，jpeg格式图片，10M以内大小</span>
      </div>
      <el-upload
        class="img-upload"
        ref="imgsUpLoad"
        :multiple="true"
        :action="$uploadUrl"
        list-type="picture-card"
        :auto-upload="true"
        :file-list="fileList"
        :on-change="handleChange"
        :on-remove="handleRemove"
        :http-request="uploadFile"
      >
        <i class="el-icon-plus" />
        <!-- <el-button size="small" type="primary">
            点击上传
          </el-button> -->
      </el-upload>
      <div class="confirm-bottom">
        <el-button @click="dialogVisible = false" class="pa-btn">
          取消
        </el-button>
        <el-button type="primary" @click="handleSubmit" class="pa-btn">
          确认
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import { getToken } from "@/utils/auth";

export default {
  name: "EditorSlideUpload",
  props: {
    color: {
      type: String,
      default: "#0066cc",
    },
  },
  data() {
    return {
      dialogVisible: false,
      listObj: {},
      fileList: [],
      headers: {},
      photoList: [],
      uploading: false,
    };
  },
  mounted() {
    this.headers = {
      token: getToken(),
    };
  },
  methods: {
    // 文件上传new
    async initCOS() {
      const result = await this.$requestPost(
        "/cloud-baseinfo/fileUploadInfo/getTmpCredential",
        {}
      );
      if (result && result.code === 200) {
        this.cosConfig = { ...result.data };

        this.cos = new COS({
          // 必选参数
          getAuthorization: (options, callback) => {
            callback({
              TmpSecretId: this.cosConfig.credentials.tmpSecretId,
              TmpSecretKey: this.cosConfig.credentials.tmpSecretKey,
              SecurityToken: this.cosConfig.credentials.sessionToken,
              StartTime: this.cosConfig.startTime,
              ExpiredTime: this.cosConfig.expiredTime,
            });
          },
        });
      }

      return new Promise((resolve, reject) => {
        resolve(this.cosConfig);
      });
    },
    async uploadFileNew(params) {
      // debugger
      await this.initCOS();
      const Key = `${new Date().getTime()}${
        this.$local.get("userData").userId
      }${params.file.name.substring(params.file.name.lastIndexOf("."))}`;
      this.cos.putObject(
        {
          Bucket: this.cosConfig.bucketName /* 必须 */,
          Region: this.cosConfig.region /* 存储桶所在地域，必须字段 */,
          Key /* 必须 */,
          StorageClass: "STANDARD",
          Body: params.file, // 上传文件对象
          // onProgress: (progressData) => {
          //
          // }
        },
        (err, data) => {
          if (data && data.statusCode === 200) {
            this.fileList[this.fileList.length - 1].status = "success";
            this.fileList[this.fileList.length - 1].percentage = 100;
            const photoUrl = `https://${data.Location}`;
            // this.photoList.push(photoUrl)
            this.photoList.push({
              name: params.file.name,
              url: photoUrl,
            });
            this.$emit("fileChange", this.photoList);
          } else {
            this.fileList.pop();
            this.addShow = true;
          }
          this.uploading = false;
        }
      );
    },
    async uploadFile(params) {
      this.uploading = true;
      const file = params.file;
      // 上传png、jpg、jpeg格式图片，大小不超过10M
      const isImg = file.type === "image/jpeg" || file.type === "image/png";
      const isLt = file.size / 1024 / 1024 < 10;
      if (!isImg) {
        this.$message.error("上传图片只能是 jpg/jpeg/png 格式!");
        this.fileList.pop();
        this.uploading = false;
        return;
      }
      if (!isLt) {
        this.$message.error("上传图片大小不能超过 10MB!");
        this.fileList.pop();
        this.uploading = false;
        return;
      }
      // 根据后台需求数据格式
      this.fileList[this.fileList.length - 1].status = "uploading";
      for (let i = 0; i <= 10; i++) {
        setTimeout(() => {
          this.fileList[this.fileList.length - 1].percentage = i * 10 - 1;
        }, 10);
      }
      const fileData = new FormData();
      fileData.append("file", file);
      this.uploadFileNew(params); // 新上传
    },
    handleChange(file, fileList) {
      fileList.forEach((item) => {
        item.name = item.name.substring(
          item.name.lastIndexOf("=") + 1,
          item.name.length
        );
      });
      this.fileList = fileList;
    },

    handleRemove(file) {
      const index = this.fileList.findIndex((item) => item.url === file.url);
      this.fileList.splice(index, 1);
      this.photoList.splice(index, 1);
    },
    handleSubmit() {
      if (this.uploading) {
        this.$message(
          "请等待所有图片上传成功。如果有网络问题，请刷新页面并重新上传!"
        );
        return;
      }
      const photo = [];
      for (let i = 0; i < this.photoList.length; i++) {
        photo.push({
          url: this.photoList[i].url,
          name: this.photoList[i].name,
        });
      }
      const arr = photo;
      this.$emit("successCBK", arr);
      this.listObj = {};
      this.fileList = [];
      this.photoList = [];
      this.dialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
}

/*  ::v-deep .el-upload-list--picture-card .el-upload-list__item {
    width: 130px !important;
    height: 170px !important;
    border-radius: 2px !important;
    padding-bottom: 40px;
  } */

::v-deep .el-upload-list--picture-card .el-upload-list__item-name {
  display: block;
}

.upload-title {
  color: #ccc;
  font-size: 14px;
  margin-left: 6px;
}

.upload-top {
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.confirm-bottom {
  // margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  padding: 24px;
  border-top: 1px solid #ebebeb;
  .el-button + .el-button {
    margin-left: 16px;
  }
}

::v-deep .upload-container .el-upload {
  width: 148px !important;
}
::v-deep.img-upload {
  padding: 12px;
  .el-upload-list__item {
    width: 118px;
    height: 118px;
    margin: 12px;
  }
  .el-upload--picture-card {
    width: 118px;
    height: 118px;
    margin: 12px;
    background-color: unset;
    line-height: 118px;
  }
}
::v-deep .el-upload-list.el-upload-list--picture-card {
  line-height: 0;
}
::v-deep .upload-dialog {
  .upload-dialog-title {
    display: flex;
    align-items: flex-end;
    .title {
      font-size: 16px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #333333;
      line-height: 22px;
    }
    .mark {
      font-size: 12px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #999999;
      margin-left: 8px;
      line-height: 17px;
    }
  }
  .el-dialog__header {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebebeb;
    padding: 20px 24px;
    .el-dialog__headerbtn {
      height: 24px;
    }
  }
  .el-dialog__body {
    padding: 0 !important;
    &::-webkit-scrollbar{
      width: 0px;
    }
  }
}
.iconfont.icon-icon-upload1{
  font-size: 14px;
  margin-right: 2px;
}
</style>
