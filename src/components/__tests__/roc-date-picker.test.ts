import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { getRepublicEraYear } from '@/utils';
import { CalendarType, Language, YearType } from '@/interfaces';
import ROCDatePicker from '../ROCDatePicker.vue';

describe('Test Component ROCDatePicker', () => {
  it('init calendar properly', async () => {
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

  it('test click on go to last decade button', async () => {
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

  it('test click on go to last year button', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    const originYear = wrapper.vm.yearOnCalendar;
    const goToLastYearButton = wrapper.find('[data-test="last-year"]');
    await goToLastYearButton!.trigger('click');
    expect(wrapper.vm.yearOnCalendar).toBe(originYear - 1);
  });

  it('test click on go to last month button', async () => {
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

  it('test click on go to next decade button', async () => {
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

  it('test click on go to next year button', async () => {
    const wrapper = mount(ROCDatePicker);

    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    const originYear = wrapper.vm.yearOnCalendar;
    const goToNextYearButton = wrapper.find('[data-test="next-year"]');
    await goToNextYearButton!.trigger('click');
    expect(wrapper.vm.yearOnCalendar).toBe(originYear + 1);
  });

  it('test click on go to next month button', async () => {
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

  it('render year display properly and test year button', async () => {
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

  it('render month display properly and test month button', async () => {
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

  it('should not show calendar when date picker is disabled', async () => {
    const wrapper = mount(ROCDatePicker, {
      props: {
        disabled: true
      }
    });
    const datePickerInput = wrapper.find('[data-test="date-picker-input"]');
    await datePickerInput!.trigger('click');

    expect(wrapper.vm.isCalendarVisible).toBe(false);
  });

  it('test select date', async () => {
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

  it('test select month', async () => {
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
    wrapper.setProps({ type: CalendarType.DATE });

    await datePickerInput!.trigger('click');
    const getMonthButton = () => wrapper.find('[data-test="month-button"]');
    await getMonthButton().trigger('click');
    await getMonthCells().at(8)?.trigger('click');

    expect(wrapper.find('[data-test="date-calendar"]').exists()).toBe(true);
    expect(wrapper.find('[data-test="month-calendar"]').exists()).toBe(false);
    expect(wrapper.find('[data-test="year-calendar"]').exists()).toBe(false);
  });

  it('test select year', async () => {
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
    wrapper.setProps({ type: CalendarType.DATE });

    await datePickerInput!.trigger('click');
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

  it('watch canGoLastMonth', async () => {
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
  it('render year type switch properly', async () => {
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
});
