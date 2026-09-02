export type Currency = 'TRY' | 'USD' | 'EUR';
export type ISODateString = string;

export type User = {
  id: string;
  name: string;
  phone: string;
  language: 'tr' | 'en' | 'ar';
  currency: Currency;
  balance: number;
};

export type Transaction = {
  id: string;
  title: string;
  merchant: string;
  amount: number;
  currency: Currency;
  category: 'food' | 'transport' | 'entertainment' | 'shopping' | 'bills' | 'subscriptions';
  date: ISODateString;
  location?: string;
};