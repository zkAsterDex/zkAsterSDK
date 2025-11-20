import { ApiClient } from './api/client';
import { CurrenciesAPI } from './api/currencies';
import { QuotesAPI } from './api/quotes';
import { OrdersAPI } from './api/orders';
import { StatusAPI } from './api/status';
import { ZkAsterConfig } from './types';

export * from './types';
export { formatAmount, formatBytes } from './utils/formatting';
export { validateAddress, validateAmount, validateApiId } from './utils/validation';
export { ZkAsterError, isZkAsterError } from './utils/errors';

export class ZkAsterExchange {
  public readonly currencies: CurrenciesAPI;
  public readonly quotes: QuotesAPI;
  public readonly orders: OrdersAPI;
  public readonly status: StatusAPI;

  private client: ApiClient;

  constructor(config: ZkAsterConfig = {}) {
    this.client = new ApiClient(config);
    this.currencies = new CurrenciesAPI(this.client);
    this.quotes = new QuotesAPI(this.client);
    this.orders = new OrdersAPI(this.client);
    this.status = new StatusAPI(this.client);
  }

  updateConfig(config: Partial<ZkAsterConfig>): void {
    const newConfig = { ...config };
    this.client = new ApiClient(newConfig);
    this.currencies = new CurrenciesAPI(this.client);
    this.quotes = new QuotesAPI(this.client);
    this.orders = new OrdersAPI(this.client);
    this.status = new StatusAPI(this.client);
  }
}

export default ZkAsterExchange;

