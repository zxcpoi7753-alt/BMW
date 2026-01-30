// ==========================================
// ملف إعدادات فايربيس (مشترك للموقع والأدمن)
// المسار: js/config.js
// ==========================================

const firebaseConfig = {
    apiKey: "AIzaSyBm8ML-1EKvQT76FJlzIQf4sn4M-MHhiRk",
    authDomain: "quran-app-93e24.firebaseapp.com",
    projectId: "quran-app-93e24",
    storageBucket: "quran-app-93e24.firebasestorage.app",
    messagingSenderId: "82150677933",
    appId: "1:82150677933:web:64213e04463c1bb3179524"
};

// تهيئة فايربيس (Check if already initialized)
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// دالة مساعدة لاختصار جلب العناصر
function val(id) { return document.getElementById(id).value; }
function isChecked(id) { 
    const el = document.getElementById(id);
    return el ? el.checked : false; 
}
function setTxt(id, txt) { 
    const el = document.getElementById(id); 
    if(el && txt) el.innerText = txt; 
}
function setHTML(id, txt) { 
    const el = document.getElementById(id); 
    if(el && txt) el.innerHTML = txt; 
}
