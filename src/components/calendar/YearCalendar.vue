<template>
  <div>
    <div class="calendar-wrapper">
      <div class="year-container">
        <div
          v-for="(year, index) in years"
          :key="index"
          class="year-cell cursor-pointer"
          :class="{ 'selected-year': isSelected(year) }"
          @keypress="handleSelectYear(year)"
          @click="handleSelectYear(year)"
        >
          {{ calendarYearType === 'CE' ? year : getRepublicEraYear(year) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { CALENDAR_TYPE } from '@/constants';
import { getCalendarLang, getRepublicEraYear, setDatePickerLabel } from '@/utils';
import {
  computed, defineComponent, onMounted, ref, toRefs, watch
} from 'vue';

export default defineComponent({
  props: {
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
    },
    type: {
      required: true,
      type: String
    },
    decadeRange: {
      required: true,
      type: Array,
      default: () => []
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const {
      defaultFullDate, calendarYearType, type, decadeRange
    } = toRefs(props);
    const selectedFullDate = ref({});
    const years = ref([]);
    const selectedYear = computed(() => new Date(selectedFullDate.value.timeValue).getFullYear());

    const populateYearCalendar = () => {
      years.value = [];

      for (let yearCount = 0; yearCount < 10; yearCount += 1) {
        years.value.push(decadeRange.value[0] + yearCount);
      }

      if ((calendarYearType.value === 'RepublicEraYear') && ((years.value[0] - 1911) < 1)) {
        years.value = years.value.filter((year) => year > 1911);
      }
    };

    const isSelected = (year) => {
      if (!selectedFullDate.value.timeValue) return;

      if (year === selectedYear.value) {
        return true;
      }
    };

    const handleSelectYear = (yearOnCalendar) => {
      selectedFullDate.value.timeValue = new Date(yearOnCalendar, 0);

      if (type.value === CALENDAR_TYPE.year) {
        selectedFullDate.value.label = setDatePickerLabel({
          calendarYearType: calendarYearType.value,
          selectedDateObject: selectedFullDate.value.timeValue,
          formatYear: selectedYear.value,
          datePickerType: CALENDAR_TYPE.year
        });
      }

      emit('click', selectedFullDate.value);
    };

    onMounted(() => {
      populateYearCalendar();
      if (defaultFullDate.value) {
        selectedFullDate.value = defaultFullDate.value;
      }
    });

    watch(decadeRange, () => {
      populateYearCalendar();
    }, { deep: true });

    return {
      years,
      isSelected,
      handleSelectYear,
      getCalendarLang,
      getRepublicEraYear
    };
  }
});
</script>

<style scoped lang="scss">
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
      /* TODO(melody): color */
      color: blue;
    }
  }

  .selected-year {
    border-radius: 4px;
    /* TODO(melody): color */
    background: #000000;
    color: #ffffff;
  }
}
</style>
