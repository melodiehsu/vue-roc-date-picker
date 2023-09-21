<template>
  <div>
    <div v-if="hasRepublicEraYear" class="wrapper">
      <button
        v-if="calendarYearType === 'RepublicEraYear'"
        type="button"
        class="controller"
        @click="changeYearType('CE')"
      >
        <RotateIcon style="margin-right: 6px;" />
        <div>{{ getCalendarLang(lang).yearType[calendarYearType] }}</div>
      </button>

      <button
        v-if="calendarYearType === 'CE'"
        type="button"
        class="controller"
        @click="changeYearType('RepublicEraYear')"
      >
        <RotateIcon style="margin-right: 6px;" />
        <div>{{ getCalendarLang(lang).yearType[calendarYearType] }}</div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { getCalendarLang } from '@/utils';
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
  setup(_, { emit }) {
    const changeYearType = (yearType: string) => {
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
