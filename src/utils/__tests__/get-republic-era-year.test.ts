import { describe, it, expect } from 'vitest';
import { getRepublicEraYear } from '../index';

describe('getRepublicEraYear', () => {
  it('should return Republic Era Year', () => {
    const year = 2023;
    const result = getRepublicEraYear(year);

    expect(result).toBe(112);
  });

  it('should return negative number', () => {
    const year = 1900;
    const result = getRepublicEraYear(year);

    expect(result).toBe(-11);
  });
});
