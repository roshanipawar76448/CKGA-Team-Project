📊 Confidence-Knowledge Gap Analyzer
A full-stack web application that analyzes the gap between a student's confidence and their actual quiz performance to detect overconfidence, underconfidence, and knowledge gaps.

🚀 Features

User Registration & Login with session management
Confidence-based quiz (Low / Medium / High rating per question)
Detects overconfidence and underconfidence patterns
Quiz history tracking per user
Performance dashboard with Chart.js visualizations
Calibration score calculation


🛠️ Tech Stack
LayerTechnologyBackendPython, FlaskFrontendHTML, CSS, JavaScriptDatabaseMySQLChartsChart.jsTemplatingJinja2

⚙️ Installation & Setup
1. Clone the repository
bashgit clone https://github.com/yourusername/confidence-gap-analyzer.git
cd confidence-gap-analyzer
2. Install dependencies
bashpip install flask mysql-connector-python
3. Setup MySQL Database
sqlCREATE DATABASE confidence;

USE confidence;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100),
    email VARCHAR(100),
    userid VARCHAR(50) UNIQUE,
    password VARCHAR(100)
);

CREATE TABLE results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    score INT,
    total INT,
    ch INT,
    cl INT,
    wh INT,
    wl INT,
    calibration FLOAT,
    created_at DATETIME
);
4. Configure database credentials in app.py
pythonhost="localhost"
user="your_mysql_username"
password="your_mysql_password"
database="confidence"
5. Run the app
bashpython app.py
6. Open in browser
http://localhost:5000

📁 Project Structure
project/
│
├── app.py
├── static/
│   ├── style.css
│   ├── dashboard.css
│   ├── loginstyle.css
│   ├── script.js
│   └── dashboard.js
│
└── templates/
    ├── login.html
    ├── register.html
    ├── dashboard.html
    ├── index.html
    ├── history.html
    ├── performance.html
    └── about.html

📌 How It Works

User registers and logs in
Takes a quiz and selects confidence level per question
App calculates score + calibration accuracy
Results saved to database
Dashboard shows history, trends, and insight

## My Contribution

- Contributed to frontend development (HTML, CSS, JavaScript)
- Worked on dashboard and user interface components
- Added README documentation and project structure explanation

⚠️ Note
Store your database credentials in environment variables before pushing to GitHub — never hardcode passwords in production.
