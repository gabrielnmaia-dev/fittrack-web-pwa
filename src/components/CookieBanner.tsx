import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { saveCookieConsent } from '../api/endpoints'
import type { CookieConsentPreferences } from '../api/types'
import Icon from './ui/Icon'

const STORAGE_KEY = 'fittrack:cookie-consent'
const CURRENT_VERSION = '1.0'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [customizing, setCustomizing] = useState(false)

  // Categorias de consentimento
  const [preferences, setPreferences] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as CookieConsentPreferences
        setPreferences(Boolean(parsed.preferences))
        setAnalytics(Boolean(parsed.analytics))
        setMarketing(Boolean(parsed.marketing))
      } else {
        // Exibe o banner se ainda não houver escolha registrada
        setVisible(true)
      }
    } catch {
      setVisible(true)
    }

    const handleOpen = () => {
      setCustomizing(true)
      setVisible(true)
    }

    window.addEventListener('fittrack:open-cookie-banner', handleOpen)
    return () => window.removeEventListener('fittrack:open-cookie-banner', handleOpen)
  }, [])

  async function persistChoice(prefs: CookieConsentPreferences) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
      window.dispatchEvent(new CustomEvent('fittrack:cookie-consent-updated', { detail: prefs }))
      // Envia ao backend em background
      void saveCookieConsent(prefs).catch(() => {
        /* ignora falha de rede offline no PWA */
      })
    } catch {
      /* localStorage indisponível */
    }
    setVisible(false)
    setCustomizing(false)
  }

  function handleAcceptAll() {
    const all: CookieConsentPreferences = {
      necessary: true,
      preferences: true,
      analytics: true,
      marketing: true,
      version: CURRENT_VERSION,
    }
    setPreferences(true)
    setAnalytics(true)
    setMarketing(true)
    void persistChoice(all)
  }

  function handleRejectNonNecessary() {
    const minimal: CookieConsentPreferences = {
      necessary: true,
      preferences: false,
      analytics: false,
      marketing: false,
      version: CURRENT_VERSION,
    }
    setPreferences(false)
    setAnalytics(false)
    setMarketing(false)
    void persistChoice(minimal)
  }

  function handleSaveCustom() {
    const custom: CookieConsentPreferences = {
      necessary: true,
      preferences,
      analytics,
      marketing,
      version: CURRENT_VERSION,
    }
    void persistChoice(custom)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner-backdrop" role="dialog" aria-modal="true" aria-labelledby="cookie-banner-title">
      <div className="cookie-banner-card">
        <div className="cookie-banner-header">
          <span className="cookie-icon-wrapper">
            <Icon name="shield" size={20} />
          </span>
          <div>
            <h2 id="cookie-banner-title" className="cookie-banner-title">
              {customizing ? 'Personalizar Preferências de Privacidade' : 'Privacidade e Armazenamento Local'}
            </h2>
            <p className="cookie-banner-subtitle">
              Respeitamos seus dados de acordo com a LGPD (Lei nº 13.709/2018).
            </p>
          </div>
        </div>

        {!customizing ? (
          <div className="cookie-banner-body">
            <p>
              Utilizamos tecnologias de armazenamento local (<code>localStorage</code>) estritamente necessárias para
              manter você autenticado, preservar o estado dos seus treinos e permitir o funcionamento offline do PWA.
              Você pode aceitar todas as categorias, manter apenas as estritamente necessárias ou personalizar suas escolhas.
            </p>
            <p className="cookie-banner-links">
              Saiba mais em nossa <Link to="/cookies">Política de Cookies</Link> e na{' '}
              <Link to="/privacidade">Política de Privacidade</Link>.
            </p>
          </div>
        ) : (
          <div className="cookie-custom-categories">
            <div className="cookie-category-item">
              <div className="cookie-category-info">
                <div className="cookie-category-title-row">
                  <strong>Estritamente Necessários</strong>
                  <span className="badge badge-necessary">Sempre Ativo</span>
                </div>
                <p>
                  Essenciais para o funcionamento do PWA, tokens de login, sincronização de treinos e modo offline. Não
                  podem ser desativados.
                </p>
              </div>
              <input type="checkbox" checked disabled className="cookie-toggle" aria-label="Necessários (ativo)" />
            </div>

            <div className="cookie-category-item">
              <div className="cookie-category-info">
                <div className="cookie-category-title-row">
                  <strong>Preferências do Usuário</strong>
                  <span className="badge badge-optional">Opcional</span>
                </div>
                <p>Armazena suas preferências de interface, como o tema visual escuro ou claro.</p>
              </div>
              <label className="cookie-toggle-label">
                <input
                  type="checkbox"
                  checked={preferences}
                  onChange={(e) => setPreferences(e.target.checked)}
                  className="cookie-toggle"
                />
                <span className="sr-only">Habilitar preferências</span>
              </label>
            </div>

            <div className="cookie-category-item">
              <div className="cookie-category-info">
                <div className="cookie-category-title-row">
                  <strong>Estatísticas e Desempenho</strong>
                  <span className="badge badge-optional">Opcional</span>
                </div>
                <p>Métricas de uso anônimas para diagnosticar estabilidade e desempenho do aplicativo.</p>
              </div>
              <label className="cookie-toggle-label">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="cookie-toggle"
                />
                <span className="sr-only">Habilitar estatísticas</span>
              </label>
            </div>

            <div className="cookie-category-item">
              <div className="cookie-category-info">
                <div className="cookie-category-title-row">
                  <strong>Marketing e Anúncios</strong>
                  <span className="badge badge-optional">Opcional</span>
                </div>
                <p>O FitTrack não possui anúncios nem compartilha dados com redes de publicidade.</p>
              </div>
              <label className="cookie-toggle-label">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="cookie-toggle"
                />
                <span className="sr-only">Habilitar marketing</span>
              </label>
            </div>
          </div>
        )}

        <div className="cookie-banner-actions">
          {!customizing ? (
            <>
              <button
                type="button"
                onClick={() => setCustomizing(true)}
                className="btn btn-secondary btn-sm"
              >
                Personalizar
              </button>
              <button
                type="button"
                onClick={handleRejectNonNecessary}
                className="btn btn-secondary btn-sm"
              >
                Apenas Necessários
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="btn btn-primary btn-sm"
              >
                Aceitar Todos
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setCustomizing(false)}
                className="btn btn-secondary btn-sm"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleSaveCustom}
                className="btn btn-primary btn-sm"
              >
                Salvar Preferências
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
