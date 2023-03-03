<template>
  <span>
    <el-popover placement="top" trigger="click" :content="showInfoText" @show="getInfo">
      <i slot="reference" class="el-icon-view phone-icons" style="color: #06c" />
    </el-popover>
  </span>
</template>
<script>
export default {
  name: "SensitiveInfoShow",
  props:{
    id:{//请求id
      type:Number,
      default:null
    },
    backupId:{//请求第二id
      type:Number,
      default:null
    },
    type:{//显示手机号还是身份证号
      type:String,
      default:"手机号"
    },
    business:{//业务场景
      type:String,
      default:"business"
    },
    url:{//请求地址
      type:String,
      default:""
    }
  },
  data() {
    return {
      showInfoText:''
    };
  },
  methods: {
     // 查询信息
    async getInfo() {
      let _url = "";
      let _params = {};
      if(this.business == "sendRecord"){
        _url = this.url;
        _params = {
          batchId:this.backupId,
          patientId:this.id
        }
      }else{
        _url =  `${this.url}?id=${this.id}`
      }
      
      const result = await this.$requestPost(
        //`${this.url}?id=${this.id}`,
        _url,
        _params
      );
      if (result && result.code === 200) {
        if (this.type == "手机号") {
          if(this.business == "business"||this.business == "sendRecord"){// 默认业务场景的取值
            this.showInfoText = result.data?.phone||result.data?.mobile;
          }else if(this.business == "orderList"){// 订单的取值不一样，所以要分开
            let _data = result.data?.orderPackageDTO
            this.showInfoText = _data?.patient?.mobile;
          }
           
        } else if (this.type == "身份证号") {
          if(this.business == "business"){// 默认业务场景的取值
            this.showInfoText = result.data?.idCard;
          }else if(this.business == "orderList"){// 订单的取值不一样，所以要分开
            let _data = result.data?.orderPackageDTO
            this.showInfoText = _data?.patient?.idCard;
          }
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.phone-icons{
  margin-left: 5px;
  cursor: pointer;
}
</style>