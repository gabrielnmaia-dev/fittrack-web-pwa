# Governança de Privacidade, Cookies e Termos de Uso (FitTrack)

> Documento técnico e guia de conformidade à **Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018)**, ao **Marco Civil da Internet (Lei nº 12.965/2014)** e às orientações da **ANPD**.

---

## 1. Visão Geral e Arquitetura

O ecossistema **FitTrack** é composto por uma API REST em **Django 6 (Python 3.12)** com persistência em **PostgreSQL 17** e uma aplicação cliente **PWA (Progressive Web App)** em **React 19 + TypeScript + Vite**.

```
[ Usuário / Dispositivo PWA ]
       │
       ├─► localStorage (tokens JWT de sessão, tema visual, estado de treino offline)
       ├─► Service Worker / CacheStorage (assets para funcionamento offline)
       │
       ▼ (HTTPS / Authorization: Bearer <access_token>)
[ API Backend Django ]
       │
       ├─► users_user & users_userprofile (dados cadastrais e biométricos de saúde)
       ├─► workouts & diet (rotinas de treino e nutrição criadas pelo titular)
       ├─► privacy_termsofuse (versionamento semântico dos termos e políticas)
       ├─► privacy_usertermsacceptance (prova auditável de aceite: IP, User-Agent, UTC)
       ├─► privacy_cookieconsent (registro de preferências de armazenamento)
       └─► privacy_datasubjectrequest (protocolo formal de direitos do titular - Art. 18)
```

---

## 2. Inventário de Dados Pessoais e Bases Legais

| Categoria | Dados Coletados | Classificação | Finalidade | Base Legal (LGPD) |
| :--- | :--- | :--- | :--- | :--- |
| **Cadastral** | `username`, `email`, `first_name`, `last_name`, senha (hash criptográfico PBKDF2) | Dados pessoais comuns | Identificação, autenticação segura, recuperação de conta e comunicação. | **Execução de Contrato** (Art. 7º, V) |
| **Físico / Saúde** | `age`, `height`, `weight`, `goal`, treinos executados, cargas, refeições e metas calóricas | **Dados pessoais sensíveis** (Art. 5º, II) | Cálculo de IMC, personalização de treinos, cálculo de balanço energético diário. | **Consentimento Inequívoco e Tutela com Salvaguardas** (Art. 11, II) |
| **Conexão** | Endereço IP, data/hora UTC de acessos, User-Agent | Dados de telemetria e segurança | Cumprimento obrigatório de dever de guarda de registros e segurança da rede. | **Cumprimento de Obrigação Legal** (Art. 7º, II c/c Art. 15 da Lei 12.965/2014) |
| **Preferências** | Tema visual (`light`, `dark`, `system`) | Dados funcionais | Customização da experiência visual do usuário no dispositivo. | **Legítimo Interesse / Consentimento** (Art. 7º, IX e I) |

---

## 3. Tecnologias de Armazenamento Local e Cookies

A plataforma **NÃO utiliza cookies de rastreamento de terceiros** (nem Google Analytics, nem Meta Pixel, nem redes de anúncios).

Todas as tecnologias de armazenamento são mapeadas e documentadas:

1. **`fittrack:refresh`** (`localStorage`): Token JWT de longa duração para renovação automática de sessão sem trafegar a senha continuamente. *(Estritamente Necessário)*
2. **`fittrack:user`** (`localStorage`): Cache serializado dos dados de perfil do usuário para renderização instantânea da interface no PWA. *(Estritamente Necessário)*
3. **`fittrack:workout-session:<planId>`** (`localStorage`): Estado volátil do treino em andamento (exercícios já marcados como concluídos e anotações de carga). *(Estritamente Necessário / Funcional)*
4. **`fittrack:cookie-consent`** (`localStorage`): Registro da escolha do titular no banner de consentimento, válido por 12 meses. *(Estritamente Necessário)*
5. **`fittrack:theme`** (`localStorage`): Preferência de cor da interface do usuário. *(Preferências - Opcional)*
6. **`sw.js`** (`CacheStorage`): Cache offline de código e recursos do Progressive Web App. *(Estritamente Necessário)*
7. **`sessionid` / `csrftoken`** (Cookies HTTP): Exclusivos do painel administrativo Django (`/admin/`). *(Estritamente Necessário)*

---

## 4. Endpoints da API de Privacidade (`/api/v1/privacy/`)

### 4.1 Termos de Uso
- **`GET /api/v1/privacy/terms/current/`** (Público): Retorna a versão ativa dos Termos de Uso e Política de Privacidade.
- **`GET /api/v1/privacy/terms/my-acceptance/`** (Autenticado): Informa se o usuário autenticado já aceitou a versão vigente dos termos ou se necessita anuir (`needs_acceptance: true`).
- **`POST /api/v1/privacy/terms/accept/`** (Autenticado): Registra formalmente o aceite de uma versão específica, capturando endereço IP e User-Agent.

### 4.2 Consentimento de Cookies e Armazenamento
- **`GET /api/v1/privacy/cookie-consent/`** (Público/Autenticado): Retorna as preferências salvas (por usuário ou por `?session_id=`).
- **`POST /api/v1/privacy/cookie-consent/`** (Público/Autenticado): Persiste escolhas de consentimento (`preferences`, `analytics`, `marketing`).

### 4.3 Direitos do Titular (Art. 18 da LGPD)
- **`GET /api/v1/privacy/export-data/`** (Autenticado): Gera exportação completa de todos os dados do titular em formato JSON aberto (portabilidade), registrando o protocolo no DSR.
- **`POST /api/v1/privacy/delete-account/`** (Autenticado): Solicita a exclusão e encerramento da conta. Executa a desativação (`is_active = False`) e anonimiza os dados pessoais (nome, e-mail e métricas corporais sensíveis), mantendo os logs de conexão pelo prazo legal estrito de 6 meses (Marco Civil).
- **`GET /api/v1/privacy/data-requests/`** (Autenticado): Lista as solicitações formais registradas pelo titular.
- **`POST /api/v1/privacy/data-requests/`** (Autenticado): Registra nova solicitação formal (`access`, `export`, `rectification`, `deletion`, `information`, `revocation`).

---

## 5. Instruções para Configuração Institucional (Placeholders)

Os textos legais das páginas públicas (`/termos`, `/privacidade`, `/cookies`) foram redigidos com placeholders institucionais padronizados. Quando os dados cadastrais da empresa operadora estiverem formalizados, substitua nos arquivos:

- **Frontend:**
  - `src/pages/PrivacyPolicyPage.tsx`
  - `src/pages/TermsPage.tsx`
  - `src/pages/CookiePolicyPage.tsx`

### Campos a preencher:
- `[Razão Social da Empresa Controladora]` (ex: *FitTrack Tecnologia e Saúde Ltda.*)
- `[00.000.000/0000-00]` (CNPJ da empresa)
- `[Endereço Completo, Cidade - UF, CEP 00000-000]` (Endereço da sede social)
- `dpo@fittrack.com.br` (E-mail operacional do Encarregado pelo Tratamento de Dados)

---

## 6. Pontos que Exigem Validação Jurídica Profissional

1. **Aviso Legal de Limitação de Responsabilidade Médica:** A cláusula de advertência nos Termos de Uso esclarece que o FitTrack não substitui profissionais habilitados (médicos, nutricionistas e educadores físicos). Recomenda-se homologação por assessoria jurídica especializada em Direito da Saúde e Direito Digital.
2. **Definição de Política de Descarte Periódico:** Implementar rotina de expurgo automatizado em banco de dados para anonimizar contas inativas por mais de X anos (conforme política interna de retenção da empresa).
3. **Contratos com Provedores de Nuvem (DPA):** Garantir que o contrato de hospedagem (AWS/GCP/DigitalOcean/Hetzner) possua aditivo de tratamento de dados (Data Processing Agreement) em consonância com a LGPD.
