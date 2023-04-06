import Vue from "vue";
import OriginSidelip from "./index.vue";

class Sidelip {
  constructor(component = {}, option = {}, callback) {
    this.callback = callback;
    option.on = option.on || {};
    option.on['Close'] = data => {
      setTimeout(() => {
        !!callback && callback(data);
        this.pageInstance.close()
      }, 0);
    }

    this.instance = new Vue({
      el: document.createElement("div"),
      render: function(h) {
        return h(OriginSidelip, [h(component, option, this.$slots.default)])
      }
    })

    this.pageInstance = this.instance.$children[0];
    this.pageInstance.callback = callback

    let global = {};
    // 外部关闭，不执行回调
    global.close = () => {
      this.pageInstance.close()
    }

    document.body.appendChild(this.instance.$el);

    return global;
  }
}

export default Sidelip;
