import { ApiClient } from './client';
import { CreateOrderParams, CreateOrderResponse } from '../types';
import { validateAmount, validateApiId } from '../utils/validation';

export class OrdersAPI {
  constructor(private client: ApiClient) {}

  async create(params: CreateOrderParams): Promise<CreateOrderResponse> {
    if (!validateApiId(params.from)) {
      throw new Error('Invalid from API ID');
    }
    if (!validateApiId(params.to)) {
      throw new Error('Invalid to API ID');
    }
    if (!validateAmount(params.amount)) {
      throw new Error('Amount must be a positive number');
    }
    if (!params.address || !params.address.trim()) {
      throw new Error('Destination address is required');
    }

    const response = await this.client.post<CreateOrderResponse>('/order', {
      from: params.from,
      to: params.to,
      amount: params.amount,
      address: params.address.trim(),
      refundAddress: params.refundAddress?.trim(),
      extraId: params.extraId?.trim(),
      rateType: params.rateType,
    });

    return response;
  }

  async createFixed(params: CreateOrderParams): Promise<CreateOrderResponse> {
    return this.create({ ...params, rateType: 'fixed' });
  }

  async createFloating(params: CreateOrderParams): Promise<CreateOrderResponse> {
    return this.create({ ...params, rateType: 'floating' });
  }
}

