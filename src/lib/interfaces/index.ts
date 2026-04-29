export interface SelectedTime {
  label?: string;
  timeValue?: Date | undefined;
}

export enum Language {
  EN = 'en',
  ZH_TW = 'zhTW'
}

export enum YearType {
  CommonEra = 'CommonEra',
  RepublicEra = 'RepublicEra'
}

export enum CalendarType {
  YEAR = 'year',
  MONTH = 'month',
  DATE = 'date'
}
