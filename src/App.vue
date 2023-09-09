<template>
  <div>
    <div class="wrapper">
      <div class="container">
        <h1>
          {{ lang === 'zhTW' ? '民國年日曆' : 'ROC Date Picker' }}
        </h1>

        <div class="lang-selector">
          <button
            v-if="lang === 'en'"
            type="button"
            class="controller"
            @click="switchLang"
          >
            <RotateIcon style="margin-right: 6px;" />
            <div>English</div>
          </button>

          <button
            v-if="lang === 'zhTW'"
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
            <span>{{ lang === 'zhTW' ? '年曆' : 'Year' }}</span>
            <MyDatePicker
              :type="CALENDAR_TYPE.year"
              :lang="lang"
              @change="getSelectedYear"
            />
            <div class="selected-value">
              {{ selectedYear }}
            </div>
          </div>

          <div class="date-picker">
            <span>{{ lang === 'zhTW' ? '月曆' : 'Month' }}</span>
            <MyDatePicker
              :type="CALENDAR_TYPE.month"
              :lang="lang"
              @change="getSelectedMonth"
            />
            <div class="selected-value">
              {{ selectedMonth }}
            </div>
          </div>

          <div class="date-picker">
            <span>{{ lang === 'zhTW' ? '日曆' : 'Date' }}</span>
            <MyDatePicker
              :type="CALENDAR_TYPE.date"
              :lang="lang"
              @change="getSelectedDate"
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
import MyDatePicker from './components/MyDatePicker.vue';
import { CALENDAR_TYPE } from './constants';
import RotateIcon from './components/icons/RotateIcon.vue';

export default defineComponent({
  components: {
    MyDatePicker,
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

    const lang = ref('zhTW');

    const switchLang = () => {
      if (lang.value === 'en') {
        lang.value = 'zhTW';
      } else {
        lang.value = 'en';
      }
    };

    return {
      lang,
      selectedYear,
      selectedMonth,
      selectedDate,
      CALENDAR_TYPE,
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
