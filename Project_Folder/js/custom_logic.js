/* ============================================================
   ملف: js/custom_logic.js (معدل للحماية)
   الوظيفة: جلب البيانات + تسجيل الدخول الآمن
   ============================================================ */
alert("النسخة الجديدة تعمل V2");

const firebaseConfig = {
  apiKey: "AIzaSyBm8ML-1EKvQT76FJlzIQf4sn4M-MHhiRk",
  authDomain: "quran-app-93e24.firebaseapp.com",
  projectId: "quran-app-93e24",
  storageBucket: "quran-app-93e24.firebasestorage.app",
  messagingSenderId: "82150677933",
  appId: "1:82150677933:web:64213e04463c1bb3179524"
};

try {
    // تهيئة فايربيس مرة واحدة فقط
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    const db = firebase.database();
    const auth = firebase.auth(); // تعريف المصادقة

    // الاستماع للبيانات (Realtime)
    db.ref().on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            applySettings(data);
            applyContent(data);
            renderComplexSchedule(data.schedule_complex);
            
            // إخفاء اللودر عند اكتمال التحميل
            setTimeout(() => {
                const loader = document.getElementById('site-loader');
                if(loader) loader.style.opacity = '0';
                setTimeout(() => { if(loader) loader.style.display = 'none'; }, 500);
            }, 1500);
        }
    });

} catch (error) {
    console.error("Firebase Error:", error);
}

// 1. تطبيق الإعدادات العامة
function applySettings(data) {
    if(data.settings) {
        if(data.settings.maintenance_mode) {
            document.getElementById('maintenance-mode').style.display = 'flex';
        } else {
            document.getElementById('maintenance-mode').style.display = 'none';
        }
        
        handlePopup(data.settings);
        handleSections(data.settings);
        
        // الفيديو في الهيدر
        const vidContainer = document.getElementById('header-video-frame');
        if(data.settings.video_url && data.settings.video_url.length > 5) {
             vidContainer.style.display = 'block';
             vidContainer.innerHTML = `<video autoplay loop muted playsinline><source src="${data.settings.video_url}" type="video/mp4"></video>`;
        }
    }
}

// 2. تطبيق النصوص والمحتوى
function applyContent(data) {
    if(data.site_content) {
        setText('header-title', data.site_content.txt_header_title);
        setText('header-subtitle', data.site_content.txt_header_subtitle);
        setText('header-location', data.site_content.txt_header_location);
    }

    if(data.news_bar) {
        document.getElementById('dynamic-news-bar').innerHTML = 
        `<div class="poetic-text" style="background:var(--card-bg); border-right:4px solid var(--accent-color);">
            🔔 <strong>تنويه:</strong> ${data.news_bar.text}
        </div>`;
    }

    if(data.weekly_question) {
        document.getElementById('dynamic-question-box').innerHTML = 
        `<div class="card" style="border:1px solid var(--accent-color);">
            <h3 style="text-align:center; color:var(--primary-color);">💎 سؤال الأسبوع</h3>
            <p style="text-align:center; font-weight:bold; font-size:1.1rem;">${data.weekly_question.text}</p>
            <div style="background:rgba(251, 191, 36, 0.2); padding:10px; border-radius:8px; text-align:center; margin-top:10px;">
                <small>الفائز الأخير:</small><br><strong>${data.weekly_question.last_winner}</strong> 👑
            </div>
        </div>`;
    }

    if(data.custom_cards) {
        const container = document.getElementById('custom-cards-container');
        container.innerHTML = '';
        Object.values(data.custom_cards).forEach(card => {
            if(card.active) {
                container.innerHTML += `
                <div class="custom-dynamic-card" style="border-right-color:${card.color}">
                    <h3 style="color:${card.color}">${card.title}</h3>
                    <p>${card.text}</p>
                    <a href="${card.link}" target="_blank" class="nav-btn" style="display:inline-block; text-decoration:none; border-color:${card.color}; color:${card.color}; font-size:0.9rem;">
                        ${card.btn_text}
                    </a>
                </div>`;
            }
        });
    }

    renderLists(data);
}

// 3. دوال مساعدة للعرض
function setText(id, txt) { const el = document.getElementById(id); if(el) el.innerText = txt || ""; }

function handlePopup(settings) {
    if(settings.popup_active && localStorage.getItem('dont_show_popup') !== 'true') {
        document.getElementById('site-notification').style.display = 'flex';
        document.getElementById('popup-title').innerText = settings.popup_title;
        document.getElementById('popup-body').innerText = settings.popup_body;
    }
}

function handleSections(settings) {
    const map = {
        'show_ranks': 'ranks-section',
        'show_schedule': 'schedule-section',
        'show_teachers': 'teachers-section',
        'show_news': 'dynamic-news-bar',
        'show_student': 'student-login-card',
        'show_question': 'dynamic-question-box'
    };
    Object.keys(map).forEach(key => {
        const el = document.getElementById(map[key]);
        if(el) el.style.display = settings[key] ? 'block' : 'none';
    });
}

function renderLists(data) {
    // عرض الأوائل
    const ranksDiv = document.getElementById('ranks-grid-display');
    if(ranksDiv && data.ranks_list) {
        ranksDiv.innerHTML = '';
        Object.values(data.ranks_list).forEach(r => {
            ranksDiv.innerHTML += `
            <div class="student-row">
                <span>🏅 المركز ${r.rank}</span>
                <strong>${r.name}</strong>
                <small>(${r.ring})</small>
            </div>`;
        });
    }

    // عرض المعلمين
    const teachersDiv = document.getElementById('teachers-grid-display');
    if(teachersDiv && data.teachers_list_v2) {
        teachersDiv.innerHTML = '';
        Object.values(data.teachers_list_v2).forEach(t => {
            teachersDiv.innerHTML += `
            <div class="teacher-row">
                <div class="teacher-icon"><i class="fas fa-user-tie"></i></div>
                <div class="teacher-info"><h4>${t.name}</h4><p>${t.role}</p></div>
            </div>`;
        });
    }
}

function renderComplexSchedule(scheduleData) {
    const container = document.getElementById('complex-schedule-display');
    if(!container || !scheduleData) return;
    container.innerHTML = '';

    Object.keys(scheduleData).sort().forEach(timeKey => {
        const group = scheduleData[timeKey];
        if(group.rings) {
            container.innerHTML += `<div class="time-group-title">${group.title || 'فترة'}</div>`;
            Object.values(group.rings).forEach(ring => {
                // إنشاء ID عشوائي للزر
                const uid = 'ring-' + Math.floor(Math.random()*10000);
                container.innerHTML += `
                <button class="ring-accordion-btn" onclick="toggleSchedulePanel('${uid}')">
                    📖 ${ring.name} <span class="arrow-icon">▼</span>
                </button>
                <div id="${uid}" class="ring-schedule-panel">
                    <table class="schedule-table-simple">
                        <tr><th>السبت</th><th>الأحد</th><th>الاثنين</th></tr>
                        <tr><td>${ring.sat||'-'}</td><td>${ring.sun||'-'}</td><td>${ring.mon||'-'}</td></tr>
                        <tr><th>الثلاثاء</th><th>الأربعاء</th><th>الخميس</th></tr>
                        <tr><td>${ring.tue||'-'}</td><td>${ring.wed||'-'}</td><td>${ring.thu||'-'}</td></tr>
                    </table>
                </div>`;
            });
        }
    });
}

function toggleSchedulePanel(id) {
    const panel = document.getElementById(id);
    const btn = panel.previousElementSibling;
    if (panel.style.display === "block") {
        panel.style.display = "none";
        btn.classList.remove("active");
    } else {
        panel.style.display = "block";
        btn.classList.add("active");
    }
}

// ==========================================
// 4. دوال التفاعل (Popup & Login) - محدث للحماية
// ==========================================

function closePopup() {
    document.getElementById('site-notification').style.display = 'none';
}

function disablePopupForever() {
    const checkbox = document.getElementById('popup-forever-check');
    if(checkbox.checked) {
        localStorage.setItem('dont_show_popup', 'true');
        alert("تم! لن تظهر لك هذه الرسالة مرة أخرى في هذا الجهاز.");
        closePopup();
    }
}

function openLoginModal() { document.getElementById('login-modal').style.display = 'flex'; }

// دالة الدخول الجديدة (المؤمنة)
function secureLogin() {
    const email = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;
    const btn = document.querySelector('#login-modal button');
    
    if(!email || !pass) {
        alert("الرجاء إدخال البريد الإلكتروني وكلمة المرور");
        return;
    }

    const oldText = btn.innerText;
    btn.innerText = "جاري التحقق...";

    firebase.auth().signInWithEmailAndPassword(email, pass)
        .then((userCredential) => {
            console.log("تم تسجيل الدخول:", userCredential.user.email);
            window.location.href = "admin.html";
        })
        .catch((error) => {
            btn.innerText = oldText;
            if(error.code === 'auth/user-not-found') alert("⛔ هذا المستخدم غير موجود!");
            else if (error.code === 'auth/wrong-password') alert("⛔ كلمة المرور خاطئة!");
            else alert("⛔ حدث خطأ: " + error.message);
        });
}
