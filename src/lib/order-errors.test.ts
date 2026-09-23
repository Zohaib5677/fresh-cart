import { describe, expect, it } from 'vitest';
import { getFriendlyOrderError, isOrdersRlsError } from './order-errors';

describe('order-errors', () => {
  it('detects orders RLS policy error', () => {
    const error = {
      message: 'new row violates row-level security policy for table "orders"',
    };

    expect(isOrdersRlsError(error)).toBe(true);
  });

  it('returns login guidance for orders RLS policy error', () => {
    const error = {
      message: 'new row violates row-level security policy for table "orders"',
    };

    expect(getFriendlyOrderError(error)).toContain('requires login');
  });

  it('returns generic message for non-RLS errors', () => {
    const error = {
      message: 'duplicate key value violates unique constraint',
    };

    expect(getFriendlyOrderError(error)).toBe(error.message);
  });
});
