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
  const langLookup: Record<Language, LocaleDictionary> = {
    zhTW: locales.zhTW,
    en: locales.en
  };
  const isSupportedLang = lang in langLookup;

  if (!lang || !isSupportedLang) return langLookup.en;
  return langLookup[lang];
};

export const formatDate = (date: dayjs.ConfigType, pattern: string) => {
  if (!date) {
    return '';
  }

  return dayjs(date).format(pattern);
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
