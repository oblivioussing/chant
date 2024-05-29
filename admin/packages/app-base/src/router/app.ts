export default [
  // 404
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@app-base/views/app/404.vue')
  },
  // 登陆
  {
    path: '/login',
    component: () => import('@app-base/views/app/login/index.vue')
  },
  // 首页
  {
    path: '/',
    component: () => import('@app-base/components/home-layout/Index.vue'),
    children: [
      {
        path: '/',
        component: () => import('@app-base/views/app/index/index.vue'),
        meta: { title: '首页' }
      }
    ]
  }
]
