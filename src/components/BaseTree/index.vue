<template>
  <div class="baseTree">
    <el-input
      placeholder="请输入你想搜索的内容"
      v-if="isSearch"
      v-model="searchText"
      icon="ios-search"
      class="pa-input"
      prefix-icon="iconfont icon-sousuo"
      @input="treeInputChange"
    />
    <div class="baseTreeList">
      <el-tree
        :node-key="defaultProps['id']"
        :props="defaultProps"
        :data="data"
        :lazy="lazy"
        :load="dataOnLoad"
        :highlight-current="highlightCurrent"
        :filter-node-method="filterNode"
        :default-expanded-keys="defaultExpandedkeys"
        :expand-on-click-node="expandOnClickNode"
        @node-click="treeNodeClick"
        ref="myTree"
      >
        <span
          class="custom-tree-node tree-node-text"
          slot-scope="{ node, data }"
        >
          <i v-if="!data.children" class="el-icon-folder"></i>
          <i v-else class="el-icon-folder-opened"></i>
          <span class="nodeContent">
            <!--    <slot :node="node" :data="data" name="lefticon" /> -->

            <span class="tree-node-label" :title="node.label">{{
              node.label
            }}</span>
            <slot name="rightTools" :node="node" :data="data" />
          </span>
        </span>
      </el-tree>
    </div>
  </div>
</template>
<script>
import { Tree } from "element-ui";
export default {
  components: { Tree },
  props: {
    defaultProps: {
      type: Object,
      default: () => {
        return {
          isLeaf: "isLeaf",
          children: "children",
          label: "label",
          id: "id",
        };
      },
    },
    //是否展示搜索
    isSearch: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //是否异步加载
    lazy: {
      type: Boolean,
      default() {
        return false;
      },
    },
    data: {
      type: Array,
      default() {
        return [];
      },
    },
    //是否高亮当前选中节点
    highlightCurrent: {
      type: Boolean,
      default() {
        return true;
      },
    },
    //展开节点
    expandClick: {
      type: Boolean,
      default() {
        return true;
      },
    },
    expandOnClickNode: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //异步加载
    dataOnLoad: { type: Function },
    nodeClick: { type: Function },
    nodeExpand: { type: Function },
    nodeCollapse: { type: Function },
    //勾选的节点
    defaultCheckedKeys: {
      type: Array,
      default() {
        return [];
      },
    },
    //展开节点的id
    defaultExpandedkeys: {
      type: Array,
      default() {
        return [];
      },
    },
    //是否展示checkbox
    showCheckbox: {
      type: Boolean,
      default() {
        return false;
      },
    },
    //当前选中的节点；
    currentNodeKey: { type: String },
    //默认展示全部节点;
    defaultExpandAll: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      searchText: "",
    };
  },
  watch: {
    currentNodeKey: function (value) {
      this.$nextTick(() => {
        if (value) {
          setTimeout(() => {
            this.$refs.myTree.setCurrentKey(value);
          }, 2000);
        }
      });
    },
  },
  methods: {
    treeNodeClick(data, node, slef) {
      this.$emit("nodeClick", { data, node, slef });
    },
    searchClick(text) {
      if (!this.lazy) {
        this.$refs.myTree.filter(text);
      } else {
        this.$emit("on-enter", text);
      }
    },
    treeInputChange(text) {
      if (!this.lazy) {
        this.$refs.myTree.filter(text);
      } else {
        this.$emit("input", text);
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>
<style lang="scss" scoped>
.baseTree {
  height: 100%;
  width: 100%;
  display: flex;
  flex-grow: 1;
  -webkit-flex-grow: 1;
  -ms-flex-grow: 1;
  flex-direction: column;
  position: relative;
  ::v-deep .el-tree-node__expand-icon.is-leaf {
    //display: none !important;
    width: 20px;
  }
  ::v-deep .custom-tree-node .nodeContent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 140px;
    .tree-node-label {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .ivu-icon {
    color: #2f64f7;
    padding-right: 8px;
    font-size: 18px;
  }
  .ivu-icon-md-mail {
    color: #adb9da;
  }
  .baseTreeList {
    flex-grow: 1;
    -webkit-flex-grow: 1;
    -ms-flex-grow: 1;
    overflow-y: auto;
    overflow-x: auto;
    height: 0;
    padding-top: 6px;
  }
  .baseTreeList::-webkit-scrollbar {
    width: 4px;
  }
  .baseTreeList::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background: #eee;
  }
  .tree-node-text {
    display: flex;
    align-items: center;
    vertical-align: middle;
    height: 26px;
    overflow: hidden;
    display: flex;
  }
}
</style>
