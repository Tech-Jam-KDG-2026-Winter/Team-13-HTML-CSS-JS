/**
 * ホームページのJavaScript
 */

// グローバル変数
let currentUser = null;
let currentUserData = null;

// DOM要素の取得
const todayScoreElement = document.getElementById('today-score');
const rankingListElement = document.getElementById('ranking-list');
const recentTrainingsElement = document.getElementById('recent-trainings');
const emptyRankingElement = document.getElementById('empty-ranking');
const emptyTrainingsElement = document.getElementById('empty-trainings');
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

      // 各データを並行して読み込み
      await Promise.all([
        loadTodayScore(),
        loadFriendsRanking(),
        loadRecentTrainings()
      ]);
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
  // ログアウトボタン
  logoutBtn.addEventListener('click', handleLogout);
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
// 今日のスコア読み込み
// ============================================

async function loadTodayScore() {
  try {
    const score = await getTodayScore(currentUser.uid);
    todayScoreElement.textContent = score.toLocaleString();
  } catch (error) {
    console.error('今日のスコア取得エラー:', error);
    todayScoreElement.textContent = '0';
  }
}

// ============================================
// フレンドランキング読み込み
// ============================================

async function loadFriendsRanking() {
  try {
    // フレンドリスト取得
    const friends = currentUserData?.friends || [];

    // 自分を含めたランキングデータを作成
    const rankingData = [{
      id: currentUser.uid,
      username: currentUserData?.username || 'あなた',
      iconURL: currentUserData?.iconURL || '',
      score: await getTodayScore(currentUser.uid),
      isMe: true
    }];

    // フレンドのスコアを取得
    for (const friendId of friends) {
      const friendData = await getUserData(friendId);
      if (friendData) {
        const friendScore = await getTodayScore(friendId);
        rankingData.push({
          id: friendId,
          username: friendData.username,
          iconURL: friendData.iconURL || '',
          score: friendScore,
          isMe: false
        });
      }
    }

    // スコアで降順ソート
    rankingData.sort((a, b) => b.score - a.score);

    // ランキング表示
    renderRanking(rankingData);
  } catch (error) {
    console.error('ランキング取得エラー:', error);
  }
}

/**
 * ランキングをレンダリング
 * @param {Array} rankingData - ランキングデータ配列
 */
function renderRanking(rankingData) {
  // 自分しかいない場合は空の状態を表示
  if (rankingData.length <= 1) {
    emptyRankingElement.style.display = 'block';
    return;
  }

  emptyRankingElement.style.display = 'none';

  // ランキングHTML生成
  const rankingHTML = rankingData.map((user, index) => {
    const rank = index + 1;
    const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';

    return `
      <div class="ranking-item ${user.isMe ? 'is-me' : ''}">
        <div class="rank-badge ${rankClass}">${rank}</div>
        <div class="ranking-user-info">
          <img src="${getIconUrl(user.iconURL)}" alt="" class="ranking-avatar">
          <span class="ranking-username">${escapeHtml(user.username)}${user.isMe ? ' (あなた)' : ''}</span>
        </div>
        <span class="ranking-score">${user.score.toLocaleString()} pt</span>
      </div>
    `;
  }).join('');

  rankingListElement.innerHTML = rankingHTML + emptyRankingElement.outerHTML;
}

// ============================================
// 最近のトレーニング読み込み
// ============================================

async function loadRecentTrainings() {
  try {
    // 最近のトレーニングを取得（直近5件）
    const snapshot = await db.collection('trainings')
      .where('userId', '==', currentUser.uid)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();

    if (snapshot.empty) {
      emptyTrainingsElement.style.display = 'block';
      return;
    }

    emptyTrainingsElement.style.display = 'none';

    // トレーニングHTML生成
    const trainingsHTML = snapshot.docs.map((doc) => {
      const data = doc.data();
      return `
        <div class="recent-item">
          <div class="recent-info">
            <span class="recent-type">${getTrainingTypeName(data.type)}</span>
            <span class="recent-details">${data.duration}分 / ${data.calories}kcal</span>
          </div>
          <span class="recent-score">+${data.score} pt</span>
        </div>
      `;
    }).join('');

    recentTrainingsElement.innerHTML = trainingsHTML + emptyTrainingsElement.outerHTML;
  } catch (error) {
    console.error('トレーニング履歴取得エラー:', error);
  }
}

// ============================================
// ユーティリティ
// ============================================

/**
 * HTMLエスケープ
 * @param {string} text - エスケープするテキスト
 * @returns {string} エスケープされたテキスト
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
