import ChantButton from './ChantButton.vue'
import ChantColumnOperate from './ChantColumnOperate.vue'
import ChantDialog from './ChantDialog.vue'
import ChantForm from './ChantForm.vue'
import ChantFormFooter from './ChantFormFooter.vue'
import ChantIconButton from './ChantIconButton.vue'
import ChantMoreDropdown from './ChantMoreDropdown.vue'
import ChantPagination from './ChantPagination.vue'
import ChantPickerButton from './ChantPickerButton.vue'
import ChantSelectedTable from './ChantSelectedTable.vue'
import ChantTable from './ChantTable.vue'
import ChantTableOperate from './chant-table-operate/Index.vue'
import ChantTablePicker from './ChantTablePicker.vue'
import ChantTableSearch from './ChantTableSearch.vue'
import ChantUpload from './ChantUpload.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantButton: typeof ChantButton
    ChantColumnOperate: typeof ChantColumnOperate
    ChantDialog: typeof ChantDialog
    ChantForm: typeof ChantForm
    ChantFormFooter: typeof ChantFormFooter
    ChantIconButton: typeof ChantIconButton
    ChantMoreDropdown: typeof ChantMoreDropdown
    ChantPagination: typeof ChantPagination
    ChantPickerButton: typeof ChantPickerButton
    ChantSelectedTable: typeof ChantSelectedTable
    ChantTable: typeof ChantTable
    ChantTableOperate: typeof ChantTableOperate
    ChantTablePicker: typeof ChantTablePicker
    ChantTableSearch: typeof ChantTableSearch
    ChantUpload: typeof ChantUpload
  }
}
