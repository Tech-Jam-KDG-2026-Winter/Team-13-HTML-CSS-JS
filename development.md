# 開発ドキュメント

このドキュメントでは、Fit Fightアプリの技術的な実装詳細を説明します。

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [認証システム](#認証システム)
3. [アバターシステム](#アバターシステム)
4. [リアルタイム通知システム](#リアルタイム通知システム)
5. [チャレンジ機能](#チャレンジ機能)
6. [CSS設計](#css設計)

---

## アーキテクチャ概要

### ファイル構成

```
public/
├── css/
│   ├── common.css      # 共通スタイル、CSS変数、トースト通知
│   ├── login.css       # ログイン/登録画面（グラスモーフィズム）
│   ├── home.css        # ホーム画面
│   ├── training.css    # トレーニング記録
│   ├── friends.css     # フレンド管理
│   └── profile.css     # プロフィール
├── js/
│   ├── firebase-config.js  # Firebase設定
│   ├── utils.js            # ユーティリティ関数（アバター、通知、リスナー）
│   ├── training-data.js    # トレーニング種目データ
│   ├── login.js            # ログイン処理
│   ├── register.js         # 新規登録処理
│   ├── home.js             # ホーム画面
│   ├── training.js         # トレーニング記録
│   ├── friends.js          # フレンド管理
│   └── profile.js          # プロフィール
└── *.html                  # 各ページのHTML
```

### データフロー

```
ユーザー操作 → JavaScript → Firebase SDK → Firestore
                ↓
            onSnapshot（リアルタイム監視）
                ↓
            トースト通知表示
```

---

## 認証システム

### 新規登録フロー (`register.js`)

1. ユーザーがフォームに入力
2. ランダムなDiceBearアバターを生成（ページロード時）
3. オプションでカスタムアバターをアップロード（Cloudinary）
4. オプションで体重を入力（20〜300kg、カロリー計算精度向上のため）
5. Firebase Authenticationでアカウント作成
6. Firestoreにユーザードキュメント作成（体重含む）

```javascript
// ユーザードキュメントの構造
{
  username: "ユーザー名",
  email: "email@example.com",
  uniqueId: "username#1234",  // Discord風ID
  iconURL: "https://...",     // アバターURL
  weight: 60,                 // 体重（kg）- 任意、未設定時はnull
  friends: [],                // フレンドのUID配列
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### ログイン画面デザイン

- **グラスモーフィズム**: `backdrop-filter: blur()` と半透明背景
- **スプリットレイアウト**: PC版は左右2分割
- **アニメーション背景**: グラデーションが動的に変化
- **パスワード表示トグル**: 目のアイコンで切り替え

---

## アバターシステム

### DiceBear API

デフォルトアバターはDiceBear APIを使用して自動生成されます。

```javascript
// utils.js

// DiceBearアバターURL生成
function getDiceBearIconUrl(seed = 'default') {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
}

// アイコンURL取得（カスタムがなければDiceBear）
function getIconUrl(iconURL, username = 'default') {
  return iconURL || getDiceBearIconUrl(username);
}
```

### 新規登録時のランダムアバター

**重要**: 登録画面をリロードするたびに異なるランダムアイコンが表示されます。
ユーザーがカスタム画像をアップロードしない場合、このランダムアイコンがそのままプロフィールアイコンとして保存されます。

```javascript
// register.js
let defaultAvatarUrl = '';

document.addEventListener('DOMContentLoaded', () => {
  // ページロード時にランダムシードでアバター生成（リロードごとに変わる）
  const randomSeed = Math.random().toString(36).substring(2, 10);
  defaultAvatarUrl = `https://api.dicebear.com/7.x/adventurer/svg?seed=${randomSeed}`;
  avatarPreview.src = defaultAvatarUrl;
});

// 登録処理時
async function handleRegister() {
  // ...
  await db.collection('users').doc(user.uid).set({
    // カスタムアップロードがなければランダムアイコンを保存
    iconURL: uploadedAvatarUrl || defaultAvatarUrl,
    // ...
  });
}
```

### Cloudinaryアップロード

カスタムアバターはCloudinaryにアップロードされます。

```javascript
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dfykpdaae/image/upload';
const CLOUDINARY_PRESET = 'fitness_app';

async function uploadToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_PRESET);

  const response = await fetch(CLOUDINARY_URL, {
    method: 'POST',
    body: formData
  });

  const data = await response.json();
  return data.secure_url;
}
```

---

## リアルタイム通知システム

### トースト通知 (`utils.js`)

画面右上にポップアップ通知を表示します。

```javascript
function showToast({ title, message, type = 'challenge', duration = 5000 }) {
  // トーストコンテナを取得または作成
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // トースト要素を作成
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <div class="toast-icon">${getToastIcon(type)}</div>
      <div class="toast-text">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close">&times;</button>
    </div>
  `;

  container.appendChild(toast);

  // 自動消去
  setTimeout(() => {
    toast.classList.add('toast-fade-out');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
```

### CSSスタイル (`common.css`)

```css
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 360px;
}

.toast {
  background: rgba(20, 20, 20, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid var(--gold-30);
  border-radius: 16px;
  padding: 16px;
  animation: toastSlideIn 0.3s ease-out;
}

@keyframes toastSlideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### Firebase onSnapshotリスナー

リアルタイムでデータ変更を監視します。

```javascript
// チャレンジリスナー
function startChallengeListener(userId) {
  const db = firebase.firestore();

  // 受信チャレンジを監視
  db.collection('challenges')
    .where('opponentId', '==', userId)
    .where('status', '==', 'pending')
    .onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const challenge = change.doc.data();
          showToast({
            title: 'チャレンジ受信',
            message: `${challenge.creatorName}さんからチャレンジが届きました！`,
            type: 'challenge'
          });
        }
      });
    });
}

// フレンドリスナー
function startFriendListener(userId) {
  const db = firebase.firestore();

  db.collection('users').doc(userId)
    .onSnapshot((doc) => {
      if (doc.exists) {
        const data = doc.data();
        const currentFriends = data.friends || [];

        // フレンド追加を検知
        if (previousFriends && currentFriends.length > previousFriends.length) {
          showToast({
            title: 'フレンド追加',
            message: '新しいフレンドが追加されました！',
            type: 'friend'
          });
        }

        previousFriends = [...currentFriends];
      }
    });
}
```

### マイルストーン通知

対戦中に特定のスコアに達した時に通知を表示します。

```javascript
const MILESTONES = [1000, 2000, 3000, 5000, 10000];

// localStorageで通知済みマイルストーンを管理
function getNotifiedMilestones(challengeId) {
  try {
    const stored = localStorage.getItem(`milestones_${challengeId}`);
    return stored ? JSON.parse(stored) : { my: [], opp: [] };
  } catch (e) {
    return { my: [], opp: [] };
  }
}

function saveNotifiedMilestone(challengeId, type, milestone) {
  const notified = getNotifiedMilestones(challengeId);
  if (!notified[type].includes(milestone)) {
    notified[type].push(milestone);
    localStorage.setItem(`milestones_${challengeId}`, JSON.stringify(notified));
  }
}

function checkMilestones(challengeId, myScore, oppScore, oppName) {
  const notified = getNotifiedMilestones(challengeId);

  MILESTONES.forEach(milestone => {
    // 自分のマイルストーン
    if (myScore >= milestone && !notified.my.includes(milestone)) {
      showToast({
        title: 'マイルストーン達成！',
        message: `${milestone.toLocaleString()}ポイントに到達しました！`,
        type: 'milestone'
      });
      saveNotifiedMilestone(challengeId, 'my', milestone);
    }

    // 相手のマイルストーン
    if (oppScore >= milestone && !notified.opp.includes(milestone)) {
      showToast({
        title: '相手がマイルストーン達成',
        message: `${oppName}さんが${milestone.toLocaleString()}ポイントに到達！`,
        type: 'milestone'
      });
      saveNotifiedMilestone(challengeId, 'opp', milestone);
    }
  });
}
```

---

## チャレンジ機能

### データ構造

```javascript
// challenges コレクション
{
  creatorId: "uid",
  creatorName: "ユーザー名",
  opponentId: "uid",
  opponentName: "ユーザー名",
  duration: 7,              // 日数
  status: "pending",        // pending, active, completed
  creatorScore: 0,
  opponentScore: 0,
  startTime: Timestamp,
  endTime: Timestamp,
  createdAt: Timestamp,
  winner: "creatorId"       // 終了時に設定
}
```

### ホーム画面での対戦相手アイコン表示

```javascript
// home.js
async function loadChallenges(userId) {
  const challenges = await db.collection('challenges')
    .where('status', '==', 'active')
    .get();

  for (let c of challenges) {
    const oppId = c.isCreator ? c.opponentId : c.creatorId;

    // 対戦相手のアイコンを取得
    const oppDoc = await db.collection('users').doc(oppId).get();
    if (oppDoc.exists) {
      c.opponentAvatar = oppDoc.data().iconURL || '';
    }
  }

  // テンプレートにアイコンを設定
  card.querySelector('.js-opp-avatar').src = getIconUrl(c.opponentAvatar, oppName);
}
```

---

## CSS設計

### CSS変数 (`common.css`)

```css
:root {
  /* カラーパレット */
  --black: #000000;
  --gold: #d4af37;
  --gold-light: #f4d03f;
  --white: #ffffff;

  /* 透明度バリエーション */
  --gold-10: rgba(212, 175, 55, 0.1);
  --gold-20: rgba(212, 175, 55, 0.2);
  --gold-30: rgba(212, 175, 55, 0.3);
  --white-10: rgba(255, 255, 255, 0.1);
  --white-20: rgba(255, 255, 255, 0.2);
  --white-40: rgba(255, 255, 255, 0.4);
  --white-60: rgba(255, 255, 255, 0.6);

  /* タイポグラフィ */
  --font-family: 'Poppins', sans-serif;

  /* スペーシング */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* ボーダー */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}
```

### グラスモーフィズム (`login.css`)

```css
.auth-form-container {
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid var(--gold-20);
  border-radius: var(--radius-xl);
}
```

### アニメーション背景

```css
.auth-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(212, 175, 55, 0.1) 0%,
    rgba(0, 0, 0, 0.95) 50%,
    rgba(212, 175, 55, 0.05) 100%
  );
  animation: gradientShift 8s ease-in-out infinite;
}

@keyframes gradientShift {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

---

## トラブルシューティング

### 通知が表示されない

1. `startRealtimeListeners(userId)` が呼ばれているか確認
2. ブラウザのコンソールでエラーを確認
3. Firebaseのセキュリティルールを確認

### マイルストーン通知が何度も表示される

localStorageに保存された通知済みマイルストーンを確認：

```javascript
// デバッグ用
console.log(localStorage.getItem('milestones_CHALLENGE_ID'));
```

### アバターが表示されない

1. `getIconUrl()` 関数が正しく呼ばれているか確認
2. DiceBear APIの接続を確認
3. Cloudinaryの設定を確認

---

## 体重機能

### 体重の保存と利用

ユーザーの体重を保存し、カロリー計算に使用します。

```javascript
// training.js - 体重の読み込みとカロリー計算への適用
let userWeight = 60; // デフォルト値

document.addEventListener("DOMContentLoaded", () => {
  requireAuth(async (user) => {
    const userData = await getUserData(user.uid);
    if (userData && userData.weight) {
      userWeight = userData.weight;
    }
  });
});

// カロリー計算時に体重を使用
function calculateCalories(type, value) {
  const weightFactor = userWeight / 60;
  return baseCalories * weightFactor;
}
```

### プロフィールでの体重編集

スライダーUIで直感的に体重を変更できます。

```javascript
// profile.js - スライダーと入力欄の同期
function updateWeightUI(value) {
  const numValue = parseFloat(value) || 60;
  weightValueDisplay.textContent = numValue;
  weightSlider.value = Math.min(Math.max(numValue, 20), 150);
  weightInput.value = numValue;
}

// スライダーイベント
weightSlider.addEventListener('input', (e) => {
  updateWeightUI(e.target.value);
});

// 手入力イベント（スライダー範囲外も対応）
weightInput.addEventListener('input', (e) => {
  const value = parseFloat(e.target.value);
  if (!isNaN(value)) {
    weightValueDisplay.textContent = value;
    if (value >= 20 && value <= 150) {
      weightSlider.value = value;
    }
  }
});
```

### 体重スライダーのCSS

```css
.weight-slider {
  -webkit-appearance: none;
  height: 8px;
  background: var(--white-10);
  border-radius: 4px;
}

.weight-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 24px;
  height: 24px;
  background: var(--color-gold);
  border-radius: 50%;
  cursor: pointer;
}
```

---

## 検索・お気に入り機能

### 検索機能 (`training.js`)

トレーニング種目を名前で検索できます。

```javascript
let searchQuery = "";

// 検索入力イベント
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase();
  renderTrainingTypes();
});

// フィルタリング
function filterTrainingTypes() {
  return TRAINING_TYPES.filter(type => {
    const matchesSearch = type.name.toLowerCase().includes(searchQuery);
    const matchesCategory = selectedCategory === "all" || type.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
}
```

### お気に入り機能 (`training.js`)

よく使うトレーニングをお気に入りに登録し、素早くアクセスできます。
データはlocalStorageに保存されます。

```javascript
// お気に入りの読み込み
let favorites = JSON.parse(localStorage.getItem('trainingFavorites')) || [];

// お気に入りの保存
function saveFavorites() {
  localStorage.setItem('trainingFavorites', JSON.stringify(favorites));
}

// お気に入りの切り替え
function toggleFavorite(typeId) {
  const index = favorites.indexOf(typeId);
  if (index === -1) {
    favorites.push(typeId);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites();
  renderTrainingTypes();
}
```

---

## 今後の改善点
- 消費カロリー算出ロジックの精度向上
- スコア計算の最適化
- ヘルスケアAPI連携の検討
- 目標設定機能の追加

