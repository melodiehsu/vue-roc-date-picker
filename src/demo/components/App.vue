<template>
  <div class="demo-page">
    <main class="demo-shell">
      <div class="demo-card__hero">
        <div class="demo-card__hero-top">
          <h1 class="demo-card__title">
            {{ demoCopy.title }}
          </h1>

          <div class="demo-language-switcher">
            <div class="demo-language-switcher__label">
              {{ demoCopy.demoLanguageLabel }}
            </div>
            <div class="demo-language-switcher__actions">
              <select
                v-model="demoLang"
                class="demo-language-switcher__select"
                :aria-label="demoCopy.demoLanguageLabel"
              >
                <option
                  disabled
                  hidden
                  value=""
                >
                  {{ demoCopy.demoLanguagePlaceholder }}
                </option>
                <option
                  v-for="option in demoLanguageOptions"
                  :key="option"
                  :value="option"
                >
                  {{ demoCopy.demoLanguageOptionLabels[option] }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <p class="demo-card__description">
          {{ demoCopy.description }}
        </p>
      </div>

      <div class="demo-layout">
        <aside class="settings-panel">
          <div class="settings-block">
            <div class="settings-block__title">
              {{ demoCopy.sections.basicDisplay }}
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                type
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.type }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--3">
                  <button
                    v-for="option in typeOptions"
                    :key="option"
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': previewType === option }"
                    :aria-pressed="previewType === option"
                    @click="previewType = option"
                  >
                    {{ demoCopy.typeLabels[option] }}
                  </button>
                </div>
              </div>
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                lang
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.lang }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    v-for="option in pickerLangOptions"
                    :key="option"
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': previewLang === option }"
                    :aria-pressed="previewLang === option"
                    @click="previewLang = option"
                  >
                    {{ demoCopy.pickerLangLabels[option] }}
                  </button>
                </div>
              </div>
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                calendarYearType
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.calendarYearType }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    v-for="option in yearTypeOptions"
                    :key="option"
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': previewYearType === option }"
                    :aria-pressed="previewYearType === option"
                    @click="previewYearType = option"
                  >
                    {{ demoCopy.yearTypeLabels[option] }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="settings-block">
            <div class="settings-block__title">
              {{ demoCopy.sections.behavior }}
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                disabled
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.disabled }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': !isDisabled }"
                    :aria-pressed="!isDisabled"
                    @click="isDisabled = false"
                  >
                    {{ demoCopy.booleanLabels.off }}
                  </button>
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': isDisabled }"
                    :aria-pressed="isDisabled"
                    @click="isDisabled = true"
                  >
                    {{ demoCopy.booleanLabels.on }}
                  </button>
                </div>
              </div>
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                showClearButton
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.showClearButton }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': showClearButton }"
                    :aria-pressed="showClearButton"
                    @click="showClearButton = true"
                  >
                    {{ demoCopy.booleanLabels.on }}
                  </button>
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': !showClearButton }"
                    :aria-pressed="!showClearButton"
                    @click="showClearButton = false"
                  >
                    {{ demoCopy.booleanLabels.off }}
                  </button>
                </div>
              </div>
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                showTodayButton
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.showTodayButton }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': showTodayButton }"
                    :aria-pressed="showTodayButton"
                    @click="showTodayButton = true"
                  >
                    {{ demoCopy.booleanLabels.on }}
                  </button>
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': !showTodayButton }"
                    :aria-pressed="!showTodayButton"
                    @click="showTodayButton = false"
                  >
                    {{ demoCopy.booleanLabels.off }}
                  </button>
                </div>
              </div>
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                closeOnClickOutside
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.closeOnClickOutside }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': closeOnClickOutside }"
                    :aria-pressed="closeOnClickOutside"
                    @click="closeOnClickOutside = true"
                  >
                    {{ demoCopy.booleanLabels.on }}
                  </button>
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': !closeOnClickOutside }"
                    :aria-pressed="!closeOnClickOutside"
                    @click="closeOnClickOutside = false"
                  >
                    {{ demoCopy.booleanLabels.off }}
                  </button>
                </div>
              </div>
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                closeOnEscape
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.closeOnEscape }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': closeOnEscape }"
                    :aria-pressed="closeOnEscape"
                    @click="closeOnEscape = true"
                  >
                    {{ demoCopy.booleanLabels.on }}
                  </button>
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': !closeOnEscape }"
                    :aria-pressed="!closeOnEscape"
                    @click="closeOnEscape = false"
                  >
                    {{ demoCopy.booleanLabels.off }}
                  </button>
                </div>
              </div>
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                disableWeekends
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.disableWeekends }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--2">
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': disableWeekends }"
                    :aria-pressed="disableWeekends"
                    @click="disableWeekends = true"
                  >
                    {{ demoCopy.booleanLabels.on }}
                  </button>
                  <button
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': !disableWeekends }"
                    :aria-pressed="!disableWeekends"
                    @click="disableWeekends = false"
                  >
                    {{ demoCopy.booleanLabels.off }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="settings-block">
            <div class="settings-block__title">
              {{ demoCopy.sections.range }}
            </div>

            <div class="prop-item">
              <div class="prop-item__name">
                minDate / maxDate
              </div>
              <p class="prop-item__description">
                {{ demoCopy.propDescriptions.range }}
              </p>
              <div class="prop-item__controls">
                <div class="segmented-control segmented-control--3">
                  <button
                    v-for="option in rangeOptions"
                    :key="option"
                    type="button"
                    class="segmented-control__button"
                    :class="{ 'is-active': rangePreset === option }"
                    :aria-pressed="rangePreset === option"
                    @click="setRangePreset(option)"
                  >
                    {{ demoCopy.rangeLabels[option] }}
                  </button>
                </div>
              </div>
            </div>

            <p class="settings-block__hint">
              {{ demoCopy.rangeHint }}
            </p>
          </div>
        </aside>

        <div class="preview-panel-shell">
          <section class="preview-panel">
            <div class="preview-panel__header">
              <div class="preview-panel__title">
                {{ demoCopy.previewTitle }}
              </div>
              <div class="preview-panel__state-list">
                <div
                  v-for="item in previewStateItems"
                  :key="item.label"
                  class="preview-state-row"
                >
                  <div class="preview-state-row__label">
                    {{ item.label }}
                  </div>
                  <div class="preview-state-row__value">
                    {{ item.value }}
                  </div>
                </div>
              </div>
            </div>

            <div class="preview-tip">
              <ul class="preview-tip__list">
                <li
                  v-for="(tip, tipIndex) in demoCopy.previewTips"
                  :key="tipIndex"
                  class="preview-tip__item"
                >
                  <template v-for="(segment, index) in tip.segments" :key="index">
                    <code
                      v-if="segment.kind === 'code'"
                      class="inline-code"
                    >
                      {{ segment.value }}
                    </code>
                    <span v-else>
                      {{ segment.value }}
                    </span>
                  </template>
                </li>
              </ul>
            </div>

            <div class="preview-panel__surface">
              <ROCDatePicker
                v-model="selectedValue"
                :type="previewType"
                :lang="previewLang"
                :calendar-year-type="previewYearType"
                :placeholder="placeholderText"
                :disabled="isDisabled"
                :show-clear-button="showClearButton"
                :show-today-button="showTodayButton"
                :close-on-click-outside="closeOnClickOutside"
                :close-on-escape="closeOnEscape"
                :min-date="minDate"
                :max-date="maxDate"
                :disable-weekends="disableWeekends"
              />
            </div>

            <div class="preview-panel__meta">
              <div class="preview-chip">
                <span class="preview-chip__label">{{ demoCopy.previewChipLabels.vModel }}</span>
                <span class="preview-chip__value">{{ selectedValueLabel }}</span>
              </div>

              <div class="preview-chip">
                <span class="preview-chip__label">{{ demoCopy.previewChipLabels.range }}</span>
                <span class="preview-chip__value">{{ rangeSummary }}</span>
              </div>
            </div>

            <div class="preview-panel__snippet">
              <div class="preview-panel__snippet-actions">
                <button
                  type="button"
                  class="preview-panel__copy-button"
                  :class="{ 'is-copied': isSnippetCopied }"
                  :aria-label="isSnippetCopied ? 'Copied' : 'Copy code'"
                  :title="isSnippetCopied ? 'copied!' : 'Copy code'"
                  @click="copyRocDatePickerSnippet"
                >
                  <span
                    v-if="isSnippetCopied"
                    class="preview-panel__copy-tooltip"
                    aria-hidden="true"
                  >
                    copied!
                  </span>
                  <CopyIcon v-if="!isSnippetCopied" />
                </button>
              </div>

              <pre class="preview-panel__snippet-code"><code class="html hljs xml"><SnippetCode :lines="highlightedSnippetLines" /></code></pre>
            </div>

            <p class="preview-panel__note">
              {{ demoCopy.previewNote }}
            </p>
          </section>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import {
  computed, defineComponent, onBeforeUnmount, ref
} from 'vue';
import dayjs from 'dayjs';
import ROCDatePicker from '../../lib/components/ROCDatePicker.vue';
import SnippetCode from './SnippetCode.vue';
import { CalendarType, Language, YearType } from '../../lib/interfaces';
import {
  DEMO_COPY,
  type DemoLang,
  type RangePreset
} from '../locales/demo';
import CopyIcon from './icons/CopyIcon.vue';

export default defineComponent({
  components: {
    ROCDatePicker,
    CopyIcon,
    SnippetCode
  },
  setup() {
    const demoLanguageOptions: DemoLang[] = [Language.ZH_TW, Language.EN];
    const typeOptions: CalendarType[] = [CalendarType.YEAR, CalendarType.MONTH, CalendarType.DATE];
    const pickerLangOptions: DemoLang[] = [Language.ZH_TW, Language.EN];
    const yearTypeOptions: YearType[] = [YearType.RepublicEra, YearType.CommonEra];
    const rangeOptions: RangePreset[] = ['none', 'currentYear', 'rollingWindow'];

    const demoLang = ref<DemoLang>(Language.ZH_TW);
    const previewType = ref<CalendarType>(CalendarType.DATE);
    const previewLang = ref<Language>(Language.ZH_TW);
    const previewYearType = ref<YearType>(YearType.RepublicEra);
    const selectedValue = ref<Date | undefined>(new Date());

    const isDisabled = ref(false);
    const showClearButton = ref(true);
    const showTodayButton = ref(false);
    const closeOnClickOutside = ref(false);
    const closeOnEscape = ref(true);
    const disableWeekends = ref(false);
    const rangePreset = ref<RangePreset>('none');
    const isSnippetCopied = ref(false);
    let snippetCopyTimer: number | undefined;

    const demoCopy = computed(() => DEMO_COPY[demoLang.value]);

    const toVueStringLiteral = (value: string) => `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
    const toVueOptionalStringPropLine = (name: string, value: string, defaultValue: string) => (
      value === defaultValue ? undefined : `  :${name}=${toVueStringLiteral(value)}`
    );
    const toVueBooleanPropLine = (name: string, value: boolean) => (value ? `  ${name}` : undefined);

    const toVueDateStringLiteral = (value: Date | undefined) => {
      if (!value) {
        return undefined;
      }

      return toVueStringLiteral(dayjs(value).format('YYYY-MM-DD'));
    };

    const placeholderText = computed(() => {
      const isZhTW = previewLang.value === Language.ZH_TW;

      if (previewType.value === CalendarType.YEAR) {
        return isZhTW ? '請選擇年份' : 'Select a year';
      }

      if (previewType.value === CalendarType.MONTH) {
        return isZhTW ? '請選擇月份' : 'Select a month';
      }

      return isZhTW ? '請選擇日期' : 'Select a date';
    });

    const minDate = computed(() => {
      if (rangePreset.value === 'currentYear') {
        return dayjs().startOf('year').toDate();
      }

      if (rangePreset.value === 'rollingWindow') {
        return dayjs().subtract(6, 'month').startOf('day').toDate();
      }

      return undefined;
    });

    const maxDate = computed(() => {
      if (rangePreset.value === 'currentYear') {
        return dayjs().endOf('year').toDate();
      }

      if (rangePreset.value === 'rollingWindow') {
        return dayjs().endOf('day').toDate();
      }

      return undefined;
    });

    const rocDatePickerSnippet = computed(() => {
      const propLines = [
        '  v-model="selectedValue"',
        `  :type="${toVueStringLiteral(previewType.value)}"`,
        toVueOptionalStringPropLine('lang', previewLang.value, Language.ZH_TW),
        `  :calendar-year-type="${toVueStringLiteral(previewYearType.value)}"`,
        `  :placeholder="${toVueStringLiteral(placeholderText.value)}"`,
        toVueBooleanPropLine('disabled', isDisabled.value),
        toVueBooleanPropLine('show-clear-button', showClearButton.value),
        toVueBooleanPropLine('show-today-button', showTodayButton.value),
        toVueBooleanPropLine('close-on-click-outside', closeOnClickOutside.value),
        toVueBooleanPropLine('close-on-escape', closeOnEscape.value),
        toVueBooleanPropLine('disable-weekends', disableWeekends.value)
      ].filter((line): line is string => Boolean(line));

      const minDateLiteral = toVueDateStringLiteral(minDate.value);
      const maxDateLiteral = toVueDateStringLiteral(maxDate.value);

      if (minDateLiteral) {
        propLines.push(`  :min-date=${minDateLiteral}`);
      }

      if (maxDateLiteral) {
        propLines.push(`  :max-date=${maxDateLiteral}`);
      }

      return ['<ROCDatePicker', ...propLines.filter((line): line is string => Boolean(line)), '/>'].join('\n');
    });

    const highlightedSnippetLines = computed(() => {
      const lines = rocDatePickerSnippet.value.split('\n');

      return lines.map((line, index) => {
        if (index === 0) {
          return [
            { class: 'hljs-tag', value: '<' },
            { class: 'hljs-name', value: 'ROCDatePicker' }
          ];
        }

        const trimmedLine = line.trimStart();
        const indentation = line.slice(0, line.length - trimmedLine.length);

        if (trimmedLine === '/>') {
          return [
            { value: indentation },
            { class: 'hljs-tag', value: '/>' }
          ];
        }

        const assignmentMatch = trimmedLine.match(/^(:?[\w-]+)=(.+)$/);

        if (assignmentMatch) {
          const [, name, rawValue] = assignmentMatch;
          return [
            { value: indentation },
            { class: 'hljs-attr', value: name },
            { value: '=' },
            { class: 'hljs-string', value: rawValue }
          ];
        }

        return [
          { value: indentation },
          { class: 'hljs-attr', value: trimmedLine }
        ];
      });
    });

    const selectedValueFormatMap: Record<CalendarType, string> = {
      [CalendarType.YEAR]: 'YYYY',
      [CalendarType.MONTH]: 'YYYY-MM',
      [CalendarType.DATE]: 'YYYY-MM-DD'
    };

    const selectedValueLabel = computed(() => {
      if (!selectedValue.value) {
        return demoLang.value === Language.ZH_TW ? '尚未選擇' : 'No selection yet';
      }

      return dayjs(selectedValue.value).format(selectedValueFormatMap[previewType.value]);
    });

    const rangeSummary = computed(() => {
      if (!minDate.value && !maxDate.value) {
        return demoLang.value === Language.ZH_TW ? '不限' : 'Unlimited';
      }

      const format = 'YYYY-MM-DD';
      const minLabel = minDate.value ? dayjs(minDate.value).format(format) : '...';
      const maxLabel = maxDate.value ? dayjs(maxDate.value).format(format) : '...';

      return `${minLabel} ~ ${maxLabel}`;
    });

    const previewStateItems = computed(() => [
      {
        label: demoCopy.value.previewStateLabels.mode,
        value: demoCopy.value.typeLabels[previewType.value]
      },
      {
        label: demoCopy.value.previewStateLabels.lang,
        value: previewLang.value
      },
      {
        label: demoCopy.value.previewStateLabels.yearType,
        value: demoCopy.value.yearTypeLabels[previewYearType.value]
      }
    ]);

    const setRangePreset = (preset: RangePreset) => {
      rangePreset.value = preset;

      if (preset === 'currentYear') {
        selectedValue.value = dayjs().startOf('year').toDate();
        return;
      }

      if (preset === 'rollingWindow') {
        selectedValue.value = dayjs().subtract(1, 'month').startOf('day').toDate();
      }
    };

    const clearSnippetCopyTimer = () => {
      if (snippetCopyTimer !== undefined) {
        window.clearTimeout(snippetCopyTimer);
        snippetCopyTimer = undefined;
      }
    };

    const copyRocDatePickerSnippet = async () => {
      const textArea = document.createElement('textarea');

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(rocDatePickerSnippet.value);
        } else {
          textArea.value = rocDatePickerSnippet.value;
          textArea.setAttribute('readonly', 'true');
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
        }

        isSnippetCopied.value = true;
        clearSnippetCopyTimer();
        snippetCopyTimer = window.setTimeout(() => {
          isSnippetCopied.value = false;
          snippetCopyTimer = undefined;
        }, 1500);
      } catch {
        isSnippetCopied.value = false;
      } finally {
        if (textArea.parentNode) {
          textArea.parentNode.removeChild(textArea);
        }
      }
    };

    onBeforeUnmount(() => {
      clearSnippetCopyTimer();
    });

    return {
      demoLanguageOptions,
      typeOptions,
      pickerLangOptions,
      yearTypeOptions,
      rangeOptions,
      demoLang,
      previewType,
      previewLang,
      previewYearType,
      selectedValue,
      isDisabled,
      showClearButton,
      showTodayButton,
      closeOnClickOutside,
      closeOnEscape,
      disableWeekends,
      rangePreset,
      placeholderText,
      minDate,
      maxDate,
      selectedValueLabel,
      rangeSummary,
      previewStateItems,
      setRangePreset,
      demoCopy,
      rocDatePickerSnippet,
      highlightedSnippetLines,
      isSnippetCopied,
      copyRocDatePickerSnippet
    };
  }
});
</script>

<style scoped lang="scss">
.demo-page {
  width: 100%;
  min-height: 100vh;
  --demo-page-bg-color: #f6f8fb;
  background-color: var(--demo-page-bg-color);
}

.demo-shell {
  width: 100%;
  padding: 48px 24px 56px;
}

.demo-card__hero {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}

.demo-card__hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
}

.demo-card__title {
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
  color: #1f2d3d;
}

.demo-card__description {
  font-size: 15px;
  line-height: 1.7;
  color: #64748b;
}

.demo-language-switcher {
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.demo-language-switcher__label {
  font-size: 13px;
  line-height: 1.4;
  color: #64748b;
  white-space: nowrap;
}

.demo-language-switcher__actions {
  width: auto;
}

.demo-language-switcher__select {
  width: 114px;
  min-height: 38px;
  padding: 0 36px 0 12px;
  border: 1px solid #d7dee8;
  border-radius: 10px;
  background-color: #ffffff;
  background-image:
    linear-gradient(45deg, transparent 50%, #7b8798 50%),
    linear-gradient(135deg, #7b8798 50%, transparent 50%);
  background-position:
    calc(100% - 18px) 16px,
    calc(100% - 12px) 16px;
  background-size: 6px 6px, 6px 6px;
  background-repeat: no-repeat;
  color: #1f2d3d;
  font-size: 13px;
  line-height: 1.2;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.demo-language-switcher__select:focus {
  outline: none;
  border-color: #c7d7e6;
  box-shadow: 0 0 0 2px rgba(36, 92, 134, 0.08);
}

button {
  background: transparent;
  border-style: none;
}

.demo-layout {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(320px, 390px) minmax(0, 1fr);
  gap: 24px;
  align-items: start;
}

.settings-panel,
.preview-panel {
  border: 1px solid #e8edf3;
  border-radius: 16px;
  background: #fbfcfe;
}

.settings-panel {
  padding: 18px;
}

.settings-block + .settings-block {
  margin-top: 22px;
}

.settings-block__title {
  margin-bottom: 12px;
  font-size: 14px;
  line-height: 1.4;
  font-weight: 600;
  color: #334155;
}

.prop-item {
  padding: 14px 14px 16px;
  border: 1px solid #e8edf3;
  border-radius: 14px;
  background: #ffffff;
}

.prop-item + .prop-item {
  margin-top: 12px;
}

.prop-item__name {
  font-size: 14px;
  line-height: 1.3;
  font-weight: 600;
  color: #1f2d3d;
  letter-spacing: 0.01em;
}

.prop-item__description {
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
}

.prop-item__controls {
  margin-top: 12px;
}

.settings-block__hint {
  margin-top: 12px;
  font-size: 12px;
  line-height: 1.6;
  color: #8a94a6;
}

.segmented-control {
  display: grid;
  gap: 8px;
}

.segmented-control--2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.segmented-control--3 {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.segmented-control__button {
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid #d7dee8;
  border-radius: 10px;
  background: #ffffff;
  color: #556173;
  font-size: 13px;
  line-height: 1.2;
  cursor: pointer;
}

.segmented-control__button.is-active {
  border-color: #c7d7e6;
  background: #eef5fb;
  color: #245c86;
  font-weight: 600;
}

.preview-panel {
  padding: 24px;
  border: 1px solid #e8edf3;
  border-radius: 16px;
  background: #fbfcfe;
}

.preview-panel-shell {
  position: sticky;
  top: 24px;
  align-self: start;
  z-index: 2;
  isolation: isolate;
}

.preview-panel-shell::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: -24px -16px auto -16px;
  height: 24px;
  border-radius: 18px 18px 0 0;
  background-color: var(--demo-page-bg-color);
  pointer-events: none;
}

.preview-panel__header {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
}

.preview-panel__title {
  font-size: 16px;
  line-height: 1.4;
  font-weight: 600;
  color: #1f2d3d;
}

.preview-panel__state-list {
  display: grid;
  margin-top: 8px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: auto auto;
  column-gap: 12px;
  row-gap: 6px;
  justify-items: center;
}

.preview-tip {
  margin-top: 14px;
  margin-bottom: 14px;
  padding: 14px 16px;
  border: 1px solid #dde6ef;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbfdff 0%, #f7fafc 100%);
}

.preview-tip__list {
  display: grid;
  gap: 8px;
}

.preview-tip__item {
  font-size: 14px;
  line-height: 1.6;
  color: #3f4b5c;
}

.inline-code {
  display: inline-block;
  padding: 0 5px;
  border-radius: 6px;
  background: #e7eef5;
  color: #234154;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, monospace;
  font-size: 0.92em;
  white-space: nowrap;
}

.preview-state-row {
  display: contents;
}

.preview-state-row:nth-child(1) .preview-state-row__label,
.preview-state-row:nth-child(2) .preview-state-row__label,
.preview-state-row:nth-child(3) .preview-state-row__label {
  grid-row: 1;
}

.preview-state-row:nth-child(1) .preview-state-row__value,
.preview-state-row:nth-child(2) .preview-state-row__value,
.preview-state-row:nth-child(3) .preview-state-row__value {
  grid-row: 2;
}

.preview-state-row:nth-child(1) .preview-state-row__label,
.preview-state-row:nth-child(1) .preview-state-row__value {
  grid-column: 1;
}

.preview-state-row:nth-child(2) .preview-state-row__label,
.preview-state-row:nth-child(2) .preview-state-row__value {
  grid-column: 2;
}

.preview-state-row:nth-child(3) .preview-state-row__label,
.preview-state-row:nth-child(3) .preview-state-row__value {
  grid-column: 3;
}

.preview-state-row__label {
  font-size: 13px;
  line-height: 1.4;
  color: #6b7280;
  text-align: center;
}

.preview-state-row__value {
  font-size: 13px;
  line-height: 1.4;
  color: #1f2d3d;
  font-weight: 500;
  text-align: center;
}

.preview-panel__surface {
  min-height: 100px;
  padding: 24px;
  border: 1px solid #e6ebf2;
  border-radius: 14px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-panel__meta {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.preview-panel__snippet {
  position: relative;
  margin-top: 16px;
  padding: 16px 16px 14px;
  border: 1px solid #dde6ef;
  border-radius: 14px;
  background: linear-gradient(180deg, #fbfdff 0%, #f7fafc 100%);
}

.preview-panel__snippet-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-panel__copy-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #d7dee8;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.92);
  color: #526171;
  cursor: pointer;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  line-height: 0;
  overflow: hidden;
  transition:
    width 0.18s ease,
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.preview-panel__copy-button.is-copied {
  width: 104px;
  border-color: #a7c5ad;
  background: #e8f1e8;
  color: #3f6f4b;
  cursor: default;
  box-shadow: 0 6px 16px rgba(63, 111, 75, 0.14);
}

.preview-panel__copy-tooltip {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 0 0 2px;
  border-radius: 999px;
  background: transparent;
  color: inherit;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
}

.preview-panel__copy-button:hover {
  color: #245c86;
  border-color: #c7d7e6;
}

.preview-panel__copy-button svg {
  display: block;
  width: 18px;
  height: 18px;
  fill: currentColor;
  overflow: visible;
}

.preview-panel__snippet-code {
  margin: 0;
  padding: 24px;
  overflow: auto;
  white-space: pre;
  color: #d4d4d4;
  font-family: ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, monospace;
  font-size: 12px;
  line-height: 1.2;
  background:
    linear-gradient(180deg, rgba(18, 24, 37, 0.98) 0%, rgba(15, 20, 31, 0.98) 100%);
  border-radius: 12px;
  border: 1px solid #1f2937;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.preview-panel__snippet-line {
  display: block;
  line-height: 1.2;
}

.preview-panel__snippet-code :deep(.hljs-tag) {
  color: #7dd3fc;
}

.preview-panel__snippet-code :deep(.hljs-name) {
  color: #93c5fd;
}

.preview-panel__snippet-code :deep(.hljs-attr) {
  color: #c4b5fd;
}

.preview-panel__snippet-code :deep(.hljs-string) {
  color: #86efac;
}

.preview-panel__snippet-code :deep(.hljs-tag),
.preview-panel__snippet-code :deep(.hljs-name),
.preview-panel__snippet-code :deep(.hljs-attr),
.preview-panel__snippet-code :deep(.hljs-string) {
  font-weight: 500;
}

.preview-chip {
  padding: 12px 14px;
  border: 1px solid #e6ebf2;
  border-radius: 12px;
  background: #ffffff;
}

.preview-chip__label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  line-height: 1.4;
  color: #8a94a6;
}

.preview-chip__value {
  display: block;
  font-size: 14px;
  line-height: 1.5;
  color: #1f2d3d;
  word-break: break-word;
}

.preview-panel__note {
  margin-top: 14px;
  min-height: 1px;
  font-size: 13px;
  line-height: 1.6;
  color: #8a94a6;
}

@media (max-width: 960px) {
  .demo-card__hero {
    margin-bottom: 24px;
  }

  .demo-card__hero-top {
    gap: 16px;
  }

  .demo-layout {
    grid-template-columns: minmax(0, 1fr);
  }

  .preview-panel-shell {
    order: -1;
    position: sticky;
    top: 24px;
  }

  .preview-tip {
    padding: 12px 14px;
  }

  .preview-panel__snippet {
    display: none;
  }

  .preview-panel__surface {
    min-height: 0;
  }

  .preview-chip {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
  }

  .preview-chip__label {
    margin-bottom: 0;
    flex-shrink: 0;
  }

  .preview-chip__value {
    text-align: right;
  }
}

@media (max-width: 640px) {
  .demo-shell {
    padding: 20px 12px;
  }

  .demo-card__hero {
    margin-bottom: 20px;
    gap: 10px;
  }

  .demo-card__hero-top {
    display: contents;
  }

  .demo-card__title {
    order: 1;
    font-size: 24px;
  }

  .demo-card__description {
    order: 2;
  }

  .demo-language-switcher {
    order: 3;
    align-self: flex-end;
    gap: 4px;
  }

  .demo-language-switcher__actions {
    margin-top: 0;
  }

  .demo-language-switcher__select {
    min-height: 40px;
    width: 114px;
    padding-right: 38px;
    background-position:
      calc(100% - 18px) 17px,
      calc(100% - 12px) 17px;
  }

  .settings-panel,
  .preview-panel {
    padding: 16px;
  }

  .preview-state-row {
    grid-template-columns: 1fr;
    gap: 2px;
  }

  .preview-panel__meta {
    grid-template-columns: minmax(0, 1fr);
  }

  .preview-panel__surface {
    padding: 18px 12px;
  }

  .preview-tip {
    margin-top: 12px;
    margin-bottom: 12px;
    padding: 10px 12px;
  }

  .preview-tip__list {
    gap: 6px;
  }

  .preview-tip__item {
    font-size: 12px;
    line-height: 1.5;
  }

  .inline-code {
    font-size: 0.9em;
    padding: 0 4px;
  }

  .preview-panel-shell {
    top: 16px;
  }

  .preview-panel-shell::before {
    inset: -16px -12px auto -12px;
    height: 16px;
    border-radius: 16px 16px 0 0;
  }
}
</style>
