export function getEditContent(h, data, node) {
  // console.log('getEditContent')
  const self = this
  return (
    <span class='ly-visible'>
      <i class='iconfont icon-xuanzhongiconbeifen icon-right iconsize'
        on-click={ () => self.editMsg(data, node) }
      ></i>
      <i class='iconfont icon-guanbiicon icon-error iconsize'
        on-click={ () => self.close(data, node) }
      ></i>
    </span>
  )
}

export function getDefaultContent(h, data, node) {
  // console.log('getDefaultContent')
  const self = this
  return (
    <div class='ly-visible'>
      {
        self.is_superuser &&
        (<span>
          {
            data.level < 4 && data.level !== null &&
            <i class='iconfont icon-s_tianjia icon-right' on-click={ () => self.append(node, data) }></i>
          }

          {
            data.level >1 &&
            <i class='iconfont icon-s_xiugai icon-right' on-click={ () => self.update(node, data) }></i>
          }

          {
            data.level >1 &&
            <i class='iconfont icon-s_shanchu1' on-click={ () => self.remove(node, data) }></i>
          }
        </span>)
      }
    </div>
  )
}
