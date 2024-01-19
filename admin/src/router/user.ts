export default [
  {
    path: '/user',
    component: () => import('@/components/home-layout/Index.vue'),
    meta: {
      titleEn: 'user manager',
      titleZh: '用户管理',
      icon: 'yonghu'
    },
    children: [
      {
        path: 'user-list',
        component: () => import('@/views/user/user-list/index.vue'),
        meta: { titleEn: 'user list', titleZh: '用户列表', menu: true }
      },
      {
        path: 'user-list/add',
        component: () => import('@/views/user/user-list/add.vue'),
        meta: { titleEn: 'user add', titleZh: '用户新增' }
      },
      {
        path: 'user-list/edit',
        component: () => import('@/views/user/user-list/edit.vue'),
        meta: { titleEn: 'user edit', titleZh: '用户编辑' }
      }
    ]
  }
]
