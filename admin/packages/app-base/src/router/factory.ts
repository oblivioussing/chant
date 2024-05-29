// import { shiki } from 'chant'
// import router from './index'

// type Modules = Record<string, () => Promise<{ [key: string]: any }>>
// const modules = import.meta.glob('../views/**/*.vue') as Modules

async function factory() {
  // const { data } = await shiki.get('user/menu')
  // console.log(data)
  // const pathKeys = Object.keys(modules)
  // // routes
  // const routes = [] as any[]
  // if (!routes?.length) {
  //   return
  // }
  // routes?.forEach((item: any) => {
  //   item?.children?.forEach((child: any) => {
  //     const { meta, path } = child
  //     if (path) {
  //       const moduleKey = pathKeys.find((item) => {
  //         return (
  //           item.indexOf(path + '/index.vue') >= 0 ||
  //           item.indexOf(path + '.vue') >= 0
  //         )
  //       }) as string
  //     }
  //   })
  // })
}

export default factory
