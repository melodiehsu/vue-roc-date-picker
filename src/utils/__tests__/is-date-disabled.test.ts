import { describe, expect, it } from 'vitest';
import { isDateDisabled } from '../index';

describe('Test isDateDisabled', () => {
  it('returns true for dates outside min/max range', () => {
    expect(isDateDisabled({
      targetDate: '2023-09-09',
      minDate: '2023-09-10'
    })).toBe(true);

    expect(isDateDisabled({
      targetDate: '2023-09-21',
      maxDate: '2023-09-20'
    })).toBe(true);
  });

  it('returns true for weekend dates when disableWeekends is enabled', () => {
    expect(isDateDisabled({
      targetDate: '2023-09-10',
      disableWeekends: true
    })).toBe(true);
  });

  it('returns true for explicitly disabled dates', () => {
    expect(isDateDisabled({
      targetDate: '2023-09-11',
      disabledDates: ['2023-09-11']
    })).toBe(true);
  });

  it('supports month boundary checks', () => {
    expect(isDateDisabled({
      targetDate: new Date(2023, 8, 1),
      minDate: '2023-09-01',
      maxDate: '2023-12-31',
      unit: 'month'
    })).toBe(false);

    expect(isDateDisabled({
      targetDate: new Date(2023, 7, 1),
      minDate: '2023-09-01',
      unit: 'month'
    })).toBe(true);
  });
});
