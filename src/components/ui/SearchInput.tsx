import { useEffect, useRef } from 'react'
import Icon from './Icon'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
  enableShortcut?: boolean
}

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Buscar...',
  label = 'Buscar',
  enableShortcut = true,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!enableShortcut) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '/' || event.metaKey || event.ctrlKey || event.altKey) return
      const target = event.target as HTMLElement | null
      const tag = target?.tagName
      if (
        tag === 'INPUT' ||
        tag === 'TEXTAREA' ||
        tag === 'SELECT' ||
        target?.isContentEditable
      ) {
        return
      }
      event.preventDefault()
      inputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [enableShortcut])

  return (
    <label className="search-input">
      <span className="sr-only">{label}</span>
      <Icon name="search" size={18} />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            if (value) {
              event.stopPropagation()
              onChange('')
            } else {
              inputRef.current?.blur()
            }
          }
        }}
        placeholder={placeholder}
      />
      {value ? (
        <button
          type="button"
          className="search-clear"
          onClick={() => {
            onChange('')
            inputRef.current?.focus()
          }}
          aria-label="Limpar busca"
        >
          <Icon name="x" size={14} />
        </button>
      ) : (
        enableShortcut && (
          <kbd className="search-kbd" aria-hidden="true" title="Pressione / para buscar">
            /
          </kbd>
        )
      )}
    </label>
  )
}
