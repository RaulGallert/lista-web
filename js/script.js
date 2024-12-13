import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAP_NrF2sM8M2yegQE13ccmpU-7u9RpwwY",
    authDomain: "todolist-f9100.firebaseapp.com",
    projectId: "todolist-f9100",
    storageBucket: "todolist-f9100.firebasestorage.app",
    messagingSenderId: "987313459512",
    appId: "1:987313459512:web:e0f262d4f1d20e3de1f1cd",
    measurementId: "G-2DQG5SYG80"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const countStatus = document.querySelector("#countStatus");
const selectPriority = document.querySelector("#select-priority");
const editselectPriority = document.querySelector("#select-priority-edit");

let oldInputValue;

// Funções Gerais

function addPriority(value, el) {
    switch (value) {
        case "low":
            el.classList.add("priority-low");
            el.id = "priority-low";
            el.innerHTML = `<p>Baixa</p>`;
            break;
        case "middle":
            el.classList.add("priority-middle");
            el.id = "priority-middle";
            el.innerHTML = `<p>Média</p>`;
            break;
        case "high":
            el.classList.add("priority-high");
            el.id = "priority-high";
            el.innerHTML = `<p>Alta</p>`;
            break;
        default:
            break;
    }
    return el;
}

function verifyTitleTask(task) {
    const todos = document.querySelectorAll(".todo");
    let titlesList = [];

    todos.forEach((todo) => {
        const todoTitle = todo.querySelector("h3").innerText;
        titlesList.push(todoTitle);
    });

    if (titlesList.includes(task)) {
        alert("Tarefa já existe no TO DO.");
        return true;
    }
}

function clearValue() {
    todoInput.value = "";
    todoInput.focus();
}

async function saveTodo(task, done = 0, prioritySelected, isFromFirestore = false) {
    // Verifica se a tarefa já existe se não for uma tarefa carregada do Firestore
    if (!isFromFirestore && verifyTitleTask(task)) {
        return;
    }

    const todo = document.createElement("div");
    todo.classList.add("todo");

    const todoTitle = document.createElement("h3");
    todoTitle.innerHTML = task;
    todo.appendChild(todoTitle);

    if (!prioritySelected) {
        prioritySelected = selectPriority.value;
    }

    let priority = document.createElement("div");
    priority = addPriority(prioritySelected, priority);

    todo.appendChild(priority);

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("finish-todo");
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement("button");
    editBtn.classList.add("edit-todo");
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    todo.appendChild(editBtn);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-todo");
    removeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    todo.appendChild(removeBtn);

    if (done) {
        todo.classList.add("done");
    }

    // Salvar no Firestore, mas só se não for carregado do Firestore
    if (!isFromFirestore) {
        const todoRef = await addDoc(collection(db, "todos"), {
            title: task,
            done: done,
            priority: prioritySelected
        });
        todo.id = todoRef.id; // Atribui o ID do Firestore ao elemento de tarefa
    }

    todoList.appendChild(todo);
    clearValue();
    countTodos(); // Atualiza a contagem sempre que uma tarefa for salva
}

async function loadTodos() {
    const querySnapshot = await getDocs(collection(db, "todos"));
    querySnapshot.forEach((doc) => {
        const todoData = doc.data();
        saveTodo(todoData.title, todoData.done, todoData.priority, true); // Passa `true` para não salvar novamente
    });
}

async function updateTodoInFirestore(todoId, title, priority) {
    const todoRef = doc(db, "todos", todoId);
    await updateDoc(todoRef, {
        title: title,
        priority: priority
    });
}

async function deleteTodoFromFirestore(todoId) {
    const todoRef = doc(db, "todos", todoId);
    await deleteDoc(todoRef);
}

function toggleForms() {
    editForm.classList.toggle("hide");
    todoForm.classList.toggle("hide");
    todoList.classList.toggle("hide");
}

function updateTodo(text, priority) {
    const todos = document.querySelectorAll(".todo");

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector("h3");

        if (todoTitle.innerText === oldInputValue) {
            todoTitle.innerText = text;
            let priorityDiv = todo.querySelector("div[id^='priority-']");
            priorityDiv.id = "";
            addPriority(priority, priorityDiv);

            // Atualiza no Firestore
            updateTodoInFirestore(todo.id, text, priority);
        }
    });

    countTodos(); // Atualiza a contagem após editar
}

function countTodos() {
    const todos = document.querySelectorAll(".todo");
    let totalTodos = todos.length;
    let doneTodos = 0;

    todos.forEach((todo) => {
        if (todo.classList.contains("done")) {
            doneTodos++;
        }
    });

    countStatus.innerText = `Status: ${doneTodos}/${totalTodos}`;
}

// Eventos
todoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const inputValue = todoInput.value;

    if (inputValue) {
        saveTodo(inputValue); // Salva no Firestore
    } else {
        alert("Insira algo no campo!")
    }
    countTodos(); // Atualiza a contagem após adicionar tarefa
});

document.addEventListener("click", (e) => {
    const targetEl = e.target;
    const parentEl = targetEl.closest("div");
    let todoTitle;
    let todoPriority;

    if (parentEl && parentEl.querySelector("h3") && parentEl.querySelector("p")) {
        todoTitle = parentEl.querySelector("h3").innerText;
        todoPriority = parentEl.querySelector("p").innerText;
    }

    if (targetEl.classList.contains("finish-todo")) {
        const doneBtn = parentEl.querySelector(".finish-todo");
        const editBtn = parentEl.querySelector(".edit-todo");
        doneBtn.setAttribute("disabled", "");
        editBtn.setAttribute("disabled", "");
        doneBtn.setAttribute("class", "realizado");
        editBtn.setAttribute("class", "realizado");

        parentEl.classList.toggle("done"); // Marca como concluída ou não

        // Atualiza no Firestore
        updateTodoInFirestore(parentEl.id, todoTitle, todoPriority);

        countTodos(); // Atualiza a contagem após conclusão
    }

    if (targetEl.classList.contains("remove-todo")) {
        // Exclui do Firestore
        deleteTodoFromFirestore(parentEl.id);
        parentEl.remove();
        countTodos(); // Atualiza a contagem após remoção
    }

    if (targetEl.classList.contains("edit-todo")) {
        toggleForms();
        countStatus.style.display = "none";
        editInput.value = todoTitle;
        if (todoPriority === "Baixa") {
            editselectPriority.value = "low";
        } if (todoPriority === "Alta") {
            editselectPriority.value = "high";
        } if (todoPriority === "Média") {
            editselectPriority.value = "middle";
        }
        oldInputValue = todoTitle;
    }

    countTodos(); // Atualiza a contagem após qualquer ação
});

cancelEditBtn.addEventListener("click", (e) => {
    e.preventDefault();
    countStatus.style.display = "flex";
    toggleForms();
});

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    countStatus.style.display = "flex";
    const editInputValue = editInput.value;
    const editSelectValue = editselectPriority.value;
    if (editInputValue || editSelectValue) {
        updateTodo(editInputValue, editSelectValue);
    }

    toggleForms();
});

// Carregar tarefas ao iniciar a página
loadTodos();
