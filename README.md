# zkAster Exchange SDK

TypeScript SDK for zkAster Exchange API - cross-chain cryptocurrency exchange.

## Installation

```bash
npm install zkastersdk
```

## Quick Start

```typescript
import { ZkAsterExchange } from 'zkastersdk';

const exchange = new ZkAsterExchange();

// Get currencies
const currencies = await exchange.currencies.list();

// Get quote
const quote = await exchange.quotes.get({
  from: 'usdc_base',
  to: 'eth',
  amount: 100
});

// Create order
const order = await exchange.orders.create({
  from: 'usdc_base',
  to: 'eth',
  amount: 100,
  address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
});

// Track order
const status = await exchange.status.getByRef(order.refCode);
```

## Configuration

Default base URL is `https://zkaster.com/api/`. You can override it:

```typescript
// Custom base URL
const exchange = new ZkAsterExchange({
  baseUrl: 'https://zkaster.com/api'
});

// Node.js with node-fetch
import fetch from 'node-fetch';
const exchange = new ZkAsterExchange({
  baseUrl: 'https://zkaster.com/api',
  fetch: fetch as any
});
```

## API

### Currencies

```typescript
// List all currencies
const currencies = await exchange.currencies.list();

// Get by symbol
const usdc = await exchange.currencies.getBySymbol('USDC');

// Get by API ID
const currency = await exchange.currencies.getByApiId('usdc_base');

// Get supported networks
const networks = await exchange.currencies.getSupportedNetworks('USDC');
```

### Quotes

```typescript
// Get quote
const quote = await exchange.quotes.get({
  from: 'usdc_base',
  to: 'eth',
  amount: 100
});

// Get limits
const limits = await exchange.quotes.getLimits('usdc_base', 'eth');
```

### Orders

```typescript
// Create order
const order = await exchange.orders.create({
  from: 'usdc_base',
  to: 'eth',
  amount: 100,
  address: '0x...',
  refundAddress: '0x...', // optional
  extraId: 'memo123',      // optional
  rateType: 'fixed'        // optional: 'fixed' | 'floating'
});

// Create fixed rate order
const order = await exchange.orders.createFixed({ ... });

// Create floating rate order
const order = await exchange.orders.createFloating({ ... });
```

### Status

```typescript
// Get by order ID
const status = await exchange.status.getById('order-123');

// Get by ref code
const status = await exchange.status.getByRef('ZKASTER-12345');

// Poll until complete
await exchange.status.poll('ZKASTER-12345', {
  interval: 5000,
  onUpdate: (status) => console.log(status.status),
  onComplete: (status) => console.log('Done!', status)
});
```

## Utilities

```typescript
import { formatAmount, validateAddress } from 'zkastersdk';

// Format amount
formatAmount(123.456789, 'USDC'); // "123.46"

// Validate address
validateAddress('0x742d...', '^0x[a-fA-F0-9]{40}$');
```

## Error Handling

```typescript
import { ZkAsterError } from 'zkastersdk';

try {
  const quote = await exchange.quotes.get({ ... });
} catch (error) {
  if (error instanceof ZkAsterError) {
    console.error(error.message);
    console.error(error.code);
    console.error(error.minAmount); // if amount out of range
  }
}
```

## Supported Currencies & Networks

- **Currencies**: BTC, ETH, BNB, USDT, USDC, TRX, SOL, DAI, USDE, ASTER
- **Networks**: Ethereum (ERC20), BSC, Base, TRON (TRC20), Solana, Bitcoin

## TypeScript

Full TypeScript support with type definitions included.

```typescript
import type {
  Currency,
  QuoteRequest,
  QuoteResponse,
  CreateOrderParams,
  OrderStatus
} from 'zkastersdk';
```

## License

MIT
