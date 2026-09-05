// ─── PARA BİRİMLERİ ──────────────────────────────────────────────
export type Currency = 'TRY' | 'USD' | 'EUR';

export const CURRENCY_SYMBOL: Record<Currency, string> = {
  TRY: '₺',
  USD: '$',
  EUR: '€',
};

const CURRENCY_LOCALE: Record<Currency, string> = {
  TRY: 'tr-TR',
  USD: 'en-US',
  EUR: 'de-DE',
};

// Mock kur (TRY baz)
export const EXCHANGE_RATE: Record<Currency, number> = {
  TRY: 1,
  USD: 1 / 32.45,
  EUR: 1 / 35.10,
};

/**
 * Mutlak değeri locale-aware biçimde formatlar.
 */
export function formatCurrency(amount: number, currency: Currency = 'TRY'): string {
  const abs       = Math.abs(amount) * EXCHANGE_RATE[currency];
  const locale    = CURRENCY_LOCALE[currency];
  const symbol    = CURRENCY_SYMBOL[currency];
  const formatted = abs.toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${symbol} ${formatted}`;
}

/**
 * İşaretli tutar — '+' veya '-' ekler.
 */
export function formatAmount(amount: number, currency: Currency = 'TRY'): string {
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}${formatCurrency(amount, currency)}`;
}

/**
 * Kısa format — ondalık olmadan.
 */
export function formatCurrencyShort(amount: number, currency: Currency = 'TRY'): string {
  const abs       = Math.abs(amount) * EXCHANGE_RATE[currency];
  const locale    = CURRENCY_LOCALE[currency];
  const symbol    = CURRENCY_SYMBOL[currency];
  const formatted = abs.toLocaleString(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `${symbol} ${formatted}`;
}
