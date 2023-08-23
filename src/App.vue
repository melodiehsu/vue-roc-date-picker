<template>
  <div>
    demo

    <div class="date-picker">
      <MyDatePicker
        :type="CALENDAR_TYPE.date"
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
    const getSelectedTime = (time) => {
      selectedTime.value = time;
      console.log('selectedTime', selectedTime.value);
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
