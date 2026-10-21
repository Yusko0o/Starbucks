# Starbucks — Your Coffee. Your Moment.

An independent portfolio project created for **Kilian Berardino**. A French-language e-commerce experience inspired by Starbucks, featuring a responsive interface, drink customization, a shopping cart, registration, login, simulated orders, and a demo loyalty program.

**Not affiliated with Starbucks. No real payments. Prices, cafés, opening hours, and rewards are fictional.**

## Get Started with One Command

Requirement: **Node.js 24 or later**. No npm packages to download and no API keys required.

From the extracted project directory:

```bash
node server/index.mjs
```

Open **http://127.0.0.1:3000** in your browser. You can also use `npm start`. Do not open `public/index.html` directly: the interface relies on the server API.

```bash
npm run dev   # Restart the server automatically when files change
npm test      # Run API and database tests
```

On Windows, if PowerShell blocks `npm.ps1`, use `npm.cmd start` / `npm.cmd test`, or run Node directly:

```powershell
node --watch server/index.mjs
node --test tests/api.test.mjs
```

## Features

- Homepage with an autumn campaign, featured products, loyalty program, and editorial section.
- Ten-product catalog with search and six category filters.
- Customization: Tall, Grande, Venti, four milk options, an extra espresso shot, and quantity.
- Persistent browser cart with quantity updates and item removal.
- Three fictional cafés, pickup location selection, and an illustrative map.
- Registration, login, and logout using an HttpOnly session cookie.
- Persistent SQLite orders, personal order history, and Stars calculated from orders.
- Server-side price calculations in cents: the browser cannot override product prices.
- Coffee story, project information, and privacy pages.
- Keyboard navigation, visible focus indicators, focus-managed dialogs, and reduced-motion support.

## Try the Complete Flow

1. Open the menu and customize a product.
2. Add it to your cart and select a fictional café.
3. Click “Se connecter pour commander” (“Sign in to order”), then create a test account using a test email address and a dedicated password of at least ten characters.
4. Confirm your demo order.
5. View your order history and Stars balance in your account.

No accounts are preloaded, and no shared demo passwords are provided. Data is created as you use the application.

## Project Structure

| File | Purpose |
| --- | --- |
| `public/index.html` | Accessible entry point and metadata |
| `public/app.js` | Navigation, page rendering, cart management, and API calls |
| `public/components.js` | Icons, SVG illustrations, and presentation helpers |
| `public/style.css` | Responsive styling, dialogs, cart, and interactive states |
| `server/index.mjs` | Node.js HTTP server, static files, and response headers |
| `server/api.mjs` | Authentication and business logic |
| `server/catalog.mjs` | Product catalog, prices, and fictional cafés |
| `server/database.mjs` | Adapter for Node.js’s built-in SQLite module |
| `server/schema.sql` | Database tables and indexes |
| `tests/api.test.mjs` | Business logic, security, and persistence tests |

Data is stored in `data/coffee.sqlite`, which is created automatically. This directory is excluded from Git and the delivered archive. Stop the server before backing up or deleting the database.

## API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service health |
| GET | `/api/catalog` | Products, customization options, and cafés |
| POST | `/api/auth/register` | Registration: name, email, password |
| POST | `/api/auth/login` | Login: email, password |
| POST | `/api/auth/logout` | Logout |
| GET | `/api/me` | Profile and Stars, or `user: null` |
| GET | `/api/orders` | Current user’s order history |
| POST | `/api/orders` | Create a simulated order |

Example order request body:

```json
{
  "store": "centre",
  "items": [
    {
      "id": "pumpkin",
      "size": "Grande",
      "milk": "Avoine",
      "extra": true,
      "quantity": 1
    }
  ]
}
```

API values such as `"Avoine"` remain in French to match the application’s catalog.

## Technical Choices and Security

- Vanilla JavaScript organized into ES modules: no dependencies to download.
- Node.js HTTP server and built-in SQLite with parameterized queries.
- PBKDF2-SHA-256 password hashing with a random salt and 100,000 iterations; passwords are never stored in plain text.
- Random session tokens stored as hashes in the database, with a seven-day lifetime. Cookies use HttpOnly, SameSite=Lax, and Secure when the origin is HTTPS.
- Origin checks for write requests, authentication rate limiting, and validation of customization options and quantities.
- Order history restricted to the authenticated user, escaped user content, a Content Security Policy, and the `nosniff` header.

This is a demonstration project, not a commercial platform. It does not include payments, inventory management, email delivery, email verification, or password recovery. The Stars program does not provide actual rewards. A commercial launch would require additional work, including a security review, a data retention policy, and account management features.

## Node.js Hosting

Use a hosting environment that supports Node.js 24+ and persistent storage. Keep the `data/` directory on that persistent storage. Static-only hosting cannot run this API. This SQLite project is designed for a single Node.js instance.

Available environment variables:

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Listening port |
| `HOST` | `127.0.0.1` | Set to `0.0.0.0` when required by your hosting provider |
| `DATABASE_PATH` | `data/coffee.sqlite` | Persistent SQLite database location |
| `PUBLIC_ORIGIN` | Local HTTP origin | Exact HTTPS origin when running behind a reverse proxy |

Set `PUBLIC_ORIGIN=https://your-domain.example` behind an HTTPS proxy to enable Secure cookies and correct origin checks. Do not expose the server directly to the Internet without HTTPS.

## Credits and Visual Assets

Design and code created for Kilian Berardino’s portfolio. Starbucks trademarks remain the property of their respective owners. Campaign photographs are loaded from the following public sources; they require an Internet connection and may change:

- https://www.starbucks.com/ — Autumn campaign and “Free refills” photography.
- https://cloudassets.starbucks.com/ — Image delivery domain.

Product illustrations are embedded SVGs created for this project and are not official product photographs. A visual fallback is provided if the large photographs fail to load. System fonts work offline.

## Verification

Run the automated tests with:

```bash
node --test tests/api.test.mjs
```

Tests cover authentication, server-side price calculations, account isolation, invalid input rejection, origin checks, rate limiting, HTTPS cookies, and persistence after reopening the SQLite database.

The development environment blocked local browser network connections and remote deployment. The server starts successfully, and the API logic was tested directly using real Request/Response objects and SQLite. Visual verification in a browser still needs to be performed on your machine.
