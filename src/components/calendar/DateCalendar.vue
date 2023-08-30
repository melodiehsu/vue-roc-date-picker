<template>
  <div>
    <div class="calendar-wrapper">
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
        <div
          v-for="(date, index) in datesOnCalendar"
          :key="index"
          class="date-cell"
          :class="{ 'cursor-pointer': date, 'selected-date': isSelected(date) }"
          @keypress="handleSelectDate(date)"
          @click="handleSelectDate(date)"
        >
          {{ date }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CALENDAR_TYPE, WEEK_DAYS } from '@/constants';
import { getCalendarLang, setDatePickerLabel } from '@/utils';
import dayjs from 'dayjs';
import type { SelectedTime } from 'my-date-picker';
import {
  computed,
  defineComponent, onMounted, ref, toRefs, watch, type PropType
} from 'vue';

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
      type: String
    },
    calendarYearType: {
      required: true,
      type: String
    },
    defaultFullDate: {
      type: Object as PropType<SelectedTime>,
      default: () => {}
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      calendarYear, calendarMonth, calendarYearType, defaultFullDate
    } = toRefs(props);
    const datesOnCalendar = ref<number[]>();
    const selectedFullDate = ref();

    const selectedYear = computed(() => dayjs(selectedFullDate.value.timeValue).year());
    const selectedMonth = computed(() => dayjs(selectedFullDate.value.timeValue).month());
    const selectedDate = computed(() => dayjs(selectedFullDate.value.timeValue).date());

    const isSelected = (date: number): boolean => {
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

    const handleSelectDate = (dateOnCalendar: number) => {
      selectedFullDate.value.timeValue = new Date(calendarYear.value, calendarMonth.value, dateOnCalendar);

      selectedFullDate.value.label = setDatePickerLabel({
        calendarYearType: calendarYearType.value,
        selectedDateObject: selectedFullDate.value.timeValue,
        formatYear: selectedYear.value,
        datePickerType: CALENDAR_TYPE.date
      });

      emit('click', selectedFullDate.value);
    };

    // TODO: consider use Array.fill to populate date calendar instead of using for loop
    const populateDateCalendar = (year: number, month: number) => {
      const datesOfMonth = [];
      const momentYearMonth = dayjs(`${year}-${month + 1}`);

      const firstDay = momentYearMonth.day() ? momentYearMonth.day() : 7;
      // instead of returning 0 for Sunday, returns 7 so that it can push correct numbers of null to datesOfMonth
      const daysInMonth = momentYearMonth.daysInMonth();

      // if the first day is Tuesday, the date shall be filled from the 2nd value in the array
      for (let weekDay = 1; weekDay < firstDay; weekDay += 1) {
        datesOfMonth.push(null);
      }

      // fill out the dates
      for (let date = 0; date < daysInMonth; date += 1) {
        datesOfMonth.push(date + 1);
      }

      return datesOfMonth as number[];
    };

    onMounted(() => {
      if (defaultFullDate.value) {
        selectedFullDate.value = defaultFullDate.value;
      }

      datesOnCalendar.value = populateDateCalendar(calendarYear.value, calendarMonth.value);
    });

    watch([calendarYear, calendarMonth], ([newCalendarYear, newCalendarMonth]) => {
      datesOnCalendar.value = populateDateCalendar(newCalendarYear, newCalendarMonth);
    });

    return {
      WEEK_DAYS,
      datesOnCalendar,
      isSelected,
      handleSelectDate,
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
}
</style>
