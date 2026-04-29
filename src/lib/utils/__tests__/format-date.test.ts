import { describe, it, expect } from 'vitest';
import { formatDate } from '../index';

describe('Test formatDate', () => {
  it('formats a date with the given pattern', () => {
    expect(formatDate(new Date('2023-09-15'), 'YYYY/MM/DD')).toBe('2023/09/15');
  });

  it('returns an empty string for null input', () => {
    expect(formatDate(null, 'YYYY-MM-DD')).toBe('');
  });
});
