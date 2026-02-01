# FITNESS - フィットネストラッキングアプリ

フレンドと競い合えるゲーミフィケーション型フィットネス記録アプリ

## 概要

FITNESSは、トレーニングを記録してスコアを獲得し、フレンドとランキングで競い合えるWebアプリケーションです。ゲーミフィケーション要素を取り入れることで、トレーニングのモチベーション維持をサポートします。

## 主な機能

### 1. ユーザー認証
- メールアドレスとパスワードによる新規登録・ログイン
- Firebase Authenticationによるセキュアな認証

### 2. トレーニング記録
- **100種類以上**のトレーニング種目から選択
- カテゴリ別フィルタリング（腕、足、腹筋、背中、胸、全身、有酸素、格闘技、柔軟、水中運動、スポーツ）
- トレーニング時間の設定（スライダー・クイックボタン対応）
- 消費カロリーとスコアの自動計算
- 励ましメッセージ表示

### 3. ホーム画面
- 今日のスコア表示（アニメーション付きメーター）
- 最近のトレーニング履歴
- フレンドランキング（トップ5）
- 進行中のチャレンジ表示

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

### 7. プロフィール
- プロフィール画像のアップロード（Cloudinary連携）
- ユーザーネーム編集
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
cd tachjam_rizap
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
cd tachjam_rizap/public
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
tachjam_rizap/
├── README.md          # このファイル
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
└── docs/              # ドキュメント
    ├── data-types.md
    └── lucide-icon-guide.md
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
| Lucide Icons | アイコンライブラリ |
| Chart.js | グラフ描画 |
| Google Fonts (Poppins) | Webフォント |

## デザインコンセプト

- **カラースキーム**: ブラック × ゴールド（高級感・プレミアム感）
- **UIパターン**: カード型レイアウト、グラデーション、ホバーエフェクト
- **レスポンシブ**: モバイルファースト設計、PC版は2カラムレイアウト
- **アニメーション**: スコアメーター、スライドイン、ホバー効果

## スコア計算ロジック

```
消費カロリー = トレーニング時間(分) × 種目別カロリー係数
スコア = 消費カロリー × 1.5
```

**例**: ランニング30分の場合
- 消費カロリー: 30分 × 10kcal/分 = 300kcal
- スコア: 300 × 1.5 = **450pt**

---

## 開発メモ

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
