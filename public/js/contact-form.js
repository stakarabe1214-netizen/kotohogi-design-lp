// public/js/contact-form.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const submitBtn = document.getElementById('submitBtn');
  const successMessage = document.getElementById('successMessage');
  const errorMessage = document.getElementById('errorMessage');
  const charCount = document.getElementById('charCount');
  const messageInput = document.getElementById('message');

  // 文字数カウント
  if (messageInput) {
    messageInput.addEventListener('input', function() {
      charCount.textContent = this.value.length;
    });
  }

  // フォーム送信
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // フォームデータを取得
    const formData = {
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      message: document.getElementById('message').value.trim(),
    };

    // 送信ボタンを無効化
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中...';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        // 成功メッセージを表示
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        form.reset();
        charCount.textContent = '0';

        // 5秒後にメッセージを非表示
        setTimeout(() => {
          successMessage.style.display = 'none';
        }, 5000);
      } else {
        // エラーメッセージを表示
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';

        // フィールドごとのエラー表示
        if (result.errors) {
          Object.keys(result.errors).forEach((field) => {
            const errorEl = document.getElementById(`${field}Error`);
            if (errorEl) {
              errorEl.textContent = result.errors[field];
            }
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      errorMessage.style.display = 'block';
      successMessage.style.display = 'none';
    } finally {
      // 送信ボタンを再度有効化
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
    }
  });

  // フォーム入力時にエラーメッセージをクリア
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach((input) => {
    input.addEventListener('input', function() {
      const errorEl = document.getElementById(`${this.id}Error`);
      if (errorEl) {
        errorEl.textContent = '';
      }
    });
  });
});
