<template>
  <div class="pa-schedule-item">
    <div v-for="(item, index) in itemData" :key="index">
        <div  class="list-item" :class="item.taskStatus === 1 ? 'finished' : (item.taskStatus === 0 ? 'ing' : 'expired') ">
            <!-- <div class="prefix">
            </div> -->
            <div class="status">
                <i class="dot" /><div>{{item.taskStatus === 1 ? '已完成' : ( item.taskStatus === 0 ? '待办' : '已过期')}}</div>
            </div>
            <div class="content">
                {{item.taskName}}:{{item.taskContent}}
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisitTaskList',
  props: {
    itemData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {},
  methods: {}
}
</script>
<style scoped>
.list-item{
    display: flex;
    margin-bottom: 16px;
    align-items: flex-start;
}

.finished .status{
    color: #999999;
}

.finished .content{
    color: #666666;
}

.ing .status{
    color: #0066cc;
}

.ing .content{
    color: #333333;
}

.expired .status{
    color: #F26334;
}

.expired .content{
    color: #F26334;
}

.status{
    width:60px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
}

.content{
    font-size: 14px;
    font-weight: 400;
    text-align: left;
    color: #333333;
    line-height: 22px;
    width:209px;
    word-break: break-all;
    flex-grow: 1;
    /* overflow: hidden;
    text-overflow: ellipsis; 
    white-space: nowrap;*/
}

.dot{
    width: 6px;
    height: 6px;
    border-radius: 50%;
    margin-right: 4px;
    background-color: #06c;
}

.finished  .dot{
    background-color: #999999;
}

.expired  .dot{
    background-color: #F26334;
}
</style>
