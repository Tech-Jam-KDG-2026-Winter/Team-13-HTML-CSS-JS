/**
 * ランキングページのJavaScript
 */

// グローバル変数
let currentUser = null;
let currentUserData = null;
let currentPeriod = 'today';
let rankingData = [];

// DOM要素の取得
const periodTabs = document.querySelectorAll('.period-tab');
const myRankNumber = document.getElementById('my-rank-number');
const myRankScore = document.getElementById('my-rank-score');
const myRankTotal = document.getElementById('my-rank-total');
const myRankPeriod = document.getElementById('my-rank-period');
const rankingList = document.getElementById('ranking-list');
const emptyRanking = document.getElementById('empty-ranking');

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

      // ランキング読み込み
      await loadRanking();
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
  // 期間タブ切り替え
  periodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      periodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentPeriod = tab.dataset.period;
      loadRanking();
    });
  });
}

// ============================================
// ランキング読み込み
// ============================================

async function loadRanking() {
  toggleLoading(true);

  try {
    // フレンドリスト取得
    const friends = currentUserData?.friends || [];

    // 自分を含めたランキングデータを作成
    rankingData = [{
      id: currentUser.uid,
      username: currentUserData?.username || 'あなた',
      iconURL: currentUserData?.iconURL || '',
      score: await getScoreByPeriod(currentUser.uid, currentPeriod),
      isMe: true
    }];

    // フレンドのスコアを取得
    const friendPromises = friends.map(async (friendId) => {
      const friendData = await getUserData(friendId);
      if (friendData) {
        const score = await getScoreByPeriod(friendId, currentPeriod);
        return {
          id: friendId,
          username: friendData.username,
          iconURL: friendData.iconURL || '',
          score: score,
          isMe: false
        };
      }
      return null;
    });

    const friendsResults = await Promise.all(friendPromises);
    friendsResults.forEach(friend => {
      if (friend) rankingData.push(friend);
    });

    // スコアで降順ソート
    rankingData.sort((a, b) => b.score - a.score);

    // ランキング表示
    renderRanking();
  } catch (error) {
    console.error('ランキング取得エラー:', error);
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// 期間別スコア取得
// ============================================

async function getScoreByPeriod(userId, period) {
  try {
    if (period === 'total') {
      // 合計スコアはユーザードキュメントから取得
      const userData = await getUserData(userId);
      return userData?.totalScore || 0;
    }

    // 期間の開始日を計算
    const now = new Date();
    let startDate;

    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    // トレーニングを集計
    const snapshot = await db.collection('trainings')
      .where('userId', '==', userId)
      .where('timestamp', '>=', firebase.firestore.Timestamp.fromDate(startDate))
      .get();

    let totalScore = 0;
    snapshot.forEach(doc => {
      totalScore += doc.data().score || 0;
    });

    return totalScore;
  } catch (error) {
    console.error('スコア取得エラー:', error);
    return 0;
  }
}

// ============================================
// ランキング表示
// ============================================

function renderRanking() {
  // 期間ラベル更新
  const periodLabels = {
    today: '今日',
    weekly: '週間',
    monthly: '月間',
    total: '合計'
  };
  myRankPeriod.textContent = periodLabels[currentPeriod];

  // 自分しかいない場合は空の状態を表示
  if (rankingData.length <= 1) {
    emptyRanking.style.display = 'block';
    renderEmptyTopThree();
    renderMyRank(1, rankingData[0]?.score || 0, 1);
    return;
  }

  emptyRanking.style.display = 'none';

  // 自分の順位を取得
  const myIndex = rankingData.findIndex(u => u.isMe);
  const myRank = myIndex + 1;
  const myScore = rankingData[myIndex]?.score || 0;
  renderMyRank(myRank, myScore, rankingData.length);

  // トップ3を表示
  renderTopThree(rankingData.slice(0, 3));

  // 4位以降を表示
  renderRankingList(rankingData.slice(3));
}

/**
 * 自分の順位を表示
 */
function renderMyRank(rank, score, total) {
  myRankNumber.textContent = rank;
  myRankScore.textContent = score.toLocaleString();
  myRankTotal.textContent = `/ ${total} 人中`;
}

/**
 * トップ3を表示
 */
function renderTopThree(topUsers) {
  const positions = [1, 2, 3];

  positions.forEach(pos => {
    const user = topUsers[pos - 1];
    const avatarEl = document.getElementById(`top-${pos}-avatar`);
    const nameEl = document.getElementById(`top-${pos}-name`);
    const scoreEl = document.getElementById(`top-${pos}-score`);

    if (user) {
      avatarEl.src = getIconUrl(user.iconURL);
      nameEl.textContent = user.username + (user.isMe ? ' (あなた)' : '');
      scoreEl.textContent = `${user.score.toLocaleString()} pt`;
    } else {
      avatarEl.src = getIconUrl('');
      nameEl.textContent = '-';
      scoreEl.textContent = '0 pt';
    }
  });
}

/**
 * 空のトップ3を表示
 */
function renderEmptyTopThree() {
  const positions = [1, 2, 3];

  positions.forEach(pos => {
    const avatarEl = document.getElementById(`top-${pos}-avatar`);
    const nameEl = document.getElementById(`top-${pos}-name`);
    const scoreEl = document.getElementById(`top-${pos}-score`);

    avatarEl.src = getIconUrl('');
    nameEl.textContent = '-';
    scoreEl.textContent = '0 pt';
  });
}

/**
 * 4位以降のランキングリストを表示
 */
function renderRankingList(users) {
  if (users.length === 0) {
    rankingList.innerHTML = '';
    return;
  }

  const html = users.map((user, index) => {
    const rank = index + 4; // 4位から開始

    return `
      <div class="ranking-item ${user.isMe ? 'is-me' : ''}">
        <div class="rank-badge">${rank}</div>
        <div class="ranking-user-info">
          <img src="${getIconUrl(user.iconURL)}" alt="" class="ranking-avatar">
          <span class="ranking-username">${escapeHtml(user.username)}${user.isMe ? ' (あなた)' : ''}</span>
        </div>
        <span class="ranking-score">${user.score.toLocaleString()} pt</span>
      </div>
    `;
  }).join('');

  rankingList.innerHTML = html;
}

// ============================================
// ユーティリティ
// ============================================

/**
 * HTMLエスケープ
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}