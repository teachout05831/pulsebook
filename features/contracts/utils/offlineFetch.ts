/**
 * Fetch wrapper that queues requests in IndexedDB when offline.
 * When online: normal fetch. When offline or fetch fails: queue for later sync.
 */
export async function offlineFetch(
  url: string,
  options: RequestInit,
  queueAction: (action: string, payload: unknown) => Promise<void>
): Promise<Response | null> {
  if (navigator.onLine) {
    try {
      const res = await fetch(url, options)
      if (res.ok) return res
    } catch {
      // Network error — fall through to queue
    }
  }

  // Queue for later sync when back online
  await queueAction('fetch', {
    url,
    method: options.method || 'POST',
    body: options.body ? JSON.parse(options.body as string) : undefined,
  })

  return null
}
