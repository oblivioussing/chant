export {}

declare module 'vue' {
  export interface GlobalComponents {
    ElAvatar: (typeof import('element-plus/es'))['ElAvatar']
    ElButton: (typeof import('element-plus/es'))['ElButton']
    ElButtonGroup: (typeof import('element-plus/es'))['ElButtonGroup']
    ElCheckbox: (typeof import('element-plus/es'))['ElCheckbox']
    ElDatePicker: (typeof import('element-plus/es'))['ElDatePicker']
    ElDialog: (typeof import('element-plus/es'))['ElDialog']
    ElDivider: (typeof import('element-plus/es'))['ElDivider']
    ElDropdown: (typeof import('element-plus/es'))['ElDropdown']
    ElDropdownItem: (typeof import('element-plus/es'))['ElDropdownItem']
    ElDropdownMenu: (typeof import('element-plus/es'))['ElDropdownMenu']
    ElForm: (typeof import('element-plus/es'))['ElForm']
    ElFormItem: (typeof import('element-plus/es'))['ElFormItem']
    ElIcon: (typeof import('element-plus/es'))['ElIcon']
    ElImage: (typeof import('element-plus/es'))['ElImage']
    ElInput: (typeof import('element-plus/es'))['ElInput']
    ElInputNumber: (typeof import('element-plus/es'))['ElInputNumber']
    ElMenu: (typeof import('element-plus/es'))['ElMenu']
    ElMenuItem: (typeof import('element-plus/es'))['ElMenuItem']
    ElOption: (typeof import('element-plus/es'))['ElOption']
    ElPagination: (typeof import('element-plus/es'))['ElPagination']
    ElRadio: (typeof import('element-plus/es'))['ElRadio']
    ElRadioGroup: (typeof import('element-plus/es'))['ElRadioGroup']
    ElSelect: (typeof import('element-plus/es'))['ElSelect']
    ElSubMenu: (typeof import('element-plus/es'))['ElSubMenu']
    ElTable: (typeof import('element-plus/es'))['ElTable']
    ElTableColumn: (typeof import('element-plus/es'))['ElTableColumn']
    ElTabPane: (typeof import('element-plus/es'))['ElTabPane']
    ElTabs: (typeof import('element-plus/es'))['ElTabs']
    ElTag: (typeof import('element-plus/es'))['ElTag']
    ElText: (typeof import('element-plus/es'))['ElText']
    ElTimePicker: (typeof import('element-plus/es'))['ElTimePicker']
    ElTooltip: (typeof import('element-plus/es'))['ElTooltip']
    ElTree: (typeof import('element-plus/es'))['ElTree']
    ElTreeSelect: (typeof import('element-plus/es'))['ElTreeSelect']
    ElUpload: (typeof import('element-plus/es'))['ElUpload']
  }
  export interface ComponentCustomProperties {
    vLoading: (typeof import('element-plus/es'))['ElLoadingDirective']
  }
}
