from app import app, db, User, Schedule
from werkzeug.security import generate_password_hash

def init_database():
    with app.app_context():
        # Drop all tables and create them again
        db.drop_all()
        db.create_all()
        
        # Create default users
        users = [
            User(
                username='admin',
                password=generate_password_hash('190472'),
                role='admin'
            ),
            User(
                username='mod',
                password=generate_password_hash('1234'),
                role='mod'
            ),
            User(
                username='member',
                password=generate_password_hash('123456'),
                role='member'
            )
        ]
        
        # Add users to the database
        for user in users:
            db.session.add(user)
        
        # Sample schedule data
        days = ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו']
        time_slots = [
            ('08:00', '09:00'), ('09:00', '10:00'), ('10:00', '11:00'),
            ('11:00', '12:00'), ('12:00', '13:00'), ('13:00', '14:00'),
            ('14:00', '15:00')
        ]
        
        # Sample schedule data (simplified - you should add all your actual schedule data here)
        schedule_data = [
            # Sunday (יום א)
            {'day': 'יום א', 'start_time': '08:00', 'end_time': '09:00', 'subject': 'היסטוריה', 'teacher': 'אילה'},
            {'day': 'יום א', 'start_time': '09:00', 'end_time': '10:00', 'subject': 'אנגלית', 'teacher': 'רחלי'},
            {'day': 'יום א', 'start_time': '10:00', 'end_time': '11:00', 'subject': 'ספורט', 'teacher': 'דוד'},
            {'day': 'יום א', 'start_time': '11:00', 'end_time': '12:00', 'subject': 'מתמטיקה', 'teacher': 'אילה'},
            {'day': 'יום א', 'start_time': '12:00', 'end_time': '13:00', 'subject': 'מתמטיקה', 'teacher': 'אילה'},
            {'day': 'יום א', 'start_time': '13:00', 'end_time': '14:00', 'subject': 'אומנות', 'teacher': 'אילה'},
            {'day': 'יום א', 'start_time': '14:00', 'end_time': '15:00', 'subject': 'הכנה לחיים', 'teacher': 'אילה'},
            
            # Monday (יום ב)
            {'day': 'יום ב', 'start_time': '08:00', 'end_time': '10:00', 'subject': 'חינוך לבריאות', 'teacher': 'דוד'},
            {'day': 'יום ב', 'start_time': '10:00', 'end_time': '11:00', 'subject': 'לשון', 'teacher': 'אסתי'},
            {'day': 'יום ב', 'start_time': '11:00', 'end_time': '12:00', 'subject': 'ספרות', 'teacher': 'אסתי'},
            {'day': 'יום ב', 'start_time': '12:00', 'end_time': '13:00', 'subject': 'לשון', 'teacher': 'אסתי'},
            {'day': 'יום ב', 'start_time': '13:00', 'end_time': '14:00', 'subject': 'אנגלית', 'teacher': 'רחלי'},
            {'day': 'יום ב', 'start_time': '14:00', 'end_time': '15:00', 'subject': 'מדעים', 'teacher': 'אילה'},
            
            # Add more days and time slots as needed...
        ]
        
        # Add schedule data to the database
        for item in schedule_data:
            schedule = Schedule(**item)
            db.session.add(schedule)
        
        # Commit all changes
        db.session.commit()
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_database()
