import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { acceptTerms, getMyTermsAcceptance } from '../api/endpoints'
import { useAuth } from '../auth/AuthContext'
import Icon from './ui/Icon'

export default function TermsAcceptanceModal() {
  const { isAuthenticated, user } = useAuth()
  const [open, setOpen] = useState(false)
  const [version, setVersion] = useState('1.0')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setOpen(false)
      return
    }

    let active = true
    getMyTermsAcceptance()
      .then((status) => {
        if (!active) return
        if (status.needs_acceptance) {
          setVersion(status.current_version || '1.0')
          setOpen(true)
        }
      })
      .catch(() => {
        /* Se offline ou erro de rede, não bloqueia a interface */
      })

    return () => {
      active = false
    }
  }, [isAuthenticated, user])

  async function handleAccept() {
    setLoading(true)
    try {
      await acceptTerms({ terms_version: version, policy_version: '1.0' })
      setOpen(false)
    } catch {
      setOpen(false)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="terms-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="terms-modal-title">
      <div className="terms-modal-card">
        <div className="terms-modal-header">
          <span className="brand-mark">
            <Icon name="shield" size={22} />
          </span>
          <div>
            <h2 id="terms-modal-title" className="terms-modal-title">
              Atualização dos Termos de Uso (v{version})
            </h2>
            <p className="terms-modal-subtitle">
              Alinhamento às exigências da Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </div>

        <div className="terms-modal-body">
          <p>
            Atualizamos nossos <strong>Termos de Uso</strong> e <strong>Política de Privacidade</strong> para
            garantir total transparência no tratamento dos seus dados corporais, planos de treino e rotinas nutricionais.
          </p>
          <div className="terms-modal-summary">
            <ul>
              <li>
                <strong>Seus dados de saúde protegidos:</strong> Métricas como peso, altura e metas são tratadas com
                salvaguardas estritas e nunca são comercializadas.
              </li>
              <li>
                <strong>Aviso de aptidão física:</strong> O FitTrack é uma ferramenta de auxílio e não substitui
                avaliação médica ou nutricional presencial.
              </li>
              <li>
                <strong>Portabilidade e Direitos:</strong> Você agora pode exportar todos os seus dados em formato JSON
                ou solicitar a exclusão de sua conta a qualquer momento no seu Perfil.
              </li>
            </ul>
          </div>
          <p className="terms-modal-links">
            Leia os documentos na íntegra:{' '}
            <Link to="/termos" target="_blank" rel="noopener noreferrer">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link to="/privacidade" target="_blank" rel="noopener noreferrer">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>

        <div className="terms-modal-actions">
          <button
            type="button"
            onClick={handleAccept}
            disabled={loading}
            className="btn btn-primary btn-block"
          >
            {loading ? 'Registrando...' : 'Concordar e Continuar'}
          </button>
        </div>
      </div>
    </div>
  )
}
