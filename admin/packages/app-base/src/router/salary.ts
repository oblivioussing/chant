export default [
  {
    path: '/salary',
    component: () => import('@app-base/components/home-layout/Index.vue'),
    meta: { title: 'salaryManager', icon: 'gongzitiao' }, // 工资管理
    children: [
      // 奖金列表
      {
        path: 'bonus-list',
        component: () => import('@app-base/views/salary/bonus-list/index.vue'),
        meta: { title: 'bonusList', menu: true }
      }
    ]
  }
]
