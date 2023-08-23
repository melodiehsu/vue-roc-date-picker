<template>
  <div>
    <div class="calendar-wrapper">
      <div class="month-container">
        <div
          v-for="(month, index) in MONTHS"
          :key="index"
          class="month-cell cursor-pointer"
          :class="{ 'selected-month': isSelected(month) }"
          @keypress="handleSelectMonth(month)"
          @click="handleSelectMonth(month)"
        >
          {{ getCalendarLang(lang).month[month] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CALENDAR_TYPE, MONTHS } from '@/constants';
import { getCalendarLang, setDatePickerLabel } from '@/utils';
import {
  computed,
  defineComponent, onMounted, ref, toRefs
} from 'vue';

export default defineComponent({
  props: {
    calendarYearType: {
      required: true,
      type: String
    },
    calendarYear: {
      required: true,
      type: Number
    },
    lang: {
      required: true,
      type: String
    },
    defaultFullDate: {
      type: Object,
      default: () => {}
    },
    type: {
      required: true,
      type: String
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      calendarYear, defaultFullDate, calendarYearType, type
    } = toRefs(props);

    const selectedFullDate = ref({});
    const selectedYear = computed(() => new Date(selectedFullDate.value.timeValue).getFullYear());

    const selectedMonth = computed(() => new Date(selectedFullDate.value.timeValue).getMonth());

    const isSelected = (month) => {
      if (!selectedFullDate.value.timeValue) return;

      if (
        (calendarYear.value === selectedYear.value)
        && (month === selectedMonth.value)
      ) {
        return true;
      }
    };

    const handleSelectMonth = (monthOnCalendar) => {
      selectedFullDate.value.timeValue = new Date(calendarYear.value, monthOnCalendar);

      if (type.value === CALENDAR_TYPE.month) {
        selectedFullDate.value.label = setDatePickerLabel({
          calendarYearType: calendarYearType.value,
          selectedDateObject: selectedFullDate.value.timeValue,
          formatYear: selectedYear.value,
          datePickerType: CALENDAR_TYPE.month
        });
      }

      emit('click', selectedFullDate.value);
    };

    onMounted(() => {
      if (defaultFullDate.value) {
        selectedFullDate.value = defaultFullDate.value;
      }
    });

    return {
      MONTHS,
      isSelected,
      handleSelectMonth,
      getCalendarLang
    };
  }
});
</script>

<style scoped lang="scss">
.calendar-wrapper {
  width: 100%;
  height: 100%;
}

.month-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  justify-items: stretch;
  padding: 8px;

  .month-cell {
    padding: 8px 4px;
    text-align: center;

    &:hover {
      /* TODO(melody): color */
      color: blue;
    }
  }

  .selected-month {
    border-radius: 4px;
    /* TODO(melody): color */
    background: #000000;
    color: #ffffff;
  }
}
</style>
