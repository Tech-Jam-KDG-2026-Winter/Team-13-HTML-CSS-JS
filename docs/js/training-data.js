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
// { id: '英語名', name: '種目名', category: 'arms' caloriesPerMinute:カロリー },
// ※メンバーからのデータが入ったらcaloriesPerMinuteを更新
const TRAINING_TYPES = [
  // 腕
  { id: 'Arm curl', name: 'アームカール', category: 'arms', caloriesPerMinute: 5 },
  { id: 'Barbell curl', name: 'バーベルカール', category: 'arms', caloriesPerMinute: 6 },
  { id: 'Triceps extension', name: 'トライセプスエクステンション', category: 'arms', caloriesPerMinute: 7 },
  { id: 'Dips', name: 'ディップス', category: 'arms', caloriesPerMinute: 9 },
  { id: 'Hammer curl', name: 'ハンマーカール', category: 'arms', caloriesPerMinute: 6 },
  { id: 'Chest press (machine)', name: 'チェストプレス(マシン)', category: 'arms', caloriesPerMinute: 4 },
  { id: 'Concentration curl', name: 'コンセントレーションカール', category: 'arms', caloriesPerMinute: 5 },
  { id: 'Cable curl', name: 'ケーブルカール', category: 'arms', caloriesPerMinute: 6 },
  { id: 'Preacher curl', name: 'プリーチャーカール', category: 'arms', caloriesPerMinute: 5 },
  { id: 'Triceps kickback', name: 'トライセプスキックバック', category: 'arms', caloriesPerMinute: 5 },
  { id: 'Overhead triceps extension', name: 'オーバーヘッドトライセプスエクステンション', category: 'arms', caloriesPerMinute: 6 },
  { id: 'Diamond push-up', name: 'ダイヤモンドプッシュアップ', category: 'arms', caloriesPerMinute: 6 },
  { id: 'Bench dips', name: 'ベンチディップス', category: 'arms', caloriesPerMinute: 8 },
  { id: 'Cable pushdown', name: 'ケーブルプッシュダウン', category: 'arms', caloriesPerMinute: 6 },


  // 足
  { id: 'Squat', name: 'スクワット', category: 'legs', caloriesPerMinute: 5 },
  { id: 'Jump Squat', name: 'ジャンプスクワット', category: 'legs', caloriesPerMinute: 8 },
  { id: 'Wide Squat', name: 'ワイドスクワット', category: 'legs', caloriesPerMinute: 6 },
  { id: 'Bulgarian Split Squat', name: 'ブルガリアンスクワット', category: 'legs', caloriesPerMinute: 8 },
  { id: 'Lunge', name: 'ランジ', category: 'legs', caloriesPerMinute: 5 },
  { id: 'Walking lunge', name: 'ウォーキングランジ', category: 'legs', caloriesPerMinute: 7 },
  { id: 'Leg press', name: 'レッグプレス', category: 'legs', caloriesPerMinute: 7 },
  { id: 'Leg extension', name: 'レッグエクステンション', category: 'legs', caloriesPerMinute: 8 },
  { id: 'Leg curl', name: 'レッグカール', category: 'legs', caloriesPerMinute: 8 },
  { id: 'Sissy squat', name: 'シシースクワット', category: 'legs', caloriesPerMinute: 6 },
  { id: 'Fire hydrant', name: 'ファイアハイドラント', category: 'legs', caloriesPerMinute: 4 },
  { id: 'Side lunge', name: 'サイドランジ', category: 'legs', caloriesPerMinute: 5 },
  { id: 'Reverse lunge', name: 'リバースランジ', category: 'legs', caloriesPerMinute: 5 },
  { id: 'Calf raise', name: 'カーフレイズ(ふくらはぎ)', category: 'legs', caloriesPerMinute: 4 },
  { id: 'Hip bridge', name: 'ヒップブリッジ', category: 'legs', caloriesPerMinute: 4 },
  { id: 'Hip thrust', name: 'ヒップスラスト', category: 'legs', caloriesPerMinute: 6 },
  { id: 'Donkey kick', name: 'ドンキーキック', category: 'legs', caloriesPerMinute: 4 },
  { id: 'Leg adduction (inner thigh)', name: 'レッグアダクション(内もも)', category: 'legs', caloriesPerMinute: 4 },
  { id: 'Leg abduction (outer thigh)', name: 'レッグアブダクション(外もも)', category: 'legs', caloriesPerMinute: 4 },
  { id: 'Good morning', name: 'グッドモーニング', category: 'legs', caloriesPerMinute: 6 },
  { id: 'Step-up', name: 'ステップアップ', category: 'legs', caloriesPerMinute: 8 },
  { id: 'Barbell Squat (High Intensity)', name: 'バーベルスクワッド(高強度)', category: 'legs', caloriesPerMinute: 6 },
  { id: 'Barbell Squat (Medium Intensity)', name: 'バーベルスクワッド(中強度)', category: 'legs', caloriesPerMinute: 8 },
  { id: 'Barbell Squat (Low Intensity)', name: 'バーベルスクワッド(低強度)', category: 'legs', caloriesPerMinute: 12 },
  { id: 'Hack Squat', name: 'ハックスクワッド', category: 'legs', caloriesPerMinute: 7 },


  // 腹筋
  { id: 'crunch', name: 'クランチ', category: 'abs', caloriesPerMinute: 5 },
  { id: 'leg_raise', name: 'レッグレイズ', category: 'abs', caloriesPerMinute: 5 },
  { id: 'russian_twist', name: 'ロシアンツイスト', category: 'abs', caloriesPerMinute: 6 },

  // 背中
  { id: 'Deadlift (High Intensity)', name: 'デッドリフト(高強度)', category: 'back', caloriesPerMinute: 6 },
  { id: 'Deadlift (Medium Intensity)', name: 'デッドリフト(中強度)', category: 'back', caloriesPerMinute: 8 },
  { id: 'Deadlift (Low Intensity)', name: 'デッドリフト(低強度)', category: 'back', caloriesPerMinute: 10 },
  { id: 'Lat Pulldown', name: 'ラットプルダウン', category: 'back', caloriesPerMinute: 8 },
  { id: 'Rowing (moderate)', name: 'ローイング(ほどほど)', category: 'back', caloriesPerMinute: 5 },
  { id: 'Rowing (intense)', name: 'ローイング(きつい)', category: 'back', caloriesPerMinute: 6 },
  { id: 'Pull-ups', name: '懸垂(プルアップ)', category: 'back', caloriesPerMinute: 9 },
  { id: 'Back Extension', name: 'バックエクステンション', category: 'back', caloriesPerMinute: 5 },
  { id: 'Superman', name: 'スーパーマン', category: 'back', caloriesPerMinute: 4 },
  { id: 'Bent-Over Row', name: 'ベントオーバーロウ', category: 'back', caloriesPerMinute: 6 },
  { id: 'One-Arm Row', name: 'ワンハンドロウ', category: 'back', caloriesPerMinute: 6 },
  { id: 'Seated Row', name: 'シーテッドロウ', category: 'back', caloriesPerMinute: 5 },
  { id: 'Face Pull', name: 'フェイスプル', category: 'back', caloriesPerMinute: 5 },
  { id: 'Shrug', name: 'シュラッグ', category: 'back', caloriesPerMinute: 5 },
  { id: 'Chin-ups', name: '懸垂(チンアップ)', category: 'back', caloriesPerMinute: 9 },
  { id: 'Incline Pull-ups (Australian Pull-ups)', name: '斜め懸垂(オーストラリアンプルアップ)', category: 'back', caloriesPerMinute: 6 },
  

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
