<template>
  <div class="pa-schedule-item">
    <div class="top">
        <!-- <div class="times">
            
            <i class="dot" /><div class="times-content">{{itemData.times}}</div>
        </div> -->
        <!-- 第{{itemData.times}}次产检 -->
        <el-tooltip :content="itemData.times" placement="top" :disabled="isDisabledTooltip" popper-class="follow-tooltip">
          <div class="test test-box times-content" @mouseover="onMouseOver(itemData.id)">
            <div class="dot"></div><span class="content" :id="`tooltip${itemData.id}`">{{itemData.times}}</span>
          </div>
        </el-tooltip>
        <div class="weeks">
            （孕{{itemData.gestationWeek}}周）
        </div>
        <div class="next" v-if="itemData.next">
            下次产检
        </div>
    </div>
    <div class="middle">
        <div class="notice" v-if="itemData.notice">
            关注重点：<span class="switch-line">{{itemData.notice}}</span>
            
        </div>
    </div>
    <div class="bottom">
        <div>
            {{ itemData.date.slice(0,10) }} {{ itemData.date | getWeekday }}
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FormItem',
  props: {
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
        isDisabledTooltip: true
    }
  },
  created() {
    console.log("created", this.itemData)
  },
  mounted() {},
  methods: {
    onMouseOver(id) {
      console.log("onMouseOver")
      const contentWidth = document.getElementById(`tooltip${id}`).offsetWidth
      const parentWidth = document.getElementById(`tooltip${id}`).parentNode.offsetWidth
      console.log("onMouseOver", contentWidth, parentWidth)
      // console.log(id, parentWidth, contentWidth)
      // 判断是否禁用tooltip功能
      this.isDisabledTooltip = contentWidth <= 110
    },
  }
}
</script>
<style scoped>
.times{
    height: 22px;
    opacity: 1;
    font-size: 16px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 22px;
    display: flex;
    align-items: center;
}

.times-content{
    max-width: 110px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 16px;
}

.content:before{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 8px;
    background-color: #06c;
}

.content{
    color:#333;
}

.weeks{
    width:90px;
    font-size: 16px;
    color:#333;
}

.top{
    margin-top: 10px;
    display: flex;
    align-items: center;
}
.pa-schedule-item{
    width: 305px;
    opacity: 1;
    background: #ffffff;
    border: 1px solid #ebebeb;
    padding:8px 16px 8px 16px;
}
.next{
    width: 78px;
    height: 24px;
    opacity: 1;
    background: rgba(242,99,52,0.10);
    border-radius: 14px;
    font-weight: 400;
    line-height: 24px;
    color: #f26334;
    text-align: center;
    font-size: 12px;
}

.middle{
    margin-top: 4px;
    margin-bottom: 16px;
    padding-left:10px;
}

.notice{
    flex-grow: 1;
    font-size: 14px;
    color: #333;
}

.bottom{
    padding-top:8px;
    border-top:1px solid #ebebeb;
    font-size: 12px;
    color: #999999;
}

.dot{
    width: 5px;
    height: 5px;
    border-radius: 50%;
    margin-right: 4px;
    background-color: #06c;
    display: inline-block;
    position: relative;
    top: -2px;
}

.dot-cnt{
    display: flex;
}
.switch-line{
    word-wrap: break-word;
    word-break: break-word;
    white-space: pre-line;
}
</style>
