import {
  describe, it, expect
} from 'vitest';
import { mount } from '@vue/test-utils';
import { Language, YearType } from '@/lib/interfaces';
import DateCalendar from '../calendar/DateCalendar.vue';

describe('Test Component DateCalendar', () => {
  const defaultProps = {
    lang: Language.ZH_TW,
    calendarYear: 2023,
    /* month Sep */
    calendarMonth: 8,
    calendarYearType: YearType.RepublicEra
  };

  it('populates date cells correctly', async () => {
    const wrapper = mount(DateCalendar, {
      props: { ...defaultProps }
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dateCells[4]).toBe(1);

    wrapper.setProps({
      calendarYear: 2023,
      /* month Oct */
      calendarMonth: 9
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.vm.dateCells[6]).toBe(1);
  });

  it('handles date selection', async () => {
    const wrapper = mount(DateCalendar, {
      props: {
        ...defaultProps
      }
    });

    await wrapper.vm.$nextTick();

    // get date cells
    const dateCells = wrapper.findAll('[data-test="date-cell"]');

    // get random index
    let randomIndex: number;
    const getRandomIndex = () => {
      randomIndex = Math.floor(Math.random() * dateCells.length);
      return randomIndex;
    };

    // get valid date cell
    let dateCell;
    do {
      getRandomIndex();
      dateCell = dateCells.at(getRandomIndex());
    } while (!dateCell?.text());

    await dateCell.trigger('click');
    expect(wrapper.vm.isSelected(Number(dateCell.text()))).toBe(true);

    const allIndices = Array.from({ length: dateCells.length }, (_, index) => index);
    const indicesExceptRandom = allIndices.filter((index) => index !== randomIndex);

    // test the other cells
    indicesExceptRandom.forEach((index) => {
      expect(wrapper.vm.isSelected(wrapper.vm.dateCells[index])).toBe(false);
    });
  });

  it('keeps selectedFullDate in sync with defaultFullDate', () => {
    const wrapper = mount(DateCalendar, {
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

  it('highlights today\'s date', async () => {
    const today = new Date();
    const wrapper = mount(DateCalendar, {
      props: {
        ...defaultProps,
        calendarYear: today.getFullYear(),
        calendarMonth: today.getMonth()
      }
    });

    await wrapper.vm.$nextTick();
    expect(wrapper.find('.today-date').exists()).toBe(true);
  });

  it('disables weekend dates when disableWeekends is true', async () => {
    const wrapper = mount(DateCalendar, {
      props: {
        ...defaultProps,
        disableWeekends: true
      }
    });

    await wrapper.vm.$nextTick();
    const dateCells = wrapper.findAll('[data-test="date-cell"]');
    const weekendDateCell = dateCells.find((cell) => cell.text() === '2');
    expect(weekendDateCell?.attributes('disabled')).toBeDefined();

    await weekendDateCell?.trigger('click');
    expect(wrapper.vm.selectedFullDate.timeValue).toBeUndefined();
  });

  it('disables dates by min/max range and disabledDates', async () => {
    const wrapper = mount(DateCalendar, {
      props: {
        ...defaultProps,
        minDate: '2023-09-10',
        maxDate: '2023-09-20',
        disabledDates: ['2023-09-11']
      }
    });

    await wrapper.vm.$nextTick();
    const dateCells = wrapper.findAll('[data-test="date-cell"]');
    const beforeMinDateCell = dateCells.find((cell) => cell.text() === '9');
    const disabledDateCell = dateCells.find((cell) => cell.text() === '11');
    const validDateCell = dateCells.find((cell) => cell.text() === '12');
    const afterMaxDateCell = dateCells.find((cell) => cell.text() === '21');

    expect(beforeMinDateCell?.attributes('disabled')).toBeDefined();
    expect(disabledDateCell?.attributes('disabled')).toBeDefined();
    expect(validDateCell?.attributes('disabled')).toBeUndefined();
    expect(afterMaxDateCell?.attributes('disabled')).toBeDefined();
  });
});
