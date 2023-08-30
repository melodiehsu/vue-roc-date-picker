<template>
  <div>
    demo

    <div class="date-picker">
      <MyDatePicker
        @change="getSelectedTime"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import MyDatePicker from './components/MyDatePicker.vue';
import { CALENDAR_TYPE } from './constants';

export default defineComponent({
  components: {
    MyDatePicker
  },
  setup() {
    const selectedTime = ref();
    const getSelectedTime = (time: Date) => {
      selectedTime.value = time;
    };

    return {
      CALENDAR_TYPE,
      getSelectedTime
    };
  }
});
</script>

<style scoped lang="scss">
.date-picker {
  width: 200px;
  margin: 10px;
}
</style>
