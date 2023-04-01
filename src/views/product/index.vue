<template>
  <div>aaaa</div>
</template>
<script>
export default {
  name: "LabelSelectT",

  data() {
    return {
      visible: false,
      tableHeight: "",
      dialogType: "",
      item: {
        id: "",
        name: "",
        seq: "",
        note: "",
        metadataId: "",
        parentId: "",
        parentName: "",
        sortLevel: "",
      },
      listLoading: false, // 列表加载中
      tableData: [
        {
          id: 1,
          seq: 1,
          name: "产品分类1",
          note: "note",
        },
        {
          id: 2,
          seq: 2,
          name: "产品分类2",
          note: "note",
        },
        {
          id: 3,
          seq: 2,
          name: "智慧工业",
          note: "note",
          children: [
            {
              id: 31,
              date: "2016-05-01",
              name: "生活区域",
              note: "note",
            },
            {
              id: 32,
              date: "2016-05-01",
              name: "生产区域",
              note: "note",
            },
          ],
        },
      ],
    };
  },
  mounted() {
    this.getList();
    // this.$nextTick(() => {
    //   this.tableHeight = this.$computeHeight(216);
    // });
    // window.onresize = () => {
    //   this.tableHeight = this.$computeHeight(216);
    // };
  },
  destroyed() {
    window.onresize = null;
  },
  methods: {
    closeDialog() {
      this.visible = false;
    },
    deleteItem(row) {
      console.log("deleteItem", row);
      let id = row.id;
      deleteType(id).then((res) => {
        console.log(res);
        this.getList();
      });
    },
    editItem(row) {
      this.dialogType = "edit";
      console.log("edit", row);
      //   this.item = row;
      this.item = { ...row };

      this.visible = true;
      this.$session.set("employeeItem", this.item);
      console.log("edit", this.item);
    },
    addItem(row) {
      this.dialogType = "add";
      console.log("add", row);
      if (row) {
        //编辑
        this.item.parentId = row.id;
        this.item.sortLevel = row.sortLevel;
      } else {
        this.item.parentId = "";
        this.item.sortLevel = 1;
      }
      this.visible = true;
      console.log("add", this.item);
    },
    getList() {
      this.listLoading = false;
      this.visible = false;
      const params = {};
      getProductTypeList({}).then((res) => {
        console.log(res);
        this.listLoading = false;
        this.tableData = res.data;
      });
    },
  },
};
</script>