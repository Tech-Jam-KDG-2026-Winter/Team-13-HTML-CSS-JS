// カテゴリ定義
const TRAINING_STYLES = [
  { id: 'all', name: 'すべて' },
  { id: 'aerobic', name: '有酸素・スポーツ' },
  { id: 'bodyweight', name: '自重トレ' },
  { id: 'gym', name: 'ジム（ウェイト）' }
];

const TRAINING_CATEGORIES = [
  { id: 'all', name: 'すべて' },
  { id: 'favorites', name: 'お気に入り' },
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

// 入力フォーマットを変える
const TRAINING_FORMATS = {
  //TRAINING_FORMATS.TIME= 時間のみ, REPS = 回数のみ WEIGHT_REPS = 重量と回数を入れる
  TIME: 'time',
  REPS: 'reps',
  WEIGHT_REPS: 'weight_reps'
};

/* トレーニング種目定義
{ id: '英語名', name: '種目名', category: 'arms' caloriesPerMinute:カロリー, trainingStyle: '', format:''},
※メンバーからのデータが入ったらcaloriesPerMinuteを更新
trainingStyleを有酸素かスポーツの時はaerobic、ジムで行える種目の場合はgym、自重で行える種目の場合はbodyweightの3つに分類
formatで時間入力なのか、回数入力なのか、重量+回数入力なのかを分岐させる。
basemets は ウェイト種目は4.5、自重種目は3.8で固定
*/ 
const TRAINING_TYPES = [
  
  // 腕
  { id: 'Arm curl', name: 'アームカール', category: 'arms', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Barbell curl', name: 'バーベルカール', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Dips', name: 'ディップス', category: 'arms', caloriesPerMinute: 9, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets: 3.8 },
  { id: 'Hammer curl', name: 'ハンマーカール', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Concentration curl', name: 'コンセントレーションカール', category: 'arms', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Triceps extension', name: 'トライセプスエクステンション', category: 'arms', caloriesPerMinute: 7, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Cable curl', name: 'ケーブルカール', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Preacher curl', name: 'プリーチャーカール', category: 'arms', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Triceps kickback', name: 'トライセプスキックバック', category: 'arms', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Overhead triceps extension', name: 'オーバーヘッドトライセプスエクステンション', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5, },
  { id: 'Diamond push-up', name: 'ダイヤモンドプッシュアップ', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets: 3.8 },
  { id: 'Bench dips', name: 'ベンチディップス', category: 'arms', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets: 3.8 },
  { id: 'Cable pushdown', name: 'ケーブルプッシュダウン', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5 },
  { id: 'Close-grip bench press', name: 'クローズグリップ・ベンチプレス', category: 'arms', caloriesPerMinute: 8, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5 },
  { id: 'Incline dumbbell curl', name: 'インクラインダンベルカール', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets: 4.5 },
  { id: 'Reverse curl', name: 'リバースカール', category: 'arms', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5 },
  { id: 'Skull crusher', name: 'スカルクラッシャー', category: 'arms', caloriesPerMinute: 7, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets: 4.5},
  { id: 'Chin-up (narrow)', name: 'チンニング（ナロー）', category: 'arms', caloriesPerMinute: 9, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8},
  
  // 足
  { id: 'Barbell Squat', name: 'バーベルスクワット', category: 'legs', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Squat', name: 'スクワット', category: 'legs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Jump Squat', name: 'ジャンプスクワット', category: 'legs', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Wide Squat', name: 'ワイドスクワット', category: 'legs', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Bulgarian Split Squat', name: 'ブルガリアンスクワット', category: 'legs', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Lunge', name: 'ランジ', category: 'legs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Walking lunge', name: 'ウォーキングランジ', category: 'legs', caloriesPerMinute: 7, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Leg press', name: 'レッグプレス', category: 'legs', caloriesPerMinute: 7, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Leg extension', name: 'レッグエクステンション', category: 'legs', caloriesPerMinute: 8, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Leg curl', name: 'レッグカール', category: 'legs', caloriesPerMinute: 8, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Sissy squat', name: 'シシースクワット', category: 'legs', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Fire hydrant', name: 'ファイアハイドラント', category: 'legs', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Side lunge', name: 'サイドランジ', category: 'legs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Reverse lunge', name: 'リバースランジ', category: 'legs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Calf raise', name: 'カーフレイズ(ふくらはぎ)', category: 'legs', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Calf raise(gym)', name: 'カーフレイズ(マシンorダンベル)', category: 'legs', caloriesPerMinute: 4, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Hip bridge', name: 'ヒップブリッジ', category: 'legs', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Hip thrust', name: 'ヒップスラスト', category: 'legs', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Donkey kick', name: 'ドンキーキック', category: 'legs', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Leg adduction (inner thigh)', name: 'レッグアダクション(内もも)', category: 'legs', caloriesPerMinute: 4, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Leg abduction (outer thigh)', name: 'レッグアブダクション(外もも)', category: 'legs', caloriesPerMinute: 4, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Good morning', name: 'グッドモーニング', category: 'legs', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Step-up', name: 'ステップアップ', category: 'legs', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Hack Squat', name: 'ハックスクワット', category: 'legs', caloriesPerMinute: 7, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  
  // 腹筋
  { id: 'Crunch', name: 'クランチ', category: 'abs', caloriesPerMinute: 3, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Plank', name: 'プランク', category: 'abs', caloriesPerMinute: 3, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets:3.8 },
  { id: 'Leg Raise', name: 'レッグレイズ', category: 'abs', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Russian Twist', name: 'ロシアンツイスト', category: 'abs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Sit-up', name: 'シットアップ', category: 'abs', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Bicycle Crunch', name: 'バイシクルクランチ', category: 'abs', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Reverse Crunch', name: 'リバースクランチ', category: 'abs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Torch Touch', name: 'トーチタッチ', category: 'abs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Hanging Leg Raise', name: 'ハンギングレッグレイズ', category: 'abs', caloriesPerMinute: 7, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Knee Raise', name: 'ニーレイズ', category: 'abs', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Side Plank', name: 'サイドプランク', category: 'abs', caloriesPerMinute: 3, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets:3.8 },
  { id: 'Flutter Kick', name: 'フラッターキック', category: 'abs', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Mountain Climber', name: 'マウンテンクライマー', category: 'abs', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Plank (Dynamic)', name: 'プランク(ダイナミック)', category: 'abs', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Dragon Flag', name: 'ドラゴンフラッグ', category: 'abs', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Ab Roller', name: 'アブローラー', category: 'abs', caloriesPerMinute: 7, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Dead Bug', name: 'デッドバグ', category: 'abs', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },

  
  // 背中
  { id: 'Deadlift', name: 'デッドリフト', category: 'back', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Lat Pulldown', name: 'ラットプルダウン', category: 'back', caloriesPerMinute: 8, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Rowing', name: 'ローイング', category: 'back', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Pull-ups', name: '懸垂(プルアップ)', category: 'back', caloriesPerMinute: 9, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Back Extension', name: 'バックエクステンション', category: 'back', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets:4.5 },
  { id: 'Superman', name: 'スーパーマン', category: 'back', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Bent-Over Row', name: 'ベントオーバーロウ', category: 'back', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets:4.5 },
  { id: 'One-Arm Row', name: 'ワンハンドロウ', category: 'back', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets:4.5 },
  { id: 'Seated Row', name: 'シーテッドロウ', category: 'back', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets:4.5 },
  { id: 'Face Pull', name: 'フェイスプル', category: 'back', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets:4.5 },
  { id: 'Shrug', name: 'シュラッグ', category: 'back', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets:4.5 },
  { id: 'Chin-ups', name: '懸垂(チンアップ)', category: 'back', caloriesPerMinute: 9, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Incline Pull-ups (Australian Pull-ups)', name: '斜め懸垂(オーストラリアンプルアップ)', category: 'back', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },

  // 胸
  { id: 'Bench Press', name: 'ベンチプレス', category: 'chest', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Dumbbell Fly', name: 'ダンベルフライ', category: 'chest', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Push-ups (Standard)', name: '腕立て伏せ(普通)', category: 'chest', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Push-ups (Hard)', name: '腕立て伏せ(きつい)', category: 'chest', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Chest Press (Machine)', name: 'チェストプレス(マシン)', category: 'chest', caloriesPerMinute: 4, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Pec Fly (Machine)', name: 'ペックフライ（マシン）', category: 'chest', caloriesPerMinute: 6, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Incline Press (Dumbbell)', name: 'インクラインプレス（ダンベル）', category: 'chest', caloriesPerMinute: 10, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Diamond Push-ups', name: 'ダイヤモンドプッシュアップ', category: 'chest', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Wide Push-ups', name: 'ワイドプッシュアップ', category: 'chest', caloriesPerMinute: 5, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Decline Push-ups', name: 'デクラインプッシュアップ', category: 'chest', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Incline Push-ups', name: 'インクラインプッシュアップ', category: 'chest', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Cable Crossovers', name: 'ケーブルクロスオーバー', category: 'chest', caloriesPerMinute: 5, trainingStyle: 'gym', format: TRAINING_FORMATS.WEIGHT_REPS, baseMets:4.5 },
  { id: 'Dips (Chest Focus)', name: 'ディップス(胸重視)', category: 'chest', caloriesPerMinute: 9, trainingStyle: 'gym', format: TRAINING_FORMATS.REPS, baseMets:4.5 },
  { id: 'Push-up Bars', name: 'プッシュアップバー', category: 'chest', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },

  // 全身
  { id: 'Burpee', name: 'バーピー', category: 'fullbody', caloriesPerMinute: 10, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Jumping Jack', name: 'ジャンピングジャック', category: 'fullbody', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'High Knees', name: 'ハイニー(もも上げ)', category: 'fullbody', caloriesPerMinute: 9, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Butt Kicks', name: 'バットキック', category: 'fullbody', caloriesPerMinute: 9, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Inchworm', name: 'インチワーム', category: 'fullbody', caloriesPerMinute: 6, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Bear Crawl', name: 'ベアクロール', category: 'fullbody', caloriesPerMinute: 8, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },
  { id: 'Crab Walk', name: 'クラブウォーク', category: 'fullbody', caloriesPerMinute: 7, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.REPS, baseMets:3.8 },


  // 有酸素・HIIT
  { id: 'Walking (Normal)', name: 'ウォーキング(普通)', category: 'cardio', caloriesPerMinute: 4, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 3.0 },
  { id: 'Walking (Fast)', name: 'ウォーキング(速い)', category: 'cardio', caloriesPerMinute: 5, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 4.3 },
  { id: 'Running (all-out)', name: 'ランニング(全力)', category: 'cardio', caloriesPerMinute: 14, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 16.0 },
  { id: 'Running (moderate)', name: 'ランニング(そこそこ)', category: 'cardio', caloriesPerMinute: 10, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 11.0 },
  { id: 'Running (slow)', name: 'ランニング(ゆっくり)', category: 'cardio', caloriesPerMinute: 7, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 8.0 },
  { id: 'Skater', name: 'スケーター', category: 'cardio', caloriesPerMinute: 9, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 7.0 },

  // 格闘技
  { id: 'Shadow boxing', name: 'シャドーボクシング', category: 'martial', caloriesPerMinute: 6, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 6.0 },
  { id: 'Kickboxing', name: 'キックボクシング', category: 'martial', caloriesPerMinute: 11, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 12.0 },
  { id: 'Punching the heavy bag', name: 'サンドバッグ打ち', category: 'martial', caloriesPerMinute: 6, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 6.5 },
  { id: 'Air kicks', name: 'エアキック', category: 'martial', caloriesPerMinute: 8, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 8.0 },

  // 柔軟・体幹
  { id: 'Yoga (Light)', name: 'ヨガ(軽い)', category: 'flexibility', caloriesPerMinute: 2, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets: 2.5 },
  { id: 'Yoga (Power Yoga)', name: 'ヨガ(パワーヨガ)', category: 'flexibility', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets: 3.5 },
  { id: 'Pilates', name: 'ピラティス', category: 'flexibility', caloriesPerMinute: 3, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets: 3.0 },
  { id: 'Stretching', name: 'ストレッチ', category: 'flexibility', caloriesPerMinute: 2, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets: 2.0 },
  { id: 'Gymnastics (Light)', name: '体操(軽い)', category: 'flexibility', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets: 3.5 },
  { id: 'Tai Chi', name: '太極拳', category: 'flexibility', caloriesPerMinute: 4, trainingStyle: 'bodyweight', format: TRAINING_FORMATS.TIME, baseMets: 3.0 },

  // 水中運動
  { id: 'Swimming (Freestyle, slow)', name: '水泳(クロール・ゆっくり)', category: 'water', caloriesPerMinute: 6, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 6.0 },
  { id: 'Swimming (Freestyle, fast)', name: '水泳(クロール・速い)', category: 'water', caloriesPerMinute: 11, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 10.0 },
  { id: 'Swimming (Breaststroke)', name: '水泳(平泳ぎ)', category: 'water', caloriesPerMinute: 8, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 8.0 },
  { id: 'Swimming (Backstroke)', name: '水泳(背泳ぎ)', category: 'water', caloriesPerMinute: 7, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 7.0 },
  { id: 'Swimming (Butterfly)', name: '水泳(バタフライ)', category: 'water', caloriesPerMinute: 12, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 13.0 },
  { id: 'Aqua Walking', name: '水中ウォーキング', category: 'water', caloriesPerMinute: 4, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 3.5 },
  { id: 'Aqua Aerobics', name: '水中エアロビクス', category: 'water', caloriesPerMinute: 5, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 4.5 },

  // スポーツ
  { id: 'Tennis (Singles)', name: 'テニス(シングルス)', category: 'sports', caloriesPerMinute: 8, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 8.0 },
  { id: 'Tennis (Doubles)', name: 'テニス(ダブルス)', category: 'sports', caloriesPerMinute: 6, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 6.0 },
  { id: 'Badminton', name: 'バドミントン', category: 'sports', caloriesPerMinute: 6, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 7.0 },
  { id: 'Table Tennis', name: '卓球', category: 'sports', caloriesPerMinute: 4, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 4.0 },
  { id: 'Basketball', name: 'バスケットボール', category: 'sports', caloriesPerMinute: 7, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 8.0 },
  { id: 'Soccer', name: 'サッカー', category: 'sports', caloriesPerMinute: 9, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 9.0 },
  { id: 'Volleyball', name: 'バレーボール', category: 'sports', caloriesPerMinute: 6, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 5.0 },
  { id: 'Baseball', name: '野球', category: 'sports', caloriesPerMinute: 5, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 3.5 },
  { id: 'Bowling', name: 'ボウリング', category: 'sports', caloriesPerMinute: 3, trainingStyle: 'aerobic', format: TRAINING_FORMATS.TIME, baseMets: 3.0 },
];


/**
 * カテゴリとトレーニングスタイルで種目を取得
 * @param {string} categoryId - カテゴリID（'all' の場合は全カテゴリ）
 * @param {string} styleId - トレーニングスタイルID（'all' の場合は全スタイル）
 * @returns {Array} トレーニング種目の配列
 */
function getTrainings(categoryId, styleId) {
  return TRAINING_TYPES.filter(t => {
    const matchCategory =
      categoryId === 'all' || t.category === categoryId;

    const matchStyle =
      styleId === 'all' || t.trainingStyle === styleId;

    return matchCategory && matchStyle;
  });
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
 * カロリー計算（time / reps / weight_reps対応、体重 optional）
 * @param {string} typeId - トレーニングID
 * @param {number} input1 - time:分, reps:回数, weight_reps:重量(kg)
 * @param {number|null} input2 - weight_repsのみ回数
 * @param {number|null} userWeight - ユーザー体重(kg)。未入力なら60kg
 * @returns {number} 消費カロリー
 */
function calculateCaloriesNew(typeId, input1, input2 = null, userWeight = 60) {
  const training = TRAINING_TYPES.find(t => t.id === typeId);
  if (!training) return 0;

  const weight = userWeight || 60; // 未入力なら60kg

  switch (training.format) {
    case TRAINING_FORMATS.TIME:
      // input1 = 分
      return Math.round(input1 * training.caloriesPerMinute * (weight / 60)); 
      // 体重を加味（60kg基準）

    case TRAINING_FORMATS.REPS:
      // input1 = 回数
      return Math.round(input1 * (training.caloriesPerMinute / 10) * (weight / 60));
      // 10回で1分相当として換算、体重加味

    case TRAINING_FORMATS.WEIGHT_REPS:
      // input1 = 重量(kg), input2 = 回数
      if (input2 === null) return 0;
      return Math.round(input1 * input2 * training.baseMets * (weight / 60) * 0.1); 
      // 0.1は調整係数、体重加味

    default:
      return 0;
  }
}

/**
 * スコア計算
 * @param {number} calories - 消費カロリー
 * @returns {number} スコア
 */
function calculateScoreNew(calories) {
  return Math.round(calories * 1.5);
}