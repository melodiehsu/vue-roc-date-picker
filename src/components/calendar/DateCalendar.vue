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
        <button
          v-for="(date, index) in dateCells"
          :key="index"
          :class="[
            'date-cell',
            {
              'cursor-pointer': date, 'selected-date': isSelected(date),
            },
          ]"
          type="button"
          @click="handleSelectDate(date)"
        >
          {{ date }}
        </button>
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
    const dateCells = ref<(number | null)[]>([]);
    const selectedFullDate = ref<SelectedTime>({});

    const selectedYear = computed(() => dayjs(selectedFullDate.value.timeValue).year());
    const selectedMonth = computed(() => dayjs(selectedFullDate.value.timeValue).month());
    const selectedDate = computed(() => dayjs(selectedFullDate.value.timeValue).date());

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

    const handleSelectDate = (dateOnCalendar: number | null) => {
      if (!dateOnCalendar) return;
      selectedFullDate.value.timeValue = new Date(calendarYear.value, calendarMonth.value, dateOnCalendar);

      selectedFullDate.value.label = setDatePickerLabel({
        calendarYearType: calendarYearType.value,
        selectedDateObject: selectedFullDate.value.timeValue,
        formatYear: selectedYear.value,
        datePickerType: CALENDAR_TYPE.date
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

    onMounted(() => {
      if (defaultFullDate.value) {
        selectedFullDate.value = defaultFullDate.value;
      }
      populateDateCalendar();
    });

    watch([calendarYear, calendarMonth], () => {
      populateDateCalendar();
    });

    return {
      WEEK_DAYS,
      dateCells,
      selectedFullDate,
      populateDateCalendar,
      isSelected,
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
