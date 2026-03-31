# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## License Validation

Pebbles now validates CMS licenses against an external validator endpoint instead of reading local license tables directly.

- Set `NUXT_LICENSE_VALIDATION_URL` to the OC-Workspace or License Admin base URL.
- If `NUXT_LICENSE_VALIDATION_URL` is empty, Pebbles falls back to `NUXT_OCS_URL`.
- The remote service must expose `POST /api/validate`.

Example:

```bash
NUXT_LICENSE_VALIDATION_URL="https://oc-workspace.example.com"
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
