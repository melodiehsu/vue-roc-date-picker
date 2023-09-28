/* TODO(melody): types 補充 */
declare module 'roc-date-picker' {
  export interface SelectedTime {
    label?: string;
    timeValue?: Date | undefined;
  }

  import { ComponentOptions } from 'vue';

  const ROCDatePicker: ComponentOptions;
  export default ROCDatePicker;
}
