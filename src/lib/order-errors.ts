export const isOrdersRlsError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as { message?: string; details?: string };
  const text = `${err.message || ''} ${err.details || ''}`.toLowerCase();

  return (
    text.includes('row-level security') &&
    (text.includes('orders') || text.includes('table "orders"') || text.includes("table 'orders'"))
  );
};

export const getFriendlyOrderError = (error: unknown): string => {
  if (isOrdersRlsError(error)) {
    return 'Your database currently requires login to place orders. Please sign in and try again.';
  }

  if (error && typeof error === 'object') {
    const err = error as { message?: string; details?: string; code?: string };
    return err.message || err.details || err.code || 'Unknown error';
  }

  return String(error);
};
