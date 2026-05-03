// api/contact.js
require('dotenv').config();
const { connectDB, Contact } = require('../lib/db');
const { sendConfirmationEmail, sendAdminNotification } = require('../lib/email');
const { validateContactForm } = require('../lib/validation');

module.exports = async (req, res) => {
  // CORS ヘッダ設定
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS リクエスト処理
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // POST メソッドのみ受け付け
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    // データベース接続
    await connectDB();

    // フォームデータを取得
    const { name, email, phone, message } = req.body;

    // 検証
    const validation = validateContactForm({ name, email, phone, message });
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        errors: validation.errors,
      });
      return;
    }

    // 新規 Contact ドキュメント作成
    const contact = new Contact({
      name,
      email,
      phone: phone || '',
      message,
      status: 'new',
      createdAt: new Date(),
    });

    // DB に保存
    await contact.save();
    console.log(`✓ Contact saved: ${contact._id}`);

    // メール送信（完了を待ってからレスポンスを返す）
    try {
      await Promise.all([
        sendConfirmationEmail(contact),
        sendAdminNotification(contact),
      ]);
      console.log('✓ Emails sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError.message);
    }

    // クライアントに成功レスポンスを返す
    res.status(200).json({
      success: true,
      message: 'お問い合わせを受け付けました。',
      contactId: contact._id,
    });
  } catch (error) {
    console.error('✗ API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'サーバーエラーが発生しました。もう一度お試しください。',
    });
  }
};
