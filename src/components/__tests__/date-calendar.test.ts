import {
  describe, it, expect
} from 'vitest';
import { mount } from '@vue/test-utils';
import { YEAR_TYPE } from '@/constants';
import DateCalendar from '../calendar/DateCalendar.vue';

describe('Test Component DateCalendar', () => {
  const defaultProps = {
    lang: 'zhTW',
    calendarYear: 2023,
    /* month Sep */
    calendarMonth: 8,
    calendarYearType: YEAR_TYPE.RepublicEraYear
  };

  it('populate date cells properly', async () => {
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

  it('handle select date properly', async () => {
    const wrapper = mount(DateCalendar, {
      props: {
        ...defaultProps
      }
    });

    await wrapper.vm.$nextTick();

    // get date cells
    const dateCells = wrapper.findAll('button.date-cell');

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

  it('selectedFullDate equals to defaultFullDate if it exists', () => {
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

  it.todo('show different color of the date today');
});
