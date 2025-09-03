// DOM Elements
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const app = document.getElementById('app');
const loginPage = document.getElementById('login-page');
const welcomeUser = document.getElementById('welcome-user');
const logoutLink = document.getElementById('logout-link');
const scheduleLink = document.getElementById('schedule-link');
const manageLink = document.getElementById('admin-link');
const tasksLink = document.getElementById('tasks-link');
const noticeBoardLink = document.getElementById('notice-board-link');
const scheduleView = document.getElementById('schedule-view');
const adminView = document.getElementById('admin-view');
const tasksView = document.getElementById('tasks-view');
const noticeBoardView = document.getElementById('notice-board-view');
const scheduleBody = document.getElementById('schedule-body');
const saveBtn = document.getElementById('save-btn');
const clearBtn = document.getElementById('clear-btn');
const daySelect = document.getElementById('day-select');
const timeSelect = document.getElementById('time-select');
const subjectInput = document.getElementById('subject-input');
const teacherInput = document.getElementById('teacher-input');
const taskForm = document.getElementById('add-task-form');
const taskInput = document.getElementById('task-input');
const taskCategory = document.getElementById('task-category');
const taskList = document.getElementById('task-list');
const filterButtons = document.querySelectorAll('.filters button');
const addNoticeBtn = document.getElementById('add-notice-btn');
const addNoticeForm = document.getElementById('add-notice-form');
const newNoticeForm = document.getElementById('new-notice-form');
const noticeTitleInput = document.getElementById('notice-title');
const noticeContentInput = document.getElementById('notice-content');
const cancelNoticeBtn = document.getElementById('cancel-notice');
const noticesContainer = document.getElementById('notices-container');
const noNotices = document.getElementById('no-notices');

// Sample users (in a real app, this would be server-side)
const users = [
    { id: 1, username: 'admin', password: 'admin123', name: 'מנהל המערכת', role: 'admin' },
    { id: 2, username: 'teacher', password: 'teacher123', name: 'מורה', role: 'mod' },
    { id: 3, username: 'student', password: 'student123', name: 'תלמיד', role: 'student' }
];

// Application state
let currentUser = null;
let scheduleData = {
    days: ['יום א\'', 'יום ב\'', 'יום ג\'', 'יום ד\'', 'יום ה\'', 'יום ו\''],
    times: [
        { start: '08:00', end: '09:00' },
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:00', end: '12:00' },
        { start: '12:00', end: '13:00' },
        { start: '13:00', end: '14:00' },
        { start: '14:00', end: '15:00' }
    ],
    lessons: [
        // יום א
        [
            { subject: 'היסטוריה', teacher: 'אילה' },
            { subject: 'אנגלית', teacher: 'רחלי' },
            { subject: 'ספורט', teacher: 'דוד' },
            { subject: 'מתמטיקה', teacher: 'אילה' },
            { subject: 'מתמטיקה', teacher: 'אילה' },
            { subject: 'אומנות', teacher: 'אילה' },
            { subject: 'הכנה לחיים', teacher: 'אילה' }
        ],
        // יום ב
        [
            { subject: 'חינוך לבריאות', teacher: 'דוד' },
            { subject: 'חינוך לבריאות', teacher: 'דוד' },
            { subject: 'לשון', teacher: 'אסתי' },
            { subject: 'ספרות', teacher: 'אסתי' },
            { subject: 'לשון', teacher: 'אסתי' },
            { subject: 'אנגלית', teacher: 'רחלי' },
            { subject: 'מדעים', teacher: 'אילה' }
        ],
        // יום ג
        [
            { subject: 'חווה חקלאית', teacher: '' },
            { subject: 'חווה חקלאית', teacher: '' },
            { subject: 'היסטוריה', teacher: 'אילה' },
            { subject: 'מתמטיקה', teacher: 'אילה' },
            { subject: 'מתמטיקה', teacher: 'אילה' },
            { subject: 'לשון', teacher: 'אסתי' },
            { subject: 'תנ"ך', teacher: 'אילה' }
        ],
        // יום ד
        [
            { subject: 'ספורט', teacher: 'דוד' },
            { subject: 'ספורט', teacher: 'דוד' },
            { subject: 'מדעים', teacher: 'אילה' },
            { subject: 'אומנות', teacher: 'אילה' },
            { subject: 'אנגלית', teacher: 'רחלי' },
            { subject: 'תרבות ישראל', teacher: 'אילה' },
            { subject: 'תרבות ישראל', teacher: 'אילה' }
        ],
        // יום ה
        [
            { subject: 'תנ"ך', teacher: 'אילה' },
            { subject: 'ספרות', teacher: 'אסתי' },
            { subject: 'לשון', teacher: 'אסתי' },
            { subject: 'לשון', teacher: 'אסתי' },
            { subject: 'גאוגרפיה', teacher: 'אסתי' },
            { subject: 'גאוגרפיה', teacher: 'אסתי' },
            { subject: 'לשון והבעה', teacher: 'אסתי' }
        ],
        // יום ו
        [
            { subject: 'הנדסה', teacher: 'אילה' },
            { subject: 'הנדסה', teacher: 'אילה' },
            { subject: 'מדעים', teacher: 'אילה' },
            { subject: 'חברה', teacher: 'אילה' },
            { subject: 'חברה', teacher: 'אילה' },
            null,
            null
        ]
    ]
};

// Change history for undo functionality
let changeHistory = [];
const MAX_HISTORY = 10;

// Notices data
let notices = [];

// Load notices from localStorage
function loadNotices() {
    const savedNotices = localStorage.getItem('notices');
    if (savedNotices) {
        try {
            notices = JSON.parse(savedNotices);
        } catch (e) {
            console.error('Error parsing notices:', e);
            notices = [];
        }
    }
    renderNotices();
}

// Render notices to the UI
function renderNotices() {
    if (!noticesContainer) return;
    
    if (notices.length === 0) {
        noNotices.classList.remove('d-none');
        noticesContainer.innerHTML = '';
        return;
    }
    
    noNotices.classList.add('d-none');
    
    const noticesHtml = notices.map(notice => `
        <div class="card mb-3 notice-card">
            <div class="card-header d-flex justify-content-between align-items-center">
                <h5 class="card-title mb-0">${escapeHtml(notice.title)}</h5>
                ${currentUser && (currentUser.role === 'admin' || currentUser.role === 'mod' || currentUser.username === notice.author) ? `
                    <button class="btn btn-sm btn-outline-danger delete-notice" data-id="${notice.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
            <div class="card-body">
                <p class="card-text">${formatNoticeContent(notice.content)}</p>
                <p class="card-text">
                    <small class="text-muted">
                        פורסם על ידי ${escapeHtml(notice.author)} • ${formatDate(notice.createdAt)}
                    </small>
                </p>
            </div>
        </div>
    `).join('');
    
    noticesContainer.innerHTML = noticesHtml;
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-notice').forEach(button => {
        button.addEventListener('click', (e) => {
            const noticeId = e.currentTarget.dataset.id;
            deleteNotice(noticeId);
        });
    });
}

// Helper function to escape HTML
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
        .toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Format notice content with line breaks
function formatNoticeContent(content) {
    return escapeHtml(content).replace(/\n/g, '<br>');
}

// Format date to Hebrew locale
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('he-IL', options);
}

// Delete a notice
function deleteNotice(noticeId) {
    if (!currentUser) return;
    
    const noticeIndex = notices.findIndex(n => n.id === noticeId);
    if (noticeIndex === -1) return;
    
    const notice = notices[noticeIndex];
    
    // Check if user is admin, mod, or the author
    if (currentUser.role !== 'admin' && currentUser.role !== 'mod' && currentUser.username !== notice.author) {
        showToast('אין לך הרשאות למחוק הודעה זו', 'error');
        return;
    }
    
    if (confirm('האם אתה בטוח שברצונך למחוק הודעה זו?')) {
        notices.splice(noticeIndex, 1);
        saveNotices();
        renderNotices();
        showToast('ההודעה נמחקה בהצלחה', 'success');
    }
}

// Save notices to localStorage
function saveNotices() {
    localStorage.setItem('notices', JSON.stringify(notices));
}

// Handle new notice form submission
function handleNewNotice(e) {
    e.preventDefault();
    
    if (!currentUser) {
        showToast('יש להתחבר כדי לפרסם הודעה', 'error');
        return;
    }
    
    const title = noticeTitleInput.value.trim();
    const content = noticeContentInput.value.trim();
    
    if (!title || !content) {
        showToast('נא למלא את כל השדות', 'warning');
        return;
    }
    
    const newNotice = {
        id: Date.now().toString(),
        title,
        content,
        author: currentUser.username,
        authorName: currentUser.name,
        createdAt: new Date().toISOString()
    };
    
    notices.unshift(newNotice); // Add to beginning of array
    saveNotices();
    
    // Reset form
    newNoticeForm.reset();
    addNoticeForm.classList.add('d-none');
    addNoticeBtn.classList.remove('d-none');
    
    // Show success message
    showToast('ההודעה פורסמה בהצלחה', 'success');
    
    // Re-render notices
    renderNotices();
}

// Initialize the application
function init() {
    // Initialize global namespace if it doesn't exist
    if (!window.classScheduleData) {
        window.classScheduleData = {};
    }
    
    // Load tasks first (before authentication)
    loadTasks();
    
    // Load saved schedule data if exists
    loadScheduleData();
    
    // Load notices from localStorage
    loadNotices();
    
    // Set up event listeners
    setupEventListeners();
    
    // Check if user is already logged in
    checkAuth();
    
    // Initialize the schedule view
    renderSchedule();
}

// Set up event listeners
function setupEventListeners() {
    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout link
    if (logoutLink) {
        logoutLink.addEventListener('click', handleLogout);
    }
    
    // Navigation links
    if (scheduleLink) {
        scheduleLink.addEventListener('click', (e) => {
            e.preventDefault();
            showScheduleView();
        });
    }
    
    if (manageLink) {
        manageLink.addEventListener('click', (e) => {
            e.preventDefault();
            showAdminView();
        });
    }
    
    if (tasksLink) {
        tasksLink.addEventListener('click', (e) => {
            e.preventDefault();
            showTasksView();
        });
    }
    
    if (noticeBoardLink) {
        noticeBoardLink.addEventListener('click', (e) => {
            e.preventDefault();
            showNoticeBoardView();
        });
    }
    
    // Admin form submission
    const adminForm = document.getElementById('admin-form');
    if (adminForm) {
        adminForm.addEventListener('submit', saveLesson);
    }
    
    // Clear button
    if (clearBtn) {
        clearBtn.addEventListener('click', clearForm);
    }
    
    // Back to schedule button
    const backToScheduleBtn = document.getElementById('back-to-schedule');
    if (backToScheduleBtn) {
        backToScheduleBtn.addEventListener('click', () => {
            showScheduleView();
            clearForm();
        });
    }
    
    // Task form submission
    if (taskForm) {
        taskForm.addEventListener('submit', addTask);
    }
    
    // Notice board buttons
    if (addNoticeBtn) {
        addNoticeBtn.addEventListener('click', () => {
            addNoticeForm.classList.remove('d-none');
            addNoticeBtn.classList.add('d-none');
        });
    }
    
    if (cancelNoticeBtn) {
        cancelNoticeBtn.addEventListener('click', () => {
            addNoticeForm.classList.add('d-none');
            addNoticeBtn.classList.remove('d-none');
            newNoticeForm.reset();
        });
    }
    
    if (newNoticeForm) {
        newNoticeForm.addEventListener('submit', handleNewNotice);
    }
    
    // Filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const filter = e.target.dataset.filter;
            filterTasks(filter);
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // Navigation links
    if (scheduleLink) {
        scheduleLink.addEventListener('click', (e) => {
            e.preventDefault();
            showScheduleView();
        });
    }
    
    // Add other event listeners...
}

// Check if user is authenticated
function checkAuth() {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
        try {
            const user = JSON.parse(userJson);
            if (user && user.username) {
                currentUser = user;
                showApp();
                return;
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('currentUser');
        }
    }
    showLogin();
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    // Simple validation
    if (!username || !password) {
        showLoginError('נא למלא את כל השדות');
        return;
    }
    
    // Find user
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        // Login successful
        currentUser = user;
        try {
            // Save user to localStorage without password for security
            const userToSave = { ...user };
            delete userToSave.password;
            localStorage.setItem('currentUser', JSON.stringify(userToSave));
            showApp();
        } catch (e) {
            console.error('Error saving user data:', e);
            showLoginError('שגיאה בשמירת נתוני ההתחברות');
        }
    } else {
        // Login failed
        showLoginError('שם משתמש או סיסמה שגויים');
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    currentUser = null;
    localStorage.removeItem('currentUser');
    showLogin();
}

// Show login page
function showLogin() {
    if (loginPage) loginPage.classList.remove('d-none');
    if (app) app.classList.add('d-none');
    if (loginError) loginError.classList.add('d-none');
    if (document.getElementById('username')) document.getElementById('username').value = '';
    if (document.getElementById('password')) document.getElementById('password').value = '';
}

// Show main application
function showApp() {
    if (loginPage) loginPage.classList.add('d-none');
    if (app) app.classList.remove('d-none');
    
    // Update welcome message
    if (welcomeUser && currentUser) {
        welcomeUser.textContent = `שלום, ${currentUser.name}`;
    }
    
    // Show/Hide admin link based on user role
    if (adminLink) {
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'mod')) {
            adminLink.classList.remove('d-none');
        } else {
            adminLink.classList.add('d-none');
        }
    }
    
    // Show tasks link for all users
    if (tasksLink) {
        tasksLink.style.display = 'block';
    }
    
    // Show notice board link for all users
    if (noticeBoardLink) {
        noticeBoardLink.style.display = 'block';
    }
    
    // Show schedule view by default
    showScheduleView();
}

// Show schedule view
function showScheduleView() {
    // Hide other views
    if (adminView) adminView.classList.add('d-none');
    if (tasksView) tasksView.classList.add('d-none');
    if (noticeBoardView) noticeBoardView.classList.add('d-none');
    if (scheduleView) scheduleView.classList.remove('d-none');
    
    // Render the schedule
    renderSchedule();
}

// Show admin view
function showAdminView() {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'mod')) {
        showScheduleView();
        return;
    }
    
    // Hide other views
    if (scheduleView) scheduleView.classList.add('d-none');
    if (adminView) adminView.classList.remove('d-none');
    if (tasksView) tasksView.classList.add('d-none');
    
    // Clear form when showing admin view
    clearForm();
}

// Show tasks view
function showTasksView() {
    // Hide other views
    if (scheduleView) scheduleView.classList.add('d-none');
    if (adminView) adminView.classList.add('d-none');
    if (tasksView) tasksView.classList.remove('d-none');
    if (noticeBoardView) noticeBoardView.classList.add('d-none');
    
    // Render tasks
    renderTasks();
}

// Show notice board view
function showNoticeBoardView() {
    // Hide other views
    if (scheduleView) scheduleView.classList.add('d-none');
    if (adminView) adminView.classList.add('d-none');
    if (tasksView) tasksView.classList.add('d-none');
    if (noticeBoardView) noticeBoardView.classList.remove('d-none');
    
    // Show/hide add notice button based on user role
    if (addNoticeBtn) {
        if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'mod')) {
            addNoticeBtn.classList.remove('d-none');
        } else {
            addNoticeBtn.classList.add('d-none');
        }
    }
    
    // Hide add notice form if visible
    if (addNoticeForm) {
        addNoticeForm.classList.add('d-none');
    }
    
    // Render notices
    renderNotices();
}

// Load schedule data from localStorage
function loadScheduleData() {
    const savedData = localStorage.getItem('scheduleData');
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            // Only update if the saved data has the expected structure
            if (parsedData.days && parsedData.times && parsedData.lessons) {
                scheduleData = parsedData;
            }
        } catch (e) {
            console.error('Error parsing saved schedule data:', e);
        }
    }
}

// Save schedule data to localStorage
function saveScheduleData() {
    try {
        localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    } catch (e) {
        console.error('Error saving schedule data:', e);
        showToast('אירעה שגיאה בשמירת הנתונים', 'error');
    }
}

// Task list functionality
let tasks = [];

// Load tasks from localStorage
function loadTasks() {
    // First try to get from localStorage
    const savedTasks = localStorage.getItem('class_tasks');
    
    if (savedTasks) {
        try {
            tasks = JSON.parse(savedTasks);
            // Update global namespace
            window.classScheduleData.tasks = tasks;
        } catch (e) {
            console.error('Error parsing saved tasks:', e);
            tasks = [];
            saveTasks(); // This will create a fresh tasks array
        }
    } else if (window.classScheduleData.tasks) {
        // If nothing in localStorage but we have it in memory
        tasks = window.classScheduleData.tasks;
        saveTasks(); // Persist to localStorage
    } else {
        // Initialize with empty array if nothing exists
        tasks = [];
        saveTasks();
    }
}

// Save tasks to localStorage
function saveTasks() {
    try {
        localStorage.setItem('class_tasks', JSON.stringify(tasks));
        // Update global namespace
        if (!window.classScheduleData) {
            window.classScheduleData = {};
        }
        window.classScheduleData.tasks = tasks;
    } catch (e) {
        console.error('Error saving tasks:', e);
    }
}

// Add a new task
function addTask(e) {
    e.preventDefault();
    
    const taskText = taskInput.value.trim();
    const category = taskCategory.value;
    
    if (taskText === '') return;
    
    const newTask = {
        id: Date.now(),
        text: taskText,
        category: category,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.unshift(newTask);
    saveTasks();
    renderTasks();
    
    // Reset form
    taskInput.value = '';
    taskInput.focus();
    
    showToast('המשימה נוספה בהצלחה', 'success');
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Delete a task
function deleteTask(id, e) {
    e.stopPropagation();
    if (confirm('האם אתה בטוח שברצונך למחוק משימה זו?')) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        showToast('המשימה נמחקה', 'success');
    }
}

// Filter tasks by category
function filterTasks(category) {
    const taskItems = document.querySelectorAll('.task-item');
    
    taskItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Render tasks to the DOM
function renderTasks() {
    if (!taskList) return;
    
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="text-center text-muted py-3">אין משימות להצגה. הוסף משימה חדשה למעלה.</div>';
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `list-group-item task-item ${task.completed ? 'completed' : ''}`;
        taskItem.dataset.category = task.category;
        
        taskItem.innerHTML = `
            <div class="form-check d-flex align-items-center">
                <input class="form-check-input me-2" type="checkbox" ${task.completed ? 'checked' : ''}>
                <label class="form-check-label flex-grow-1">
                    ${task.text}
                    <span class="badge bg-secondary ms-2">${getCategoryName(task.category)}</span>
                </label>
                <button type="button" class="btn btn-sm btn-danger" aria-label="מחק">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        const checkbox = taskItem.querySelector('input[type="checkbox"]');
        const deleteBtn = taskItem.querySelector('button');
        
        checkbox.addEventListener('change', () => toggleTask(task.id));
        deleteBtn.addEventListener('click', (e) => deleteTask(task.id, e));
        
        taskList.appendChild(taskItem);
    });
}

// Get category display name
function getCategoryName(category) {
    const categories = {
        'books': 'ספרים',
        'notebooks': 'מחברות',
        'stationery': 'כלי כתיבה',
        'exams': 'מבחנים',
        'projects': 'עבודות',
        'other': 'אחר'
    };
    
    return categories[category] || 'אחר';
}

// Edit a lesson
function editLesson(dayIndex, timeIndex) {
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'mod')) {
        return;
    }
    
    // Show admin view
    showAdminView();
    
    // Set form values
    if (daySelect && timeSelect && subjectInput && teacherInput) {
        daySelect.value = dayIndex;
        timeSelect.value = timeIndex;
        
        // Get the lesson if it exists
        const lesson = scheduleData.lessons[dayIndex] && scheduleData.lessons[dayIndex][timeIndex];
        
        subjectInput.value = lesson ? lesson.subject : '';
        teacherInput.value = lesson ? lesson.teacher : '';
    }
}

// Save lesson
function saveLesson(e) {
    if (e) e.preventDefault();
    
    if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'mod')) {
        showToast('אין לך הרשאות לערוך שיעורים', 'error');
        return;
    }
    
    try {
        const dayIndex = parseInt(daySelect.value);
        const timeIndex = parseInt(timeSelect.value);
        const subject = subjectInput ? subjectInput.value.trim() : '';
        const teacher = teacherInput ? teacherInput.value.trim() : '';
        
        if (!subject || !teacher) {
            showToast('נא למלא את כל השדות', 'warning');
            return;
        }
        
        // Save current state for undo
        const previousState = {
            dayIndex,
            timeIndex,
            lesson: scheduleData.lessons[dayIndex] && scheduleData.lessons[dayIndex][timeIndex] 
                ? {...scheduleData.lessons[dayIndex][timeIndex]} 
                : null
        };
        
        // Update lesson
        if (!scheduleData.lessons[dayIndex]) {
            scheduleData.lessons[dayIndex] = [];
        }
        scheduleData.lessons[dayIndex][timeIndex] = { subject, teacher };
        
        // Save to localStorage
        saveScheduleData();
        
        // Add to change history
        changeHistory.push(previousState);
        if (changeHistory.length > MAX_HISTORY) {
            changeHistory.shift();
        }
        
        // Show success message and update view
        showToast('השיעור נשמר בהצלחה', 'success');
        
        // Clear the form
        clearForm();
        
        // Switch back to schedule view
        showScheduleView();
        
        // Re-render the schedule
        renderSchedule();
    } catch (error) {
        console.error('Error saving lesson:', error);
        showToast('אירעה שגיאה בשמירת השיעור', 'error');
    }
}

// Clear form
function clearForm() {
    if (subjectInput) subjectInput.value = '';
    if (teacherInput) teacherInput.value = '';
    if (daySelect) daySelect.value = '';
    if (timeSelect) timeSelect.value = '';
}

// Undo last change
function undoLastChange() {
    if (changeHistory.length === 0) {
        showToast('אין שינויים לבטל', 'warning');
        return;
    }
    
    const lastChange = changeHistory.pop();
    
    // Restore previous state
    if (!scheduleData.lessons[lastChange.dayIndex]) {
        scheduleData.lessons[lastChange.dayIndex] = [];
    }
    
    if (lastChange.lesson === null) {
        delete scheduleData.lessons[lastChange.dayIndex][lastChange.timeIndex];
    } else {
        scheduleData.lessons[lastChange.dayIndex][lastChange.timeIndex] = lastChange.lesson;
    }
    
    // Save and update view
    saveScheduleData();
    renderSchedule();
    showToast('השינוי בוטל בהצלחה', 'success');
}

// Show error message in login form
function showLoginError(message) {
    if (loginError) {
        loginError.textContent = message;
        loginError.classList.remove('d-none');
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.querySelector('.toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
        document.body.appendChild(toastContainer);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast show align-items-center text-white bg-${type === 'error' ? 'danger' : type} border-0`;
    toast.role = 'alert';
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add undo button for admins and mods
function addUndoButtonIfNeeded() {
    if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'mod') && !document.getElementById('undo-button')) {
        const container = document.querySelector('.container.my-4');
        if (container) {
            const undoBtn = document.createElement('button');
            undoBtn.id = 'undo-button';
            undoBtn.className = 'btn btn-warning mb-3';
            undoBtn.innerHTML = '<i class="fas fa-undo me-2"></i>בטל שינוי אחרון';
            undoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                undoLastChange();
            });
            container.insertBefore(undoBtn, container.firstChild);
        }
    }
}

// Render schedule table
function renderSchedule() {
    console.log('renderSchedule called');
    if (!scheduleBody) {
        console.error('scheduleBody element not found');
        return;
    }
    
    // Clear existing content
    scheduleBody.innerHTML = '';
    
    // Add undo button for admins/mods
    addUndoButtonIfNeeded();
    
    console.log('scheduleData:', scheduleData);
    
    // Create rows for each time slot
    scheduleData.times.forEach((time, timeIndex) => {
        const row = document.createElement('tr');
        
        // Time cell
        const timeCell = document.createElement('td');
        timeCell.textContent = `${time.start} - ${time.end}`;
        row.appendChild(timeCell);
        
        // Day cells
        scheduleData.days.forEach((day, dayIndex) => {
            const cell = document.createElement('td');
            
            // Check if lesson exists for this time and day
            const lesson = scheduleData.lessons[dayIndex] && scheduleData.lessons[dayIndex][timeIndex];
            
            if (lesson) {
                cell.innerHTML = `
                    <div class="lesson">
                        <strong>${lesson.subject}</strong><br>
                        <small>${lesson.teacher}</small>
                    </div>
                `;
                
                // Add click handler for editing (admins and mods only)
                if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'mod')) {
                    cell.style.cursor = 'pointer';
                    cell.addEventListener('click', () => editLesson(dayIndex, timeIndex));
                }
            } else if (currentUser && (currentUser.role === 'admin' || currentUser.role === 'mod')) {
                // Empty cell with click handler for adding
                cell.style.cursor = 'pointer';
                cell.textContent = 'לחץ להוספת שיעור';
                cell.addEventListener('click', () => editLesson(dayIndex, timeIndex));
            } else {
                cell.textContent = '-';
            }
            
            row.appendChild(cell);
        });
        
        scheduleBody.appendChild(row);
    });
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
