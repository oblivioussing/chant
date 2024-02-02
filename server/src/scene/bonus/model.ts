export const bonusEntity = {
  date: '', // 日期
  userId: '' // 用户id
}

export const bonusVo = {
  ...bonusEntity,
  bonus: 0, // 奖金
  userName: '' // 用户姓名
}

export type Bonus = typeof bonusEntity
export type BonusVo = typeof bonusVo
