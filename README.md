# Fit Fight - フィットネストラッキングアプリ

フレンドと競い合えるゲーミフィケーション型フィットネス記録アプリ

## 概要

Fit Fightは、トレーニングを記録してスコアを獲得し、フレンドとランキングで競い合えるWebアプリケーションです。ゲーミフィケーション要素を取り入れることで、トレーニングのモチベーション維持をサポートします。

## 主な機能

### 1. ユーザー認証
- メールアドレスとパスワードによる新規登録・ログイン
- Firebase Authenticationによるセキュアな認証
- モダンなログイン/登録画面（グラスモーフィズムデザイン）
- パスワード表示/非表示トグル
- **体重入力（任意）**: 登録時に体重を設定可能（カロリー計算の精度向上）
- ランダムアバター自動生成（DiceBear API）
  - 登録画面を開くたびに異なるランダムアイコンを表示
  - そのまま登録するとランダムアイコンがプロフィールに保存される
  - カスタム画像をアップロードすることも可能

### 2. トレーニング記録
- **110種類以上**のトレーニング種目から選択
- カテゴリ別フィルタリング（腕、足、腹筋、背中、胸、全身、有酸素、格闘技、柔軟、水中運動、スポーツ）
- **検索機能**: 種目名で素早く検索
- **お気に入り機能**: よく使う種目をお気に入り登録してすぐアクセス
- トレーニング時間の設定（スライダー・クイックボタン対応）
- 消費カロリーとスコアの自動計算
- **成功エフェクト**: トレーニング完了時に紙吹雪アニメーション
- **励ましメッセージ**: スコアに応じた4段階のメッセージ（100以下/通常/250以上/500以上）

### 3. ホーム画面
- 今日のスコア表示（アニメーション付きメーター）
- 最近のトレーニング履歴
- フレンドランキング（トップ5）
- 進行中のチャレンジ表示（対戦相手のアイコン付き）

### 4. ランキング機能
- 期間別ランキング（今日・週間・月間・合計）
- トップ3の特別表示（王冠アイコン）
- フレンド間でのスコア競争

### 5. フレンド機能
- Discord風のユーザーID（例: `username#1234`）
- ユーザーID検索によるフレンド追加
- フレンドリスト管理
- ワンタップでIDコピー

### 6. チャレンジ機能（対戦モード）
- フレンドへのチャレンジ送信
- カスタム期間設定（1〜30日）
- リアルタイムスコア対決
- 勝敗結果の記録・表示
- 残り時間カウントダウン
- 対戦相手のアイコン表示

### 7. リアルタイム通知システム
- **トースト通知**: 画面右上に自動表示・5秒後に自動消去
- **フレンド追加通知**: 新しいフレンドが追加された時に通知
- **チャレンジ受信通知**: チャレンジを受けた時に通知
- **マイルストーン通知**: 対戦中に1000/2000/3000/5000/10000ポイント達成時に通知
- Firebase onSnapshotによるリアルタイム監視

### 8. プロフィール
- プロフィール画像のアップロード（Cloudinary連携）
  - ホバーでカメラアイコン表示、クリックで変更
- ユーザーネーム編集（モーダルUI）
- **体重編集**: スライダーまたは直接入力で簡単に変更可能（20〜150kg）
- スコア統計表示
  - 累計スコア
  - 今日のスコア
  - トレーニング回数
  - 消費カロリー
- スコア推移グラフ（週間・月間）
- トレーニング履歴一覧

## スクリーンショット

| ホーム | トレーニング記録 | ランキング |
|:------:|:---------------:|:---------:|
| 今日のスコア、最近のトレーニング、フレンドランキングを表示 | カテゴリから種目を選択、時間を設定してスコア獲得 | フレンドとスコアを競い合う |

| フレンド | チャレンジ | プロフィール |
|:-------:|:---------:|:-----------:|
| フレンド追加・管理、チャレンジ送信 | 期間を決めて1対1で対決 | 統計情報とスコアグラフ |

---

## デプロイマニュアル

### 必要なもの

- **Node.js**（v16以上推奨）
  - https://nodejs.org/ からダウンロード・インストール
- **Webブラウザ**（Chrome推奨）

### 初回セットアップ（1回だけ）

#### 1. Node.jsがインストールされているか確認

ターミナル（Mac）またはコマンドプロンプト（Windows）を開いて：

```bash
node -v
```

バージョンが表示されればOK。表示されない場合はNode.jsをインストール。

#### 2. Firebase CLIをインストール

```bash
npm install -g firebase-tools
```

#### 3. Firebaseにログイン

```bash
firebase login
```

ブラウザが開くのでGoogleアカウントでログイン。
「Firebase CLI Login Successful」と表示されればOK。

---

### 起動方法

#### 1. プロジェクトフォルダに移動

```bash
cd Team-13-HTML-CSS-JS
```

※ パスは自分の環境に合わせて変更（例: `cd ~/Desktop/tachjam_rizap`）

#### 2. サーバーを起動

```bash
firebase serve
```

#### 3. ブラウザで開く

http://localhost:5000

ログイン画面が表示されれば成功！

#### 4. 停止方法

ターミナルで `Ctrl + C` を押す

---

### よくあるエラーと対処法

#### 「firebase: command not found」

→ Firebase CLIがインストールされていない

```bash
npm install -g firebase-tools
```

#### 「Error: Could not load the default credentials」

→ Firebaseにログインしていない

```bash
firebase login
```

#### ポート5000が使用中

→ 別のポートで起動

```bash
firebase serve --port 8080
```

http://localhost:8080 で開く

---

### 代替起動方法

Firebase CLIが使えない場合の代替手段：

#### VS Code + Live Server

1. VS Codeで`public`フォルダを開く
2. 拡張機能「Live Server」をインストール
3. `login.html`を右クリック →「Open with Live Server」

#### Python（Macに標準搭載）

```bash
cd Team-13-HTML-CSS-JS/public
python3 -m http.server 8000
```

http://localhost:8000/login.html を開く

## ページ一覧

| ファイル | URL | 説明 |
|---------|-----|------|
| login.html | /login.html | ログインページ |
| register.html | /register.html | 新規登録ページ |
| home.html | /home.html | ホーム画面 |
| training.html | /training.html | トレーニング記録 |
| friends.html | /friends.html | フレンド管理 |
| profile.html | /profile.html | プロフィール |

## Firebase設定

このアプリはFirebaseを使用しています。

### 設定ファイル

`public/js/firebase-config.js` にFirebaseの設定が入っています。

```javascript
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "techjam-182d0",
  // ...
};
```

### Firestoreルール

Firebase Console → Firestore → ルール で以下を設定：

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // ユーザーデータ
    match /users/{userId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && (
        request.auth.uid == userId ||
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['friends'])
      );
    }

    // トレーニングデータ
    match /trainings/{trainingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

### Firestoreインデックス

Firebase Console → Firestore → インデックス で以下を作成：

| コレクション | フィールド1 | フィールド2 |
|-------------|-----------|-----------|
| trainings | userId (昇順) | timestamp (降順) |
| trainings | userId (昇順) | timestamp (昇順) |

## フォルダ構成

```
Team-13-HTML-CSS-JS/
├── README.md          # このファイル
├── development.md     # 開発ドキュメント
├── FAQ.md             # よくある質問
├── public/            # Webアプリ本体
│   ├── css/           # スタイルシート
│   │   ├── common.css
│   │   ├── home.css
│   │   ├── training.css
│   │   ├── friends.css
│   │   ├── profile.css
│   │   └── login.css
│   ├── js/            # JavaScript
│   │   ├── firebase-config.js
│   │   ├── utils.js
│   │   ├── training-data.js
│   │   ├── home.js
│   │   ├── training.js
│   │   ├── friends.js
│   │   ├── profile.js
│   │   ├── login.js
│   │   └── register.js
│   ├── login.html
│   ├── register.html
│   ├── home.html
│   ├── training.html
│   ├── friends.html
│   └── profile.html
└── docs/              # GitHub Pages用（publicのコピー）
```

## 技術スタック

### フロントエンド
| 技術 | 用途 |
|------|------|
| HTML5 | セマンティックマークアップ |
| CSS3 | カスタムプロパティ、Flexbox、Grid、アニメーション |
| JavaScript (ES6+) | モジュール化されたバニラJS |

### バックエンド（BaaS）
| サービス | 用途 |
|---------|------|
| Firebase Authentication | ユーザー認証 |
| Cloud Firestore | NoSQLデータベース |
| Firebase Hosting | 静的サイトホスティング |

### 外部サービス・ライブラリ
| サービス | 用途 |
|---------|------|
| Cloudinary | 画像アップロード・CDN |
| DiceBear API | デフォルトアバター自動生成 |
| Lucide Icons | アイコンライブラリ |
| Chart.js | グラフ描画 |
| Google Fonts (Poppins) | Webフォント |

## デザインコンセプト

- **カラースキーム**: ブラック × ゴールド（高級感・プレミアム感）
- **UIパターン**: カード型レイアウト、グラデーション、ホバーエフェクト
- **グラスモーフィズム**: ログイン/登録画面で半透明ガラス効果を採用
- **スプリットレイアウト**: PC版ログイン画面は左右2分割（ブランド/フォーム）
- **レスポンシブ**: モバイルファースト設計、PC版は2カラムレイアウト
- **アニメーション**: スコアメーター、スライドイン、ホバー効果、背景グラデーション

## スコア計算ロジック

トレーニング種目の形式に応じて3種類の計算方法があります。
**ユーザーの体重**をもとに消費カロリーを補正します（未設定の場合は60kg基準）。

### 時間ベース（有酸素運動など）
```
消費カロリー = 時間(分) × 種目別カロリー係数 × (ユーザー体重 / 60)
スコア = 消費カロリー × 1.5
```

**例**: ランニング30分（体重70kg）の場合
- 消費カロリー: 30分 × 10kcal/分 × (70/60) = 350kcal
- スコア: 350 × 1.5 = **525pt**

### 回数ベース（腕立て伏せなど）
```
消費カロリー = 回数 × (種目別カロリー係数 / 10) × (ユーザー体重 / 60)
スコア = 消費カロリー × 1.5
```
※10回で1分相当として換算

### 重量×回数ベース（ウェイトトレーニング）
```
消費カロリー = 重量(kg) × 回数 × 種目別METs × (ユーザー体重 / 60) × 0.1
スコア = 消費カロリー × 1.5
```

> 💡 プロフィールで体重を設定すると、より正確なカロリー計算が行われます。

---

### DiceBearアバターシステム

デフォルトアバターはDiceBear APIを使用して自動生成されます。

```javascript
// ユーザー名をシードとしてアバターを生成
function getDiceBearIconUrl(seed = 'default') {
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;
}

// アイコンURLがない場合はDiceBearを使用
function getIconUrl(iconURL, username = 'default') {
  return iconURL || getDiceBearIconUrl(username);
}
```

- **新規登録時**: ランダムなシードでアイコンを生成し、Firestoreに保存
- **表示時**: カスタムアイコンがない場合はユーザー名ベースのアイコンを表示

### トースト通知の使用

```javascript
// 通知を表示
showToast({
  title: '通知タイトル',
  message: '通知メッセージ',
  type: 'challenge', // 'challenge', 'friend', 'milestone'
  duration: 5000 // ミリ秒
});
```

### トレーニング種目の追加

`public/js/training-data.js` を編集：

```javascript
const TRAINING_TYPES = [
  { id: 'new_exercise', name: '新しい種目', category: 'arms', caloriesPerMinute: 6 },
  // ...
];
```

### カテゴリ一覧

- `arms` - 腕
- `legs` - 足
- `abs` - 腹筋
- `back` - 背中
- `chest` - 胸
- `fullbody` - 全身
- `cardio` - 有酸素・HIIT
- `martial` - 格闘技
- `flexibility` - 柔軟・体幹
- `water` - 水中運動
- `sports` - スポーツ

## トラブルシューティング

### ページが表示されない

- ローカルサーバーが起動しているか確認
- URLが正しいか確認（`file://`ではなく`http://`で始まること）

### ログインできない

- Firebase Consoleで Authentication が有効になっているか確認
- メール/パスワード認証が有効になっているか確認

### データが保存されない

- Firebase ConsoleでFirestoreのルールを確認
- ブラウザのコンソールでエラーを確認（F12キー）

### スコアが反映されない

- Firestoreのインデックスを作成したか確認
- エラーメッセージに表示されるリンクからインデックスを作成
