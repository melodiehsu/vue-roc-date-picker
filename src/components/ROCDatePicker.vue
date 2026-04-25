<template>
  <div>
    <div
      ref="datePickerRef"
      class="date-picker-container"
    >
      <div
        class="input-container"
        :class="{ 'input-container--disabled': disabled }"
        tabindex="0"
        role="button"
        aria-haspopup="dialog"
        :aria-disabled="disabled"
        :aria-expanded="isCalendarVisible"
        @click="toggleCalendar"
        @keydown.enter.prevent="toggleCalendar"
        @keydown.space.prevent="toggleCalendar"
      >
        <div class="input-icon">
          <CalendarDayIcon />
        </div>

        <input
          class="date-picker-input"
          data-test="date-picker-input"
          :class="[
            `${ disabled ? 'cursor-not-allowed' : 'cursor-pointer' }`,
          ]"
          :value="selectedTime.label"
          :placeholder="placeholder"
          readonly
          :disabled="disabled"
          readonly
          tabindex="-1"
        />

        <button
          v-show="showClearButton"
          type="button"
          aria-label="Clear selected date"
          :class="['clear-input-button',
                   {
                     'clear-input-button--hover': !disabled && selectedTime.label,
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
              data-test="last-decade"
              @click="goToLastDecade"
            >
              <AnglesLeftIcon />
            </button>

            <button
              v-if="!isYearCalendarVisible && canGoLastYear"
              type="button"
              class="controller-button"
              data-test="last-year"
              @click="goToLastYear"
            >
              <AnglesLeftIcon />
            </button>

            <button
              v-show="isDateCalendarVisible && canGoLastMonth"
              type="button"
              class="controller-button"
              data-test="last-month"
              @click="goToLastMonth"
            >
              <AngleLeftIcon />
            </button>
          </div>

          <div class="year-month-controller">
            <button
              type="button"
              class="controller-button"
              data-test="year-button"
              @click="setCalendarVisibility(CalendarType.YEAR)"
            >
              {{ displayYear }}
            </button>

            <button
              v-show="isDateCalendarVisible"
              type="button"
              class="controller-button"
              data-test="month-button"
              @click="setCalendarVisibility(CalendarType.MONTH)"
            >
              {{ getMonthLabel(monthOnCalendar) }}
            </button>
          </div>

          <div class="next-controller">
            <button
              v-show="isDateCalendarVisible && canGoNextMonth"
              type="button"
              class="controller-button"
              data-test="next-month"
              @click="goToNextMonth"
            >
              <AngleRightIcon />
            </button>

            <button
              v-if="isYearCalendarVisible && canGoNextDecade"
              type="button"
              class="controller-button"
              data-test="next-decade"
              @click="goToNextDecade"
            >
              <AnglesRightIcon />
            </button>

            <button
              v-else-if="!isYearCalendarVisible && canGoNextYear"
              type="button"
              class="controller-button"
              data-test="next-year"
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
            :min-date="minDate"
            :max-date="maxDate"
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
            :min-date="minDate"
            :max-date="maxDate"
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
            :min-date="minDate"
            :max-date="maxDate"
            @click="handleDateChange"
          />
        </div>

        <div
          v-if="showTodayButton && type === CalendarType.DATE"
          class="calendar-footer"
        >
          <button
            type="button"
            class="today-button"
            data-test="today-button"
            :disabled="isTodayDisabled"
            @click="selectToday"
          >
            {{ getCalendarLang(lang).action.today }}
          </button>
        </div>

        <YearTypeSwitch
          :calendar-year-type="yearType"
          :is-visible="isSwitchAllowed"
          :lang="lang"
          @click="handleChangeYearType"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watch, type PropType
} from 'vue';
import dayjs, { type ConfigType } from 'dayjs';
import {
  getCalendarLang,
  getRepublicEraYear,
  getValidDate,
  isDateOutOfRange,
  setDatePickerLabel
} from '@/utils';
import {
  Language, YearType, type SelectedTime, CalendarType
} from '@/interfaces';
import DateCalendar from './calendar/DateCalendar.vue';
import MonthCalendar from './calendar/MonthCalendar.vue';
import YearCalendar from './calendar/YearCalendar.vue';
import YearTypeSwitch from './YearTypeSwitch.vue';
import XmarkIcon from './icons/XmarkIcon.vue';
import AngleLeftIcon from './icons/AngleLeftIcon.vue';
import AnglesLeftIcon from './icons/AnglesLeftIcon.vue';
import AngleRightIcon from './icons/AngleRightIcon.vue';
import CalendarDayIcon from './icons/CalendarDayIcon.vue';
import AnglesRightIcon from './icons/AnglesRightIcon.vue';

// Constants
const DEFAULT_SELECTED_TIME: SelectedTime = {
  label: '',
  timeValue: undefined
};
const REPUBLIC_ERA_START_YEAR = 1911;
const REPUBLIC_ERA_START_YEAR_DECADE = 1910;

const EMPTY_VALUE = '';

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
    YearTypeSwitch
  },
  props: {
    modelValue: {
      type: [Date, String] as PropType<Date | string>,
      default: EMPTY_VALUE
    },
    lang: {
      type: String as PropType<Language>,
      default: Language.ZH_TW
    },
    calendarYearType: {
      type: String as PropType<YearType>,
      default: YearType.RepublicEra
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String as PropType<CalendarType>,
      default: CalendarType.DATE
    },
    defaultValue: {
      type: [Date, String],
      default: ''
    },
    minDate: {
      type: [Date, String],
      default: ''
    },
    maxDate: {
      type: [Date, String],
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
    },
    showTodayButton: {
      type: Boolean,
      default: false
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const {
      type,
      defaultValue,
      disabled,
      calendarYearType,
      lang,
      modelValue,
      minDate,
      maxDate,
      closeOnClickOutside
    } = toRefs(props);
    const datePickerRef = ref<HTMLElement | null>(null);
    const isCalendarVisible = ref(false);
    const isDateCalendarVisible = ref(false);
    const isMonthCalendarVisible = ref(false);
    const isYearCalendarVisible = ref(false);

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    const decadeRange = ref<number[]>([]);
    const yearOnCalendar = ref(currentYear);
    const monthOnCalendar = ref(currentMonth);

    const yearType = ref<YearType>(calendarYearType.value);
    const canGoLastYear = ref(true);
    const canGoLastMonth = ref(true);
    const canGoLastDecade = ref(true);
    const canGoNextYear = ref(true);
    const canGoNextMonth = ref(true);
    const canGoNextDecade = ref(true);
    const selectedTime = ref<SelectedTime>({ ...DEFAULT_SELECTED_TIME });
    const isTodayDisabled = computed(() => isDateOutOfRange({
      targetDate: new Date(),
      minDate: minDate.value,
      maxDate: maxDate.value
    }));

    const displayYear = computed(() => {
      const startYear = decadeRange?.value[0];
      const endYear = decadeRange?.value[1];
      const startYearLabel = lang.value === 'zhTW' ? '民國 ' : 'ROC ';
      const endYearLabel = lang.value === 'zhTW' ? ' 年' : '';

      if (yearType.value === YearType.CommonEra) {
        return isYearCalendarVisible.value ? `${startYear} - ${endYear}` : yearOnCalendar.value;
      }

      return isYearCalendarVisible.value
        ? `${startYearLabel}${Math.max(getRepublicEraYear(startYear), 1)} - ${getRepublicEraYear(endYear)}${endYearLabel}`
        : `${startYearLabel}${getRepublicEraYear(yearOnCalendar.value)}${endYearLabel}`;
    });

    const syncLabelByCurrentState = () => {
      if (!selectedTime.value.timeValue) return;

      selectedTime.value.label = setDatePickerLabel({
        calendarYearType: yearType.value,
        selectedDate: selectedTime.value.timeValue,
        formatYear: selectedTime.value.timeValue.getFullYear(),
        datePickerType: type.value
      });
    };

    const getResolvedYearType = (dateValue?: Date, preferredYearType = calendarYearType.value) => {
      if (dateValue && preferredYearType === YearType.RepublicEra && dateValue.getFullYear() <= 1911) {
        return YearType.CommonEra;
      }

      return preferredYearType;
    };

    const syncSelectedTime = (dateValue?: Date) => {
      if (!dateValue) {
        selectedTime.value = { ...DEFAULT_SELECTED_TIME };
        return;
      }

      yearType.value = getResolvedYearType(dateValue);
      selectedTime.value = {
        label: setDatePickerLabel({
          calendarYearType: yearType.value,
          selectedDate: dateValue,
          formatYear: dateValue.getFullYear(),
          datePickerType: type.value
        }),
        timeValue: dateValue
      };
      monthOnCalendar.value = dateValue.getMonth();
      yearOnCalendar.value = dateValue.getFullYear();
    };

    const isSwitchAllowed = computed(() => {
      // if currently selecting year, return the year on calendar is larger than the decade
      if (isYearCalendarVisible.value) {
        const beginDecadeYearOnCalendar = yearOnCalendar.value - (yearOnCalendar.value % 10);
        return beginDecadeYearOnCalendar >= REPUBLIC_ERA_START_YEAR_DECADE; // 1912 - (1912 % 10)
      }
      return getRepublicEraYear(yearOnCalendar.value) > 0;
    });
    const getMonthLabel = (month: number) => Object.values(getCalendarLang(lang.value).month)[month] || '';

    const getDecadeRange = () => {
      const decadeStartYear: number = Math.floor(yearOnCalendar.value / 10) * 10;
      decadeRange.value = [decadeStartYear, decadeStartYear + 9];
    };

    const updateCalendarControls = () => {
      const currentDecadeStart = Math.floor(yearOnCalendar.value / 10) * 10;
      const nextYearValue = yearOnCalendar.value + 1;
      const previousYearValue = yearOnCalendar.value - 1;
      const previousMonthYear = monthOnCalendar.value === 0 ? yearOnCalendar.value - 1 : yearOnCalendar.value;
      const previousMonthValue = monthOnCalendar.value === 0 ? 11 : monthOnCalendar.value - 1;
      const nextMonthYear = monthOnCalendar.value === 11 ? yearOnCalendar.value + 1 : yearOnCalendar.value;
      const nextMonthValue = (monthOnCalendar.value + 1) % 12;

      canGoLastYear.value = !((yearType.value === YearType.RepublicEra
        && yearOnCalendar.value <= 1912)
        || currentDecadeStart <= 100
        || isDateOutOfRange({
          targetDate: new Date(
            previousYearValue,
            isMonthCalendarVisible.value ? 11 : monthOnCalendar.value,
            1
          ),
          minDate: minDate.value,
          unit: isMonthCalendarVisible.value ? 'year' : 'month'
        })
      );

      canGoLastMonth.value = !(yearType.value === YearType.RepublicEra
        && yearOnCalendar.value <= 1912
        && monthOnCalendar.value === 0)
        && !isDateOutOfRange({
          targetDate: new Date(previousMonthYear, previousMonthValue, 1),
          minDate: minDate.value,
          unit: 'month'
        });

      canGoLastDecade.value = currentDecadeStart > 100
        && !((yearType.value === YearType.RepublicEra)
        && getRepublicEraYear(currentDecadeStart) < 1);
      canGoLastDecade.value = canGoLastDecade.value && !isDateOutOfRange({
        targetDate: new Date(currentDecadeStart - 1, 11, 31),
        minDate: minDate.value,
        unit: 'year'
      });

      canGoNextYear.value = !isDateOutOfRange({
        targetDate: new Date(nextYearValue, monthOnCalendar.value, 1),
        maxDate: maxDate.value,
        unit: isMonthCalendarVisible.value ? 'year' : 'month'
      });

      canGoNextMonth.value = !isDateOutOfRange({
        targetDate: new Date(nextMonthYear, nextMonthValue, 1),
        maxDate: maxDate.value,
        unit: 'month'
      });

      canGoNextDecade.value = !isDateOutOfRange({
        targetDate: new Date(currentDecadeStart + 10, 0, 1),
        maxDate: maxDate.value,
        unit: 'year'
      });
    };

    const getResolvedValue = () => modelValue.value ?? defaultValue.value;
    const getParsedDate = (value: ConfigType) => {
      if (value == null) return null;
      const parsedDate = dayjs(value);
      return parsedDate.isValid() ? parsedDate.toDate() : null;
    };

    const setCalendarVisibility = (calendarType: CalendarType) => {
      getDecadeRange();
      const visibilityMap = {
        [CalendarType.DATE]: [true, false, false],
        [CalendarType.MONTH]: [false, true, false],
        [CalendarType.YEAR]: [false, false, true]
      };

      [isDateCalendarVisible.value,
        isMonthCalendarVisible.value,
        isYearCalendarVisible.value] = visibilityMap[calendarType];
      updateCalendarControls();
    };

    const syncSelectedTimeFromProps = () => {
      setCalendarVisibility(type.value);
      const resolvedDate = getParsedDate(getResolvedValue());

      if (!resolvedDate) {
        yearType.value = calendarYearType.value;
        selectedTime.value = { ...DEFAULT_SELECTED_TIME };
        monthOnCalendar.value = currentMonth;
        yearOnCalendar.value = currentYear;
        getDecadeRange();
        return;
      }

      const resolvedYear = resolvedDate.getFullYear();
      yearType.value = calendarYearType.value === YearType.RepublicEra && resolvedYear <= 1911
        ? YearType.CommonEra
        : calendarYearType.value;

      selectedTime.value = {
        label: setDatePickerLabel({
          calendarYearType: yearType.value,
          selectedDate: resolvedDate,
          formatYear: resolvedYear,
          datePickerType: type.value
        }),
        timeValue: resolvedDate
      };

      monthOnCalendar.value = resolvedDate.getMonth();
      yearOnCalendar.value = resolvedYear;
      getDecadeRange();
    };

    const toggleCalendar = () => {
      if (!disabled.value) isCalendarVisible.value = !isCalendarVisible.value;
    };

    const goToNextMonth = () => {
      yearOnCalendar.value = (monthOnCalendar.value === 11) ? yearOnCalendar.value + 1 : yearOnCalendar.value;
      monthOnCalendar.value = (monthOnCalendar.value + 1) % 12;
    };

    const goToLastMonth = () => {
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

    const handleDateChange = (time: SelectedTime) => {
      selectedTime.value = time;
      isCalendarVisible.value = false;
      emit('update:modelValue', time.timeValue);
    };

    const handleMonthChange = (time: SelectedTime) => {
      selectedTime.value = time;
      monthOnCalendar.value = new Date(time.timeValue as Date).getMonth();

      if (type.value === CalendarType.DATE) {
        setCalendarVisibility(CalendarType.DATE);
        return;
      }

      isCalendarVisible.value = false;
      emit('update:modelValue', time.timeValue);
    };

    const handleYearChange = (time: SelectedTime) => {
      selectedTime.value = time;

      if (type.value !== CalendarType.YEAR) {
        setCalendarVisibility(CalendarType.MONTH);
        yearOnCalendar.value = new Date(time.timeValue as Date).getFullYear();
        return;
      }

      isCalendarVisible.value = false;
      emit('update:modelValue', time.timeValue);
    };

    const handleChangeYearType = (selectedYearType: YearType) => {
      yearType.value = getResolvedYearType(selectedTime.value.timeValue, selectedYearType);
      syncLabelByCurrentState();
      getDecadeRange();
    };

    const clearSelectedTime = () => {
      selectedTime.value = { ...DEFAULT_SELECTED_TIME };
      isCalendarVisible.value = false;

      emit('update:modelValue', selectedTime.value.timeValue);
    };

    const selectToday = () => {
      if (isTodayDisabled.value) return;

      const today = new Date();
      syncSelectedTime(today);
      isCalendarVisible.value = false;
      emit('update:modelValue', selectedTime.value.timeValue);
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const eventTarget = event.target as Node | null;
      if (
        !closeOnClickOutside.value
        || !isCalendarVisible.value
        || !eventTarget
        || datePickerRef.value?.contains(eventTarget)
      ) {
        return;
      }

      isCalendarVisible.value = false;
    };

    const handleDocumentKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isCalendarVisible.value) {
        isCalendarVisible.value = false;
      }
    };

    watch(
      [modelValue, defaultValue, calendarYearType, type],
      syncSelectedTimeFromProps,
      { immediate: true }
    );
    onMounted(() => {
      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('keydown', handleDocumentKeydown);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeydown);
    });

    watch(modelValue, (nextModelValue) => {
      if (!nextModelValue) {
        syncSelectedTime();
        yearType.value = calendarYearType.value;
        return;
      }

      syncSelectedTime(getValidDate(nextModelValue));
    });

    watch(calendarYearType, (nextYearType) => {
      yearType.value = getResolvedYearType(selectedTime.value.timeValue, nextYearType);
      syncLabelByCurrentState();
      updateCalendarControls();
    });

    watch(type, (nextType) => {
      setCalendarVisibility(nextType);
      syncLabelByCurrentState();
    });

    watch([yearOnCalendar, yearType, monthOnCalendar, minDate, maxDate], () => {
      getDecadeRange();
      updateCalendarControls();
    }, { immediate: true });

    return {
      datePickerRef,
      yearType,
      displayYear,
      decadeRange,
      selectedTime,
      canGoLastYear,
      canGoNextYear,
      yearOnCalendar,
      canGoLastMonth,
      canGoNextMonth,
      canGoLastDecade,
      canGoNextDecade,
      monthOnCalendar,
      isSwitchAllowed,
      isTodayDisabled,
      isCalendarVisible,
      isDateCalendarVisible,
      isMonthCalendarVisible,
      isYearCalendarVisible,
      CalendarType,
      goToNextYear,
      goToLastYear,
      goToNextMonth,
      goToLastMonth,
      toggleCalendar,
      goToNextDecade,
      goToLastDecade,
      getCalendarLang,
      getMonthLabel,
      handleDateChange,
      handleYearChange,
      clearSelectedTime,
      handleMonthChange,
      getRepublicEraYear,
      handleChangeYearType,
      setCalendarVisibility,
      selectToday
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
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid #4390BC;
    outline-offset: 2px;
  }

  &--disabled {
    cursor: not-allowed;
  }

  .input-icon {
    padding: 0 4px;
  }

  .date-picker-input {
    width: 100%;
    height: 100%;
    padding: 2px;
    background: #ffffff;
    border-style: none;
    cursor: inherit;

    &:focus {
      outline-style: none;
    }
  }

  .clear-input-button {
    display: none;
    position: absolute;
    cursor: pointer;
    right: 4px;
    top: 0;
    bottom: 0;
  }

  &:hover {
    .clear-input-button--hover {
      display: flex;
      align-items: center;
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

.calendar-footer {
  display: flex;
  justify-content: flex-end;
  padding: 4px 8px 0;
  border-top: 1px solid #f0f0f0;
}

.today-button {
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 4px;
  color: #4390BC;
  font-size: 14px;

  &:disabled {
    cursor: not-allowed;
    color: #a0a8ad;
  }
}
</style>
