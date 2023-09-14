declare module 'my-date-picker' {
  export interface SelectedTime {
    label?: string;
    timeValue?: Date | undefined;
  }

  import { ComponentOptions } from 'vue';

  const MyDatePicker: ComponentOptions;
  export default MyDatePicker;
}
