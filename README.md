# 🎯 Confidence Knowledge Gap Analyzer (CKGA)

> An AI-powered learning analytics platform that measures not only **what students know**, but also **how confident they are about what they know**.

## 🚀 Overview

Confidence Knowledge Gap Analyzer (CKGA) helps students identify gaps between their **confidence levels** and **actual performance** through interactive quizzes and intelligent performance analytics.

By combining quiz scores with confidence ratings, the system detects:

* ✅ Accurate Knowledge
* ⚠️ Overconfidence
* 📚 Underconfidence
* 🎯 Learning Calibration

The platform also provides AI-generated insights to support personalized learning and self-improvement.

---

## ✨ Key Features

### 🔐 User Authentication

* Secure User Registration
* Login & Session Management
* Personalized Dashboard

### 📝 Quiz System

* Topic-Based Quizzes
* Daily Quizzes
* Live Quizzes
* Custom Quizzes

### 📊 Performance Analytics

* Score Tracking
* Quiz History
* Confidence Calibration Analysis
* Learning Progress Monitoring

### 🤖 AI-Powered Insights

* Personalized Performance Feedback
* Detection of Overconfidence Patterns
* Identification of Knowledge Gaps
* Learning Improvement Suggestions

---

## 🛠️ Tech Stack

| Category        | Technologies          |
| --------------- | --------------------- |
| Frontend        | HTML, CSS, JavaScript |
| Backend         | Python, Flask         |
| Database        | MySQL                 |
| AI Integration  | OpenAI API            |
| Version Control | Git & GitHub          |

---

## 📂 Project Structure

```text
CKGA-Team-Project
│
├── static/
│   ├── dashboard.css
│   ├── loginstyle.css
│   ├── script.js
│   └── dashboard.js
│
├── templates/
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html
│   ├── history.html
│   ├── performance.html
│   ├── quiz_hub.html
│   └── about.html
│
├── app.py
└── README.md
```

---

## ⚙️ Database Setup

Create the database:

```sql
CREATE DATABASE confidence;
```

Create the required tables:

* users
* results

Update the MySQL credentials in `app.py` according to your local environment.

---

## 💻 Installation Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/roshanipawar76448/CKGA-Team-Project.git
```

### 2️⃣ Create Virtual Environment

```bash
python -m venv venv
```

### 3️⃣ Activate Virtual Environment

```bash
venv\Scripts\activate
```

### 4️⃣ Install Dependencies

```bash
pip install flask mysql-connector-python openai
```

### 5️⃣ Run Application

```bash
python app.py
```

### 6️⃣ Open in Browser

```text
http://127.0.0.1:5000
```

---

## 🎓 Educational Impact

CKGA helps learners:

* Improve self-awareness
* Reduce overconfidence in weak topics
* Build confidence in strong areas
* Make data-driven learning decisions
* Track long-term academic growth

---

## 🌟 Future Enhancements

* 📱 Mobile Responsive Design
* 📈 Advanced Learning Analytics
* 🏆 Leaderboards & Gamification
* 👥 Collaborative Quiz Rooms
* ☁️ Cloud Deployment

---
