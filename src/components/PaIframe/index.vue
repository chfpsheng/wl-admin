<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    width="500px"
    class="abow_dialog"
  >
    <!-- v-loading="loading" -->
    <div class="iframe-box">
      <!-- 价格 -->
      <!-- 轮播 -->
      <div v-if="isPosterImgs">
        <el-carousel height="395px" arrow="never" :autoplay="false">
          <el-carousel-item v-for="(item,index) in detail.posterImgs" :key="index" indicator-position="none">
            <div  class="progressive">
              <img class="rotation preview " :ref="'imgRef'+index" v-progressive="item" :src="item+'?imageMogr2/quality/50'" alt="">
              <!-- @load="imgLoad(index)" -->
            </div>
            
          </el-carousel-item>
        </el-carousel>
      </div>
      <div v-else class="service-is-deleted">
        <img src="../../assets/image/service-unonline.png" alt="">
      </div>
      <section class="middle-content">
        <div class="product-name">{{ detail.name }}</div>
        <!-- 多规格 -->
        <div v-show="specList.length > 1" class="price">
          <!-- ¥  -->
          <div class="disacount">
            &yen;
            <span v-if="detail.minCurrentPrice!==detail.maxCurrentPrice" class="current-price">
              {{ detail.minCurrentPrice | amount }}-{{ detail.maxCurrentPrice | amount }}
            </span>
            <span v-else class="current-price">
              {{ detail.minCurrentPrice | amount }}
            </span>
          </div>
          <div class="origin">
            <span>原价:</span><span class="original-price">
              {{ detail.minOriginalPrice | amount }}
            </span>
          </div>
        </div>
        <div v-show="specList.length <= 1" class="price">
          <!-- ¥  -->
          <div class="disacount">
            &yen;
            <span class="current-price">
              {{ detail.currentPrice | amount }}
            </span>
          </div>
          <div class="origin">
            <span>原价:</span><span class="original-price">
              {{ detail.originalPrice | amount }}
            </span>
          </div>
        </div>

      </section>
      <!-- 医院名称 -->
      <div class="hospital-thumb">
        <img src="../../assets/image/hospital-thumb.png" alt="">
      </div>
      <!-- 医院详情 -->
      <!-- <div class="item-cnt product-detail-details">
        <img src="http://oss.paglobalphysicians.com/ab1bff417aae490fa595d2b4ab3ba685.jpg" alt="">
      </div> -->
      <div class="item-cnt html-content" v-html="$xss(detail.detail)" />
      <div v-if="detail.buyAttention" class="middle-content">
        <div class="remark-title">购买须知</div>
        <div class="item-cnt html-content"> {{detail.buyAttention}} </div>
      </div>
      <!-- <div style="width:375px;height:70px"></div> -->
      <!-- <div class="bottom-fix">
         <div class="icon-left">
            <img :src="myIcon" alt="" class="icon">
            <div>我的服务</div>
         </div>
         <div class="icon-left">
            <img :src="shareIcon" alt="" class="icon">
            <div>分享</div>
         </div>
         <div class="fix-buy">
           立即购买
         </div>
      </div> -->

      <!-- <div class="custom">
        <div class="custom-content">
          <div class="img-cnt"><img src="img/cutomer2.44afe3bd.png"></div>
          <div>服务咨询</div>
        </div>
      </div> -->

    </div>
  </el-dialog>
</template>
<script>
import shareIcon from '../../assets/image/share.png'
import myIcon from '../../assets/image/my.png'
// import { Swiper, SwiperSlide } from 'swiper/vue'
// Import Swiper styles
// import 'swiper/swiper.scss'
export default {
  name: 'PaIframe',
  props: {
    specList: {
      type: Array,
      default: () => ([])
    },
    detail: {
      type: Object,
      default: () => ({})
    },
    title: {
      type: String,
      default: '详情预览'
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      loading: true,
      shareIcon,
      myIcon
    }
  },
  computed: {
    isPosterImgs() {
      if (this.detail && this.detail.posterImgs && this.detail.posterImgs.length) {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    visible: {
      handler(val) {
        this.dialogVisible = val
      },
      immediate: true
    },
    dialogVisible: {
      handler(val) {
        this.$emit('update:visible', val)
      },
      immediate: true
    }
  },
  mounted() {
   
  },
  methods: {
    imgLoad(index){
      let _width = this.$refs[`imgRef${index}`][0]?.naturalWidth;
      let _height = this.$refs[`imgRef${index}`][0]?.naturalHeight;
      if(_width&&_height&&_width>_height){
        this.$refs[`imgRef${index}`][0].width = 500;
      }else if(_width&&_height&&_height>_width){
        this.$refs[`imgRef${index}`][0].height = 395;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import url(./index.scss);
.el-carousel{
  height: unset !important
}
::v-deep.el-carousel__item {
  display: flex;
  justify-content: center;
  padding: unset !important;
  background-color: #fff !important;
}
::v-deep.abow_dialog{
  .el-dialog__body{
    height: 546px;
  }
}
::v-deep.el-carousel__item {
  padding: unset !important;
  box-sizing: unset !important
}
::v-deep.el-carousel__item div {
  float: unset !important;
  margin: unset !important;
  width: unset !important;
  height: unset !important;
  cursor: pointer;
}
::v-deep.el-carousel__item div img {
  width: unset !important;
  height: 395px !important;
  margin: unset !important;
}
::v-deep.html-content.item-cnt{
  p{
    img{
      display: inherit;
    }
  }
}
</style>
