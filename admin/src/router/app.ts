export default [
  // 404
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/app/404.vue')
  },
  // 登陆
  {
    path: '/login',
    component: () => import('@/views/app/login/index.vue')
  },
  // 首页
  {
    path: '/',
    component: () => import('@/components/home-layout/index.vue'),
    children: [
      {
        path: '/',
        component: () => import('@/views/app/index/index.vue'),
        meta: { titleEn: 'index', titleZh: '首页' }
      }
    ]
  }
]
