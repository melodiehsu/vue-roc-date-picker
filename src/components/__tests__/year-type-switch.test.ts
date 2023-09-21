import { YEAR_TYPE } from '@/constants';
import { mount } from '@vue/test-utils';
import {
  describe, expect, it
} from 'vitest';
import YearTypeSwitch from '../YearTypeSwitch.vue';

describe('Test Component YearTypeSwitch', async () => {
  const defaultProps = {
    lang: 'zhTW',
    calendarYearType: YEAR_TYPE.RepublicEraYear,
    hasRepublicEraYear: true
  };

  it('render switch properly', async () => {
    const wrapper = mount(YearTypeSwitch, {
      props: { ...defaultProps }
    });

    let yearTypeButtonText;
    let yearTypeButton;

    const getCurrentSwitch = () => {
      yearTypeButton = wrapper.findAll('button')?.at(0);
      yearTypeButtonText = yearTypeButton?.text();
    };

    getCurrentSwitch();
    expect(yearTypeButtonText).toBe('民國');
    await yearTypeButton!.trigger('click');

    expect(wrapper.emitted('click')).toBeTruthy();
    const emittedValues = wrapper.emitted('click');
    expect(emittedValues![0]).toEqual(['CE']);

    wrapper.setProps({
      calendarYearType: YEAR_TYPE.CE
    });
    await wrapper.vm.$nextTick();
    getCurrentSwitch();
    expect(yearTypeButtonText).toBe('西元');

    await yearTypeButton!.trigger('click');
    expect(wrapper.emitted('click')).toBeTruthy();
    expect(emittedValues![1]).toEqual(['RepublicEraYear']);

    wrapper.setProps({
      hasRepublicEraYear: false
    });
    await wrapper.vm.$nextTick();
    getCurrentSwitch();
    expect(yearTypeButton).toBe(undefined);
  });
});
