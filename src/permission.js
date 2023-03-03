/*
 * @Author: your name
 * @Date: 2021-12-07 10:01:05
 * @LastEditTime: 2021-12-10 17:39:59
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \management-system\src\permission.js
 */
import router, { asyncRoutes } from '@/router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'



NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
//TODO:后续需要根据目的的url判断是否在授权的路径，不在的统一转向404页
router.beforeEach(async(to, from, next) => {
  //to,from对象只有fullPath、hash、matched、meta、name、params、path、query成员，所以之前根据id来匹配的id可能要
  //调整到meta里面的id，或者根据name去调整，但是name要注意之前路由跳转有没有用到name
  // start progress bar
  NProgress.start()

  // set page title
  document.title = '互联网医院管理后台-' + getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        // router.addRoutes(asyncRoutes)
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // const { roles } = await store.dispatch('user/getInfo')
          //let roles = ["admin"];

          // generate accessible routes map based on roles
          //const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
     
          // dynamically add accessible routes
          // router.addRoutes(asyncRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          //next({ ...to, replace: true })
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
