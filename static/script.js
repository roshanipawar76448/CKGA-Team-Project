// ── QUIZ DATA ──────────────────────────────────────────────
const questions = [
  {
    question: "What does CPU stand for?",
    options: ["Central Processing Unit", "Computer Personal Unit", "Central Program Utility", "Core Processing Unit"],
    answer: 0
  },
  {
    question: "Which language is primarily used for web page structure?",
    options: ["Python", "Java", "HTML", "C++"],
    answer: 2
  },
  {
    question: "What does RAM stand for?",
    options: ["Read Access Memory", "Random Access Memory", "Run Active Memory", "Remote Access Module"],
    answer: 1
  },
  {
    question: "Which of these is an operating system?",
    options: ["Google Chrome", "Microsoft Word", "Ubuntu", "VLC Media Player"],
    answer: 2
  },
  {
    question: "What symbol is used for comments in Python?",
    options: ["//", "/*", "#", "--"],
    answer: 2
  }
];

// ── STATE ───────────────────────────────────────────────────
let currentQ      = 0;
let selectedAnswer= null;
let selectedConf  = null;
let studentName   = "";
let results       = [];

// ── START ───────────────────────────────────────────────────
function startQuiz() {
    currentQ = 0;
    results = [];
    show("quiz-screen");
    loadQuestion();
}

// ── LOAD QUESTION ───────────────────────────────────────────
function loadQuestion() {
  selectedAnswer = null;
  selectedConf   = null;

  const q = questions[currentQ];
  document.getElementById("question-text").textContent  = q.question;
  document.getElementById("question-count").textContent =
    `Question ${currentQ + 1} of ${questions.length}`;

  // Progress bar
  const pct = ((currentQ) / questions.length) * 100;
  document.getElementById("progress-bar").style.width = pct + "%";

  // Options
  const container = document.getElementById("options-container");
  container.innerHTML = "";
  q.options.forEach((opt, i) => {
    const btn = document.createElement("button");
    btn.className   = "option-btn";
    btn.textContent = opt;
    btn.onclick     = () => selectAnswer(i);
    container.appendChild(btn);
  });

  // Reset confidence
  ["conf-low","conf-med","conf-high"].forEach(id =>
    document.getElementById(id).classList.remove("active")
  );
  document.getElementById("next-btn").disabled = true;
}

// ── SELECT ANSWER ───────────────────────────────────────────
function selectAnswer(index) {
  selectedAnswer = index;
  document.querySelectorAll(".option-btn").forEach((btn, i) => {
    btn.classList.toggle("selected", i === index);
  });
  checkReady();
}

// ── SELECT CONFIDENCE ────────────────────────────────────────
function selectConfidence(level) {
  selectedConf = level;
  document.getElementById("conf-low").classList.toggle ("active", level === "Low");
  document.getElementById("conf-med").classList.toggle ("active", level === "Medium");
  document.getElementById("conf-high").classList.toggle("active", level === "High");
  checkReady();
}

function checkReady() {
  document.getElementById("next-btn").disabled =
    (selectedAnswer === null || selectedConf === null);
}

// ── NEXT QUESTION ────────────────────────────────────────────
function nextQuestion() {
    const q = questions[currentQ];

    const correct = selectedAnswer === q.answer;

    results.push({
        question: q.question,
        yourAnswer: q.options[selectedAnswer],
        rightAnswer: q.options[q.answer],
        correct: correct,
        confidence: selectedConf
    });

    currentQ++;

    if (currentQ < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}


// ── RESULTS ──────────────────────────────────────────────────
function showResults() {

    show("result-screen");

    let score = 0;
    let ch = 0, cl = 0, wh = 0, wl = 0;

    results.forEach(r => {
        if (r.correct) {
            score++;

            if (r.confidence === "High") ch++;
            else cl++;
        } else {
            if (r.confidence === "High") wh++;
            else wl++;
        }
    });

    /* Confidence Accuracy */
    let totalHigh = ch + wh;
    let calibration = totalHigh > 0 ? (ch / totalHigh) * 100 : 0;

    document.getElementById("score-display").textContent = score;

    document.getElementById("count-ch").textContent = ch;
    document.getElementById("count-cl").textContent = cl;
    document.getElementById("count-wh").textContent = wh;
    document.getElementById("count-wl").textContent = wl;

    let msg = "";

    if (wh > cl && wh > 0) {
        msg = "⚠️ Overconfidence detected.";
    }
    else if (cl > wh && cl >= 2) {
        msg = "💡 Underconfidence detected.";
    }
    else if (score === questions.length) {
        msg = "🌟 Excellent performance with balanced confidence.";
    }
    else if (score >= 3) {
        msg = "✅ Good performance.";
    }
    else {
        msg = "📘 Keep practicing and improve confidence balance.";
    }
    document.getElementById("analysis-message").innerHTML = msg;

    /* Review */
    const reviewDiv = document.getElementById("review-container");
    reviewDiv.innerHTML = "";

    results.forEach((r, i) => {
        reviewDiv.innerHTML += `
        <div class="review-item">
            <p><b>Q${i+1}:</b> ${r.question}</p>
            <p>Your Answer: ${r.yourAnswer}</p>
            <p>Correct Answer: ${r.rightAnswer}</p>
            <p>Confidence: ${r.confidence}</p>
        </div>
        `;
    });

    /* SEND DATA TO FLASK DATABASE */
    fetch("/submit_result", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            score: score,
            total: questions.length,
            ch: ch,
            cl: cl,
            wh: wh,
            wl: wl,
            calibration: calibration
        })
    })
    .then(response => response.json())
    .then(data => console.log("Saved:", data))
    .catch(error => console.log("Error:", error));

    fetch("/get_ai_insight", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        score,
        ch,
        cl,
        wh,
        wl
    })
})
.then(res => res.json())
.then(data => {
    document.getElementById("aiInsight").innerHTML = data.insight;
});
}

// ── RESTART ───────────────────────────────────────────────────
function restartQuiz() {
  document.getElementById("student-name").value = "";
  show("home-screen");
}

// ── HELPER ───────────────────────────────────────────────────
function show(screenId) {
  ["home-screen","quiz-screen","result-screen"].forEach(id => {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  });
}