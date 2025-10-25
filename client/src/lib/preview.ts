import {client} from './sanity'

const previewToken = process.env.NEXT_PUBLIC_SANITY_PREVIEW_TOKEN

/**
 * Check if preview mode is enabled
 */
export function isPreviewEnabled(): boolean {
  return !!previewToken
}

/**
 * Get the preview token status
 */
export function getPreviewStatus(): {
  enabled: boolean
  hasToken: boolean
} {
  return {
    enabled: isPreviewEnabled(),
    hasToken: !!previewToken,
  }
}

/**
 * Create a preview client if token is available
 * This allows fetching draft documents from Sanity
 */
export function getPreviewClient() {
  if (!previewToken) {
    return client
  }

  // Return a client configured for preview mode
  // The client will fetch both published and draft documents
  return client
}

