<template>
  <div>
    <div class="date-picker-container">
      <div
        class="input-container"
        @keypress="toggleCalender"
        @click="toggleCalender"
      >
        <div class="input-icon">
          <CalendarDayIcon />
        </div>

        <input
          class="date-picker-input"
          :class="[
            `${ disabled ? 'cursor-not-allowed' : 'cursor-pointer' }`,
          ]"
          :value="selectedTime.label"
          :placeholder="placeholder"
          :disabled="disabled"
        />

        <button
          v-show="showClearButton"
          type="button"
          :class="[
            'hidden',
            {
              'clear-input-button__active': !disabled && selectedTime.label,
            }]"
          @click.stop="clearSelectedTime"
        >
          <XmarkIcon />
        </button>
      </div>

      <!-- calendar -->
      <div
        v-if="isCalendarVisible"
        class="calendar-container"
        :style="{ 'z-index': zIndex }"
      >
        <div class="calendar-header">
          <div class="prev-controller">
            <button
              v-if="isYearCalendarVisible && canGoLastDecade"
              type="button"
              class="controller-button"
              @click="goToLastDecade"
            >
              <AnglesLeftIcon />
            </button>

            <button
              v-if="!isYearCalendarVisible && canGoLastYear"
              type="button"
              class="controller-button"
              @click="goToLastYear"
            >
              <AnglesLeftIcon />
            </button>

            <button
              type="button"
              :class="[
                'controller-button',
                !isMonthCalendarVisible && !isYearCalendarVisible && canGoLastMonth ? 'inline-block' : 'hidden',
              ]"
              @click="goToLastMonth"
            >
              <AngleLeftIcon />
            </button>
          </div>

          <div class="year-month-controller">
            <button
              type="button"
              class="controller-button"
              @click="setCalendarVisibility(CALENDAR_TYPE.year)"
            >
              {{ displayYear }}
            </button>

            <button
              type="button"
              :class="
                ['controller-button',
                 !isMonthCalendarVisible && !isYearCalendarVisible ? 'inline-block' : 'hidden',
                ]"
              @click="setCalendarVisibility(CALENDAR_TYPE.month)"
            >
              {{ getCalendarLang(lang).month[monthOnCalendar] }}
            </button>
          </div>

          <div class="next-controller">
            <button
              type="button"
              :class="[
                'controller-button',
                !isMonthCalendarVisible && !isYearCalendarVisible ? 'inline-block' : 'hidden']"
              @click="goToNextMonth"
            >
              <AngleRightIcon />
            </button>

            <button
              v-if="isYearCalendarVisible"
              type="button"
              class="controller-button"
              @click="goToNextDecade"
            >
              <AnglesRightIcon />
            </button>

            <button
              v-else
              type="button"
              class="controller-button"
              @click="goToNextYear"
            >
              <AnglesRightIcon />
            </button>
          </div>
        </div>

        <div v-if="isYearCalendarVisible">
          <YearCalendar
            :type="type"
            :lang="lang"
            :calendar-year-type="yearType"
            :default-full-date="selectedTime"
            :calendar-year="yearOnCalendar"
            :decade-range="decadeRange"
            @click="handleYearChange"
          />
        </div>

        <div v-if="isMonthCalendarVisible">
          <MonthCalendar
            :type="type"
            :lang="lang"
            :calendar-year-type="yearType"
            :calendar-year="yearOnCalendar"
            :default-full-date="selectedTime"
            @click="handleMonthChange"
          />
        </div>

        <div v-if="isDateCalendarVisible">
          <DateCalendar
            :lang="lang"
            :calendar-year-type="yearType"
            :calendar-year="yearOnCalendar"
            :calendar-month="monthOnCalendar"
            :default-full-date="selectedTime"
            @click="handleDateChange"
          />
        </div>

        <YearTypeSelector
          :calendar-year-type="yearType"
          :has-republic-era-year="getRepublicEraYear(yearOnCalendar) > 0"
          :lang="lang"
          @change="handleChangeYearType"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onMounted, ref, toRefs, watch
} from 'vue';
import { getCalendarLang, getRepublicEraYear, setDatePickerLabel } from '@/utils';
import type { SelectedTime } from 'my-date-picker';
import { YEAR_TYPE, CALENDAR_TYPE } from '../constants/index';
import DateCalendar from './calendar/DateCalendar.vue';
import MonthCalendar from './calendar/MonthCalendar.vue';
import YearCalendar from './calendar/YearCalendar.vue';
import YearTypeSelector from './YearTypeSelector.vue';
import XmarkIcon from './icons/XmarkIcon.vue';
import AngleLeftIcon from './icons/AngleLeftIcon.vue';
import AnglesLeftIcon from './icons/AnglesLeftIcon.vue';
import AngleRightIcon from './icons/AngleRightIcon.vue';
import CalendarDayIcon from './icons/CalendarDayIcon.vue';
import AnglesRightIcon from './icons/AnglesRightIcon.vue';

const DEFAULT_SELECTED_TIME: SelectedTime = {
  label: '',
  timeValue: undefined
};

export default defineComponent({
  components: {
    XmarkIcon,
    AngleLeftIcon,
    AnglesLeftIcon,
    AngleRightIcon,
    CalendarDayIcon,
    AnglesRightIcon,
    DateCalendar,
    YearCalendar,
    MonthCalendar,
    YearTypeSelector
  },
  props: {
    lang: {
      type: String,
      default: 'zhTW'
    },
    calendarYearType: {
      type: String,
      default: YEAR_TYPE.RepublicEraYear
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: CALENDAR_TYPE.date
    },
    defaultValue: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    zIndex: {
      type: Number,
      default: 1
    },
    showClearButton: {
      type: Boolean,
      default: true
    }
  },
  emits: ['change'],
  setup(props, { emit }) {
    const {
      type, defaultValue, disabled, calendarYearType, lang
    } = toRefs(props);
    const isCalendarVisible = ref(false);
    const isDateCalendarVisible = ref(false);
    const isMonthCalendarVisible = ref(false);
    const isYearCalendarVisible = ref(false);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const decadeRange = ref<number[]>([]);
    const yearOnCalendar = ref(currentYear);
    const monthOnCalendar = ref(currentMonth);

    const yearType = ref(calendarYearType.value);
    const canGoLastYear = ref(true);
    const canGoLastMonth = ref(true);
    const canGoLastDecade = ref(true);
    const selectedTime = ref({ ...DEFAULT_SELECTED_TIME });

    const displayYear = computed(() => {
      if (yearType.value === YEAR_TYPE.CE) {
        return isYearCalendarVisible.value ? `${decadeRange?.value[0]} - ${decadeRange?.value[1]}` : yearOnCalendar.value;
      }
      const startYear = Math.max(getRepublicEraYear(decadeRange?.value[0]), 1);
      const endYear = getRepublicEraYear(decadeRange?.value[1]);

      if (lang.value === 'zhTW') {
        return isYearCalendarVisible.value ? `民國 ${startYear} - ${endYear} 年` : `民國 ${getRepublicEraYear(yearOnCalendar.value)} 年`;
      }
      return isYearCalendarVisible.value ? `ROC ${startYear} - ${endYear}` : `ROC ${getRepublicEraYear(yearOnCalendar.value)}`;
    });

    const setCalendarVisibility = (calendarType: string) => {
      const visibilityMap = {
        [CALENDAR_TYPE.date]: [true, false, false],
        [CALENDAR_TYPE.month]: [false, true, false],
        [CALENDAR_TYPE.year]: [false, false, true]
      };

      [isDateCalendarVisible.value,
        isMonthCalendarVisible.value,
        isYearCalendarVisible.value] = visibilityMap[calendarType];
    };

    const getDecadeRange = () => {
      const decade: number = Math.floor(yearOnCalendar.value / 10) * 10;
      decadeRange.value = [decade, decade + 9];

      if (
        (yearType.value === YEAR_TYPE.RepublicEraYear)
        && (getRepublicEraYear(decadeRange?.value[0]) < 1)
      ) {
        canGoLastDecade.value = false;
      } else if (decadeRange?.value[0] <= 100) {
        canGoLastDecade.value = false;
      } else {
        canGoLastDecade.value = true;
      }
    };

    const initCalendar = () => {
      getDecadeRange();

      setCalendarVisibility(type.value);

      if (defaultValue.value) {
        const defaultTime = new Date(defaultValue.value);
        const defaultYear = defaultTime.getFullYear();

        if ((yearType.value === YEAR_TYPE.RepublicEraYear) && (defaultYear <= 1911)) {
          yearType.value = YEAR_TYPE.CE;
        } else {
          yearType.value = calendarYearType.value;
        }

        selectedTime.value.label = setDatePickerLabel({
          calendarYearType: yearType.value,
          selectedDateObject: defaultTime,
          formatYear: defaultYear,
          datePickerType: type.value
        });

        selectedTime.value.timeValue = defaultTime;

        monthOnCalendar.value = new Date(defaultTime).getMonth();
        yearOnCalendar.value = new Date(defaultTime).getFullYear();
      }
    };

    const toggleCalender = () => {
      if (disabled.value) return;
      isCalendarVisible.value = !isCalendarVisible.value;
    };

    const goToNextMonth = () => {
      if (type.value === CALENDAR_TYPE.month) return;
      yearOnCalendar.value = (monthOnCalendar.value === 11) ? yearOnCalendar.value + 1 : yearOnCalendar.value;
      monthOnCalendar.value = (monthOnCalendar.value + 1) % 12;
    };

    const goToLastMonth = () => {
      if (type.value === CALENDAR_TYPE.month) return;
      yearOnCalendar.value = (monthOnCalendar.value === 0) ? yearOnCalendar.value - 1 : yearOnCalendar.value;
      monthOnCalendar.value = (monthOnCalendar.value === 0) ? 11 : monthOnCalendar.value - 1;
    };

    const goToYear = (year: number) => {
      yearOnCalendar.value = year;
      getDecadeRange();
    };

    const goToNextYear = () => {
      goToYear(yearOnCalendar.value + 1);
    };

    const goToLastYear = () => {
      goToYear(yearOnCalendar.value - 1);
    };

    const goToNextDecade = () => {
      goToYear(yearOnCalendar.value + 10);
    };

    const goToLastDecade = () => {
      goToYear(yearOnCalendar.value - 10);
    };

    const handleDateChange = (time: any) => {
      selectedTime.value = time;
      isCalendarVisible.value = false;

      emit('change', selectedTime.value.timeValue);
    };

    const handleMonthChange = (time: any) => {
      selectedTime.value = time;

      if (type.value === CALENDAR_TYPE.date) {
        setCalendarVisibility(CALENDAR_TYPE.date);

        monthOnCalendar.value = new Date(time.timeValue).getMonth();
        return;
      }

      isCalendarVisible.value = false;

      emit('change', selectedTime.value.timeValue);
    };

    const handleYearChange = (time: any) => {
      selectedTime.value = time;

      if (type.value !== CALENDAR_TYPE.year) {
        setCalendarVisibility(CALENDAR_TYPE.month);

        yearOnCalendar.value = new Date(time.timeValue).getFullYear();
        return;
      }

      isCalendarVisible.value = false;
      emit('change', selectedTime.value.timeValue);
    };

    const handleChangeYearType = (selectedYearType: string) => {
      yearType.value = selectedYearType;
      getDecadeRange();
    };

    const clearSelectedTime = () => {
      if (disabled.value) return;
      selectedTime.value = { ...DEFAULT_SELECTED_TIME };
      isCalendarVisible.value = false;

      emit('change', selectedTime.value.timeValue);
    };

    onMounted(() => {
      initCalendar();
    });

    watch([yearOnCalendar, yearType], () => {
      if (
        yearType.value === YEAR_TYPE.RepublicEraYear
        && yearOnCalendar.value <= 1912
      ) {
        canGoLastYear.value = false;
      } else if (decadeRange?.value[0] <= 100) {
        canGoLastYear.value = false;
      } else {
        canGoLastYear.value = true;
      }
    });

    watch([yearOnCalendar, yearType, monthOnCalendar], () => {
      if (
        yearType.value === YEAR_TYPE.RepublicEraYear
        && yearOnCalendar.value <= 1912
        && monthOnCalendar.value === 0
      ) {
        canGoLastMonth.value = false;
      } else {
        canGoLastMonth.value = true;
      }
    });

    return {
      yearType,
      displayYear,
      decadeRange,
      selectedTime,
      canGoLastYear,
      yearOnCalendar,
      canGoLastMonth,
      canGoLastDecade,
      monthOnCalendar,
      isCalendarVisible,
      isDateCalendarVisible,
      isMonthCalendarVisible,
      isYearCalendarVisible,
      CALENDAR_TYPE,
      goToNextYear,
      goToLastYear,
      goToNextMonth,
      goToLastMonth,
      toggleCalender,
      goToNextDecade,
      goToLastDecade,
      getCalendarLang,
      handleDateChange,
      handleYearChange,
      clearSelectedTime,
      handleMonthChange,
      getRepublicEraYear,
      handleChangeYearType,
      setCalendarVisibility
    };
  }
});
</script>

<style scoped lang="scss">
button {
  background: transparent;
  border-style: none;
}

.date-picker-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.input-container {
  width: 100%;
  height: 100%;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #cbd2d5;

  .input-icon {
    padding: 0px 4px;
  }

  .date-picker-input {
    width: 100%;
    height: 100%;
    padding: 2px;
    background:#ffffff;
    border-style: none;

    &:focus {
      outline-style: none;
    }
  }

  &:hover {
    .clear-input-button__active {
      position: absolute;
      display: block !important;
      cursor: pointer;
      right: 4px;
      top: 0;
      bottom: 0;
    }
  }
}

.calendar-container {
  position: absolute;
  border-radius: 4px;
  top: 120%;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
  background: #ffffff;
  padding: 8px;
  color: #6a6c6d;
  width: 300px;
}

.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 2px;

  .prev-controller, .next-controller {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .year-month-controller {
    display: flex;
    flex-grow: 1;
    justify-content: center;
    transform: translate(0, -1px);

    .controller-button {
      font-size: 16px;
      &:hover {
        color: #4390BC;
      }
    }
  }

  .controller-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 4px;
  }
}
</style>
