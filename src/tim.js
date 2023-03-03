/*
 * @Author: your name
 * @Date: 2021-10-21 17:03:33
 * @LastEditTime: 2021-11-18 10:26:51
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \management-system\src\tim.js
 */
import TIM from 'tim-js-sdk'
import TIMUploadPlugin from 'tim-upload-plugin'

// 初始化 SDK 实例

const tim = TIM.create({
  SDKAppID: process.env.VUE_APP_SDKAPPID,
})

window.setLogLevel = tim.setLogLevel

// 无日志级别
tim.setLogLevel(4)

// 注册 cos
tim.registerPlugin({ 'tim-upload-plugin': TIMUploadPlugin })
export default tim
