# 🚀 Kit Skills - Next.js, n8n & Gov-Tech

O seu pilar fundamental para iniciar qualquer projeto Web de alto nível, com foco em performance, segurança e conformidade governamental.

[![CI](https://github.com/joabeoliveira/kit-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/joabeoliveira/kit-skills/actions)
[![Dependabot Status](https://img.shields.io/badge/dependabot-enabled-brightgreen)](https://github.com/joabeoliveira/kit-skills/network/updates)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌟 O que é o Kit Skills?

Este repositório oferece um kit de ferramentas (boilerplate e patterns) e um conjunto de "skills" para acelerar a construção de aplicações Web modernas, com foco em:

- Conformidade com requisitos da Administração Pública e segurança (LGPD).
- Acessibilidade (e-MAG / WCAG).
- Integração com fluxos de automação (n8n) e agentes de IA.
- Performance, testes e boas práticas de engenharia.

## 🔧 Novas funcionalidades adicionadas
Nesta iteração foram adicionadas e configuradas as seguintes funcionalidades para melhorar a qualidade, colaboração e segurança do projeto:

- CI (GitHub Actions): validação automática em pushes/PRs — instala dependências, roda lint, checagem de tipos, testes e build.
- ESLint + Prettier: regras e formatação automáticas para manter estilo e qualidade do código.
- TypeScript (tsconfig.json) com `strict: true`: validações de tipo mais rígidas para reduzir bugs em tempo de execução.
- Husky + lint-staged: hooks Git que executam lint/format apenas nos arquivos staged antes do commit.
- CONTRIBUTING.md: diretrizes para contribuir com o projeto.
- Templates e governança: arquivos adicionados/planejados (ISSUE/PULL REQUEST templates, CODE_OF_CONDUCT.md, SECURITY.md, CODEOWNERS).
- Dependabot: configuração para atualização automática de dependências (ver .github/dependabot.yml quando disponível).

## 📦 Quick start (local)

1. Instale dependências:

   npm install

2. Execute os checks locais (os mesmos do CI):

   npm run lint
   npm run typecheck
   npm run test

3. Prepare Husky após instalar devDependencies (apenas da primeira vez):

   npm run prepare

4. Commit e push seguem os hooks configurados (lint-staged via Husky).

## 📁 Estrutura do repositório (resumida)

```
.
├── .github/                # Workflows, templates e automações (CI, dependabot, code scanning)
├── .skills/                # Conjunto de skills e regras (domínio do kit)
├── starter-nextjs/         # Exemplo / starter (Docker + exemplo de app)
├── tsconfig.json           # Configuração TypeScript (strict)
├── .eslintrc.json          # Regras de ESLint
├── .eslintignore
├── package.json            # Scripts: lint, typecheck, test, format, ci
└── CONTRIBUTING.md
```

<<<<<<< HEAD
## 🛠️ Como Instalar no seu Projeto

Você pode adicionar o **Kit Skills** em segundos a qualquer projeto novo ou existente usando `npx`:

```bash
# Navegue até a pasta do seu projeto e execute:
npx github:joabeoliveira/kit-skills
```

Isso copiará os arquivos `.cursorrules` e a pasta `.skills/` diretamente para a raiz do seu projeto.

### Outras formas:
- **Template Completo**: `npx degit joabeoliveira/kit-skills meu-projeto`
- **Manual**: Clone este repositório e copie os arquivos desejados.

## 🤝 Contribuições

Este Kit é vivo! Se você encontrar uma nova jurisprudência do TCU, uma norma da AGU ou uma melhoria de performance, sinta-se à vontade para abrir um Pull Request.
=======
## 📣 Como contribuir
- Leia o CONTRIBUTING.md e siga as convenções de branch/commit.
- Abra issues bem descritas (use os templates de bug/feature disponíveis).
- Para dúvidas, use a seção de issues ou crie um PR com sua proposta.

## ℹ️ Recursos e links úteis
- Actions: https://github.com/joabeoliveira/kit-skills/actions
- Licença: MIT
>>>>>>> a768cc9ab69dfc2d6c75ff3f6e97f3a72723f9b2

---

Criado por **Joabe Oliveira**.