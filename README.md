<div align="center">
<p align="center">
  <img src="https://amaranth-blonde-amphibian-820.mypinata.cloud/ipfs/bafkreiaayyuskch5kc32giefkejkloujryeopemajdbums2nst4y7xfkzu" alt="Encoteki Banner" width="10%" />
</p>

  <h1 align="center">Encoteki FE Main</h1>

  <p align="center">
    Encoteki main web application built with <strong>Next.js</strong>, <strong>TypeScript</strong>, and <strong>Tailwind CSS</strong>.
  </p>
</div>

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Package Manager:** Yarn
- **Bundler:** Turbopack (Dev)
- **Linting & Formatting:** ESLint & Prettier

---

## Prerequisites

- **Node.js v22+** — use `nvm use` if you have [nvm](https://github.com/nvm-sh/nvm) installed (`.nvmrc` is committed)
- **Yarn** — install via `npm install -g yarn` if not present

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/encoteki/fe-main.git
cd fe-main
yarn install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in the values. See `.env.example` for descriptions of each variable. Required keys:

| Variable                               | Description                                |
| -------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | Your Supabase project URL                  |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key            |
| `SUPABASE_DOMAIN`                      | Supabase hostname (for CSP + `next/image`) |
| `LIVE_DOMAIN`                          | Canonical site URL (used in metadata)      |
| `NEXT_PUBLIC_APP_MINT`                 | External mint app URL                      |
| `NEXT_PUBLIC_APP_DAO`                  | External DAO app URL                       |

### 3. Run in development

```bash
yarn dev
```

Opens at [http://localhost:3000](http://localhost:3000) with Turbopack HMR.

---

## Commands

| Command           | Description                                                 |
| ----------------- | ----------------------------------------------------------- |
| `yarn dev`        | Start development server (Turbopack)                        |
| `yarn build`      | Production build                                            |
| `yarn start`      | Serve the production build                                  |
| `yarn lint`       | ESLint check (read-only)                                    |
| `yarn prettier`   | Prettier format check (read-only)                           |
| `yarn typecheck`  | TypeScript check (read-only, used in CI)                    |
| `yarn type-check` | Full fix pass — `tsc` + `eslint --fix` + `prettier --write` |
| `yarn analyze`    | Bundle size visualiser (opens in browser)                   |

---

## CI

Every push to `main`/`dev` and every pull request runs **lint → format check → typecheck → build** via GitHub Actions. PRs that fail any step are blocked from merging.

---

## License

This project is licensed under the [MIT License](https://choosealicense.com/licenses/mit/).

---

<p align="center">
  <sub>© 2025 Encoteki. All Rights Reserved.</sub><br/>
  <sub>Built with ❤️ for the environment and community.</sub>
</p>
