<template>
  <div class="blood-sugar-table">
    <div class="label-warp" v-if="labelPostion == 'top'">
      <slot name="label-before" />
      <div class="label">
        <span class="low">偏低</span>
        <span class="height">偏高</span>
      </div>
    </div>
    <el-table
      class="table-container pa-table pa-table-table-container"
      :data="tableList"
      border
      :cell-class-name="tableCellClass"
      :fit="false"
    >
      <el-table-column
        :label="item.label"
        :align="item.align"
        v-for="(item, index) in tableColoumn"
        :key="index"
        :prop="item.prop"
        :label-class-name="item.range"
        :resizable="false"
      >
        <!-- 有子集 -->
        <template v-if="item.children">
          <el-table-column
            :label="itemChildren.label"
            :align="itemChildren.align"
            :prop="itemChildren.prop"
            v-for="(itemChildren, indexChildren) in item.children"
            :key="indexChildren"
            :label-class-name="itemChildren.range"
            :resizable="false"
          >
            <template slot-scope="scope">
              <el-tooltip
                :disabled="tooltipHide"
                class="item"
                effect="dark"
                :content="item.label+itemChildren.label+'：'+itemChildren.range"
                placement="top"
              >
                <span v-if="!tooltipHide">
                  {{scope.row[itemChildren.prop]}}
                </span>
              </el-tooltip>
              <span v-if="tooltipHide">{{ scope.row[itemChildren.prop] }}</span>
            </template>
          </el-table-column>
        </template>
        <!-- 无子集 -->
        <template v-if="!item.children" slot-scope="scope">
          <el-tooltip
            :disabled="false"
            class="item"
            effect="dark"
            :content="item.prop === 'recordTime' ? item.label+'：'+ scope.row[item.prop] : item.label+'：'+ item.range"
            placement="top"
          >
            <span v-if="!tooltipHide">{{ scope.row[item.prop] }}</span>
          </el-tooltip>
          <span v-if="tooltipHide">{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="label-warp" v-if="labelPostion == 'bottom'">
      <slot name="label-before" />
      <div class="label">
        <span class="low">偏低</span>
        <span class="height">偏高</span>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "BloodSugarTable",
  props: {
    // 标签显示位置，值为top、bottom;
    labelPostion: {
      type: String,
      default: "top",
    },
    // 是否显示tooltip
    tooltipHide: {
      type: Boolean,
      default: false,
    },
    // table数据
    tableData: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      tableColoumn: [
        {
          label: "日期",
          prop: "recordTime",
          align: "center",
        },
        {
          label: "凌晨",
          prop: "BEFORE_DAWM",
          range:'4.4-6.7',
          align: "center",
        },
        {
          label: "早餐",
          align: "center",
          children: [
            {
              label: "前",
              prop: "BEFORE_BREAKFAST",
              range:'3.3-5.3',
              align: "center",
            },
            {
              label: "后",
              prop: "AFTER_BREAKFAST",
              range:'4.4-7.8',
              align: "center",
            },
          ],
        },
        {
          label: "午餐",
          align: "center",
          children: [
            {
              label: "前",
              prop: "BEFORE_LUNCH",
              range:'4.4-6.7',
              align: "center",
            },
            {
              label: "后",
              prop: "AFTER_LUNCH",
              range:'4.4-7.8',
              align: "center",
            },
          ],
        },
        {
          label: "晚餐",
          align: "center",
          children: [
            {
              label: "前",
              prop: "BEFORE_DINNER",
              range:'4.4-6.7',
              align: "center",
            },
            {
              label: "后",
              prop: "AFTER_DINNER",
              range:'4.4-7.8',
              align: "center",
            },
          ],
        },
        {
          label: "睡前",
          prop: "BEFORE_SLEEP",
          range:'4.4-6.7',
          align: "center",
        },
      ],
      tableList: []
    };
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      let list = []
      const options = this.tableData[0]
      for (let key in options) {
        let obj = {}
        for (let item of options[key]) {
          obj[item.sugarType] = item.sugarValue
        }
        obj.recordTime = this.$dayjs(key).format('MM-DD') // 记录时间
        list.push(obj)
      }
      this.tableList = list
    },

    // 分页器方法
    sizeChange(val) {
      this.pagination.pageSize = val;
      this.$emit("size-change", this.pagination);
    },

    currentChange(val) {
      this.pagination.pageNo = val;
      this.$emit("current-change", this.pagination);
    },
    
    // 单元格样式
    tableCellClass({ row, column, rowIndex, columnIndex }) {
      let min = 0
      let max = 0
      if (column.labelClassName) {
        min = column.labelClassName.split('-')[0]
        max = column.labelClassName.split('-')[1]
      }
      if (columnIndex > 0) {
        if (row[column.property] && column.labelClassName&& Number(row[column.property]) < min) {
          return "blood-low-style";
        } else if ( row[column.property] && column.labelClassName && Number(row[column.property]) > max) {
          return "blood-height-style";
        }
      }
      return "";
    },
  },
  watch: {
    tableData (n, o) {
      this.init()
    }
  }
};
</script>
<style lang="scss" scoped>
$lowColor: #faad14;
$heightColor: #ef4f3c;
.blood-sugar-table {
  .label-warp {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }
  .label {
    display: flex;
    align-items: center;
    .low,
    .height {
      font-size: 12px;
      // font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      color: #666666;
      &::before {
        display: inline-block;
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 50%;
        margin-right: 4px;
        vertical-align: calc(1px);
      }
    }
    .low {
      margin-right: 8px;
      &::before {
        background-color: $heightColor;
      }
    }
    .height {
      &::before {
        background-color: $lowColor;
      }
    }
  }
}
::v-deep.table-container {
  .blood-height-style {
    background-color: rgba(250, 173, 20, 0.15) !important;
    color: $lowColor !important;
  }
  .blood-low-style {
    background-color: rgba(242, 99, 52, 0.15) !important;
    color: $heightColor !important;
  }
}
::v-deep.pa-pagination {
  position: static;
  padding: 0px;
  .pa-pagination-box {
    padding: 0px;
  }
}
::v-deep.el-table {
  border: 1px solid #ebebeb;
  border-right: none;
  border-bottom: none;
  .el-table__header-wrapper th.el-table__cell {
    font-size: 12px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    border-bottom: 1px solid #ebebeb;
    .cell{
      padding: 0 24px;
    }
  }
  .el-table__cell {
    border-right: 1px solid #ebebeb;
    border-bottom: 1px solid #ebebeb;
  }
  thead.is-group{
    th{
      height: 32px !important;
    }
  }
}
</style>