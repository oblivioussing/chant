export default [
  {
    path: '/trade',
    component: () => import('@app-base/components/home-layout/Index.vue'),
    meta: { title: '交易管理', icon: 'jiaoyijilu' }, // 交易管理
    children: [
      // 交易列表
      {
        path: 'trade-list',
        component: () => import('@app-base/views/trade/trade-list/index.vue'),
        meta: { title: '交易列表', menu: true }
      },
      // 交易新增
      {
        path: 'trade-list/add',
        component: () => import('@app-base/views/trade/trade-list/add.vue'),
        meta: { title: '交易新增' }
      },
      // 交易编辑
      {
        path: 'trade-list/edit',
        component: () => import('@app-base/views/trade/trade-list/edit.vue'),
        meta: { title: '交易编辑' }
      }
    ]
  }
]
