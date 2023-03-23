import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";
import PageMain from "@/layout/components/PageMain";
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index")
      }
    ]
  },
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
    meta: {
      title: "login"
    }
  },

  {
    path: "/auth-redirect",
    component: () => import("@/views/login/auth-redirect"),
    hidden: true
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () => import("@/views/error-page/401"),
    hidden: true
  },
  {
    path: "/mine",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/mine/reset",
        component: () => import("@/views/mine/reset"),
        meta: {
          title: "账户设置",
          icon: "documentation",
          affix: true
        }
      }
    ]
  }
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: "/",
    component: Layout,
    meta: {
      title: "系统管理",
      icon: "icon-huanzhexiaoxiicon",
      affix: true,
      id: "manage"
    },
    alwaysShow: true,
    onlyOne: false,
    // component: () => import('@/views/im/index')
    // redirect: "/manage/index",
    redirect: "/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/codeManage/codeManage.vue"),
        name: "manage",
        meta: {
          title: "标准代码",
          affix: true,
          id: "manage.index"
        }
      },
      {
        path: "commControl",
        component: () => import("@/views/commControl/commControlManage.vue"),
        name: "commControl",
        meta: {
          title: "信前置机信息管理",
          affix: true,
          id: "manage.commControl"
        }
      },
      {
        path: "protocolEncoding",
        component: () =>
          import("@/views/protocolEncoding/protocolEncodingManage.vue"),
        name: "protocolEncoding",
        meta: {
          title: "报文数据编码信息管理",
          affix: true,
          id: "manage.protocolEncoding"
        }
      },
      {
        path: "tenantManage",
        component: () => import("@/views/tenant/tenantManage.vue"),
        name: "tenantManage",
        meta: {
          title: "租户管理",
          affix: true,
          id: "manage.tenantManage"
        }
      },
      {
        path: "patternManage",
        component: () => import("@/views/pattern/patternManage.vue"),
        name: "patternManage",
        meta: {
          title: "通信方式信息管理",
          affix: true,
          id: "manage.patternManage"
        }
      },
      {
        path: "foreignApplication",
        component: () =>
          import("@/views/foreignApplication/foreignApplication.vue"),
        name: "foreignApplication",
        meta: {
          title: "运营商对接配置",
          affix: true,
          id: "manage.foreignApplication"
        }
      },
      {
        path: "portManage",
        component: () => import("@/views/portManage/portManage.vue"),
        name: "portManage",
        meta: {
          title: "通信端口信息管理",
          affix: true,
          id: "manage.portManage"
        }
      }
    ]
  }
  // {
  //   path: "/dashboard",
  //   component: Layout,
  //   meta: {
  //     title: "面板",
  //     icon: "icon-huanzhexiaoxiicon",
  //     affix: true,
  //     id: "dashboard"
  //   },
  //   alwaysShow: true,
  //   onlyOne: true,
  //   // component: () => import('@/views/im/index')
  //   redirect: "/dashboard/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/dashboard/index"),
  //       name: "dashboard",
  //       meta: {
  //         title: "面板",
  //         affix: true,
  //         id: "dashboard.index"
  //       }
  //     }
  //   ]
  // },
  // {
  //   // path: '/patientSetting',
  //   path: "/",
  //   component: Layout,
  //   meta: {
  //     title: "patientSetting",
  //     icon: "icon-huanzheguanliicon",
  //     affix: true,
  //     id: "PatientSetting"
  //   },
  //   alwaysShow: true,
  //   // redirect: '/patientSetting/index',
  //   redirect: "/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/patient/patient-list"),
  //       name: "patientList",
  //       meta: {
  //         title: "patientList",
  //         affix: true,
  //         id: "PatientSetting.PatientList"
  //       }
  //     },
  //     {
  //       path: "edit",
  //       component: () => import("@/views/patient/patient-edit"),
  //       hidden: true,
  //       name: "PatientListEdit",
  //       meta: {
  //         title: "编辑患者信息",
  //         affix: true,
  //         id: "PatientSetting.PatientList"
  //       }
  //     },
  //     {
  //       path: "news",
  //       component: () => import("@/views/mass-news/index"),
  //       name: "news",
  //       meta: {
  //         title: "News",
  //         affix: true,
  //         id: "PatientSetting.News"
  //       }
  //     },
  //     {
  //       path: "label",
  //       component: () => import("@/views/patient/patient-label"),
  //       name: "patientLabel",
  //       meta: {
  //         title: "patientLabel",
  //         affix: true,
  //         id: "PatientSetting.PatientLabel"
  //       }
  //     },
  //     {
  //       path: "showbox",
  //       component: () => import("@/views/patient/show-box"),
  //       name: "showbox",
  //       hidden: true,
  //       meta: {
  //         title: "用户画像",
  //         affix: true,
  //         id: "PatientSetting.ShowBox"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/im",
  //   component: Layout,
  //   meta: {
  //     title: "imManager",
  //     icon: "icon-huanzhexiaoxiicon",
  //     affix: true,
  //     id: "Im"
  //   },
  //   alwaysShow: true,
  //   onlyOne: true,
  //   // component: () => import('@/views/im/index')
  //   redirect: "/im/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/im/index"),
  //       name: "manager",
  //       meta: {
  //         title: "imManager",
  //         affix: true,
  //         id: "Im.Manager"
  //       }
  //     },
  //     {
  //       path: "addSchedule",
  //       component: () => import("@/views/patient/patient-schedule.vue"),
  //       name: "addSchedule",
  //       hidden: true,
  //       meta: {
  //         title: "新增产检日程表",
  //         affix: true,
  //         id: "Im.AddSchedule"
  //       }
  //     },
  //     {
  //       path: "editSchedule",
  //       component: () => import("@/views/patient/patient-schedule.vue"),
  //       name: "editSchedule",
  //       hidden: true,
  //       meta: {
  //         title: "编辑产检日程表",
  //         affix: true,
  //         id: "Im.EditSchedule"
  //       }
  //     },
  //     {
  //       path: "sugarReport",
  //       component: () => import("@/views/health-manage/blood-sugar-report"),
  //       name: "editTemplate",
  //       hidden: true,
  //       meta: { title: "血糖报告", id: "Health.SugarReport", affix: true }
  //     },
  //     {
  //       path: "weightReport",
  //       component: () => import("@/views/health-manage/weight-report"),
  //       name: "editTemplate",
  //       hidden: true,
  //       meta: { title: "体重报告", id: "Health.WeightReport", affix: true }
  //     },
  //     {
  //       path: "weightDetail",
  //       component: () => import("@/views/health-manage/weight-detail"),
  //       name: "editTemplate",
  //       hidden: true,
  //       meta: { title: "体重详情", id: "Health.WeightDetail", affix: true }
  //     },
  //     {
  //       path: "sugarDetail",
  //       component: () => import("@/views/health-manage/blood-sugar-detail"),
  //       name: "editTemplate",
  //       hidden: true,
  //       meta: { title: "血糖详情", id: "Health.SugarDetail", affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: "/workbench",
  //   component: Layout,
  //   meta: {
  //     title: "工作台",
  //     icon: "icon-s_gongzuotai",
  //     affix: true,
  //     id: "Workbench"
  //   },
  //   alwaysShow: true,
  //   onlyOne: true,
  //   redirect: "/workbench/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/workbench/index"),
  //       name: "manager",
  //       meta: {
  //         title: "工作台",
  //         affix: true,
  //         id: "Workbench.Follow"
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/serviceMall",
  //   component: Layout,
  //   meta: {
  //     title: "服务商城",
  //     icon: "icon-fuwuicon",
  //     affix: true,
  //     id: "ServiceMall"
  //   },
  //   alwaysShow: true,
  //   redirect: "/serviceMall/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/service-mall/service-manage"),
  //       name: "serviceManage",
  //       meta: {
  //         title: "serviceManage",
  //         affix: true,
  //         id: "ServiceMall.ServiceManage"
  //       }
  //     },
  //     {
  //       path: "/create-package",
  //       component: () => import("@/views/service-mall/create-package/index"),
  //       name: "createPackage",
  //       hidden: true,
  //       meta: {
  //         title: "创建服务套餐",
  //         affix: true,
  //         id: "ServiceMall.ServiceManage"
  //       } //权限和服务列表一样，所以id保持一致
  //     },
  //     {
  //       path: "/edit-package",
  //       component: () => import("@/views/service-mall/create-package/index"),
  //       name: "editPackage",
  //       hidden: true,
  //       meta: {
  //         title: "编辑服务套餐",
  //         affix: true,
  //         id: "ServiceMall.ServiceManage"
  //       }
  //     },
  //     {
  //       path: "/orderlist",
  //       component: () => import("@/views/orderlist/index"),
  //       name: "orderlist",
  //       meta: {
  //         title: "orderlist",
  //         affix: true,
  //         id: "ServiceMall.ServiceMallOrderlist"
  //       }
  //     },
  //     {
  //       path: "/discount",
  //       component: () => import("@/views/discount/index"),
  //       name: "discount",
  //       meta: {
  //         title: "discount",
  //         affix: true,
  //         id: "ServiceMall.DiscountList"
  //       }
  //     },
  //     {
  //       path: "/discountList",
  //       component: PageMain,
  //       hidden: true,
  //       redirect: "/discount",
  //       // component: () => import('@/views/orderlist/index'),
  //       name: "discount",
  //       meta: {
  //         title: "discount",
  //         affix: true,
  //         id: "ServiceMall.DiscountList"
  //       },
  //       children: [
  //         {
  //           path: "/discount-create",
  //           name: "discount-create",
  //           hidden: true,
  //           component: () => import("@/views/discount/discount-edit"),
  //           meta: {
  //             title: "新增折扣活动",
  //             affix: true,
  //             id: "ServiceMall.DiscountList"
  //           }
  //         },
  //         {
  //           path: "/discount-edit",
  //           name: "discount-edit",
  //           hidden: true,
  //           component: () => import("@/views/discount/discount-edit"),
  //           meta: {
  //             title: "编辑折扣活动",
  //             affix: true,
  //             id: "ServiceMall.DiscountList"
  //           }
  //         },
  //         {
  //           path: "/discount-setting",
  //           name: "discount-setting",
  //           hidden: true,
  //           component: () => import("@/views/discount/discount-detail"),
  //           meta: {
  //             title: "管理折扣服务",
  //             affix: true,
  //             id: "ServiceMall.DiscountList"
  //           }
  //         },
  //         {
  //           path: "/discount-detail",
  //           name: "discount-detail",
  //           hidden: true,
  //           component: () => import("@/views/discount/discount-detail"),
  //           meta: {
  //             title: "查看折扣服务详情",
  //             affix: true,
  //             id: "ServiceMall.DiscountList"
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: "/coupon",
  //       component: () => import("@/views/coupon/index"),
  //       name: "coupon",
  //       meta: {
  //         title: "优惠券管理",
  //         affix: true,
  //         id: "ServiceMall.Coupon"
  //       }
  //     },
  //     {
  //       path: "/couponList",
  //       component: PageMain,
  //       hidden: true,
  //       redirect: "/coupon",
  //       // component: () => import('@/views/orderlist/index'),
  //       name: "coupon",
  //       meta: {
  //         title: "优惠券管理",
  //         affix: true,
  //         id: "ServiceMall.Coupon"
  //       },
  //       children: [
  //         {
  //           path: "/coupon-create",
  //           name: "coupon-create",
  //           hidden: true,
  //           component: () => import("@/views/coupon/coupon-edit"),
  //           meta: {
  //             title: "新增优惠券",
  //             affix: true,
  //             id: "ServiceMall.Coupon"
  //           }
  //         },
  //         {
  //           path: "/coupon-statistics",
  //           name: "coupon-statistics",
  //           hidden: true,
  //           component: () => import("@/views/coupon/coupon-statistics"),
  //           meta: {
  //             title: "优惠券数据",
  //             affix: true,
  //             id: "ServiceMall.Coupon"
  //           }
  //         },
  //         {
  //           path: "/coupon-detail",
  //           name: "coupon-detail",
  //           hidden: true,
  //           component: () => import("@/views/coupon/coupon-detail"),
  //           meta: {
  //             title: "查看优惠券详情",
  //             affix: true,
  //             id: "ServiceMall.Coupon"
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: "/refund",
  //       component: () => import("@/views/orderlist/refundManagement/index"),
  //       name: "refund",
  //       meta: {
  //         title: "refund",
  //         affix: true,
  //         id: "ServiceMall.RefundList"
  //       }
  //     },
  //     {
  //       path: "/orderList",
  //       component: PageMain,
  //       hidden: true,
  //       // component: () => import('@/views/orderlist/index'),
  //       name: "orderList",
  //       meta: {
  //         title: "orderlist",
  //         affix: true,
  //         id: "ServiceMall.ServiceMallOrderlist"
  //       },
  //       children: [
  //         {
  //           path: "/orderAccount",
  //           name: "orderAccount",
  //           hidden: true,
  //           component: () => import("@/views/orderlist/order-account"),
  //           meta: {
  //             title: "orderAccount",
  //             affix: true,
  //             id: "ServiceMall.ServiceMallOrderlist"
  //           }
  //         }
  //       ]
  //     }
  //     // {
  //     //   path: '/serviceSpecs',
  //     //   component: () => import('@/views/service-mall/service-specs'),
  //     //   name: 'serviceSpecs',
  //     //   meta: {
  //     //     title: 'serviceSpecs',
  //     //     affix: true,
  //     //     id: 'ServiceMall.ServiceSpec'
  //     //   }
  //     // }
  //   ]
  // },
  // {
  //   path: "/speechArt",
  //   component: Layout,
  //   meta: {
  //     title: "话术管理",
  //     icon: "icon-huashuguanliicon",
  //     id: "SpeechArt",
  //     affix: true
  //   },
  //   alwaysShow: true,
  //   redirect: "/speechArt/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/speech-art/index"),
  //       name: "pregnant",
  //       meta: {
  //         title: "pregnant",
  //         id: "SpeechArt.Pregnant",
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/employee",
  //   component: Layout,
  //   meta: {
  //     title: "专科员工管理",
  //     icon: "icon-zhuankeyuangongguanliicon",
  //     id: "Employee",
  //     affix: true
  //   },
  //   alwaysShow: true,
  //   redirect: "/employee/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/employee/employee-manage"),
  //       name: "employeeManage",
  //       meta: {
  //         title: "employeeManage",
  //         id: "Employee.EmployeeManage",
  //         affix: true
  //       }
  //     },
  //     {
  //       path: "/employeeCreate",
  //       component: () => import("@/views/employee/employee-create"),
  //       name: "employeeCreate",
  //       hidden: true,
  //       meta: {
  //         title: "新增员工",
  //         id: "Employee.EmployeeManage",
  //         affix: true
  //       }
  //     },
  //     {
  //       path: "/employeeEdit",
  //       component: () => import("@/views/employee/employee-create"),
  //       name: "employeeEdit",
  //       hidden: true,
  //       meta: {
  //         title: "编辑员工",
  //         id: "Employee.EmployeeManage",
  //         affix: true
  //       }
  //     },
  //     {
  //       path: "/roleSetting",
  //       component: () => import("@/views/role/role-setting"),
  //       name: "roleSetting",
  //       hidden: true,
  //       meta: {
  //         title: "roleSetting",
  //         id: "Employee.RoleSetting",
  //         affix: true
  //       }
  //     },
  //     {
  //       path: "/roleCreate",
  //       component: () => import("@/views/role/role-create"),
  //       name: "roleCreate",
  //       hidden: true,
  //       meta: {
  //         title: "新增角色",
  //         id: "Employee.RoleSetting",
  //         affix: true
  //       }
  //     },
  //     {
  //       path: "/roleEdit",
  //       component: () => import("@/views/role/role-create"),
  //       name: "roleEdit",
  //       hidden: true,
  //       meta: {
  //         title: "编辑角色",
  //         id: "Employee.RoleSetting",
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/template",
  //   component: Layout,
  //   meta: {
  //     title: "模板管理",
  //     icon: "icon-a-content-icon1",
  //     id: "Template",
  //     affix: true
  //   },
  //   alwaysShow: true,
  //   redirect: "/template/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/template-manage/index.vue"),
  //       name: "templateManage",
  //       meta: { title: "产检模板", id: "Template.TemplateManage", affix: true }
  //     },
  //     {
  //       path: "add",
  //       component: () => import("@/views/template-manage/delivery-template"),
  //       name: "addTemplate",
  //       hidden: true,
  //       meta: { title: "新增产检模板", id: "Template.AddTemplate", affix: true }
  //     },
  //     {
  //       path: "edit",
  //       component: () => import("@/views/template-manage/delivery-template"),
  //       name: "editTemplate",
  //       hidden: true,
  //       meta: {
  //         title: "编辑产检模板",
  //         id: "Template.EditTemplate",
  //         affix: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/knowledge",
  //   component: Layout,
  //   meta: {
  //     title: "知识库",
  //     icon: "icon-s_wenjian",
  //     id: "Knowledge",
  //     affix: true
  //   },
  //   alwaysShow: true,
  //   redirect: "/knowledge/index",
  //   children: [
  //     {
  //       path: "index",
  //       component: () => import("@/views/knowledge-library/index.vue"),
  //       name: "templateManage",
  //       meta: { title: "科普知识", id: "Knowledge.TemplateManage", affix: true }
  //     },
  //     {
  //       path: "add",
  //       component: () => import("@/views/knowledge-library/add-edit-science"),
  //       name: "addTemplate",
  //       hidden: true,
  //       meta: {
  //         title: "新增科普知识",
  //         id: "Knowledge.AddTemplate",
  //         affix: true
  //       }
  //     },
  //     {
  //       path: "edit",
  //       component: () => import("@/views/knowledge-library/add-edit-science"),
  //       name: "editTemplate",
  //       hidden: true,
  //       meta: {
  //         title: "编辑科普知识",
  //         id: "Knowledge.EditTemplate",
  //         affix: true
  //       }
  //     }
  // ]
  // }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0
    }),
    routes: [...constantRoutes, ...asyncRoutes]
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
