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
  requireAuth(async (user) => {
    currentUser = user;
    toggleLoading(true);

    try {
      currentUserData = await getUserData(user.uid);
      displayProfile();
      await loadStats();
      await loadTrainingHistory();

      // グラフを読み込み（追加）
      await renderScoreChart('week');
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    } finally {
      toggleLoading(false);
    }
  });

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

  // もっと見る（ボタンが存在する場合のみ）
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', loadMoreTrainings);
  }

  // ログアウト
  logoutBtn.addEventListener('click', handleLogout);

  // グラフタブ切り替え
  graphTabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      // アクティブ状態を更新
      graphTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // グラフを再描画
      currentPeriod = tab.dataset.period;
      toggleLoading(true);
      await renderScoreChart(currentPeriod);
      toggleLoading(false);
    });
  });
}

// ============================================
// プロフィール表示
// ============================================

function displayProfile() {
  // アバター
  profileAvatar.src = getIconUrl(currentUserData?.iconURL, currentUserData?.username);

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
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    emptyHistoryElement.style.display = 'none';

    // 最後のドキュメントを保存（ページネーション用）
    lastTrainingDoc = snapshot.docs[snapshot.docs.length - 1];

    // 履歴を表示
    const historyHTML = snapshot.docs.map((doc) => createHistoryItemHTML(doc.data())).join('');
    trainingHistoryElement.innerHTML = historyHTML + emptyHistoryElement.outerHTML;

    // もっと見るボタンの表示
    if (loadMoreBtn && snapshot.docs.length >= TRAININGS_PER_PAGE) {
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
      if (loadMoreBtn) loadMoreBtn.style.display = 'none';
      return;
    }

    // 最後のドキュメントを更新
    lastTrainingDoc = snapshot.docs[snapshot.docs.length - 1];

    // 履歴を追加
    const historyHTML = snapshot.docs.map((doc) => createHistoryItemHTML(doc.data())).join('');
    if (loadMoreBtn) {
      loadMoreBtn.insertAdjacentHTML('beforebegin', historyHTML);
    }

    // 次のページがあるかチェック
    if (loadMoreBtn && snapshot.docs.length < TRAININGS_PER_PAGE) {
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


// ============================================
// グラフ関連
// ============================================

let scoreChart = null;
let currentPeriod = 'week';

// DOM要素の取得に追加
const graphTabs = document.querySelectorAll('.graph-tab');
const graphTotalScore = document.getElementById('graph-total-score');
const graphAvgScore = document.getElementById('graph-avg-score');
const graphBestDay = document.getElementById('graph-best-day');

/**
 * 過去N日分の日付配列を生成
 * @param {number} days - 日数
 * @returns {Array} 日付配列（YYYY-MM-DD形式）
 */
function getPastDates(days) {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dates.push(dateStr);
  }
  return dates;
}

/**
 * 日付を短い表示形式に変換
 * @param {string} dateStr - YYYY-MM-DD形式の日付
 * @returns {string} M/D形式の日付
 */
function formatShortDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * 期間内のスコアデータを取得
 * @param {number} days - 取得する日数
 * @returns {Promise<Object>} 日付ごとのスコアマップ
 */
async function getScoreDataByPeriod(days) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);

  try {
    const snapshot = await db.collection('trainings')
      .where('userId', '==', currentUser.uid)
      .where('timestamp', '>=', startDate)
      .orderBy('timestamp', 'asc')
      .get();

    // 日付ごとにスコアを集計
    const scoreByDate = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.timestamp) {
        const date = data.timestamp.toDate();
        const dateStr = date.toISOString().split('T')[0];

        if (!scoreByDate[dateStr]) {
          scoreByDate[dateStr] = 0;
        }
        scoreByDate[dateStr] += data.score || 0;
      }
    });

    return scoreByDate;
  } catch (error) {
    console.error('スコアデータ取得エラー:', error);
    return {};
  }
}

/**
 * スコアグラフを描画
 * @param {string} period - 'week' または 'month'
 */
async function renderScoreChart(period) {
  const days = period === 'week' ? 7 : 30;
  const dates = getPastDates(days);
  const scoreData = await getScoreDataByPeriod(days);

  // ラベルとデータを準備
  const labels = dates.map(d => formatShortDate(d));
  const data = dates.map(d => scoreData[d] || 0);

  // 統計を計算
  const totalScore = data.reduce((sum, val) => sum + val, 0);
  const avgScore = Math.round(totalScore / days);
  const maxScore = Math.max(...data);
  const maxIndex = data.indexOf(maxScore);
  const bestDay = maxScore > 0 ? formatShortDate(dates[maxIndex]) : '-';

  // 統計を表示
  graphTotalScore.textContent = `${totalScore.toLocaleString()} pt`;
  graphAvgScore.textContent = `${avgScore.toLocaleString()} pt`;
  graphBestDay.textContent = maxScore > 0 ? `${bestDay} (${maxScore}pt)` : '-';

  // 既存のチャートを破棄
  if (scoreChart) {
    scoreChart.destroy();
  }

  // 新しいチャートを作成
  const ctx = document.getElementById('score-chart').getContext('2d');
  scoreChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'スコア',
        data: data,
        backgroundColor: 'rgba(212, 175, 55, 0.6)',
        borderColor: 'rgba(212, 175, 55, 1)',
        borderWidth: 1,
        borderRadius: 4,
        maxBarThickness: 40
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#D4AF37',
          bodyColor: '#fff',
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function(context) {
              return `${context.parsed.y.toLocaleString()} pt`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#999',
            font: {
              size: period === 'month' ? 10 : 12
            },
            maxRotation: period === 'month' ? 45 : 0
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(255, 255, 255, 0.1)'
          },
          ticks: {
            color: '#999',
            callback: function(value) {
              return value.toLocaleString();
            }
          }
        }
      }
    }
  });
}
