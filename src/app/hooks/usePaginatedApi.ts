import { useEffect, useState } from 'react';

import { normalizeApiError } from '../api/client';
import type { ApiError, PaginatedResponse } from '../types/api.types';

export function usePaginatedApi<T>(
  loader: () => Promise<PaginatedResponse<T>>,
  deps: readonly unknown[] = [],
) {
  const [data, setData] = useState<PaginatedResponse<T> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const refetch = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await loader();
      setData(response);
    } catch (requestError) {
      setError(normalizeApiError(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refetch();
  }, deps);

  return {
    data,
    error,
    loading,
    refetch,
  };
}

