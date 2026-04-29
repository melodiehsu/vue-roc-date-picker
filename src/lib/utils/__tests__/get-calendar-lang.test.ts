import { describe, it, expect } from 'vitest';
import { TRANSLATE } from '@/lib/locales';
import { Language } from '@/lib/interfaces';
import { getCalendarLang } from '../index';

describe('Test getCalendarLang', () => {
  it('returns zhTW locale for zhTW', () => {
    expect(getCalendarLang(Language.ZH_TW)).toEqual(TRANSLATE.zhTW);
  });

  it('returns en locale for en', () => {
    expect(getCalendarLang(Language.EN)).toEqual(TRANSLATE.en);
  });

  it('falls back to en locale for unsupported language', () => {
    // @ts-ignore
    expect(getCalendarLang('zhCN')).toEqual(TRANSLATE.en);
  });
});
