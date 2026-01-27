/**
 * トレーニングデータ定義
 * 新しいトレーニングを追加する場合はこのファイルを編集
 */

// カテゴリ定義
const TRAINING_CATEGORIES = [
  { id: 'all', name: 'すべて' },
  { id: 'arms', name: '腕' },
  { id: 'legs', name: '足' },
  { id: 'abs', name: '腹筋' },
  { id: 'back', name: '背中' },
  { id: 'chest', name: '胸' },
  { id: 'fullbody', name: '全身' },
  { id: 'cardio', name: '有酸素・HIIT' },
  { id: 'martial', name: '格闘技' },
  { id: 'flexibility', name: '柔軟・体幹' },
  { id: 'water', name: '水中運動' },
  { id: 'sports', name: 'スポーツ' }
];

// トレーニング種目定義
// ※メンバーからのデータが入ったらcaloriesPerMinuteを更新
const TRAINING_TYPES = [
  // 腕
  { id: 'pushup', name: '腕立て伏せ', category: 'arms', caloriesPerMinute: 7 },
  { id: 'dumbbell_curl', name: 'ダンベルカール', category: 'arms', caloriesPerMinute: 5 },
  { id: 'triceps_dip', name: 'トライセプスディップ', category: 'arms', caloriesPerMinute: 6 },

  // 足
  { id: 'squat', name: 'スクワット', category: 'legs', caloriesPerMinute: 8 },
  { id: 'lunge', name: 'ランジ', category: 'legs', caloriesPerMinute: 7 },
  { id: 'calf_raise', name: 'カーフレイズ', category: 'legs', caloriesPerMinute: 4 },

  // 腹筋
  { id: 'crunch', name: 'クランチ', category: 'abs', caloriesPerMinute: 5 },
  { id: 'leg_raise', name: 'レッグレイズ', category: 'abs', caloriesPerMinute: 5 },
  { id: 'russian_twist', name: 'ロシアンツイスト', category: 'abs', caloriesPerMinute: 6 },

  // 背中
  { id: 'pullup', name: '懸垂', category: 'back', caloriesPerMinute: 8 },
  { id: 'back_extension', name: 'バックエクステンション', category: 'back', caloriesPerMinute: 5 },
  { id: 'rowing', name: 'ローイング', category: 'back', caloriesPerMinute: 7 },

  // 胸
  { id: 'bench_press', name: 'ベンチプレス', category: 'chest', caloriesPerMinute: 6 },
  { id: 'chest_fly', name: 'チェストフライ', category: 'chest', caloriesPerMinute: 5 },
  { id: 'incline_press', name: 'インクラインプレス', category: 'chest', caloriesPerMinute: 6 },

  // 全身
  { id: 'burpee', name: 'バーピー', category: 'fullbody', caloriesPerMinute: 10 },
  { id: 'deadlift', name: 'デッドリフト', category: 'fullbody', caloriesPerMinute: 8 },
  { id: 'kettlebell', name: 'ケトルベル', category: 'fullbody', caloriesPerMinute: 9 },

  // 有酸素・HIIT
  { id: 'running', name: 'ランニング', category: 'cardio', caloriesPerMinute: 10 },
  { id: 'walking', name: 'ウォーキング', category: 'cardio', caloriesPerMinute: 4 },
  { id: 'cycling', name: 'サイクリング', category: 'cardio', caloriesPerMinute: 8 },
  { id: 'hiit', name: 'HIIT', category: 'cardio', caloriesPerMinute: 12 },
  { id: 'jump_rope', name: '縄跳び', category: 'cardio', caloriesPerMinute: 11 },
  { id: 'stairs', name: '階段昇降', category: 'cardio', caloriesPerMinute: 9 },

  // 格闘技
  { id: 'boxing', name: 'ボクシング', category: 'martial', caloriesPerMinute: 10 },
  { id: 'kickboxing', name: 'キックボクシング', category: 'martial', caloriesPerMinute: 11 },
  { id: 'judo', name: '柔道', category: 'martial', caloriesPerMinute: 9 },
  { id: 'karate', name: '空手', category: 'martial', caloriesPerMinute: 8 },

  // 柔軟・体幹
  { id: 'yoga', name: 'ヨガ', category: 'flexibility', caloriesPerMinute: 3 },
  { id: 'plank', name: 'プランク', category: 'flexibility', caloriesPerMinute: 5 },
  { id: 'stretching', name: 'ストレッチ', category: 'flexibility', caloriesPerMinute: 2 },
  { id: 'pilates', name: 'ピラティス', category: 'flexibility', caloriesPerMinute: 4 },

  // 水中運動
  { id: 'swimming', name: '水泳', category: 'water', caloriesPerMinute: 9 },
  { id: 'aqua_walking', name: '水中ウォーキング', category: 'water', caloriesPerMinute: 5 },
  { id: 'aqua_aerobics', name: 'アクアビクス', category: 'water', caloriesPerMinute: 7 },

  // スポーツ
  { id: 'tennis', name: 'テニス', category: 'sports', caloriesPerMinute: 8 },
  { id: 'basketball', name: 'バスケットボール', category: 'sports', caloriesPerMinute: 9 },
  { id: 'soccer', name: 'サッカー', category: 'sports', caloriesPerMinute: 9 },
  { id: 'badminton', name: 'バドミントン', category: 'sports', caloriesPerMinute: 7 },
  { id: 'volleyball', name: 'バレーボール', category: 'sports', caloriesPerMinute: 6 },
  { id: 'golf', name: 'ゴルフ', category: 'sports', caloriesPerMinute: 4 },

  // その他
  { id: 'other', name: 'その他', category: 'all', caloriesPerMinute: 5 }
];

/**
 * カテゴリIDからトレーニング種目を取得
 * @param {string} categoryId - カテゴリID（'all'の場合は全種目）
 * @returns {Array} トレーニング種目の配列
 */
function getTrainingsByCategory(categoryId) {
  if (categoryId === 'all') {
    return TRAINING_TYPES;
  }
  return TRAINING_TYPES.filter(t => t.category === categoryId);
}

/**
 * トレーニングIDから種目データを取得
 * @param {string} typeId - トレーニングID
 * @returns {Object|null} トレーニング種目データ
 */
function getTrainingById(typeId) {
  return TRAINING_TYPES.find(t => t.id === typeId) || null;
}

/**
 * カロリー計算（新しいデータ構造用）
 * @param {string} typeId - トレーニングID
 * @param {number} duration - 時間（分）
 * @returns {number} 消費カロリー
 */
function calculateCaloriesNew(typeId, duration) {
  const training = getTrainingById(typeId);
  if (!training) return 0;
  return Math.round(duration * training.caloriesPerMinute);
}

/**
 * スコア計算
 * @param {number} calories - 消費カロリー
 * @returns {number} スコア
 */
function calculateScoreNew(calories) {
  return Math.round(calories * 1.5);
}
