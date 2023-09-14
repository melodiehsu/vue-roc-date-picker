import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { CALENDAR_TYPE, YEAR_TYPE } from '@/constants';
import YearCalendar from '../calendar/YearCalendar.vue';

describe('Test Component YearCalendar', () => {
  const defaultProps = {
    lang: 'zhTW',
    calendarYearType: YEAR_TYPE.RepublicEraYear,
    type: CALENDAR_TYPE.date,
    decadeRange: []
  };

  it('render years calendar properly', async () => {
    const wrapper = mount(YearCalendar, {
      props: { ...defaultProps }
    });

    await wrapper.setProps({ decadeRange: [2020, 2029] });
    expect(wrapper.vm.years.length).toBe(10);
    expect(wrapper.vm.years).toContain(2021);
    expect(wrapper.vm.years).not.toContain(1921);
    expect(wrapper.vm.years).not.toContain(2030);

    await wrapper.setProps({ decadeRange: [1910, 1919] });
    expect(wrapper.vm.years.length).toBeLessThanOrEqual(10);
    expect(wrapper.vm.years).toContain(1912);
    expect(wrapper.vm.years).not.toContain(1910);
    expect(wrapper.vm.years).not.toContain(1920);
  });

  it('handle select year properly', async () => {
    const wrapper = mount(YearCalendar, {
      props: {
        ...defaultProps,
        decadeRange: [2020, 2029]
      }
    });

    await wrapper.vm.$nextTick();

    const yearCells = wrapper.findAll('div.year-cell');
    const randomIndex = Math.floor(Math.random() * yearCells.length);
    const yearValue = yearCells[randomIndex].text();
    await yearCells.at(randomIndex)!.trigger('click', {
      data: yearValue
    });

    const selectedYear = (wrapper.vm.selectedFullDate.timeValue as Date).getFullYear();
    expect(selectedYear).toBeGreaterThanOrEqual(2020);
    expect(selectedYear).toBeLessThanOrEqual(2029);

    await wrapper.setProps({ type: CALENDAR_TYPE.year });
    await yearCells.at(randomIndex)!.trigger('click', {
      data: yearValue
    });
    const selectedYearLabel = wrapper.vm.selectedFullDate.label;
    expect(selectedYearLabel).toBe(`${yearValue}`);
  });

  it('selectedFullDate equals to defaultFullDate if it exists, ', () => {
    const wrapper = mount(YearCalendar, {
      props: {
        ...defaultProps,
        decadeRange: [2020, 2029],
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
