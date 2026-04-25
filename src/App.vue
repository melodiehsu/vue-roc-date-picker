<template>
  <div>
    <div class="wrapper">
      <div class="container">
        <h1>
          {{ lang === 'zhTW' ? '民國年日曆' : 'ROC Date Picker' }}
        </h1>

        <div class="lang-selector">
          <button
            v-if="lang === Language.EN"
            type="button"
            class="controller"
            @click="switchLang"
          >
            <RotateIcon style="margin-right: 6px;" />
            <div>English</div>
          </button>

          <button
            v-if="lang === Language.ZH_TW"
            type="button"
            class="controller"
            @click="switchLang"
          >
            <RotateIcon style="margin-right: 6px;" />
            <div>繁體中文</div>
          </button>
        </div>

        <div class="date-picker-examples">
          <div class="date-picker">
            <span>{{ lang === Language.ZH_TW ? '年曆' : 'Year' }}</span>
            <ROCDatePicker
              v-model="selectedYear"
              :type="CalendarType.YEAR"
              :lang="lang"
            />
            <div class="selected-value">
              {{ selectedYear }}
            </div>
          </div>

          <div class="date-picker">
            <span>{{ lang === Language.ZH_TW ? '月曆' : 'Month' }}</span>
            <ROCDatePicker
              v-model="selectedMonth"
              :type="CalendarType.MONTH"
              :lang="lang"
            />
            <div class="selected-value">
              {{ selectedMonth }}
            </div>
          </div>

          <div class="date-picker">
            <span>{{ lang === Language.ZH_TW ? '日曆' : 'Date' }}</span>
            <ROCDatePicker
              v-model="selectedDate"
              :type="CalendarType.DATE"
              :lang="lang"
            />
            <div class="selected-value">
              {{ selectedDate }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import ROCDatePicker from './components/ROCDatePicker.vue';
import RotateIcon from './components/icons/RotateIcon.vue';
import { CalendarType, Language } from './interfaces';

export default defineComponent({
  components: {
    ROCDatePicker,
    RotateIcon
  },
  setup() {
    const selectedYear = ref();
    const selectedMonth = ref();
    const selectedDate = ref();

    const getSelectedYear = (time: Date) => {
      selectedYear.value = time;
    };

    const getSelectedMonth = (time: Date) => {
      selectedMonth.value = time;
    };

    const getSelectedDate = (time: Date) => {
      selectedDate.value = time;
    };

    const lang = ref(Language.ZH_TW);

    const switchLang = () => {
      if (lang.value === Language.EN) {
        lang.value = Language.ZH_TW;
      } else {
        lang.value = Language.EN;
      }
    };

    return {
      Language,
      lang,
      selectedYear,
      selectedMonth,
      selectedDate,
      CalendarType,
      switchLang,
      getSelectedYear,
      getSelectedMonth,
      getSelectedDate
    };
  }
});
</script>

<style scoped lang="scss">
.wrapper {
  width: 100%;
  height: 100vh;
  background: #d8d1f6;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translateY(-200px);
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

button {
  background: transparent;
  border-style: none;
}

span {
  margin-bottom: 10px;
}

.lang-selector{
  margin-bottom: 20px;
}

.date-picker-examples {
  width: 70%;
  display: flex;
  justify-content: space-around;
}

.controller {
  display: flex;
  align-items: center;
  padding: 2px;
  color: #6a6c6d;
  cursor: pointer;
}

.date-picker {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 300px;
}

.selected-value {
  position: absolute;
  width: 100%;
  padding: 0px 10px;
  left: 10px;
  top: 80px;
  line-height: 1.2;
}
</style>
