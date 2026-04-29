# vue-roc-date-picker

A date picker UI component that displays years in Republic Era or Common Era.<br>
以 Vue3 + Typescript 開發，一個可顯示民國 / 西元年的日期選擇器 UI 套件

### [Demo](https://melodiehsu.github.io/vue-roc-date-picker/)

## Installation
```sh
npm i vue3-roc-date-picker
```

## Usage
Import the component and styles in `main.ts`:
```js
// main.ts
import ROCDatePicker from 'vue3-roc-date-picker';
import 'vue3-roc-date-picker/style.css';

app.use(ROCDatePicker);
```

Use the component in `App.vue`:
```vue
<ROCDatePicker
  v-model="value"
/>
```

### Style import migration
Recommended:
```js
import 'vue3-roc-date-picker/style.css';
```

Legacy, still supported:
```js
import 'vue3-roc-date-picker/dist/style.css';
```

The legacy path is kept for backward compatibility and is planned to be removed in the next major version.

## Attributes
| Name | Description | Type | Accepted Values | Default Value |
|---|---|---|---|---|
| `model-value / v-model` | Bound value. | `Date \| string` | Any valid date value | '' |
| `lang` | Language selection. | String | `'en'`, `'zhTW'` | `'zhTW'` |
| `calendarYearType` | Year type selection. | String | `'CommonEra'`, `'RepublicEra'` | `'RepublicEra'` |
| `placeholder` | Placeholder text. | String | Any valid string value | '' |
| `type` | Date picker type. | String | `'year'`, `'month'`, `'date'` | `'date'` |
| `defaultValue` | Default value. | `Date \| string` | Valid date value, for example `2023-09-28` | '' |
| `minDate` | Earliest selectable date. | `Date \| string` | Valid date value | '' |
| `maxDate` | Latest selectable date. | `Date \| string` | Valid date value | '' |
| `disabled` | Whether the date picker is disabled. | Boolean | `true` or `false` | false |
| `zIndex` | Z-index of the popup calendar. | Number | Any valid positive integer | 1 |
| `showClearButton` | Whether to show the clear button. | Boolean | `true` or `false` | true |
| `showTodayButton` | Whether to show the `Today` shortcut button. | Boolean | `true` or `false` | false |
| `closeOnClickOutside` | Close the calendar when clicking outside. | Boolean | `true` or `false` | true |
| `closeOnEscape` | Close the calendar when pressing `Esc`. | Boolean | `true` or `false` | true |
| `disableWeekends` | Disable Saturdays and Sundays. | Boolean | `true` or `false` | false |
| `disabledDates` | Explicit list of disabled dates. | `(Date \| String)[]` | Valid date values | `[]` |
