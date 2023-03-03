<template>
  <div class="wscn-http404-container">
    <div class="wscn-http404">
      <div class="pic-404">
        <img class="pic-404__parent" src="@/assets/404_images/404.png" alt="404">
      </div>
      <div class="tips">
        哎呀！你要找的页面不见啦...
      </div>
       <div class="btn-cnt">
         <el-button @click="gotoHome">返回首页</el-button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Page404',
  methods: {
    gotoHome() {
      this.$router.push({ path: '/' })
    }
  }
}

</script>
<style scoped>
.wscn-http404-container{
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100%;
}
.pic-404{
  width: 217px;
  height: 157px;
  opacity: 1;
}
.pic-404 img{
  width: 217px;
  height: 157px;
  opacity: 1;
}

.tips{
  height: 20px;
  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: center;
  color: #999999;
  line-height: 20px;
  margin-top: 16px;
}

.btn-cnt{

  opacity: 1;
  font-size: 14px;
  font-weight: 400;
  text-align: left;
  color: #333333;
  text-align: center;
  margin-top: 16px;
  display: flex;
  justify-content: center;
}

</style>

