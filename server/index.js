require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/send', async (req, res) => {
  const { name, email, gender, relation } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'Missing name or email' });

  try {
    let transport;
    let usingTestAccount = false;

    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // No SMTP configured — create a test account so developer can preview the message
      const testAccount = await nodemailer.createTestAccount();
      usingTestAccount = true;
      transport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log('Using nodemailer test account:', testAccount.user);
    }

    const subject = `A Valentine surprise for ${name}`;
    const html = `
      <h2>Happy Valentine!</h2>
      <p>You have a surprise from someone who selected <strong>${relation}</strong>.</p>
      <p>Reply to this email to send your thanks.</p>
    `;

    const info = await transport.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER || 'no-reply@example.com',
      to: email,
      subject,
      html,
    });

    const result = { ok: true, info };
    if (usingTestAccount) {
      // nodemailer provides a preview URL for Ethereal
      result.preview = nodemailer.getTestMessageUrl(info) || null;
    }

    return res.json(result);
  } catch (err) {
    console.error('send error', err);
    return res.status(500).json({ error: 'Failed to send email', detail: err.message });
  }
});

app.listen(PORT, () => console.log(`Email server listening on http://localhost:${PORT}`));
