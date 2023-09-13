import { describe, it, expect } from 'vitest';
import { getCalendarLang } from '../index';

describe('getCalendarLang', () => {
  it('should return zhTW locale for "zhTW" language', () => {
    const lang = 'zhTW';
    const result = getCalendarLang(lang);

    expect(result).toEqual({
      month: {
        0: '一月',
        1: '二月',
        2: '三月',
        3: '四月',
        4: '五月',
        5: '六月',
        6: '七月',
        7: '八月',
        8: '九月',
        9: '十月',
        10: '十一月',
        11: '十二月'
      },
      week: {
        Mon: '一',
        Tue: '二',
        Wed: '三',
        Thu: '四',
        Fri: '五',
        Sat: '六',
        Sun: '日'
      },
      yearType: {
        RepublicEraYear: '民國',
        CE: '西元'
      }

    });
  });

  it('should return en locale for "en" language', () => {
    const lang = 'en';
    const result = getCalendarLang(lang);

    expect(result).toEqual({
      month: {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'Jun',
        6: 'Jul',
        7: 'Aug',
        8: 'Sep',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec'
      },
      week: {
        Mon: 'Mon',
        Tue: 'Tue',
        Wed: 'Wed',
        Thu: 'Thu',
        Fri: 'Fri',
        Sat: 'Sat',
        Sun: 'Sun'
      },
      yearType: {
        RepublicEraYear: 'ROC',
        CE: 'CE'
      }
    });
  });

  it('should return undefined for unsupported language', () => {
    const lang = 'unsupportedLang';
    const result = getCalendarLang(lang);

    expect(result).toBeUndefined();
  });
});
