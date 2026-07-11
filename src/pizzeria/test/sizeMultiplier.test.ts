/**
 * Pure unit tests for SIZE_MULTIPLIERS pricing math.
 *
 * No React rendering — just import the constants and verify the math.
 */

import { describe, it, expect } from 'vitest';
import { SIZE_MULTIPLIERS } from '../types';

describe('SIZE_MULTIPLIERS – pricing math', () => {
  // ── Multiplier values ──────────────────────────────────────────────────────

  it('Small multiplier is 0.8', () => {
    expect(SIZE_MULTIPLIERS['Small']).toBe(0.8);
  });

  it('Medium multiplier is 1.0', () => {
    expect(SIZE_MULTIPLIERS['Medium']).toBe(1.0);
  });

  it('Large multiplier is 1.3', () => {
    expect(SIZE_MULTIPLIERS['Large']).toBe(1.3);
  });

  // ── effectivePrice for base 299 ────────────────────────────────────────────

  it('Small effectivePrice for base 299 rounds to 239', () => {
    // Math.round(299 × 0.8) = Math.round(239.2) = 239
    const effectivePrice = Math.round(299 * SIZE_MULTIPLIERS['Small']);
    expect(effectivePrice).toBe(239);
  });

  it('Medium effectivePrice for base 299 equals 299', () => {
    // Math.round(299 × 1.0) = 299
    const effectivePrice = Math.round(299 * SIZE_MULTIPLIERS['Medium']);
    expect(effectivePrice).toBe(299);
  });

  it('Large effectivePrice for base 299 rounds to 389', () => {
    // Math.round(299 × 1.3) = Math.round(388.7) = 389
    const effectivePrice = Math.round(299 * SIZE_MULTIPLIERS['Large']);
    expect(effectivePrice).toBe(389);
  });

  // ── effectivePrice for base 449 ────────────────────────────────────────────

  it('Small effectivePrice for base 449 rounds to 359', () => {
    // Math.round(449 × 0.8) = Math.round(359.2) = 359
    const effectivePrice = Math.round(449 * SIZE_MULTIPLIERS['Small']);
    expect(effectivePrice).toBe(359);
  });

  it('Large effectivePrice for base 449 rounds to 584', () => {
    // Math.round(449 × 1.3) = Math.round(583.7) = 584
    const effectivePrice = Math.round(449 * SIZE_MULTIPLIERS['Large']);
    expect(effectivePrice).toBe(584);
  });

  // ── Key existence ──────────────────────────────────────────────────────────

  it('All three size keys exist on SIZE_MULTIPLIERS', () => {
    const keys = Object.keys(SIZE_MULTIPLIERS);
    expect(keys).toContain('Small');
    expect(keys).toContain('Medium');
    expect(keys).toContain('Large');
    expect(keys).toHaveLength(3);
  });
});
