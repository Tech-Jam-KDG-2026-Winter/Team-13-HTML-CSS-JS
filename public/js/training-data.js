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
  { id: 'Crunch (Regular)', name: 'クランチ(普通)', category: 'abs', caloriesPerMinute: 3 },
  { id: 'Crunch (Intense)', name: 'クランチ(きつい)', category: 'abs', caloriesPerMinute: 8 },
  { id: 'Plank', name: 'プランク', category: 'abs', caloriesPerMinute: 3 },
  { id: 'Leg Raise', name: 'レッグレイズ', category: 'abs', caloriesPerMinute: 4 },
  { id: 'Russian Twist', name: 'ロシアンツイスト', category: 'abs', caloriesPerMinute: 5 },
  { id: 'Sit-up', name: 'シットアップ', category: 'abs', caloriesPerMinute: 8 },
  { id: 'Bicycle Crunch', name: 'バイシクルクランチ', category: 'abs', caloriesPerMinute: 6 },
  { id: 'Reverse Crunch', name: 'リバースクランチ', category: 'abs', caloriesPerMinute: 5 },
  { id: 'Torch Touch', name: 'トーチタッチ', category: 'abs', caloriesPerMinute: 5 },
  { id: 'Hanging Leg Raise', name: 'ハンギングレッグレイズ', category: 'abs', caloriesPerMinute: 7 },
  { id: 'Knee Raise', name: 'ニーレイズ', category: 'abs', caloriesPerMinute: 5 },
  { id: 'Russian Twist', name: 'ロシアンツイスト', category: 'abs', caloriesPerMinute: 5 },
  { id: 'Side Plank', name: 'サイドプランク', category: 'abs', caloriesPerMinute: 3 },
  { id: 'Flutter Kick', name: 'フラッターキック', category: 'abs', caloriesPerMinute: 6 },
  { id: 'Mountain Climber', name: 'マウンテンクライマー', category: 'abs', caloriesPerMinute: 8 },
  { id: 'Plank (Dynamic)', name: 'プランク(ダイナミック)', category: 'abs', caloriesPerMinute: 6 },
  { id: 'Dragon Flag', name: 'ドラゴンフラッグ', category: 'abs', caloriesPerMinute: 8 },
  { id: 'Ab Roller', name: 'アブローラー', category: 'abs', caloriesPerMinute: 7 },
  { id: 'Dead Bug', name: 'デッドバグ', category: 'abs', caloriesPerMinute: 4 },

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
  { id: 'Bench Press (High Intensity)', name: 'ベンチプレス(高強度)', category: 'chest', caloriesPerMinute: 5 },
  { id: 'Bench Press (Medium Intensity)', name: 'ベンチプレス(中強度)', category: 'chest', caloriesPerMinute: 7 },
  { id: 'Bench Press (Low Intensity)', name: 'ベンチプレス(低強度)', category: 'chest', caloriesPerMinute: 9 },
  { id: 'Dumbbell Fly', name: 'ダンベルフライ', category: 'chest', caloriesPerMinute: 6 },
  { id: 'Push-ups (Standard)', name: '腕立て伏せ(普通)', category: 'chest', caloriesPerMinute: 4 },
  { id: 'Push-ups (Hard)', name: '腕立て伏せ(きつい)', category: 'chest', caloriesPerMinute: 8 },
  { id: 'Chest Press (Machine)', name: 'チェストプレス(マシン)', category: 'chest', caloriesPerMinute: 4 },
  { id: 'Pec Fly (Machine)', name: 'ペックフライ（マシン）', category: 'chest', caloriesPerMinute: 6 },
  { id: 'Incline Press (Dumbbell)', name: 'インクラインプレス（ダンベル）', category: 'chest', caloriesPerMinute: 10 },
  { id: 'Diamond Push-ups', name: 'ダイヤモンドプッシュアップ', category: 'chest', caloriesPerMinute: 6 },
  { id: 'Wide Push-ups', name: 'ワイドプッシュアップ', category: 'chest', caloriesPerMinute: 5 },
  { id: 'Decline Push-ups', name: 'デクラインプッシュアップ', category: 'chest', caloriesPerMinute: 6 },
  { id: 'Incline Push-ups', name: 'インクラインプッシュアップ', category: 'chest', caloriesPerMinute: 4 },
  { id: 'Cable Crossovers', name: 'ケーブルクロスオーバー', category: 'chest', caloriesPerMinute: 5 },
  { id: 'Dips (Chest Focus)', name: 'ディップス(胸重視)', category: 'chest', caloriesPerMinute: 9 },
  { id: 'Push-up Bars', name: 'プッシュアップバー', category: 'chest', caloriesPerMinute: 6 },

  // 全身
  { id: 'Burpee', name: 'バーピー', category: 'fullbody', caloriesPerMinute: 10 },
  { id: 'Jumping Jack', name: 'ジャンピングジャック', category: 'fullbody', caloriesPerMinute: 8 },
  { id: 'High Knees', name: 'ハイニー(もも上げ)', category: 'fullbody', caloriesPerMinute: 9 },
  { id: 'Butt Kicks', name: 'バットキック', category: 'fullbody', caloriesPerMinute: 9 },
  { id: 'Inchworm', name: 'インチワーム', category: 'fullbody', caloriesPerMinute: 6 },
  { id: 'Bear Crawl', name: 'ベアクロール', category: 'fullbody', caloriesPerMinute: 8 },
  { id: 'Crab Walk', name: 'クラブウォーク', category: 'fullbody', caloriesPerMinute: 7 },

  // 有酸素・HIIT
  { id: 'Skater', name: 'スケーター', category: 'cardio', caloriesPerMinute: 9 },
  { id: 'Walking (Normal)', name: 'ウォーキング(普通)', category: 'cardio', caloriesPerMinute: 4 },
  { id: 'Walking (Fast)', name: 'ウォーキング(速い)', category: 'cardio', caloriesPerMinute: 5 },
  { id: 'Running (all-out)', name: 'ランニング(全力)', category: 'cardio', caloriesPerMinute: 14 },
  { id: 'Running (moderate)', name: 'ランニング(そこそこ)', category: 'cardio', caloriesPerMinute: 10 },
  { id: 'Running (slow)', name: 'ランニング(ゆっくり)', category: 'cardio', caloriesPerMinute: 7 },

  // 格闘技
  { id: 'Shadow boxing', name: 'シャドーボクシング', category: 'martial', caloriesPerMinute: 6 },
  { id: 'Kickboxing', name: 'キックボクシング', category: 'martial', caloriesPerMinute: 11 },
  { id: 'Punching the heavy bag', name: 'サンドバッグ打ち', category: 'martial', caloriesPerMinute: 6 },
  { id: 'Air kicks', name: 'エアキック', category: 'martial', caloriesPerMinute: 8 },

  // 柔軟・体幹
  { id: 'Yoga (Light)', name: 'ヨガ(軽い)', category: 'flexibility', caloriesPerMinute: 2 },
  { id: 'Yoga (Power Yoga)', name: 'ヨガ(パワーヨガ)', category: 'flexibility', caloriesPerMinute: 4 },
  { id: 'Pilates', name: 'ピラティス', category: 'flexibility', caloriesPerMinute: 3 },
  { id: 'Stretching', name: 'ストレッチ', category: 'flexibility', caloriesPerMinute: 2 },
  { id: 'Gymnastics (Light)', name: '体操(軽い)', category: 'flexibility', caloriesPerMinute: 4 },
  { id: 'Tai Chi', name: '太極拳', category: 'flexibility', caloriesPerMinute: 4 },

  // 水中運動
  { id: 'Swimming (Freestyle, slow)', name: '水泳(クロール・ゆっくり)', category: 'water', caloriesPerMinute: 6 },
  { id: 'Swimming (Freestyle, fast)', name: '水泳(クロール・速い)', category: 'water', caloriesPerMinute: 11 },
  { id: 'Swimming (Breaststroke)', name: '水泳(平泳ぎ)', category: 'water', caloriesPerMinute: 8 },
  { id: 'Swimming (Backstroke)', name: '水泳(背泳ぎ)', category: 'water', caloriesPerMinute: 7 },
  { id: 'Swimming (Butterfly)', name: '水泳(バタフライ)', category: 'water', caloriesPerMinute: 12 },
  { id: 'Aqua Walking', name: '水中ウォーキング', category: 'water', caloriesPerMinute: 4 },
  { id: 'Aqua Aerobics', name: '水中エアロビクス', category: 'water', caloriesPerMinute: 5 },

  // スポーツ
  { id: 'Tennis (Singles)', name: 'テニス(シングルス)', category: 'sports', caloriesPerMinute: 8 },
  { id: 'Tennis (Doubles)', name: 'テニス(ダブルス)', category: 'sports', caloriesPerMinute: 6 },
  { id: 'Badminton', name: 'バドミントン', category: 'sports', caloriesPerMinute: 6 },
  { id: 'Table Tennis', name: '卓球', category: 'sports', caloriesPerMinute: 4 },
  { id: 'Basketball', name: 'バスケットボール', category: 'sports', caloriesPerMinute: 7 },
  { id: 'Soccer', name: 'サッカー', category: 'sports', caloriesPerMinute: 9 },
  { id: 'Volleyball', name: 'バレーボール', category: 'sports', caloriesPerMinute: 6 },
  { id: 'Baseball', name: '野球', category: 'sports', caloriesPerMinute: 5 },
  { id: 'Bowling', name: 'ボウリング', category: 'sports', caloriesPerMinute: 3 },

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
