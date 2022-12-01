import pubsub from "./pubsub";
import newItem from "./makeToDos";
import { ToDoManager } from "./manageToDos";

const render = (function() {

    const rootElem = document.querySelector('#content');
    
   // function makeForm() {
        const newToDoForm = document.createElement('form');
        newToDoForm.setAttribute('id','myForm');
        rootElem.appendChild(newToDoForm);
        const formInput = document.createElement('input');
        formInput.setAttribute('type','text');
        formInput.setAttribute('id','formInput');
        formInput.setAttribute('required','');
        newToDoForm.appendChild(formInput);
        const formButton = document.createElement('button');
        //formButton.setAttribute('type','submit');
        formButton.textContent = 'SUBMIT';
        newToDoForm.appendChild(formButton);
    //}
    //makeForm();

    const todolist = document.createElement('div');
    todolist.classList.add('todolist');
    rootElem.appendChild(todolist);

    formButton.addEventListener('click',(e) => {
        e.preventDefault();
        addItem();
    });

    function addItem() {
        const todo = new newItem();
        todo.title = formInput.value;
        formInput.value = '';
        ToDoManager.addToDo(todo);
    }
    
    //subscribe to pubsub event
    pubsub.subscribe("listChanged",initialLoad);

    function initialLoad(list) {
        todolist.textContent = '';
        list.forEach((todo) => {
            const todoElem = document.createElement('div');
            todoElem.classList.add('todo');
            const todoTitle  = document.createElement('div');
            todoTitle.classList.add('title');
            todoTitle.textContent = todo.title;
            todoElem.appendChild(todoTitle);
            const checkBox = document.createElement('input');
            checkBox.setAttribute('type','checkbox');
            checkBox.classList.add('checkBox');
            if(todo.complete)
                checkBox.checked = true;
            todoElem.appendChild(checkBox);

            checkBox.addEventListener('change', ()=>{
                todo.complete = !todo.complete;
                ToDoManager.updateToDo(todo.index);
            });

            todolist.appendChild(todoElem);
        });
    }
})();

export {render};