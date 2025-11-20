/**
 * Validate address format based on network
 */
export function validateAddress(address: string, pattern?: string): boolean {
  if (!address || !address.trim()) {
    return false;
  }
  
  if (!pattern) {
    // If no pattern provided, do basic validation
    return address.trim().length > 0;
  }
  
  try {
    const regex = new RegExp(pattern);
    return regex.test(address.trim());
  } catch {
    // Invalid regex pattern, fallback to basic validation
    return address.trim().length > 0;
  }
}

/**
 * Validate amount is positive number
 */
export function validateAmount(amount: number): boolean {
  return typeof amount === 'number' && amount > 0 && isFinite(amount);
}

/**
 * Validate API ID format
 */
export function validateApiId(apiId: string): boolean {
  if (!apiId || typeof apiId !== 'string') {
    return false;
  }
  
  // API ID can be simple (e.g., "eth", "btc") or compound (e.g., "usdc_base", "bnb_bsc")
  const parts = apiId.split('_');
  if (parts.length > 2) {
    return false;
  }
  
  // Check each part is alphanumeric (and hyphens for some cases)
  return parts.every(part => /^[a-z0-9-]+$/i.test(part));
}

