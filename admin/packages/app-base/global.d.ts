import ChantBasePicker from '../chant/components/ChantBasePicker.vue'
import ChantButton from '../chant/components/ChantButton.vue'
import ChantColumnOperate from '../chant/components/ChantColumnOperate.vue'
import ChantDialog from '../chant/components/ChantDialog.vue'
import ChantForm from '../chant/components/ChantForm.vue'
import ChantFormFooter from '../chant/components/ChantFormFooter.vue'
import ChantIconButton from '../chant/components/ChantIconButton.vue'
import ChantIconFont from '../chant/components/ChantIconFont.vue'
import ChantMoreDropdown from '../chant/components/ChantMoreDropdown.vue'
import ChantPagination from '../chant/components/ChantPagination.vue'
import ChantPickerButton from '../chant/components/ChantPickerButton.vue'
import ChantRadio from '../chant/components/ChantRadio.vue'
import ChantSelect from '../chant/components/ChantSelect.vue'
import ChantSelectedTable from '../chant/components/ChantSelectedTable.vue'
import ChantTable from '../chant/components/ChantTable.vue'
import ChantTable2 from '../chant/components/ChantTable2.vue'
import ChantTableOperate from '../chant/components/chant-table-operate/Index.vue'
import ChantTablePicker from '../chant/components/ChantTablePicker.vue'
import ChantTableSearch from '../chant/components/ChantTableSearch.vue'
import ChantTooltip from '../chant/components/ChantTooltip.vue'
import ChantUpload from '../chant/components/ChantUpload.vue'
import DynamicPicker from './src/components/dynamic-picker/Index.vue'

export {}

declare module 'vue' {
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
    DynamicPicker: typeof DynamicPicker
  }
}
