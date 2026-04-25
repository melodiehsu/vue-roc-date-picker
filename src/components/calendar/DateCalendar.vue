<template>
  <div>
    <div class="calendar-wrapper" data-test="date-calendar">
      <div class="week-day-container">
        <div
          v-for="day in WEEK_DAYS"
          :key="day"
          class="week-day-cell cursor-default"
        >
          {{ getCalendarLang(lang).week[day] }}
        </div>
      </div>

      <div class="date-container">
        <button
          v-for="(date, index) in dateCells"
          :key="index"
          :class="[
            'date-cell',
            {
              'cursor-pointer': date && !isDateDisabled(date),
              'selected-date': isSelected(date),
              'today-date': isToday(date),
              'disabled-date': date && isDateDisabled(date),
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
import { WEEK_DAYS } from '@/constants';
import {
  CalendarType, Language, YearType, type SelectedTime
} from '@/interfaces';
import {
  getCalendarLang, isDateOutOfRange, setDatePickerLabel
} from '@/utils';
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
      type: [Date, String],
      default: ''
    },
    maxDate: {
      type: [Date, String],
      default: ''
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      calendarYear, calendarMonth, calendarYearType, defaultFullDate, minDate, maxDate
    } = toRefs(props);
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

    const isDateDisabled = (date: number | null) => {
      if (!date) return false;

      return isDateOutOfRange({
        targetDate: new Date(calendarYear.value, calendarMonth.value, date),
        minDate: minDate.value,
        maxDate: maxDate.value
      });
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

.week-day-container {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  justify-items: stretch;
  padding: 4px 8px;
  border-bottom: 1px solid #CFCFCF;

  .week-day-cell {
    text-align: center;
  }
}

.date-container {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  justify-items: stretch;
  padding: 8px;

  .date-cell {
    padding: 10px;
    text-align: center;

    &:hover {
      color: #4390BC;
    }
  }

  .today-date {
    color: #4390BC;
    font-weight: 600;
  }

  .disabled-date {
    cursor: not-allowed;
    color: #c3c7ca;

    &:hover {
      color: #c3c7ca;
    }
  }

  .selected-date {
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

  .selected-date.today-date,
  .selected-date.disabled-date {
    color: #ffffff;
  }
}
</style>
