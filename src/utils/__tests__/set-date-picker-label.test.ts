import { describe, it, expect } from 'vitest';
import { CALENDAR_TYPE, YEAR_TYPE } from '@/constants';
import { setDatePickerLabel } from '../index';

describe('setDatePickerLabel', () => {
  it('should return Republic Era Year', () => {
    const result = setDatePickerLabel({
      calendarYearType: YEAR_TYPE.RepublicEraYear,
      selectedDateObject: new Date('2023/09/11'),
      formatYear: 2023,
      datePickerType: CALENDAR_TYPE.date
    });

    expect(result).toBe('112/09/11');
  });
});
