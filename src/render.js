import pubsub from "./pubsub";
import newItem from "./makeToDos";
import { ToDoManager } from "./manageToDos";
import { ProjectManager } from "./manageProjects";

const render = (function() {

    const appBody = document.querySelector('.appBody');
    
    const newToDoBtn = document.createElement('button');
    newToDoBtn.classList.add('newTodoBtn');
    newToDoBtn.textContent='Add To-Do';

    newToDoBtn.addEventListener('click',makeForm);

    const header = document.querySelector('.header');
    header.appendChild(newToDoBtn);

    const displayElem = document.createElement('div');
    displayElem.classList.add('displayElem');
    appBody.appendChild(displayElem);

    function makeForm() {
        //disabling add project and add todo buttons
        const newProjectBtn = document.querySelector('.newProjectBtn');
        newProjectBtn.setAttribute('disabled','');
        newToDoBtn.setAttribute('disabled','');

        displayElem.textContent='';
        const newToDoForm = document.createElement('form');
        newToDoForm.setAttribute('id','myForm');
        displayElem.appendChild(newToDoForm);
        const formInput = document.createElement('input');
        formInput.setAttribute('type','text');
        formInput.setAttribute('id','formInput');
        formInput.setAttribute('required','');
        formInput.setAttribute('placeholder','Title');
        newToDoForm.appendChild(formInput);
        const dueDateInput = document.createElement('input');
        dueDateInput.setAttribute('type','date');
        dueDateInput.setAttribute('id','dueDateInput');
        dueDateInput.setAttribute('required','');
        newToDoForm.appendChild(dueDateInput);
        const priorityLabel = document.createElement('label');
        priorityLabel.setAttribute('for','priority');
        priorityLabel.textContent='Priority:';
        newToDoForm.appendChild(priorityLabel);
        const priorityInput = document.createElement('select');
        priorityInput.setAttribute('name','priority');
        priorityInput.setAttribute('id','priorityInput');
        const optLow = document.createElement('option');
        optLow.setAttribute('value','low');
        optLow.setAttribute('selected','');
        optLow.textContent='Low';
        priorityInput.appendChild(optLow);
        const optMedium = document.createElement('option');
        optMedium.setAttribute('value','medium');
        optMedium.textContent='Medium';
        priorityInput.appendChild(optMedium);
        const optHigh = document.createElement('option');
        optHigh.setAttribute('value','high');
        optHigh.textContent='High';
        priorityInput.appendChild(optHigh);
        newToDoForm.appendChild(priorityInput);
        const formButton = document.createElement('button');
        //formButton.setAttribute('type','submit');
        formButton.textContent = 'SUBMIT';
        newToDoForm.appendChild(formButton);

        formButton.addEventListener('click',(e) => {
            e.preventDefault();
            //re-enabling add project and todo buttons
            newProjectBtn.removeAttribute('disabled');
            newToDoBtn.removeAttribute('disabled');
            
            addItem();
        });
    }

    function makeListElement() {
        const todolist = document.createElement('div');
        todolist.classList.add('todolist');
        displayElem.appendChild(todolist);
    }


    function addItem() {
        const todo = new newItem();
        todo.title = formInput.value;
        todo.dueDate = dueDateInput.value;
        todo.priority = priorityInput.value;
        displayElem.textContent='';
        makeListElement();
        ToDoManager.addToDo(todo);
    }
    
    //subscribe to pubsub event
    pubsub.subscribe("listChanged",initialLoad);
    makeListElement();
    initialLoad(ProjectManager.getCurrentProject().projectTodos);

    function initialLoad(list) {
        const todolist=document.querySelector('.todolist');
        todolist.textContent = '';
        list.forEach((todo) => {
            const todoElem = document.createElement('div');
            todoElem.classList.add('todo');
            
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

            const todoTitle  = document.createElement('div');
            todoTitle.classList.add('title');
            todoTitle.textContent = todo.title;
            todoElem.appendChild(todoTitle);

            const todoDueDate = document.createElement('div');
            todoDueDate.classList.add('dueDate');
            todoDueDate.textContent = todo.dueDate;
            todoElem.appendChild(todoDueDate);

            const dltBtn = document.createElement('button');
            dltBtn.textContent = 'DELETE';
            dltBtn.setAttribute('class','delete');
            dltBtn.id = todo.index;
            todoElem.appendChild(dltBtn);

            dltBtn.addEventListener('click',()=> {
                ToDoManager.deleteToDo(todo.index);
            });

            const editBtn = document.createElement('button');
            editBtn.textContent = 'EDIT';
            editBtn.setAttribute('class','edit');
            editBtn.id = todo.index;
            todoElem.appendChild(editBtn);

            editBtn.addEventListener('click',()=> {
                displayElem.textContent='';
                const newToDoForm = document.createElement('form');
                newToDoForm.setAttribute('id','myForm');
                displayElem.appendChild(newToDoForm);
                const formInput = document.createElement('input');
                formInput.setAttribute('type','text');
                formInput.setAttribute('id','formInput');
                formInput.setAttribute('required','');
                formInput.setAttribute('placeholder','Title');
                formInput.value=todo.title;
                newToDoForm.appendChild(formInput);
                const dueDateInput = document.createElement('input');
                dueDateInput.setAttribute('type','date');
                dueDateInput.setAttribute('id','dueDateInput');
                dueDateInput.setAttribute('required','');
                dueDateInput.value=todo.dueDate;
                newToDoForm.appendChild(dueDateInput);
                const priorityLabel = document.createElement('label');
                priorityLabel.setAttribute('for','priority');
                priorityLabel.textContent='Priority:';
                newToDoForm.appendChild(priorityLabel);
                const priorityInput = document.createElement('select');
                priorityInput.setAttribute('name','priority');
                priorityInput.setAttribute('id','priorityInput');
                const optLow = document.createElement('option');
                optLow.setAttribute('value','low');
                optLow.setAttribute('selected','');
                optLow.textContent='Low';
                priorityInput.appendChild(optLow);
                const optMedium = document.createElement('option');
                optMedium.setAttribute('value','medium');
                optMedium.textContent='Medium';
                priorityInput.appendChild(optMedium);
                const optHigh = document.createElement('option');
                optHigh.setAttribute('value','high');
                optHigh.textContent='High';
                priorityInput.appendChild(optHigh);
                priorityInput.value = todo.priority;
                newToDoForm.appendChild(priorityInput);
                const formButton = document.createElement('button');
                //formButton.setAttribute('type','submit');
                formButton.textContent = 'SUBMIT';
                newToDoForm.appendChild(formButton);

                formButton.addEventListener('click', (e)=> {
                    e.preventDefault();
                    todo.title = formInput.value;
                    todo.dueDate = dueDateInput.value;
                    todo.priority = priorityInput.value;
                    displayElem.textContent='';
                    makeListElement();
                    ToDoManager.updateToDo(todo.index);
                });
            });

            todolist.appendChild(todoElem);
        });
    }

})();

export {render};