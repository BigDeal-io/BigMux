import { describe, it, expect } from 'vitest';
import { truncate, timeAgo, padRight } from '../../src/utils/format.js';

describe('truncate', () => {
  it('returns short strings unchanged', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates long strings', () => {
    expect(truncate('hello world', 8)).toBe('hello w\u2026');
  });

  it('handles exact length', () => {
    expect(truncate('hello', 5)).toBe('hello');
  });
});

describe('timeAgo', () => {
  it('returns just now for recent', () => {
    expect(timeAgo(Date.now() - 5000)).toBe('just now');
  });

  it('returns minutes', () => {
    expect(timeAgo(Date.now() - 120000)).toBe('2m ago');
  });

  it('returns hours', () => {
    expect(timeAgo(Date.now() - 7200000)).toBe('2h ago');
  });

  it('returns days', () => {
    expect(timeAgo(Date.now() - 172800000)).toBe('2d ago');
  });
});

describe('padRight', () => {
  it('pads short strings', () => {
    expect(padRight('hi', 5)).toBe('hi   ');
  });

  it('returns long strings unchanged', () => {
    expect(padRight('hello world', 5)).toBe('hello world');
  });
});
