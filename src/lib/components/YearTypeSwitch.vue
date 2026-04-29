<template>
  <div>
    <div v-if="isVisible" class="wrapper">
      <button
        type="button"
        class="controller"
        data-test="year-type-switch"
        @click="changeYearType"
      >
        <RotateIcon style="margin-right: 6px;" />
        <div>{{ getCalendarLang(lang).yearType[calendarYearType] }}</div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, type PropType } from 'vue';
import { getCalendarLang } from '@/lib/utils';
import { Language, YearType } from '@/lib/interfaces';
import RotateIcon from './icons/RotateIcon.vue';

export default defineComponent({
  components: { RotateIcon },
  props: {
    calendarYearType: {
      required: true,
      type: String as PropType<YearType>
    },
    isVisible: {
      required: true,
      type: Boolean,
      default: true
    },
    lang: {
      type: String as PropType<Language>,
      required: true
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { calendarYearType } = toRefs(props);
    const changeYearType = () => {
      let yearType;
      if (calendarYearType.value === YearType.CommonEra) {
        yearType = YearType.RepublicEra;
      } else {
        yearType = YearType.CommonEra;
      }

      emit('click', yearType);
    };

    return {
      changeYearType,
      getCalendarLang
    };
  }
});
</script>

<style scoped lang="scss">
button {
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 0;
  margin: 0;
  padding: 0;
  font: inherit;
  line-height: 1;
  color: inherit;
  cursor: pointer;
}

.wrapper {
  width: 100%;
  padding: 0 12px;
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
}

.controller {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  color: #6a6c6d;
  white-space: nowrap;
}
</style>
