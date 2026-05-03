// api/test-email.js — 一時的なメール送信テスト用エンドポイント（確認後削除）
require('dotenv').config();
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const result = {
    env: {
      GMAIL_USER: process.env.GMAIL_USER || '未設定',
      GMAIL_PASSWORD: process.env.GMAIL_PASSWORD ? `設定済み(${process.env.GMAIL_PASSWORD.length}文字)` : '未設定',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL || '未設定',
    },
    verify: null,
    send: null,
    error: null,
  };

  try {
    await transporter.verify();
    result.verify = 'OK — SMTP接続成功';
  } catch (err) {
    result.verify = 'FAILED';
    result.error = { message: err.message, code: err.code, response: err.response };
    return res.status(200).json(result);
  }

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '[テスト] Vercelメール送信テスト',
      text: 'このメールはVercelからのテスト送信です。',
    });
    result.send = 'OK — メール送信成功';
  } catch (err) {
    result.send = 'FAILED';
    result.error = { message: err.message, code: err.code, response: err.response };
  }

  res.status(200).json(result);
};
