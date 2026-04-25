import type { App } from 'vue';
import ROCDatePicker from './ROCDatePicker.vue';

export * from '@/interfaces';

const install: (app: import('vue').App<any>) => void = (app: App) => {
  app.component('ROCDatePicker', ROCDatePicker);
};
export { ROCDatePicker };
export default { install };
