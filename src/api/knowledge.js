/*
 * @Author: your name
 * @Date: 2021-11-01 16:55:31
 * @LastEditTime: 2021-11-01 16:59:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \management-system\src\api\knowledge.js
 */
import request from '@/utils/request'

// 标签类型查找
export function labelTypeQuery(data) {
  return request({
    url: '/cloud-consult/category/query',
    method: 'post',
    data: data
  })
}

// 标签类型新增
export function labelTypeInsert(data) {
  return request({
    url: '/cloud-consult/category/insert',
    method: 'post',
    data: data
  })
}

// 标签类型更新
export function labelTypeUpdate(data) {
  return request({
    url: '/cloud-consult/category/update',
    method: 'post',
    data: data
  })
}

// 标签类型更新
export function labelTypeDelete(data) {
  return request({
    url: '/cloud-consult/category/delete?id=' + data.id,
    method: 'post',
    data: data
  })
}

// 标签查询
export function labelQuery(data) {
  return request({
    url: '/cloud-consult/coupe/query',
    method: 'post',
    data: data
  })
}
// 获取单个标签详情
export function getLabel(id) {
  return request({
    url: '/cloud-consult/coupe/get?id=' + id,
    method: 'post',
  })
}

// 标签更新
export function labelUpdate(data) {
  return request({
    url: '/cloud-consult/coupe/update',
    method: 'post',
    data: data
  })
}

// 标签新增
export function labelInsert(data) {
  return request({
    url: '/cloud-consult/coupe/insert',
    method: 'post',
    data: data
  })
}

// 标签删除
export function labelDelete(data) {
  return request({
    url: '/cloud-consult/coupe/delete?id=' + data.id,
    method: 'post',
    data: data
  })
}
//更新启用禁用状态
export function labelUpdateOnly(data) {
  return request({
    url: '/cloud-consult/coupe/state',
    method: 'post',
    data: data
  })
}