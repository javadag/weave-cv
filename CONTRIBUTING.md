# Contributing to Weave CV

Thank you for your interest in contributing to Weave CV! This guide will help you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Pull Requests](#pull-requests)
- [Commit Messages](#commit-messages)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold it.

## Getting Started

### Prerequisites

- **Node.js** 18 or higher ([download](https://nodejs.org/))
- **pnpm** package manager ([install](https://pnpm.io/installation))
- **Docker** (for local Supabase development) ([download](https://www.docker.com/products/docker-desktop/))
- **Git** ([download](https://git-scm.com/))

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/weave-cv.git
   cd weave-cv
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/javadag/weave-cv.git
   ```

## Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Supabase

Choose one of these options:

#### Option A: Local Development (Recommended)

1. Start local Supabase:
   ```bash
   supabase start
   ```
2. Copy the output credentials to `.env`:
   ```bash
   cp .env.example .env
   ```
3. Edit `.env` with the local credentials from step 1

#### Option B: Personal Cloud

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and API keys to `.env`

### 3. Start Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### 4. Environment Variables

Your `.env` file should contain:

```env
# Supabase
SUPABASE_PROJECT_REF=your-project-ref
NUXT_PUBLIC_SUPABASE_URL=your-project-url
NUXT_PUBLIC_SUPABASE_KEY=your-anon-key
NUXT_SUPABASE_SECRET_KEY=your-service-role-key

# AI (optional - for resume parsing features)
GROQ_API_KEY=your-groq-key
DEEPSEEK_API_KEY=your-deepseek-key
GOOGLE_FONTS_API_KEY=your-google-fonts-key

# Email (optional - for feedback feature)
NUXT_RESEND_API_KEY=your-resend-key
NUXT_FEEDBACK_TO_EMAIL=your-email
NUXT_FEEDBACK_FROM_EMAIL=noreply@yourdomain.com
```

## Coding Standards

### TypeScript

- Use TypeScript for all new files
- Avoid `any` type - use proper types
- Use interfaces for object shapes

### Vue

- Use Composition API with `<script setup>`
- Use Nuxt UI components when available
- Follow existing component patterns in the codebase

### CSS

- Use Tailwind CSS utility classes
- Use logical properties for RTL support (e.g., `margin-inline-start` instead of `margin-left`)
- Follow the orange/zinc theme

### Linting

Run the linter before committing:

```bash
pnpm lint
```

Fix any errors before submitting your PR.

### Type Checking

Run type checks:

```bash
pnpm typecheck
```

## Pull Requests

### Before Submitting

1. **Update your fork:**
   ```bash
   git fetch upstream
   git checkout master
   git merge upstream/master
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feat/your-feature-name
   ```

3. **Make your changes** following the coding standards

4. **Test your changes:**
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm build
   ```

5. **Commit with a clear message** (see [Commit Messages](#commit-messages))

6. **Push to your fork:**
   ```bash
   git push origin feat/your-feature-name
   ```

7. **Create a PR** on GitHub

### PR Guidelines

- **One feature per PR** — Keep PRs focused
- **Clear title** — Use a descriptive title
- **Describe changes** — Explain what you changed and why
- **Link issues** — Reference related issues with `Closes #123`
- **Screenshots** — Add screenshots for UI changes
- **Keep it small** — Large PRs are harder to review

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

- [ ] Tested locally
- [ ] Lint passes
- [ ] Type check passes
- [ ] Build succeeds

## Screenshots (if applicable)

Add screenshots here

## Related Issues

Closes #
```

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Code style changes (formatting, etc.)
- `refactor:` — Code refactoring
- `test:` — Adding tests
- `chore:` — Maintenance tasks

### Examples

```bash
git commit -m "feat(editor): add spell check support"
git commit -m "fix(pdf): resolve font embedding issue"
git commit -m "docs: update README with new screenshots"
```

## Reporting Bugs

1. Check [existing issues](https://github.com/javadag/weave-cv/issues) first
2. If not found, [create a new issue](https://github.com/javadag/weave-cv/issues/new?template=bug_report.md)
3. Include:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Browser/OS information

## Requesting Features

1. Check [existing issues](https://github.com/javadag/weave-cv/issues) first
2. [Create a feature request](https://github.com/javadag/weave-cv/issues/new?template=feature_request.md)
3. Include:
   - Clear description of the feature
   - Use case / why it's needed
   - Any mockups or examples

## Questions?

If you have questions, feel free to:
- Open a [discussion](https://github.com/javadag/weave-cv/discussions)
- Ask in an issue

Thank you for contributing! 🎉
