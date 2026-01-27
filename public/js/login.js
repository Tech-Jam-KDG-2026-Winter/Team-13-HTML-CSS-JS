/**
 * ログインページのJavaScript
 */

// DOM要素の取得
const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// ============================================
// 初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // ログイン済みの場合はホームへリダイレクト
  redirectIfLoggedIn(() => {
    // 未ログインの場合、フォームを有効化
    console.log('ログインページ準備完了');
  });

  // フォームイベント設定
  setupFormListeners();
});

// ============================================
// イベントリスナー設定
// ============================================

function setupFormListeners() {
  // フォーム送信時の処理
  loginForm.addEventListener('submit', handleLogin);

  // 入力時にエラーメッセージをクリア
  emailInput.addEventListener('input', hideError);
  passwordInput.addEventListener('input', hideError);
}

// ============================================
// ログイン処理
// ============================================

async function handleLogin(e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  // バリデーション
  if (!validateForm(email, password)) {
    return;
  }

  try {
    toggleLoading(true);

    // Firebase Authでログイン
    await auth.signInWithEmailAndPassword(email, password);

    // ログイン成功 - ホームページへリダイレクト
    window.location.href = 'home.html';
  } catch (error) {
    console.error('ログインエラー:', error);
    handleLoginError(error);
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// バリデーション
// ============================================

function validateForm(email, password) {
  if (!email) {
    showError('メールアドレスを入力してください');
    emailInput.focus();
    return false;
  }

  if (!isValidEmail(email)) {
    showError('有効なメールアドレスを入力してください');
    emailInput.focus();
    return false;
  }

  if (!password) {
    showError('パスワードを入力してください');
    passwordInput.focus();
    return false;
  }

  if (!isValidPassword(password)) {
    showError('パスワードは6文字以上で入力してください');
    passwordInput.focus();
    return false;
  }

  return true;
}

// ============================================
// エラーハンドリング
// ============================================

function handleLoginError(error) {
  let message = 'ログインに失敗しました';

  switch (error.code) {
    case 'auth/user-not-found':
      message = 'このメールアドレスは登録されていません';
      break;
    case 'auth/wrong-password':
      message = 'パスワードが正しくありません';
      break;
    case 'auth/invalid-email':
      message = 'メールアドレスの形式が正しくありません';
      break;
    case 'auth/user-disabled':
      message = 'このアカウントは無効化されています';
      break;
    case 'auth/too-many-requests':
      message = 'ログイン試行回数が多すぎます。しばらく待ってから再試行してください';
      break;
    case 'auth/invalid-credential':
      message = 'メールアドレスまたはパスワードが正しくありません';
      break;
    default:
      message = `ログインエラー: ${error.message}`;
  }

  showError(message);
}
