<template>
  <div class="upload-box img--upLoad--box">
    <el-upload
      ref="imgUpLoad"
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :auto-upload="true"
      :file-list="fileList"
      :limit="limit"
      :on-exceed="handleExceed"
      :on-change="handleChange"
      :on-remove="handleRemove"
      :on-preview="handlePreview"
      :http-request="uploadFile"
      :class="[addShow ? 'img--upload' : 'img--disupload']"
    >
      <i class="el-icon-plus" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'UploadImg',
  props: {
    imgList: {
      type: Array,
      default: () => []
    },
    limit: {
      type: Number,
      default: 1
    },
    size: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      photoUrl: '',
      photoList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      addShow: true,
      cosConfig: null,
      cos: null
    }
  },
  watch: {
    imgList: {
      handler(val) {
        this.fileList = this.$lodash.cloneDeep(val)
        this.photoList = val.map(item => {
          item = item.url
          return item
        })
      },
      immediate: true
    },
    photoList: {
      handler(val) {
        this.addShow = !(val.length > 0)
      },
      deep: true,
      immediate: true
    }
  },
  created() {},
  mounted() {
  },
  methods: {
    // 文件上传new
    async initCOS() {
      const result = await this.$requestPost(
        '/cloud-baseinfo/fileUploadInfo/getTmpCredential',
        {}
      )
      if (result && result.code === 200) {
        this.cosConfig = { ...result.data }
       
        this.cos = new COS({
          // 必选参数
          getAuthorization: (options, callback) => {
            callback({
              TmpSecretId: this.cosConfig.credentials.tmpSecretId,
              TmpSecretKey: this.cosConfig.credentials.tmpSecretKey,
              SecurityToken: this.cosConfig.credentials.sessionToken,
              StartTime: this.cosConfig.startTime,
              ExpiredTime: this.cosConfig.expiredTime
            })
          }
        })
      }
     
      return new Promise((resolve, reject) => {
        resolve(this.cosConfig)
      })
    },
    async uploadFileNew(params) {
      
      
      // debugger
      await this.initCOS()
      const Key = `${new Date().getTime()}${this.$local.get('userData').userId}${params.file.name.substring(params.file.name.lastIndexOf('.'))}`
      this.cos.putObject({
        Bucket: this.cosConfig.bucketName, /* 必须 */
        Region: this.cosConfig.region, /* 存储桶所在地域，必须字段 */
        Key, /* 必须 */
        StorageClass: 'STANDARD',
        Body: params.file // 上传文件对象
        // onProgress: (progressData) => {
        // }
      }, (err, data) => {
       
        if (data && data.statusCode === 200) {
          this.fileList[this.fileList.length - 1].status = 'success'
          this.fileList[this.fileList.length - 1].percentage = 100
          const photoUrl = `https://${data.Location}`
          this.photoList.push(photoUrl)
          this.$emit('fileChange', this.photoList)
        } else {
          this.fileList.pop()
          this.addShow = true
        }
      })
    },
    async uploadFile(params) {
      
      this.addShow = false
      const file = params.file
      // 上传png、jpg、jpeg格式图片，大小不超过10M
      const isImg = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt = file.size / 1024 / 1024 < this.size
      if (!isImg) {
        this.$message.error('上传图片只能是 jpg/jpeg/png 格式!')
        this.fileList.pop()
        this.addShow = true
        return
      }
      if (!isLt) {
        this.$message.error(`上传图片大小不能超过${this.size}MB!`)
        this.fileList.pop()
        this.addShow = true
        return
      }
      // 根据后台需求数据格式
      this.fileList[this.fileList.length - 1].status = 'uploading'
      for (let i = 0; i <= 10; i++) {
        setTimeout(() => {
          this.fileList[this.fileList.length - 1].percentage = i * 10 - 1
        }, 10)
      }
      const fileData = new FormData()
      fileData.append('file', file)
      this.uploadFileNew(params) // 新上传
      // const result = await this.$requestPost(
      //   '/cloud-baseinfo/fileUploadInfo/fileUpload',
      //   fileData
      // )
      // if (result && result.code === 200) {
      //   this.fileList[this.fileList.length - 1].status = 'success'
      //   this.fileList[this.fileList.length - 1].percentage = 100
      //   const photoUrl = result.data.url
      //   this.photoList.push(photoUrl)
      //   this.$emit('fileChange', this.photoList)
      // } else {
      //   this.fileList.pop()
      //   this.addShow = true
      // }
    },
    handleRemove(file) {
     
      const index = this.fileList.findIndex(item => item.url === file.url)
      this.fileList.splice(index, 1)
      this.photoList.splice(index, 1)
      this.$emit('fileChange', this.photoList)
    },
    handlePreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    async handleChange(file, fileList) {
     
      this.fileList = fileList
    },
    handleExceed() {
      this.$message.error(`最多只能上传${this.limit}张照片`)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
