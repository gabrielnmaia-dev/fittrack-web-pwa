import { useCallback, useEffect, useRef, useState, type DependencyList } from 'react'
import { apiErrorMessage } from '../lib/format'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

/**
 * Small data-fetching helper: cancels stale responses and exposes a reload
 * function for pull-to-refresh style interactions.
 */
export function useAsync<T>(loader: () => Promise<T>, deps: DependencyList) {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  })
  const requestId = useRef(0)
  const loaderRef = useRef(loader)
  loaderRef.current = loader

  const load = useCallback(async (quiet = false) => {
    const id = ++requestId.current
    setState((current) => ({
      ...current,
      loading: quiet ? current.loading : true,
      error: null,
    }))

    try {
      const data = await loaderRef.current()
      if (requestId.current === id) {
        setState({ data, loading: false, error: null })
      }
      return data
    } catch (error) {
      if (requestId.current === id) {
        setState((current) => ({
          ...current,
          loading: false,
          error: apiErrorMessage(error, 'Erro ao carregar'),
        }))
      }
      throw error
    }
  }, [])

  useEffect(() => {
    void load().catch(() => undefined)
    return () => {
      requestId.current += 1
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { ...state, reload: load, setData: (data: T) => setState({ data, loading: false, error: null }) }
}

export function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])
  return debounced
}
