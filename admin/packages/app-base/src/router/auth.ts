// 部门
const dept = {
  path: 'dept',
  meta: { title: 'dept', menu: true, subFlag: 1 },
  children: [
    // 部门1
    {
      path: 'dept1',
      component: () => import('@app-base/views/auth/user/index.vue'),
      meta: { title: 'dept1', menu: true }
    },
    // 部门2
    {
      path: 'dept2',
      component: () => import('@app-base/views/auth/user/index.vue'),
      meta: { title: 'dept2', menu: true }
    }
  ]
}

export default [
  {
    path: '/auth',
    component: () => import('@app-base/components/home-layout/Index.vue'),
    meta: { title: 'auth', icon: 'user' }, // 权限管理
    children: [
      // 用户列表
      {
        path: 'user',
        component: () => import('@app-base/views/auth/user/index.vue'),
        meta: { title: 'user', menu: true }
      },
      // 用户新增
      {
        path: 'user/add',
        component: () => import('@app-base/views/auth/user/add.vue'),
        meta: { title: 'userAdd' }
      },
      // 用户编辑
      {
        path: 'user/edit',
        component: () => import('@app-base/views/auth/user/edit.vue'),
        meta: { title: 'userEdit' }
      },
      // 路由
      {
        path: 'router',
        component: () => import('@app-base/views/auth/router/index.vue'),
        meta: { title: 'router', menu: true }
      },
      // 路由新增
      {
        path: 'router/add',
        component: () => import('@app-base/views/auth/router/add.vue'),
        meta: { title: 'routerAdd' }
      },
      // 路由编辑
      {
        path: 'router/edit',
        component: () => import('@app-base/views/auth/router/edit.vue'),
        meta: { title: 'routerEdit' }
      },
      // 部门
      dept
    ]
  }
]
