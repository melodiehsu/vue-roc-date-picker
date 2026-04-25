import dayjs from 'dayjs';
import { CalendarType, Language, YearType } from '@/interfaces';
import locales from '../locales/index';

type DateBoundaryUnit = 'day' | 'month' | 'year';

const FORMAT_LOOKUP: Record<string, string> = {
  date: 'YYYY-MM-DD',
  month: 'YYYY-MM',
  year: 'YYYY'
};

const REPUBLIC_ERA_YEAR_FORMAT_LOOKUP: Record<string, string> = {
  date: 'MM/DD',
  month: 'MM',
  year: ''
};

export const getCalendarLang = (lang: Language) => {
  const langLookup: Record<string, any> = {
    zhTW: locales.zhTW,
    en: locales.en
  };
  const unsupportedLang = lang in langLookup;

  if (!lang || !unsupportedLang) return langLookup.en;
  return langLookup[lang];
};

export const formatDate = (date: any, pattern: string) => {
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

export const isDateOutOfRange = ({
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

export const getRepublicEraYear = (year: number) => year - 1911;

export const setDatePickerLabel = ({
  calendarYearType,
  selectedDate,
  formatYear,
  datePickerType
}: {
  calendarYearType: YearType,
  selectedDate: Date,
  formatYear: number,
  datePickerType: string
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
