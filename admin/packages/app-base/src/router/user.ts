export default [
  {
    path: '/user',
    component: () => import('@app-base/components/home-layout/Index.vue'),
    meta: { title: 'userManager', icon: 'yonghu' }, // 用户管理
    children: [
      // 用户列表
      {
        path: 'user-list',
        component: () => import('@app-base/views/user/user-list/index.vue'),
        meta: { title: 'userList', menu: true }
      },
      // 用户新增
      {
        path: 'user-list/add',
        component: () => import('@app-base/views/user/user-list/add.vue'),
        meta: { title: 'userAdd' }
      },
      // 用户编辑
      {
        path: 'user-list/edit',
        component: () => import('@app-base/views/user/user-list/edit.vue'),
        meta: { title: 'userEdit' }
      }
    ]
  }
]
