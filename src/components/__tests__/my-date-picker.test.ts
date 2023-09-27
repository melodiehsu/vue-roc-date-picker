import { mount } from '@vue/test-utils';
import {
  describe, expect, it, vi
} from 'vitest';
import { getRepublicEraYear } from '@/utils';
import { CALENDAR_TYPE } from '@/constants';
import MyDatePicker from '../MyDatePicker.vue';

describe('Test Component MyDatePicker', () => {
  it('init calendar properly', async () => {
    const wrapper = mount(MyDatePicker, {
      props: {
        defaultValue: '1879-12-01'
      }
    });

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');

    const displayYear = wrapper.find('.year-button').text();
    expect(displayYear).toBe(`${wrapper.vm.yearOnCalendar}`);
  });

  it('test click on go to last decade button', async () => {
    const wrapper = mount(MyDatePicker);

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');
    await wrapper.find('.year-button').trigger('click');

    const originDecade = wrapper.vm.decadeRange;
    const goToLastDecadeButton = wrapper.find('.last-decade');
    await goToLastDecadeButton!.trigger('click');

    expect(wrapper.vm.decadeRange).toStrictEqual(
      [originDecade[0] - 10, originDecade[1] - 10]
    );
  });

  it('test click on go to last year button', async () => {
    const wrapper = mount(MyDatePicker);

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');

    const originYear = wrapper.vm.yearOnCalendar;
    const goToLastYearButton = wrapper.find('.last-year');
    await goToLastYearButton!.trigger('click');
    expect(wrapper.vm.yearOnCalendar).toBe(originYear - 1);
  });

  it('test click on go to last month button', async () => {
    const wrapper = mount(MyDatePicker, {
      props: {
        defaultValue: '2023-01-01'
      }
    });

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');

    let originMonth = wrapper.vm.monthOnCalendar;
    const originYear = wrapper.vm.yearOnCalendar;

    let goToLastMonthButton = wrapper.find('.last-month');
    await goToLastMonthButton!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(11);
    expect(wrapper.vm.yearOnCalendar).toBe(originYear - 1);

    wrapper.setProps({ defaultValue: '2023-02-01' });
    originMonth = wrapper.vm.monthOnCalendar;
    goToLastMonthButton = wrapper.find('.last-month');
    await goToLastMonthButton!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(originMonth - 1);
  });

  it('test click on go to next decade button', async () => {
    const wrapper = mount(MyDatePicker);

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');
    await wrapper.find('.year-button').trigger('click');

    const originDecade = wrapper.vm.decadeRange;
    const goToNextDecadeButton = wrapper.find('.next-decade');
    await goToNextDecadeButton!.trigger('click');

    expect(wrapper.vm.decadeRange).toStrictEqual(
      [originDecade[0] + 10, originDecade[1] + 10]
    );
  });

  it('test click on go to next year button', async () => {
    const wrapper = mount(MyDatePicker);

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');

    const originYear = wrapper.vm.yearOnCalendar;
    const goToNextYearButton = wrapper.find('.next-year');
    await goToNextYearButton!.trigger('click');
    expect(wrapper.vm.yearOnCalendar).toBe(originYear + 1);
  });

  it('test click on go to next month button', async () => {
    const wrapper = mount(MyDatePicker, {
      props: {
        defaultValue: '2023-12-01'
      }
    });

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');
    let originMonth = wrapper.vm.monthOnCalendar;
    const originYear = wrapper.vm.yearOnCalendar;

    let goToNextMonthButton = wrapper.find('.next-month');
    await goToNextMonthButton!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(0);
    expect(wrapper.vm.yearOnCalendar).toBe(originYear + 1);

    wrapper.setProps({ defaultValue: '2023-11-01' });
    originMonth = wrapper.vm.monthOnCalendar;
    goToNextMonthButton = wrapper.find('.next-month');
    await goToNextMonthButton!.trigger('click');

    expect(wrapper.vm.monthOnCalendar).toBe(originMonth + 1);
  });

  it('render year display properly and test year button', async () => {
    const wrapper = mount(MyDatePicker);

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');

    let yearButtonText = wrapper.find('.year-button').text();

    const startYear = wrapper.vm.decadeRange[0];
    const endYear = wrapper.vm.decadeRange[1];
    const startYearLabel = () => (wrapper.vm.lang === 'zhTW' ? '民國 ' : 'ROC ');
    const endYearLabel = () => (wrapper.vm.lang === 'zhTW' ? ' 年' : '');

    vi.spyOn(wrapper.vm, 'handleChangeYearType');
    vi.spyOn(wrapper.vm, 'setCalendarVisibility');

    /* show current year in ROC */
    expect(yearButtonText).toBe(`${startYearLabel()}${getRepublicEraYear(wrapper.vm.yearOnCalendar)}${endYearLabel()}`);

    /* open year calendar */
    await wrapper.find('.year-button').trigger('click');
    expect(wrapper.vm.isYearCalendarVisible).toBe(true);

    /* show current decade in ROC */
    yearButtonText = wrapper.find('.year-button').text();
    expect(yearButtonText).toBe(`${startYearLabel()}${Math.max(getRepublicEraYear(startYear), 1)} - ${getRepublicEraYear(endYear)}${endYearLabel()}`);

    /* show ROC year in English version */
    await wrapper.setProps({ lang: 'en' });
    await wrapper.vm.$nextTick();
    yearButtonText = wrapper.find('.year-button').text();

    expect(yearButtonText).toBe(`${startYearLabel()}${Math.max(getRepublicEraYear(startYear), 1)} - ${getRepublicEraYear(endYear)}${endYearLabel()}`);

    /* show current decade in CE */
    wrapper.vm.handleChangeYearType('CE');
    await wrapper.vm.$nextTick();

    yearButtonText = wrapper.find('.year-button').text();
    expect(yearButtonText).toBe(`${startYear} - ${endYear}`);

    /* show current year in CE */
    wrapper.vm.setCalendarVisibility(CALENDAR_TYPE.date);
    await wrapper.vm.$nextTick();

    yearButtonText = wrapper.find('.year-button').text();
    expect(yearButtonText).toBe(`${wrapper.vm.yearOnCalendar}`);
  });

  it('render month display properly and test month button', async () => {
    const wrapper = mount(MyDatePicker);

    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');

    const monthButtonText = wrapper.find('.month-button').text();
    expect(monthButtonText).toBeTruthy();

    /* open month calendar */
    await wrapper.find('.month-button').trigger('click');

    const monthButtonStyles = window.getComputedStyle(wrapper.find('.month-button').element);
    const yearButtonStyles = window.getComputedStyle(wrapper.find('.year-button').element);

    expect(yearButtonStyles.display).toBe('inline-block');
    expect(monthButtonStyles.display).toBe('none');
  });

  it('should not show calendar when date picker is disabled', async () => {
    const wrapper = mount(MyDatePicker, {
      props: {
        disabled: true
      }
    });
    const datePickerInput = wrapper.find('.date-picker-input');
    await datePickerInput!.trigger('click');

    expect(wrapper.vm.isCalendarVisible).toBe(false);
  });

  it.todo('handleDateChange');
  it.todo('handleMonthChange');
  it.todo('handleYearChange');
  it.todo('clearSelectedTime');
  it.todo('watch canGoLastMonth');
});
