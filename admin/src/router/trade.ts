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
        meta: {
          titleEn: 'trade list',
          titleZh: '交易列表',
          menu: true
        }
      },
      {
        path: 'trade-list/add',
        component: () => import('@/views/trade/trade-list/add.vue'),
        meta: { titleEn: 'trade add', titleZh: '交易新增' }
      },
      {
        path: 'trade-list/edit',
        component: () => import('@/views/trade/trade-list/edit.vue'),
        meta: { titleEn: 'trade edit', titleZh: '交易编辑' }
      }
    ]
  }
]
