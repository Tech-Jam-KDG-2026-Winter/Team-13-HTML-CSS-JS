# RIZAP Fitness アプリ

フレンドとトレーニングスコアを競い合うフィットネス記録アプリ

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
