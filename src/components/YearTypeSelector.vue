<template>
  <div>
    <div class="wrapper">
      <button
        v-if="calendarYearType === 'RepublicEraYear'"
        type="button"
        class="controller"
        @click="changeYearType('CE')"
      >
        <RotateIcon style="margin-right: 6px;" />
        <div>西元</div>
      </button>

      <button
        v-if="(calendarYearType === 'CE') && hasRepublicEraYear"
        type="button"
        class="controller"
        @click="changeYearType('RepublicEraYear')"
      >
        <RotateIcon style="margin-right: 6px;" />
        <div>民國</div>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    }
  },
  emits: ['change'],
  setup(_, { emit }) {
    const changeYearType = (yearType) => {
      emit('change', yearType);
    };

    return {
      changeYearType
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
}

.controller {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 2px;
}
</style>
