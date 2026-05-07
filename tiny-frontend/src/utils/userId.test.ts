import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getOrCreateUserId } from './userId';

describe('userId', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('generates a new userId if none exists', () => {
    const userId = getOrCreateUserId();

    expect(userId).toBeTruthy();
    expect(typeof userId).toBe('string');
    expect(userId.length).toBeGreaterThan(0);
  });

  it('generates a userId with alphanumeric characters', () => {
    const userId = getOrCreateUserId();

    // Check that it only contains alphanumeric characters (no special chars)
    expect(/^[a-z0-9]+$/.test(userId)).toBe(true);
  });

  it('stores generated userId in localStorage', () => {
    const userId = getOrCreateUserId();

    expect(localStorage.getItem('userId')).toBe(userId);
  });

  it('returns existing userId from localStorage', () => {
    const existingId = 'existing-user-123';
    localStorage.setItem('userId', existingId);

    const userId = getOrCreateUserId();

    expect(userId).toBe(existingId);
  });

  it('does not generate new userId if one already exists', () => {
    const existingId = 'existing-user-123';
    localStorage.setItem('userId', existingId);

    const userId1 = getOrCreateUserId();
    const userId2 = getOrCreateUserId();

    expect(userId1).toBe(existingId);
    expect(userId2).toBe(existingId);
    expect(userId1).toBe(userId2);
  });

  it('generates different userIds on separate calls (without localStorage)', () => {
    const userId1 = getOrCreateUserId();
    localStorage.clear();
    const userId2 = getOrCreateUserId();

    // They should be different since we cleared localStorage
    expect(userId1).not.toBe(userId2);
  });

  it('persists userId across multiple calls', () => {
    const firstCall = getOrCreateUserId();
    const secondCall = getOrCreateUserId();
    const thirdCall = getOrCreateUserId();

    expect(firstCall).toBe(secondCall);
    expect(secondCall).toBe(thirdCall);
  });
});
