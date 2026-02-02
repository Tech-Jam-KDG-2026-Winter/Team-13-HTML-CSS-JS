/**
 * Firebase設定ファイル
 */

// Firebase設定オブジェクト
const firebaseConfig = {
  apiKey: "AIzaSyC191kMreRG610ZsdWDmDDRto5nvDqrHrI",
  authDomain: "techjam-182d0.firebaseapp.com",
  projectId: "techjam-182d0",
  storageBucket: "techjam-182d0.firebasestorage.app",
  messagingSenderId: "443764196697",
  appId: "1:443764196697:web:68c578d02a466f62dbb848",
  measurementId: "G-H93XJETWS0"
};

// Firebase初期化
firebase.initializeApp(firebaseConfig);

// 各サービスへの参照をグローバルに設定
const auth = firebase.auth();
const db = firebase.firestore();

// Firestoreの設定（オフライン永続化を有効化）
db.enablePersistence()
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence failed: Multiple tabs open');
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence not supported');
    }
  });

console.log('Firebase initialized successfully');
