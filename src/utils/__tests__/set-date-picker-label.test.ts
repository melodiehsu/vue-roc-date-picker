import { describe, it, expect } from 'vitest';
import { CALENDAR_TYPE, YEAR_TYPE } from '@/constants';
import { setDatePickerLabel } from '../index';

describe('Test setDatePickerLabel', () => {
  it('should return string of time according to different arguments', () => {
    const baseTestCase = {
      selectedDateObject: new Date('2023/09/11'),
      formatYear: 2023,
      datePickerType: CALENDAR_TYPE.date,
      calendarYearType: YEAR_TYPE.RepublicEraYear
    };

    expect(setDatePickerLabel(baseTestCase)).toBe('112/09/11');

    expect(setDatePickerLabel({
      ...baseTestCase,
      datePickerType: CALENDAR_TYPE.year,
      calendarYearType: YEAR_TYPE.RepublicEraYear
    })).toBe('112');

    expect(setDatePickerLabel({
      ...baseTestCase,
      datePickerType: CALENDAR_TYPE.month
    })).toBe('112/09');

    expect(setDatePickerLabel({
      ...baseTestCase,
      calendarYearType: YEAR_TYPE.CE
    })).toBe('2023-09-11');
  });
});
