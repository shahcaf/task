# מערכת שעות כיתתית

מערכת לניהול מערכת שעות כיתתית עם הרשאות משתמשים שונות.

## תכונות עיקריות

- מערכת התחברות עם סוגי משתמשים שונים (מנהל, מורה, תלמיד)
- צפייה ועריכה של מערכת השעות
- תצוגה מותאמת למובייל
- ממשק בעברית עם תמיכה מלאה ב-RTL
- כפתור ישיר לקבוצת וואטסאפ

## דרישות מערכת

- Python 3.8+
- pip (מנהל חבילות Python)

## התקנה

1. שכפול הריפוזיטורי:
   ```
   git clone [repository-url]
   cd hebrew-schedule
   ```

2. יצירת סביבה וירטואלית והתקנת החבילות הנדרשות:
   ```
   python -m venv venv
   source venv/bin/activate  # ב-Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. אתחול מסד הנתונים:
   ```
   python
   >>> from app import app, db
   >>> app.app_context().push()
   >>> db.create_all()
   >>> exit()
   ```

4. הפעלת השרת:
   ```
   python app.py
   ```

5. פתיחת הדפדפן בכתובת: http://localhost:5000

## פרטי כניסה

- **מנהל (Admin):**
  - שם משתמש: admin
  - סיסמה: 190472

- **מורה (Moderator):**
  - שם משתמש: mod
  - סיסמה: 1234

- **תלמיד (Member):**
  - שם משתמש: member
  - סיסמה: 123456

## הרשאות משתמשים

- **מנהל (Admin):** גישה מלאה לכל הפונקציונליות
- **מורה (Moderator):** יכול לערוך נושאי שיעורים ושעות
- **תלמיד (Member):** צפייה בלבד

## מבנה הפרויקט

```
hebrew-schedule/
├── app.py                # קוד המקור הראשי של האפליקציה
├── requirements.txt      # רשימת תלויות
├── instance/             # תיקיית ה-instance (נוצרת אוטומטית)
│   └── schedule.db       # מסד הנתונים
├── static/               # קבצי CSS ו-JavaScript
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
└── templates/            # תבניות HTML
    ├── base.html
    ├── login.html
    ├── schedule.html
    ├── add_schedule.html
    └── edit_schedule.html
```

## הרחבות עתידיות

- הוספת ייצוא ל-PDF של מערכת השעות
- אפשרות להעלאת תמונות פרופיל למשתמשים
- מערכת הודעות פנימית
- תזכורות לשיעורים קרובים

## רישיון

MIT
