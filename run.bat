@echo off
echo Setting up the Hebrew Schedule application...

:: Create a virtual environment if it doesn't exist
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
    call venv\Scripts\activate
    echo Installing dependencies...
    pip install -r requirements.txt
) else (
    call venv\Scripts\activate
)

:: Check if the database exists, if not initialize it
if not exist "instance\schedule.db" (
    echo Initializing database...
    python init_db.py
)

echo Starting the application...
python app.py

pause
