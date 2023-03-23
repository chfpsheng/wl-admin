import Vue from "vue"
import OriginPageModal from "./index.vue"

class PageModal {
  constructor(component = {}, option = {}, callback, modalOpt={}) {
    option.on = option.on || {}
    option.on["SetTitle"] = title => {
      setTimeout(() => {
        this.pageInstance.setTitle(title)
      }, 0)
    }
    option.on["SetPageActions"] = data => {
      setTimeout(() => {
        this.pageInstance.setPageActions(data)
      }, 0)
    }
    option.on["SetPageWidth"] = data => {
      setTimeout(() => {
        this.pageInstance.setWidth(data)
      }, 0)
    }
    option.on["Close"] = data => {
      setTimeout(() => {
        !!callback && callback(data)
        this.pageInstance.close()
      }, 0)
    }
    this.instance = new Vue({
      el: document.createElement("div"),
      render: function (h) {
        return h(OriginPageModal, modalOpt, [
          h(component, option, this.$slots.default)
        ])
      }
    })

    this.pageInstance = this.instance.$children[0]
    document.body.appendChild(this.instance.$el)

    let global = {}
    // 外部关闭，不执行回调
    global.close = () => {
      this.pageInstance.close()
    }
    return global
  }
}
export default PageModal
