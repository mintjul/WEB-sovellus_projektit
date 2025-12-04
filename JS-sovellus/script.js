//tausta
window.addEventListener("DOMContentLoaded", ()=> {
    VANTA.DOTS({
        el: "#your-element-selector",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: 0xf29ac8,
        color2: 0xff92e5,
        backgroundColor: 0xf7dbeb
    });
});

$(document).ready(function() {

    // Näytä tehtävälista napista
    $("#showListBtn").click(function() {
        $("#todolist").slideDown();
    });

    // Lataa tehtävät localStoragesta
    loadTasks();

    // Lisää tehtävä
    $("#addItemBtn").click(function(e) {
        e.preventDefault();

        const text = $("#taskInput").val().trim();
        if (text === "") {
            $("#error-msg").text("Kirjoita tehtävä"); // Yksi virheilmoitus
            return;
        }

        addTask(text);
        $("#taskInput").val("");
        $("#error-msg").text("");
    });

    // Hae satunnainen lainaus
    $("#quoteBtn").click(async function (e) {
        e.preventDefault();

        $("#quoteText").text("Ladataan...");

        try {
            const response = await axios.get("https://type.fit/api/quotes");
            const quotes = response.data;

            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            $("#quoteText").text(`"${randomQuote.text}" — ${randomQuote.author || "Tuntematon"}`);
        } catch (error) {
            $("#quoteText").text("Virhe");
            console.error("Axios error:", error);
        }
    });

});

// Lisää tehtävä funktio
function addTask(text, completed = false) {
    const li = $("<li></li>").text(text);
    if (completed) li.addClass("completed");

    // Merkitse tehtävä tehdyksi
    const doneBtn = $("<button>✔️</button>")
        .attr("title", "Valmis")
        .click(function() {
            li.toggleClass("completed");
            saveTasks();
        });

    // Poista tehtävä
    const deleteBtn = $("<button>🗑️</button>")
        .attr("title", "Poista")
        .click(function() {
            li.remove();
            saveTasks();
        });

    li.append(doneBtn, deleteBtn);
    $("#todoList").append(li); // Todolist on erillinen ID
    saveTasks();
}

// Tallenna tehtävät localStorageen
function saveTasks() {
    const tasks = [];
    $("#todoList li").each(function() {
        tasks.push({
            text: $(this).contents().first().text(),
            completed: $(this).hasClass("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Lataa tehtävät localStoragesta
function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        JSON.parse(saved).forEach(task => addTask(task.text, task.completed));
    }
}
