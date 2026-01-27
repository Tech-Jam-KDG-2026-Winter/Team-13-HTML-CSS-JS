# RIZAP Fitness アプリ データ型定義

## Firestore コレクション

### 1. users コレクション

ユーザー情報を保存するコレクション

**ドキュメントID:** Firebase Authentication の `uid`

| フィールド | 型 | 必須 | 説明 | 例 |
|-----------|-----|:----:|------|-----|
| `username` | string | ○ | ユーザー表示名（1〜20文字） | `"たろう"` |
| `email` | string | ○ | メールアドレス | `"test@example.com"` |
| `userID` | string | ○ | Discord風ユーザーID | `"たろう#1234"` |
| `iconURL` | string | - | アイコン画像URL | `""` |
| `totalScore` | number | ○ | 累計スコア | `1500` |
| `friends` | array\<string\> | ○ | フレンドのUID配列 | `["uid1", "uid2"]` |
| `createdAt` | timestamp | ○ | アカウント作成日時 | `Timestamp` |

```javascript
// サンプルデータ
{
  username: "たろう",
  email: "test@example.com",
  userID: "たろう#1234",
  iconURL: "",
  totalScore: 1500,
  friends: ["abc123", "def456"],
  createdAt: Timestamp
}
```

---

### 2. trainings コレクション

トレーニング記録を保存するコレクション

**ドキュメントID:** 自動生成

| フィールド | 型 | 必須 | 説明 | 例 |
|-----------|-----|:----:|------|-----|
| `userId` | string | ○ | 記録したユーザーのUID | `"abc123..."` |
| `type` | string | ○ | トレーニング種目 | `"running"` |
| `duration` | number | ○ | トレーニング時間（分） | `30` |
| `calories` | number | ○ | 消費カロリー | `300` |
| `score` | number | ○ | 獲得スコア | `450` |
| `timestamp` | timestamp | ○ | 記録日時 | `Timestamp` |

```javascript
// サンプルデータ
{
  userId: "abc123def456",
  type: "running",
  duration: 30,
  calories: 300,
  score: 450,
  timestamp: Timestamp
}
```

---

## トレーニング種目（type）

| 値 | 日本語名 | カロリー/分 |
|-----|---------|:----------:|
| `squat` | スクワット | 8 |
| `pushup` | 腕立て伏せ | 7 |
| `running` | ランニング | 10 |
| `walking` | ウォーキング | 4 |
| `plank` | プランク | 5 |
| `cycling` | サイクリング | 8 |
| `swimming` | 水泳 | 9 |
| `yoga` | ヨガ | 3 |
| `hiit` | HIIT | 12 |
| `other` | その他 | 5 |

---

## 計算式

### カロリー計算
```
calories = duration × caloriesPerMinute[type]
```

### スコア計算
```
score = calories × 1.5
```

### ユーザーID生成
```
userID = username + "#" + (1000〜9999のランダム数字)
```

---

## Firebase Authentication

| プロパティ | 型 | 説明 |
|-----------|-----|------|
| `uid` | string | ユーザー固有ID（Firestoreのドキュメントキー） |
| `email` | string | 登録メールアドレス |
| `displayName` | string \| null | 表示名（未使用） |

---

## JavaScript ローカル型

### ランキング表示用データ
```javascript
{
  id: string,        // ユーザーUID
  username: string,  // 表示名
  iconURL: string,   // アイコンURL
  todayScore: number // 今日のスコア
}
```

### フレンド表示用データ
```javascript
{
  id: string,        // ユーザーUID
  username: string,  // 表示名
  userID: string,    // Discord風ID（例: たろう#1234）
  iconURL: string,   // アイコンURL
  todayScore: number // 今日のスコア
}
```

### トレーニング履歴表示用データ
```javascript
{
  type: string,           // トレーニング種目
  duration: number,       // 時間（分）
  calories: number,       // 消費カロリー
  score: number,          // 獲得スコア
  timestamp: Timestamp    // 記録日時
}
```

---

## Firestore セキュリティルール

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['friends']);
    }

    match /trainings/{trainingId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## インデックス

### trainings コレクション
| フィールド | 順序 |
|-----------|------|
| `userId` | Ascending |
| `timestamp` | Descending |
