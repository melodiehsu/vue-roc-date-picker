import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { getRepublicEraYear } from '@/utils';
import { CalendarType, Language, YearType } from '@/interfaces';
import YearCalendar from '../calendar/YearCalendar.vue';

describe('Test Component YearCalendar', () => {
  const defaultProps = {
    lang: Language.ZH_TW,
    calendarYearType: YearType.RepublicEra,
    type: CalendarType.DATE,
    decadeRange: []
  };

  it('populates years correctly', async () => {
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

  it('handles year selection', async () => {
    const wrapper = mount(YearCalendar, {
      props: {
        ...defaultProps,
        decadeRange: [2020, 2029]
      }
    });

    await wrapper.vm.$nextTick();

    const yearCells = wrapper.findAll('[data-test="year-cell"]');
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

    await wrapper.setProps({ type: CalendarType.YEAR });
    await yearCells.at(randomIndex)!.trigger('click');

    const yearLabel = yearCells[randomIndex].text();
    const selectedYearLabel = wrapper.vm.selectedFullDate.label;

    expect(selectedYearLabel).toBe(`${yearLabel}`);
    expect(emittedValues![0]).toEqual([wrapper.vm.selectedFullDate]);
  });

  it('keeps selectedFullDate in sync with defaultFullDate', () => {
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

  it('renders years for each year type', async () => {
    const wrapper = mount(YearCalendar, {
      props: {
        ...defaultProps,
        decadeRange: [2020, 2029]
      }
    });

    await wrapper.vm.$nextTick();

    const yearCells = wrapper.findAll('[data-test="year-cell"]');
    const randomIndex = Math.floor(Math.random() * yearCells.length);
    let yearCell = yearCells[randomIndex].text();

    const { years } = wrapper.vm;
    expect(yearCell).toBe(`${getRepublicEraYear(years[randomIndex])}`);

    await wrapper.setProps({ calendarYearType: YearType.CommonEra });
    await wrapper.vm.$nextTick();

    yearCell = yearCells[randomIndex].text();
    expect(yearCell).toBe(`${wrapper.vm.years[randomIndex]}`);
  });

  it('disables years outside min and max range', async () => {
    const wrapper = mount(YearCalendar, {
      props: {
        ...defaultProps,
        decadeRange: [2020, 2029],
        type: CalendarType.YEAR,
        minDate: '2022-01-01',
        maxDate: '2027-12-31'
      }
    });

    await wrapper.vm.$nextTick();

    const yearCells = wrapper.findAll('[data-test="year-cell"]');
    const disabledYear = yearCells.at(1);
    const enabledYear = yearCells.at(2);

    expect(disabledYear?.attributes('disabled')).toBeDefined();
    expect(enabledYear?.attributes('disabled')).toBeUndefined();

    await disabledYear?.trigger('click');
    expect(wrapper.emitted('click')).toBeFalsy();

    await enabledYear?.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
  });
});
