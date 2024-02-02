export default [
  {
    path: '/salary',
    component: () => import('@/components/home-layout/Index.vue'),
    meta: {
      titleEn: 'salary manager',
      titleZh: '工资管理',
      icon: 'gongzitiao'
    },
    children: [
      {
        path: 'bonus-list',
        component: () => import('@/views/salary/bonus-list/index.vue'),
        meta: { titleEn: 'bonus list', titleZh: '奖金列表', menu: true }
      }
    ]
  }
]
