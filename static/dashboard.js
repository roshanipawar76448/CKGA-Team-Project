function showSection(id) {
    document.querySelectorAll(".section").forEach(sec => {
        sec.classList.add("hidden");
    });

    document.getElementById(id).classList.remove("hidden");

    if (id === "history") loadHistory();
    if (id === "graph") loadGraph();
}

// ── HISTORY ─────────────────────────
function loadHistory() {
    fetch("/my_history")
        .then(res => res.json())
        .then(data => {
            const div = document.getElementById("history-data");
            div.innerHTML = "";

            data.forEach(item => {
                div.innerHTML += `
                    <p>Score: ${item[0]} | Calibration: ${item[1]}% | Date: ${item[2]}</p>
                `;
            });
        });
}

// ── GRAPH ───────────────────────────
function loadGraph() {
    fetch("/my_history")
        .then(res => res.json())
        .then(data => {

            const scores = data.map(d => d[0]);
            const labels = data.map((_, i) => "Attempt " + (i+1));

            const ctx = document.getElementById("chart");

            new Chart(ctx, {
                type: "line",
                data: {
                    labels: labels,
                    datasets: [{
                        label: "Score",
                        data: scores
                    }]
                }
            });
        });
}