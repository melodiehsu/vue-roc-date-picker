import { describe, it, expect } from 'vitest';
import { TRANSLATE } from '@/locales';
import { Language } from '@/interfaces';
import { getCalendarLang } from '../index';

describe('Test getCalendarLang', () => {
  it('pass \'zhTW\' returns zhTW locale', () => {
    expect(getCalendarLang(Language.ZH_TW)).toEqual(TRANSLATE.zhTW);
  });

  it('pass \'en\' returns en locale', () => {
    expect(getCalendarLang(Language.EN)).toEqual(TRANSLATE.en);
  });

  it('pass unsupported language returns en locale', () => {
    // @ts-ignore
    expect(getCalendarLang('zhCN')).toEqual(TRANSLATE.en);
  });
});
