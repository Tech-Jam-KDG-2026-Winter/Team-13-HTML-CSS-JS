/**
 * トレーニング記録ページのJavaScript
 */

// グローバル変数
let currentUser = null;
let selectedType = null;
let selectedCategory = "all";

let duration = 30;

// 絞り込みを追加
let selectedStyle = "all";

// 追加部分データのformatを参照して入力カードの内容を切り替える
// ==============================
// 入力UI切替用
// ==============================
let inputValues = {
  duration: 30,
  reps: 10,
  weight: 20,
};

// DOM要素の取得
const categoryTabs = document.getElementById("category-tabs");
const trainingTypes = document.getElementById("training-types");
const durationInput = document.getElementById("duration-input");
const durationNumberInput = document.getElementById("duration-number");

// const quickBtns = document.querySelectorAll(".quick-btn");

const previewCalories = document.getElementById("preview-calories");
const previewScore = document.getElementById("preview-score");
const saveTrainingBtn = document.getElementById("save-training-btn");
const successModal = document.getElementById("success-modal");
const closeSuccessModal = document.getElementById("close-success-modal");
const modalCalories = document.getElementById("modal-calories");
const modalScore = document.getElementById("modal-score");
const modalTodayScore = document.getElementById("modal-today-score");
const encouragementMessage = document.getElementById("encouragement-message");

//DOM追加
// スタイルタブ部分
const styleTabs = document.getElementById("style-tabs");
// 右カラム要素
const trainingRight = document.querySelector(".training-right");

if (!trainingRight) {
  console.error(".training-right が見つかりません");
}

const inputContainer = document.getElementById("input-container");

// ============================================
// 初期化処理
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  requireAuth((user) => {
    currentUser = user;
    console.log("トレーニング記録ページ準備完了");
  });

  renderStyleTabs();
  renderCategoryTabs();
  renderTrainingTypes();
  setupEventListeners();
  updatePreview();

  // 初期表示を設定
  if (durationNumberInput) {
    durationNumberInput.value = duration;
  }

  // 初期スライダー進捗（もしスライダーが存在すれば）
  const durationSlider = document.getElementById("duration-input");
  if (durationSlider) {
    updateSliderProgress(durationSlider);
  }
});

// ============================================
// スタイルタブ生成
// ============================================

function renderStyleTabs() {
  const tabsHTML = TRAINING_STYLES.map(
    (style) => `
      <button class="style-tab ${
        style.id === selectedStyle ? "active" : ""
      }" data-style="${style.id}">
        ${style.name}
      </button>
    `
  ).join("");

  styleTabs.innerHTML = tabsHTML;

  styleTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".style-tab");
    if (!tab) return;

    selectedStyle = tab.dataset.style;

    document
      .querySelectorAll(".style-tab")
      .forEach((t) => t.classList.remove("active"));

    tab.classList.add("active");

    renderTrainingTypes();
    selectedType = null;
    updatePreview();
  });
}

// ============================================
// 絞り込みタブ表示
// ============================================

function renderCategoryTabs() {
  const tabsHTML = TRAINING_CATEGORIES.map(
    (cat) => `
    <button class="category-tab ${
      cat.id === selectedCategory ? "active" : ""
    }" data-category="${cat.id}">
      ${cat.name}
    </button>
  `
  ).join("");

  categoryTabs.innerHTML = tabsHTML;

  categoryTabs.addEventListener("click", (e) => {
    const tab = e.target.closest(".category-tab");
    if (!tab) return;
    selectedCategory = tab.dataset.category;
    document
      .querySelectorAll(".category-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    renderTrainingTypes();
    selectedType = null;
    updatePreview();
  });
}

// フィルターリセットボタン
function resetFilters() {
  selectedCategory = "all";
  selectedStyle = "all";
  selectedType = null;

  renderCategoryTabs();
  renderStyleTabs();
  renderTrainingTypes();
  updatePreview();
}

// ============================================
// トレーニング種目生成
// ============================================

function renderTrainingTypes() {
  const types = getTrainings(selectedCategory, selectedStyle);

  if (types.length === 0) {
    trainingTypes.innerHTML = `
        <p class="empty-title">該当するトレーニングがありません</p>
        <p class="empty-sub">カテゴリやスタイルを変更してみてください</p>
        <button class="reset-filter-btn ">絞り込みをリセット</button>
    `;
    const resetBtn = document.querySelector(".reset-filter-btn");
    resetBtn.addEventListener("click", resetFilters);
    return;
  }

  const typesHTML = types
    .map(
      (t) => `
    <button class="type-btn ${selectedType === t.id ? "selected" : ""}" data-type="${t.id}">
        <span class="type-name">${t.name}</span>
    </button>
  `
    )
    .join("");

  trainingTypes.innerHTML = typesHTML;
}

// ============================================
// イベントリスナー設定
// ============================================
function setupEventListeners() {
  if (trainingTypes) {
    trainingTypes.addEventListener("click", handleTypeSelect);
  }

  if (durationInput) {
    durationInput.addEventListener("input", () => {
      const value = parseInt(durationInput.value, 10) || 0;
      setDuration(value, "slider");
    });
  }

  if (durationNumberInput) {
    durationNumberInput.addEventListener("input", () => {
      const value = parseInt(durationNumberInput.value, 10) || 0;
      setDuration(value, "number");
    });
  }

  if (saveTrainingBtn) {
    saveTrainingBtn.addEventListener("click", handleSaveTraining);
  }

  if (closeSuccessModal) {
    closeSuccessModal.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }

  if (successModal) {
    successModal.addEventListener("click", (e) => {
      if (e.target === successModal) {
        window.location.href = "home.html";
      }
    });
  }
}

function handleTypeSelect(e) {
  const btn = e.target.closest(".type-btn");
  if (!btn) return;

  document
    .querySelectorAll(".type-btn")
    .forEach((b) => b.classList.remove("selected"));
  btn.classList.add("selected");

  selectedType = btn.dataset.type;

  // ここで入力UIをレンダリング
  const type = getTrainingById(selectedType);
  renderInputUI(type);

  updatePreview();
}

function setDuration(value, source = "both") {
  // 最小1分、最大300分（5時間）まで対応
  duration = Math.max(1, Math.min(300, value));

  // スライダーを更新（スライダーは5-120の範囲）
  if (source !== "slider") {
    const sliderValue = Math.max(5, Math.min(120, duration));
    if (durationInput) durationInput.value = sliderValue;
  }

  // 数値入力欄を更新
  if (source !== "number" && durationNumberInput) {
    durationNumberInput.value = duration;
  }

  // スライダーの進捗バーを更新
  if (durationInput) updateSliderProgress(durationInput);

  updatePreview();
}

function updateSliderProgress(slider) {
  if (!slider) return;
  const min = parseInt(slider.min) || 0;
  const max = parseInt(slider.max) || 100;
  const value = parseInt(slider.value) || min;

  const clampedValue = Math.max(min, Math.min(max, value));
  const progress = ((clampedValue - min) / (max - min)) * 100;
  slider.style.setProperty("--progress", `${progress}%`);
}

function updateDurationProgress() {
  const durationInput = document.getElementById("duration-input");
  const value = parseInt(durationInput.value);
  const min = parseInt(durationInput.min) || 5;
  const max = parseInt(durationInput.max) || 120;

  const clampedValue = Math.max(min, Math.min(max, value));
  const progress = ((clampedValue - min) / (max - min)) * 100;
  durationInput.style.setProperty("--progress", `${progress}%`);
}

function updateRepsProgress() {
  const repsInput = document.getElementById("reps-input");
  const value = parseInt(repsInput.value);
  const min = parseInt(repsInput.min) || 1;
  const max = parseInt(repsInput.max) || 100;

  const clampedValue = Math.max(min, Math.min(max, value));
  const progress = ((clampedValue - min) / (max - min)) * 100;
  repsInput.style.setProperty("--progress", `${progress}%`);
}

function updatePreview() {
  // 種目が未選択、または入力値が未定義なら初期表示
  if (!selectedType || typeof inputValues === "undefined") {
    previewCalories.textContent = "0";
    previewScore.textContent = "0";
    return;
  }

  const type = getTrainingById(selectedType);
  if (!type) {
    previewCalories.textContent = "0";
    previewScore.textContent = "0";
    return;
  }

  let calories = 0;

  // 種目の format に応じて計算方法を切り替える
  switch (type.format) {
    case "time":
      calories = calculateCaloriesNew(
        type.id,
        inputValues.duration,
        null,
        currentUser?.weight
      );
      break;

    case "reps":
      calories = calculateCaloriesNew(
        type.id,
        inputValues.reps,
        null,
        currentUser?.weight
      );
      break;

    case "weight_reps":
      calories = calculateCaloriesNew(
        type.id,
        inputValues.weight,
        inputValues.reps,
        currentUser?.weight
      );
      break;

    default:
      calories = 0;
  }

  const score = calculateScoreNew(calories);

  // 表示更新
  previewCalories.textContent = calories.toLocaleString();
  previewScore.textContent = score.toLocaleString();
}

// ============================================
// トレーニング保存
// ============================================
// ============================================
// トレーニング保存（バリデーション追加版）
// ============================================
async function handleSaveTraining() {
  if (!selectedType) {
    showError("トレーニング種目を選択してください");
    return;
  }

  const type = getTrainingById(selectedType);
  if (!type) return;

  // --------------------------
  // バリデーション
  // --------------------------
  switch (type.format) {
    case "time":
      if (!inputValues.duration || inputValues.duration <= 0) {
        showError("トレーニング時間を入力してください");
        return;
      }
      break;

    case "reps":
      if (!inputValues.reps || inputValues.reps <= 0) {
        showError("回数は1回以上にしてください");
        return;
      }
      break;

    case "weight_reps":
      if (!inputValues.weight || inputValues.weight <= 0) {
        showError("重量は0kgより大きい値を入力してください");
        return;
      }
      if (!inputValues.reps || inputValues.reps <= 0) {
        showError("回数は1回以上にしてください");
        return;
      }
      break;
  }

  // --------------------------
  // カロリーとスコア計算
  // --------------------------
  let calories = 0;
  switch (type.format) {
    case "time":
      calories = calculateCaloriesNew(
        type.id,
        inputValues.duration,
        null,
        currentUser?.weight
      );
      break;
    case "reps":
      calories = calculateCaloriesNew(
        type.id,
        inputValues.reps,
        null,
        currentUser?.weight
      );
      break;
    case "weight_reps":
      calories = calculateCaloriesNew(
        type.id,
        inputValues.weight,
        inputValues.reps,
        currentUser?.weight
      );
      break;
  }

  const score = calculateScoreNew(calories);

  // --------------------------
  // データベース保存
  // --------------------------
  try {
    toggleLoading(true);

    await db.collection("trainings").add({
      userId: currentUser.uid,
      type: selectedType,
      duration:
        type.format === "time" ? inputValues.duration : inputValues.reps,
      calories: calories,
      score: score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    await db
      .collection("users")
      .doc(currentUser.uid)
      .update({
        totalScore: firebase.firestore.FieldValue.increment(score),
      });

    await showSuccessModal(calories, score);
  } catch (error) {
    console.error("トレーニング保存エラー:", error);
    showError("トレーニングの保存に失敗しました");
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
  encouragementMessage.textContent = getEncouragementMessage(score);

  try {
    // 今日の累計スコア取得 (引数を currentUser.uid に修正)
    const previousTodayScore = await getTodayScore(currentUser.uid);
    modalTodayScore.textContent = (previousTodayScore + score).toLocaleString();
  } catch (error) {
    console.error("累計スコア取得エラー:", error);
    modalTodayScore.textContent = score.toLocaleString();
  }

  // 3. モーダルをアクティブにする
  successModal.classList.add("active");
}

// ============================================
// 励ましメッセージ
// ============================================

const ENCOURAGEMENT_MESSAGES = {
  short: [
    "短い時間でもコツコツが大事！",
    "いい運動になりましたね！",
    "継続は力なりです！",
  ],
  normal: [
    "ナイストレーニング！",
    "今日も頑張りましたね！",
    "その調子！とても良いです！",
  ],
  long: [
    "圧巻のトレーニング！",
    "すごい！本気ですね！",
    "限界突破！最高です！",
    "ハードワーク！尊敬します！",
  ],
  highScore: [
    "驚異的なスコア！",
    "スコアモンスター！",
    "ランキング上位間違いなし！",
  ],
};

function getEncouragementMessage(score) {
  let messagePool;

  if (score >= 500) {
    messagePool = ENCOURAGEMENT_MESSAGES.highScore; // 500以上
  } else if (score <= 100) {
    messagePool = ENCOURAGEMENT_MESSAGES.short; // 100以下
  } else if (score >= 250) {
    messagePool = ENCOURAGEMENT_MESSAGES.long; // 250以上（ただし500未満）
  } else {
    messagePool = ENCOURAGEMENT_MESSAGES.normal; // 上記以外
  }

  const randomIndex = Math.floor(Math.random() * messagePool.length);
  return messagePool[randomIndex];
}

function renderInputUI(type) {
  if (!type) return;

  const format = type.format;
  let html = "";

  if (format === "time") {
    html = `
      <section class="duration-section card slide-up">
        <h2 class="card-title">トレーニング時間</h2>
        <div class="duration-input-row">
          <input type="number" id="duration-number" class="duration-number-input" value="${inputValues.duration}" min="1" max="300">
          <span class="duration-unit">分</span>
        </div>
        <div class="duration-slider-wrapper">
          <span class="slider-label">5</span>
          <input type="range" id="duration-input" class="duration-slider" value="${inputValues.duration}" min="5" max="120" step="5">
          <span class="slider-label">120</span>
        </div>
        <div class="quick-duration">
          <button class="quick-btn" data-value="10">10分</button>
          <button class="quick-btn" data-value="20">20分</button>
          <button class="quick-btn" data-value="30">30分</button>
          <button class="quick-btn" data-value="45">45分</button>
          <button class="quick-btn" data-value="60">60分</button>
        </div>
      </section>
    `;
  } else if (format === "reps") {
    html = `
      <section class="reps-section card slide-up">
        <h2 class="card-title">回数</h2>
        <div class="reps-input-row">
          <input type="number" id="reps-number" class="reps-number-input" value="${inputValues.reps}" min="1" max="100">
          <span class="reps-unit">回</span>
        </div>
        <div class="reps-slider-wrapper">
          <span class="slider-label">1</span>
          <input type="range" id="reps-input" class="reps-slider" value="${inputValues.reps}" min="1" max="100" step="1">
          <span class="slider-label">100</span>
        </div>
        <div class="quick-reps">
          <button class="quick-btn" data-value="5">5回</button>
          <button class="quick-btn" data-value="8">8回</button>
          <button class="quick-btn" data-value="10">10回</button>
          <button class="quick-btn" data-value="12">12回</button>
          <button class="quick-btn" data-value="15">15回</button>
        </div>
      </section>
    `;
  } else if (format === "weight_reps") {
    html = `
      <section class="weight-reps-section card slide-up">
        <h2 class="card-title">重量 & 回数</h2>

        <!-- 重量 -->
        <div class="weight-input-row">
          <input type="number" class="weight-number-input" id="weight-number" value="20" min="0" max="500">
          <span class="weight-unit">kg</span>
        </div>

        <div class="quick-weight">
          <button class="quick-btn" data-delta="5">+5kg</button>
          <button class="quick-btn" data-delta="10">+10kg</button>
          <button class="quick-btn" data-delta="20">+20kg</button>
          <button class="quick-btn" data-delta="-5">-5kg</button>
          <button class="quick-btn" data-delta="-10">-10kg</button>
          <button class="quick-btn" data-delta="-20">-20kg</button>
        </div>

        <!-- 回数（repsと共通） -->
        <div class="reps-input-row">
          <input type="number" class="reps-number-input" id="reps-number" value="${inputValues.reps}" min="1" max="100">
          <span class="reps-unit">回</span>
        </div>
        
        <!-- 回数スライダー（repsと共通） -->
        <div class="reps-slider-wrapper">
          <span class="slider-label">1</span>
          <input class="reps-slider" type="range" id="reps-input" min="1" max="100" step="1" value="${inputValues.reps}">
          <span class="slider-label">100</span>
        </div>

        <!-- 回数クイックボタン --> 
        <div class="quick-reps">
          <button class="quick-btn" data-value="5">5回</button>
          <button class="quick-btn" data-value="8">8回</button>
          <button class="quick-btn" data-value="10">10回</button>
          <button class="quick-btn" data-value="12">12回</button>
          <button class="quick-btn" data-value="15">15回</button>
        </div>
      </section>
    `;
  }

  inputContainer.innerHTML = html;

  setupInputEvents(format);
}

// ==============================
// イベント設定
// ==============================

function setupInputEvents(format) {
  if (format === "time") {
    const durationInputEl = document.getElementById("duration-input");
    const durationNumberEl = document.getElementById("duration-number");
    const quickBtnsEl = document.querySelectorAll(".quick-duration .quick-btn");

    if (durationInputEl) updateSliderProgress(durationInputEl);

    durationInputEl.addEventListener("input", () => {
      inputValues.duration = parseInt(durationInputEl.value, 10) || 0;
      durationNumberEl.value = inputValues.duration;
      updateSliderProgress(durationInputEl);
      updatePreview();
    });

    durationNumberEl.addEventListener("input", () => {
      inputValues.duration = parseInt(durationNumberEl.value, 10) || 0;
      durationInputEl.value = inputValues.duration;
      updateSliderProgress(durationInputEl);
      updatePreview();
    });

    quickBtnsEl.forEach((btn) => {
      btn.addEventListener("click", () => {
        inputValues.duration = parseInt(btn.dataset.value, 10);
        durationInputEl.value = inputValues.duration;
        durationNumberEl.value = inputValues.duration;
        updateSliderProgress(durationInputEl);
        updatePreview();
      });
    });
  } else if (format === "reps") {
    const repsInputEl = document.getElementById("reps-input");
    const repsNumberEl = document.getElementById("reps-number");
    const quickBtnsEl = document.querySelectorAll(".quick-reps .quick-btn");

    if (repsInputEl) updateSliderProgress(repsInputEl);

    repsInputEl.addEventListener("input", () => {
      inputValues.reps = parseInt(repsInputEl.value, 10) || 0;
      repsNumberEl.value = inputValues.reps;
      updateSliderProgress(repsInputEl);
      updatePreview();
    });

    repsNumberEl.addEventListener("input", () => {
      inputValues.reps = parseInt(repsNumberEl.value, 10) || 0;
      repsInputEl.value = inputValues.reps;
      updateSliderProgress(repsInputEl);
      updatePreview();
    });

    quickBtnsEl.forEach((btn) => {
      btn.addEventListener("click", () => {
        inputValues.reps = parseInt(btn.dataset.value, 10);
        repsInputEl.value = inputValues.reps;
        repsNumberEl.value = inputValues.reps;
        updateSliderProgress(repsInputEl);
        updatePreview();
      });
    });
  } else if (format === "weight_reps") {
    const repsInputEl = document.getElementById("reps-input");
    const repsNumberEl = document.getElementById("reps-number");
    const weightInputEl = document.getElementById("weight-number");

    if (repsInputEl) updateSliderProgress(repsInputEl);

    // reps 入力
    repsInputEl.addEventListener("input", () => {
      inputValues.reps = parseInt(repsInputEl.value, 10) || 1;
      repsNumberEl.value = inputValues.reps;
      updateSliderProgress(repsInputEl);
      updatePreview();
    });

    repsNumberEl.addEventListener("input", () => {
      inputValues.reps = parseInt(repsNumberEl.value, 10) || 1;
      repsInputEl.value = inputValues.reps;
      updateSliderProgress(repsInputEl);
      updatePreview();
    });

    const repsBtns = document.querySelectorAll(".quick-reps .quick-btn");
    repsBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        inputValues.reps = parseInt(btn.dataset.value, 10);
        repsNumberEl.value = inputValues.reps;
        repsInputEl.value = inputValues.reps;
        updateSliderProgress(repsInputEl);
        updatePreview();
      });
    });

    // weight クイックボタン
    const weightBtns = document.querySelectorAll(".quick-weight .quick-btn");
    if (weightBtns.length > 0 && weightInputEl) {
      weightBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          const delta = parseInt(btn.dataset.delta, 10) || 0;
          inputValues.weight = (inputValues.weight || 0) + delta;
          // 最小0kg、最大500kgで制限
          inputValues.weight = Math.max(0, Math.min(500, inputValues.weight));
          weightInputEl.value = inputValues.weight;
          updatePreview();
        });
      });
    }
  }
}
