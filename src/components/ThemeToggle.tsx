import { useTheme, type ThemeMode } from '../theme/ThemeContext'
import Icon, { type IconName } from './ui/Icon'

const options: { mode: ThemeMode; label: string; icon: IconName }[] = [
  { mode: 'light', label: 'Claro', icon: 'sun' },
  { mode: 'dark', label: 'Escuro', icon: 'moon' },
  { mode: 'system', label: 'Sistema', icon: 'monitor' },
]

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { mode, setMode, resolved, toggle } = useTheme()

  if (compact) {
    return (
      <button
        type="button"
        className="icon-btn theme-toggle"
        onClick={toggle}
        title={resolved === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
        aria-label={resolved === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
      >
        <Icon name={resolved === 'dark' ? 'sun' : 'moon'} size={18} />
      </button>
    )
  }

  return (
    <div className="theme-segmented" role="group" aria-label="Tema">
      {options.map((option) => (
        <button
          key={option.mode}
          type="button"
          className={mode === option.mode ? 'active' : ''}
          onClick={() => setMode(option.mode)}
          aria-pressed={mode === option.mode}
        >
          <Icon name={option.icon} size={15} />
          {option.label}
        </button>
      ))}
    </div>
  )
}
