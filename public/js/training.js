/**
 * トレーニング記録ページのJavaScript
 */

// グローバル変数
let currentUser = null;
let selectedType = null;
let selectedCategory = 'all';
let duration = 30;

// DOM要素の取得
const categoryTabs = document.getElementById('category-tabs');
const trainingTypes = document.getElementById('training-types');
const durationInput = document.getElementById('duration-input');
const quickBtns = document.querySelectorAll('.quick-btn');
const previewCalories = document.getElementById('preview-calories');
const previewScore = document.getElementById('preview-score');
const saveTrainingBtn = document.getElementById('save-training-btn');
const successModal = document.getElementById('success-modal');
const modalCalories = document.getElementById('modal-calories');
const modalScore = document.getElementById('modal-score');
const closeSuccessModal = document.getElementById('close-success-modal');
const shareTwitterBtn = document.getElementById('share-twitter');
const shareLineBtn = document.getElementById('share-line')

// ============================================
// 初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // 認証チェック
  requireAuth((user) => {
    currentUser = user;
    console.log('トレーニング記録ページ準備完了');
  });

  // カテゴリタブを生成
  renderCategoryTabs();

  // トレーニング種目を生成
  renderTrainingTypes();

  // イベントリスナー設定
  setupEventListeners();

  // 初期プレビューを更新
  updatePreview();
});

// ============================================
// カテゴリタブ生成
// ============================================

function renderCategoryTabs() {
  const tabsHTML = TRAINING_CATEGORIES.map(cat => `
    <button class="category-tab ${cat.id === selectedCategory ? 'active' : ''}" data-category="${cat.id}">
      ${cat.name}
    </button>
  `).join('');

  categoryTabs.innerHTML = tabsHTML;

  // タブクリックイベント
  categoryTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.category-tab');
    if (!tab) return;

    selectedCategory = tab.dataset.category;

    // アクティブ状態を更新
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    // 種目を再描画
    renderTrainingTypes();

    // 選択をリセット
    selectedType = null;
    updatePreview();
  });
}

// ============================================
// トレーニング種目生成
// ============================================

function renderTrainingTypes() {
  const types = getTrainingsByCategory(selectedCategory);

  const typesHTML = types.map(t => `
    <button class="type-btn ${selectedType === t.id ? 'selected' : ''}" data-type="${t.id}">
      <span class="type-name">${t.name}</span>
      <span class="type-stats">
        <span class="type-cal">${t.caloriesPerMinute} kcal/分</span>
        <span class="type-pt">${Math.round(t.caloriesPerMinute * 1.5)} pt/分</span>
      </span>
    </button>
  `).join('');

  trainingTypes.innerHTML = typesHTML;
}

// ============================================
// イベントリスナー設定
// ============================================

function setupEventListeners() {
  // トレーニング種目選択
  trainingTypes.addEventListener('click', handleTypeSelect);

  // 時間入力
  durationInput.addEventListener('input', () => {
    const value = parseInt(durationInput.value, 10) || 0;
    setDuration(value);
  });

  // クイック時間ボタン
  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const quickDuration = parseInt(btn.dataset.duration, 10);
      setDuration(quickDuration);
    });
  });

  // 記録ボタン
  saveTrainingBtn.addEventListener('click', handleSaveTraining);

  // 成功モーダルを閉じる
  closeSuccessModal.addEventListener('click', () => {
    window.location.href = 'home.html';
  });

  // モーダル外クリックで閉じる
  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      window.location.href = 'home.html';
    }
  });

  // シェアボタン設定
  function setupShareButtons() {
    // Twitter
    shareTwitterBtn.addEventListener('click', () => {
      const text = `RIZAP Fitnessでトレーニング完了！\n${modalScore.textContent} pt獲得しました！\n#RIZAPFitness #筋トレ`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'width=550,height=420');
    });

    // LINE
    shareLineBtn.addEventListener('click', () => {
      const text = `RIZAP Fitnessでトレーニング完了！\n${modalScore.textContent} pt獲得しました！\n#RIZAPFitness #筋トレ`;
      const url = `https://social-plugins.line.me/lineit/share?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank', 'width=550,height=420');
    });
  }
  setupShareButtons();
}

// ============================================
// トレーニング種目選択
// ============================================

function handleTypeSelect(e) {
  const btn = e.target.closest('.type-btn');
  if (!btn) return;

  // 選択状態を更新
  document.querySelectorAll('.type-btn').forEach((b) => {
    b.classList.remove('selected');
  });
  btn.classList.add('selected');

  selectedType = btn.dataset.type;

  // プレビューを更新
  updatePreview();
}

// ============================================
// 時間設定
// ============================================

function setDuration(value) {
  duration = Math.max(1, Math.min(120, value));
  durationInput.value = duration;
  updateQuickBtnState();
  updatePreview();
}

function updateQuickBtnState() {
  quickBtns.forEach((btn) => {
    const btnDuration = parseInt(btn.dataset.duration, 10);
    btn.classList.toggle('active', btnDuration === duration);
  });
}

// ============================================
// プレビュー更新
// ============================================

function updatePreview() {
  const typeId = selectedType || 'other';
  const calories = calculateCaloriesNew(typeId, duration);
  const score = calculateScoreNew(calories);

  previewCalories.textContent = calories.toLocaleString();
  previewScore.textContent = score.toLocaleString();
}

// ============================================
// トレーニング保存
// ============================================

async function handleSaveTraining() {
  // バリデーション
  if (!selectedType) {
    showError('トレーニング種目を選択してください');
    return;
  }

  if (duration < 1) {
    showError('トレーニング時間を入力してください');
    return;
  }

  // 計算
  const calories = calculateCaloriesNew(selectedType, duration);
  const score = calculateScoreNew(calories);

  try {
    toggleLoading(true);

    // Firestoreに保存
    await db.collection('trainings').add({
      userId: currentUser.uid,
      type: selectedType,
      duration: duration,
      calories: calories,
      score: score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    // ユーザーの総スコアを更新
    await db.collection('users').doc(currentUser.uid).update({
      totalScore: firebase.firestore.FieldValue.increment(score)
    });

    // 成功モーダルを表示
    showSuccessModal(calories, score);
  } catch (error) {
    console.error('トレーニング保存エラー:', error);
    showError('トレーニングの保存に失敗しました');
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// 成功モーダル
// ============================================

function showSuccessModal(calories, score) {
  modalCalories.textContent = calories.toLocaleString();
  modalScore.textContent = score.toLocaleString();
  successModal.classList.add('active');
}


// ============================================
// 励ましメッセージを表示
// ============================================

const ENCOURAGEMENT_MESSAGES = {
  // 15分以下
  short: [
    '短い時間でもコツコツが大事！',
    'いい運動になりましたね！',
    '継続は力なりです！'
  ],
  // 通常(16~45分)
  normal: [
    'ナイストレーニング！',
    '今日も頑張りましたね！',
    'その調子！とても良いです！'
  ],
  // 長時間(46分以上)
  long: [
    '圧巻のトレーニング！',
    'すごい！本気ですね！',
    '限界突破！最高です！',
    'ハードワーク！尊敬します！',
    '素晴らしい！しっかり休んでください！'
  ],
  // if score >= 500
  highScore: [
    '驚異的なスコア！',
    'スコアモンスター！',
    'ランキング上位間違いなし！',
  ],

}

/**
 * 励ましメッセージを取得
 * @param {number} duration ==  トレーニング時間（分）
 * @param {number} score == 獲得スコア
 * @returns {string} 励ましメッセージ
 */

// 時間に応じてメッセージをランダムで表示させる
function getEncouragementMessage(duration,score) {
  let messagePool;
  if (score >= 500) {
    messagePool = ENCOURAGEMENT_MESSAGES.highScore;
  } else if ( duration <= 15 ) {
    messagePool = ENCOURAGEMENT_MESSAGES.short;
  } else if ( duration >= 46 ) {
    messagePool = ENCOURAGEMENT_MESSAGES.long;
  } else {
    messagePool = ENCOURAGEMENT_MESSAGES.normal;
  }

  const randomIndex = Math.floor(Math.random() * messagePool.length); 
  return messagePool[randomIndex];
}