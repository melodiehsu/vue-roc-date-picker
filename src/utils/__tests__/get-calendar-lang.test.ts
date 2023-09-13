import { describe, it, expect } from 'vitest';
import { TRANSLATE } from '@/locales';
import { getCalendarLang } from '../index';

describe('Test getCalendarLang', () => {
  it('Pass \'zhTW\' returns zhTW locale', () => {
    expect(getCalendarLang('zhTW')).toEqual(TRANSLATE.zhTW);
  });

  it('Pass \'en\' returns en locale', () => {
    expect(getCalendarLang('en')).toEqual(TRANSLATE.en);
  });

  it('Pass unsupported language returns en locale', () => {
    expect(getCalendarLang('zhCN')).toEqual(TRANSLATE.en);
  });
});
