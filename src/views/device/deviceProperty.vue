<template>
  <div class="profile-set-manage searchAdapt-OneTwo" ref="tableParentBox">
    <el-table
      :columns="columns"
      :data="data"
      ref="table"
      :height="tableHeight"
    ></el-table>
  </div>
</template>
<script>
import { deviceApi } from "@/api/device.js";
import ElementResizeDetectorMaker from "element-resize-detector";

export default {
  props: {
    id: {
      type: String,
      default() {
        return "";
      },
    },
  },
  data() {
    return {
      tableHeight: undefined, // 表格高度
      erd: undefined, // 自适应对象
      data: [],
      columns: [
        {
          title: "厂家编码",
          key: "factoryCode",
          sortable: "custom",
          align: "left",
          width: 120,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.factoryCode,
                },
              },
              params.row.factoryCode
            );
          },
        },
        {
          title: "设备编码",
          key: "ecsDeviceId",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.ecsDeviceId,
                },
              },
              params.row.ecsDeviceId
            );
          },
        },
        {
          title: "标签名称",
          key: "labelName",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.labelName,
                },
              },
              params.row.labelName
            );
          },
        },
        {
          title: "标签值",
          key: "labelValue",
          sortable: "custom",
          align: "left",
          width: 250,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.labelValue,
                },
              },
              params.row.labelValue
            );
          },
        },
        {
          title: "标签描述",
          key: "chineseDesc",
          sortable: "custom",
          align: "left",
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.chineseDesc,
                },
              },
              params.row.chineseDesc
            );
          },
        },
        {
          title: "创建人",
          key: "createUserName",
          sortable: "custom",
          align: "left",
          width: 120,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.createUserName,
                },
              },
              params.row.createUserName
            );
          },
        },
        {
          title: "创建时间",
          key: "createTime",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.createTime
                    ? new Date(params.row.createTime).Format(
                        "yyyy-MM-dd hh:mm:ss"
                      )
                    : "",
                },
              },
              params.row.createTime
                ? new Date(params.row.createTime).Format("yyyy-MM-dd hh:mm:ss")
                : ""
            );
          },
        },
        {
          title: "更新人",
          key: "updateUserName",
          sortable: "custom",
          align: "left",
          width: 120,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.updateUserName,
                },
              },
              params.row.updateUserName
            );
          },
        },
        {
          title: "更新时间",
          key: "updateTime",
          sortable: "custom",
          align: "left",
          width: 150,
          render: (h, params) => {
            return h(
              "div",
              {
                attrs: {
                  class: "ivu-table-cell-ellipsis",
                  title: params.row.updateTime
                    ? new Date(params.row.updateTime).Format(
                        "yyyy-MM-dd hh:mm:ss"
                      )
                    : "",
                },
              },
              params.row.updateTime
                ? new Date(params.row.updateTime).Format("yyyy-MM-dd hh:mm:ss")
                : ""
            );
          },
        },
      ],
    };
  },
  mounted() {
    this.init();
    window.addEventListener("resize", this.setTableScroll);
    this.erd.listenTo(this.$refs.tableParentBox, (element) => {
      this.setTableScroll();
    });
    this.setTableScroll();
  },
  created: function () {
    this.erd = ElementResizeDetectorMaker();
  },
  destroyed() {
    window.removeEventListener("resize", this.setTableScroll);
    this.erd.uninstall(this.$refs.tableParentBox);
    this.erd = undefined;
  },
  methods: {
    // 设置表格内滚动
    setTableScroll() {
      // 父级元素
      const parentNode = this.$refs["tableParentBox"].parentElement;
      // 设置最大表格高度
      this.tableHeight = parentNode.clientHeight - 20;
    },
    init() {
      this.$emit("SetTitle", "设备属性");
      this.$emit("SetPageWidth", 800);
      this.$emit("SetPageActions", [
        {
          text: "取消",
          theme: "default",
          handle: () => {
            this.$emit("Close");
          },
        },
      ]);
      if (this.id) {
        deviceApi.getDevicePropertyByDeviceId(this.id).then((res) => {
          this.data = res.data;
        });
      }
    },
  },
};
</script>
