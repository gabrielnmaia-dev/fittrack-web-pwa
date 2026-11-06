import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'

export default function NotFoundPage() {
  return (
    <div className="not-found">
      <span className="not-found-code">404</span>
      <span className="empty-icon">
        <Icon name="search" size={28} />
      </span>
      <h1>Essa página não existe</h1>
      <p>Talvez o link tenha mudado ou o endereço esteja incompleto.</p>
      <div className="not-found-actions">
        <Link to="/inicio" className="btn btn-primary">
          <Icon name="home" size={17} /> Ir para o início
        </Link>
        <Link to="/treinos" className="btn btn-ghost">
          Ver meus treinos
        </Link>
      </div>
    </div>
  )
}
