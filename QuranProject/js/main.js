// ============================================================
// ملف: js/main.js
// الوظيفة: جلب البيانات وعرضها في الموقع (index.html)
// ============================================================

// 1. نظام التحميل الذكي (Instant Load)
// نحاول عرض البيانات من الذاكرة فوراً قبل اتصال النت
document.addEventListener('DOMContentLoaded', () => {
    const cachedData = localStorage.getItem('site_cache_v3');
    if (cachedData) {
        console.log("Loading from cache...");
        processData(JSON.parse(cachedData));
    }
});

// 2. الاستماع للبيانات الحية من فايربيس
db.ref().on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        console.log("New data received from Firebase");
        
        // تحديث الذاكرة (Cache) للمرة القادمة
        localStorage.setItem('site_cache_v3', JSON.stringify(data));
        
        // معالجة وعرض البيانات
        processData(data);

        // إخفاء شاشة التحميل بذكاء (Anti-Flicker)
        setTimeout(() => {
            const loader = document.getElementById('site-loader');
            if(loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }
        }, 500);
    }
});

// ============================================================
// 3. الدالة الرئيسية لتوزيع البيانات (The Router)
// ============================================================
function processData(data) {
    applySettings(data);           // الإعدادات (صيانة، ألوان، إخفاء)
    applyContent(data);            // النصوص (أخبار، سؤال، هيدر)
    
    // دوال الرسم (Renderers)
    renderComplexSchedule(data.schedule_complex); // الجداول
    renderCustomCards(data.custom_cards);         // البطاقات الإضافية
    renderTeachers(data.teachers_list_v2);        // المعلمون
    renderRanks(data.ranks_list);                 // الأوائل
    renderHolidays(data.holidays_list);           // الإجازات
}

// ============================================================
// 4. تطبيق الإعدادات (Settings)
// ============================================================
function applySettings(data) {
    if(!data.settings) return;
    const s = data.settings;

    // أ. وضع الصيانة
    const maint = document.getElementById('maintenance-mode');
    const container = document.querySelector('.container');
    const header = document.querySelector('header');
    
    if(s.maintenance_mode === true) {
        if(maint) maint.style.display = 'flex';
        if(container) container.style.display = 'none';
        if(header) header.style.display = 'none';
    } else {
        if(maint) maint.style.display = 'none';
        if(container) container.style.display = 'block';
        if(header) header.style.display = 'block';
    }

    // ب. الإشعار المنبثق
    const popup = document.getElementById('site-notification');
    const dontShow = localStorage.getItem('dont_show_popup');
    if(popup && s.popup_active === true && dontShow !== 'true') {
        popup.style.display = 'flex';
        setTxt('notif-title', s.popup_title || "تنبيه");
        setTxt('notif-body', s.popup_body || "...");
    } else if (popup) {
        popup.style.display = 'none';
    }

    // ج. الفيديو الخلفي
    if(s.video_url) {
        const vid = document.getElementById('bg-video');
        if(vid && !vid.src.includes(s.video_url)) vid.src = s.video_url;
    }

    // د. إخفاء/إظهار الأقسام
    toggleSection('block-news', s.show_news);
    toggleSection('block-student', s.show_student);
    toggleSection('block-question', s.show_question);
    toggleSection('block-ranks', s.show_ranks);
    toggleSection('block-schedule', s.show_schedule);
    toggleSection('block-teachers', s.show_teachers);
}

// ============================================================
// 5. تطبيق النصوص والمحتوى (Content)
// ============================================================
function applyContent(data) {
    // الهيدر
    if(data.site_content) {
        const c = data.site_content;
        setTxt('txt_header_title', c.txt_header_title);
        setTxt('txt_header_subtitle', c.txt_header_subtitle);
        setTxt('txt_header_location', c.txt_header_location);
        setHTML('txt_about_content', c.txt_about_content); // HTML للحفاظ على الأسطر
    }

    // الأخبار والسؤال
    if(data.news_bar) setTxt('dynamic-news-bar', data.news_bar.text);
    
    if(data.weekly_question) {
        setHTML('weekly-question-text', `<strong>سؤال الأسبوع:</strong> ${data.weekly_question.text}`);
        setTxt('weekly-winner-text', data.weekly_question.last_winner);
    }
}

// ============================================================
// 6. دوال الرسم (Renderers) - قلب الموقع
// ============================================================

// أ. رسم الجداول (نظام الأكورديون V3)
function renderComplexSchedule(data) {
    const container = document.getElementById('dynamic-schedule-container');
    if(!container) return;
    container.innerHTML = '';

    if(!data) { container.innerHTML = '<p style="text-align:center; color:gray;">لا توجد جداول حالياً</p>'; return; }

    Object.keys(data).sort().forEach(timeKey => {
        const timeSection = data[timeKey];
        if(!timeSection.rings) return;

        // عنوان الوقت (عصر / مغرب)
        const timeHeader = document.createElement('div');
        timeHeader.className = 'section-title';
        timeHeader.innerText = timeSection.title || "فترة";
        timeHeader.style.marginTop = "20px";
        container.appendChild(timeHeader);

        // الحلقات
        Object.values(timeSection.rings).forEach(ring => {
            // الزر
            const btn = document.createElement('div');
            btn.className = 'accordion-btn';
            btn.innerHTML = `<span>📖 ${ring.name}</span> <span>▼</span>`;
            
            // المحتوى (الجدول)
            const panel = document.createElement('div');
            panel.className = 'accordion-panel';
            
            let tableHTML = `
                <table class="schedule-table-simple">
                    <thead><tr><th>اليوم</th><th>النشاط</th></tr></thead>
                    <tbody>
                        <tr><td>السبت</td><td>${ring.sat || '-'}</td></tr>
                        <tr><td>الأحد</td><td>${ring.sun || '-'}</td></tr>
                        <tr><td>الاثنين</td><td>${ring.mon || '-'}</td></tr>
                        <tr><td>الثلاثاء</td><td>${ring.tue || '-'}</td></tr>
                        <tr><td>الأربعاء</td><td>${ring.wed || '-'}</td></tr>
                        <tr><td>الخميس</td><td>${ring.thu || '-'}</td></tr>
                    </tbody>
                </table>
                <div style="padding:10px; text-align:center;"></div>
            `;
            panel.innerHTML = tableHTML;

            // التفاعل
            btn.onclick = function() {
                this.classList.toggle('active');
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                    this.querySelector('span:last-child').innerText = '▼';
                } else {
                    panel.style.display = "block";
                    this.querySelector('span:last-child').innerText = '▲';
                }
            };

            container.appendChild(btn);
            container.appendChild(panel);
        });
    });
}

// ب. رسم البطاقات المخصصة
function renderCustomCards(list) {
    const container = document.getElementById('dynamic-custom-cards-container');
    if(!container) return;
    container.innerHTML = '';

    if(!list) return;

    Object.values(list).forEach(card => {
        if(card.active === false) return; // تخطي المخفي

        const div = document.createElement('div');
        div.className = 'custom-dynamic-card';
        div.style.borderRightColor = card.color || '#3b82f6';
        
        let html = `<h3 style="color:${card.color || '#333'}">${card.title}</h3>`;
        html += `<p style="white-space: pre-line;">${card.text}</p>`;
        
        if(card.link) {
            html += `<a href="${card.link}" target="_blank" class="nav-btn" style="margin-top:10px; border-color:${card.color}; color:${card.color}; width:auto; display:inline-block;">${card.btn_text || 'اضغط هنا'}</a>`;
        }
        div.innerHTML = html;
        container.appendChild(div);
    });
}

// ج. رسم المعلمين
function renderTeachers(list) {
    const container = document.getElementById('dynamic-teachers-container');
    if(!container) return;
    container.innerHTML = '';
    
    if(!list) { container.innerHTML = '<p>لا يوجد بيانات.</p>'; return; }

    Object.values(list).forEach(t => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.padding = '10px';
        div.style.borderBottom = '1px solid #eee';
        
        div.innerHTML = `
            <div style="width:40px; height:40px; background:#eff6ff; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-left:10px; font-size:1.2rem;">👨‍🏫</div>
            <div>
                <h4 style="margin:0;">${t.name}</h4>
                <small style="color:gray;">${t.role || 'معلم'}</small>
            </div>
        `;
        container.appendChild(div);
    });
}

// د. رسم الأوائل
function renderRanks(list) {
    const container = document.getElementById('dynamic-ranks-list');
    if(!container) return;
    container.innerHTML = '';
    
    if(!list) { container.innerHTML = '<p>سيتم الإعلان قريباً.</p>'; return; }

    let html = '<table class="schedule-table-simple"><thead><tr><th>المركز</th><th>الطالب</th><th>الحلقة</th></tr></thead><tbody>';
    
    // ترتيب الأوائل حسب المركز
    const sorted = Object.values(list).sort((a,b) => a.rank - b.rank);
    const medals = {1:'🥇', 2:'🥈', 3:'🥉'};

    sorted.forEach(r => {
        html += `<tr>
            <td>${medals[r.rank] || '#'+r.rank}</td>
            <td><strong>${r.name}</strong></td>
            <td>${r.ring}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}

// هـ. رسم الإجازات
function renderHolidays(list) {
    const ul = document.getElementById('dynamic-holidays-list');
    if(!ul) return;
    ul.innerHTML = '';
    if(!list) { ul.innerHTML = '<li>لا توجد إجازات قادمة</li>'; return; }
    Object.values(list).forEach(h => {
        const li = document.createElement('li');
        li.innerText = `🏖️ ${h.text}`;
        li.style.marginBottom = '5px';
        ul.appendChild(li);
    });
}

// ============================================================
// 7. أدوات مساعدة (Helpers)
// ============================================================
function toggleSection(id, show) {
    const el = document.getElementById(id);
    if(el) el.style.display = (show === true) ? 'block' : 'none';
}

function closePopup() {
    document.getElementById('site-notification').style.display = 'none';
}

function disablePopupForever() {
    if(document.getElementById('popup-forever-check').checked) {
        localStorage.setItem('dont_show_popup', 'true');
        closePopup();
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    // يمكن هنا حفظ وضع الثيم في localStorage مستقبلاً
}

function openLoginModal() {
    document.getElementById('login-modal').style.display = 'flex';
}
function renderRanks(list) {
    const container = document.getElementById('dynamic-ranks-list');
    if(!container) return;
    container.innerHTML = '';
    
    if(!list) { container.innerHTML = '<p>سيتم الإعلان قريباً.</p>'; return; }

    // تصميم الجدول الأخضر (V3)
    let html = `
    <table class="ranks-table">
        <thead>
            <tr>
                <th style="background:#047857; color:white;">المركز</th>
                <th style="background:#047857; color:white;">الطالب</th>
                <th style="background:#047857; color:white;">الحلقة</th>
            </tr>
        </thead>
        <tbody>`;
    
    const sorted = Object.values(list).sort((a,b) => a.rank - b.rank);
    const medals = {1:'🥇', 2:'🥈', 3:'🥉'};

    sorted.forEach(r => {
        html += `<tr>
            <td>${medals[r.rank] || '#'+r.rank}</td>
            <td style="font-weight:bold;">${r.name}</td>
            <td style="font-size:0.9rem; color:#666;">${r.ring}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
}
