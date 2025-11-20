/**
 * Format amount based on currency type
 * Stablecoins (USDT/USDC/DAI/USDE) use 2 decimals
 * Others: if abs(value) < 1 → 5 decimals, else 2 decimals
 */
export function formatAmount(
  amount: number | null | undefined,
  symbol?: string
): string {
  if (amount == null || Number.isNaN(Number(amount))) {
    return "—";
  }
  
  const isStable = (sym?: string) => {
    if (!sym) return false;
    const s = sym.toUpperCase();
    return s === "USDT" || s === "USDC" || s === "DAI" || s === "USDE";
  };
  
  const sign = amount < 0 ? -1 : 1;
  const abs = Math.abs(Number(amount));
  const decimals = isStable(symbol) ? 2 : abs >= 1 ? 2 : 5;
  const factor = Math.pow(10, decimals);
  const ceiled = Math.ceil((abs + 1e-12) * factor) / factor;
  
  return (ceiled * sign).toFixed(decimals);
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

