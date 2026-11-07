import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { ThemeToggle } from '../components/ThemeToggle'

export default function CookiePolicyPage() {
  function handleOpenPreferences() {
    window.dispatchEvent(new CustomEvent('fittrack:open-cookie-banner'))
  }

  return (
    <div className="legal-page">
      <header className="legal-header">
        <div className="legal-header-inner">
          <Link to="/" className="brand" aria-label="Voltar para início">
            <span className="brand-mark">
              <Icon name="dumbbell" size={20} />
            </span>
            <strong>FitTrack</strong>
          </Link>
          <div className="legal-header-actions">
            <ThemeToggle compact />
            <Link to="/login" className="btn btn-secondary btn-sm">
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="legal-container">
        <article className="legal-card">
          <span className="eyebrow">LGPD · Resolução CD/ANPD nº 18</span>
          <h1>Política de Cookies e Armazenamento Local</h1>
          <p className="legal-meta">
            Última atualização: <strong>1º de janeiro de 2026</strong> · Versão: <strong>1.0</strong>
          </p>

          <section className="legal-section">
            <h2>1. O que são Cookies e Tecnologias de Armazenamento</h2>
            <p>
              Cookies e tecnologias correlatas (como <code>localStorage</code>, <code>sessionStorage</code> e caches
              de Service Worker em Progressive Web Apps) são pequenos arquivos ou fragmentos de dados armazenados no
              seu navegador ou dispositivo quando você utiliza nosso aplicativo.
            </p>
            <p>
              Essas tecnologias permitem que o FitTrack reconheça sua sessão, preserve seu login com segurança,
              mantenha seu tema preferido e permita que seus treinos funcionem com carregamento instantâneo mesmo offline.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Tecnologias Efetivamente Utilizadas no FitTrack</h2>
            <p>
              Em respeito estrito ao princípio da transparência e necessidade (Art. 6º da LGPD), documentamos abaixo
              <strong>todas as tecnologias de armazenamento local</strong> identificadas e operantes no sistema:
            </p>

            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Chave / Nome</th>
                    <th>Tipo</th>
                    <th>Categoria</th>
                    <th>Duração</th>
                    <th>Finalidade Específica</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><code>fittrack:refresh</code></td>
                    <td>localStorage</td>
                    <td><span className="badge badge-necessary">Estritamente Necessário</span></td>
                    <td>7 dias (ou até logout)</td>
                    <td>Token de renovação JWT (Refresh Token) para manter a sessão do usuário autenticada de forma segura sem exigir nova digitação de senha a cada acesso.</td>
                  </tr>
                  <tr>
                    <td><code>fittrack:user</code></td>
                    <td>localStorage</td>
                    <td><span className="badge badge-necessary">Estritamente Necessário</span></td>
                    <td>Persistente (limpo no logout)</td>
                    <td>Cache local do perfil do usuário para renderização imediata da interface e funcionamento rápido no PWA.</td>
                  </tr>
                  <tr>
                    <td><code>fittrack:workout-session:*</code></td>
                    <td>localStorage</td>
                    <td><span className="badge badge-necessary">Estritamente Necessário</span></td>
                    <td>Duração do treino</td>
                    <td>Guarda o progresso do treino em execução (exercícios marcados como feitos e anotações de carga) para evitar perda de dados se o app for minimizado.</td>
                  </tr>
                  <tr>
                    <td><code>fittrack:cookie-consent</code></td>
                    <td>localStorage</td>
                    <td><span className="badge badge-necessary">Estritamente Necessário</span></td>
                    <td>12 meses</td>
                    <td>Registra as escolhas e preferências de privacidade feitas pelo titular, evitando reexibição desnecessária do aviso.</td>
                  </tr>
                  <tr>
                    <td><code>fittrack:theme</code></td>
                    <td>localStorage</td>
                    <td><span className="badge badge-optional">Preferências</span></td>
                    <td>Persistente</td>
                    <td>Memoriza a preferência visual do usuário (tema escuro, tema claro ou automático do sistema).</td>
                  </tr>
                  <tr>
                    <td><code>sw.js (Service Worker)</code></td>
                    <td>CacheStorage</td>
                    <td><span className="badge badge-necessary">Estritamente Necessário</span></td>
                    <td>Até atualização do app</td>
                    <td>Cache dos arquivos HTML, JavaScript, CSS e ícones do PWA para carregamento ultrarrápido e funcionamento em modo offline.</td>
                  </tr>
                  <tr>
                    <td><code>sessionid / csrftoken</code></td>
                    <td>Cookie HTTP</td>
                    <td><span className="badge badge-necessary">Estritamente Necessário</span></td>
                    <td>Sessão</td>
                    <td>Cookies de segurança exclusivos da área restrita de administração (Django Admin) para operadores autorizados.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="legal-section">
            <h2>3. Categorias de Consentimento</h2>
            <ul className="legal-list">
              <li>
                <strong>Estritamente Necessários:</strong> Fundamentais para o funcionamento do PWA, segurança,
                autenticação e persistência offline. Não podem ser desativados sem inviabilizar o serviço. Base legal:
                Execução de Contrato (Art. 7º, V da LGPD).
              </li>
              <li>
                <strong>Preferências:</strong> Permitem que a interface se adeque ao seu gosto pessoal (ex: modo noturno).
                Base legal: Legítimo interesse / Consentimento.
              </li>
              <li>
                <strong>Estatísticas (Analytics):</strong> Coleta agregada e anônima de métricas para entender o
                desempenho técnico do aplicativo. <em>(Nota: O FitTrack atualmente NÃO utiliza trackers de terceiros como Google Analytics ou Hotjar).</em>
              </li>
              <li>
                <strong>Marketing:</strong> Rastreamento para entrega de anúncios personalizados.
                <em>(Nota: O FitTrack NÃO utiliza cookies de marketing ou redes de publicidade).</em>
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Gerenciamento e Revogação das suas Escolhas</h2>
            <p>
              Você pode alterar ou revogar suas preferências de armazenamento a qualquer momento com efeito imediato.
              Clique no botão abaixo para abrir o painel de configurações:
            </p>
            <div className="legal-action-box">
              <button type="button" onClick={handleOpenPreferences} className="btn btn-primary">
                <Icon name="filter" size={17} /> Personalizar Preferências de Cookies
              </button>
            </div>
            <p className="text-muted text-sm mt-3">
              Você também pode limpar os dados e cookies armazenados através das configurações do seu navegador ou
              dispositivo móvel. Observe que a exclusão dos dados de autenticação exigirá novo login na plataforma.
            </p>
          </section>

          <footer className="legal-footer">
            <div className="legal-footer-links">
              <Link to="/privacidade">Política de Privacidade</Link>
              <span>·</span>
              <Link to="/termos">Termos de Uso</Link>
              <span>·</span>
              <Link to="/">Voltar ao Aplicativo</Link>
            </div>
            <p className="legal-copyright">© {new Date().getFullYear()} FitTrack — Todos os direitos reservados.</p>
          </footer>
        </article>
      </main>
    </div>
  )
}
