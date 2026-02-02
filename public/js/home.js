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

// --- チャレンジ用DOM ---
const homeChallengeSection = document.getElementById('home-challenge-section');
const homePendingCard = document.getElementById('home-pending-challenge');
const homeActiveList = document.getElementById('home-active-challenges');

// ============================================
// 初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  requireAuth(async (user) => {
    currentUser = user;
    toggleLoading(true);

    try {
      currentUserData = await getUserData(user.uid);

      // チャレンジデータを含むすべてのデータを読み込み
      await Promise.all([
        loadTodayScore(),
        loadFriendsRanking(),
        loadRecentTrainings(),
        loadHomeChallenges() // ★追加
      ]);
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    } finally {
      toggleLoading(false);
    }
  });

  setupEventListeners();
});

// ============================================
// チャレンジ表示ロジック（追加）
// ============================================

async function loadHomeChallenges() {
  try {
    const [q1, q2] = await Promise.all([
      db.collection('challenges').where('creatorId', '==', currentUser.uid).get(),
      db.collection('challenges').where('opponentId', '==', currentUser.uid).get()
    ]);

    let challenges = [];
    q1.forEach(doc => challenges.push({ id: doc.id, ...doc.data(), isCreator: true }));
    q2.forEach(doc => challenges.push({ id: doc.id, ...doc.data(), isCreator: false }));

    const pending = challenges.filter(c => c.status === 'pending' && !c.isCreator);
    const active = challenges.filter(c => c.status === 'active');

    if (pending.length === 0 && active.length === 0) {
      homeChallengeSection.style.display = 'none';
      return;
    }
    homeChallengeSection.style.display = 'block';

    // --- 挑戦状の表示処理 ---
    if (pending.length > 0) {
      homePendingCard.style.display = 'block';
      const container = document.getElementById('pending-challenge-content');
      container.innerHTML = ''; // 一旦クリア
      
      pending.forEach(p => {
        const div = document.createElement('div');
        div.style.marginBottom = "10px";
        div.style.padding = "10px";
        div.style.background = "rgba(255, 255, 255, 0.05)";
        div.style.borderRadius = "8px";
        
        // ボタンを「詳細を見る」に変更し、friends.html へ飛ばす
        div.innerHTML = `
          <p style="font-size: 0.9rem; margin-bottom: 8px;">
            <strong>${escapeHtml(p.creatorName)}</strong> さんから対戦依頼！
          </p>
          <a href="friends.html" class="btn btn-primary btn-sm" style="text-decoration: none; display: inline-block;">
            詳細を見る
          </a>
        `;
        container.appendChild(div);
      });
    }

    // --- 進行中の表示処理 (テンプレートを使用) ---
    const listContainer = document.getElementById('home-active-challenges');
    const template = document.getElementById('challenge-template');
    
    // テンプレート以外の古いカードを削除
    const oldCards = listContainer.querySelectorAll('.active-challenge-card:not(#challenge-template)');
    oldCards.forEach(c => c.remove());

    if (active.length > 0) {
      active.forEach(a => {
        const oppName = a.isCreator ? a.opponentName : a.creatorName;
        const myScore = a.isCreator ? a.creatorScore : a.opponentScore;
        const oppScore = a.isCreator ? a.opponentScore : a.creatorScore;
        const endTime = a.endDate.toDate().getTime();

        // テンプレートをコピー
        const card = template.cloneNode(true);
        card.id = ''; // IDを消去
        card.style.display = 'block'; // 表示状態にする

        // データを流し込む (クラス名で指定)
        card.querySelector('.js-opp-name-label').innerHTML = `<i data-lucide="swords"></i> vs ${oppName}`;
        card.querySelector('.js-opp-name').textContent = oppName;
        card.querySelector('.js-my-score').textContent = myScore.toLocaleString();
        card.querySelector('.js-opp-score').textContent = oppScore.toLocaleString();
        
        const timer = card.querySelector('.js-home-timer');
        timer.dataset.end = endTime;

        listContainer.appendChild(card);
      });
      startHomeCountdown();
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  } catch (error) {
    console.error("Home Challenge Error:", error);
  }
}

// カウントダウンタイマー
function startHomeCountdown() {
  if (window.homeTimer) clearInterval(window.homeTimer);
  window.homeTimer = setInterval(() => {
    const timerElements = document.querySelectorAll('.js-home-timer');
    if (timerElements.length === 0) {
      clearInterval(window.homeTimer);
      return;
    }

    timerElements.forEach(el => {
      const diff = parseInt(el.dataset.end) - new Date().getTime();
      if (diff <= 0) {
        el.textContent = "終了";
        return;
      }
      
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      el.textContent = `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    });
  }, 1000);
}

// ============================================
// 既存の関数（変更なし）
// ============================================

function setupEventListeners() {
  logoutBtn.addEventListener('click', handleLogout);
}

async function handleLogout() {
  if (confirm('ログアウトしますか？')) {
    await logout();
  }
}

async function loadTodayScore() {
  try {
    const score = await getTodayScore(currentUser.uid);
    // アニメーション用のinput要素に値を設定
    const scoreInput = document.getElementById('today-score-value');
    if (scoreInput) {
      scoreInput.value = score;
    }
  } catch (error) {
    console.error('今日のスコア取得エラー:', error);
    const scoreInput = document.getElementById('');
    if (scoreInput) {
      scoreInput.value = 0;
    }
  }
}

async function loadFriendsRanking() {
  try {
    const friends = currentUserData?.friends || [];
    const rankingData = [{
      id: currentUser.uid,
      username: currentUserData?.username || 'あなた',
      iconURL: currentUserData?.iconURL || '',
      score: await getTodayScore(currentUser.uid),
      isMe: true
    }];

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

    rankingData.sort((a, b) => b.score - a.score);
    renderRanking(rankingData);
  } catch (error) {
    console.error('ランキング取得エラー:', error);
  }
}

function renderRanking(rankingData) {
  if (rankingData.length <= 1) {
    emptyRankingElement.style.display = 'block';
    return;
  }
  emptyRankingElement.style.display = 'none';
  const rankingHTML = rankingData.map((user, index) => {
    const rank = index + 1;
    const rankClass = rank <= 3 ? `rank-${rank}` : 'rank-other';
    return `
      <div class="ranking-item ${user.isMe ? 'is-me' : ''}">
        <div class="rank-badge ${rankClass}">${rank}</div>
        <div class="ranking-user-info">
          <img src="${getIconUrl(user.iconURL, user.username)}" alt="" class="ranking-avatar">
          <span class="ranking-username">${escapeHtml(user.username)}${user.isMe ? ' (あなた)' : ''}</span>
        </div>
        <span class="ranking-score">${user.score.toLocaleString()} pt</span>
      </div>
    `;
  }).join('');
  rankingListElement.innerHTML = rankingHTML + emptyRankingElement.outerHTML;
}

async function loadRecentTrainings() {
  try {
    const snapshot = await db.collection('trainings')
      .where('userId', '==', currentUser.uid)
      .orderBy('timestamp', 'desc')
      .limit(4)
      .get();

    if (snapshot.empty) {
      emptyTrainingsElement.style.display = 'block';
      return;
    }
    emptyTrainingsElement.style.display = 'none';
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

/**
 * ホーム画面から直接チャレンジを承認する
 */
window.acceptChallengeFromHome = async function(challengeId) {
  if (!confirm('対戦を開始しますか？')) return;

  try {
    toggleLoading(true);
    
    // 1. チャレンジデータを取得
    const docRef = db.collection('challenges').doc(challengeId);
    const doc = await docRef.get();
    if (!doc.exists) throw new Error("Challenge not found");
    
    const data = doc.data();
    const now = new Date();
    
    // 2. 終了日を計算 (durationは日数)
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + (data.duration || 3));

    // 3. Firestoreを更新
    await docRef.update({
      status: 'active',
      startDate: firebase.firestore.Timestamp.fromDate(now),
      endDate: firebase.firestore.Timestamp.fromDate(endDate),
      creatorScore: 0,
      opponentScore: 0
    });

    alert('対戦開始！トレーニングを記録して勝利を目指しましょう！');
    
    // 4. 再読み込み
    location.reload();
    
  } catch (error) {
    console.error('承認エラー:', error);
    alert('承認に失敗しました。');
  } finally {
    toggleLoading(false);
  }
};

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}