/**
 * プロフィールページのJavaScript
 */

// グローバル変数
let currentUser = null;
let currentUserData = null;
let lastTrainingDoc = null;
const TRAININGS_PER_PAGE = 10;

// DOM要素の取得
const profileAvatar = document.getElementById('profile-avatar');
const avatarInput = document.getElementById('avatar-input');
const usernameDisplay = document.getElementById('username-display');
const editUsernameBtn = document.getElementById('edit-username-btn');
const usernameEdit = document.getElementById('username-edit');
const usernameInput = document.getElementById('username-input');
const saveUsernameBtn = document.getElementById('save-username-btn');
const cancelUsernameBtn = document.getElementById('cancel-username-btn');
const userIdCode = document.getElementById('user-id-code');
const copyIdBtn = document.getElementById('copy-id-btn');
const totalScoreElement = document.getElementById('total-score');
const todayScoreElement = document.getElementById('today-score');
const totalTrainingsElement = document.getElementById('total-trainings');
const totalCaloriesElement = document.getElementById('total-calories');
const trainingHistoryElement = document.getElementById('training-history');
const emptyHistoryElement = document.getElementById('empty-history');
const loadMoreBtn = document.getElementById('load-more-btn');
const logoutBtn = document.getElementById('logout-btn');

// ============================================
// 初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // 認証チェックとデータ読み込み
  requireAuth(async (user) => {
    currentUser = user;
    toggleLoading(true);

    try {
      // ユーザーデータ取得
      currentUserData = await getUserData(user.uid);

      // プロフィール情報を表示
      displayProfile();

      // 統計情報を読み込み
      await loadStats();

      // トレーニング履歴を読み込み
      await loadTrainingHistory();
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    } finally {
      toggleLoading(false);
    }
  });

  // イベントリスナー設定
  setupEventListeners();
});

// ============================================
// イベントリスナー設定
// ============================================

function setupEventListeners() {
  // アバター変更
  avatarInput.addEventListener('change', handleAvatarChange);

  // ユーザーネーム編集
  editUsernameBtn.addEventListener('click', showUsernameEdit);
  saveUsernameBtn.addEventListener('click', saveUsername);
  cancelUsernameBtn.addEventListener('click', hideUsernameEdit);

  // ユーザーIDコピー
  copyIdBtn.addEventListener('click', copyUserId);

  // もっと見る
  loadMoreBtn.addEventListener('click', loadMoreTrainings);

  // ログアウト
  logoutBtn.addEventListener('click', handleLogout);
}

// ============================================
// プロフィール表示
// ============================================

function displayProfile() {
  // アバター
  profileAvatar.src = getIconUrl(currentUserData?.iconURL);

  // ユーザーネーム
  usernameDisplay.textContent = currentUserData?.username || 'ユーザー';

  // ユーザーID
  userIdCode.textContent = currentUserData?.userID || '未設定';
}

// ============================================
// アバター変更
// ============================================

async function handleAvatarChange(e) {
  console.log('handleAvatarChange called');
  const file = e.target.files[0];
  if (!file) {
    console.log('No file selected');
    return;
  }
  console.log('File selected:', file.name, file.size, file.type);

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
    toggleLoading(true);
    console.log('Uploading to Cloudinary...');

    // Cloudinaryにアップロード
    const imageUrl = await uploadImageToCloudinary(file);
    console.log('Upload successful:', imageUrl);

    // Firestoreを更新
    console.log('Updating Firestore...');
    await db.collection('users').doc(currentUser.uid).update({
      iconURL: imageUrl
    });
    console.log('Firestore updated');

    // 表示を更新
    profileAvatar.src = imageUrl;
    currentUserData.iconURL = imageUrl;

    showSuccess('プロフィール画像を更新しました');
  } catch (error) {
    console.error('アバター更新エラー:', error);
    showError('画像のアップロードに失敗しました');
  } finally {
    toggleLoading(false);
    // input をリセット（同じファイルを再選択可能に）
    avatarInput.value = '';
  }
}

// ============================================
// ユーザーネーム編集
// ============================================

function showUsernameEdit() {
  usernameInput.value = currentUserData?.username || '';
  usernameDisplay.parentElement.style.display = 'none';
  usernameEdit.style.display = 'block';
  usernameInput.focus();
}

function hideUsernameEdit() {
  usernameEdit.style.display = 'none';
  usernameDisplay.parentElement.style.display = 'flex';
}

async function saveUsername() {
  const newUsername = usernameInput.value.trim();

  if (!isValidUsername(newUsername)) {
    showError('ユーザーネームは1〜20文字で入力してください');
    return;
  }

  try {
    toggleLoading(true);

    // Firestoreを更新
    await db.collection('users').doc(currentUser.uid).update({
      username: newUsername
    });

    // 表示を更新
    usernameDisplay.textContent = newUsername;
    currentUserData.username = newUsername;

    hideUsernameEdit();
    showSuccess('ユーザーネームを更新しました');
  } catch (error) {
    console.error('ユーザーネーム更新エラー:', error);
    showError('ユーザーネームの更新に失敗しました');
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// ユーザーIDコピー
// ============================================

async function copyUserId() {
  const userId = currentUserData?.userID;
  if (!userId) return;

  const success = await copyToClipboard(userId);
  if (success) {
    showSuccess('ユーザーIDをコピーしました');
  } else {
    showError('コピーに失敗しました');
  }
}

// ============================================
// 統計情報読み込み
// ============================================

async function loadStats() {
  try {
    // 今日のスコア
    const todayScore = await getTodayScore(currentUser.uid);
    todayScoreElement.textContent = todayScore.toLocaleString();

    // 全トレーニングを取得して統計を計算
    const snapshot = await db.collection('trainings')
      .where('userId', '==', currentUser.uid)
      .get();

    let totalScore = 0;
    let totalCalories = 0;
    const totalTrainings = snapshot.size;

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalScore += data.score || 0;
      totalCalories += data.calories || 0;
    });

    // 表示を更新
    totalScoreElement.textContent = totalScore.toLocaleString();
    totalTrainingsElement.textContent = totalTrainings.toLocaleString();
    totalCaloriesElement.textContent = totalCalories.toLocaleString();

    // Firestoreのtotalscoreも更新
    await db.collection('users').doc(currentUser.uid).update({
      totalScore: totalScore
    });
  } catch (error) {
    console.error('統計情報取得エラー:', error);
  }
}

// ============================================
// トレーニング履歴読み込み
// ============================================

async function loadTrainingHistory() {
  try {
    const snapshot = await db.collection('trainings')
      .where('userId', '==', currentUser.uid)
      .orderBy('timestamp', 'desc')
      .limit(TRAININGS_PER_PAGE)
      .get();

    if (snapshot.empty) {
      emptyHistoryElement.style.display = 'block';
      loadMoreBtn.style.display = 'none';
      return;
    }

    emptyHistoryElement.style.display = 'none';

    // 最後のドキュメントを保存（ページネーション用）
    lastTrainingDoc = snapshot.docs[snapshot.docs.length - 1];

    // 履歴を表示
    const historyHTML = snapshot.docs.map((doc) => createHistoryItemHTML(doc.data())).join('');
    trainingHistoryElement.innerHTML = historyHTML + emptyHistoryElement.outerHTML;

    // もっと見るボタンの表示
    if (snapshot.docs.length >= TRAININGS_PER_PAGE) {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    console.error('トレーニング履歴取得エラー:', error);
  }
}

async function loadMoreTrainings() {
  if (!lastTrainingDoc) return;

  try {
    toggleLoading(true);

    const snapshot = await db.collection('trainings')
      .where('userId', '==', currentUser.uid)
      .orderBy('timestamp', 'desc')
      .startAfter(lastTrainingDoc)
      .limit(TRAININGS_PER_PAGE)
      .get();

    if (snapshot.empty) {
      loadMoreBtn.style.display = 'none';
      return;
    }

    // 最後のドキュメントを更新
    lastTrainingDoc = snapshot.docs[snapshot.docs.length - 1];

    // 履歴を追加
    const historyHTML = snapshot.docs.map((doc) => createHistoryItemHTML(doc.data())).join('');
    loadMoreBtn.insertAdjacentHTML('beforebegin', historyHTML);

    // 次のページがあるかチェック
    if (snapshot.docs.length < TRAININGS_PER_PAGE) {
      loadMoreBtn.style.display = 'none';
    }
  } catch (error) {
    console.error('履歴追加読み込みエラー:', error);
  } finally {
    toggleLoading(false);
  }
}

/**
 * 履歴アイテムのHTMLを生成
 * @param {Object} data - トレーニングデータ
 * @returns {string} HTML文字列
 */
function createHistoryItemHTML(data) {
  return `
    <div class="history-item">
      <div class="history-info">
        <span class="history-type">${getTrainingTypeName(data.type)}</span>
        <span class="history-details">${data.duration}分 / ${data.calories}kcal</span>
        <span class="history-date">${formatTimestamp(data.timestamp)}</span>
      </div>
      <span class="history-score">+${data.score} pt</span>
    </div>
  `;
}

// ============================================
// ログアウト処理
// ============================================

async function handleLogout() {
  if (confirm('ログアウトしますか？')) {
    await logout();
  }
}
