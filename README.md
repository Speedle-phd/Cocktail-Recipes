# Cocktail Recipes

A React and TypeScript app built with Vite.

## Getting started

```sh
npm install
npm start
```

Vite serves the app at [http://localhost:5173](http://localhost:5173).

## Features and cocktail data

- Switch between light and dark mode in the navigation. The choice is saved
  locally; the initial theme follows the device preference.
- Shuffle the home-page pick, search as you type by cocktail name, and save
  favorites in the browser.
- Recipes come from [TheCocktailDB's V1 API](https://www.thecocktaildb.com/api.php).
  The app uses the API's development/educational test key `1`. TheCocktailDB
  requires a production key for public app-store releases.

## Docker development

```sh
docker compose --profile dev up --build dev
```

Open [http://localhost:5173](http://localhost:5173). The project directory is
mounted into the container, so edits on your computer are reflected by Vite.
Dependencies are installed in a separate Docker volume, not in the host's
`node_modules`. The container runs `npm ci` on startup; restart it after changing
`package.json` or `package-lock.json`.

If port 5173 is already in use, set `DEV_PORT` before starting Compose and use
that port in the browser. You can copy `.env.example` to `.env` and set
`DEV_PORT` there, or set it in PowerShell:

```powershell
$env:DEV_PORT = "5174"
docker compose --profile dev up --build dev
```

Stop the development container with `Ctrl+C` or
`docker compose --profile dev down`.

## Docker production

```sh
docker compose up -d --build
```

The production image serves the built app with Nginx. It listens on `PORT`,
which defaults to `8080`. Copy `.env.example` to `.env` and set `PORT` to
change both the host and container ports. After pulling updates, rebuild and
recreate the production container with:

```sh
git pull
docker compose up -d --build
```

Client-side routes fall back to `index.html`. The production image contains
only the static build and web server; source files are not mounted. Stop it
with `docker compose down`.

## Scripts

- `npm start` or `npm run dev`: start the development server.
- `npm run build`: type-check and create a production build in `dist/`.
- `npm run preview`: serve the production build locally.
- `npm test`: run tests with Vitest.
