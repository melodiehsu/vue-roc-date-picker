import { describe, it, expect } from 'vitest';
import dayjs from 'dayjs';
import { formatDate } from '../index';

describe('formatDate', () => {
  it('should format the date correctly with the given pattern', () => {
    const date = new Date('2023-09-15');
    const pattern = 'YYYY-MM-DD';

    const formattedDate = formatDate(date, pattern);
    const expectedFormattedDate = dayjs(date).format(pattern);

    expect(formattedDate).toBe(expectedFormattedDate);
  });

  it('should handle null date gracefully', () => {
    const date = null;
    const pattern = 'YYYY-MM-DD';

    const formattedDate = formatDate(date, pattern);

    expect(formattedDate).toBe('');
  });
});
