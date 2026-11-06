import type { ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

export function PageLoader({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="page-loader">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  )
}

export function SkeletonCards({ count = 3 }: { count?: number }) {
  return (
    <div className="skeleton-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-line skeleton-line-sm" />
          <div className="skeleton-line skeleton-line-lg" />
          <div className="skeleton-line" />
          <div className="skeleton-line skeleton-line-md" />
        </div>
      ))}
    </div>
  )
}

interface EmptyStateProps {
  icon?: IconName
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon = 'sparkles', title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <span className="empty-icon">
        <Icon name={icon} size={28} />
      </span>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="empty-state error-state">
      <span className="empty-icon">
        <Icon name="alert" size={26} />
      </span>
      <h3>Não foi possível carregar</h3>
      <p>{message}</p>
      {onRetry && (
        <div className="empty-action">
          <button type="button" className="btn btn-ghost" onClick={onRetry}>
            <Icon name="refresh" size={16} />
            Tentar de novo
          </button>
        </div>
      )}
    </div>
  )
}
