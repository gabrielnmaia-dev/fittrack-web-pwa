import { Link } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import { ThemeToggle } from '../components/ThemeToggle'

export default function TermsPage() {
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
          <span className="eyebrow">Contrato de Licença e Uso</span>
          <h1>Termos de Uso</h1>
          <p className="legal-meta">
            Última atualização: <strong>1º de janeiro de 2026</strong> · Versão: <strong>1.0</strong>
          </p>

          <section className="legal-section">
            <h2>1. Apresentação e Identificação da Plataforma</h2>
            <p>
              Estes Termos de Uso regem a utilização do aplicativo e plataforma <strong>FitTrack</strong>, mantido por{' '}
              <strong>[Razão Social da Empresa Controladora]</strong>, inscrita no CNPJ sob o nº{' '}
              <strong>[00.000.000/0000-00]</strong>, com sede em{' '}
              <strong>[Endereço Completo, Cidade - UF, CEP 00000-000]</strong>.
            </p>
            <p>
              Ao criar uma conta ou utilizar os serviços do FitTrack, você declara que leu, compreendeu e concorda
              integralmente com as disposições aqui estabelecidas e com nossa{' '}
              <Link to="/privacidade">Política de Privacidade</Link>.
            </p>
          </section>

          <section className="legal-section legal-warning-section">
            <div className="legal-warning-box">
              <Icon name="alert" size={24} />
              <div>
                <h3>AVISO LEGAL CRÍTICO: NÃO CONSTITUI ORIENTAÇÃO MÉDICA OU NUTRICIONAL</h3>
                <p>
                  O <strong>FitTrack</strong> é uma ferramenta tecnológica de organização pessoal, registro e
                  acompanhamento de treinos e rotinas alimentares.
                </p>
                <p>
                  <strong>
                    As métricas, cálculos de IMC, sugestões e registros disponibilizados NÃO CONSTITUEM consulta,
                    diagnóstico, prescrição ou parecer de médicos, nutricionistas ou profissionais de educação física.
                  </strong>
                </p>
                <p>
                  Antes de iniciar qualquer atividade física de esforço moderado ou intenso, ou qualquer mudança drástica
                  em sua alimentação, é estritamente recomendada a realização de exames clínicos prévios e a consulta
                  a profissionais de saúde devidamente habilitados (CREF, CRM, CRN).
                </p>
              </div>
            </div>
          </section>

          <section className="legal-section">
            <h2>2. Cadastro, Requisitos e Segurança da Conta</h2>
            <ul className="legal-list">
              <li>
                Para utilizar os recursos personalizados, o usuário deve realizar cadastro informando dados verdadeiros,
                completos e atualizados.
              </li>
              <li>
                O usuário é o único responsável pela guarda e confidencialidade de suas credenciais de login
                (usuário e senha), respondendo por todas as atividades realizadas sob sua conta.
              </li>
              <li>
                Em caso de suspeita de uso não autorizado ou violação de segurança, o usuário deve comunicar
                imediatamente a plataforma através do canal de suporte.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>3. Responsabilidades do Usuário</h2>
            <p>O usuário compromete-se a:</p>
            <ul className="legal-list">
              <li>Não utilizar o FitTrack para fins ilícitos, fraudulentos ou contrários à legislação vigente.</li>
              <li>Não tentar burlar mecanismos de autenticação, aplicar engenharia reversa ou desestabilizar servidores.</li>
              <li>Respeitar os limites de aptidão física próprios e de eventuais terceiros aos quais recomende rotinas.</li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>4. Responsabilidades e Limitações da Plataforma</h2>
            <ul className="legal-list">
              <li>
                O FitTrack empenha esforços comercialmente razoáveis para manter a plataforma disponível 24 horas por dia,
                7 dias por semana, ressalvadas indisponibilidades temporárias para manutenção técnica, atualizações ou
                força maior.
              </li>
              <li>
                Em conformidade com a legislação aplicável, a plataforma não se responsabiliza por lesões corporais,
                agravamento de condições clínicas preexistentes ou danos decorrentes da má execução de exercícios ou
                interpretações equivocadas de dados fornecidos pelo usuário.
              </li>
            </ul>
          </section>

          <section className="legal-section">
            <h2>5. Propriedade Intelectual</h2>
            <p>
              A marca FitTrack, layout, logotipos, códigos de programação, arquitetura e bases de dados são de propriedade
              exclusiva do Controlador ou devidamente licenciados, protegidos pelas Leis nº 9.609/1998 (Software) e nº
              9.279/1996 (Propriedade Industrial). É vedada qualquer cópia, distribuição ou exploração comercial não autorizada.
            </p>
          </section>

          <section className="legal-section">
            <h2>6. Suspensão e Encerramento de Contas</h2>
            <p>
              O FitTrack reserva-se o direito de suspender ou desativar contas que violem estes Termos de Uso ou apresentem
              riscos à segurança de outros usuários.
            </p>
            <p>
              O usuário pode solicitar o encerramento e a exclusão da sua conta a qualquer momento diretamente pelo aplicativo
              (no menu Perfil &gt; Excluir Conta).
            </p>
          </section>

          <section className="legal-section">
            <h2>7. Atualização dos Termos e Foro</h2>
            <p>
              Estes termos poderão ser modificados a qualquer momento. Modificações relevantes serão comunicadas aos
              usuários e exigirão nova manifestação de concordância no próximo acesso.
            </p>
            <p>
              Estes termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o foro da comarca de
              domicílio do consumidor para dirimir eventuais controvérsias, conforme o Código de Defesa do Consumidor.
            </p>
          </section>

          <footer className="legal-footer">
            <div className="legal-footer-links">
              <Link to="/privacidade">Política de Privacidade</Link>
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
