# 🌐 WordQuest BFF

Back-end for Front-end (BFF) da aplicação **WordQuest** — uma plataforma gamificada de estudo de vocabulário em inglês. Este serviço utiliza a IA generativa **Google Gemini** para gerar palavras, descrições e exemplos de uso de forma dinâmica.

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Utilizada](#stack-utilizada)
- [Pré-requisitos](#pré-requisitos)
- [Como Executar Localmente](#como-executar-localmente)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Endpoints da API](#endpoints-da-api)
- [Deploy](#deploy)
- [Integrantes](#integrantes)

## 🎯 Sobre o Projeto

Este BFF foi criado como componente do projeto **WordQuest** para a disciplina de **Front-end Engineering** da FIAP. Ele expõe uma API REST que recebe parâmetros de tema, dificuldade e quantidade, e retorna palavras em inglês geradas pela IA do Google Gemini, com descrições em português, exemplos de uso em inglês e alternativas para quizzes de múltipla escolha.

## 🛠️ Stack Utilizada

| Tecnologia | Versão | Propósito |
|---|---|---|
| **Node.js** | 20+ | Runtime JavaScript |
| **Fastify** | 5.x | Framework HTTP performático |
| **TypeScript** | 5.x | Tipagem estática |
| **@google/generative-ai** | latest | SDK do Google Gemini |
| **Zod** | 3.x | Validação de requisições |
| **@fastify/cors** | — | Controle de CORS |
| **@fastify/helmet** | — | Headers de segurança |
| **@fastify/rate-limit** | — | Limitação de requisições (30/min) |

## 📦 Pré-requisitos

- **Node.js** v20 ou superior
- **npm** v9 ou superior
- Uma **API Key do Google Gemini** (obter em: https://aistudio.google.com/apikey)

## 🚀 Como Executar Localmente

1. Clone o repositório:
```bash
git clone https://github.com/SEU-USUARIO/wordquest-bff.git
cd wordquest-bff
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```
Edite o arquivo `.env` e insira sua chave da API do Gemini.

4. Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3001`.

5. Teste o health check:
```bash
curl http://localhost:3001/health
```

## 🔐 Variáveis de Ambiente

| Variável | Obrigatória | Descrição | Padrão |
|---|---|---|---|
| `GEMINI_API_KEY` | ✅ | Chave da API do Google Gemini | — |
| `PORT` | ❌ | Porta do servidor | `3001` |
| `CORS_ORIGIN` | ❌ | Origem permitida para CORS | `http://localhost:3000` |

## 📡 Endpoints da API

### `GET /health`

Verifica se o servidor está funcionando.

**Resposta:**
```json
{ "status": "ok" }
```

### `POST /ask`

Gera palavras de vocabulário em inglês usando IA generativa.

**Body (JSON):**
```json
{
  "theme": "technology",
  "difficulty": "medium",
  "count": 10
}
```

| Campo | Tipo | Valores Aceitos | Padrão |
|---|---|---|---|
| `theme` | string | `travel`, `business`, `technology`, `food`, `sports`, `daily`, `entertainment`, `health` | — (obrigatório) |
| `difficulty` | string | `easy`, `medium`, `hard` | — (obrigatório) |
| `count` | number | 1 a 20 | `10` |

**Resposta (200):**
```json
[
  {
    "word": "Database",
    "description": "Um sistema organizado para armazenar e acessar dados eletronicamente.",
    "useCase": "Our company migrated to a new cloud database last month.",
    "alternatives": ["Network", "Software", "Hardware"]
  }
]
```

**Erros:**
- `400` — Parâmetros inválidos (validação Zod)
- `502` — Falha na comunicação com a IA

## ☁️ Deploy

O projeto está configurado para deploy no **Render** (free tier).

### Deploy no Render

1. Crie uma conta em [render.com](https://render.com)
2. Crie um novo **Web Service** conectado ao seu repositório
3. O arquivo `render.yaml` já contém toda a configuração necessária
4. Adicione a variável de ambiente `GEMINI_API_KEY` nas configurações
5. O deploy será automático a cada push na branch `main`

> ⚠️ **Nota:** No plano gratuito do Render, o servidor entra em hibernação após inatividade. A primeira requisição pode levar ~30 segundos.

### Build manual

```bash
npm run build    # Compila TypeScript para dist/
npm start        # Inicia o servidor de produção
```

## 👥 Integrantes

| Nome | RM |
|---|---|
| Alfredo Henrique de Almeida Ribeiro | RM364203 |
| Igor Macedo dos Anjos | RM363391 |
| Thiago Reimberg dos Santos | RM363345 |

---

Desenvolvido para a disciplina de **Front-end Engineering** — FIAP 2026.
