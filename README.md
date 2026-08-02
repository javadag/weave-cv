<div align="center">

# Weave CV

**Free, browser-based resume builder for job seekers**

[![CI](https://github.com/JavadAg/weave-cv/actions/workflows/ci.yml/badge.svg)](https://github.com/JavadAg/weave-cv/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/JavadAg/weave-cv)](https://github.com/JavadAg/weave-cv/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT%20%2B%20Commons%20Clause-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)

[Website](https://weavecv.app) • [Report Bug](https://github.com/javadag/weave-cv/issues) • [Request Feature](https://github.com/javadag/weave-cv/issues)

</div>

---

## ✨ Features

- 🎨 **Professional Templates** — ATS-friendly designs that look like a designer made them
- ✏️ **Rich Text Editor** — Tiptap-based editor with full formatting options
- 📄 **PDF Export** — Pixel-perfect PDF generation with embedded fonts
- 🔄 **Auto-Save** — Cloud sync across devices with Supabase
- 🌐 **Multi-Language** — English and Persian (RTL) support
- 🎯 **Drag & Drop** — Reorder sections and content easily
- 🤖 **AI Integration** — Resume parsing
- 📱 **Responsive** — Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18 or higher
- pnpm package manager
- Docker (for local Supabase development)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/javadag/weave-cv.git
   cd weave-cv
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your Supabase credentials (see [Supabase Setup](#supabase-setup) below).

4. **Start development server**

   ```bash
   pnpm dev
   ```

   Visit [http://localhost:3000](http://localhost:3000)

## 📚 Documentation

- [PDF Generation](docs/pdf-generation.md) — Puppeteer/Chromium setup for Windows, macOS, Linux, and Vercel
- [Supabase Setup](docs/supabase.md) — local & cloud setup, environment variables, and RLS notes

## 🗄️ Supabase Setup

The full database schema lives in `supabase/migrations/`. The Supabase CLI applies these migrations automatically when you run `supabase start` (local) or `supabase db push` (cloud).

For deeper setup details (including Row Level Security), see [docs/supabase.md](docs/supabase.md).

### Option A: Local Development (Recommended)

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
2. Install Supabase CLI:
   ```bash
   npm i -g supabase
   ```
3. Start local Supabase (applies migrations automatically):
   ```bash
   supabase start
   ```
4. Copy the credentials from the output to your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Fill in `NUXT_PUBLIC_SUPABASE_URL`, `NUXT_PUBLIC_SUPABASE_KEY`, and `NUXT_SUPABASE_SECRET_KEY` from the CLI output.

### Option B: Personal Cloud

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Link the CLI and push the schema:
   ```bash
   supabase link --project-ref <your-project-ref>
   supabase db push
   ```
4. Copy your project URL and API keys to `.env`

## 🛠️ Tech Stack

- **Framework:** [Nuxt.js 4](https://nuxt.com/) with Vue 3
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with [Nuxt UI v4](https://ui.nuxt.com/)
- **Backend:** [Supabase](https://supabase.com/) (Auth, Database, Storage)
- **Editor:** [Tiptap](https://tiptap.dev/) rich text editor
- **PDF Generation:** [Puppeteer](https://pptr.dev/) with Chromium — see [docs/pdf-generation.md](docs/pdf-generation.md)
- **Deployment:** [Vercel](https://vercel.com/)

## 📝 Available Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `pnpm dev`       | Start development server |
| `pnpm build`     | Build for production     |
| `pnpm preview`   | Preview production build |
| `pnpm lint`      | Run ESLint               |
| `pnpm typecheck` | Run TypeScript checks    |
| `pnpm generate`  | Generate static site     |

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](CONTRIBUTING.md) first.

- 🐛 [Report Bugs](https://github.com/javadag/weave-cv/issues)
- 💡 [Request Features](https://github.com/javadag/weave-cv/issues)
- 🔀 [Submit PRs](CONTRIBUTING.md#pull-requests)

## 📄 License

This project is licensed under the MIT License with Commons Clause - see the [LICENSE](LICENSE) and [LICENSE-COMMONS-CLAUSE](LICENSE-COMMONS-CLAUSE) files for details.

**TL;DR:** You can use, modify, and distribute this software for free, but you cannot sell it as a standalone product or service.
