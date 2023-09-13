import { describe, it, expect } from 'vitest';
import { getRepublicEraYear } from '../index';

describe('Test getRepublicEraYear', () => {
  it('Pass 2023 returns 112', () => {
    expect(getRepublicEraYear(2023)).toBe(112);
  });

  it('Pass 1900 returns -11', () => {
    expect(getRepublicEraYear(1900)).toBe(-11);
  });
});
