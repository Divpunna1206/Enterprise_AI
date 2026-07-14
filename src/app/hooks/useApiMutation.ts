import { useState } from 'react';

import { normalizeApiError } from '../api/client';
import type { ApiError } from '../types/api.types';

export function useApiMutation<TData, TVariables>(
  mutation: (variables: TVariables) => Promise<TData>,
) {
  const [data, setData] = useState<TData | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);

  const mutate = async (variables: TVariables) => {
    setLoading(true);
    setError(null);

    try {
      const response = await mutation(variables);
      setData(response);
      return response;
    } catch (mutationError) {
      const normalized = normalizeApiError(mutationError);
      setError(normalized);
      throw normalized;
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    mutate,
  };
}

