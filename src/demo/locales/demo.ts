import { type CalendarType, type Language, type YearType } from '../../lib/interfaces';

export type DemoLang = Language;
export type RangePreset = 'none' | 'currentYear' | 'rollingWindow';

export type PreviewTipSegment = {
  kind: 'text' | 'code';
  value: string;
};

export type PreviewTip = {
  segments: PreviewTipSegment[];
};

export type DemoCopy = {
  title: string;
  description: string;
  demoLanguageLabel: string;
  demoLanguagePlaceholder: string;
  demoLanguageOptionLabels: Record<DemoLang, string>;
  sections: {
    basicDisplay: string;
    behavior: string;
    range: string;
  };
  previewTitle: string;
  previewChipLabels: {
    vModel: string;
    range: string;
  };
  previewTips: PreviewTip[];
  previewNote: string;
  rangeHint: string;
  previewStateLabels: {
    mode: string;
    lang: string;
    yearType: string;
  };
  propDescriptions: {
    type: string;
    lang: string;
    calendarYearType: string;
    disabled: string;
    showClearButton: string;
    showTodayButton: string;
    closeOnClickOutside: string;
    closeOnEscape: string;
    disableWeekends: string;
    range: string;
  };
  booleanLabels: {
    on: string;
    off: string;
  };
  typeLabels: Record<CalendarType, string>;
  pickerLangLabels: Record<DemoLang, string>;
  yearTypeLabels: Record<YearType, string>;
  rangeLabels: Record<RangePreset, string>;
};

export const DEMO_COPY: Record<DemoLang, DemoCopy> = {
  zhTW: {
    title: '特殊年份日期選擇器',
    description: '切換常用 props，直接確認年、月、日模式與語系、年份制式、範圍限制的實際表現。',
    demoLanguageLabel: '頁面語言',
    demoLanguagePlaceholder: '請選擇語言',
    demoLanguageOptionLabels: {
      zhTW: '中文',
      en: 'English'
    },
    sections: {
      basicDisplay: '基本顯示',
      behavior: '行為',
      range: '範圍'
    },
    previewTitle: '即時預覽',
    previewChipLabels: {
      vModel: 'v-model',
      range: '可選日期範圍'
    },
    previewTips: [
      {
        segments: [
          { kind: 'text', value: '💡 在 ' },
          { kind: 'code', value: 'Date' },
          { kind: 'text', value: ' 模式下，最容易觀察 ' },
          { kind: 'code', value: 'Today' },
          { kind: 'text', value: '、' },
          { kind: 'code', value: 'disableWeekends' },
          { kind: 'text', value: '、' },
          { kind: 'code', value: 'minDate / maxDate' },
          { kind: 'text', value: ' 的效果' }
        ]
      },
      {
        segments: [
          { kind: 'text', value: '🔎 切換 ' },
          { kind: 'code', value: 'type' },
          { kind: 'text', value: ' 後，也可以一起檢查 ' },
          { kind: 'code', value: 'Year / Month' },
          { kind: 'text', value: ' 模式的互動表現' }
        ]
      }
    ],
    previewNote: '',
    rangeHint: '這組預設會同步切換 minDate / maxDate，用來快速檢查日期限制效果。',
    previewStateLabels: {
      mode: '選擇模式',
      lang: '日曆語言',
      yearType: '年份顯示'
    },
    propDescriptions: {
      type: '切換年、月、日模式，確認不同日期層級的選取體驗。',
      lang: '切換日期選擇器面板顯示語言。',
      calendarYearType: '切換民國年與西元年的顯示方式。',
      disabled: '停用日期選擇器，避免使用者操作。',
      showClearButton: '是否顯示清除已選日期的按鈕。',
      showTodayButton: '是否顯示今天快捷按鈕，快速回到今日。',
      closeOnClickOutside: '點擊元件外部時是否自動關閉日曆面板。',
      closeOnEscape: '按下 Esc 時是否自動關閉日曆面板。',
      disableWeekends: '是否禁用週末日期，避免週六與週日被選取。',
      range: '限制可選日期範圍，快速檢查 minDate 與 maxDate 的效果。'
    },
    booleanLabels: {
      on: '開啟',
      off: '關閉'
    },
    typeLabels: {
      year: '年',
      month: '月',
      date: '日'
    },
    pickerLangLabels: {
      zhTW: '中文',
      en: 'English'
    },
    yearTypeLabels: {
      RepublicEra: '民國',
      CommonEra: '西元'
    },
    rangeLabels: {
      none: '不限',
      currentYear: '本年',
      rollingWindow: '近 6 個月'
    }
  },
  en: {
    title: 'Special Year Date Picker',
    description: 'Toggle common props to quickly evaluate year, month, and date modes, language, year type, and range limits.',
    demoLanguageLabel: 'Demo language',
    demoLanguagePlaceholder: 'Please select language',
    demoLanguageOptionLabels: {
      zhTW: 'Chinese',
      en: 'English'
    },
    sections: {
      basicDisplay: 'Basic display',
      behavior: 'Behavior',
      range: 'Range'
    },
    previewTitle: 'Live Preview',
    previewChipLabels: {
      vModel: 'v-model',
      range: 'Selectable date range'
    },
    previewTips: [
      {
        segments: [
          { kind: 'text', value: '💡 ' },
          { kind: 'code', value: 'Today' },
          { kind: 'text', value: ', ' },
          { kind: 'code', value: 'disableWeekends' },
          { kind: 'text', value: ', and ' },
          { kind: 'code', value: 'minDate / maxDate' },
          { kind: 'text', value: ' are easiest to observe in ' },
          { kind: 'code', value: 'Date' },
          { kind: 'text', value: ' mode' }
        ]
      },
      {
        segments: [
          { kind: 'text', value: '🔎 Switching ' },
          { kind: 'code', value: 'type' },
          { kind: 'text', value: ' also helps verify the behavior in ' },
          { kind: 'code', value: 'Year / Month' },
          { kind: 'text', value: ' modes' }
        ]
      }
    ],
    previewNote: '',
    rangeHint: 'This preset syncs minDate / maxDate so you can check range limits quickly.',
    previewStateLabels: {
      mode: 'Picker mode',
      lang: 'Calendar language',
      yearType: 'Year display'
    },
    propDescriptions: {
      type: 'Switch between year, month, and date modes to compare different levels of selection.',
      lang: 'Change the language used inside the date picker panel.',
      calendarYearType: 'Toggle how the year is displayed between Republic Era and Common Era.',
      disabled: 'Disable the picker so users cannot interact with it.',
      showClearButton: 'Show the button that clears the current selection.',
      showTodayButton: 'Show a shortcut button that jumps to today.',
      closeOnClickOutside: 'Close the calendar panel when clicking outside the component.',
      closeOnEscape: 'Close the calendar panel when pressing Esc.',
      disableWeekends: 'Disable weekend dates so Saturdays and Sundays cannot be selected.',
      range: 'Limit the selectable date range and quickly verify minDate and maxDate.'
    },
    booleanLabels: {
      on: 'On',
      off: 'Off'
    },
    typeLabels: {
      year: 'year',
      month: 'month',
      date: 'date'
    },
    pickerLangLabels: {
      zhTW: 'Chinese',
      en: 'English'
    },
    yearTypeLabels: {
      RepublicEra: 'Republic Era',
      CommonEra: 'Common Era'
    },
    rangeLabels: {
      none: 'Unlimited',
      currentYear: 'Current year',
      rollingWindow: 'Last 6 months'
    }
  }
};
