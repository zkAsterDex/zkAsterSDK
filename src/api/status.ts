import { ApiClient } from './client';
import { OrderStatus, PollOptions } from '../types';

export class StatusAPI {
  constructor(private client: ApiClient) {}

  async getById(orderId: string): Promise<OrderStatus> {
    if (!orderId || !orderId.trim()) {
      throw new Error('Order ID is required');
    }

    const response = await this.client.get<OrderStatus>('/status', {
      id: orderId.trim(),
    });

    return response;
  }

  async getByRef(refCode: string): Promise<OrderStatus> {
    if (!refCode || !refCode.trim()) {
      throw new Error('Reference code is required');
    }

    const response = await this.client.get<OrderStatus>('/status/by-ref', {
      ref: refCode.trim(),
    });

    return response;
  }

  async poll(
    identifier: string,
    options: PollOptions = {}
  ): Promise<OrderStatus> {
    const {
      interval = 5000,
      maxPolls = 60,
      onUpdate,
      onError,
    } = options;

    let pollCount = 0;
    const isRefCode = identifier.startsWith('ZKASTER-');

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          pollCount++;

          const status = isRefCode
            ? await this.getByRef(identifier)
            : await this.getById(identifier);

          if (onUpdate) {
            onUpdate(status);
          }

          const statusLower = status.status.toLowerCase();
          const isComplete =
            statusLower.includes('finish') ||
            statusLower.includes('fail') ||
            statusLower.includes('expire') ||
            statusLower.includes('refund');

          if (isComplete) {
            if (options.onComplete) {
              options.onComplete(status);
            }
            resolve(status);
            return;
          }

          if (pollCount >= maxPolls) {
            const error = new Error(
              `Polling timeout: Order did not complete after ${maxPolls} polls`
            );
            if (onError) {
              onError(error);
            }
            reject(error);
            return;
          }

          setTimeout(poll, interval);
        } catch (error: any) {
          if (onError) {
            onError(error);
          }
          reject(error);
        }
      };

      poll();
    });
  }
}

