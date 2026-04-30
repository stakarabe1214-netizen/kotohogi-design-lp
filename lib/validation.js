// lib/validation.js

function validateContactForm(data) {
  const errors = {};

  // 名前検証
  if (!data.name || data.name.trim() === '') {
    errors.name = '名前を入力してください';
  } else if (data.name.length > 100) {
    errors.name = '名前は100文字以内で入力してください';
  }

  // メール検証
  if (!data.email || data.email.trim() === '') {
    errors.email = 'メールアドレスを入力してください';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }

  // 電話番号検証（オプション）
  if (data.phone && !/^\d{10,20}$|^\d{3}-\d{3,4}-\d{4}$/.test(data.phone.replace(/[-\s]/g, ''))) {
    errors.phone = '有効な電話番号を入力してください';
  }

  // メッセージ検証
  if (!data.message || data.message.trim() === '') {
    errors.message = 'メッセージを入力してください';
  } else if (data.message.length > 5000) {
    errors.message = 'メッセージは5000文字以内で入力してください';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = { validateContactForm };
