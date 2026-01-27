/**
 * フレンドページのJavaScript
 */

// グローバル変数
let currentUser = null;
let currentUserData = null;
let foundUser = null;
let deleteTargetId = null;

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
        const todayScore = await getTodayScore(friendId);
        friendsData.push({
          id: friendId,
          username: friendData.username,
          userID: friendData.userID,
          iconURL: friendData.iconURL,
          todayScore: todayScore
        });
      }
    }

    // スコアで降順ソート
    friendsData.sort((a, b) => b.todayScore - a.todayScore);

    // フレンドリストを表示
    const friendsHTML = friendsData.map((friend) => `
      <div class="friend-item" data-friend-id="${friend.id}">
        <img src="${getIconUrl(friend.iconURL)}" alt="" class="friend-avatar">
        <div class="friend-info">
          <span class="friend-name">${escapeHtml(friend.username)}</span>
          <span class="friend-id">${friend.userID}</span>
        </div>
        <div class="friend-score">
          <span class="friend-score-value">${friend.todayScore.toLocaleString()}</span>
          <span class="friend-score-label">今日のpt</span>
        </div>
        <button class="delete-friend-btn" data-friend-id="${friend.id}" data-friend-name="${escapeHtml(friend.username)}" title="削除">
          🗑️
        </button>
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
