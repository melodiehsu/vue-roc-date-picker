import dayjs, { type ConfigType } from 'dayjs';
import { CalendarType, Language, YearType } from '@/interfaces';
import locales from '../locales/index';
import type { LocaleDictionary } from '../locales/index';

type DateBoundaryUnit = 'day' | 'month' | 'year';

const FORMAT_LOOKUP: Record<CalendarType, string> = {
  [CalendarType.DATE]: 'YYYY-MM-DD',
  [CalendarType.MONTH]: 'YYYY-MM',
  [CalendarType.YEAR]: 'YYYY'
};

const REPUBLIC_ERA_YEAR_FORMAT_LOOKUP: Record<CalendarType, string> = {
  [CalendarType.DATE]: 'MM/DD',
  [CalendarType.MONTH]: 'MM',
  [CalendarType.YEAR]: ''
};

export const getCalendarLang = (lang: Language): LocaleDictionary => {
  /**
   * Get calendar localization strings for the specified language
   * @param lang - Language code (e.g., 'zhTW', 'en')
   * @returns Localized calendar strings object
   */
  const langLookup: Record<Language, LocaleDictionary> = {
    zhTW: locales.zhTW,
    en: locales.en
  };
  const isValidLang = lang in langLookup;

  if (!lang || !isValidLang) return langLookup.en;
  return langLookup[lang];
};

/**
 * Format a date using dayjs with the specified pattern
 * @param date - Date object or date string
 * @param pattern - Format pattern (e.g., 'YYYY-MM-DD')
 * @returns Formatted date string
 */
export const formatDate = (date: ConfigType, pattern: string) => {
  if (!date) {
    return '';
  }

  return dayjs(date).format(pattern);
};

export const getValidDate = (dateValue: Date | string | undefined) => {
  if (!dateValue) return undefined;

  const parsedDate = dayjs(dateValue);
  return parsedDate.isValid() ? parsedDate.toDate() : undefined;
};

export const isDateOutsideRange = ({
  targetDate,
  minDate,
  maxDate,
  unit = 'day'
}: {
  targetDate: Date | string | undefined,
  minDate?: Date | string,
  maxDate?: Date | string,
  unit?: DateBoundaryUnit
}) => {
  const parsedTargetDate = getValidDate(targetDate);
  if (!parsedTargetDate) return false;

  const normalizedTargetDate = dayjs(parsedTargetDate).startOf(unit);
  const normalizedMinDate = getValidDate(minDate)
    ? dayjs(minDate).startOf(unit)
    : undefined;
  const normalizedMaxDate = getValidDate(maxDate)
    ? dayjs(maxDate).startOf(unit)
    : undefined;

  if (normalizedMinDate && normalizedTargetDate.isBefore(normalizedMinDate)) {
    return true;
  }

  if (normalizedMaxDate && normalizedTargetDate.isAfter(normalizedMaxDate)) {
    return true;
  }

  return false;
};

export const isCalendarDateDisabled = ({
  targetDate,
  minDate,
  maxDate,
  unit = 'day',
  disableWeekends = false,
  disabledDates = []
}: {
  targetDate: Date | string | undefined,
  minDate?: Date | string,
  maxDate?: Date | string,
  unit?: DateBoundaryUnit,
  disableWeekends?: boolean,
  disabledDates?: (Date | string)[]
}) => {
  const parsedTargetDate = getValidDate(targetDate);
  if (!parsedTargetDate) return false;

  if (isDateOutsideRange({
    targetDate: parsedTargetDate,
    minDate,
    maxDate,
    unit
  })) {
    return true;
  }

  if (unit === 'day' && disableWeekends && [0, 6].includes(dayjs(parsedTargetDate).day())) {
    return true;
  }

  if (unit === 'day' && disabledDates.length > 0) {
    const targetDateTimestamp = dayjs(parsedTargetDate).startOf('day').valueOf();
    const disabledDateTimestamps = disabledDates
      .map((date) => getValidDate(date))
      .filter((date): date is Date => date !== undefined)
      .map((date) => dayjs(date).startOf('day').valueOf());

    return disabledDateTimestamps.includes(targetDateTimestamp);
  }

  return false;
};

/**
 * Convert Gregorian year to Republic Era year (Taiwan calendar)
 * @param year - Gregorian year
 * @returns Republic Era year (year - 1911)
 */
export const getRepublicEraYear = (year: number) => year - 1911;

/**
 * Generate formatted label for date picker based on selected date and calendar type
 * @param options - Configuration object
 * @param options.calendarYearType - Calendar year type (CommonEra or RepublicEra)
 * @param options.selectedDate - Selected date
 * @param options.formatYear - Year to format
 * @param options.datePickerType - Type of date picker (date, month, or year)
 * @returns Formatted date picker label string
 */
export const setDatePickerLabel = ({
  calendarYearType,
  selectedDate,
  formatYear,
  datePickerType
}: {
  calendarYearType: YearType,
  selectedDate: Date,
  formatYear: number,
  datePickerType: CalendarType
}) => {
  const format = FORMAT_LOOKUP[datePickerType];
  const republicEraYearFormat = REPUBLIC_ERA_YEAR_FORMAT_LOOKUP[datePickerType];

  let formattedLabel: string;

  if (calendarYearType === YearType.RepublicEra) {
    const republicEraYear = getRepublicEraYear(formatYear);
    const republicEraPart = datePickerType !== CalendarType.YEAR
      ? `/${formatDate(selectedDate, republicEraYearFormat)}`
      : '';

    formattedLabel = `${republicEraYear}${republicEraPart}`;
  } else {
    formattedLabel = formatDate(selectedDate, format);
  }

  return formattedLabel;
};
