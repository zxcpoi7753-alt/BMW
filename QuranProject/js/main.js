/* ============================================================
   ملف: css/main.css (نسخة V3 الأصلية - طبق الأصل)
   ============================================================ */

/* 1. إعدادات الصفحة والخطوط */
body {
    font-family: 'Cairo', sans-serif;
    background-color: #f1f5f9; /* خلفية رمادية فاتحة جداً */
    color: #1e293b;
    margin: 0; padding: 0;
    direction: rtl;
    overflow-x: hidden;
}

.container {
    max-width: 600px; /* عرض الجوال المثالي */
    margin: 0 auto;
    padding: 0 20px 100px; /* مساحة سفلية للفوتر */
}

/* 2. الهيدر الأخضر المنحني (كما في الصورة) */
header {
    background-color: #10b981; /* اللون الأخضر الأساسي للثريا */
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white;
    padding: 40px 20px 60px; /* زيادة الحشوة السفلية لترك مساحة للأزرار */
    text-align: center;
    border-radius: 0 0 40px 40px; /* انحناء كبير من الأسفل */
    position: relative;
    box-shadow: 0 10px 20px rgba(16, 185, 129, 0.2);
    margin-bottom: 0; /* مهم جداً للتداخل */
}

header h1 { margin: 0; font-size: 2.2rem; font-weight: 800; letter-spacing: -1px; }
.header-subtitle { opacity: 0.9; margin-top: 5px; font-size: 1.1rem; }
.header-location { 
    background: rgba(255,255,255,0.2); 
    padding: 5px 15px; 
    border-radius: 20px; 
    font-size: 0.85rem; 
    display: inline-block; 
    margin-top: 15px; 
    backdrop-filter: blur(5px);
}

/* 3. شريط التنقل المتداخل (Overlap Navigation) */
/* هذا الكود يجعل الأزرار تركب فوق الهيدر */
.nav-container-wrapper {
    margin-top: -35px; /* رفع العنصر للأعلى ليدخل في الهيدر */
    display: flex;
    justify-content: center;
    gap: 15px;
    padding: 0 20px;
    position: relative;
    z-index: 10;
    margin-bottom: 25px;
}

.nav-bar-btn {
    flex: 1; /* يأخذ مساحة متساوية */
    background: white;
    color: #059669;
    border: none;
    padding: 15px;
    border-radius: 15px;
    font-weight: 800;
    font-family: 'Cairo', sans-serif;
    font-size: 1rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.08); /* ظل ناعم */
    cursor: pointer;
    text-align: center;
    transition: transform 0.2s, box-shadow 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
}

.nav-bar-btn:active { transform: scale(0.95); }
.nav-bar-btn i { font-size: 1.2rem; }

/* تمييز الزر النشط */
.nav-bar-btn.active {
    background: #064e3b; /* أخضر غامق جداً */
    color: white;
}

/* 4. ركن الطالب (تصميم البطاقات المربعة الكبيرة) */
.student-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr); /* 3 أعمدة */
    gap: 12px;
    margin-top: 10px;
}

.st-card {
    background: white;
    border-radius: 16px;
    padding: 20px 10px;
    text-align: center;
    text-decoration: none;
    color: #475569;
    font-weight: bold;
    font-size: 0.9rem;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    border: 1px solid #f1f5f9;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: 0.2s;
}

.st-card:hover { transform: translateY(-3px); box-shadow: 0 10px 15px rgba(0,0,0,0.05); }

/* أيقونات ركن الطالب (كبيرة وملونة) */
.st-icon { font-size: 28px; margin-bottom: 5px; }
/* ألوان الأيقونات */
.st-card:nth-child(1) .st-icon { color: #3b82f6; } /* أزرق */
.st-card:nth-child(2) .st-icon { color: #10b981; } /* أخضر */
.st-card:nth-child(3) .st-icon { color: #f59e0b; } /* برتقالي */
.st-card:nth-child(4) .st-icon { color: #ef4444; } /* أحمر */
.st-card:nth-child(5) .st-icon { color: #8b5cf6; } /* بنفسجي */
.st-card:nth-child(6) .st-icon { color: #ec4899; } /* وردي */

/* 5. العناوين والأقسام */
.section-title {
    color: #065f46; /* أخضر غامق */
    font-weight: 800;
    margin: 30px 0 15px;
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    gap: 8px;
}
.section-title i { color: #10b981; }

.card {
    background: white;
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02);
    border: 1px solid #e2e8f0;
    margin-bottom: 15px;
}

/* 6. جدول الأوائل (الأخضر والذهبي) */
.ranks-table { 
    width: 100%; 
    border-collapse: separate; 
    border-spacing: 0; 
    border-radius: 12px; 
    overflow: hidden; 
    border: 1px solid #e2e8f0;
}
.ranks-table thead th { 
    background-color: #064e3b; /* هيدر الجدول أخضر غامق */
    color: white; 
    padding: 15px; 
    font-weight: bold;
}
.ranks-table td { 
    background: white; 
    padding: 12px; 
    text-align: center; 
    border-bottom: 1px solid #f1f5f9; 
    color: #334155;
}
.ranks-table tr:last-child td { border-bottom: none; }

/* 7. الجداول والقوائم */
.accordion-btn {
    background: white;
    width: 100%;
    padding: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 10px;
    display: flex; 
    justify-content: space-between; 
    align-items: center;
    font-weight: bold;
    color: #1e293b;
    box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.accordion-panel {
    display: none;
    background: white;
    padding: 15px;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    margin-bottom: 15px;
}

/* 8. التحميل */
#site-loader {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: white; z-index: 9999;
    display: flex; justify-content: center; align-items: center;
}
