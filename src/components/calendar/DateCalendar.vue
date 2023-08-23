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
import { WEEK_DAYS } from '@/constants';
import { getCalendarLang, setDatePickerLabel } from '@/utils';
import dayjs from 'dayjs';
import {
  computed,
  defineComponent, onMounted, ref, toRefs, watch
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
      type: Object,
      default: () => {}
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      calendarYear, calendarMonth, calendarYearType, defaultFullDate
    } = toRefs(props);
    const datesOnCalendar = ref<number[]>([]);
    const selectedFullDate = ref({});

    const selectedYear = computed(() => dayjs(selectedFullDate.value.timeValue).year());

    const selectedMonth = computed(() => dayjs(selectedFullDate.value.timeValue).month());

    const selectedDate = computed(() => dayjs(selectedFullDate.value.timeValue).date());

    const isSelected = (date) => {
      if (!selectedFullDate.value.timeValue) return;

      if (
        (calendarYear.value === selectedYear.value)
        && (calendarMonth.value === selectedMonth.value)
        && (date === selectedDate.value)
      ) {
        return true;
      }
    };

    const handleSelectDate = (dateOnCalendar) => {
      selectedFullDate.value.timeValue = new Date(calendarYear.value, calendarMonth.value, dateOnCalendar);

      selectedFullDate.value.label = setDatePickerLabel({
        calendarYearType: calendarYearType.value,
        selectedDateObject: selectedFullDate.value.timeValue,
        formatYear: selectedYear.value
      });

      emit('click', selectedFullDate.value);
    };

    // TODO: consider use Array.fill to populate date calendar instead of using for loop
    const populateDateCalendar = (year, month) => {
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

      return datesOfMonth;
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
  border-bottom: 1px solid #000000;

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
    padding: 4px;
    text-align: center;

    &:hover {
      color: blue;
    }
  }

  .selected-date {
    border-radius: 4px;
    /* TODO(melody): color */
    background: #000000;
    color: #ffffff;
  }
}
</style>