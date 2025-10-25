import '@testing-library/jest-dom'
import type { Assertion, AsymmetricMatchersContaining } from 'vitest'

interface CustomMatchers<R = void> {
  toBeInTheDocument(): R
  toHaveAttribute(attr: string, value?: string): R
  toHaveClass(className: string): R
  toHaveStyle(style: string | Record<string, any>): R
  toHaveTextContent(text: string | RegExp): R
  toBeVisible(): R
  toBeDisabled(): R
  toBeEnabled(): R
  toBeEmpty(): R
  toBeEmptyDOMElement(): R
  toBeInvalid(): R
  toBeValid(): R
  toBePartiallyChecked(): R
  toBeChecked(): R
  toBePartiallyVisible(): R
  toHaveErrorMessage(message: string): R
  toHaveFormValues(values: Record<string, any>): R
  toBeRequired(): R
  toHaveValue(value: string | number | string[]): R
  toHaveDisplayValue(value: string | string[]): R
}

declare global {
  namespace Vi {
    interface Matchers<R = void> extends CustomMatchers<R> {}
  }
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<void> {}
  interface AsymmetricMatchersContaining extends CustomMatchers<void> {}
}

