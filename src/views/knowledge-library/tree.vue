<template>
  <div>
    <el-dialog
      title="确认要删除此项吗？"
      :visible.sync="delDialogVisible"
      width="30%"
      :append-to-body="true"
    >
      <span slot="footer">
        <el-button size="small" @click="delDialogVisible = false">
          取 消
        </el-button>
        <el-button size="small" type="primary" @click="delSelect">
          确 定
        </el-button>
      </span>
    </el-dialog>

    <el-card>
      <div class="ly-tree-container">
        <el-tree
          ref="tree"
          node-key="id"
          :data="treeData"
          :props="defaultProps"
          :default-expanded-keys="idExpanded"
          highlight-current
          :render-content="renderContent"
          icon-class="iconfont icon-s_shouqi"
          :current-node-key="currentNodeKey"
          @node-click="handleNodeClick"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
/* 
*说明：与患者标签逻辑一致，因为接口不一致所以复制了一份，后期需要抽离公用；
*
 */
import {
  labelTypeQuery,
  labelTypeDelete,
  labelTypeInsert,
  labelTypeUpdate
} from "@/api/knowledge";
import { getEditContent, getDefaultContent } from "@/utils/tree.utils.js";

import "@/assets/css/tree.scss";
export default {
  name: "LyTree",
  data() {
    return {
      node: {},
      treeData: [],
      isEdit: false,
      edit_name: "",
      is_superuser: "False",
      defaultProps: {
        children: "child",
        label: "name"
      },
      select_id: null,
      select_level: null,
      select_node: null,
      delDialogVisible: false,
      currentNodeKey: null,
      addName: null,
      addFlag: false, // 判断是否是添加状态
      idExpanded: []
    };
  },

  created() {
    this.refresh();
  },

  methods: {
    handleNodeClick(data) {
      this.node = data;
      this.$emit("updateNodeInfo", data);
    },
    getTreeData(tempData, parentId) {
      const treeData = [];
      tempData.forEach(item => {
        if (item.parentId === parentId) {
          treeData.push({
            id: item.id,
            parentId: item.parentId,
            level: item.level,
            name: item.typeName,
            $treeNodeId: item.id,
            child: this.getTreeData(tempData, item.id)
          });
        }
      });
      return treeData;
    },
    refresh() {
      const data = {
        //parentId:0,
        pageNo: 1,
        pageSize: 1000
      };

      labelTypeQuery(data).then(res => {
        console.log('labelTypeQuery',res)
        let _data = JSON.parse(JSON.stringify(res));
        this.is_superuser = true;
        const textArr = (_data.data.rows || []).filter(item => item.level <= 1);
        this.idExpanded = textArr.map(item => item.id);
        this.idExpanded.unshift(0);
        this.treeData = this.getTreeData(res.data.rows, 0); // 获取层次为1的数组
        let _filterEditorName = _data.data.rows.filter(item => {
          return item.typeName == this.addName;
        });
        if (_filterEditorName && _filterEditorName[0]?.id) {
          this.currentNodeKey = _filterEditorName[0].id;
        } else {
          this.currentNodeKey = this.treeData[0].id;
        }
        this.$emit("initData", {
          data: res.data.rows,
          treeData: this.treeData,
          editorName: _filterEditorName
        });
        this.$nextTick(() => {
          this.$refs.tree.setCurrentKey(this.currentNodeKey);
        });
      });
    },

    append(node, data, e) {
      // 展开父节点
      node.expanded = true;
      // console.log(node);
      e = event || window.event;
      e.stopPropagation();
      if (!this.isEdit) {
        this.select_id = data.id;
        this.edit_name = "";
        const newChild = {
          name: "",
          parentId: data.id,
          level: data.level + 1,
          isEdit: true
        };
        this.isEdit = true;
        if (!data.child) {
          this.$set(data, "child", []);
        }
        data.child.unshift(newChild);
      } else {
        this.$message({
          type: "error",
          title: "操作提示",
          message: "有正在编辑或添加的选项未完成！",
          duration: 2000
        });
      }
    },

    remove(node, data, e) {
      e = event || window.event;
      e.stopPropagation();
      if (this.isEdit) {
        this.$message({
          type: "error",
          title: "操作提示",
          message: "有正在编辑或添加的选项未完成！",
          duration: 2000
        });
        return;
      }
      this.select_node = node;
      // 如果当前分类下有标签或分类弹出“该分类下有子分类，不可删除！
      if (node.childNodes.length) {
        this.$message({
          type: "error",
          message: "该分类下有子分类，不可删除！",
          duration: 2000
        });
        return;
      }
      const vm = this;
      // this.delDialogVisible = true
      // 弹出删除确认
      this.$confirm(`是否确定删除【${node.label}】?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        vm.delSelect();
      });
    },

    delSelect() {
      // labelTypeDelete(this.treeData, { id: this.select_node.data.id })
      labelTypeDelete({ id: this.select_node.data.id })
        .then(res => {
          this.refresh();
          this.delDialogVisible = false;
          this.$message({
            type: "success",
            title: "操作提示",
            message: "删除成功!",
            duration: 2000
          });
        })
        .catch(error => {
          this.delDialogVisible = false;
        });
    },

    update(node, data, e) {
      e = event || window.event;
      e.stopPropagation();
      if (this.isEdit) {
        this.$message({
          type: "error",
          title: "操作提示",
          message: "有正在编辑或添加的选项未完成！",
          duration: 2000
        });
        return;
      }
      this.select_id = data.id;
      this.select_level = data.level;
      this.edit_name = data.name;
      this.isEdit = true;
    },

    editMsg(data, node, e) {
      e = event || window.event;
      e.stopPropagation();
      const nodeName = this.edit_name.trim();
      if (!nodeName) {
        this.$message({
          type: "error",
          message: "分类名称不能为空",
          duration: 2000
        });
        return;
      }
      const reg = /^[a-zA-Z0-9\u4e00-\u9fa5]*$/g;
      if (!reg.test(nodeName)) {
        this.$message({
          type: "error",
          message: "分类名称只能是中英文数字",
          duration: 2000
        });
        return;
      }
      //  同级标签分类不能重名
      // console.log(node);
      const siblingNodes = node.parent.childNodes;
      // console.log(siblingNodes);
      const isNodeNameRepeated = siblingNodes.some(item => {
        return item.data.id !== data.id && item.data.name === nodeName;
      });
      // console.log(isNodeNameRepeated);
      if (isNodeNameRepeated) {
        this.$message({
          type: "error",
          message: "同一个分类下的名称不可重复",
          duration: 2000
        });
        return;
      }
      if (!data.id) {
        // 新增
        const virtualNode = node.parent;
        const params = {
          typeName: this.edit_name,
          parentId: data.parentId,
          level: data.level,
          id: virtualNode.data.id
        };
        const addChild = labelTypeInsert(params).then(res => {
          this.addName = params.typeName;
          this.refresh(); // TODO: 看能不能优化不重新拿数据

          //
          // 如果是用的真api,需要在添加的接口返回添加的节点
          // 添加成功后，将返回的节点加入数据中，然后删除掉没有id的假节点
          virtualNode.data.child.forEach((item, i) => {
            if (!item.id) {
              virtualNode.data.child.splice(i, 1);
            }
          });
          this.isEdit = false;
          this.select_id = null;
          this.select_level = null;
          this.$message({
            type: "success",
            title: "操作提示",
            message: "添加成功！",
            duration: 2000
          });
        });
        return;
      }

      const params = {
        typeName: this.edit_name,
        parentId: data.parentId,
        level: data.level,
        id: data.id
      };

      labelTypeUpdate(params).then(res => {
        // this.treeData = this.getTreeData(res.data.rows)
        data.name = this.edit_name;
        this.isEdit = false;
        this.select_id = null;
        this.select_level = null;
        this.$message({
          type: "success",
          title: "操作提示",
          message: "编辑成功！",
          duration: 2000
        });
      });
    },

    close(data, node, e) {
      e = event || window.event;
      e.stopPropagation();
      if (!data.id) {
        node.parent.data.child.forEach((item, i) => {
          if (!item.id) {
            node.parent.data.child.splice(i, 1);
          }
        });
      }
      this.select_id = null;
      this.select_level = null;
      this.edit_name = data.name;
      this.isEdit = false;
    },

    nameChange(e) {
      e = event || window.event;
      e.stopPropagation();
      this.edit_name = e.target.value;
    },

    isSelect(data) {
      return data.id === this.select_id && data.level === this.select_level;
    },

    renderContent(h, { node, data }) {
      return (
        <span class="ly-tree-node">
          {(this.isEdit === true && this.isSelect(data)) || data.isEdit ? (
            <input
              placeholder="名称不能为空"
              class="ly-edit__text"
              maxLength="10"
              on-keyup={() => this.nameChange()}
              value={this.edit_name}
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <span>
              {data.name.length < 7 ? (
                <span class="ly-name-txt">{data.name}</span>
              ) : (
                <el-tooltip class="item" effect="dark" placement="top">
                  <span slot="content">{data.name}</span>
                  <span class="ly-name-txt">
                    {data.name.substring(0, 6) + "..."}
                  </span>
                </el-tooltip>
              )}
            </span>
          )}
          {(this.isEdit === true && this.isSelect(data)) || data.isEdit
            ? getEditContent.call(this, h, data, node)
            : getDefaultContent.call(this, h, data, node)}
        </span>
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.iconfont {
  color: #0066cc;
  font-size: 14px;
}
::v-deep .ly-tree-node {
  display: flex;
  justify-content: space-between;
  .ly-name-txt {
    font-size: 14px;
    color: #333333;
  }
  .ly-visible {
    margin-left: 8px;
    i {
      margin-right: 8px;
      font-size: 18px;
      color: #0066cc;
    }
  }
}
// ::v-deep .ly-visible {
//   margin-left: 2px;
//   span {
//     i {
//       color: #0066cc;
//       margin-right: 8px;
//     }
//   }
// }
</style>
