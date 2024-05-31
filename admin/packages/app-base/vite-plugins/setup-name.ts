import type { Plugin } from 'vite'
import { compileScript, parse } from '@vue/compiler-sfc'

export default (): Plugin => {
  return {
    name: 'vite:setup-name',
    transform(src: string, id: string) {
      if (
        /\.vue$/.test(id) &&
        /\/views\//.test(id) &&
        !/\/components\//.test(id)
      ) {
        const { descriptor } = parse(src)
        if (descriptor.script) {
          const { attrs } = compileScript(descriptor, { id })
          const regex = /\/views(\/[^.]+)\.vue$/
          let name = id.match(regex)?.[1]
          name = name?.replace(/\/index/, '')
          const script = `
            <script lang="${attrs.lang}">
              import { defineComponent } from 'vue'
              export default defineComponent({
                name: '${name}',
              })
            </script>
          `
          return { code: script + src }
        }
      }
    }
  }
}
