import { describe, expect, it, vi } from 'vitest';
import { smokeOfflineOnlineTransitions, smokeSupabaseCrud, smokeVaultEncryptDecrypt } from '@/lib/productionSmoke';

describe('production smoke tests', () => {
  it('verifies vault encrypt/decrypt', async () => {
    await expect(smokeVaultEncryptDecrypt()).resolves.toBe(true);
  });

  it('verifies offline/online transitions', () => {
    expect(smokeOfflineOnlineTransitions(window)).toEqual([false, true]);
  });

  it('verifies Supabase CRUD contract end to end', async () => {
    const rowStore = new Map<string, any>();
    const client = {
      from: vi.fn((table: string) => ({
        insert: vi.fn(async (rows: any[]) => {
          rows.forEach((row) => rowStore.set(`${table}:${row.id}`, row));
          return { error: null };
        }),
        select: vi.fn(() => ({
          eq: vi.fn((column: string, value: string) => ({
            single: vi.fn(async () => ({ data: rowStore.get(`${table}:${value}`), error: null })),
          })),
        })),
        update: vi.fn((patch: any) => ({
          eq: vi.fn(async (_column: string, value: string) => {
            const key = `${table}:${value}`;
            rowStore.set(key, { ...rowStore.get(key), ...patch });
            return { error: null };
          }),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(async (_column: string, value: string) => {
            rowStore.delete(`${table}:${value}`);
            return { error: null };
          }),
        })),
      })),
    };

    await expect(smokeSupabaseCrud(client)).resolves.toBe(true);
  });
});