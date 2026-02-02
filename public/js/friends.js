/**
 * フレンドページのJavaScript（完全修正版）
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

// チャレンジDOM
const challengeModal = document.getElementById('challenge-modal');
const challengeTargetNameEl = document.getElementById('challenge-target-name');
const durationBtns = document.querySelectorAll('.duration-btn');
const durationPresetBtns = document.querySelectorAll('.duration-preset-btn');
const sendChallengeBtn = document.getElementById('send-challenge-btn');
const cancelChallengeBtn = document.getElementById('cancel-challenge-btn');
const acceptModal = document.getElementById('accept-modal');
const acceptChallengerName = document.getElementById('accept-challenger-name');
const acceptChallengerAvatar = document.getElementById('accept-challenger-avatar');
const acceptDuration = document.getElementById('accept-duration');
const confirmAcceptBtn = document.getElementById('confirm-accept-btn');
const declineChallengeBtn = document.getElementById('decline-challenge-btn');
const challengeDurationInput = document.getElementById('challenge-duration-input');
const challengeMyAvatar = document.getElementById('challenge-my-avatar');
const challengeOpponentAvatar = document.getElementById('challenge-opponent-avatar');

// ============================================
// 初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  requireAuth(async (user) => {
    currentUser = user;
    toggleLoading(true);

    try {
      currentUserData = await getUserData(user.uid);
      displayMyUserId();
      await loadFriendsList();
      await loadChallenges();
    } catch (error) {
      console.error('データ読み込みエラー:', error);
    } finally {
      toggleLoading(false);
    }
  });

  setupEventListeners();

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});

// ============================================
// イベントリスナー
// ============================================

function setupEventListeners() {
  addFriendForm.addEventListener('submit', handleSearchFriend);
  confirmAddBtn.addEventListener('click', handleAddFriend);
  copyIdBtn.addEventListener('click', copyMyUserId);
  confirmDeleteBtn.addEventListener('click', handleDeleteFriend);
  cancelDeleteBtn.addEventListener('click', closeDeleteModal);

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
  });

  friendIdInput.addEventListener('input', () => {
    hideError();
    searchResult.style.display = 'none';
    foundUser = null;
  });

  durationBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDuration = parseInt(btn.dataset.days);
      if (challengeDurationInput) challengeDurationInput.value = selectedDuration;
    });
  });

  // 新しいプリセットボタン
  durationPresetBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      durationPresetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedDuration = parseInt(btn.dataset.days);
      if (challengeDurationInput) challengeDurationInput.value = selectedDuration;
    });
  });

  // 入力欄の変更でプリセットボタンを同期
  if (challengeDurationInput) {
    challengeDurationInput.addEventListener('input', () => {
      const value = parseInt(challengeDurationInput.value);
      if (!isNaN(value)) {
        selectedDuration = value;
        // プリセットボタンの選択を更新
        durationPresetBtns.forEach(btn => {
          if (parseInt(btn.dataset.days) === value) {
            btn.classList.add('active');
          } else {
            btn.classList.remove('active');
          }
        });
      }
    });
  }

  sendChallengeBtn.addEventListener('click', handleSendChallenge);
  cancelChallengeBtn.addEventListener('click', closeChallengeModal);
  confirmAcceptBtn.addEventListener('click', handleAcceptChallenge);
  declineChallengeBtn.addEventListener('click', handleDeclineChallenge);

  challengeModal.addEventListener('click', (e) => {
    if (e.target === challengeModal) closeChallengeModal();
  });
  acceptModal.addEventListener('click', (e) => {
    if (e.target === acceptModal) closeAcceptModal();
  });
}

// ============================================
// フレンド管理ロジック
// ============================================

function displayMyUserId() {
  myUserIdElement.textContent = currentUserData?.userID || '未設定';
}

async function copyMyUserId() {
  const userId = currentUserData?.userID;
  if (!userId) return;
  const success = await copyToClipboard(userId);
  if (success) showSuccess('ユーザーIDをコピーしました');
}

async function handleSearchFriend(e) {
  e.preventDefault();
  const friendId = friendIdInput.value.trim();
  if (!friendId) return showError('ユーザーIDを入力してください');
  if (friendId === currentUserData?.userID) return showError('自分自身を追加することはできません');

  try {
    toggleLoading(true);
    const user = await findUserByUserId(friendId);
    if (!user) {
      showError('ユーザーが見つかりませんでした');
      searchResult.style.display = 'none';
      return;
    }
    if (currentUserData?.friends?.includes(user.id)) {
      showError('既にフレンドです');
      searchResult.style.display = 'none';
      return;
    }
    foundUser = user;
    resultAvatar.src = getIconUrl(user.iconURL, user.username);
    resultUsername.textContent = user.username;
    searchResult.style.display = 'flex';
    hideError();
  } catch (error) {
    showError('検索中にエラーが発生しました');
  } finally {
    toggleLoading(false);
  }
}

async function handleAddFriend() {
  if (!foundUser) return;
  try {
    toggleLoading(true);
    await db.collection('users').doc(currentUser.uid).update({
      friends: firebase.firestore.FieldValue.arrayUnion(foundUser.id)
    });
    await db.collection('users').doc(foundUser.id).update({
      friends: firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
    });

    if (!currentUserData.friends) currentUserData.friends = [];
    currentUserData.friends.push(foundUser.id);

    friendIdInput.value = '';
    searchResult.style.display = 'none';
    foundUser = null;
    await loadFriendsList();
    showSuccess('フレンドを追加しました');
  } catch (error) {
    showError('フレンドの追加に失敗しました');
  } finally {
    toggleLoading(false);
  }
}

async function loadFriendsList() {
  try {
    const friends = currentUserData?.friends || [];
    friendCountElement.textContent = `(${friends.length})`;

    if (friends.length === 0) {
      emptyFriendsElement.style.display = 'block';
      friendsListElement.innerHTML = emptyFriendsElement.outerHTML;
      return;
    }

    emptyFriendsElement.style.display = 'none';
    const friendsData = [];
    for (const friendId of friends) {
      const friendData = await getUserData(friendId);
      if (friendData) {
        friendsData.push({ id: friendId, ...friendData });
      }
    }

    friendsData.sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

    const html = friendsData.map(f => `
      <div class="friend-item">
        <img src="${getIconUrl(f.iconURL, f.username)}" alt="" class="friend-avatar">
        <div class="friend-info">
          <span class="friend-name">${escapeHtml(f.username)}</span>
          <span class="friend-id">${f.userID}</span>
        </div>
        <div class="friend-score">
          <span class="friend-score-value">${(f.totalScore || 0).toLocaleString()}</span>
          <span class="friend-score-label">合計pt</span>
        </div>
        <div class="friend-actions">
          <button class="challenge-btn" data-id="${f.id}" data-name="${escapeHtml(f.username)}">
            <i data-lucide="swords"></i>
          </button>
          <button class="delete-friend-btn" data-id="${f.id}" data-name="${escapeHtml(f.username)}">
            <i data-lucide="trash"></i>
          </button>
        </div>
      </div>
    `).join('');

    friendsListElement.innerHTML = html;

    document.querySelectorAll('.delete-friend-btn').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.id, btn.dataset.name));
    });
    document.querySelectorAll('.challenge-btn').forEach(btn => {
      btn.addEventListener('click', () => openChallengeModal(btn.dataset.id, btn.dataset.name));
    });

    lucide.createIcons();
  } catch (error) {
    console.error('フレンドリスト取得エラー:', error);
  }
}

function openDeleteModal(id, name) {
  deleteTargetId = id;
  deleteTargetName.textContent = name;
  deleteModal.classList.add('active');
}
function closeDeleteModal() {
  deleteModal.classList.remove('active');
}

async function handleDeleteFriend() {
  if (!deleteTargetId) return;
  try {
    toggleLoading(true);
    await db.collection('users').doc(currentUser.uid).update({
      friends: firebase.firestore.FieldValue.arrayRemove(deleteTargetId)
    });
    await db.collection('users').doc(deleteTargetId).update({
      friends: firebase.firestore.FieldValue.arrayRemove(currentUser.uid)
    });
    currentUserData.friends = currentUserData.friends.filter(id => id !== deleteTargetId);
    closeDeleteModal();
    await loadFriendsList();
    showSuccess('フレンドを削除しました');
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// チャレンジロジック（重複制限付き）
// ============================================

async function openChallengeModal(id, name) {
  challengeTargetId = id;
  challengeTargetName = name;
  challengeTargetNameEl.textContent = name;

  // 自分のアバターを設定
  if (challengeMyAvatar && currentUserData) {
    challengeMyAvatar.src = getIconUrl(currentUserData.iconURL, currentUserData.username);
  }

  // 相手のアバターを設定
  if (challengeOpponentAvatar) {
    try {
      const opponentData = await getUserData(id);
      if (opponentData) {
        challengeOpponentAvatar.src = getIconUrl(opponentData.iconURL, opponentData.username);
      }
    } catch (e) {
      challengeOpponentAvatar.src = getIconUrl('', name);
    }
  }

  // 期間をデフォルト7日に設定
  selectedDuration = 7;
  if (challengeDurationInput) challengeDurationInput.value = 7;

  // プリセットボタンのアクティブ状態をリセット
  durationPresetBtns.forEach(btn => {
    if (parseInt(btn.dataset.days) === 7) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  challengeModal.classList.add('active');
  lucide.createIcons();
}
function closeChallengeModal() {
  challengeModal.classList.remove('active');
}
function closeAcceptModal() {
  acceptModal.classList.remove('active');
}

async function handleSendChallenge() {
  if (!challengeTargetId) return;
  const durationValue = parseInt(challengeDurationInput.value, 10);
  if (isNaN(durationValue) || durationValue < 1 || durationValue > 30) {
    return showError('期間は1日〜30日の間で入力してください');
  }

  try {
    toggleLoading(true);

    // ★ 同時対戦制限：自分と相手の間に pending/active がないかチェック
    const existing = await db.collection('challenges')
      .where('status', 'in', ['pending', 'active'])
      .get();

    const isAlreadyFighting = existing.docs.some(doc => {
      const d = doc.data();
      const p = [d.creatorId, d.opponentId];
      return p.includes(currentUser.uid) && p.includes(challengeTargetId);
    });

    if (isAlreadyFighting) {
      showError('この相手とは既に申請中、または対戦中のチャレンジがあります。');
      closeChallengeModal();
      return;
    }

    await db.collection('challenges').add({
      creatorId: currentUser.uid,
      creatorName: currentUserData.username,
      opponentId: challengeTargetId,
      opponentName: challengeTargetName,
      status: 'pending',
      duration: durationValue,
      startDate: null,
      endDate: null,
      creatorScore: 0,
      opponentScore: 0,
      winnerId: null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    closeChallengeModal();
    showSuccess(`${challengeTargetName}さんに挑戦状を送りました！`);
    await loadChallenges();
  } catch (error) {
    showError('送信に失敗しました');
  } finally {
    toggleLoading(false);
  }
}

async function handleAcceptChallenge() {
  if (!pendingChallengeId) return;
  try {
    toggleLoading(true);
    const doc = await db.collection('challenges').doc(pendingChallengeId).get();
    const data = doc.data();
    const now = new Date();
    const endDate = new Date(now);
    endDate.setDate(endDate.getDate() + data.duration);

    await db.collection('challenges').doc(pendingChallengeId).update({
      status: 'active',
      startDate: firebase.firestore.Timestamp.fromDate(now),
      endDate: firebase.firestore.Timestamp.fromDate(endDate)
    });

    closeAcceptModal();
    showSuccess('対戦開始！');
    await loadChallenges();
  } finally {
    toggleLoading(false);
  }
}

async function handleDeclineChallenge() {
  if (!pendingChallengeId) return;
  try {
    toggleLoading(true);
    await db.collection('challenges').doc(pendingChallengeId).delete();
    closeAcceptModal();
    showSuccess('辞退しました');
    await loadChallenges();
  } finally {
    toggleLoading(false);
  }
}

async function loadChallenges() {
  try {
    const [q1, q2] = await Promise.all([
      db.collection('challenges').where('creatorId', '==', currentUser.uid).get(),
      db.collection('challenges').where('opponentId', '==', currentUser.uid).get()
    ]);

    let all = [];
    q1.forEach(doc => all.push({ id: doc.id, ...doc.data(), isCreator: true }));
    q2.forEach(doc => all.push({ id: doc.id, ...doc.data(), isCreator: false }));

    for (let c of all) {
      // 相手のアバターを取得
      const oppId = c.isCreator ? c.opponentId : c.creatorId;
      try {
        const oppDoc = await db.collection('users').doc(oppId).get();
        if (oppDoc.exists) {
          c.opponentAvatar = oppDoc.data().iconURL || '';
        }
      } catch (e) {
        c.opponentAvatar = '';
      }

      if (c.status === 'active') {
        const s1 = await calculateChallengeScore(c.creatorId, c.startDate, c.endDate);
        const s2 = await calculateChallengeScore(c.opponentId, c.startDate, c.endDate);
        c.creatorScore = s1;
        c.opponentScore = s2;
        await db.collection('challenges').doc(c.id).update({ creatorScore: s1, opponentScore: s2 });
      }
    }

    renderPendingChallenges(all.filter(c => c.status === 'pending' && !c.isCreator));
    renderActiveChallenges(all.filter(c => c.status === 'active'));
    renderCompletedChallenges(all.filter(c => c.status === 'completed'));

    startCountdown();
    for (const c of all.filter(c => c.status === 'active')) {
      await checkChallengeEnd(c);
    }
  } catch (error) {
    console.error('チャレンジ読込エラー:', error);
  }
}

// ============================================
// 表示用サブ関数
// ============================================

function renderPendingChallenges(challenges) {
  const container = document.getElementById('pending-list');
  const emptyEl = document.getElementById('empty-pending');
  if (!container) return;

  if (challenges.length === 0) {
    container.innerHTML = '';
    if (emptyEl) {
      emptyEl.style.display = 'block';
      container.appendChild(emptyEl);
    }
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  container.innerHTML = challenges.map(c => `
    <div class="challenge-card">
      <div class="challenge-header">
        <div class="challenge-opponent">
          <span class="challenge-vs-label">vs</span>
          <img src="${getIconUrl(c.opponentAvatar, c.creatorName)}" alt="" class="challenge-opponent-avatar">
          <span class="challenge-opponent-name">${escapeHtml(c.creatorName)}</span>
        </div>
        <span class="challenge-status pending">承認待ち</span>
      </div>
      <p class="challenge-info">期間: ${c.duration}日間</p>
      <div class="challenge-actions">
        <button class="btn btn-primary accept-btn" data-id="${c.id}" data-name="${escapeHtml(c.creatorName)}" data-dur="${c.duration}" data-avatar="${getIconUrl(c.opponentAvatar, c.creatorName)}">受ける</button>
        <button class="btn btn-danger decline-btn" data-id="${c.id}">断る</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.accept-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pendingChallengeId = btn.dataset.id;
      acceptChallengerName.textContent = btn.dataset.name;
      acceptDuration.textContent = btn.dataset.dur;
      if (acceptChallengerAvatar) {
        acceptChallengerAvatar.src = btn.dataset.avatar || getIconUrl('', btn.dataset.name);
      }
      acceptModal.classList.add('active');
      lucide.createIcons();
    });
  });
  container.querySelectorAll('.decline-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      pendingChallengeId = btn.dataset.id;
      handleDeclineChallenge();
    });
  });
}

function renderActiveChallenges(challenges) {
  const container = document.getElementById('active-list');
  const emptyEl = document.getElementById('empty-active');
  if (!container) return;

  if (challenges.length === 0) {
    container.innerHTML = '';
    if (emptyEl) {
      emptyEl.style.display = 'block';
      container.appendChild(emptyEl);
    }
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  container.innerHTML = challenges.map(c => {
    const oppName = c.isCreator ? c.opponentName : c.creatorName;
    const myS = c.isCreator ? c.creatorScore : c.opponentScore;
    const oppS = c.isCreator ? c.opponentScore : c.creatorScore;
    const endTime = c.endDate.toDate ? c.endDate.toDate().getTime() : new Date(c.endDate).getTime();
    
    return `
      <div class="challenge-card">
        <div class="challenge-header">
          <div class="challenge-opponent">
            <span class="challenge-vs-label">vs</span>
            <img src="${getIconUrl(c.opponentAvatar, oppName)}" alt="" class="challenge-opponent-avatar">
            <span class="challenge-opponent-name">${escapeHtml(oppName)}</span>
          </div>
          <span class="challenge-status active">対戦中</span>
        </div>
        <div class="challenge-scores">
          <div class="challenge-player">
            <span>あなた</span>
            <span class="challenge-player-score ${myS > oppS ? 'winning' : (myS === oppS ? '' : 'losing')}">${myS.toLocaleString()}</span>
          </div>
          <span class="challenge-vs">VS</span>
          <div class="challenge-player">
            <span>${escapeHtml(oppName)}</span>
            <span class="challenge-player-score ${oppS > myS ? 'winning' : (myS === oppS ? '' : 'losing')}">${oppS.toLocaleString()}</span>
          </div>
        </div>
        <p class="challenge-time">残り <span class="js-remaining-time" data-end="${endTime}">--:--:--</span></p>
      </div>
    `;
  }).join('');
}

function renderCompletedChallenges(challenges) {
  const container = document.getElementById('completed-list');
  const emptyEl = document.getElementById('empty-completed');
  if (!container) return;

  if (challenges.length === 0) {
    container.innerHTML = '';
    if (emptyEl) {
      emptyEl.style.display = 'block';
      container.appendChild(emptyEl);
    }
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  container.innerHTML = challenges.slice(0, 5).map(c => {
    const oppName = c.isCreator ? c.opponentName : c.creatorName;
    const myS = c.isCreator ? c.creatorScore : c.opponentScore;
    const oppS = c.isCreator ? c.opponentScore : c.creatorScore;
    let res = c.winnerId === currentUser.uid ? '勝利！' : (c.winnerId === null ? '引き分け' : '敗北');
    let cls = c.winnerId === currentUser.uid ? 'won' : (c.winnerId === null ? 'draw' : 'lost');

    return `
      <div class="challenge-card">
        <div class="challenge-header">
          <div class="challenge-opponent">
            <span class="challenge-vs-label">vs</span>
            <img src="${getIconUrl(c.opponentAvatar, oppName)}" alt="" class="challenge-opponent-avatar">
            <span class="challenge-opponent-name">${escapeHtml(oppName)}</span>
          </div>
          <span class="challenge-status ${cls}">${res}</span>
        </div>
        <div class="challenge-scores">
          <div class="challenge-player">
            <span>あなた</span>
            <span class="challenge-player-score ${myS > oppS ? 'winning' : (myS === oppS ? '' : 'losing')}">${myS.toLocaleString()}</span>
          </div>
          <span class="challenge-vs">VS</span>
          <div class="challenge-player">
            <span>${escapeHtml(oppName)}</span>
            <span class="challenge-player-score ${oppS > myS ? 'winning' : (myS === oppS ? '' : 'losing')}">${oppS.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ============================================
// 共通ユーティリティ
// ============================================

function startCountdown() {
  if (window.challengeTimer) clearInterval(window.challengeTimer);
  window.challengeTimer = setInterval(async () => {
    const els = document.querySelectorAll('.js-remaining-time');
    if (els.length === 0) return clearInterval(window.challengeTimer);

    let ended = false;
    els.forEach(el => {
      const diff = parseInt(el.dataset.end) - new Date().getTime();
      if (diff <= 0) {
        el.textContent = "終了";
        ended = true;
      } else {
        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff % 86400000) / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        el.textContent = `${d > 0 ? d + '日 ' : ''}${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
      }
    });
    if (ended) {
      clearInterval(window.challengeTimer);
      await loadChallenges();
    }
  }, 1000);
}

async function checkChallengeEnd(c) {
  const end = c.endDate.toDate ? c.endDate.toDate() : new Date(c.endDate);
  if (new Date() >= end && c.status === 'active') {
    let win = null;
    if (c.creatorScore > c.opponentScore) win = c.creatorId;
    else if (c.opponentScore > c.creatorScore) win = c.opponentId;
    await db.collection('challenges').doc(c.id).update({ status: 'completed', winnerId: win });
  }
}

async function calculateChallengeScore(uid, start, end) {
  const snap = await db.collection('trainings')
    .where('userId', '==', uid)
    .where('timestamp', '>=', start)
    .where('timestamp', '<=', end)
    .get();
  let total = 0;
  snap.forEach(doc => total += (doc.data().score || 0));
  return total;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}