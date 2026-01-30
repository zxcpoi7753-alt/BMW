// ============================================================
// ملف: js/admin.js
// الوظيفة: التحكم الكامل بالموقع (حفظ، تعديل، حذف)
// ============================================================

// 1. التحقق من الدخول (Security Check)
const token = localStorage.getItem('admin_token');
if (token !== 'SECRET_PASS_123') {
    window.location.replace("index.html"); // طرد المتطفلين
}

function logout() {
    if(confirm("هل تريد تسجيل الخروج؟")) {
        localStorage.removeItem('admin_token');
        window.location.replace("index.html");
    }
}

// 2. التنقل بين التبويبات (Tabs Navigation)
function showTab(tabId) {
    // إخفاء كل الصفحات
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    // إظهار الصفحة المطلوبة
    document.getElementById(tabId).classList.add('active');
    
    // تلوين الزر في القائمة
    document.querySelectorAll('.menu a').forEach(a => a.classList.remove('active'));
    event.target.closest('a').classList.add('active');
}

// ============================================================
// 3. دوال الحفظ الأساسية (Settings & Content)
// ============================================================

// أ. حفظ الإعدادات العامة
function saveGeneral() {
    // تحديث النصوص
    db.ref('site_content').update({
        txt_header_title: val('inp_header_title'),
        txt_header_subtitle: val('inp_header_subtitle'),
        txt_header_location: val('inp_header_location')
    });
    // تحديث الإعدادات
    db.ref('settings').update({
        video_url: val('inp_video'),
        maintenance_mode: document.getElementById('toggle_maint').checked
    }).then(() => alert("✅ تم حفظ الإعدادات بنجاح"));
}

// ب. حفظ حالة الأقسام (إخفاء/إظهار)
function saveSections() {
    db.ref('settings').update({
        show_news: isChecked('show_news'),
        show_student: isChecked('show_student'),
        show_question: isChecked('show_question'),
        show_ranks: isChecked('show_ranks'),
        show_schedule: isChecked('show_schedule'),
        show_teachers: isChecked('show_teachers')
    }).then(() => alert("✅ تم تحديث حالة الأقسام"));
}

// ج. حفظ الإشعار المنبثق
function saveNotification() {
    db.ref('settings').update({
        popup_active: isChecked('notify_active'),
        popup_title: val('notify_title'),
        popup_body: val('notify_body')
    }).then(() => alert("✅ تم تحديث الإشعار"));
}

// د. حفظ النصوص (أخبار، سؤال، من نحن)
function saveNewsBar() { db.ref('news_bar').set({ text: val('inp_news_bar') }).then(()=>alert("✅ تم تحديث الشريط")); }
function saveQuestion() { db.ref('weekly_question').set({ text: val('inp_q_text'), last_winner: val('inp_q_winner') }).then(()=>alert("✅ تم تحديث السؤال")); }
function saveAbout() { db.ref('site_content/txt_about_content').set(val('inp_about_content')).then(()=>alert("✅ تم حفظ نص من نحن")); }


// ============================================================
// 4. دوال الإضافة والحذف (CRUD Operations)
// ============================================================

// --- أ. البطاقات المخصصة ---
function addCustomCard() {
    const title = val('card_title');
    if(!title) return alert("الرجاء كتابة عنوان البطاقة");

    const newCard = {
        title: title,
        text: val('card_text'),
        color: val('card_color'),
        btn_text: val('card_btn_text'),
        link: val('card_link'),
        active: true // مفعلة افتراضياً
    };

    db.ref('custom_cards').push(newCard).then(() => {
        alert("✅ تمت إضافة البطاقة");
        // تفريغ الحقول
        document.getElementById('card_title').value = '';
        document.getElementById('card_text').value = '';
    });
}
function deleteCustomCard(key) { if(confirm("حذف هذه البطاقة؟")) db.ref('custom_cards/' + key).remove(); }


// --- ب. جداول الحلقات (Complex Schedule) ---
function addComplexSchedule() {
    const timeKey = val('comp_sch_time'); // time_1 (عصر) أو time_2 (مغرب)
    const name = val('comp_sch_name');
    
    if(!name) return alert("اكتب اسم الحلقة");

    const scheduleData = {
        name: name,
        sat: val('d_sat'), sun: val('d_sun'), mon: val('d_mon'),
        tue: val('d_tue'), wed: val('d_wed'), thu: val('d_thu')
    };

    // 1. التأكد من وجود عنوان للوقت
    let timeTitle = (timeKey === 'time_1') ? '☀️ حلقات العصر' : '🌙 حلقات المغرب';
    db.ref(`schedule_complex/${timeKey}/title`).set(timeTitle);

    // 2. إضافة الحلقة
    db.ref(`schedule_complex/${timeKey}/rings`).push(scheduleData).then(() => {
        alert("✅ تم إضافة الحلقة");
        document.getElementById('comp_sch_name').value = '';
        ['d_sat','d_sun','d_mon','d_tue','d_wed','d_thu'].forEach(id => document.getElementById(id).value = '');
    });
}
function deleteComplexRing(timeKey, ringKey) {
    if(confirm("حذف هذه الحلقة وجدولها؟")) {
        db.ref(`schedule_complex/${timeKey}/rings/${ringKey}`).remove();
    }
}


// --- ج. المعلمون ---
function addTeacherV2() {
    const name = val('t_name_v2');
    const role = val('t_role_v2');
    if(!name) return alert("اكتب اسم المعلم");

    db.ref('teachers_list_v2').push({ name: name, role: role })
    .then(() => {
        alert("✅ تم إضافة المعلم");
        document.getElementById('t_name_v2').value = '';
        document.getElementById('t_role_v2').value = '';
    });
}
function deleteTeacherV2(key) { if(confirm("حذف المعلم؟")) db.ref('teachers_list_v2/'+key).remove(); }


// --- د. الأوائل ---
function addRank() {
    const name = val('rank_name');
    if(!name) return alert("اكتب اسم الطالب");

    db.ref('ranks_list').push({
        rank: val('rank_num'),
        name: name,
        ring: val('rank_ring')
    }).then(() => { 
        alert("✅ تم إضافة الطالب"); 
        document.getElementById('rank_name').value = ''; 
    });
}
function deleteRank(key) { if(confirm("حذف الطالب؟")) db.ref('ranks_list/'+key).remove(); }


// --- هـ. الإجازات ---
function addHoliday() {
    const txt = val('holiday_txt');
    if(!txt) return alert("اكتب نص الإجازة");
    db.ref('holidays_list').push({ text: txt }).then(() => { 
        alert("✅ تم إضافة الإجازة"); 
        document.getElementById('holiday_txt').value = ''; 
    });
}
function deleteHoliday(key) { if(confirm("حذف الإجازة؟")) db.ref('holidays_list/'+key).remove(); }


// ============================================================
// 5. تحميل وعرض البيانات في الأدمن (Realtime Listener)
// ============================================================
db.ref().on('value', (snapshot) => {
    const d = snapshot.val();
    if(!d) return;

    // 1. تعبئة الحقول بالبيانات الحالية
    if(d.settings) {
        document.getElementById('toggle_maint').checked = d.settings.maintenance_mode;
        document.getElementById('inp_video').value = d.settings.video_url || "";
        
        // الإشعار
        document.getElementById('notify_active').checked = d.settings.popup_active;
        document.getElementById('notify_title').value = d.settings.popup_title || "";
        document.getElementById('notify_body').value = d.settings.popup_body || "";
        
        // الأقسام
        ['news','student','question','ranks','schedule','teachers'].forEach(k => {
            const el = document.getElementById('show_'+k);
            if(el) el.checked = d.settings['show_'+k];
        });
    }
    
    // نصوص الهيدر
    if(d.site_content) {
        document.getElementById('inp_header_title').value = d.site_content.txt_header_title || "";
        document.getElementById('inp_header_subtitle').value = d.site_content.txt_header_subtitle || "";
        document.getElementById('inp_header_location').value = d.site_content.txt_header_location || "";
        document.getElementById('inp_about_content').value = d.site_content.txt_about_content || "";
    }
    if(d.news_bar) document.getElementById('inp_news_bar').value = d.news_bar.text;
    if(d.weekly_question) {
        document.getElementById('inp_q_text').value = d.weekly_question.text;
        document.getElementById('inp_q_winner').value = d.weekly_question.last_winner;
    }

    // 2. تحديث القوائم (Lists)
    renderAdminList('custom-cards-list-admin', d.custom_cards, 'card');
    renderAdminList('teachers-list-v2-admin', d.teachers_list_v2, 'teacher');
    renderAdminList('ranks-list-admin', d.ranks_list, 'rank');
    renderAdminList('holidays-list-admin', d.holidays_list, 'holiday');
    
    // 3. تحديث قائمة الجداول الشجرية
    renderComplexScheduleAdmin(d.schedule_complex);
});

// ============================================================
// 6. دوال الرسم المساعدة (Helpers)
// ============================================================

// دالة عامة لرسم القوائم البسيطة (معلمين، إجازات، بطاقات)
function renderAdminList(elementId, data, type) {
    const el = document.getElementById(elementId);
    el.innerHTML = '';
    if(!data) { el.innerHTML = '<p style="color:gray;">لا توجد بيانات.</p>'; return; }

    Object.entries(data).forEach(([key, item]) => {
        let content = '', deleteFunc = '';
        
        if(type === 'card') {
            content = `<strong style="color:${item.color}">${item.title}</strong>`;
            deleteFunc = `deleteCustomCard('${key}')`;
        } else if(type === 'teacher') {
            content = `<strong>${item.name}</strong> <small>(${item.role})</small>`;
            deleteFunc = `deleteTeacherV2('${key}')`;
        } else if(type === 'rank') {
            content = `#${item.rank}: <strong>${item.name}</strong> <small>(${item.ring})</small>`;
            deleteFunc = `deleteRank('${key}')`;
        } else if(type === 'holiday') {
            content = item.text;
            deleteFunc = `deleteHoliday('${key}')`;
        }
        
        el.innerHTML += `
            <div class="dynamic-item">
                <div>${content}</div>
                <button onclick="${deleteFunc}" class="btn btn-danger" style="padding:4px 10px; font-size:0.8rem;">حذف</button>
            </div>`;
    });
}

// دالة خاصة لرسم شجرة الجداول
function renderComplexScheduleAdmin(data) {
    const el = document.getElementById('complex-schedule-list-admin');
    el.innerHTML = '';
    if(!data) { el.innerHTML = '<p>لا توجد جداول.</p>'; return; }

    Object.keys(data).sort().forEach(timeKey => {
        if(data[timeKey].rings) {
            const title = (timeKey === 'time_1') ? '☀️ حلقات العصر' : '🌙 حلقات المغرب';
            el.innerHTML += `<h4 style="margin:15px 0 5px 0; color:#3b82f6; border-bottom:1px solid #e2e8f0;">${title}</h4>`;
            
            Object.entries(data[timeKey].rings).forEach(([key, ring]) => {
                el.innerHTML += `
                    <div class="dynamic-item">
                        <div>📖 <strong>${ring.name}</strong></div>
                        <button onclick="deleteComplexRing('${timeKey}', '${key}')" class="btn btn-danger" style="padding:4px 10px; font-size:0.8rem;">حذف</button>
                    </div>`;
            });
        }
    });
}
