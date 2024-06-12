import { type App } from 'vue'
import { VxeColumn, VxeIcon, VxeTable, VxeTooltip } from 'vxe-table'
// vxe-table css
import 'vxe-table/styles/cssvar.scss'

export default function vxe(app: App<Element>) {
  app.use(VxeColumn)
  app.use(VxeIcon)
  app.use(VxeTable)
  app.use(VxeTooltip)
}
