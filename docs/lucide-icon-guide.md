# Lucide アイコン導入ガイド

現在HTMLで使用している絵文字をLucideアイコンに置き換える作業の解説です。

## Lucideとは

[Lucide](https://lucide.dev/)は、オープンソースのアイコンライブラリです。シンプルで美しいSVGアイコンを簡単に使用できます。

## セットアップ

### 1. スクリプトの追加

各HTMLファイルの`</body>`タグの直前に以下を追加します：

```html
<!-- Lucide Icons -->
<script src="https://unpkg.com/lucide@latest"></script>
<script>lucide.createIcons();</script>
```

**配置場所の例（training.htmlの場合）：**

```html
  <!-- JavaScript -->
  <script src="js/firebase-config.js"></script>
  <script src="js/utils.js"></script>
  <script src="js/training.js"></script>

  <!-- Lucide Icons（ここに追加） -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script>lucide.createIcons();</script>
</body>
</html>
```

## 使い方

### 基本的な書き方

絵文字の代わりに`<i>`タグを使用します：

```html
<!-- 変更前（絵文字） -->
<span>🏠</span>

<!-- 変更後（Lucideアイコン） -->
<i data-lucide="home"></i>
```

### アイコンの探し方

1. [Lucide公式サイト](https://lucide.dev/icons/)にアクセス
2. 検索ボックスでアイコン名を検索（英語）
3. 使いたいアイコンをクリックしてアイコン名をコピー

## 置き換え対象一覧

以下の絵文字をLucideアイコンに置き換えてください：

| 現在の絵文字 | 用途 | Lucideアイコン名 | コード |
|-------------|------|-----------------|--------|
| 🏠 | ホーム | `home` | `<i data-lucide="home"></i>` |
| 💪 | トレーニング/記録 | `dumbbell` | `<i data-lucide="dumbbell"></i>` |
| 👥 | フレンド | `users` | `<i data-lucide="users"></i>` |
| 👤 | プロフィール | `user` | `<i data-lucide="user"></i>` |
| 🔥 | スコア/炎 | `flame` | `<i data-lucide="flame"></i>` |
| 🏆 | ランキング/トロフィー | `trophy` | `<i data-lucide="trophy"></i>` |
| 📝 | 記録/メモ | `clipboard-list` | `<i data-lucide="clipboard-list"></i>` |
| 📊 | 統計/グラフ | `bar-chart-3` | `<i data-lucide="bar-chart-3"></i>` |
| ➕ | 追加 | `plus` | `<i data-lucide="plus"></i>` |
| 🆔 | ID | `id-card` | `<i data-lucide="id-card"></i>` |
| 📋 | コピー | `copy` | `<i data-lucide="copy"></i>` |
| ✏️ | 編集 | `pencil` | `<i data-lucide="pencil"></i>` |
| ← | 戻る | `arrow-left` | `<i data-lucide="arrow-left"></i>` |
| ⏻ | ログアウト/電源 | `log-out` | `<i data-lucide="log-out"></i>` |
| 🏃 | 運動/ランニング | `activity` | `<i data-lucide="activity"></i>` |

## 作業対象ファイル

以下のHTMLファイルで作業が必要です：

1. `home.html`
2. `training.html`
3. `friends.html`
4. `profile.html`
5. `login.html`
6. `register.html`

## 具体的な変更例

### ボトムナビゲーション（全ページ共通）

**変更前：**
```html
<nav class="nav-bottom">
  <ul class="nav-list">
    <li class="nav-item">
      <a href="home.html" class="nav-link">
        <span class="nav-icon">🏠</span>
        <span>ホーム</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="training.html" class="nav-link">
        <span class="nav-icon">💪</span>
        <span>記録</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="friends.html" class="nav-link">
        <span class="nav-icon">👥</span>
        <span>フレンド</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="profile.html" class="nav-link">
        <span class="nav-icon">👤</span>
        <span>プロフィール</span>
      </a>
    </li>
  </ul>
</nav>
```

**変更後：**
```html
<nav class="nav-bottom">
  <ul class="nav-list">
    <li class="nav-item">
      <a href="home.html" class="nav-link">
        <span class="nav-icon"><i data-lucide="home"></i></span>
        <span>ホーム</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="training.html" class="nav-link">
        <span class="nav-icon"><i data-lucide="dumbbell"></i></span>
        <span>記録</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="friends.html" class="nav-link">
        <span class="nav-icon"><i data-lucide="users"></i></span>
        <span>フレンド</span>
      </a>
    </li>
    <li class="nav-item">
      <a href="profile.html" class="nav-link">
        <span class="nav-icon"><i data-lucide="user"></i></span>
        <span>プロフィール</span>
      </a>
    </li>
  </ul>
</nav>
```

### セクションタイトル例

**変更前：**
```html
<h2 class="card-title">
  <span>🏆</span>
  フレンドランキング
</h2>
```

**変更後：**
```html
<h2 class="card-title">
  <i data-lucide="trophy"></i>
  フレンドランキング
</h2>
```

## CSSでのスタイル調整

Lucideアイコンはデフォルトで24x24pxです。サイズや色を変更したい場合はCSSで調整できます。

### common.cssに追加するスタイル

```css
/* Lucideアイコン共通スタイル */
[data-lucide] {
  width: 1em;
  height: 1em;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
  vertical-align: middle;
}

/* ナビゲーションアイコン */
.nav-icon [data-lucide] {
  width: 24px;
  height: 24px;
}

/* カードタイトルのアイコン */
.card-title [data-lucide] {
  width: 1.2em;
  height: 1.2em;
  margin-right: var(--spacing-xs);
}
```

## 注意点

1. **スクリプトの順番**: `lucide.createIcons()`は必ずHTMLの読み込み後に実行する必要があります。`</body>`の直前に配置してください。

2. **動的に追加された要素**: JavaScriptで後から追加した要素にアイコンを表示する場合は、追加後に`lucide.createIcons()`を再度呼び出す必要があります。

3. **色の継承**: アイコンの色は`currentColor`を使用しているため、親要素の`color`プロパティを継承します。

4. **オフライン対応**: CDNを使用しているため、オフラインでは表示されません。本番環境ではローカルにファイルを配置することを検討してください。

## 確認方法

1. HTMLファイルを編集
2. ブラウザでページをリロード
3. アイコンが正しく表示されることを確認
4. サイズ・色が適切か確認
5. 問題があればCSSで調整

## 参考リンク

- [Lucide公式サイト](https://lucide.dev/)
- [アイコン一覧](https://lucide.dev/icons/)
- [Lucide GitHub](https://github.com/lucide-icons/lucide)
