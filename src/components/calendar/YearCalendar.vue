<template>
  <div>
    <div class="calendar-wrapper" data-test="year-calendar">
      <div class="year-container">
        <button
          v-for="(year, index) in years"
          :key="index"
          :class="[
            'year-cell cursor-pointer',
            {
              'selected-year': isSelected(year),
            },
          ]"
          data-test="year-cell"
          type="button"
          @click="handleSelectYear(year)"
        >
          {{ calendarYearType === YearType.CommonEra ? year : getRepublicEraYear(year) }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getRepublicEraYear, setDatePickerLabel } from '@/utils';
import {
  CalendarType, Language, YearType, type SelectedTime
} from '@/interfaces';
import {
  computed, defineComponent, ref, toRefs, watch, type PropType
} from 'vue';

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
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      defaultFullDate, calendarYearType, type, decadeRange
    } = toRefs(props);
    const selectedFullDate = ref<SelectedTime>({});
    const years = ref<number[]>([]);
    const selectedYear = computed(() => new Date(selectedFullDate.value.timeValue as Date).getFullYear());

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

    const handleSelectYear = (yearOnCalendar: number) => {
      const selectedDate = new Date(yearOnCalendar, 0);
      selectedFullDate.value.timeValue = selectedDate;

      if (type.value === CalendarType.YEAR) {
        selectedFullDate.value.label = setDatePickerLabel({
          calendarYearType: calendarYearType.value,
          selectedDate,
          formatYear: selectedDate.getFullYear(),
          datePickerType: CalendarType.YEAR
        });
      }

      emit('click', selectedFullDate.value);
    };

    watch(decadeRange, () => {
      populateYearCalendar();
    }, { deep: true, immediate: true });

    watch(defaultFullDate, (value) => {
      selectedFullDate.value = value?.timeValue
        ? { ...value }
        : { ...DEFAULT_SELECTED_TIME };
    }, { deep: true, immediate: true });

    return {
      YearType,
      years,
      selectedFullDate,
      isSelected,
      handleSelectYear,
      getRepublicEraYear
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

  .selected-year {
    font-weight: 600;
    color: #4390BC;
  }
}
</style>
