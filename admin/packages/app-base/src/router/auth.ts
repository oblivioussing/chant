// 部门
const dept = {
  path: 'dept',
  meta: { title: '部门', menu: 1, sub: 1 },
  children: [
    // 部门1
    {
      path: 'dept1',
      component: () => import('@app-base/views/auth/user/index.vue'),
      meta: { title: '部门1', menu: 1 }
    },
    // 部门1新增
    {
      path: 'dept1/add',
      component: () => import('@app-base/views/auth/user/add.vue'),
      meta: { title: '部门1新增' }
    },
    // 部门2
    {
      path: 'dept2',
      component: () => import('@app-base/views/auth/user/index.vue'),
      meta: { title: '部门2', menu: 1 }
    }
  ]
}

export default [
  {
    path: '/auth',
    component: () => import('@app-base/components/home-layout/Index.vue'),
    meta: { title: '权限管理', icon: 'user' }, // 权限管理
    children: [
      // 组织架构
      {
        path: 'org',
        component: () => import('@app-base/views/auth/org/index.vue'),
        meta: { title: '组织架构', menu: 1 }
      },
      // 组织架构新增
      {
        path: 'org/add',
        component: () => import('@app-base/views/auth/org/add.vue'),
        meta: { title: '组织架构新增' }
      },
      // 组织架构编辑
      {
        path: 'org/edit',
        component: () => import('@app-base/views/auth/org/edit.vue'),
        meta: { title: '组织架构编辑' }
      },
      // 用户列表
      {
        path: 'user',
        component: () => import('@app-base/views/auth/user/index.vue'),
        meta: { title: '用户列表', menu: 1 }
      },
      // 用户新增
      {
        path: 'user/add',
        component: () => import('@app-base/views/auth/user/add.vue'),
        meta: { title: '用户新增' }
      },
      // 用户编辑
      {
        path: 'user/edit',
        component: () => import('@app-base/views/auth/user/edit.vue'),
        meta: { title: '用户编辑' }
      },
      // 路由
      {
        path: 'router',
        component: () => import('@app-base/views/auth/router/index.vue'),
        meta: { title: '路由', menu: 1 }
      },
      // 路由新增
      {
        path: 'router/add',
        component: () => import('@app-base/views/auth/router/add.vue'),
        meta: { title: '路由新增' }
      },
      // 路由编辑
      {
        path: 'router/edit',
        component: () => import('@app-base/views/auth/router/edit.vue'),
        meta: { title: '路由编辑' }
      },
      // 部门
      dept
    ]
  }
]
