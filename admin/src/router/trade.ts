export default [
  {
    path: '/trade',
    component: () => import('@/components/home-layout/Index.vue'),
    meta: {
      titleEn: 'trade manager',
      titleZh: '交易管理',
      icon: 'jiaoyijilu'
    },
    children: [
      {
        path: 'trade-list',
        component: () => import('@/views/trade/trade-list/index.vue'),
        meta: { titleEn: 'order list', titleZh: '交易列表', menu: true }
      }
    ]
  }
]
