import ChantBasePicker from './ChantBasePicker.vue'
import ChantButton from './ChantButton.vue'
import ChantColumnOperate from './ChantColumnOperate.vue'
import ChantDialog from './ChantDialog.vue'
import ChantForm from './ChantForm.vue'
import ChantFormFooter from './ChantFormFooter.vue'
import ChantIconButton from './ChantIconButton.vue'
import ChantIconFont from './ChantIconFont.vue'
import ChantMoreDropdown from './ChantMoreDropdown.vue'
import ChantPagination from './ChantPagination.vue'
import ChantPickerButton from './ChantPickerButton.vue'
import ChantRadio from './ChantRadio.vue'
import ChantSelect from './ChantSelect.vue'
import ChantSelectedTable from './ChantSelectedTable.vue'
import ChantTable from './ChantTable.vue'
import ChantTable2 from './ChantTable2.vue'
import ChantTableOperate from './chant-table-operate/Index.vue'
import ChantTablePicker from './ChantTablePicker.vue'
import ChantTableSearch from './ChantTableSearch.vue'
import ChantTooltip from './ChantTooltip.vue'
import ChantUpload from './ChantUpload.vue'

import '@vue/runtime-core'

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    ChantBasePicker: typeof ChantBasePicker
    ChantButton: typeof ChantButton
    ChantColumnOperate: typeof ChantColumnOperate
    ChantDialog: typeof ChantDialog
    ChantForm: typeof ChantForm
    ChantFormFooter: typeof ChantFormFooter
    ChantIconButton: typeof ChantIconButton
    ChantIconFont: typeof ChantIconFont
    ChantMoreDropdown: typeof ChantMoreDropdown
    ChantPagination: typeof ChantPagination
    ChantPickerButton: typeof ChantPickerButton
    ChantRadio: typeof ChantRadio
    ChantSelect: typeof ChantSelect
    ChantSelectedTable: typeof ChantSelectedTable
    ChantTable: typeof ChantTable
    ChantTable2: typeof ChantTable2
    ChantTableOperate: typeof ChantTableOperate
    ChantTablePicker: typeof ChantTablePicker
    ChantTableSearch: typeof ChantTableSearch
    ChantTooltip: typeof ChantTooltip
    ChantUpload: typeof ChantUpload
  }
}
