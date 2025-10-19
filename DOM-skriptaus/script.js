// elementtien hakeminen
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const errorMsg = document.getElementById("error-msg");

// lataa tallennetut tehtävät localstoragesta
document.addEventListener("DOMContentLoaded", loadTasks);

//listään kuuntelija, joka submit, kun käyttäjä painaa hiirtä tai enteriä
form.addEventListener("submit", (e) => {
    e.preventDefault(); // etsää sivun uudelleenlatauksen lomaketta lähetettäessä
    const taskText = input.value.trim(); //poistaa ylimääreiset välilyönnit
    
    // pituuden tarkistus (vähintään 3 merkkiä)
    if (taskText.length < 3 ) {
        showError("Kirjoita vähintään 3 merkkiä");
        input.classList.add("error"); //visuaalinen korostus
        return;
    }
    // uuden listaelementin lisääminen
    addTask(taskText);
    input.value = "";
    clearError(); // poistaa virheen ja errorrin kentästä
});

// tehtävän lisäys listaan
function addTask(text, completed = false) {
    const li = document.createElement("li");
    li.textContent = text;
    if (completed) li.classList.add("completed"); //tarkistaa onko tehtävä tehty ja lisää tyyliluokka 'completed'
    
    const btnContainer = document.createElement("div"); // luodaan tyhjä div elementti
    // tehty nappi
    const doneBtn = document.createElement("button");
    doneBtn.textContent = "✅";
    doneBtn.title = "Merkitse tehdyksi"; // hiiri osuu napin kohdalle tulee ilmoitus
   
    // tehty merkitseminen ja tehty merkin poistaminen
    doneBtn.addEventListener("click", () => {
        li.classList.toggle("completed");
        saveTasks();
    });

    // poisto nappi
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.title = "Poista tehtävä";
    deleteBtn.addEventListener("click", () => {
        li.remove();
        saveTasks();
    });

    // valmis ja poisto napin lisäsys tehtävän riville
    btnContainer.appendChild(doneBtn);
    btnContainer.appendChild(deleteBtn);
    li.appendChild(btnContainer);
    list.appendChild(li);
    saveTasks();
}

//virhe ilmoitus
function showError(message) {
    errorMsg.textContent = message;
}

// virheilmoituksen poistaminen
function clearError() {
    errorMsg.textContent = "";
    input.classList.remove("error");
}

//tallennus localstorageen
function saveTasks () {
    const tasks = [];
    list.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.firstChild.textContent,
            completed: li.classList.contains("completed")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//tallennettujen tehtävien lataus sivun avautuessa
function loadTasks() {
    const saved = localStorage.getItem("tasks");
    if (saved) {
        JSON.parse(saved).forEach(task => addTask(task.text, task.completed));
    }
}