import { ApiClient } from './client';
import { Currency } from '../types';

export class CurrenciesAPI {
  constructor(private client: ApiClient) {}

  async list(): Promise<Currency[]> {
    const response = await this.client.get<{ items: Currency[] }>('/coins');
    return response.items || [];
  }

  async getBySymbol(symbol: string): Promise<Currency[]> {
    const currencies = await this.list();
    return currencies.filter(c => 
      c.symbol.toUpperCase() === symbol.toUpperCase()
    );
  }

  async getByApiId(apiId: string): Promise<Currency | null> {
    const currencies = await this.list();
    return currencies.find(c => c.apiId === apiId) || null;
  }

  async getSupportedNetworks(symbol: string): Promise<string[]> {
    const currencies = await this.getBySymbol(symbol);
    const networks = new Set<string>();
    
    currencies.forEach(c => {
      if (c.network) {
        networks.add(c.network);
      }
    });
    
    return Array.from(networks);
  }
}

