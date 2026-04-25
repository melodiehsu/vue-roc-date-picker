import dayjs from 'dayjs';
import { CalendarType, Language, YearType } from '@/interfaces';
import locales from '../locales/index';
import type { LocaleDictionary } from '../locales/index';

const FORMAT_LOOKUP: Record<CalendarType, string> = {
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY'
};

const REPUBLIC_ERA_YEAR_FORMAT_LOOKUP: Record<CalendarType, string> = {
  date: 'MM/DD',
  month: 'MM',
  year: ''
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
export const formatDate = (date: dayjs.ConfigType, pattern: string) => {
  if (!date) {
    return '';
  }

  return dayjs(date).format(pattern);
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
