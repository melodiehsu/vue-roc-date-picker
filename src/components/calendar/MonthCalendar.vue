<template>
  <div>
    <div class="calendar-wrapper" data-test="month-calendar">
      <div class="month-container">
        <button
          v-for="(month, index) in MONTHS"
          :key="index"
          :class="[
            'month-cell',
            {
              'selected-month': isSelected(month),
              'cursor-pointer': !isMonthDisabled(month),
              'disabled-month': isMonthDisabled(month),
            },
          ]"
          data-test="month-cell"
          type="button"
          :disabled="isMonthDisabled(month)"
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
import {
  getCalendarLang, isDateOutOfRange, setDatePickerLabel
} from '@/utils';
import {
  CalendarType, Language, YearType, type SelectedTime
} from '@/interfaces';
import {
  computed,
  defineComponent, onMounted, ref, toRefs, watch, type PropType
} from 'vue';

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
      default: () => {}
    },
    minDate: {
      type: [Date, String],
      default: ''
    },
    maxDate: {
      type: [Date, String],
      default: ''
    },
    type: {
      required: true,
      type: String as PropType<CalendarType>
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      calendarYear, defaultFullDate, calendarYearType, type, minDate, maxDate
    } = toRefs(props);

    const selectedFullDate = ref<SelectedTime>({});
    const selectedYear = computed(() => new Date(selectedFullDate.value.timeValue as Date).getFullYear());
    const selectedMonth = computed(() => new Date(selectedFullDate.value.timeValue as Date).getMonth());

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

    const isMonthDisabled = (month: number) => isDateOutOfRange({
      targetDate: new Date(calendarYear.value, month, 1),
      minDate: minDate.value,
      maxDate: maxDate.value,
      unit: 'month'
    });

    const handleSelectMonth = (monthOnCalendar: number) => {
      if (isMonthDisabled(monthOnCalendar)) return;

      selectedFullDate.value.timeValue = new Date(calendarYear.value, monthOnCalendar);

      if (type.value === CalendarType.MONTH) {
        selectedFullDate.value.label = setDatePickerLabel({
          calendarYearType: calendarYearType.value,
          selectedDate: selectedFullDate.value.timeValue,
          formatYear: calendarYear.value,
          datePickerType: CalendarType.MONTH
        });
      }

      emit('click', selectedFullDate.value);
    };

    onMounted(() => {
      if (defaultFullDate.value) {
        selectedFullDate.value = defaultFullDate.value;
      }
    });

    watch(defaultFullDate, () => {
      selectedFullDate.value = defaultFullDate.value || {};
    }, { deep: true });

    return {
      MONTHS,
      selectedFullDate,
      isSelected,
      isMonthDisabled,
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

  .disabled-month {
    cursor: not-allowed;
    color: #c3c7ca;

    &:hover {
      color: #c3c7ca;
    }
  }

  .selected-month {
    font-weight: 600;
    color: #4390BC;
  }

  .selected-month.disabled-month {
    color: #4390BC;
  }
}
</style>
