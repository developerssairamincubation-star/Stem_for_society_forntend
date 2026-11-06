/**
 * Localhost-only preview.
 *
 * When the app runs from the dev server (`npm run dev`) and the backend cannot be reached, a page can show sample content
 * instead of an error, so the design can be reviewed without a backend. In a production build `import.meta.env.DEV` is the
 * constant `false`, so the branch below and the sample data it imports are removed from the bundle: visitors never see them.
 * A real answer from the backend (including an empty list) is always used as it is. Only a failed request falls back.
 */
export type PreviewKey = 'blogs' | 'blog' | 'courses' | 'trainings' | 'training'

export async function withDevPreview<T>(real: () => Promise<T>, key: PreviewKey, arg?: string): Promise<T> {
  try {
    return await real()
  } catch (error) {
    if (import.meta.env.DEV) {
      const { previewResponse } = await import('./previewData')
      console.info(`[ui-preview] backend not reachable, showing sample content for "${key}"`)
      return previewResponse(key, arg) as T
    }
    throw error
  }
}
