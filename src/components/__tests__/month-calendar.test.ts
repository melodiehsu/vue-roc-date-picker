import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { MONTHS } from '@/constants';
import { getCalendarLang } from '@/utils';
import { CalendarType, Language, YearType } from '@/interfaces';
import MonthCalendar from '../calendar/MonthCalendar.vue';

describe('Test Component MonthCalendar', () => {
  const defaultProps = {
    lang: Language.ZH_TW,
    calendarYearType: YearType.RepublicEra,
    type: CalendarType.DATE,
    calendarYear: new Date().getFullYear()
  };

  it('render month calendar properly', async () => {
    const wrapper = mount(MonthCalendar, {
      props: { ...defaultProps }
    });
    await wrapper.vm.$nextTick();
    const monthCells = wrapper.findAll('[data-test="month-cell"]');
    monthCells.forEach((monthCell) => {
      expect(monthCell.exists()).toBe(true);
    });
  });

  it('handle select month properly', async () => {
    const wrapper = mount(MonthCalendar, {
      props: {
        ...defaultProps
      }
    });

    await wrapper.vm.$nextTick();

    const monthCells = wrapper.findAll('[data-test="month-cell"]');
    const randomIndex = Math.floor(Math.random() * monthCells.length);

    const monthLabel = monthCells[randomIndex].text();
    await monthCells.at(randomIndex)!.trigger('click', {
      data: monthLabel
    });

    expect(monthLabel).toBe(getCalendarLang(wrapper.vm.lang).month[MONTHS[randomIndex]]);

    await wrapper.setProps({ type: CalendarType.MONTH });
    await monthCells.at(randomIndex)!.trigger('click');

    const selectedTimeLabel = wrapper.vm!.selectedFullDate.label as string;
    expect(selectedTimeLabel).toBeTruthy();

    const labelPattern = /^\d+\/(0[1-9]|1[0-2])$/;
    expect(labelPattern.test(selectedTimeLabel)).toBe(true);
  });

  it('selectedFullDate equals to defaultFullDate if it exists', () => {
    const wrapper = mount(MonthCalendar, {
      props: {
        ...defaultProps,
        defaultFullDate: {
          label: '112/09/11',
          timeValue: new Date('112/09/11')
        }
      }
    });

    const { selectedFullDate } = wrapper.vm;
    expect(selectedFullDate).toStrictEqual(wrapper.vm.defaultFullDate);
  });
});
