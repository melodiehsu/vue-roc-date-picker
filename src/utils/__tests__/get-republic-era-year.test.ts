import { describe, it, expect } from 'vitest';
import { getRepublicEraYear } from '../index';

describe('Test getRepublicEraYear', () => {
  it('converts 2023 to 112', () => {
    expect(getRepublicEraYear(2023)).toBe(112);
  });

  it('converts 1900 to -11', () => {
    expect(getRepublicEraYear(1900)).toBe(-11);
  });
});
