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
const durationNumberInput = document.getElementById('duration-number');
const quickBtns = document.querySelectorAll('.quick-btn');
const previewCalories = document.getElementById('preview-calories');
const previewScore = document.getElementById('preview-score');
const saveTrainingBtn = document.getElementById('save-training-btn');
const successModal = document.getElementById('success-modal');
const closeSuccessModal = document.getElementById('close-success-modal');
const modalCalories = document.getElementById('modal-calories');
const modalScore = document.getElementById('modal-score');

// DOM追加
const modalTodayScore = document.getElementById('modal-today-score');
const encouragementMessage = document.getElementById('encouragement-message');

// ============================================
// 初期化処理
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  requireAuth((user) => {
    currentUser = user;
    console.log('トレーニング記録ページ準備完了');
  });

  renderCategoryTabs();
  renderTrainingTypes();
  setupEventListeners();
  updatePreview();
  // 初期表示を設定
  if (durationNumberInput) {
    durationNumberInput.value = duration;
  }
  updateSliderProgress();
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

  categoryTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.category-tab');
    if (!tab) return;
    selectedCategory = tab.dataset.category;
    document.querySelectorAll('.category-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    renderTrainingTypes();
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
  trainingTypes.addEventListener('click', handleTypeSelect);

  // スライダー入力
  durationInput.addEventListener('input', () => {
    const value = parseInt(durationInput.value, 10) || 0;
    setDuration(value, 'slider');
  });

  // 数値入力欄
  if (durationNumberInput) {
    durationNumberInput.addEventListener('input', () => {
      const value = parseInt(durationNumberInput.value, 10) || 0;
      setDuration(value, 'number');
    });
  }

  quickBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const quickDuration = parseInt(btn.dataset.duration, 10);
      setDuration(quickDuration);
    });
  });

  saveTrainingBtn.addEventListener('click', handleSaveTraining);

  closeSuccessModal.addEventListener('click', () => {
    window.location.href = 'home.html';
  });

  successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
      window.location.href = 'home.html';
    }
  });
}

function handleTypeSelect(e) {
  const btn = e.target.closest('.type-btn');
  if (!btn) return;
  document.querySelectorAll('.type-btn').forEach((b) => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedType = btn.dataset.type;
  updatePreview();
}

function setDuration(value, source = 'both') {
  // 最小1分、最大300分（5時間）まで対応
  duration = Math.max(1, Math.min(300, value));

  // スライダーを更新（スライダーは5-120の範囲）
  if (source !== 'slider') {
    const sliderValue = Math.max(5, Math.min(120, duration));
    durationInput.value = sliderValue;
  }

  // 数値入力欄を更新
  if (source !== 'number' && durationNumberInput) {
    durationNumberInput.value = duration;
  }

  // スライダーの進捗バーを更新
  updateSliderProgress();
  updateQuickBtnState();
  updatePreview();
}

function updateSliderProgress() {
  const min = parseInt(durationInput.min) || 5;
  const max = parseInt(durationInput.max) || 120;
  // スライダー範囲内でクランプして進捗を計算
  const clampedValue = Math.max(min, Math.min(max, duration));
  const progress = ((clampedValue - min) / (max - min)) * 100;
  durationInput.style.setProperty('--progress', `${progress}%`);
}

function updateQuickBtnState() {
  quickBtns.forEach((btn) => {
    const btnDuration = parseInt(btn.dataset.duration, 10);
    btn.classList.toggle('active', btnDuration === duration);
  });
}

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
  if (!selectedType) {
    showError('トレーニング種目を選択してください');
    return;
  }
  if (duration < 1) {
    showError('トレーニング時間を入力してください');
    return;
  }

  const calories = calculateCaloriesNew(selectedType, duration);
  const score = calculateScoreNew(calories);

  try {
    toggleLoading(true);
    await db.collection('trainings').add({
      userId: currentUser.uid,
      type: selectedType,
      duration: duration,
      calories: calories,
      score: score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    await db.collection('users').doc(currentUser.uid).update({
      totalScore: firebase.firestore.FieldValue.increment(score)
    });

    // 成功モーダルを表示
    await showSuccessModal(calories, score);
  } catch (error) {
    console.error('トレーニング保存エラー:', error);
    showError('トレーニングの保存に失敗しました');
  } finally {
    toggleLoading(false);
  }
}

// ============================================
// 成功モーダル (二重定義を削除し、整理しました)
// ============================================

async function showSuccessModal(calories, score) {
  // 1. 基本情報を表示
  modalCalories.textContent = calories.toLocaleString();
  modalScore.textContent = score.toLocaleString();

  // 2. 励ましのメッセージ
  encouragementMessage.textContent = getEncouragementMessage(duration, score);

  try {
    // 今日の累計スコア取得 (引数を currentUser.uid に修正)
    const previousTodayScore = await getTodayScore(currentUser.uid);
    modalTodayScore.textContent = (previousTodayScore + score).toLocaleString();
  } catch (error) {
    console.error('累計スコア取得エラー:', error);
    modalTodayScore.textContent = score.toLocaleString();
  }

  // 3. モーダルをアクティブにする
  successModal.classList.add('active');
}

// ============================================
// 励ましメッセージ
// ============================================

const ENCOURAGEMENT_MESSAGES = {
  short: ['短い時間でもコツコツが大事！', 'いい運動になりましたね！', '継続は力なりです！'],
  normal: ['ナイストレーニング！', '今日も頑張りましたね！', 'その調子！とても良いです！'],
  long: ['圧巻のトレーニング！', 'すごい！本気ですね！', '限界突破！最高です！', 'ハードワーク！尊敬します！'],
  highScore: ['驚異的なスコア！', 'スコアモンスター！', 'ランキング上位間違いなし！']
};

function getEncouragementMessage(duration, score) {
  let messagePool;
  if (score >= 500) {
    messagePool = ENCOURAGEMENT_MESSAGES.highScore;
  } else if (duration <= 15) {
    messagePool = ENCOURAGEMENT_MESSAGES.short;
  } else if (duration >= 46) {
    messagePool = ENCOURAGEMENT_MESSAGES.long;
  } else {
    messagePool = ENCOURAGEMENT_MESSAGES.normal;
  }

  const randomIndex = Math.floor(Math.random() * messagePool.length);
  return messagePool[randomIndex];
}