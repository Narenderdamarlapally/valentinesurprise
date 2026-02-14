# Valentine App (Vite + React)

This is a minimal Vite + React starter.

Quick start:

```bash
npm install
npm run dev
```

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run preview` — locally preview production build

Server (send real email)

1. Copy `.env.example` to `.env` and fill SMTP credentials.
2. Install server deps (already included in root `package.json`):

```bash
npm install
```

3. Start the email server:

```bash
npm run server
```

4. The frontend will call `http://localhost:3000/api/send` by default.

Note: Do not commit your `.env` with real credentials.

EmailJS (no backend)

1. Sign up at https://www.emailjs.com and create a service, email template, and get your public user ID.
2. Copy `.env.example` to `.env` and set `VITE_EMAILJS_SERVICE`, `VITE_EMAILJS_TEMPLATE`, `VITE_EMAILJS_USER`.
3. Restart the frontend dev server so Vite picks up the environment variables.

Now the app will send mail directly from the browser via EmailJS (no server required).

EmailJS template example

Create a template in EmailJS with variables used by the app. Example template fields:

- `to_name` — recipient name
- `to_email` — recipient email (for your reference)
- `relation` — relation value
- `gender` — gender value
- `message` — the message body

Template HTML example:

```html
<h2>Happy Valentine, {{to_name}}!</h2>
<p>{{message}}</p>
<p>From: Someone special</p>
```

After creating the template, set `VITE_EMAILJS_SERVICE`, `VITE_EMAILJS_TEMPLATE`, and `VITE_EMAILJS_USER` in `.env` and restart the dev server.

Local test SMTP (no external SMTP required)

If you don't have SMTP credentials and you call the local server (`npm run server`), the server will automatically create a Nodemailer test account (Ethereal) and return a preview URL in the API response. Use that URL to view the rendered email in your browser — no real email will be sent.
