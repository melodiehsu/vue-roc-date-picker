<template>
  <div>
    <div class="calendar-wrapper" data-test="year-calendar">
      <div class="year-container">
        <button
          v-for="(year, index) in years"
          :key="index"
          :class="[
            'year-cell',
            {
              'selected-year': isSelected(year),
              'cursor-pointer': !isYearDisabled(year),
              'disabled-year': isYearDisabled(year),
            },
          ]"
          data-test="year-cell"
          type="button"
          :disabled="isYearDisabled(year)"
          @click="handleSelectYear(year)"
        >
          {{ calendarYearType === YearType.CommonEra ? year : getRepublicEraYear(year) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  getRepublicEraYear, isDateOutsideRange, setDatePickerLabel
} from '@/lib/utils';
import {
  CalendarType, Language, YearType, type SelectedTime
} from '@/lib/interfaces';
import {
  computed, defineComponent, ref, toRefs, watch, type PropType
} from 'vue';
import dayjs from 'dayjs';

const DEFAULT_SELECTED_TIME: SelectedTime = {
  label: '',
  timeValue: undefined
};

export default defineComponent({
  props: {
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
    type: {
      required: true,
      type: String as PropType<CalendarType>
    },
    decadeRange: {
      required: true,
      type: Array as PropType<number[]>
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
      defaultFullDate, calendarYearType, type, decadeRange, minDate, maxDate
    } = toRefs(props);
    const selectedFullDate = ref<SelectedTime>({});
    const years = ref<number[]>([]);

    const selectedDayjs = computed(() => {
      const { timeValue } = selectedFullDate.value;
      return timeValue ? dayjs(timeValue) : undefined;
    });
    const selectedYear = computed(() => selectedDayjs.value?.year());

    const populateYearCalendar = () => {
      years.value = [];

      for (let yearCount = 0; yearCount < 10; yearCount += 1) {
        years.value.push(decadeRange.value[0] + yearCount);
      }

      if (
        (calendarYearType.value === YearType.RepublicEra)
        && ((years.value[0] - 1911) < 1)
      ) {
        years.value = years.value.filter((year) => year > 1911);
      }
    };

    const isSelected = (year: number): boolean => {
      if (
        selectedFullDate.value.timeValue
        && year === selectedYear.value
      ) {
        return true;
      }

      return false;
    };

    const isYearDisabled = (year: number) => isDateOutsideRange({
      targetDate: new Date(year, 0, 1),
      minDate: minDate.value,
      maxDate: maxDate.value,
      unit: 'year'
    });

    const handleSelectYear = (yearOnCalendar: number) => {
      if (isYearDisabled(yearOnCalendar)) return;

      const timeValue = new Date(yearOnCalendar, 0);
      selectedFullDate.value.timeValue = timeValue;

      if (type.value === CalendarType.YEAR) {
        selectedFullDate.value.label = setDatePickerLabel({
          calendarYearType: calendarYearType.value,
          selectedDate: timeValue,
          formatYear: timeValue.getFullYear(),
          datePickerType: CalendarType.YEAR
        });
      }

      emit('click', selectedFullDate.value);
    };

    watch(decadeRange, () => {
      populateYearCalendar();
    }, { deep: true, immediate: true });

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
      YearType,
      years,
      selectedFullDate,
      isSelected,
      isYearDisabled,
      handleSelectYear,
      getRepublicEraYear
    };
  }
});
</script>

<style scoped lang="scss">
button {
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

.calendar-wrapper {
  width: 100%;
  height: 100%;
}

.year-container {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  justify-items: stretch;
  padding: 8px;

  .year-cell {
    padding: 8px 4px;
    text-align: center;

    &:hover {
      color: #4390BC;
    }
  }

  .disabled-year {
    cursor: not-allowed;
    color: #c3c7ca;

    &:hover {
      color: #c3c7ca;
    }
  }

  .selected-year {
    font-weight: 600;
    color: #4390BC;
  }

  .selected-year.disabled-year {
    color: #4390BC;
  }
}
</style>
