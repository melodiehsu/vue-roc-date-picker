<template>
  <div>
    <div
      class="roc-date-picker__date-calendar"
      data-test="date-calendar"
    >
      <div class="roc-date-picker__week-day-container">
        <div
          v-for="day in WEEK_DAYS"
          :key="day"
          class="roc-date-picker__week-day-cell"
        >
          {{ getCalendarLang(lang).week[day] }}
        </div>
      </div>

      <div class="roc-date-picker__date-container">
        <button
          v-for="(date, index) in dateCells"
          :key="index"
          :class="[
            'roc-date-picker__date-cell',
            {
              'roc-date-picker__selected-date': isSelected(date),
              'roc-date-picker__today-date': isToday(date),
              'roc-date-picker__disabled-date': date && isDateDisabled(date),
            },
          ]"
          data-test="date-cell"
          type="button"
          :disabled="!date || isDateDisabled(date)"
          @click="handleSelectDate(date)"
        >
          {{ date }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { WEEK_DAYS } from '@/lib/constants';
import {
  CalendarType, Language, YearType, type SelectedTime
} from '@/lib/interfaces';
import {
  getCalendarLang, isCalendarDateDisabled, setDatePickerLabel
} from '@/lib/utils';
import dayjs from 'dayjs';
import {
  computed,
  defineComponent, ref, toRefs, watch, type PropType
} from 'vue';

const DEFAULT_SELECTED_TIME: SelectedTime = {
  label: '',
  timeValue: undefined
};

export default defineComponent({
  props: {
    calendarYear: {
      required: true,
      type: Number
    },
    calendarMonth: {
      required: true,
      type: Number
    },
    lang: {
      required: true,
      type: String as PropType<Language>
    },
    calendarYearType: {
      required: true,
      type: String as PropType<YearType>
    },
    defaultFullDate: {
      type: Object as PropType<SelectedTime>,
      default: () => ({ ...DEFAULT_SELECTED_TIME })
    },
    minDate: {
      type: [Date, String] as PropType<Date | string | undefined>,
      default: undefined
    },
    maxDate: {
      type: [Date, String] as PropType<Date | string | undefined>,
      default: undefined
    },
    disableWeekends: {
      type: Boolean,
      default: false
    },
    disabledDates: {
      type: Array as PropType<(Date | string)[]>,
      default: () => []
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      calendarYear,
      calendarMonth,
      calendarYearType,
      defaultFullDate,
      minDate,
      maxDate,
      disableWeekends,
      disabledDates
    } = toRefs(props);

    const isDateDisabled = (dateOnCalendar: number | null) => {
      if (!dateOnCalendar) return true;

      return isCalendarDateDisabled({
        targetDate: new Date(calendarYear.value, calendarMonth.value, dateOnCalendar),
        minDate: minDate.value,
        maxDate: maxDate.value,
        unit: 'day',
        disableWeekends: disableWeekends.value,
        disabledDates: disabledDates.value
      });
    };

    const dateCells = ref<(number | null)[]>([]);
    const selectedFullDate = ref<SelectedTime>({});

    const selectedDayjs = computed(() => {
      const { timeValue } = selectedFullDate.value;
      return timeValue ? dayjs(timeValue) : undefined;
    });
    const selectedYear = computed(() => selectedDayjs.value?.year());
    const selectedMonth = computed(() => selectedDayjs.value?.month());
    const selectedDate = computed(() => selectedDayjs.value?.date());

    const isSelected = (date: number | null): boolean => {
      if (
        selectedFullDate.value.timeValue
        && calendarYear.value === selectedYear.value
        && calendarMonth.value === selectedMonth.value
        && date === selectedDate.value
      ) {
        return true;
      }

      return false;
    };

    const isToday = (date: number | null): boolean => {
      if (!date) return false;

      const today = dayjs();
      const currentDate = dayjs(new Date(calendarYear.value, calendarMonth.value, date));

      return currentDate.isSame(today, 'day');
    };

    const handleSelectDate = (dateOnCalendar: number | null) => {
      if (!dateOnCalendar || isDateDisabled(dateOnCalendar)) return;

      const timeValue = new Date(calendarYear.value, calendarMonth.value, dateOnCalendar);
      selectedFullDate.value.timeValue = timeValue;

      selectedFullDate.value.label = setDatePickerLabel({
        calendarYearType: calendarYearType.value,
        selectedDate: timeValue,
        formatYear: timeValue.getFullYear(),
        datePickerType: CalendarType.DATE
      });

      emit('click', selectedFullDate.value);
    };

    const populateDateCalendar = () => {
      const targetMonth = dayjs(`${calendarYear.value}-${calendarMonth.value + 1}`);
      const firstDayOfTheWeek = targetMonth.day() ? targetMonth.day() : 7;
      //  returns 7 instead of returning 0 for Sunday
      const daysBeforeFirstDay = firstDayOfTheWeek - 1;
      const daysInMonth = targetMonth.daysInMonth();

      // create an array for v-for to render dates on calendar which matches the day of the week
      dateCells.value = [
        ...Array.from({ length: daysBeforeFirstDay }, () => null),
        ...Array.from({ length: daysInMonth }, (_, date) => date + 1)
      ];
    };

    watch(
      () => defaultFullDate.value?.timeValue,
      (timeValue) => {
        selectedFullDate.value = timeValue
          ? { ...defaultFullDate.value }
          : { ...DEFAULT_SELECTED_TIME };
        populateDateCalendar();
      },
      { immediate: true }
    );

    watch(defaultFullDate, () => {
      selectedFullDate.value = defaultFullDate.value || {};
    }, { deep: true });

    watch([calendarYear, calendarMonth], () => {
      populateDateCalendar();
    });

    return {
      WEEK_DAYS,
      dateCells,
      selectedFullDate,
      populateDateCalendar,
      isSelected,
      isToday,
      isDateDisabled,
      handleSelectDate,
      getCalendarLang
    };
  }
});
</script>

<style scoped lang="scss">
.roc-date-picker__date-calendar {
  width: 100%;
  height: 100%;
  color: #6a6c6d;
  font-family:
    Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.roc-date-picker__date-calendar button {
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  background: transparent;
  border: 0;
  font: inherit;
  line-height: 1;
  font-size: 16px;
  color: #6a6c6d;
  cursor: pointer;
}

.roc-date-picker__week-day-container {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  justify-items: stretch;
  padding: 4px 8px;
  border-bottom: 1px solid #CFCFCF;

  .roc-date-picker__week-day-cell {
    text-align: center;
    cursor: default;
  }
}

.roc-date-picker__date-container {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  justify-items: stretch;
  padding: 8px;

  .roc-date-picker__date-cell {
    cursor: pointer;
    padding: 10px;
    text-align: center;

    &:hover {
      color: #4390BC;
    }
  }

  .roc-date-picker__today-date {
    color: #4390BC;
    font-weight: 600;
  }

  .roc-date-picker__disabled-date {
    cursor: not-allowed;
    color: #c3c7ca;

    &:hover {
      color: #c3c7ca;
    }
  }

  .roc-date-picker__selected-date {
    position: relative;
    color: #ffffff;

    &:hover {
      color: #ffffff;
    }

    &::after {
      position: absolute;
      z-index: -1;
      content: '';
      width: 28px;
      height: 28px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -47%);
      border-radius: 50%;
      background: #4390BC;
    }
  }

  .roc-date-picker__selected-date.roc-date-picker__today-date,
  .roc-date-picker__selected-date.roc-date-picker__disabled-date {
    color: #ffffff;
  }
}
</style>
