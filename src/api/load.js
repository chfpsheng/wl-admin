import axios from 'axios'

function convertRes2Blob(response, name) {
  // console.log(9999, response['headers']['content-disposition'])
  // debugger
  // const name = response['headers']['content-disposition'].split('=')[1]
  // 返回的文件名字filename
  const fileName = name
  // response.headers['content-disposition'].match(/filename=(.*)/)[1]
  // 将二进制流转为blob
  const blob = new Blob([response.data], {
    type: 'application/octet-stream'
  })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(fileName))
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(fileName))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}

export function downloadExcel(url, params, name, token) {
  axios({
    method: 'post',
    headers: {
      'Cache-Control': 'no-cache',
      // 'Content-Type': 'application/vnd.ms-excel;charset=utf-8',
      'Content-Type': 'application/json;charset=utf-8',
      Accept: '*/*',
      withCredentials: true,
      token
    },
    url, // 请求地址
    data: params, // 参数
    responseType: 'blob'
  }).then((res) => {
    convertRes2Blob(res, name)
  })
}

function convertRes2BlobZip(response) {
  const fileName = response.headers['content-disposition'].match(/filename=(.*)/)[1]
  // 将二进制流转为blob
  const blob = new Blob([response.data], {
    type: 'application/zip'
  })
  if (typeof window.navigator.msSaveBlob !== 'undefined') {
    // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
    window.navigator.msSaveBlob(blob, decodeURI(fileName))
  } else {
    // 创建新的URL并指向File对象或者Blob对象的地址
    const blobURL = window.URL.createObjectURL(blob)
    // 创建a标签，用于跳转至下载链接
    const tempLink = document.createElement('a')
    tempLink.style.display = 'none'
    tempLink.href = blobURL
    tempLink.setAttribute('download', decodeURI(fileName))
    // 兼容：某些浏览器不支持HTML5的download属性
    if (typeof tempLink.download === 'undefined') {
      tempLink.setAttribute('target', '_blank')
    }
    // 挂载a标签
    document.body.appendChild(tempLink)
    tempLink.click()
    document.body.removeChild(tempLink)
    // 释放blob URL地址
    window.URL.revokeObjectURL(blobURL)
  }
}

export function downloadZip(url, params) {
  axios({
    method: 'post',
    headers: {
      'Cache-Control': 'no-cache',
      'Content-Type': 'application/x-zip-compressed',
      Accept: '*/*',
      withCredentials: true
    },
    url, // 请求地址
    data: params, // 参数
    responseType: 'blob'
  }).then((res) => {
    convertRes2BlobZip(res)
  })
}
