import { Transaction, User } from '../types';

export const mockUser: User = {
  id: '1',
  name: 'Isam Bais',
  phone: '+90 555 123 4567',
  language: 'tr',
  currency: 'TRY',
  balance: 24750.50,
};

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    title: 'Migros Market',
    merchant: 'Migros',
    amount: -342.90,
    currency: 'TRY',
    category: 'food',
    date: '2026-09-01T10:32:00Z',
    location: 'İstanbul',
  },
  {
    id: '2',
    title: 'Netflix Abonelik',
    merchant: 'Netflix',
    amount: -99.99,
    currency: 'TRY',
    category: 'subscriptions',
    date: '2026-09-01T08:00:00Z',
  },
  {
    id: '3',
    title: 'Maaş',
    merchant: 'İşveren A.Ş.',
    amount: 18000,
    currency: 'TRY',
    category: 'bills',
    date: '2026-08-31T09:00:00Z',
  },
  {
    id: '4',
    title: 'Uber',
    merchant: 'Uber',
    amount: -87.50,
    currency: 'TRY',
    category: 'transport',
    date: '2026-08-30T19:15:00Z',
    location: 'İstanbul',
  },
  {
    id: '5',
    title: 'Trendyol',
    merchant: 'Trendyol',
    amount: -599.00,
    currency: 'TRY',
    category: 'shopping',
    date: '2026-08-29T14:20:00Z',
  },
];