import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { ThemeToggle } from '../components/ThemeToggle'

export default function PrivacyPolicyPage() {
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
          <span className="eyebrow">LGPD · Lei nº 13.709/2018</span>
          <h1>Política de Privacidade</h1>
          <p className="legal-meta">
            Última atualização: <strong>1º de janeiro de 2026</strong> · Versão: <strong>1.0</strong>
          </p>

          <section className="legal-section">
            <h2>1. Identificação do Controlador e Encarregado (DPO)</h2>
            <p>
              Esta Política de Privacidade aplica-se à plataforma <strong>FitTrack</strong>, operada por{' '}
              <strong>[Razão Social da Empresa Controladora]</strong>, pessoa jurídica de direito privado,
              inscrita no CNPJ sob o nº <strong>[00.000.000/0000-00]</strong>, com sede em{' '}
              <strong>[Endereço Completo, Cidade - UF, CEP 00000-000]</strong> (&quot;FitTrack&quot; ou &quot;Controlador&quot;).
            </p>
            <p>
              Em cumprimento ao Art. 41 da Lei Geral de Proteção de Dados Pessoais (LGPD), nomeamos nosso{' '}
              <strong>Encarregado pelo Tratamento de Dados Pessoais (DPO)</strong>, acessível diretamente pelo canal:
            </p>
            <div className="legal-highlight-box">
              <Icon name="mail" size={18} />
              <div>
                <strong>Canal do Encarregado (DPO):</strong>
                <p>E-mail: <code>dpo@fittrack.com.br</code> · Atendimento a requisições de titulares e ANPD.</p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>2. Dados Pessoais Coletados e Categorias</h2>
            <p>
              O FitTrack coleta estritamente os dados necessários para o fornecimento do aplicativo e acompanhamento
              da sua rotina fitness:
            </p>
            <ul className="legal-list">
              <li>
                <strong>Dados Cadastrais e de Identificação:</strong> Nome de usuário (username), nome, sobrenome,
                e-mail e senha criptografada (hash seguro).
              </li>
              <li>
                <strong>Dados Pessoais Relativos à Saúde e Físicos (Art. 5º, II da LGPD):</strong> Idade, peso atual (kg),
                altura (cm), meta fitness (perda de peso, ganho de massa ou manutenção), histórico de treinos registrados,
                exercícios, séries, repetições, planos de alimentação e refeições associadas.
              </li>
              <li>
                <strong>Dados de Conexão e Dispositivo:</strong> Endereço IP, data e hora de acesso, características
                do navegador e dispositivo (User-Agent) e registros de manifestação de termos e consentimento.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Finalidades e Bases Legais do Tratamento</h2>
            <p>O tratamento de dados no FitTrack fundamenta-se nas seguintes hipóteses legais da LGPD:</p>
            <div className="legal-table-wrapper">
              <table className="legal-table">
                <thead>
                  <tr>
                    <th>Categoria de Dados</th>
                    <th>Finalidade do Tratamento</th>
                    <th>Base Legal (LGPD)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Dados Cadastrais</td>
                    <td>Criação e autenticação de conta, suporte técnico e comunicação.</td>
                    <td>Execução de Contrato (Art. 7º, V)</td>
                  </tr>
                  <tr>
                    <td>Dados Físicos e Corporais</td>
                    <td>Cálculo de IMC, organização de treinos e registro de metas calóricas.</td>
                    <td>Consentimento e Execução com Salvaguardas (Art. 11, II)</td>
                  </tr>
                  <tr>
                    <td>Logs de Acesso e IPs</td>
                    <td>Segurança da aplicação e prevenção a acessos indevidos.</td>
                    <td>Obrigação Legal — Marco Civil da Internet (Art. 7º, II c/c Art. 15 da Lei 12.965/2014)</td>
                  </tr>
                  <tr>
                    <td>Preferências de Tema</td>
                    <td>Ajuste da interface visual (claro/escuro) no dispositivo.</td>
                    <td>Legítimo Interesse / Consentimento (Art. 7º, IX e I)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="legal-section">
            <h2>4. Compartilhamento com Terceiros</h2>
            <p>
              <strong>O FitTrack NÃO vende, aluga nem cede dados pessoais ou informações de saúde para terceiros, anunciantes ou seguradoras.</strong>
            </p>
            <p>O compartilhamento limita-se exclusivamente a:</p>
            <ul className="legal-list">
              <li>
                <strong>Provedores de Infraestrutura:</strong> Hospedagem em servidores seguros com controle rigoroso
                de acesso e criptografia em trânsito (HTTPS/TLS).
              </li>
              <li>
                <strong>Autoridades Judiciais ou Regulatórias:</strong> Mediante ordem judicial fundamentada ou
                requisição legal da ANPD.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Retenção e Exclusão de Dados</h2>
            <p>
              Os dados pessoais são conservados enquanto o usuário mantiver sua conta ativa na plataforma. Ao solicitar o
              encerramento ou exclusão da conta:
            </p>
            <ul className="legal-list">
              <li>Os dados cadastrais e o perfil físico são anonimizados ou eliminados de imediato.</li>
              <li>
                Os registros de conexão (endereço IP, data e hora) são mantidos sob sigilo pelo prazo estrito de 6 (seis)
                meses em conformidade obrigatória com o Art. 15 do Marco Civil da Internet (Lei nº 12.965/2014), após o qual
                são definitivamente expurgados.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>6. Direitos do Titular de Dados (Art. 18 da LGPD)</h2>
            <p>Você possui o direito de, a qualquer momento e mediante requisição facilitada:</p>
            <ul className="legal-list">
              <li>Confirmar a existência de tratamento e acessar seus dados pessoais.</li>
              <li>Corrigir dados incompletos, inexatos ou desatualizados via tela de Perfil.</li>
              <li>
                <strong>Exportar seus dados (Portabilidade):</strong> Você pode baixar uma cópia completa de todos os
                seus dados em formato aberto estruturado (JSON) diretamente na seção de Privacidade do seu Perfil.
              </li>
              <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários ou excessivos.</li>
              <li>Revogar consentimentos concedidos anteriormente para tecnologias opcionais de cookies.</li>
              <li>Solicitar a exclusão definitiva da sua conta.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>7. Segurança da Informação</h2>
            <p>
              Adotamos medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados
              e de situações acidentais ou ilícitas de destruição, perda ou alteração. Entre as salvaguardas implementadas:
            </p>
            <ul className="legal-list">
              <li>Senhas protegidas com algoritmo de derivação criptográfica robusto (Argon2 / PBKDF2).</li>
              <li>Comunicação via protocolo seguro HTTPS com certificado SSL/TLS moderno.</li>
              <li>Autenticação via JSON Web Tokens (JWT) com chaves de expiração temporária.</li>
              <li>Políticas de autorização que garantem que nenhum usuário acesse planos ou dietas alheias.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>8. Alterações desta Política</h2>
            <p>
              Esta política poderá ser atualizada periodicamente para refletir melhorias ou adequações regulatórias.
              Sempre que houver alteração substancial que afete direitos ou finalidades de tratamento, notificaremos
              os usuários na plataforma para ciência e, quando exigível, novo consentimento.
            </p>
          </section>

          <footer className="legal-footer">
            <div className="legal-footer-links">
              <Link to="/termos">Termos de Uso</Link>
              <span>·</span>
              <Link to="/cookies">Política de Cookies</Link>
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
