import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { getRepublicEraYear } from '@/utils';
import { CalendarType, Language, YearType } from '@/interfaces';
import ROCDatePicker from '../ROCDatePicker.vue';

describe('Test Component ROCDatePicker', () => {
  it('renders initial calendar state', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        defaultValue: '1879-12-01'
      }
    });

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    const displayYear = wrapper.find('[data-test="year-button"]').text();
    expect(displayYear).toBe(`${wrapper.vm.yearOnCalendar}`);
  });

  it('navigates to previous decade', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');
    await wrapper.find('[data-test="year-button"]').trigger('click');

    const originDecade = wrapper.vm.decadeRange;
    const goToLastDecadeButton = wrapper.find('[data-test="last-decade"]');
    await goToLastDecadeButton!.trigger('click');

    expect(wrapper.vm.decadeRange).toStrictEqual(
      [originDecade[0] - 10, originDecade[1] - 10]
    );
  });

  it('keeps year calendar open when moving from ROC 9-18 to 1-8', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        modelValue: new Date(1925, 0, 1),
        calendarYearType: YearType.RepublicEra
      }
    });

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');
    await wrapper.find('[data-test="year-button"]').trigger('click');

    await wrapper.find('[data-test="last-decade"]').trigger('click');

    expect(wrapper.vm.isCalendarVisible).toBe(true);
    expect(wrapper.vm.isYearCalendarVisible).toBe(true);
    expect(wrapper.vm.decadeRange).toStrictEqual([1910, 1919]);
  });

  it('navigates to previous year', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    const originYear = wrapper.vm.yearOnCalendar;
    const goToLastYearButton = wrapper.find('[data-test="last-year"]');
    await goToLastYearButton!.trigger('click');
    expect(wrapper.vm.yearOnCalendar).toBe(originYear - 1);
  });

  it('navigates to previous month', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        defaultValue: '2023-01-01'
      }
    });

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    let originMonth = wrapper.vm.monthOnCalendar;
    const originYear = wrapper.vm.yearOnCalendar;

    const getGoToLastMonthButton = () => wrapper.find('[data-test="last-month"]');
    await getGoToLastMonthButton()!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(11);
    expect(wrapper.vm.yearOnCalendar).toBe(originYear - 1);

    wrapper.setProps({ defaultValue: '2023-02-01' });
    await wrapper.vm.$nextTick();
    originMonth = wrapper.vm.monthOnCalendar;
    getGoToLastMonthButton();
    await getGoToLastMonthButton()!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(originMonth - 1);
  });

  it('navigates to next decade', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');
    await wrapper.find('[data-test="year-button"]').trigger('click');

    const originDecade = wrapper.vm.decadeRange;
    const goToNextDecadeButton = wrapper.find('[data-test="next-decade"]');
    await goToNextDecadeButton!.trigger('click');

    expect(wrapper.vm.decadeRange).toStrictEqual(
      [originDecade[0] + 10, originDecade[1] + 10]
    );
  });

  it('navigates to next year', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    const originYear = wrapper.vm.yearOnCalendar;
    const goToNextYearButton = wrapper.find('[data-test="next-year"]');
    await goToNextYearButton!.trigger('click');
    expect(wrapper.vm.yearOnCalendar).toBe(originYear + 1);
  });

  it('navigates to next month', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        defaultValue: '2023-12-01'
      }
    });

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');
    let originMonth = wrapper.vm.monthOnCalendar;
    const originYear = wrapper.vm.yearOnCalendar;

    const getGoToNextMonthButton = () => wrapper.find('[data-test="next-month"]');
    await getGoToNextMonthButton()!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(0);
    expect(wrapper.vm.yearOnCalendar).toBe(originYear + 1);

    wrapper.setProps({ defaultValue: '2023-11-01' });
    await wrapper.vm.$nextTick();
    originMonth = wrapper.vm.monthOnCalendar;
    await getGoToNextMonthButton()!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(originMonth + 1);
  });

  it('renders year label and toggles year calendar', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    const getYearButtonText = () => wrapper.find('[data-test="year-button"]').text();

    const startYear = wrapper.vm.decadeRange[0];
    const endYear = wrapper.vm.decadeRange[1];
    const startYearLabel = () => (wrapper.vm.lang === 'zhTW' ? '民國 ' : 'ROC ');
    const endYearLabel = () => (wrapper.vm.lang === 'zhTW' ? ' 年' : '');

    /* show current year in ROC */
    expect(getYearButtonText()).toBe(`${startYearLabel()}${getRepublicEraYear(wrapper.vm.yearOnCalendar)}${endYearLabel()}`);

    /* open year calendar */
    await wrapper.find('[data-test="year-button"]').trigger('click');
    expect(wrapper.vm.isYearCalendarVisible).toBe(true);

    /* show current decade in ROC */
    expect(getYearButtonText()).toBe(`${startYearLabel()}${Math.max(getRepublicEraYear(startYear), 1)} - ${getRepublicEraYear(endYear)}${endYearLabel()}`);

    /* show ROC year in English version */
    await wrapper.setProps({ lang: Language.EN });
    await wrapper.vm.$nextTick();
    expect(getYearButtonText()).toBe(`${startYearLabel()}${Math.max(getRepublicEraYear(startYear), 1)} - ${getRepublicEraYear(endYear)}${endYearLabel()}`);

    /* show current decade in CE */
    wrapper.vm.handleChangeYearType(YearType.CommonEra);
    await wrapper.vm.$nextTick();

    expect(getYearButtonText()).toBe(`${startYear} - ${endYear}`);

    /* show current year in CE */
    wrapper.vm.setCalendarVisibility(CalendarType.DATE);
    await wrapper.vm.$nextTick();

    expect(getYearButtonText()).toBe(`${wrapper.vm.yearOnCalendar}`);
  });

  it('renders month label and toggles month calendar', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    const monthButtonText = wrapper.find('[data-test="month-button"]').text();
    expect(monthButtonText).not.toBe('');

    /* open month calendar */
    await wrapper.find('[data-test="month-button"]').trigger('click');

    const monthButtonStyles = window.getComputedStyle(wrapper.find('[data-test="month-button"]').element);
    const yearButtonStyles = window.getComputedStyle(wrapper.find('[data-test="year-button"]').element);

    expect(yearButtonStyles.display).toBe('inline-block');
    expect(monthButtonStyles.display).toBe('none');
  });

  it('does not open when disabled', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        disabled: true
      }
    });
    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    expect(wrapper.vm.isCalendarVisible).toBe(false);
  });

  it('syncs external modelValue updates', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        modelValue: new Date(2024, 0, 15)
      }
    });

    expect(wrapper.vm.yearOnCalendar).toBe(2024);
    expect(wrapper.vm.monthOnCalendar).toBe(0);

    await wrapper.setProps({
      modelValue: new Date(2025, 4, 6)
    });

    expect(wrapper.vm.yearOnCalendar).toBe(2025);
    expect(wrapper.vm.monthOnCalendar).toBe(4);
    expect(wrapper.vm.selectedTime.timeValue).toStrictEqual(new Date(2025, 4, 6));
  });

  it('prefers modelValue over defaultValue when both are provided', () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        defaultValue: '2023-01-01',
        modelValue: new Date(2024, 7, 8)
      }
    });

    expect(wrapper.vm.selectedTime.timeValue).toStrictEqual(new Date(2024, 7, 8));
    expect(wrapper.vm.yearOnCalendar).toBe(2024);
  });

  it('uses defaultValue when modelValue is empty', () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        defaultValue: new Date(2023, 0, 15)
      }
    });

    expect(wrapper.vm.selectedTime.timeValue).toStrictEqual(new Date(2023, 0, 15));
    expect(wrapper.vm.yearOnCalendar).toBe(2023);
    expect(wrapper.vm.monthOnCalendar).toBe(0);
  });

  it('selects a date', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');
    const dateCells = wrapper.findAll('[data-test="date-cell"]');
    await dateCells.at(15)?.trigger('click');

    expect(wrapper.vm.selectedTime.timeValue).toBeTruthy();

    // @ts-ignore
    const getInputText = () => wrapper.find('[data-test="date-picker-input"]').element.value;
    expect(getInputText()).toBe(wrapper.vm.selectedTime.label);
    expect(wrapper.vm.isCalendarVisible).toBe(false);
  });

  it('selects a month', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: { type: CalendarType.MONTH }
    });

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');
    const getMonthCells = () => wrapper.findAll('[data-test="month-cell"]');
    await getMonthCells().at(5)?.trigger('click');

    expect(wrapper.vm.selectedTime.timeValue).toStrictEqual(new Date(wrapper.vm.yearOnCalendar, wrapper.vm.monthOnCalendar));
    expect(wrapper.vm.isCalendarVisible).toBe(false);

    // @ts-ignore
    const getInputText = () => wrapper.find('[data-test="date-picker-input"]').element.value;
    expect(getInputText()).toBe(wrapper.vm.selectedTime.label);

    wrapper.vm.clearSelectedTime();
    await wrapper.vm.$nextTick();
    expect(getInputText()).toBe('');
    await wrapper.setProps({ type: CalendarType.DATE });

    await datePickerInput!.trigger('click');
    const getMonthButton = () => wrapper.find('[data-test="month-button"]');
    await getMonthButton().trigger('click');
    await getMonthCells().at(8)?.trigger('click');

    expect(wrapper.find('[data-test="date-calendar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="month-calendar"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="year-calendar"]').exists()).toBe(false);
  });

  it('selects a year', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: { type: CalendarType.YEAR }
    });

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');
    const getYearCells = () => wrapper.findAll('[data-test="year-cell"]');

    await getYearCells().at(3)?.trigger('click');

    expect(wrapper.vm.selectedTime.timeValue).toStrictEqual(new Date(wrapper.vm.selectedTime.timeValue!.getFullYear(), 0));
    expect(wrapper.vm.isCalendarVisible).toBe(false);

    // @ts-ignore
    const getInputText = () => wrapper.find('[data-test="date-picker-input"]').element.value;
    expect(getInputText()).toBe(wrapper.vm.selectedTime.label);

    wrapper.vm.clearSelectedTime();
    await wrapper.vm.$nextTick();
    await wrapper.setProps({ type: CalendarType.DATE });

    await datePickerInput!.trigger('click');
    await wrapper.find('[data-test="year-button"]').trigger('click');
    await getYearCells().at(3)?.trigger('click');

    expect(wrapper.find('[data-test="date-calendar"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="month-calendar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="year-calendar"]').exists()).toBe(false);

    const getMonthCells = () => wrapper.findAll('[data-test="month-cell"]');
    await getMonthCells().at(4)?.trigger('click');

    expect(wrapper.find('[data-test="date-calendar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="month-calendar"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="year-calendar"]').exists()).toBe(false);
  });

  it('hides the previous month control at range start', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: { defaultValue: '1912-01-12' }
    });

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    await wrapper.vm.$nextTick();
    const monthButtonStyles = window.getComputedStyle(wrapper.find('[data-test="last-month"]').element);

    expect(monthButtonStyles.display).toBe('none');
  });

  // see: issue #1
  it('shows the year type switch when the decade is selectable', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        defaultValue: '1900-01-01'
      }
    });

    // open date picker input
    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    // click year button
    await wrapper.find('[data-test="year-button"]').trigger('click');
    expect(wrapper.find('[data-test="year-type-switch"]').exists()).toBe(false);

    // click next decade (1910-1919)
    await wrapper.find('[data-test="next-decade"]').trigger('click');
    expect(wrapper.find('[data-test="year-type-switch"]').exists()).toBe(true);
  });

  it('emits empty model value when selection is cleared', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        modelValue: new Date(2024, 0, 15)
      }
    });

    wrapper.vm.clearSelectedTime();
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toStrictEqual([undefined]);
  });

  it('syncs external modelValue and calendarYearType changes', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        modelValue: '2023-05-10'
      }
    });

    await wrapper.setProps({ modelValue: '2024-06-15' });

    expect(wrapper.vm.yearOnCalendar).toBe(2024);
    expect(wrapper.vm.monthOnCalendar).toBe(5);
    expect(wrapper.vm.selectedTime.label).toBe('113/06/15');

    await wrapper.setProps({ calendarYearType: YearType.CommonEra });
    expect(wrapper.vm.selectedTime.label).toBe('2024-06-15');
  });

  it('closes the calendar on outside click by default', async () => {
    const wrapper = mount(ROCDatePicker, {
      attachTo: document.body
    });

    await wrapper.find('[data-test="date-picker-input"]').trigger('click');
    expect(wrapper.vm.isCalendarVisible).toBe(true);

    document.body.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isCalendarVisible).toBe(false);
    wrapper.unmount();
  });

  it('keeps the calendar open when closeOnClickOutside is disabled', async () => {
    const wrapper = mount(ROCDatePicker, {
      attachTo: document.body,
      props: {
        closeOnClickOutside: false
      }
    });

    await wrapper.find('[data-test="date-picker-input"]').trigger('click');
    document.body.click();
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isCalendarVisible).toBe(true);
    wrapper.unmount();
  });

  it('closes the calendar on escape key by default', async () => {
    const wrapper = mount(ROCDatePicker, {
      attachTo: document.body
    });

    await wrapper.find('[data-test="date-picker-input"]').trigger('click');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isCalendarVisible).toBe(false);
    wrapper.unmount();
  });

  it('keeps the calendar open when closeOnEscape is disabled', async () => {
    const wrapper = mount(ROCDatePicker, {
      attachTo: document.body,
      props: {
        closeOnEscape: false
      }
    });

    await wrapper.find('[data-test="date-picker-input"]').trigger('click');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isCalendarVisible).toBe(true);
    wrapper.unmount();
  });

  it('selects today from shortcut button', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        showTodayButton: true
      }
    });

    await wrapper.find('[data-test="date-picker-input"]').trigger('click');
    await wrapper.find('[data-test="today-button"]').trigger('click');

    const today = new Date();
    const selectedDate = wrapper.vm.selectedTime.timeValue as Date;

    expect(selectedDate.getFullYear()).toBe(today.getFullYear());
    expect(selectedDate.getMonth()).toBe(today.getMonth());
    expect(selectedDate.getDate()).toBe(today.getDate());
    expect(wrapper.vm.isCalendarVisible).toBe(false);
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });
});
