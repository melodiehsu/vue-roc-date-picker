import type { App } from 'vue';
import ROCDatePicker from './ROCDatePicker.vue';

const install = (app: App) => {
  app.component('ROCDatePicker', ROCDatePicker);
};
export { ROCDatePicker };
export default { install };
