import { describe, it, expect } from 'vitest';
import { CalendarType, YearType } from '@/lib/interfaces';
import { setDatePickerLabel } from '../index';

describe('Test setDatePickerLabel', () => {
  it('formats date picker labels for different calendar types', () => {
    const baseTestCase = {
      selectedDate: new Date('2023/09/11'),
      formatYear: 2023,
      datePickerType: CalendarType.DATE,
      calendarYearType: YearType.RepublicEra
    };

    expect(setDatePickerLabel(baseTestCase)).toBe('112/09/11');

    expect(setDatePickerLabel({
      ...baseTestCase,
      datePickerType: CalendarType.YEAR,
      calendarYearType: YearType.RepublicEra
    })).toBe('112');

    expect(setDatePickerLabel({
      ...baseTestCase,
      datePickerType: CalendarType.MONTH
    })).toBe('112/09');

    expect(setDatePickerLabel({
      ...baseTestCase,
      calendarYearType: YearType.CommonEra
    })).toBe('2023-09-11');
  });
});
