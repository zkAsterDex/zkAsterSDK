import { ApiClient } from './client';
import { QuoteRequest, QuoteResponse, LimitsResponse } from '../types';
import { validateAmount, validateApiId } from '../utils/validation';

export class QuotesAPI {
  constructor(private client: ApiClient) {}

  async get(params: QuoteRequest): Promise<QuoteResponse> {
    if (!validateApiId(params.from)) {
      throw new Error('Invalid from API ID');
    }
    if (!validateApiId(params.to)) {
      throw new Error('Invalid to API ID');
    }
    if (!validateAmount(params.amount)) {
      throw new Error('Amount must be a positive number');
    }

    try {
      const response = await this.client.post<QuoteResponse>('/quote', params);
      return response;
    } catch (error: any) {
      if (error.minAmount !== undefined || error.maxAmount !== null) {
        throw error;
      }
      throw error;
    }
  }

  async getFixed(params: QuoteRequest): Promise<QuoteResponse> {
    return this.get(params);
  }

  async getLimits(from: string, to: string): Promise<LimitsResponse> {
    if (!validateApiId(from)) {
      throw new Error('Invalid from API ID');
    }
    if (!validateApiId(to)) {
      throw new Error('Invalid to API ID');
    }

    const response = await this.client.get<LimitsResponse>('/limits', {
      from,
      to,
    });

    return response;
  }
}

