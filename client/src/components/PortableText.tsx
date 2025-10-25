import {PortableText as PortableTextComponent, PortableTextComponents} from '@portabletext/react'
import {urlFor} from '@/lib/sanity'

const components: PortableTextComponents = {
  types: {
    image: ({value}) => {
      if (!value || !value.asset) return null
      const imageUrl = urlFor(value)?.width(800).height(400).fit('crop').auto('format').url()
      
      return (
        <div className="my-6 rounded-lg overflow-hidden">
          <img
            src={imageUrl}
            alt={value.alt || 'Article image'}
            className="w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-foreground/70 mt-2 px-4 py-2 bg-muted">
              {value.caption}
            </p>
          )}
        </div>
      )
    },
    callout: ({value}) => {
      const typeStyles: Record<string, string> = {
        tip: 'bg-blue-50 border-l-4 border-blue-500 text-blue-900',
        warning: 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-900',
        info: 'bg-cyan-50 border-l-4 border-cyan-500 text-cyan-900',
        success: 'bg-green-50 border-l-4 border-green-500 text-green-900',
      }
      
      const style = typeStyles[value.type] || typeStyles.info
      
      return (
        <div className={`my-6 p-4 rounded ${style}`}>
          {value.content && (
            <PortableTextComponent value={value.content} components={components} />
          )}
        </div>
      )
    },
  },
  marks: {
    link: ({value, children}) => {
      const target = value?.href?.startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target ? 'noopener noreferrer' : undefined}
          className="text-accent hover:underline font-medium"
        >
          {children}
        </a>
      )
    },
    code: ({children}) => (
      <code className="bg-muted px-2 py-1 rounded text-sm font-mono text-foreground">
        {children}
      </code>
    ),
    strong: ({children}) => <strong className="font-bold">{children}</strong>,
    em: ({children}) => <em className="italic">{children}</em>,
    underline: ({children}) => <u className="underline">{children}</u>,
    'strike-through': ({children}) => <s className="line-through">{children}</s>,
  },
  block: {
    h1: ({children}) => (
      <h1 className="text-4xl md:text-5xl font-serif font-bold my-6 text-foreground">
        {children}
      </h1>
    ),
    h2: ({children}) => (
      <h2 className="text-3xl md:text-4xl font-serif font-bold my-5 text-foreground mt-8">
        {children}
      </h2>
    ),
    h3: ({children}) => (
      <h3 className="text-2xl md:text-3xl font-serif font-bold my-4 text-foreground mt-6">
        {children}
      </h3>
    ),
    h4: ({children}) => (
      <h4 className="text-xl font-serif font-bold my-3 text-foreground mt-4">
        {children}
      </h4>
    ),
    normal: ({children}) => (
      <p className="text-base leading-relaxed text-foreground my-4">
        {children}
      </p>
    ),
    blockquote: ({children}) => (
      <blockquote className="border-l-4 border-accent pl-4 my-6 italic text-foreground/80 bg-accent/5 py-4">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({children}) => (
      <ul className="list-disc list-inside my-4 space-y-2 text-foreground">
        {children}
      </ul>
    ),
    number: ({children}) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-foreground">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({children}) => <li className="ml-4">{children}</li>,
    number: ({children}) => <li className="ml-4">{children}</li>,
  },
}

export function PortableText({value}: {value: any}) {
  if (!value) return null
  return <PortableTextComponent value={value} components={components} />
}

