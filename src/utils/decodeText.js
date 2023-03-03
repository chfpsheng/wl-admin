import { emojiMap, emojiUrl } from './emojiMap'
/** 传入messageBody（群系统消息SystemMessage，群提示消息GroupTip除外）
 * payload = {
 *  msgType: 'TIMTextElem',
 *  msgContent: {
 *    text: 'AAA[龇牙]AAA[龇牙]AAA[龇牙AAA]'
 *  }
 *}
 **/
//TODO: 这里之前是处理文本和表情混合发送的情况，但是现在暂时不会存在表情的情况
export function decodeText(payload) {
  return [
    {
      name: 'text',
      text: payload.text
    }
  ];
  // const renderDom = []
  // // 文本消息
  // let temp = payload.text
  // let left = -1
  // let right = -1
  // while (temp && temp !== '') {
  //   left = temp.indexOf('[')
  //   right = temp.indexOf(']')
  //   switch (left) {
  //     case 0:
  //       if (right === -1) {
  //         renderDom.push({
  //           name: 'text',
  //           text: temp
  //         })
  //         temp = ''
  //       } else {
  //         const _emoji = temp.slice(0, right + 1)
  //         if (emojiMap[_emoji]) {
  //           renderDom.push({
  //             name: 'img',
  //             src: emojiUrl + emojiMap[_emoji]
  //           })
  //           temp = temp.substring(right + 1)
  //         } else {
  //           renderDom.push({
  //             name: 'text',
  //             text: '['
  //           })
  //           temp = temp.slice(1)
  //         }
  //       }
  //       break
  //     case -1:
  //       renderDom.push({
  //         name: 'text',
  //         text: temp
  //       })
  //       temp = ''
  //       break
  //     default:
  //       renderDom.push({
  //         name: 'text',
  //         text: temp.slice(0, left)
  //       })
  //       temp = temp.substring(left)
  //       break
  //   }
  // }
  // return renderDom
}
