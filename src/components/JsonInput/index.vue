<template>
  <div class="json-input">
    <!-- <Row :gutter="20" class="code-row-bg">
      <Col span="4">
      key名称
      </Col>
      <Col span="4">
      key值
      </Col>
    </Row>
    <Row :gutter="20" class="code-row-bg" v-for="(item,index) in jsonDataList" :key="index">
      <Col span="4">
      <Input v-model="item.keyName" :precision="0" style="width:100%;" />
      </Col>
      <Col span="4">
      <Input v-model="item.keyValue" :precision="0" style="width:100%;" />
      </Col>
    </Row> -->
    <Table :columns="columns1" :data="jsonDataList"></Table>
  </div>
</template>

<script>
export default {
  name: "bit-data-area",
  props: {
    jsonDataArea: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      columns1: [
        {
          title: "key名称",
          key: "keyName",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.keyName,
                size: "small",
              },
              on: {
                input: (val) => {
                  this.jsonDataList[params.index].keyName = val;
                },
              },
            });
          },
        },
        {
          title: "key值",
          key: "keyValue",
          render: (h, params) => {
            return h("Input", {
              props: {
                value: params.row.keyValue,
                size: "small",
              },
              on: {
                input: (val) => {
                  this.jsonDataList[params.index].keyValue = val;
                },
              },
            });
          },
        },
      ],
      jsonDataList: [],
      jsonData: {
        keyName: null,
        keyValue: null,
      },
    };
  },
  mounted() {
    this.init();
    if (
      this.jsonDataArea !== "" &&
      this.jsonDataArea != null &&
      this.jsonDataArea !== undefined
    ) {
      this.jsonDataList = this.convert(JSON.parse(this.jsonDataArea));
    } else {
      this.jsonDataList.push(this.jsonData);
    }
  },
  methods: {
    convert(obj) {
      let result = [];
      for (let key in obj) {
        result.push({
          keyName: key,
          keyValue: obj[key],
        });
      }
      return result;
    },
    init() {
      this.$emit("SetTitle", "编辑JSON");
      this.$emit("SetPageWidth", 600);
      this.$emit("SetPageActions", [
        {
          text: "增加一行",
          theme: "primary",
          handle: () => {
            this.addRow();
          },
        },
        {
          text: "保存",
          theme: "primary",
          handle: () => {
            this.save();
          },
        },
        {
          text: "取消",
          theme: "default",
          handle: () => {
            this.$emit("Close");
          },
        },
      ]);
    },
    onDelete(index) {
      this.jsonDataList.splice(index, 1);
    },
    addRow() {
      this.jsonDataList.push({
        keyName: "",
        keyValue: "",
      });
    },
    save() {
      let target = {};
      for (let i = 0; i < this.jsonDataList.length; i++) {
        const element = this.jsonDataList[i];
        if (element && element.keyName && element.keyValue) {
          Object.assign(
            target,
            JSON.parse(`{ "${element.keyName}": "${element.keyValue}" }`)
          );
        }
      }
      this.$emit("Close", JSON.stringify(target));
    },
  },
};
</script>
<style lang="scss">
.json-input {
  position: relative;
  .ivu-table td,
  .ivu-table th {
    border-bottom: none !important;
  }
}
</style>

