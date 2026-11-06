import Icon from './Icon'

interface PaginationProps {
  page: number
  count: number
  pageSize: number
  onChange: (page: number) => void
}

export default function Pagination({ page, count, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  if (totalPages <= 1) return null

  const pages: number[] = []
  const start = Math.max(1, Math.min(page - 1, totalPages - 2))
  for (let index = start; index <= Math.min(totalPages, start + 2); index += 1) {
    pages.push(index)
  }

  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Página anterior"
      >
        <Icon name="chevronLeft" size={17} />
      </button>

      {start > 1 && (
        <>
          <button type="button" className="pagination-btn" onClick={() => onChange(1)}>
            1
          </button>
          {start > 2 && <span className="pagination-ellipsis">…</span>}
        </>
      )}

      {pages.map((entry) => (
        <button
          type="button"
          key={entry}
          className={`pagination-btn ${entry === page ? 'active' : ''}`}
          onClick={() => onChange(entry)}
          aria-current={entry === page ? 'page' : undefined}
        >
          {entry}
        </button>
      ))}

      {start + 2 < totalPages && (
        <>
          {start + 3 < totalPages && <span className="pagination-ellipsis">…</span>}
          <button
            type="button"
            className="pagination-btn"
            onClick={() => onChange(totalPages)}
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        className="pagination-btn"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Próxima página"
      >
        <Icon name="chevronRight" size={17} />
      </button>
    </nav>
  )
}
