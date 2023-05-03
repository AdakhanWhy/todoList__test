let home = document.querySelector('.home');
let add = document.querySelector('.add');
let todoList = document.querySelector('.todoList');
let API = 'http://localhost:8000/todo';
getData();


add.addEventListener('click', () => addTodo());

function addTodo(){
    todoList.innerHTML = `
    <div class="panel">
        <input class="todo__inp" type="text" placeholder="Todo">
        <button class="todo__btn">Add Todo</button>
    </div>
    `

    document.querySelector('.todo__btn').
    addEventListener('click', () => {
        addInDb(document.querySelector('.todo__inp').value)
    })
}


async function addInDb(value){
    let todo = {
        todoValue: value
    }
    let request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(todo)
    };

    await fetch(API, request);
}


async function getData(){
    let data = await fetch(API).then(resp => resp.json());
    renderData(data);
}


function renderData(data){
    todoList.innerHTML = `
        <section class="todo__card">
            ${data.map(item => `
                <div class="todo__item">
                    <span class="item__id">${item.id}</span>
                    <div class="todo__start">
                        <input type="checkbox">
                        <span>${item.todoValue}</span>
                    </div>
                    <div class="todo__end">
                        <button onclick="editTodo(${item.id})" class="edit">Edit</button>
                        <button onclick="deleteTodo(${item.id})" class="delete">Delete</button>
                    </div>
                </div>
            `)}
        </section>
    `
}


async function deleteTodo(id){
    let request = {
        method: 'DELETE'
    }
    await fetch(`${API}/${id}`, request);
    getData();
}


async function editTodo(id){
    let editObj = await fetch(`${API}/${id}`).then(resp => resp.json());
    console.log(editObj);


    todoList.innerHTML = `
        <div class="panel">
            <input id="edit__todo_inp" value=${editObj.todoValue} type="text" placeholder="Edit Todo">
            <button id="edit__todo_btn">Save changes</button>
        </div>
    `

    document.querySelector('#edit__todo_btn').addEventListener('click', () => saveEdit(id, document.querySelector('#edit__todo_inp').value));
}


async function saveEdit(id, editObj){
    let newObj = Object.assign({}, {todoValue: editObj, id: id})
    let request = {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newObj)
    }

    await fetch(`${API}/${id}`, request);
    getData();
}