import { useCallback, useEffect, useState } from 'react';

// Wraps an async fetcher function with loading/error/data state and a
// refetch() helper, so every page follows the same loading/empty/error
// pattern without repeating boilerplate.
export default function useApiData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Failed to load data from the server.';
      setError(message);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
