/*
 * @Author: your name
 * @Date: 2021-10-21 17:03:33
 * @LastEditTime: 2021-11-18 10:27:00
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \management-system\src\trtc-calling.js
 */
import TRTCCalling from 'trtc-calling-js'

const options = {
  SDKAppID: process.env.VUE_APP_SDKAPPID, // 接入时需要将0替换为您的云通信应用的 SDKAppID
}

const trtcCalling = new TRTCCalling(options)

// 4 无日志级别
trtcCalling.setLogLevel(0)

export default trtcCalling
