import { defineAsyncComponent, type App } from 'vue'

const ChantBasePicker = defineAsyncComponent(
  () => import('./ChantBasePicker.vue')
)
const ChantButton = defineAsyncComponent(() => import('./ChantButton.vue'))
const ChantColumnOperate = defineAsyncComponent(
  () => import('./ChantColumnOperate.vue')
)
const ChantDialog = defineAsyncComponent(() => import('./ChantDialog.vue'))
const ChantForm = defineAsyncComponent(() => import('./ChantForm.vue'))
const ChantFormFooter = defineAsyncComponent(
  () => import('./ChantFormFooter.vue')
)
const ChantIconButton = defineAsyncComponent(
  () => import('./ChantIconButton.vue')
)
const ChantIconFont = defineAsyncComponent(() => import('./ChantIconFont.vue'))
const ChantMoreDropdown = defineAsyncComponent(
  () => import('./ChantMoreDropdown.vue')
)
const ChantPagination = defineAsyncComponent(
  () => import('./ChantPagination.vue')
)
const ChantPickerButton = defineAsyncComponent(
  () => import('./ChantPickerButton.vue')
)
const ChantRadio = defineAsyncComponent(() => import('./ChantRadio.vue'))
const ChantSelect = defineAsyncComponent(() => import('./ChantSelect.vue'))
const ChantSelectedTable = defineAsyncComponent(
  () => import('./ChantSelectedTable.vue')
)
const ChantTable = defineAsyncComponent(() => import('./ChantTable.vue'))
const ChantTable2 = defineAsyncComponent(() => import('./ChantTable2.vue'))
const ChantTableOperate = defineAsyncComponent(
  () => import('./chant-table-operate/Index.vue')
)
const ChantTablePicker = defineAsyncComponent(
  () => import('./ChantTablePicker.vue')
)
const ChantTableSearch = defineAsyncComponent(
  () => import('./ChantTableSearch.vue')
)
const ChantTooltip = defineAsyncComponent(() => import('./ChantTooltip.vue'))
const ChantUpload = defineAsyncComponent(() => import('./ChantUpload.vue'))

function components(app: App<Element>) {
  app.component('ChantBasePicker', ChantBasePicker)
  app.component('ChantButton', ChantButton)
  app.component('ChantColumnOperate', ChantColumnOperate)
  app.component('ChantDialog', ChantDialog)
  app.component('ChantForm', ChantForm)
  app.component('ChantFormFooter', ChantFormFooter)
  app.component('ChantIconButton', ChantIconButton)
  app.component('ChantIconFont', ChantIconFont)
  app.component('ChantMoreDropdown', ChantMoreDropdown)
  app.component('ChantPagination', ChantPagination)
  app.component('ChantPickerButton', ChantPickerButton)
  app.component('ChantRadio', ChantRadio)
  app.component('ChantSelect', ChantSelect)
  app.component('ChantSelectedTable', ChantSelectedTable)
  app.component('ChantTable', ChantTable)
  app.component('ChantTable2', ChantTable2)
  app.component('ChantTableOperate', ChantTableOperate)
  app.component('ChantTablePicker', ChantTablePicker)
  app.component('ChantTableSearch', ChantTableSearch)
  app.component('ChantTooltip', ChantTooltip)
  app.component('ChantUpload', ChantUpload)
}

export default components
