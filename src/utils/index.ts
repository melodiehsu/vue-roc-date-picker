import dayjs from 'dayjs';
import locales from '../locales/index';
import { YEAR_TYPE, CALENDAR_TYPE } from '../constants/index';

export const getCalendarLang = (lang: string) => {
  const langLookup: Record<string, any> = {
    zhTW: locales.zhTW,
    en: locales.en
  };
  return langLookup[lang];
};

export const formatDate = (date: any, pattern: string) => dayjs(date).format(pattern);

export const getRepublicEraYear = (year: number) => year - 1911;

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

export const setDatePickerLabel = ({
  calendarYearType,
  selectedDateObject,
  formatYear,
  datePickerType
}: {
  calendarYearType: string,
  selectedDateObject: Date,
  formatYear: number,
  datePickerType: string
}) => {
  const format = FORMAT_LOOKUP[datePickerType];
  const republicEraYearFormat = REPUBLIC_ERA_YEAR_FORMAT_LOOKUP[datePickerType];

  let formattedLabel: string;

  if (calendarYearType === YEAR_TYPE.RepublicEraYear) {
    const republicEraYear = getRepublicEraYear(formatYear);
    const republicEraPart = datePickerType !== CALENDAR_TYPE.year
      ? `/${formatDate(selectedDateObject, republicEraYearFormat)}`
      : '';
    formattedLabel = `${republicEraYear}${republicEraPart}`;
  } else {
    formattedLabel = formatDate(selectedDateObject, format);
  }

  return formattedLabel;
};
