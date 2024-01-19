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
        path: 'salary-list',
        component: () => import('@/views/salary/salary-list/index.vue'),
        meta: { titleEn: 'salary list', titleZh: '工资列表', menu: true }
      }
    ]
  }
]
