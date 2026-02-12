import { describe, it, expect } from 'vitest';
import { isValidSessionName, isValidWindowName, isValidPercentage, isValidResizeAmount } from '../../src/utils/validate.js';

describe('isValidSessionName', () => {
  it('rejects empty name', () => {
    expect(isValidSessionName('')).toBe('Name cannot be empty');
    expect(isValidSessionName('  ')).toBe('Name cannot be empty');
  });

  it('rejects dots', () => {
    expect(isValidSessionName('my.session')).toBe('Name cannot contain "."');
  });

  it('rejects colons', () => {
    expect(isValidSessionName('my:session')).toBe('Name cannot contain ":"');
  });

  it('rejects long names', () => {
    expect(isValidSessionName('a'.repeat(65))).toBe('Name must be 64 characters or less');
  });

  it('accepts valid names', () => {
    expect(isValidSessionName('dev')).toBeNull();
    expect(isValidSessionName('my-session')).toBeNull();
    expect(isValidSessionName('work_2024')).toBeNull();
  });
});

describe('isValidWindowName', () => {
  it('rejects empty name', () => {
    expect(isValidWindowName('')).toBe('Name cannot be empty');
  });

  it('accepts valid names', () => {
    expect(isValidWindowName('editor')).toBeNull();
  });
});

describe('isValidPercentage', () => {
  it('rejects out of range', () => {
    expect(isValidPercentage(0)).not.toBeNull();
    expect(isValidPercentage(100)).not.toBeNull();
  });

  it('accepts valid percentages', () => {
    expect(isValidPercentage(50)).toBeNull();
    expect(isValidPercentage(1)).toBeNull();
    expect(isValidPercentage(99)).toBeNull();
  });
});

describe('isValidResizeAmount', () => {
  it('rejects out of range', () => {
    expect(isValidResizeAmount(0)).not.toBeNull();
    expect(isValidResizeAmount(101)).not.toBeNull();
  });

  it('accepts valid amounts', () => {
    expect(isValidResizeAmount(5)).toBeNull();
    expect(isValidResizeAmount(1)).toBeNull();
    expect(isValidResizeAmount(100)).toBeNull();
  });
});
