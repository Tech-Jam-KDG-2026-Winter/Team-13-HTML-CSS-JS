/**
 * 共通ユーティリティ関数
 */

// ============================================
// 認証関連
// ============================================

/**
 * ログイン状態をチェックし、未ログインならログインページへリダイレクト
 * @param {Function} callback - ログイン済みの場合に実行するコールバック
 */
function requireAuth(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      if (callback) callback(user);
    } else {
      window.location.href = 'login.html';
    }
  });
}

/**
 * ログイン済みの場合はホームページへリダイレクト
 * @param {Function} callback - 未ログインの場合に実行するコールバック
 */
function redirectIfLoggedIn(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      window.location.href = 'home.html';
    } else {
      if (callback) callback();
    }
  });
}

/**
 * ログアウト処理
 */
async function logout() {
  try {
    await auth.signOut();
    window.location.href = 'login.html';
  } catch (error) {
    console.error('ログアウトエラー:', error);
    showError('ログアウトに失敗しました');
  }
}

// ============================================
// ユーザーID生成
// ============================================

/**
 * Discord風のユーザーID生成（例: user#1234）
 * @param {string} username - ユーザーネーム
 * @returns {string} 生成されたユーザーID
 */
function generateUserId(username) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${username}#${randomNum}`;
}

/**
 * ランダムな英数字IDを生成
 * @param {number} length - IDの長さ
 * @returns {string} 生成されたID
 */
function generateRandomId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ============================================
// スコア計算
// ============================================

/**
 * トレーニングの種類に応じた消費カロリーを計算
 * @param {string} type - トレーニング種目
 * @param {number} duration - 時間（分）
 * @returns {number} 消費カロリー
 */
function calculateCalories(type, duration) {
  // 1分あたりのカロリー消費量（METs値を簡略化）
  const caloriesPerMinute = {
    squat: 8,      // スクワット
    pushup: 7,     // 腕立て伏せ
    running: 10,   // ランニング
    walking: 4,    // ウォーキング
    plank: 5,      // プランク
    cycling: 8,    // サイクリング
    swimming: 9,   // 水泳
    yoga: 3,       // ヨガ
    hiit: 12,      // HIIT
    other: 5       // その他
  };

  const rate = caloriesPerMinute[type] || caloriesPerMinute.other;
  return Math.round(duration * rate);
}

/**
 * 消費カロリーからスコアを計算
 * @param {number} calories - 消費カロリー
 * @returns {number} スコア
 */
function calculateScore(calories) {
  // カロリーの1.5倍をスコアとして付与（ゲーミフィケーション要素）
  return Math.round(calories * 1.5);
}

/**
 * トレーニング種目の日本語名を取得
 * @param {string} type - トレーニング種目のキー
 * @returns {string} 日本語名
 */
function getTrainingTypeName(type) {
  // training-data.jsが読み込まれている場合はそちらを使用
  if (typeof TRAINING_TYPES !== 'undefined') {
    const training = TRAINING_TYPES.find(t => t.id === type);
    if (training) return training.name;
  }
  // フォールバック（旧データ）
  const names = {
    squat: 'スクワット',
    pushup: '腕立て伏せ',
    running: 'ランニング',
    walking: 'ウォーキング',
    plank: 'プランク',
    cycling: 'サイクリング',
    swimming: '水泳',
    yoga: 'ヨガ',
    hiit: 'HIIT',
    other: 'その他'
  };
  return names[type] || type;
}

// ============================================
// UI関連
// ============================================

/**
 * ローディング表示を切り替え
 * @param {boolean} show - 表示/非表示
 */
function toggleLoading(show) {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.classList.toggle('active', show);
  }
}

/**
 * エラーメッセージを表示
 * @param {string} message - エラーメッセージ
 */
function showError(message) {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    // 新しいHTML構造（spanがある場合）に対応
    const spanElement = errorElement.querySelector('span');
    if (spanElement) {
      spanElement.textContent = message;
    } else {
      errorElement.textContent = message;
    }
    errorElement.classList.add('active');

    // 5秒後に自動で非表示
    setTimeout(() => {
      errorElement.classList.remove('active');
    }, 5000);
  }
}

/**
 * エラーメッセージを非表示
 */
function hideError() {
  const errorElement = document.getElementById('error-message');
  if (errorElement) {
    errorElement.classList.remove('active');
  }
}

/**
 * 成功メッセージを表示
 * @param {string} message - 成功メッセージ
 */
function showSuccess(message) {
  const successElement = document.getElementById('success-message');
  if (successElement) {
    successElement.textContent = message;
    successElement.classList.add('active');

    // 3秒後に自動で非表示
    setTimeout(() => {
      successElement.classList.remove('active');
    }, 3000);
  }
}

/**
 * テキストをクリップボードにコピー
 * @param {string} text - コピーするテキスト
 * @returns {Promise<boolean>} コピー成功/失敗
 */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // フォールバック
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}

// ============================================
// 日付・時間関連
// ============================================

/**
 * 今日の日付の開始時刻を取得（UTC）
 * @returns {Date} 今日の開始時刻
 */
function getTodayStart() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * 今日の日付の終了時刻を取得（UTC）
 * @returns {Date} 今日の終了時刻
 */
function getTodayEnd() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
}

/**
 * タイムスタンプを読みやすい形式に変換
 * @param {firebase.firestore.Timestamp} timestamp - Firestoreのタイムスタンプ
 * @returns {string} フォーマットされた日時文字列
 */
function formatTimestamp(timestamp) {
  if (!timestamp) return '';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('ja-JP', options);
}

/**
 * 日付のみをフォーマット
 * @param {firebase.firestore.Timestamp} timestamp - Firestoreのタイムスタンプ
 * @returns {string} フォーマットされた日付文字列
 */
function formatDate(timestamp) {
  if (!timestamp) return '';

  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// ============================================
// バリデーション
// ============================================

/**
 * メールアドレスのバリデーション
 * @param {string} email - メールアドレス
 * @returns {boolean} 有効/無効
 */
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * パスワードのバリデーション（最低6文字）
 * @param {string} password - パスワード
 * @returns {boolean} 有効/無効
 */
function isValidPassword(password) {
  return password && password.length >= 6;
}

/**
 * ユーザーネームのバリデーション（1-20文字）
 * @param {string} username - ユーザーネーム
 * @returns {boolean} 有効/無効
 */
function isValidUsername(username) {
  return username && username.length >= 1 && username.length <= 20;
}

// ============================================
// Firestore ヘルパー
// ============================================

/**
 * ユーザーデータを取得
 * @param {string} userId - ユーザーのUID
 * @returns {Promise<Object|null>} ユーザーデータ
 */
async function getUserData(userId) {
  try {
    const docRef = db.collection('users').doc(userId);
    const doc = await docRef.get();

    if (doc.exists) {
      const userData = { id: doc.id, ...doc.data() };

      // userIDが存在しない場合は自動生成して保存
      if (!userData.userID) {
        const username = userData.username || 'user';
        const newUserID = generateUserId(username);
        try {
          await docRef.update({
            userID: newUserID
          });
          userData.userID = newUserID;
          console.log('ユーザーIDを自動生成しました:', newUserID);
        } catch (updateError) {
          console.error('userID更新エラー:', updateError);
        }
      }

      return userData;
    } else {
      // ドキュメントが存在しない場合は作成
      const currentUser = auth.currentUser;
      if (currentUser && currentUser.uid === userId) {
        const username = currentUser.displayName || currentUser.email?.split('@')[0] || 'user';
        const newUserID = generateUserId(username);
        const newUserData = {
          username: username,
          email: currentUser.email || '',
          userID: newUserID,
          iconURL: '',
          totalScore: 0,
          friends: [],
          createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        await docRef.set(newUserData);
        console.log('ユーザードキュメントを作成しました:', newUserID);
        return { id: userId, ...newUserData };
      }
    }
    return null;
  } catch (error) {
    console.error('ユーザーデータ取得エラー:', error);
    return null;
  }
}

/**
 * ユーザーIDからユーザーを検索
 * @param {string} userIdString - Discord風のユーザーID（例: user#1234）
 * @returns {Promise<Object|null>} ユーザーデータ
 */
async function findUserByUserId(userIdString) {
  try {
    const snapshot = await db.collection('users')
      .where('userID', '==', userIdString)
      .limit(1)
      .get();

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('ユーザー検索エラー:', error);
    return null;
  }
}

/**
 * 今日のトレーニングスコア合計を取得
 * @param {string} userId - ユーザーのUID
 * @returns {Promise<number>} 今日のスコア合計
 */
async function getTodayScore(userId) {
  try {
    const todayStart = getTodayStart();
    const todayEnd = getTodayEnd();

    const snapshot = await db.collection('trainings')
      .where('userId', '==', userId)
      .where('timestamp', '>=', todayStart)
      .where('timestamp', '<=', todayEnd)
      .get();

    let totalScore = 0;
    snapshot.forEach((doc) => {
      totalScore += doc.data().score || 0;
    });

    return totalScore;
  } catch (error) {
    console.error('今日のスコア取得エラー:', error);
    return 0;
  }
}

// ============================================
// デフォルトアイコン
// ============================================

/**
 * DiceBear APIを使用してデフォルトアイコンURLを生成
 * @param {string} seed - シード値（ユーザー名など）
 * @returns {string} DiceBearアイコンURL
 */
function getDiceBearIconUrl(seed = 'default') {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
}

/**
 * アイコンURLを取得（未設定の場合はDiceBearでデフォルトを返す）
 * @param {string} iconURL - アイコンURL
 * @param {string} username - ユーザー名（デフォルトアイコン生成用）
 * @returns {string} アイコンURL
 */
function getIconUrl(iconURL, username = 'default') {
  return iconURL || getDiceBearIconUrl(username);
}

// ============================================
// Cloudinary 画像アップロード
// ============================================

/**
 * Cloudinaryに画像をアップロード
 * @param {File} file - アップロードするファイル
 * @returns {Promise<string>} アップロードされた画像のURL
 */
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Techjam');

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dflobm8ij/image/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error('画像のアップロードに失敗しました');
  }

  const data = await res.json();
  return data.secure_url;
}

// ============================================
// ナビゲーションログアウトボタン
// ============================================

/**
 * ナビゲーションのログアウトボタンにイベントリスナーを追加
 */
document.addEventListener('DOMContentLoaded', () => {
  const navLogoutBtn = document.getElementById('nav-logout-btn');
  if (navLogoutBtn) {
    navLogoutBtn.addEventListener('click', logout);
  }

  // トースト通知コンテナを作成
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
});

// ============================================
// トースト通知システム
// ============================================

/**
 * トースト通知を表示
 * @param {Object} options - 通知オプション
 * @param {string} options.title - タイトル
 * @param {string} options.message - メッセージ
 * @param {string} options.type - タイプ (challenge, friend, milestone, score)
 * @param {number} options.duration - 表示時間（ミリ秒）デフォルト5000
 */
function showToast({ title, message, type = 'challenge', duration = 5000 }) {
  const container = document.querySelector('.toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  const iconMap = {
    challenge: 'swords',
    friend: 'user-plus',
    milestone: 'trophy',
    score: 'flame'
  };

  toast.innerHTML = `
    <div class="toast-icon toast-icon-${type}">
      <i data-lucide="${iconMap[type] || 'bell'}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close">
      <i data-lucide="x"></i>
    </button>
  `;

  container.appendChild(toast);

  // Lucideアイコンを初期化
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 閉じるボタン
  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => closeToast(toast));

  // 自動で閉じる
  setTimeout(() => closeToast(toast), duration);
}

/**
 * トーストを閉じる
 */
function closeToast(toast) {
  if (!toast || toast.classList.contains('toast-hide')) return;
  toast.classList.add('toast-hide');
  setTimeout(() => toast.remove(), 300);
}

// ============================================
// リアルタイムリスナー
// ============================================

// 現在のリスナー解除関数を保持
let unsubscribeChallenges = null;
let unsubscribeFriends = null;
let previousChallenges = null;
let previousFriends = null;
let previousScores = {};

/**
 * リアルタイムリスナーを開始
 * @param {string} userId - 現在のユーザーID
 */
function startRealtimeListeners(userId) {
  if (!userId) return;

  // チャレンジのリアルタイムリスナー
  startChallengeListener(userId);

  // フレンドのリアルタイムリスナー
  startFriendListener(userId);
}

/**
 * チャレンジのリアルタイムリスナー
 */
function startChallengeListener(userId) {
  // 自分が関わるチャレンジを監視
  const q1 = db.collection('challenges').where('opponentId', '==', userId);

  unsubscribeChallenges = q1.onSnapshot(snapshot => {
    if (previousChallenges === null) {
      // 初回読み込み時は通知しない
      previousChallenges = snapshot.docs.map(doc => doc.id);
      return;
    }

    snapshot.docChanges().forEach(change => {
      if (change.type === 'added') {
        const data = change.doc.data();
        if (data.status === 'pending') {
          showToast({
            title: '対戦申請が届きました！',
            message: `${data.creatorName}さんから${data.duration}日間の対戦申請`,
            type: 'challenge'
          });
        }
      }
    });

    previousChallenges = snapshot.docs.map(doc => doc.id);
  });
}

/**
 * フレンドのリアルタイムリスナー
 */
function startFriendListener(userId) {
  const userRef = db.collection('users').doc(userId);

  unsubscribeFriends = userRef.onSnapshot(async snapshot => {
    if (!snapshot.exists) return;

    const data = snapshot.data();
    const currentFriends = data.friends || [];

    if (previousFriends === null) {
      // 初回読み込み時は通知しない
      previousFriends = [...currentFriends];
      return;
    }

    // 新しく追加されたフレンドを検出
    const newFriends = currentFriends.filter(f => !previousFriends.includes(f));

    for (const friendId of newFriends) {
      try {
        const friendDoc = await db.collection('users').doc(friendId).get();
        if (friendDoc.exists) {
          const friendData = friendDoc.data();
          showToast({
            title: 'フレンド追加！',
            message: `${friendData.username}さんとフレンドになりました`,
            type: 'friend'
          });
        }
      } catch (e) {
        console.error('フレンド情報取得エラー:', e);
      }
    }

    previousFriends = [...currentFriends];
  });
}

/**
 * 通知済みマイルストーンをlocalStorageから取得
 */
function getNotifiedMilestones(challengeId) {
  try {
    const stored = localStorage.getItem(`milestones_${challengeId}`);
    return stored ? JSON.parse(stored) : { my: [], opp: [] };
  } catch (e) {
    return { my: [], opp: [] };
  }
}

/**
 * 通知済みマイルストーンをlocalStorageに保存
 */
function saveNotifiedMilestone(challengeId, type, milestone) {
  try {
    const notified = getNotifiedMilestones(challengeId);
    if (!notified[type].includes(milestone)) {
      notified[type].push(milestone);
      localStorage.setItem(`milestones_${challengeId}`, JSON.stringify(notified));
    }
  } catch (e) {
    console.error('マイルストーン保存エラー:', e);
  }
}

/**
 * アクティブチャレンジのスコア監視を開始
 */
function startScoreWatcher(challenges, currentUserId) {
  challenges.forEach(challenge => {
    const docRef = db.collection('challenges').doc(challenge.id);
    let isFirstSnapshot = true;

    docRef.onSnapshot(snapshot => {
      if (!snapshot.exists) return;
      const data = snapshot.data();

      const isCreator = data.creatorId === currentUserId;
      const myScore = isCreator ? data.creatorScore : data.opponentScore;
      const oppScore = isCreator ? data.opponentScore : data.creatorScore;
      const oppName = isCreator ? data.opponentName : data.creatorName;
      const myName = isCreator ? data.creatorName : data.opponentName;

      const key = challenge.id;

      // 初回スナップショットはスコアを記録するだけ（通知しない）
      if (isFirstSnapshot) {
        previousScores[key] = { myScore, oppScore };
        isFirstSnapshot = false;
        return;
      }

      const prevMyScore = previousScores[key]?.myScore || 0;
      const prevOppScore = previousScores[key]?.oppScore || 0;
      const notified = getNotifiedMilestones(key);

      // マイルストーンをチェック
      const milestones = [1000, 2000, 3000, 5000, 10000];

      milestones.forEach(milestone => {
        // 相手がマイルストーン到達（未通知の場合のみ）
        if (oppScore >= milestone && !notified.opp.includes(milestone)) {
          if (prevOppScore < milestone) {
            showToast({
              title: 'マイルストーン達成！',
              message: `${oppName}さんが${milestone.toLocaleString()}ポイントに到達！`,
              type: 'milestone'
            });
          }
          saveNotifiedMilestone(key, 'opp', milestone);
        }

        // 自分がマイルストーン到達（未通知の場合のみ）
        if (myScore >= milestone && !notified.my.includes(milestone)) {
          if (prevMyScore < milestone) {
            showToast({
              title: 'マイルストーン達成！',
              message: `あなたが${milestone.toLocaleString()}ポイントに到達！`,
              type: 'milestone'
            });
          }
          saveNotifiedMilestone(key, 'my', milestone);
        }
      });

      previousScores[key] = { myScore, oppScore };
    });
  });
}

/**
 * リアルタイムリスナーを停止
 */
function stopRealtimeListeners() {
  if (unsubscribeChallenges) {
    unsubscribeChallenges();
    unsubscribeChallenges = null;
  }
  if (unsubscribeFriends) {
    unsubscribeFriends();
    unsubscribeFriends = null;
  }
  previousChallenges = null;
  previousFriends = null;
  previousScores = {};
}
