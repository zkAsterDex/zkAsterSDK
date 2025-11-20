/**
 * Supported currency symbols
 */
export type SupportedSymbol = 
  | "BTC" 
  | "ETH" 
  | "BNB" 
  | "USDT" 
  | "USDC" 
  | "TRX" 
  | "SOL" 
  | "DAI" 
  | "USDE" 
  | "ASTER";

/**
 * Supported network codes
 */
export type NetworkCode = "eth" | "bsc" | "base" | "trx" | "sol" | "btc" | "opbnb";

/**
 * Currency information
 */
export interface Currency {
  apiId: string;
  symbol: string;
  name?: string;
  network?: string;
  hasExternalId?: boolean;
  image?: string;
  validationAddressPattern?: string;
}

/**
 * Quote request parameters
 */
export interface QuoteRequest {
  from: string; // API ID (e.g., "usdc_base", "eth")
  to: string;   // API ID
  amount: number;
}

/**
 * Quote response
 */
export interface QuoteResponse {
  amountFrom: number;
  amountTo: number;
  minAmount?: number;
  maxAmount?: number | null;
  rateType: "fixed" | "floating";
}

/**
 * Limits response
 */
export interface LimitsResponse {
  minAmount?: number;
  maxAmount?: number | null;
}

/**
 * Create order parameters
 */
export interface CreateOrderParams {
  from: string;        // API ID
  to: string;          // API ID
  amount: number;
  address: string;     // Destination address
  refundAddress?: string;
  extraId?: string;    // Memo/tag if required
  rateType?: "fixed" | "floating"; // Optional: specify rate type
}

/**
 * Create order response
 */
export interface CreateOrderResponse {
  orderId: string;
  refCode?: string;    // Human-readable reference code (ZKASTER-xxxxx)
  payinAddress?: string;
  payinExtraId?: string | null;
  expiresAt?: string | null;
}

/**
 * Order status response
 */
export interface OrderStatus {
  orderId: string;
  refCode?: string;
  status: string;
  payinAddress?: string;
  payinExtraId?: string | null;
  payoutAddress?: string | null;
  amountFrom?: number | null;
  amountTo?: number | null;
  txFrom?: string | null;
  txTo?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  currencyFrom?: string | null;
  currencyTo?: string | null;
  networkFrom?: string | null;
  networkTo?: string | null;
}

/**
 * SDK configuration options
 */
export interface ZkAsterConfig {
  /**
   * Base URL for API requests
   * - If not provided, defaults to "https://zkaster.com/api"
   * - If provided, should be full URL (e.g., "https://zkaster.com/api")
   * - In browser, can auto-detect from window.location
   */
  baseUrl?: string;
  
  /**
   * Request timeout in milliseconds (default: 30000)
   */
  timeout?: number;
  
  /**
   * Custom fetch implementation (useful for Node.js)
   */
  fetch?: typeof fetch;
}

/**
 * Polling options for order status
 */
export interface PollOptions {
  /**
   * Polling interval in milliseconds (default: 5000)
   */
  interval?: number;
  
  /**
   * Maximum number of polls (default: 60)
   */
  maxPolls?: number;
  
  /**
   * Callback when status updates
   */
  onUpdate?: (status: OrderStatus) => void;
  
  /**
   * Callback when order completes (finished, failed, expired)
   */
  onComplete?: (status: OrderStatus) => void;
  
  /**
   * Callback on error
   */
  onError?: (error: Error) => void;
}

/**
 * API error response
 */
export interface ApiError {
  error: string;
  code?: number;
  description?: string;
  minAmount?: number;
  maxAmount?: number | null;
}

