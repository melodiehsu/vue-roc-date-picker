<template>
  <div>
    <div v-if="hasRepublicEraYear" class="wrapper">
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
import { defineComponent, toRefs } from 'vue';
import { getCalendarLang } from '@/utils';
import { YEAR_TYPE } from '@/constants';
import RotateIcon from './icons/RotateIcon.vue';

export default defineComponent({
  components: { RotateIcon },
  props: {
    calendarYearType: {
      required: true,
      type: String
    },
    hasRepublicEraYear: {
      required: true,
      type: Boolean,
      default: true
    },
    lang: {
      type: String,
      required: true
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { calendarYearType } = toRefs(props);
    const changeYearType = () => {
      let yearType;
      if (calendarYearType.value === YEAR_TYPE.CE) {
        yearType = YEAR_TYPE.RepublicEraYear;
      } else {
        yearType = YEAR_TYPE.CE;
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
  background: transparent;
  border-style: none;
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
  padding: 2px;
  color: #6a6c6d;
  cursor: pointer;
}
</style>
