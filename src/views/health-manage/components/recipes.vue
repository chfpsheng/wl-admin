<template>
  <el-table
    class="table-contianer"
    :header-cell-class-name="tableHeaderCellClass"
    :data="tableData"
    border
    style="width: 100%"
  >
    <el-table-column
      :prop="item.prop"
      :label="item.label"
      v-for="(item, index) in tableColoumn"
      :key="index"
      :width="index == 0 ? '52' : ''"
      :class-name="index == 0 ? 'frist-coloumn' : ''"
    >
      <template slot-scope="scope">
        <el-input
          class="cell"
          v-if="index > 0"
          type="textarea"
          placeholder="请输入内容"
          v-model="scope.row[item.prop]"
          maxlength="50"
          :rows="4"
          show-word-limit
        />
        <span v-else>{{ scope.row[item.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "Recipes",
  props: {
    // table数据
    foodData: {
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
          label: "",
          prop: "title",
        },
        {
          label: "周一",
          prop: "mon",
        },
        {
          label: "周二",
          prop: "tue",
        },
        {
          label: "周三",
          prop: "wed",
        },
        {
          label: "周四",
          prop: "thu",
        },
        {
          label: "周五",
          prop: "fri",
        },
        {
          label: "周六",
          prop: "sat",
        },
        {
          label: "周日",
          prop: "sun",
        },
      ],
      types: [
        {
          title: "早餐",
          freCode: '1'
        },
        {
          title: "早点",
          freCode: '2',
          limit: 30
        },
        {
          title: "午餐",
          freCode: '3'
        },
        {
          title: "午点",
          freCode: '4',
          limit: 30
        },
        {
          title: "晚餐",
          freCode: '5'
        },
        {
          title: "晚点",
          freCode: '6',
          limit: 30
        },
      ],
      tableData: []
    };
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.types.forEach(item => {
        let obj = {}
        for (let food of this.foodData) {
          // 对应餐类型
          if (item.freCode === food.freCode) {
            obj = food
          }
        }
        // 合并餐类型对象
        item = Object.assign(item, obj)
      })
      this.tableData = JSON.parse(JSON.stringify(this.types))
    },

    catchFood () {
      return this.tableData
    },

    tableHeaderCellClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "frist-row";
      }
      return "";
    },
  },
  watch: {
    foodData (n, o) {
      this.init()
    } 
  }
};
</script>
<style lang="scss" scoped>
::v-deep.table-contianer {
  .frist-coloumn,
  .frist-row {
    background-color: #f7f9fc;
    font-size: 14px;
    // font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
  }
  tbody {
    tr:hover td {
      background-color: unset !important;
      &:nth-child(1) {
        background-color: #f7f9fc !important;
      }
    }
  }
}
::v-deep.el-table_1_column_1.frist-coloumn.el-table__cell {
  background-color: #ebebeb;
}
::v-deep.el-table{
  td .cell{
    padding: 0;
  }
  td{
    padding: 0;
  }
}
::v-deep .el-textarea__inner{
  border: 0;
  padding: 8px;
}
</style>