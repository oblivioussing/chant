export default [
  {
    path: '/trade',
    component: () => import('@/components/home-layout/Index.vue'),
    meta: { title: 'tradeManager', icon: 'jiaoyijilu' }, // 交易管理
    children: [
      // 交易列表
      {
        path: 'trade-list',
        component: () => import('@/views/trade/trade-list/index.vue'),
        meta: { title: 'tradeList', menu: true }
      },
      // 交易新增
      {
        path: 'trade-list/add',
        component: () => import('@/views/trade/trade-list/add.vue'),
        meta: { title: 'tradeAdd' }
      },
      // 交易编辑
      {
        path: 'trade-list/edit',
        component: () => import('@/views/trade/trade-list/edit.vue'),
        meta: { title: 'tradeEdit' }
      }
    ]
  }
]
