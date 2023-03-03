/*
 * @Author: your name
 * @Date: 2021-10-21 17:03:33
 * @LastEditTime: 2021-12-09 15:05:29
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \management-system\src\api\request-new.js
 */
import request from '@/utils/request-new'

export function requestPost(url, params) {
  return new Promise((resolve, reject) => {
    request({
      method: 'post',
      url,
      data: params
    }).then(res => {
      resolve(res)
    })
      .catch((err) => {
        reject(err)
      })
  })
}

export function requestGet(url, params) {
  return new Promise((resolve, reject) => {
    request({
      method: 'get',
      url,
      params
    }).then(res => {
      resolve(res)
    })
      .catch(err => {
        reject(err)
      })
  })
}

export function requestDel(url, params) {
  return new Promise((resolve, reject) => {
    request({
      method: 'delete',
      url,
      data: params
    }).then(res => {
      resolve(res)
    })
      .catch(err => {
        reject(err)
      })
  })
}

export function requestPut(url, params) {
  return new Promise((resolve, reject) => {
    request({
      method: 'put',
      url,
      params
    }).then(res => {
      resolve(res)
    })
      .catch(err => {
        reject(err)
      })
  })
}
