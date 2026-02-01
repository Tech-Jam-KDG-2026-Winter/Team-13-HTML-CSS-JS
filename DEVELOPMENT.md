# FITNESS アプリ 開発ドキュメント

このドキュメントでは、FITNESSアプリの開発過程と技術的な実装詳細を説明します。

## 目次

1. [プロジェクト構成](#プロジェクト構成)
2. [開発環境のセットアップ](#開発環境のセットアップ)
3. [アーキテクチャ](#アーキテクチャ)
4. [各機能の実装](#各機能の実装)
5. [デザイン実装](#デザイン実装)
6. [データベース設計](#データベース設計)
7. [使用した外部サービス](#使用した外部サービス)

---

## プロジェクト構成

```
Team-13-HTML-CSS-JS-challenge-friend/
├── public/                    # Webアプリ本体
│   ├── css/                   # スタイルシート
│   │   ├── common.css         # 共通スタイル（ナビ、ボタン、カード等）
│   │   ├── home.css           # ホーム画面専用
│   │   ├── training.css       # トレーニング記録画面専用
│   │   ├── ranking.css        # ランキング画面専用
│   │   ├── friends.css        # フレンド画面専用
│   │   ├── profile.css        # プロフィール画面専用
│   │   ├── login.css          # ログイン画面専用
│   │   ├── register.css       # 新規登録画面専用
│   │   └── HTMLAnimation.css  # スコアアニメーション
│   │
│   ├── js/                    # JavaScript
│   │   ├── firebase-config.js # Firebase設定・初期化
│   │   ├── utils.js           # 共通ユーティリティ関数
│   │   ├── training-data.js   # トレーニング種目データ定義
│   │   ├── HTMLAnimation.js   # スコアメーターアニメーション
│   │   ├── home.js            # ホーム画面ロジック
│   │   ├── training.js        # トレーニング記録ロジック
│   │   ├── ranking.js         # ランキング画面ロジック
│   │   ├── friends.js         # フレンド・チャレンジロジック
│   │   ├── profile.js         # プロフィール画面ロジック
│   │   ├── login.js           # ログイン処理
│   │   └── register.js        # 新規登録処理
│   │
│   ├── login.html             # ログインページ
│   ├── register.html          # 新規登録ページ
│   ├── home.html              # ホーム画面
│   ├── training.html          # トレーニング記録画面
│   ├── ranking.html           # ランキング画面
│   ├── friends.html           # フレンド管理画面
│   └── profile.html           # プロフィール画面
│
├── docs/                      # ドキュメント
├── firebase.json              # Firebase Hosting設定
├── firestore.rules            # Firestoreセキュリティルール
├── firestore.indexes.json     # Firestoreインデックス設定
├── README.md                  # アプリ説明
└── DEVELOPMENT.md             # このファイル
```

---

## 開発環境のセットアップ

### 必要なツール

1. **Node.js** (v16以上)
2. **Firebase CLI**
3. **コードエディタ** (VS Code推奨)

### セットアップ手順

```bash
# 1. Firebase CLIをインストール
npm install -g firebase-tools

# 2. Firebaseにログイン
firebase login

# 3. プロジェクトフォルダに移動
cd Team-13-HTML-CSS-JS-challenge-friend

# 4. ローカルサーバー起動
firebase serve
```

ブラウザで `http://localhost:5000` を開く

---

## アーキテクチャ

### 全体構成

```
┌─────────────────────────────────────────────────────┐
│                    クライアント                      │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │   HTML    │  │    CSS    │  │JavaScript │       │
│  │  (構造)   │  │ (スタイル) │  │  (ロジック) │       │
│  └───────────┘  └───────────┘  └───────────┘       │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    Firebase                          │
│  ┌───────────────┐  ┌───────────────┐              │
│  │ Authentication │  │   Firestore   │              │
│  │   (認証)       │  │ (データベース) │              │
│  └───────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                  外部サービス                        │
│  ┌───────────────┐  ┌───────────────┐              │
│  │   Cloudinary  │  │  Lucide Icons │              │
│  │  (画像CDN)    │  │  (アイコン)    │              │
│  └───────────────┘  └───────────────┘              │
└─────────────────────────────────────────────────────┘
```

### ファイル読み込み順序

各HTMLページでのJavaScript読み込み順序：

```html
<!-- 1. Firebase SDK（CDN） -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-auth-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>

<!-- 2. Firebase設定・初期化 -->
<script src="js/firebase-config.js"></script>

<!-- 3. 共通ユーティリティ -->
<script src="js/utils.js"></script>

<!-- 4. ページ固有のスクリプト -->
<script src="js/home.js"></script>

<!-- 5. アイコンライブラリ -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

---

## 各機能の実装

### 1. ユーザー認証

**ファイル**: `login.js`, `register.js`, `utils.js`

#### 新規登録フロー

```javascript
// register.js
async function handleRegister(e) {
  e.preventDefault();

  // 1. Firebase Authでユーザー作成
  const userCredential = await auth.createUserWithEmailAndPassword(email, password);

  // 2. Firestoreにユーザードキュメント作成
  await db.collection('users').doc(userCredential.user.uid).set({
    username: username,
    email: email,
    userID: generateUserId(username),  // username#1234形式
    iconURL: '',
    totalScore: 0,
    friends: [],
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  // 3. ホーム画面へリダイレクト
  window.location.href = 'home.html';
}
```

#### 認証状態の確認

```javascript
// utils.js
function requireAuth(callback) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      callback(user);  // ログイン済み
    } else {
      window.location.href = 'login.html';  // 未ログインはリダイレクト
    }
  });
}
```

### 2. トレーニング記録

**ファイル**: `training.js`, `training-data.js`

#### トレーニング種目データ構造

```javascript
// training-data.js
const TRAINING_CATEGORIES = [
  { id: 'all', name: 'すべて' },
  { id: 'arms', name: '腕' },
  { id: 'legs', name: '足' },
  // ...
];

const TRAINING_TYPES = [
  { id: 'Squat', name: 'スクワット', category: 'legs', caloriesPerMinute: 5 },
  { id: 'running', name: 'ランニング', category: 'cardio', caloriesPerMinute: 10 },
  // 100種類以上の種目...
];
```

#### スコア計算ロジック

```javascript
// 消費カロリー計算
function calculateCaloriesNew(typeId, duration) {
  const training = getTrainingById(typeId);
  return Math.round(duration * training.caloriesPerMinute);
}

// スコア計算（カロリーの1.5倍）
function calculateScoreNew(calories) {
  return Math.round(calories * 1.5);
}
```

#### トレーニング保存

```javascript
// training.js
async function saveTraining() {
  const trainingData = {
    userId: currentUser.uid,
    type: selectedType,
    duration: duration,
    calories: calculateCaloriesNew(selectedType, duration),
    score: calculateScoreNew(calories),
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('trainings').add(trainingData);
}
```

### 3. ランキング機能

**ファイル**: `ranking.js`

#### 期間別スコア取得

```javascript
async function getRankingData(period) {
  let startDate;

  switch(period) {
    case 'today':
      startDate = getTodayStart();
      break;
    case 'weekly':
      startDate = getWeekStart();
      break;
    case 'monthly':
      startDate = getMonthStart();
      break;
    case 'total':
      startDate = null;  // 全期間
      break;
  }

  // フレンドのスコアを集計
  const rankings = await Promise.all(
    friendIds.map(async (friendId) => {
      const score = await getScoreByPeriod(friendId, startDate);
      return { id: friendId, score };
    })
  );

  // スコア順にソート
  return rankings.sort((a, b) => b.score - a.score);
}
```

### 4. チャレンジ機能

**ファイル**: `friends.js`

#### チャレンジ作成

```javascript
async function sendChallenge(opponentId, durationDays) {
  const challengeData = {
    creatorId: currentUser.uid,
    opponentId: opponentId,
    duration: durationDays,
    status: 'pending',  // pending → active → completed
    creatorScore: 0,
    opponentScore: 0,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('challenges').add(challengeData);
}
```

#### チャレンジ承認

```javascript
async function acceptChallenge(challengeId) {
  const now = new Date();
  const endDate = new Date(now.getTime() + challenge.duration * 24 * 60 * 60 * 1000);

  await db.collection('challenges').doc(challengeId).update({
    status: 'active',
    startedAt: firebase.firestore.FieldValue.serverTimestamp(),
    endAt: firebase.firestore.Timestamp.fromDate(endDate)
  });
}
```

#### スコア更新（リアルタイム）

```javascript
// トレーニング記録時にチャレンジスコアも更新
async function updateChallengeScores(userId, score) {
  const activeChallenges = await db.collection('challenges')
    .where('status', '==', 'active')
    .get();

  for (const doc of activeChallenges.docs) {
    const challenge = doc.data();

    if (challenge.creatorId === userId) {
      await doc.ref.update({
        creatorScore: firebase.firestore.FieldValue.increment(score)
      });
    } else if (challenge.opponentId === userId) {
      await doc.ref.update({
        opponentScore: firebase.firestore.FieldValue.increment(score)
      });
    }
  }
}
```

### 5. プロフィール・画像アップロード

**ファイル**: `profile.js`, `utils.js`

#### Cloudinaryへの画像アップロード

```javascript
// utils.js
async function uploadImageToCloudinary(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'Techjam');  // Cloudinaryの設定

  const res = await fetch(
    'https://api.cloudinary.com/v1_1/dflobm8ij/image/upload',
    { method: 'POST', body: formData }
  );

  const data = await res.json();
  return data.secure_url;  // アップロードされた画像のURL
}
```

#### プロフィール画像更新

```javascript
// profile.js
async function handleAvatarChange(e) {
  const file = e.target.files[0];

  // Cloudinaryにアップロード
  const imageUrl = await uploadImageToCloudinary(file);

  // Firestoreを更新
  await db.collection('users').doc(currentUser.uid).update({
    iconURL: imageUrl
  });

  // 表示を更新
  profileAvatar.src = imageUrl;
}
```

---

## デザイン実装

### CSSカスタムプロパティ（CSS変数）

```css
/* common.css */
:root {
  /* カラー */
  --color-black: #000000;
  --color-dark-gold: #B8860B;
  --color-gold: #D4AF37;
  --color-white: #FFFFFF;

  /* グラデーション */
  --gradient-gold: linear-gradient(135deg, var(--color-dark-gold), var(--color-gold));

  /* スペーシング */
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;

  /* ボーダー */
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
}
```

### レスポンシブデザイン

```css
/* モバイルファースト */
.container {
  max-width: 480px;
  padding: var(--spacing-md);
}

/* PC版（768px以上） */
@media (min-width: 768px) {
  .container {
    max-width: 1200px;
  }

  /* 2カラムレイアウト */
  .home-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: var(--spacing-lg);
  }

  /* ボトムナビをヘッダーに移動 */
  .nav-bottom {
    position: fixed;
    top: 0;
    bottom: auto;
  }
}
```

### ナビゲーション（中央ボタン強調）

```css
/* モバイル版：中央の「記録」ボタンを目立たせる */
.nav-item:nth-child(3) .nav-link {
  position: relative;
  top: -12px;
  background: var(--gradient-gold);
  border-radius: 50%;
  width: 56px;
  height: 56px;
  color: var(--color-black);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}
```

### カードコンポーネント

```css
.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}
```

---

## データベース設計

### Firestoreコレクション構造

#### users コレクション

```
users/{userId}
├── username: string        // ユーザーネーム
├── email: string           // メールアドレス
├── userID: string          // Discord風ID (例: "user#1234")
├── iconURL: string         // プロフィール画像URL
├── totalScore: number      // 累計スコア
├── friends: string[]       // フレンドのUID配列
└── createdAt: timestamp    // 作成日時
```

#### trainings コレクション

```
trainings/{trainingId}
├── userId: string          // ユーザーUID
├── type: string            // トレーニング種目ID
├── duration: number        // 時間（分）
├── calories: number        // 消費カロリー
├── score: number           // 獲得スコア
└── timestamp: timestamp    // 記録日時
```

#### challenges コレクション

```
challenges/{challengeId}
├── creatorId: string       // 作成者UID
├── opponentId: string      // 対戦相手UID
├── duration: number        // チャレンジ期間（日）
├── status: string          // "pending" | "active" | "completed"
├── creatorScore: number    // 作成者のスコア
├── opponentScore: number   // 対戦相手のスコア
├── winner: string          // 勝者のUID（完了時）
├── createdAt: timestamp    // 作成日時
├── startedAt: timestamp    // 開始日時
└── endAt: timestamp        // 終了日時
```

### 必要なインデックス

| コレクション | フィールド1 | フィールド2 |
|-------------|-----------|-----------|
| trainings | userId (昇順) | timestamp (降順) |
| trainings | userId (昇順) | timestamp (昇順) |
| challenges | creatorId (昇順) | status (昇順) |
| challenges | opponentId (昇順) | status (昇順) |

---

## 使用した外部サービス

### 1. Firebase

- **Authentication**: メール/パスワード認証
- **Firestore**: リアルタイムNoSQLデータベース
- **Hosting**: 静的サイトホスティング

### 2. Cloudinary

画像のアップロード・変換・配信を行うクラウドサービス

```javascript
// Upload Preset: Techjam
// Cloud Name: dflobm8ij
```

### 3. Lucide Icons

オープンソースのアイコンライブラリ

```html
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>

<!-- 使用例 -->
<i data-lucide="dumbbell"></i>
<i data-lucide="trophy"></i>
<i data-lucide="users"></i>
```

### 4. Chart.js

グラフ描画ライブラリ（プロフィールページのスコア推移グラフ）

```javascript
const chart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['1/25', '1/26', '1/27', ...],
    datasets: [{
      label: 'スコア',
      data: [100, 250, 180, ...],
      backgroundColor: 'rgba(212, 175, 55, 0.6)'
    }]
  }
});
```

### 5. Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

---

## 開発のポイント

### 1. モジュール化

- 共通処理は `utils.js` に集約
- トレーニングデータは `training-data.js` に分離
- ページごとにJSファイルを分割

### 2. セキュリティ

- Firestoreルールで認証済みユーザーのみアクセス許可
- 自分のデータのみ編集可能に制限
- APIキーは公開されるが、ルールで保護

### 3. UX向上

- ローディングスピナー表示
- エラー/成功メッセージのフィードバック
- アニメーションによる視覚的フィードバック
- レスポンシブ対応

### 4. パフォーマンス

- Firestoreのオフライン永続化を有効化
- 画像はCloudinaryのCDNから配信
- 必要最小限のデータのみ取得

---

## チーム

**Team-13** によって開発されました。
