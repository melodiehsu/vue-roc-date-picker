import dayjs, { type ConfigType } from 'dayjs';
import { CalendarType, Language, YearType } from '@/interfaces';
import locales from '../locales/index';

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

export const getCalendarLang = (lang: Language) => {
  const langLookup = {
    [Language.ZH_TW]: locales.zhTW,
    [Language.EN]: locales.en
  };

  if (!lang || !(lang in langLookup)) return langLookup[Language.EN];
  return langLookup[lang];
};

export const formatDate = (date: ConfigType, pattern: string) => {
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
