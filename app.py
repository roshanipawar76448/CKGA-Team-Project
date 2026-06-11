from flask import Flask, request, jsonify, render_template, session, redirect
import mysql.connector
from openai import OpenAI
import os

app = Flask(__name__)
app.secret_key = "secret123"
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
# ── DATABASE CONNECTION ─────────────────────────────
def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="suma123",
        database="confidence"
    )

# ── HOME / DASHBOARD ───────────────────────────────
@app.route("/")
def home():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("dashboard.html", name=session["name"])

@app.route("/dashboard")
def dashboard():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("dashboard.html", name=session["name"])

# ── REGISTER ───────────────────────────────────────
@app.route("/register", methods=["GET", "POST"])
def register():
    if request.method == "POST":
        fullname = request.form["fullname"]
        email = request.form["email"]
        userid = request.form["userid"]
        password = request.form["password"]
        confirm = request.form["confirm"]

        if password != confirm:
            return render_template(
                "register.html",
                error="Passwords do not match"
            )

        conn = get_db()
        c = conn.cursor()

        try:
            c.execute("""
                INSERT INTO users(fullname, email, userid, password)
                VALUES(%s,%s,%s,%s)
            """, (fullname, email, userid, password))

            conn.commit()

            return render_template(
                "register.html",
                success="Registered successfully! Please login."
            )

        except:
            return render_template(
                "register.html",
                error="User already exists"
            )

        finally:
            conn.close()

    return render_template("register.html")

# ── LOGIN ──────────────────────────────────────────
@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        userid = request.form["userid"]
        password = request.form["password"]

        conn = get_db()
        c = conn.cursor()

        c.execute("SELECT * FROM users WHERE userid=%s", (userid,))
        user = c.fetchone()

        conn.close()

        if not user:
            return render_template(
                "login.html",
                error="User not found. Please register first."
            )

        if user[4] != password:
            return render_template(
                "login.html",
                error="Incorrect password"
            )

        session["user_id"] = user[0]
        session["name"] = user[1]

        return redirect("/")

    return render_template("login.html")

# ── QUIZ PAGE ──────────────────────────────────────
@app.route("/quiz")
def quiz():
    if "user_id" not in session:
        return redirect("/login")

    return render_template("index.html", name=session["name"])

@app.route("/quiz_hub")
def quiz_hub():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("quiz_hub.html", name=session["name"])

@app.route("/topic_quiz")
def topic_quiz():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("topic_quiz.html", name=session["name"])

@app.route("/live_quiz")
def live_quiz():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("live_quiz.html", name=session["name"])

@app.route("/daily_quiz")
def daily_quiz():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("daily_quiz.html", name=session["name"])

@app.route("/custom_quiz")
def custom_quiz():
    if "user_id" not in session:
        return redirect("/login")
    return render_template("custom_quiz.html", name=session["name"])

# ── SUBMIT RESULT ──────────────────────────────────
@app.route("/submit_result", methods=["POST"])
def submit_result():
    data = request.json

    conn = get_db()
    c = conn.cursor()

    c.execute("""
        INSERT INTO results
        (name, score, total, ch, cl, wh, wl, calibration, created_at)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,NOW())
    """, (
        session["name"],
        data["score"],
        data["total"],
        data["ch"],
        data["cl"],
        data["wh"],
        data["wl"],
        data["calibration"]
    ))

    conn.commit()   # VERY IMPORTANT
    conn.close()

    return jsonify({"message":"saved"})

# ── HISTORY PAGE ───────────────────────────────────
@app.route("/history")
def history():

    conn = get_db()
    c = conn.cursor()

    c.execute("""
        SELECT score, calibration, created_at
        FROM results
        WHERE name=%s
        ORDER BY id DESC
    """,(session["name"],))

    rows = c.fetchall()
    conn.close()

    return render_template("history.html", rows=rows)

# ── PERFORMANCE PAGE ───────────────────────────────
@app.route("/performance")
def performance():

    conn = get_db()
    c = conn.cursor()

    c.execute("""
        SELECT 
        COUNT(*),
        AVG(score),
        MAX(score),
        AVG(calibration)
        FROM results
        WHERE name=%s
    """,(session["name"],))

    stats = c.fetchone()
    conn.close()

    return render_template("performance.html", stats=stats)
 
 #AI Insight
@app.route("/get_ai_insight", methods=["POST"])
def get_ai_insight():

    data = request.json

    score = data["score"]
    ch = data["ch"]
    cl = data["cl"]
    wh = data["wh"]
    wl = data["wl"]

    prompt = f"""
    A student completed a quiz.

    Score: {score}
    Correct High Confidence: {ch}
    Correct Low Confidence: {cl}
    Wrong High Confidence: {wh}
    Wrong Low Confidence: {wl}

    Give a short personalized learning insight in 3 lines.
    Mention overconfidence or underconfidence if needed.
    """

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )

    insight = response.choices[0].message.content

    return jsonify({"insight": insight})

# ── ABOUT PAGE ─────────────────────────────────────
@app.route("/about")
def about():
    if "user_id" not in session:
        return redirect("/login")

    return render_template(
        "about.html",
        name=session["name"]
    )

# ── LOGOUT ─────────────────────────────────────────
@app.route("/logout")
def logout():
    session.clear()
    return redirect("/login")

# ── RUN ────────────────────────────────────────────
if __name__ == "__main__":
    app.run(debug=True)