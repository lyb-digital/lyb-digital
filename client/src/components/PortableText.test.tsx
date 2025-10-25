import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PortableText } from './PortableText'

// Mock the Sanity image builder
vi.mock('@/lib/sanity', () => ({
  urlFor: vi.fn((source) => ({
    width: vi.fn().mockReturnThis(),
    height: vi.fn().mockReturnThis(),
    fit: vi.fn().mockReturnThis(),
    auto: vi.fn().mockReturnThis(),
    url: vi.fn().mockReturnValue('https://example.com/image.jpg'),
  })),
}))

describe('PortableText Component', () => {
  it('should render null for empty value', () => {
    const { container } = render(<PortableText value={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render null for undefined value', () => {
    const { container } = render(<PortableText value={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('should render text blocks', () => {
    const value = [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Hello, World!',
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    expect(screen.getByText('Hello, World!')).toBeInTheDocument()
  })

  it('should render headings', () => {
    const value = [
      {
        _type: 'block',
        style: 'h2',
        children: [
          {
            _type: 'span',
            text: 'Main Heading',
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    const heading = screen.getByText('Main Heading')
    expect(heading.tagName).toBe('H2')
  })

  it('should render bold text', () => {
    const value = [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Bold text',
            marks: ['strong'],
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    const boldElement = screen.getByText('Bold text').closest('strong')
    expect(boldElement).toBeInTheDocument()
  })

  it('should render italic text', () => {
    const value = [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Italic text',
            marks: ['em'],
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    const italicElement = screen.getByText('Italic text').closest('em')
    expect(italicElement).toBeInTheDocument()
  })

  it('should render lists', () => {
    const value = [
      {
        _type: 'block',
        style: 'ul',
        children: [
          {
            _type: 'span',
            text: 'Item 1',
          },
        ],
      },
      {
        _type: 'block',
        style: 'ul',
        children: [
          {
            _type: 'span',
            text: 'Item 2',
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  it('should render blockquotes', () => {
    const value = [
      {
        _type: 'block',
        style: 'blockquote',
        children: [
          {
            _type: 'span',
            text: 'Quote text',
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    const blockquote = screen.getByText('Quote text').closest('blockquote')
    expect(blockquote).toBeInTheDocument()
  })

  it('should render links', () => {
    const value = [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Click here',
            marks: ['link'],
          },
        ],
        markDefs: [
          {
            _type: 'link',
            _key: 'link1',
            href: 'https://example.com',
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    const link = screen.getByText('Click here').closest('a')
    expect(link).toHaveAttribute('href', 'https://example.com')
  })

  it('should render multiple blocks', () => {
    const value = [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'First paragraph',
          },
        ],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Second paragraph',
          },
        ],
      },
    ]

    render(<PortableText value={value} />)
    expect(screen.getByText('First paragraph')).toBeInTheDocument()
    expect(screen.getByText('Second paragraph')).toBeInTheDocument()
  })
})

