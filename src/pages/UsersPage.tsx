import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { deactivateUser, getUsers } from '../api/endpoints'
import type { User } from '../api/types'
import { useAuth } from '../auth/AuthContext'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Icon from '../components/ui/Icon'
import PageHeader from '../components/ui/PageHeader'
import Pagination from '../components/ui/Pagination'
import SearchInput from '../components/ui/SearchInput'
import { EmptyState, ErrorState, SkeletonCards } from '../components/ui/States'
import { useToast } from '../components/ui/Toast'
import { useAsync, useDebouncedValue } from '../hooks/useAsync'
import {
  apiErrorMessage,
  displayName,
  formatDate,
  formatNumber,
  goalLabel,
  initials,
} from '../lib/format'

const PAGE_SIZE = 12

type StatusFilter = 'all' | 'active' | 'inactive'

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const { toast } = useToast()

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<StatusFilter>('all')
  const [target, setTarget] = useState<User | null>(null)
  const [deactivating, setDeactivating] = useState(false)

  const debouncedSearch = useDebouncedValue(search)

  const { data, loading, error, reload } = useAsync(
    () =>
      getUsers({
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch,
        ordering: '-date_joined',
        isActive: status === 'all' ? undefined : status === 'active',
      }),
    [page, debouncedSearch, status],
  )

  if (!currentUser?.is_staff) {
    return <Navigate to="/inicio" replace />
  }

  async function handleDeactivate() {
    if (!target) return
    setDeactivating(true)
    try {
      await deactivateUser(target.id)
      toast(`${displayName(target)} foi desativado.`, 'success')
      setTarget(null)
      void reload(true)
    } catch (err) {
      toast(apiErrorMessage(err, 'Não foi possível desativar o usuário.'), 'error')
    } finally {
      setDeactivating(false)
    }
  }

  const results = data?.results ?? []

  return (
    <div className="stack-lg">
      <PageHeader
        eyebrow="Área administrativa"
        title="Usuários"
        description="Visualize contas e desative acessos. A desativação preserva o histórico de treinos e dietas."
        actions={
          <span className="soft-badge staff">
            <Icon name="shield" size={14} /> Somente staff
          </span>
        }
      />

      <div className="toolbar">
        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value)
            setPage(1)
          }}
          placeholder="Buscar por nome, usuário ou e-mail..."
        />

        <div className="toolbar-controls">
          <div className="filter-chips" role="group" aria-label="Filtrar por status">
            {(
              [
                ['all', 'Todos'],
                ['active', 'Ativos'],
                ['inactive', 'Inativos'],
              ] as [StatusFilter, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={`chip ${status === value ? 'active' : ''}`}
                onClick={() => {
                  setStatus(value)
                  setPage(1)
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonCards count={5} />
      ) : error ? (
        <ErrorState message={error} onRetry={() => void reload()} />
      ) : results.length === 0 ? (
        <EmptyState
          icon="users"
          title="Nenhum usuário encontrado"
          description="Ajuste a busca ou o filtro de status para ver outras contas."
        />
      ) : (
        <>
          <div className="results-line">
            <span>
              {formatNumber(data?.count ?? 0)}{' '}
              {(data?.count ?? 0) === 1 ? 'usuário' : 'usuários'}
            </span>
            <span className="results-line-hint">Contas desativadas continuam no histórico</span>
          </div>

          <div className="user-list panel">
            <div className="user-row user-row-head" aria-hidden="true">
              <span>Usuário</span>
              <span>Objetivo</span>
              <span>Entrada</span>
              <span>Status</span>
              <span />
            </div>

            {results.map((user) => (
              <div key={user.id} className="user-row">
                <div className="user-row-main">
                  <span className={`avatar ${user.is_active ? '' : 'avatar-muted'}`}>
                    {initials(displayName(user))}
                  </span>
                  <div>
                    <strong>
                      {displayName(user)}
                      {user.id === currentUser.id && <span className="you-badge">você</span>}
                      {user.is_staff && (
                        <span className="soft-badge staff compact-badge">
                          <Icon name="shield" size={11} /> staff
                        </span>
                      )}
                    </strong>
                    <span>@{user.username}</span>
                    <small>{user.email || 'Sem e-mail'}</small>
                  </div>
                </div>

                <span className="user-goal">{goalLabel(user.profile?.goal)}</span>
                <span className="user-joined">{formatDate(user.date_joined)}</span>
                <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                  <i /> {user.is_active ? 'Ativo' : 'Inativo'}
                </span>

                <div className="user-actions">
                  {user.is_active && user.id !== currentUser.id ? (
                    <button
                      type="button"
                      className="icon-btn danger"
                      onClick={() => setTarget(user)}
                      aria-label={`Desativar ${displayName(user)}`}
                      title="Desativar usuário"
                    >
                      <Icon name="user" size={16} />
                      <Icon name="x" size={10} className="icon-overlay" />
                    </button>
                  ) : (
                    <span className="user-action-placeholder">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Pagination
            page={page}
            count={data?.count ?? 0}
            pageSize={PAGE_SIZE}
            onChange={setPage}
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(target)}
        title="Desativar usuário?"
        description={`${target ? displayName(target) : 'Este usuário'} não conseguirá mais entrar na conta. Treinos, dietas e histórico continuam preservados.`}
        confirmLabel="Desativar usuário"
        loading={deactivating}
        onConfirm={() => void handleDeactivate()}
        onClose={() => setTarget(null)}
      />
    </div>
  )
}
