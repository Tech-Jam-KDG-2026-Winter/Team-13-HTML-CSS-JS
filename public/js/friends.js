/**
 * フレンドページのJavaScript
 */



// グローバル変数
let currentUser = null;
let currentUserData = null;
let foundUser = null;
let deleteTargetId = null;
// チャレンジ関連の変数
let challengeTargetId = null;
let challengeTargetName = null;
let selectedDuration = 3;
let pendingChallengeId = null;

// DOM要素の取得
const addFriendForm = document.getElementById('add-friend-form');
const friendIdInput = document.getElementById('friend-id');
const searchResult = document.getElementById('search-result');
const resultAvatar = document.getElementById('result-avatar');
const resultUsername = document.getElementById('result-username');
const confirmAddBtn = document.getElementById('confirm-add-btn');
const myUserIdElement = document.getElementById('my-user-id');
const copyIdBtn = document.getElementById('copy-id-btn');
const friendsListElement = document.getElementById('friends-list');
const emptyFriendsElement = document.getElementById('empty-friends');
const friendCountElement = document.getElementById('friend-count');
const deleteModal = document.getElementById('delete-modal');
const deleteTargetName = document.getElementById('delete-target-name');
const confirmDeleteBtn = document.getElementById('confirm-delete-btn');
const cancelDeleteBtn = document.getElementById('cancel-delete-btn');
// チャレンジDOM要素の追加
const challengeModal = document.getElementById('challenge-modal');
const challengeTargetNameEl = document.getElementById('challenge-target-name');
const durationBtns = document.querySelectorAll('.duration-btn');
const sendChallengeBtn = document.getElementById('send-challenge-btn');
const cancelChallengeBtn = document.getElementById('cancel-challenge-btn');
const acceptModal = document.getElementById('accept-modal');
const acceptChallengerName = document.getElementById('accept-challenger-name');
const acceptDuration = document.getElementById('accept-duration');
const confirmAcceptBtn = document.getElementById('confirm-accept-btn');
const declineChallengeBtn = document.getElementById('decline-challenge-btn');


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

      // 自分のユーザーIDを表示
      displayMyUserId();

      // フレンドリストを読み込み
      await loadFriendsList();
      // チャレンジを読み込み
      await loadChallenges();
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
  // フレンド検索フォーム
  addFriendForm.addEventListener('submit', handleSearchFriend);

  // フレンド追加確定
  confirmAddBtn.addEventListener('click', handleAddFriend);

  // ユーザーIDコピー
  copyIdBtn.addEventListener('click', copyMyUserId);

  // 削除モーダル
  confirmDeleteBtn.addEventListener('click', handleDeleteFriend);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  // モーダル外クリックで閉じる
  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteModal();
    }
  });

  // 入力時にエラーをクリア
  friendIdInput.addEventListener('input', () => {
    hideError();
    searchResult.style.display = 'none';
    foundUser = null;
  });
  // チャレンジイベントリスナー
  // 期間選択ボタン
  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDuration = parseInt(btn.dataset.days);
    });
  });
  // チャレンジ送信
  sendChallengeBtn.addEventListener('click', handleSendChallenge);
  cancelChallengeBtn.addEventListener('click', closeChallengeModal);

  // チャレンジ承認
  confirmAcceptBtn.addEventListener('click', handleAcceptChallenge);
  declineChallengeBtn.addEventListener('click', handleDeclineChallenge);

  // モーダル外クリック
  challengeModal.addEventListener('click', (e) => {
    if (e.target === challengeModal) closeChallengeModal();
  });
  acceptModal.addEventListener('click', (e) => {
    if (e.target === acceptModal) closeAcceptModal();
  });

}

// ============================================
// 自分のユーザーID表示
// ============================================

function displayMyUserId() {
  myUserIdElement.textContent = currentUserData?.userID || '未設定';
}

async function copyMyUserId() {
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
// フレンド検索
// ============================================

async function handleSearchFriend(e) {
  e.preventDefault();

  const friendId = friendIdInput.value.trim();

  if (!friendId) {
    showError('ユーザーIDを入力してください');
    return;
  }

  // 自分のIDかチェック
  if (friendId === currentUserData?.userID) {
    showError('自分自身を追加することはできません');
    return;
  }

  try {
    toggleLoading(true);

    // ユーザーを検索
    const user = await findUserByUserId(friendId);

    if (!user) {
      showError('ユーザーが見つかりませんでした');
      searchResult.style.display = 'none';
      return;
    }

    // 既にフレンドかチェック
    if (currentUserData?.friends?.includes(user.id)) {
      showError('既にフレンドです');
      searchResult.style.display = 'none';
      return;
    }

    // 検索結果を表示
    foundUser = user;
    resultAvatar.src = getIconUrl(user.iconURL);
    resultUsername.textContent = user.username;
    searchResult.style.display = 'flex';
    hideError();
  } catch (error) {
    console.error('ユーザー検索エラー:', error);
    showError('検索中にエラーが発生しました');
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// フレンド追加
// ============================================

async function handleAddFriend() {
  if (!foundUser) return;

  try {
    toggleLoading(true);

    // 自分のフレンドリストに追加
    await db.collection('users').doc(currentUser.uid).update({
      friends: firebase.firestore.FieldValue.arrayUnion(foundUser.id)
    });

    // 相手のフレンドリストにも追加（相互フレンド）
    await db.collection('users').doc(foundUser.id).update({
      friends: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
    });

    // ローカルデータを更新
    if (!currentUserData.friends) {
      currentUserData.friends = [];
    }
    currentUserData.friends.push(foundUser.id);

    // UIをリセット
    friendIdInput.value = '';
    searchResult.style.display = 'none';
    foundUser = null;

    // フレンドリストを再読み込み
    await loadFriendsList();

    showSuccess('フレンドを追加しました');
  } catch (error) {
    console.error('フレンド追加エラー:', error);
    showError('フレンドの追加に失敗しました');
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// フレンドリスト読み込み
// ============================================

async function loadFriendsList() {
  try {
    const friends = currentUserData?.friends || [];

    // フレンド数を表示
    friendCountElement.textContent = `(${friends.length})`;

    if (friends.length === 0) {
      emptyFriendsElement.style.display = 'block';
      return;
    }

    emptyFriendsElement.style.display = 'none';

    // フレンド情報を取得
    const friendsData = [];
    for (const friendId of friends) {
      const friendData = await getUserData(friendId);
      if (friendData) {
        friendsData.push({
          id: friendId,
          username: friendData.username,
          userID: friendData.userID,
          iconURL: friendData.iconURL,
          totalScore: friendData.totalScore || 0
        });
      }
    }

    // スコアで降順ソート
    friendsData.sort((a, b) => b.totalScore - a.totalScore);

    // フレンドリストを表示
    const friendsHTML = friendsData.map((friend) => `
      <div class="friend-item" data-friend-id="${friend.id}">
        <img src="${getIconUrl(friend.iconURL)}" alt="" class="friend-avatar">
        <div class="friend-info">
          <span class="friend-name">${escapeHtml(friend.username)}</span>
          <span class="friend-id">${friend.userID}</span>
        </div>
        <div class="friend-score">
          <span class="friend-score-value">${friend.totalScore.toLocaleString()}</span>
          <span class="friend-score-label">合計pt</span>
        </div>
        <div class="friend-actions">
          <button class="challenge-btn" data-friend-id="${friend.id}" data-friend-name="${escapeHtml(friend.username)}" title="チャレンジ">
            <i data-lucide="swords"></i>
          </button>
          <button class="delete-friend-btn" data-friend-id="${friend.id}" data-friend-name="${escapeHtml(friend.username)}" title="削除">
          <i data-lucide="trash"></i>  
        </button>
        </div>
      </div>
    `).join('');

    friendsListElement.innerHTML = friendsHTML + emptyFriendsElement.outerHTML;

    // 削除ボタンのイベントリスナー
    document.querySelectorAll('.delete-friend-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const friendId = e.currentTarget.dataset.friendId;
        const friendName = e.currentTarget.dataset.friendName;
        openDeleteModal(friendId, friendName);
      });
    });
    // チャレンジボタンのイベントリスナー
    document.querySelectorAll('.challenge-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const friendId = e.currentTarget.dataset.friendId;
        const friendName = e.currentTarget.dataset.friendName;
        openChallengeModal(friendId, friendName);
      });
    });

    // 動的に追加したLucideアイコンを初期化
    lucide.createIcons();
  } catch (error) {
    console.error('フレンドリスト取得エラー:', error);
  }
}
// ============================================
// フレンド削除
// ============================================

function openDeleteModal(friendId, friendName) {
  deleteTargetId = friendId;
  deleteTargetName.textContent = friendName;
  deleteModal.classList.add('active');
}

function closeDeleteModal() {
  deleteTargetId = null;
  deleteModal.classList.remove('active');
}

async function handleDeleteFriend() {
  if (!deleteTargetId) return;

  try {
    toggleLoading(true);

    // 自分のフレンドリストから削除
    await db.collection('users').doc(currentUser.uid).update({
      friends: firebase.firestore.FieldValue.arrayRemove(deleteTargetId)
    });

    // 相手のフレンドリストからも削除
    await db.collection('users').doc(deleteTargetId).update({
      friends: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
    });

    // ローカルデータを更新
    currentUserData.friends = currentUserData.friends.filter((id) => id !== deleteTargetId);

    // モーダルを閉じる
    closeDeleteModal();

    // フレンドリストを再読み込み
    await loadFriendsList();

    showSuccess('フレンドを削除しました');
  } catch (error) {
    console.error('フレンド削除エラー:', error);
    showError('フレンドの削除に失敗しました');
  } finally {
    toggleLoading(false);
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

// ============================================
// チャレンジモーダル
// ============================================

function openChallengeModal(friendId, friendName) {
  challengeTargetId = friendId;
  challengeTargetName = friendName;
  challengeTargetNameEl.textContent = friendName;

  // デフォルトの期間をリセット
  selectedDuration = 3;
  durationBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.days === '3');
  });
  challengeModal.classList.add('active');
}
function closeChallengeModal() {
  challengeTargetId = null;
  challengeTargetName = null;
  challengeModal.classList.remove('active');
}
function closeAcceptModal() {
  pendingChallengeId = null;
  acceptModal.classList.remove('active');
}

// ============================================
// チャレンジ送信
// ============================================
async function handleSendChallenge() {
  if (!challengeTargetId) return;

  try {
    toggleLoading(true);

    // 既に進行中のチャレンジがないかチェック
    const existingChallenge = await db.collection('challenges')
      .where('status', '==', 'active')
      .where('creatorId', '==', currentUser.uid)
      .where('opponentId', '==', challengeTargetId)
      .get();

    if (!existingChallenge.empty) {
      showError('この相手とは既にチャレンジ中です');
      closeChallengeModal();
      return;
    }

    // チャレンジを作成
    await db.collection('challenges').add({
      creatorId: currentUser.uid,
      creatorName: currentUserData.username,
      opponentId: challengeTargetId,
      opponentName: challengeTargetName,
      status: 'pending',
      duration: selectedDuration,
      startDate: null,
      endDate: null,
      creatorScore: 0,
      opponentScore: 0,
      winnerId: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    closeChallengeModal();
    showSuccess(`${challengeTargetName}さんにチャレンジを送りました！`);

    // チャレンジリストを更新
    await loadChallenges();
  } catch (error) {
    console.error('チャレンジ送信エラー:', error);
    showError('チャレンジの送信に失敗しました');
  } finally {
    toggleLoading(false);
  }
}
// ============================================
// チャレンジ承認・拒否
// ============================================
function openAcceptModal(challengeId,challengerName, duration){
  pendingChallengeId = challengeId;
  acceptChallengerName.textContent = challengerName;
  acceptDuration.textContent = duration;
  acceptModal.classList.add('active');
}

async function handleAcceptChallenge() {
  if (!pendingChallengeId) return;

  try {
    toggleLoading(true);

    const now = new Date();
    const challengeDoc = await db.collection('challenges').doc(pendingChallengeId).get();
    const challengeData = challengeDoc.data();

    // 終了日を計算
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + challengeData.duration);

    // チャレンジを開始
    await db.collection('challenges').doc(pendingChallengeId).update({
      status: 'active',
      startDate: firebase.firestore.Timestamp.fromDate(now),
      endDate: firebase.firestore.Timestamp.fromDate(endDate)
    });

    closeAcceptModal();
    showSuccess('チャレンジを受けました！頑張りましょう！');

    await loadChallenges();
  } catch (error) {
    console.error('チャレンジ承認エラー:', error);
    showError('チャレンジの承認に失敗しました');
  } finally {
    toggleLoading(false);
  }
}

async function handleDeclineChallenge() {
  if (!pendingChallengeId) return;

  try {
    toggleLoading(true);

    // チャレンジを削除
    await db.collection('challenges').doc(pendingChallengeId).delete();

    closeAcceptModal();
    showSuccess('チャレンジを断りました');

    await loadChallenges();
  } catch (error) {
    console.error('チャレンジ拒否エラー:', error);
    showError('処理に失敗しました');
  } finally {
    toggleLoading(false);
  }
}
// ============================================
// チャレンジ読み込み
// ============================================
async function loadChallenges() {
  try {
    // 1. チャレンジデータの取得（既存ロジック）
    const [creatorChallenges, opponentChallenges] = await Promise.all([
      db.collection('challenges').where('creatorId', '==', currentUser.uid).orderBy('createdAt', 'desc').get(),
      db.collection('challenges').where('opponentId', '==', currentUser.uid).orderBy('createdAt', 'desc').get()
    ]);

    let allChallenges = [];
    creatorChallenges.forEach(doc => allChallenges.push({ id: doc.id, ...doc.data(), isCreator: true }));
    opponentChallenges.forEach(doc => allChallenges.push({ id: doc.id, ...doc.data(), isCreator: false }));

    // チャレンジのスコアを最新化
    for (let challenge of allChallenges) {
      if (challenge.status === 'active') {
        const cScore = await calculateChallengeScore(challenge.creatorId, challenge.startDate, challenge.endDate);
        const oScore = await calculateChallengeScore(challenge.opponentId, challenge.startDate, challenge.endDate);
        
        // 画面表示用のオブジェクトを更新
        challenge.creatorScore = cScore;
        challenge.opponentScore = oScore;

        // DBにも反映させておきたい場合はここでupdate（任意）
        await db.collection('challenges').doc(challenge.id).update({ creatorScore: cScore, opponentScore: oScore });
      }
    }

    // 3. 分類と描画（既存ロジック）
    const pending = allChallenges.filter(c => c.status === 'pending' && !c.isCreator);
    const active = allChallenges.filter(c => c.status === 'active');
    const completed = allChallenges.filter(c => c.status === 'completed');

    renderPendingChallenges(pending);
    renderActiveChallenges(active);
    renderCompletedChallenges(completed);

    for (const challenge of active) {
      await checkChallengeEnd(challenge);
    }
  } catch (error) {
    console.error('チャレンジ読み込みエラー:', error);
  }
}
// ============================================
// チャレンジ表示
// ============================================
function renderPendingChallenges(challenges) {
  const container = document.getElementById('pending-list');
  const emptyEl = document.getElementById('empty-pending');

  if (challenges.length === 0) {
    container.innerHTML = '';
    container.appendChild(emptyEl);
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';

  const html = challenges.map(c => `
    <div class="challenge-card">
      <div class="challenge-header">
        <div class="challenge-opponent">
          <span class="challenge-opponent-name">${escapeHtml(c.creatorName)}</span>
        </div>
        <span class="challenge-status pending">承認待ち</span>
      </div>
      <p class="challenge-info">期間: ${c.duration}日間</p>
      <div class="challenge-actions">
        <button class="btn btn-primary accept-challenge-btn"
                data-id="${c.id}"
                data-name="${escapeHtml(c.creatorName)}"
                data-duration="${c.duration}">
          受ける！
        </button>
        <button class="btn btn-danger decline-btn" data-id="${c.id}">断る</button>
      </div>
    </div>
  `).join('');

  container.innerHTML = html;

  // イベントリスナー追加
  container.querySelectorAll('.accept-challenge-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      openAcceptModal(btn.dataset.id, btn.dataset.name, btn.dataset.duration);
    });
  });

  container.querySelectorAll('.decline-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      pendingChallengeId = btn.dataset.id;
      await handleDeclineChallenge();
    });
  });
}

function renderActiveChallenges(challenges) {
  const container = document.getElementById('active-list');
  const emptyEl = document.getElementById('empty-active');

  if (challenges.length === 0) {
    container.innerHTML = '';
    container.appendChild(emptyEl);
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';

  const html = challenges.map(c => {
    const opponentName = c.isCreator ? c.opponentName : c.creatorName;
    const myScore = c.isCreator ? c.creatorScore : c.opponentScore;
    const theirScore = c.isCreator ? c.opponentScore : c.creatorScore;
    const isWinning = myScore > theirScore;
    const remaining = getRemainingTime(c.endDate);

    return `
      <div class="challenge-card">
        <div class="challenge-header">
          <div class="challenge-opponent">
            <span class="challenge-opponent-name">vs ${escapeHtml(opponentName)}</span>
          </div>
          <span class="challenge-status active">進行中</span>
        </div>
        <div class="challenge-scores">
          <div class="challenge-player">
            <span class="challenge-player-label">あなた</span>
            <span class="challenge-player-score ${isWinning ? 'winning' : 'losing'}">${myScore.toLocaleString()}</span>
          </div>
          <span class="challenge-vs">VS</span>
          <div class="challenge-player">
            <span class="challenge-player-label">${escapeHtml(opponentName)}</span>
            <span class="challenge-player-score ${!isWinning && myScore !== theirScore ? 'winning' : 'losing'}">${theirScore.toLocaleString()}</span>
          </div>
        </div>
        <p class="challenge-time">残り <span class="challenge-time-value">${remaining}</span></p>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

function renderCompletedChallenges(challenges) {
  const container = document.getElementById('completed-list');
  const emptyEl = document.getElementById('empty-completed');

  if (challenges.length === 0) {
    container.innerHTML = '';
    container.appendChild(emptyEl);
    emptyEl.style.display = 'block';
    return;
  }

  emptyEl.style.display = 'none';

  const html = challenges.slice(0, 5).map(c => {
    const opponentName = c.isCreator ? c.opponentName : c.creatorName;
    const myScore = c.isCreator ? c.creatorScore : c.opponentScore;
    const theirScore = c.isCreator ? c.opponentScore : c.creatorScore;

    let result, statusClass;
    if (c.winnerId === currentUser.uid) {
      result = '勝利！';
      statusClass = 'won';
    } else if (c.winnerId === null) {
      result = '引き分け';
      statusClass = 'draw';
    } else {
      result = '敗北';
      statusClass = 'lost';
    }

    return `
      <div class="challenge-card">
        <div class="challenge-header">
          <span class="challenge-opponent-name">vs ${escapeHtml(opponentName)}</span>
          <span class="challenge-status ${statusClass}">${result}</span>
        </div>
        <div class="challenge-scores">
          <span>${myScore.toLocaleString()} - ${theirScore.toLocaleString()}</span>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}
// ============================================
// ユーティリティ
// ============================================
//残り時間を計算
function getRemainingTime(endDate) {
  if (!endDate) return '-';

  const end = endDate.toDate ? endDate.toDate() : new Date(endDate);
  const now = new Date();
  const diff = end - now;

  if (diff <= 0) return '終了';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}日${hours}時間`;
  }
  return `${hours}時間`;
}

//チャレンジ終了をチェック
async function checkChallengeEnd(challenge) {
  if (!challenge.endDate) return;

  const end = challenge.endDate.toDate ? challenge.endDate.toDate() : new Date(challenge.endDate);
  const now = new Date();

  if (now >= end && challenge.status === 'active') {
    // 勝敗を決定
    let winnerId = null;
    if (challenge.creatorScore > challenge.opponentScore) {
      winnerId = challenge.creatorId;
    } else if (challenge.opponentScore > challenge.creatorScore) {
      winnerId = challenge.opponentId;
    }
    // 同点の場合はnull（引き分け）

    await db.collection('challenges').doc(challenge.id).update({
      status: 'completed',
      winnerId: winnerId
    });
  }
}
async function calculateChallengeScore(userId, startDate, endDate) {
  const snapshot = await db.collection('trainings')
    .where('userId', '==', userId)
    .where('timestamp', '>=', startDate)
    .where('timestamp', '<=', endDate)
    .get();

  let total = 0;
  snapshot.forEach(doc => {
    total += doc.data().score || 0;
  });
  return total;
}
