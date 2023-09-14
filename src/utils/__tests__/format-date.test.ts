import { describe, it, expect } from 'vitest';
import { formatDate } from '../index';

describe('Test formatDate', () => {
  it('pass (new Date(\'2023-09-15\'), YYYY/MM/DD) returns 2023/09/15', () => {
    expect(formatDate(new Date('2023-09-15'), 'YYYY/MM/DD')).toBe('2023/09/15');
  });

  it('pass (null, \'YYYY-MM-DD\') returns \'\'', () => {
    expect(formatDate(null, 'YYYY-MM-DD')).toBe('');
  });
});
