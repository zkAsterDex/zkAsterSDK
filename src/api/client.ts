import { getBaseUrl, buildApiUrl } from '../utils/url';
import { parseError } from '../utils/errors';
import { ZkAsterConfig } from '../types';

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private fetchImpl: typeof fetch;

  constructor(config: ZkAsterConfig = {}) {
    this.baseUrl = getBaseUrl(config.baseUrl);
    this.timeout = config.timeout || 30000;
    
    // Use custom fetch or default
    if (config.fetch) {
      this.fetchImpl = config.fetch;
    } else if (typeof fetch !== 'undefined') {
      this.fetchImpl = fetch;
    } else {
      throw new Error(
        'fetch is not available. Please provide a fetch implementation in config.fetch ' +
        '(e.g., node-fetch for Node.js)'
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let url = buildApiUrl(this.baseUrl, endpoint);
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const url = buildApiUrl(this.baseUrl, endpoint);
    
    return this.request<T>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    let controller: AbortController | null = null;
    let timeoutId: NodeJS.Timeout | null = null;
    
    try {
      if (typeof AbortController !== 'undefined') {
        controller = new AbortController();
        timeoutId = setTimeout(() => {
          if (controller) {
            controller.abort();
          }
        }, this.timeout);
      }

      const requestOptions: RequestInit = {
        ...options,
        cache: 'no-store',
      };

      if (controller) {
        requestOptions.signal = controller.signal;
      }

      const response = await this.fetchImpl(url, requestOptions);

      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const data = await response.json().catch(async () => {
        const text = await response.text();
        return { error: text };
      });

      if (!response.ok) {
        throw parseError(data, response.status);
      }

      return data as T;
    } catch (error: any) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      if (error?.name === 'AbortError' || error?.name === 'TimeoutError') {
        throw new Error(`Request timeout after ${this.timeout}ms`);
      }
      
      if (error instanceof Error && error.name === 'ZkAsterError') {
        throw error;
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error(`Request failed: ${error?.message || String(error)}`);
    }
  }
}

