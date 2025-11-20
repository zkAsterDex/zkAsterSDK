export function getBaseUrl(configBaseUrl?: string): string {
  if (configBaseUrl) {
    return configBaseUrl.replace(/\/$/, '');
  }
  
  if (typeof window !== 'undefined' && window.location) {
    return window.location.origin;
  }
  
  return 'https://zkaster.com/api';
}

export function buildApiUrl(baseUrl: string, endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (baseUrl.endsWith('/api')) {
    return `${baseUrl}${cleanEndpoint}`;
  }
  
  if (!baseUrl) {
    return `/api${cleanEndpoint}`;
  }
  
  return `${baseUrl}${baseUrl.endsWith('/api') ? '' : '/api'}${cleanEndpoint}`;
}

