// lib/db.js - MongoDB接続管理とスキーマ定義
const mongoose = require('mongoose');

let isConnected = false;

/**
 * MongoDBに接続
 */
async function connectDB() {
  if (isConnected) {
    console.log('Already connected to MongoDB');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('✓ Connected to MongoDB');
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    throw error;
  }
}

/**
 * MongoDBから切断
 */
async function disconnectDB() {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('Disconnected from MongoDB');
  }
}

// =====================================
// Contact スキーマ定義
// =====================================

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
    description: 'お問い合わせ者の名前',
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    match: /.+\@.+\..+/,
    description: 'お問い合わせ者のメールアドレス',
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20,
    description: '電話番号（オプション）',
  },
  message: {
    type: String,
    required: true,
    maxlength: 5000,
    description: 'お問い合わせ内容',
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new',
    description: 'お問い合わせステータス',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    description: '作成日時',
  },
});

// インデックスを設定（メール検索の高速化）
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });

const Contact = mongoose.model('Contact', contactSchema);

// =====================================
// エクスポート
// =====================================

module.exports = {
  connectDB,
  disconnectDB,
  Contact,
};
