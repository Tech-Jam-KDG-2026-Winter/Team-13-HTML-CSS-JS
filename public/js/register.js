/**
 * 新規登録ページのJavaScript
 */

// DOM要素の取得
const registerForm = document.getElementById('register-form');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const passwordConfirmInput = document.getElementById('password-confirm');
const avatarInput = document.getElementById('avatar-input');
const avatarPreview = document.getElementById('avatar-preview');
const avatarUploadTrigger = document.getElementById('avatar-upload-trigger');

// アップロードされた画像URL
let uploadedAvatarUrl = '';

// ============================================
// 初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // ログイン済みの場合はホームへリダイレクト
  redirectIfLoggedIn(() => {
    console.log('新規登録ページ準備完了');
  });

  // フォームイベント設定
  setupFormListeners();
});

// ============================================
// イベントリスナー設定
// ============================================

function setupFormListeners() {
  // フォーム送信時の処理
  registerForm.addEventListener('submit', handleRegister);

  // 入力時にエラーメッセージをクリア
  const inputs = [usernameInput, emailInput, passwordInput, passwordConfirmInput];
  inputs.forEach((input) => {
    input.addEventListener('input', hideError);
  });

  // アイコンアップロード
  if (avatarUploadTrigger) {
    avatarUploadTrigger.addEventListener('click', () => {
      avatarInput.click();
    });
  }

  if (avatarPreview) {
    avatarPreview.addEventListener('click', () => {
      avatarInput.click();
    });
  }

  if (avatarInput) {
    avatarInput.addEventListener('change', handleAvatarSelect);
  }
}

// アイコン選択処理
async function handleAvatarSelect(e) {
  const file = e.target.files[0];
  if (!file) return;

  // ファイルサイズチェック（5MB以下）
  if (file.size > 5 * 1024 * 1024) {
    showError('画像サイズは5MB以下にしてください');
    return;
  }

  // 画像タイプチェック
  if (!file.type.startsWith('image/')) {
    showError('画像ファイルを選択してください');
    return;
  }

  try {
    // プレビュー表示
    const reader = new FileReader();
    reader.onload = (event) => {
      avatarPreview.src = event.target.result;
    };
    reader.readAsDataURL(file);

    // Cloudinaryにアップロード
    toggleLoading(true);
    uploadedAvatarUrl = await uploadImageToCloudinary(file);
    console.log('アイコンアップロード完了:', uploadedAvatarUrl);
  } catch (error) {
    console.error('アイコンアップロードエラー:', error);
    showError('画像のアップロードに失敗しました');
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// 登録処理
// ============================================

async function handleRegister(e) {
  e.preventDefault();

  const username = usernameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const passwordConfirm = passwordConfirmInput.value;

  // バリデーション
  if (!validateForm(username, email, password, passwordConfirm)) {
    return;
  }

  try {
    toggleLoading(true);

    // Firebase Authでユーザー作成
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Discord風のユーザーID生成
    const userID = generateUserId(username);

    // Firestoreにユーザー情報を保存
    await db.collection('users').doc(user.uid).set({
      username: username,
      email: email,
      userID: userID,
      iconURL: uploadedAvatarUrl || '',
      totalScore: 0,
      friends: [],
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    // 登録成功 - ホームページへリダイレクト
    window.location.href = 'home.html';
  } catch (error) {
    console.error('登録エラー:', error);
    handleRegisterError(error);
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// バリデーション
// ============================================

function validateForm(username, email, password, passwordConfirm) {
  // ユーザーネーム
  if (!username) {
    showError('ユーザーネームを入力してください');
    usernameInput.focus();
    return false;
  }

  if (!isValidUsername(username)) {
    showError('ユーザーネームは1〜20文字で入力してください');
    usernameInput.focus();
    return false;
  }

  // メールアドレス
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

  // パスワード
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

  // パスワード確認
  if (password !== passwordConfirm) {
    showError('パスワードが一致しません');
    passwordConfirmInput.focus();
    return false;
  }

  return true;
}

// ============================================
// エラーハンドリング
// ============================================

function handleRegisterError(error) {
  let message = '登録に失敗しました';

  switch (error.code) {
    case 'auth/email-already-in-use':
      message = 'このメールアドレスは既に使用されています';
      break;
    case 'auth/invalid-email':
      message = 'メールアドレスの形式が正しくありません';
      break;
    case 'auth/weak-password':
      message = 'パスワードが弱すぎます。より強力なパスワードを設定してください';
      break;
    case 'auth/operation-not-allowed':
      message = 'メール/パスワード認証が有効になっていません';
      break;
    default:
      message = `登録エラー: ${error.message}`;
  }

  showError(message);
}
