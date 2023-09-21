import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { CALENDAR_TYPE, YEAR_TYPE } from '@/constants';
import { getRepublicEraYear } from '@/utils';
import YearCalendar from '../calendar/YearCalendar.vue';

describe('Test Component YearCalendar', () => {
  const defaultProps = {
    lang: 'zhTW',
    calendarYearType: YEAR_TYPE.RepublicEraYear,
    type: CALENDAR_TYPE.date,
    decadeRange: []
  };

  it('populate years properly', async () => {
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

    const yearCells = wrapper.findAll('button.year-cell');
    const randomIndex = Math.floor(Math.random() * yearCells.length);

    /* click on a yearCell randomly */
    await yearCells.at(randomIndex)!.trigger('click');
    expect(wrapper.vm.isSelected(wrapper.vm.years[randomIndex])).toBe(true);

    const allIndices = Array.from({ length: yearCells.length }, (_, index) => index);
    const indicesExceptRandom = allIndices.filter((index) => index !== randomIndex);

    indicesExceptRandom.forEach((index) => {
      /* other cells which has not been clicked should return false */
      expect(wrapper.vm.isSelected(wrapper.vm.years[index])).toBe(false);
    });

    expect(wrapper.emitted('click')).toBeTruthy();
    const emittedValues = wrapper.emitted('click');
    expect(emittedValues![0]).toEqual([wrapper.vm.selectedFullDate]);

    await wrapper.setProps({ type: CALENDAR_TYPE.year });
    await yearCells.at(randomIndex)!.trigger('click');

    const yearLabel = yearCells[randomIndex].text();
    const selectedYearLabel = wrapper.vm.selectedFullDate.label;

    expect(selectedYearLabel).toBe(`${yearLabel}`);
    expect(emittedValues![0]).toEqual([wrapper.vm.selectedFullDate]);
  });

  it('selectedFullDate equals to defaultFullDate if it exists', () => {
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

  it('render years according to different year type', async () => {
    const wrapper = mount(YearCalendar, {
      props: {
        ...defaultProps,
        decadeRange: [2020, 2029]
      }
    });

    await wrapper.vm.$nextTick();

    const yearCells = wrapper.findAll('button.year-cell');
    const randomIndex = Math.floor(Math.random() * yearCells.length);
    let yearCell = yearCells[randomIndex].text();

    const { years } = wrapper.vm;
    expect(yearCell).toBe(`${getRepublicEraYear(years[randomIndex])}`);

    await wrapper.setProps({ calendarYearType: YEAR_TYPE.CE });
    await wrapper.vm.$nextTick();

    yearCell = yearCells[randomIndex].text();
    expect(yearCell).toBe(`${wrapper.vm.years[randomIndex]}`);
  });
});
