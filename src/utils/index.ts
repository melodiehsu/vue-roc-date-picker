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

export const setDatePickerLabel = ({
  calendarYearType,
  selectedDateObject,
  formatYear,
  datePickerType = 'date'
}: {
  calendarYearType: string,
  selectedDateObject: any,
  formatYear: number,
  datePickerType: string
}) => {
  const formatLookup: Record<string, any> = {
    date: 'YYYY-MM-DD',
    month: 'YYYY-MM',
    year: 'YYYY'
  };

  const republicEraYearFormatLookup: Record<string, any> = {
    date: 'MM/DD',
    month: 'MM',
    year: ''
  };

  const format = formatLookup[datePickerType];
  const republicEraYearFormat = republicEraYearFormatLookup[datePickerType];

  let formattedLabel: string = formatDate(selectedDateObject, format);

  if (calendarYearType === YEAR_TYPE.RepublicEraYear) {
    formattedLabel = `${getRepublicEraYear(formatYear)}`;
    if (datePickerType !== CALENDAR_TYPE.year) {
      formattedLabel += `/${formatDate(selectedDateObject, republicEraYearFormat)}`;
    }
  }

  return formattedLabel;
};
