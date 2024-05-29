export default [
  {
    path: '/salary',
    component: () => import('@app-base/components/home-layout/Index.vue'),
    meta: { title: '工资管理', icon: 'gongzitiao' }, // 工资管理
    children: [
      // 奖金列表
      {
        path: 'bonus-list',
        component: () => import('@app-base/views/salary/bonus-list/index.vue'),
        meta: { title: '奖金列表', menu: true }
      }
    ]
  }
]
