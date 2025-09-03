from functools import wraps
from flask import Flask, render_template, request, redirect, url_for, flash, session, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, case
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///schedule.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Models
class User(db.Model):
    """User model for authentication and authorization."""
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(80), unique=True, nullable=False)
    password = Column(String(120), nullable=False)
    role = Column(String(20), nullable=False)  # admin, mod, member

class Schedule(db.Model):
    """Schedule model for storing class timetable."""
    __tablename__ = 'schedules'
    
    id = Column(Integer, primary_key=True)
    day = Column(String(20), nullable=False)  # Sunday to Friday
    start_time = Column(String(10), nullable=False)  # e.g., '08:00'
    end_time = Column(String(10), nullable=False)  # e.g., '09:00'
    subject = Column(String(100), nullable=False)
    teacher = Column(String(100), nullable=False)

# Create database tables
with app.app_context():
    db.create_all()
    # Create default admin user if not exists
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            password=generate_password_hash('190472'),
            role='admin'
        )
        db.session.add(admin)
    
    # Create default mod user if not exists
    if not User.query.filter_by(username='mod').first():
        mod = User(
            username='mod',
            password=generate_password_hash('1234'),
            role='mod'
        )
        db.session.add(mod)
    
    # Create default member user if not exists
    if not User.query.filter_by(username='member').first():
        member = User(
            username='member',
            password=generate_password_hash('123456'),
            role='member'
        )
        db.session.add(member)
    
    db.session.commit()

# Authentication decorators
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('נא להתחבר כדי לגשת לדף זה', 'warning')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('נא להתחבר כדי לגשת לדף זה', 'warning')
            return redirect(url_for('login', next=request.url))
            
        user = User.query.get(session['user_id'])
        if not user or user.role != 'admin':
            flash('אין לך הרשאות מנהל', 'danger')
            return redirect(url_for('schedule'))
            
        return f(*args, **kwargs)
    return decorated_function

def mod_or_admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('נא להתחבר כדי לגשת לדף זה', 'warning')
            return redirect(url_for('login', next=request.url))
            
        user = User.query.get(session['user_id'])
        if not user or user.role not in ['mod', 'admin']:
            flash('אין לך הרשאות מתאימות', 'danger')
            return redirect(url_for('schedule'))
            
        return f(*args, **kwargs)
    return decorated_function

# Initialize default schedule data
def init_schedule():
    if Schedule.query.count() == 0:
        # Add default schedule data here
        # This is a simplified example - you'll need to add all the time slots
        days = ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו']
        time_slots = [
            ('08:00', '09:00'), ('09:00', '10:00'), ('10:00', '11:00'),
            ('11:00', '12:00'), ('12:00', '13:00'), ('13:00', '14:00'),
            ('14:00', '15:00')
        ]
        
        # Add default schedule items
        # This is a simplified example - you'll need to add all the actual schedule items
        schedule_data = [
            # Sunday (יום א)
            {'day': 'יום א', 'start': '08:00', 'end': '09:00', 'subject': 'היסטוריה', 'teacher': 'אילה'},
            # Add all other schedule items here...
        ]
        
        for item in schedule_data:
            schedule = Schedule(**item)
            db.session.add(schedule)
        
        db.session.commit()

# Routes
@app.route('/')
def index():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return redirect(url_for('schedule'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    # If user is already logged in, redirect to schedule
    if 'user_id' in session:
        return redirect(url_for('schedule'))
        
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            flash('התחברת בהצלחה!', 'success')
            
            # Redirect to the originally requested page or schedule
            next_page = request.args.get('next') or url_for('schedule')
            return redirect(next_page)
        else:
            flash('שם משתמש או סיסמה שגויים', 'danger')
    
    return render_template('login.html')

@app.route('/logout')
@login_required
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/schedule')
@login_required
def schedule():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    # Get all schedule items
    schedule_items = Schedule.query.order_by(
        db.case(
            {"יום א": 0, "יום ב": 1, "יום ג": 2, "יום ד": 3, "יום ה": 4, "יום ו": 5},
            value=Schedule.day
        ),
        Schedule.start_time
    ).all()
    
    # Group by day and time
    schedule_by_day = {}
    days = ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו']
    time_slots = [
        ('08:00', '09:00'), ('09:00', '10:00'), ('10:00', '11:00'),
        ('11:00', '12:00'), ('12:00', '13:00'), ('13:00', '14:00'),
        ('14:00', '15:00')
    ]
    
    for day in days:
        schedule_by_day[day] = {}
        for start, end in time_slots:
            schedule_by_day[day][f"{start}-{end}"] = None
    
    for item in schedule_items:
        time_key = f"{item.start_time}-{item.end_time}"
        if item.day in schedule_by_day and time_key in schedule_by_day[item.day]:
            schedule_by_day[item.day][time_key] = item
    
    return render_template('schedule.html', 
                         schedule=schedule_by_day, 
                         days=days, 
                         time_slots=time_slots,
                         user_role=session.get('role'))

@app.route('/edit_schedule/<int:schedule_id>', methods=['GET', 'POST'])
@mod_or_admin_required
def edit_schedule(schedule_id):
    schedule_item = Schedule.query.get_or_404(schedule_id)
    
    if request.method == 'POST':
        schedule_item.subject = request.form.get('subject')
        schedule_item.teacher = request.form.get('teacher')
        
        # Only admin can change time slots
        if session.get('role') == 'admin':
            schedule_item.day = request.form.get('day')
            start_time = request.form.get('start_time')
            end_time = request.form.get('end_time')
            
            # Validate time format
            try:
                # Simple validation - in production, add more robust validation
                if ':' in start_time and ':' in end_time:
                    schedule_item.start_time = start_time
                    schedule_item.end_time = end_time
            except ValueError:
                flash('פורמט שעה לא תקין', 'danger')
                return redirect(url_for('edit_schedule', schedule_id=schedule_id))
        
        db.session.commit()
        flash('השיעור עודכן בהצלחה', 'success')
        return redirect(url_for('schedule'))
    
    days = ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו']
    time_slots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
    ]
    
    return render_template('edit_schedule.html', 
                         schedule_item=schedule_item,
                         days=days,
                         time_slots=time_slots)

@app.route('/add_schedule', methods=['GET', 'POST'])
@admin_required
def add_schedule():
    if request.method == 'POST':
        day = request.form.get('day')
        start_time = request.form.get('start_time')
        end_time = request.form.get('end_time')
        subject = request.form.get('subject')
        teacher = request.form.get('teacher')
        
        new_schedule = Schedule(
            day=day,
            start_time=start_time,
            end_time=end_time,
            subject=subject,
            teacher=teacher
        )
        
        db.session.add(new_schedule)
        db.session.commit()
        
        flash('שיעור חדש נוסף בהצלחה', 'success')
        return redirect(url_for('schedule'))
    
    days = ['יום א', 'יום ב', 'יום ג', 'יום ד', 'יום ה', 'יום ו']
    time_slots = [
        '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
    ]
    
    return render_template('add_schedule.html', days=days, time_slots=time_slots)

@app.route('/delete_schedule/<int:schedule_id>', methods=['POST'])
@admin_required
def delete_schedule(schedule_id):
    schedule_item = Schedule.query.get_or_404(schedule_id)
    db.session.delete(schedule_item)
    db.session.commit()
    flash('השיעור נמחק בהצלחה', 'success')
    return redirect(url_for('schedule'))

if __name__ == '__main__':
    with app.app_context():
        init_schedule()
    app.run(debug=True)
