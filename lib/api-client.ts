// lib/api-client.ts
// Browser-only resilient API client with retries and timeouts

export interface ApiClientConfig {
  retries?: number;
  backoffMs?: number;
  timeoutMs?: number;
}

export class ApiError extends Error {
  status: number;
  body?: string;

  constructor(status: number, message: string, body?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

const defaultConfig: Required<ApiClientConfig> = {
  retries: 3,
  backoffMs: 800,
  timeoutMs: 30000,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string, timeoutMs: number, options: RequestInit = {}) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export class ApiClient {
  private readonly config: Required<ApiClientConfig>;

  constructor(config: ApiClientConfig = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  async getJson<T>(url: string, init: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...init, method: init.method ?? 'GET' });
  }

  async postJson<T>(url: string, body: unknown, init: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...init,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers || {}),
      },
      body: JSON.stringify(body),
    });
  }

  async request<T>(url: string, init: RequestInit): Promise<T> {
    const { retries, backoffMs, timeoutMs } = this.config;

    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetchWithTimeout(url, timeoutMs, init);

        if (!res.ok) {
          const body = await res.text().catch(() => undefined);
          // Retry on 5xx, timeout, or network errors
          if (res.status >= 500 && res.status < 600 && attempt < retries) {
            await sleep(backoffMs * Math.pow(2, attempt));
            continue;
          }
          throw new ApiError(res.status, `HTTP ${res.status} while calling ${url}`, body);
        }

        // Try JSON, fall back to text if no JSON
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          return (await res.json()) as T;
        }
        return (await res.text()) as unknown as T;
      } catch (error: any) {
        lastError = error;
        const isAbort = error?.name === 'AbortError';
        const isNetwork = error?.name === 'TypeError';

        if ((isAbort || isNetwork) && attempt < retries) {
          await sleep(backoffMs * Math.pow(2, attempt));
          continue;
        }
        break;
      }
    }

    if (lastError instanceof Error) {
      throw lastError;
    }
    throw new Error(`Request to ${url} failed`);
  }
}

export const apiClient = new ApiClient();
