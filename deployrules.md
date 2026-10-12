
# Deploying a Local Express API to a VPS/Hosting

Here's what typically needs to change when moving from `localhost` to production:

## 1. Port Configuration

**Local:** `app.listen(3000)`
**Production:** Use the port from the environment (hosting often assigns one).

```js
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`Listening on ${PORT}`));
```

- `0.0.0.0` is important on VPS so it's not just bound to loopback.
- Some hosts (Heroku, Render, Railway) inject `PORT` — never hardcode.

## 2. Environment Variables

Move secrets out of code into `.env` (local) / host dashboard or VPS env file.

```js
require('dotenv').config();
const DB_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
```

Add `.env` to `.gitignore`. On the VPS use `pm2` env, `systemd` `EnvironmentFile=`, or export in shell.

## 3. CORS

**Local:** often `origin: '*'` or no config.
**Production:** restrict to your real frontend domain(s).

```js
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

If your frontend is served from the same domain (via Nginx), you can drop CORS entirely.

## 4. Base URL / API Prefix

If frontend calls `http://localhost:3000/api/...`, change it to your domain:

```js
// frontend
const API = 'https://api.yourdomain.com';
```

Or better: use a relative path `/api` and let Nginx proxy it.

## 5. Database Connection

- Local: `mongodb://localhost:27017/db` or `mysql://root@localhost`
- Production: use a hosted/managed DB or a VPS-local DB with a proper user + password + auth.
- Add connection pooling, SSL if the provider requires it.
- Whitelist your VPS IP (Atlas, etc.).

## 6. HTTPS / Reverse Proxy

Express itself usually runs HTTP behind **Nginx** (or Caddy) which handles TLS.
Nginx example:

```nginx
server {
  listen 80;
  server_name api.yourdomain.com;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Then get a cert via `certbot` (Let's Encrypt).

If you use `trust proxy` in Express (for IPs, secure cookies):

```js
app.set('trust proxy', 1);
```

## 7. Security Hardening

- **Helmet:** `app.use(helmet())`
- **Rate limiting:** `express-rate-limit`
- **Body size limits:** `express.json({ limit: '10kb' })`
- **Cookies:** `secure: true, sameSite: 'none'` if cross-site over HTTPS
- Disable `x-powered-by`: `app.disable('x-powered-by')`

## 8. Logging

Replace `console.log` with a real logger (`pino`, `winston`) that writes to stdout/file. PM2/Docker/journald can capture it.

## 9. Process Management

Don't run `node index.js` in a bare terminal. Use:

- **PM2:** `pm2 start index.js --name api` + `pm2 startup` + `pm2 save`
- **systemd** service
- **Docker** container + restart policy

## 10. File Paths

Change any hardcoded paths:

```js
// bad
fs.readFile('C:\\Users\\me\\uploads\\x.png')
// good
const path = require('path');
fs.readFile(path.join(__dirname, 'uploads', 'x.png'))
```

## 11. Static Files / Uploads

Store uploads on the VPS in a persistent dir, or use S3/Cloudinary. Don't rely on ephemeral filesystems (Heroku, some PaaS).

## 12. Common Gotchas

- `localhost` in **frontend fetch** URLs — will fail for users.
- `localhost` in **webhook URLs** (Stripe, OAuth callbacks) — must be your public domain.
- OAuth redirect URIs registered with Google/GitHub — add the production callback.
- Cookies with `domain: 'localhost'` — must match real domain.
- Time zone / locale assumptions.

## Minimal Checklist

```
[ ] process.env.PORT + 0.0.0.0
[ ] .env with secrets (not committed)
[ ] CORS restricted to real domains
[ ] DB URL from env, remote-allowed
[ ] HTTPS via Nginx + certbot
[ ] trust proxy set
[ ] helmet + rate limit
[ ] PM2 / systemd / Docker
[ ] Frontend API base URL updated
[ ] Webhooks / OAuth callbacks updated
```
