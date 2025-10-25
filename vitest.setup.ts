import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest matchers with testing library matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 'test-project-id'
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production'

// Mock fetch for API tests
global.fetch = vi.fn()

