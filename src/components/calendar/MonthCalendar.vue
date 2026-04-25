<template>
  <div>
    <div class="calendar-wrapper" data-test="month-calendar">
      <div class="month-container">
        <button
          v-for="(month, index) in MONTHS"
          :key="index"
          :class="[
            'month-cell cursor-pointer',
            {
              'selected-month': isSelected(month),
            },
          ]"
          data-test="month-cell"
          type="button"
          @click="handleSelectMonth(month)"
        >
          {{ getCalendarLang(lang).month[month] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MONTHS } from '@/constants';
import { getCalendarLang, setDatePickerLabel } from '@/utils';
import {
  CalendarType, Language, YearType, type SelectedTime
} from '@/interfaces';
import {
  computed,
  defineComponent, ref, toRefs, watch, type PropType
} from 'vue';
import dayjs from 'dayjs';

const DEFAULT_SELECTED_TIME: SelectedTime = {
  label: '',
  timeValue: undefined
};

export default defineComponent({
  props: {
    calendarYearType: {
      required: true,
      type: String as PropType<YearType>
    },
    calendarYear: {
      required: true,
      type: Number
    },
    lang: {
      required: true,
      type: String as PropType<Language>
    },
    defaultFullDate: {
      type: Object as PropType<SelectedTime>,
      default: () => ({ ...DEFAULT_SELECTED_TIME })
    },
    type: {
      required: true,
      type: String as PropType<CalendarType>
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      calendarYear, defaultFullDate, calendarYearType, type
    } = toRefs(props);
    const selectedFullDate = ref<SelectedTime>({});

    const selectedDayjs = computed(() => {
      const { timeValue } = selectedFullDate.value;
      return timeValue ? dayjs(timeValue) : undefined;
    });
    const selectedYear = computed(() => selectedDayjs.value?.year());
    const selectedMonth = computed(() => selectedDayjs.value?.month());

    const isSelected = (month: number): boolean => {
      if (
        selectedFullDate.value.timeValue
        && calendarYear.value === selectedYear.value
        && month === selectedMonth.value
      ) {
        return true;
      }

      return false;
    };

    const handleSelectMonth = (monthOnCalendar: number) => {
      const timeValue = new Date(calendarYear.value, monthOnCalendar);
      selectedFullDate.value.timeValue = timeValue;

      if (type.value === CalendarType.MONTH) {
        selectedFullDate.value.label = setDatePickerLabel({
          calendarYearType: calendarYearType.value,
          selectedDate: timeValue,
          formatYear: timeValue.getFullYear(),
          datePickerType: CalendarType.MONTH
        });
      }

      emit('click', selectedFullDate.value);
    };

    watch(
      () => defaultFullDate.value?.timeValue,
      (timeValue) => {
        selectedFullDate.value = timeValue
          ? { ...defaultFullDate.value }
          : { ...DEFAULT_SELECTED_TIME };
      },
      { immediate: true }
    );

    return {
      MONTHS,
      selectedFullDate,
      isSelected,
      handleSelectMonth,
      getCalendarLang
    };
  }
});
</script>

<style scoped lang="scss">
button {
  background: transparent;
  border-style: none;
  font-size: 16px;
  color: #6a6c6d;
}
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
      color: #4390BC;
    }
  }

  .selected-month {
    font-weight: 600;
    color: #4390BC;
  }
}
</style>
