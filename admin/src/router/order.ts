export default [
  {
    path: '/order',
    component: () => import('@/components/home-layout/Index.vue'),
    meta: { titleEn: 'order manager', titleZh: '订单管理', icon: 'setting' },
    children: [
      {
        path: 'order-list',
        component: () => import('@/views/order/order-list/index.vue'),
        meta: { titleEn: 'order list', titleZh: '订单列表', menu: true }
      }
    ]
  }
]
