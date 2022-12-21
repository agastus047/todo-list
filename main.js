/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/makeProject.js":
/*!****************************!*\
  !*** ./src/makeProject.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function newProject(name) {
    this.name=name;
    this.index;
    this.projectTodos=[];

}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (newProject);

/***/ }),

/***/ "./src/makeToDos.js":
/*!**************************!*\
  !*** ./src/makeToDos.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function newItem(title,description,dueDate,priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = false;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (newItem);

/***/ }),

/***/ "./src/manageProjects.js":
/*!*******************************!*\
  !*** ./src/manageProjects.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ProjectManager": () => (/* binding */ ProjectManager)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _makeProject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./makeProject */ "./src/makeProject.js");
/* harmony import */ var _storage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./storage */ "./src/storage.js");




const ProjectManager = (()=> {
    
    let projectList;
    let currentProject;
    let defaultProject;

    if(localStorage.projects) {
        projectList = _storage__WEBPACK_IMPORTED_MODULE_2__["default"].loadFromStorage();
        defaultProject = projectList[0];
        currentProject = defaultProject;
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('currentProjectChanged',currentProject);
    }
    else {
        projectList = [];
        defaultProject = new _makeProject__WEBPACK_IMPORTED_MODULE_1__["default"]('Default');
        currentProject = defaultProject;
        addProject(defaultProject);
    }

    function getCurrentProject() {
        return currentProject;
    }

    function getProjectList() {
        return projectList;
    }

    function addProject(newproj) {
        newproj.index = projectList.length;
        projectList.push(newproj);
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('projectsChanged',projectList);
        _storage__WEBPACK_IMPORTED_MODULE_2__["default"].saveToStorage(projectList);
    }
    //check condition when default project is deleted
    //or make sure default project is never deleted
    function deleteProject(index) {
        projectList = projectList.filter((project) => project.index !== index);
        for(let i=0;i<projectList.length;i++){
          projectList[i].index = i;
        }
        currentProject = defaultProject;
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('currentProjectChanged',currentProject);
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("projectsChanged",projectList);
        _storage__WEBPACK_IMPORTED_MODULE_2__["default"].saveToStorage(projectList);
   }

   function selectProject(index) {
        currentProject = projectList[index];
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('currentProjectChanged',currentProject);
   }

   //subscribe to pubsub event
   _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('listChanged',updateCurrentProject);

   function updateCurrentProject(newList) {
        currentProject.projectTodos = newList;
        projectList = projectList.map((project)=> project.index === currentProject.index ? currentProject: project);
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('projectsChanged',projectList);
        _storage__WEBPACK_IMPORTED_MODULE_2__["default"].saveToStorage(projectList);
   }

   return {getProjectList, getCurrentProject, addProject, deleteProject, selectProject};
})();



/***/ }),

/***/ "./src/manageToDos.js":
/*!****************************!*\
  !*** ./src/manageToDos.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ToDoManager": () => (/* binding */ ToDoManager)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _manageProjects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./manageProjects */ "./src/manageProjects.js");



const ToDoManager = (()=> {
    let project = _manageProjects__WEBPACK_IMPORTED_MODULE_1__.ProjectManager.getCurrentProject().projectTodos;

    //subscribe to pubsub event
     _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('currentProjectChanged',selectProject);

     function selectProject(currentProject) {
          project = currentProject.projectTodos;
          _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('listChanged',project);
     }

    function getProject() {
          return project;
    }
    function addToDo(newToDo) {
        newToDo.index = project.length;
        project.push(newToDo);
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("listChanged",project);
    }

   function deleteToDo(index) {
        project = project.filter((todo) => todo.index !== index);
        for(let i=0;i<project.length;i++){
          project[i].index = i;
        }
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("listChanged",project);
   }

   function updateToDo(index) {
        project = project.map((todo)=> todo.index === index ? todo : todo,);//{index: todo.index, title: todo.title, complete: todo.complete} : todo,);
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("listChanged",project);
   }
   return {getProject, addToDo, deleteToDo, updateToDo};
})();



/***/ }),

/***/ "./src/pubsub.js":
/*!***********************!*\
  !*** ./src/pubsub.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const pubsub = (function () {
    // holds event: arrayofcallbacks pairs
    const events = {};
  
    function subscribe(event, handler) {
      if (events.hasOwnProperty(event)) events[event].push(handler);
      else events[event] = [handler];
    }
  
    function publish(event, args) {
      if (events.hasOwnProperty(event)) {
        for (const handler of events[event]) {
          handler(args);
        }
      }
    }
  
    function unsubscribe(event, handler) {
      if (events.hasOwnProperty(event)) {
        const index = events[event].indexOf(handler);
        if (index >= 0) events[event].splice(index, 1);
      }
    }
  
    return { subscribe, publish, unsubscribe };
  })();
  
  /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (pubsub);

/***/ }),

/***/ "./src/render.js":
/*!***********************!*\
  !*** ./src/render.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "render": () => (/* binding */ render)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _makeToDos__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./makeToDos */ "./src/makeToDos.js");
/* harmony import */ var _manageToDos__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manageToDos */ "./src/manageToDos.js");
/* harmony import */ var _manageProjects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./manageProjects */ "./src/manageProjects.js");





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
        const todo = new _makeToDos__WEBPACK_IMPORTED_MODULE_1__["default"]();
        todo.title = formInput.value;
        todo.dueDate = dueDateInput.value;
        todo.priority = priorityInput.value;
        displayElem.textContent='';
        makeListElement();
        _manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.addToDo(todo);
    }
    
    //subscribe to pubsub event
    _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("listChanged",initialLoad);
    makeListElement();
    initialLoad(_manageProjects__WEBPACK_IMPORTED_MODULE_3__.ProjectManager.getCurrentProject().projectTodos);

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
                _manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.updateToDo(todo.index);
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
                _manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.deleteToDo(todo.index);
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
                    _manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.updateToDo(todo.index);
                });
            });

            todolist.appendChild(todoElem);
        });
    }

})();



/***/ }),

/***/ "./src/renderHeader.js":
/*!*****************************!*\
  !*** ./src/renderHeader.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderHeader": () => (/* binding */ renderHeader)
/* harmony export */ });
const renderHeader = (function() {

    const rootElem = document.querySelector('#content');

    const header = document.createElement('div');
    header.classList.add('header');
    rootElem.appendChild(header);

    const heading = document.createElement('h1');
    heading.classList.add('heading');
    heading.textContent = 'Todo List';
    header.appendChild(heading);

    const appBody = document.createElement('div');
    appBody.classList.add('appBody');
    rootElem.appendChild(appBody);
})();



/***/ }),

/***/ "./src/renderProjects.js":
/*!*******************************!*\
  !*** ./src/renderProjects.js ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "renderProjects": () => (/* binding */ renderProjects)
/* harmony export */ });
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");
/* harmony import */ var _makeProject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./makeProject */ "./src/makeProject.js");
/* harmony import */ var _manageProjects__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manageProjects */ "./src/manageProjects.js");




const renderProjects = (()=> {

    const appBody = document.querySelector('.appBody');

    const projectSection = document.createElement('div');
    projectSection.classList.add('projectSection');
    appBody.appendChild(projectSection);

    const newProjectBtn = document.createElement('button');
    newProjectBtn.classList.add('newProjectBtn');
    newProjectBtn.textContent='Add Project';
    projectSection.appendChild(newProjectBtn);

    newProjectBtn.addEventListener('click', makeForm);

    const displayProjects = document.createElement('div');
    displayProjects.classList.add('displayProjects');
    projectSection.appendChild(displayProjects);

    function makeForm() {
        //disabling add project and add todo buttons
        const newTodoBtn = document.querySelector('.newTodoBtn');
        newProjectBtn.setAttribute('disabled','');
        newTodoBtn.setAttribute('disabled','');

        displayProjects.textContent='';
        const newProjectForm = document.createElement('form');
        newProjectForm.setAttribute('id','myForm');
        displayProjects.appendChild(newProjectForm);
        const formInput = document.createElement('input');
        formInput.setAttribute('type','text');
        formInput.setAttribute('id','formInput');
        formInput.setAttribute('required','');
        formInput.setAttribute('placeholder','Name');
        newProjectForm.appendChild(formInput);
        const formButton = document.createElement('button');
        formButton.textContent = 'SUBMIT';
        newProjectForm.appendChild(formButton);

        formButton.addEventListener('click',(e)=> {
            e.preventDefault();
            //re-enabling add project and add todo buttons
            newTodoBtn.removeAttribute('disabled');
            newProjectBtn.removeAttribute('disabled');
            
            addProject();
        });
    }

    function makeListElement() {
        const projectList = document.createElement('div');
        projectList.classList.add('projectList');
        displayProjects.appendChild(projectList);
    }

    function addProject() {
        const project = new _makeProject__WEBPACK_IMPORTED_MODULE_1__["default"]();
        project.name = formInput.value;
        displayProjects.textContent='';
        makeListElement();
        _manageProjects__WEBPACK_IMPORTED_MODULE_2__.ProjectManager.addProject(project);
    }
    //load default project
    (function() {
        makeListElement();
        initialLoad(_manageProjects__WEBPACK_IMPORTED_MODULE_2__.ProjectManager.getProjectList());
    })();

    //subscribe to pubsub event
    _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe('projectsChanged',initialLoad);

    function initialLoad(projectArr) {
        const projectList = document.querySelector('.projectList');
        projectList.textContent='';
        projectArr.forEach((project)=> {
            const projElem = document.createElement('div');
            projElem.classList.add('project');

            const projName = document.createElement('div');
            projName.classList.add('name');
            projName.textContent = project.name;
            projElem.appendChild(projName);

            projName.addEventListener('click',()=> {
                _manageProjects__WEBPACK_IMPORTED_MODULE_2__.ProjectManager.selectProject(project.index);
            })

            const dltBtn = document.createElement('button');
            dltBtn.textContent = 'DELETE';
            dltBtn.setAttribute('class','delete');
            dltBtn.id = project.index;
            projElem.appendChild(dltBtn);

            dltBtn.addEventListener('click', ()=> {
                _manageProjects__WEBPACK_IMPORTED_MODULE_2__.ProjectManager.deleteProject(project.index);
            });

            projectList.appendChild(projElem);
        });
        //disabling delete button of default project
        const defaultDltBtn = document.querySelector('.projectList .project:first-child button[id="0"]');
        defaultDltBtn.setAttribute('disabled','');
    }
    
})();



/***/ }),

/***/ "./src/storage.js":
/*!************************!*\
  !*** ./src/storage.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
const storageManager = (function() {

    function saveToStorage(projects) {
        localStorage.setItem("projects",JSON.stringify(projects));
    }

    function loadFromStorage() {
        let projects = localStorage.getItem("projects");
        return JSON.parse(projects);
    }

    return {saveToStorage,loadFromStorage};
})();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (storageManager);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _renderHeader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderHeader */ "./src/renderHeader.js");
/* harmony import */ var _renderProjects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./renderProjects */ "./src/renderProjects.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./render */ "./src/render.js");







})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QW9CLDBFQUE2QjtBQUNqRCxLQUFLOztBQUVMO0FBQ0EsSUFBSSx5REFBZ0I7O0FBRXBCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQix5RUFBNEI7QUFDNUMsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHlFQUE0QjtBQUM1QyxhQUFhOztBQUViO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FDNUdEOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFZO0FBQ1osQ0FBQzs7QUFFRCxpRUFBZSxjQUFjOzs7Ozs7VUNkN0I7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTjhDO0FBQ0k7QUFDaEIiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbWFrZVByb2plY3QuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21ha2VUb0Rvcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbWFuYWdlUHJvamVjdHMuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21hbmFnZVRvRG9zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9wdWJzdWIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3JlbmRlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcmVuZGVySGVhZGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9yZW5kZXJQcm9qZWN0cy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvc3RvcmFnZS5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbmV3UHJvamVjdChuYW1lKSB7XG4gICAgdGhpcy5uYW1lPW5hbWU7XG4gICAgdGhpcy5pbmRleDtcbiAgICB0aGlzLnByb2plY3RUb2Rvcz1bXTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXdQcm9qZWN0OyIsImZ1bmN0aW9uIG5ld0l0ZW0odGl0bGUsZGVzY3JpcHRpb24sZHVlRGF0ZSxwcmlvcml0eSkge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgdGhpcy5jb21wbGV0ZSA9IGZhbHNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBuZXdJdGVtOyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgbmV3UHJvamVjdCBmcm9tIFwiLi9tYWtlUHJvamVjdFwiO1xuaW1wb3J0IHN0b3JhZ2VNYW5hZ2VyIGZyb20gXCIuL3N0b3JhZ2VcIjtcblxuY29uc3QgUHJvamVjdE1hbmFnZXIgPSAoKCk9PiB7XG4gICAgXG4gICAgbGV0IHByb2plY3RMaXN0O1xuICAgIGxldCBjdXJyZW50UHJvamVjdDtcbiAgICBsZXQgZGVmYXVsdFByb2plY3Q7XG5cbiAgICBpZihsb2NhbFN0b3JhZ2UucHJvamVjdHMpIHtcbiAgICAgICAgcHJvamVjdExpc3QgPSBzdG9yYWdlTWFuYWdlci5sb2FkRnJvbVN0b3JhZ2UoKTtcbiAgICAgICAgZGVmYXVsdFByb2plY3QgPSBwcm9qZWN0TGlzdFswXTtcbiAgICAgICAgY3VycmVudFByb2plY3QgPSBkZWZhdWx0UHJvamVjdDtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcHJvamVjdExpc3QgPSBbXTtcbiAgICAgICAgZGVmYXVsdFByb2plY3QgPSBuZXcgbmV3UHJvamVjdCgnRGVmYXVsdCcpO1xuICAgICAgICBjdXJyZW50UHJvamVjdCA9IGRlZmF1bHRQcm9qZWN0O1xuICAgICAgICBhZGRQcm9qZWN0KGRlZmF1bHRQcm9qZWN0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50UHJvamVjdCgpIHtcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9qZWN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3RMaXN0KCkge1xuICAgICAgICByZXR1cm4gcHJvamVjdExpc3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkUHJvamVjdChuZXdwcm9qKSB7XG4gICAgICAgIG5ld3Byb2ouaW5kZXggPSBwcm9qZWN0TGlzdC5sZW5ndGg7XG4gICAgICAgIHByb2plY3RMaXN0LnB1c2gobmV3cHJvaik7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZWQnLHByb2plY3RMaXN0KTtcbiAgICAgICAgc3RvcmFnZU1hbmFnZXIuc2F2ZVRvU3RvcmFnZShwcm9qZWN0TGlzdCk7XG4gICAgfVxuICAgIC8vY2hlY2sgY29uZGl0aW9uIHdoZW4gZGVmYXVsdCBwcm9qZWN0IGlzIGRlbGV0ZWRcbiAgICAvL29yIG1ha2Ugc3VyZSBkZWZhdWx0IHByb2plY3QgaXMgbmV2ZXIgZGVsZXRlZFxuICAgIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdExpc3QgPSBwcm9qZWN0TGlzdC5maWx0ZXIoKHByb2plY3QpID0+IHByb2plY3QuaW5kZXggIT09IGluZGV4KTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxwcm9qZWN0TGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICBwcm9qZWN0TGlzdFtpXS5pbmRleCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFByb2plY3QgPSBkZWZhdWx0UHJvamVjdDtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgICAgICBwdWJzdWIucHVibGlzaChcInByb2plY3RzQ2hhbmdlZFwiLHByb2plY3RMaXN0KTtcbiAgICAgICAgc3RvcmFnZU1hbmFnZXIuc2F2ZVRvU3RvcmFnZShwcm9qZWN0TGlzdCk7XG4gICB9XG5cbiAgIGZ1bmN0aW9uIHNlbGVjdFByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgY3VycmVudFByb2plY3QgPSBwcm9qZWN0TGlzdFtpbmRleF07XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKCdjdXJyZW50UHJvamVjdENoYW5nZWQnLGN1cnJlbnRQcm9qZWN0KTtcbiAgIH1cblxuICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICBwdWJzdWIuc3Vic2NyaWJlKCdsaXN0Q2hhbmdlZCcsdXBkYXRlQ3VycmVudFByb2plY3QpO1xuXG4gICBmdW5jdGlvbiB1cGRhdGVDdXJyZW50UHJvamVjdChuZXdMaXN0KSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnByb2plY3RUb2RvcyA9IG5ld0xpc3Q7XG4gICAgICAgIHByb2plY3RMaXN0ID0gcHJvamVjdExpc3QubWFwKChwcm9qZWN0KT0+IHByb2plY3QuaW5kZXggPT09IGN1cnJlbnRQcm9qZWN0LmluZGV4ID8gY3VycmVudFByb2plY3Q6IHByb2plY3QpO1xuICAgICAgICBwdWJzdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2VkJyxwcm9qZWN0TGlzdCk7XG4gICAgICAgIHN0b3JhZ2VNYW5hZ2VyLnNhdmVUb1N0b3JhZ2UocHJvamVjdExpc3QpO1xuICAgfVxuXG4gICByZXR1cm4ge2dldFByb2plY3RMaXN0LCBnZXRDdXJyZW50UHJvamVjdCwgYWRkUHJvamVjdCwgZGVsZXRlUHJvamVjdCwgc2VsZWN0UHJvamVjdH07XG59KSgpO1xuXG5leHBvcnQge1Byb2plY3RNYW5hZ2VyfTsiLCJpbXBvcnQgcHVic3ViIGZyb20gXCIuL3B1YnN1YlwiO1xuaW1wb3J0IHsgUHJvamVjdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2VQcm9qZWN0c1wiO1xuXG5jb25zdCBUb0RvTWFuYWdlciA9ICgoKT0+IHtcbiAgICBsZXQgcHJvamVjdCA9IFByb2plY3RNYW5hZ2VyLmdldEN1cnJlbnRQcm9qZWN0KCkucHJvamVjdFRvZG9zO1xuXG4gICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICAgIHB1YnN1Yi5zdWJzY3JpYmUoJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsc2VsZWN0UHJvamVjdCk7XG5cbiAgICAgZnVuY3Rpb24gc2VsZWN0UHJvamVjdChjdXJyZW50UHJvamVjdCkge1xuICAgICAgICAgIHByb2plY3QgPSBjdXJyZW50UHJvamVjdC5wcm9qZWN0VG9kb3M7XG4gICAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2xpc3RDaGFuZ2VkJyxwcm9qZWN0KTtcbiAgICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdCgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvamVjdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gYWRkVG9EbyhuZXdUb0RvKSB7XG4gICAgICAgIG5ld1RvRG8uaW5kZXggPSBwcm9qZWN0Lmxlbmd0aDtcbiAgICAgICAgcHJvamVjdC5wdXNoKG5ld1RvRG8pO1xuICAgICAgICBwdWJzdWIucHVibGlzaChcImxpc3RDaGFuZ2VkXCIscHJvamVjdCk7XG4gICAgfVxuXG4gICBmdW5jdGlvbiBkZWxldGVUb0RvKGluZGV4KSB7XG4gICAgICAgIHByb2plY3QgPSBwcm9qZWN0LmZpbHRlcigodG9kbykgPT4gdG9kby5pbmRleCAhPT0gaW5kZXgpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPHByb2plY3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgcHJvamVjdFtpXS5pbmRleCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJsaXN0Q2hhbmdlZFwiLHByb2plY3QpO1xuICAgfVxuXG4gICBmdW5jdGlvbiB1cGRhdGVUb0RvKGluZGV4KSB7XG4gICAgICAgIHByb2plY3QgPSBwcm9qZWN0Lm1hcCgodG9kbyk9PiB0b2RvLmluZGV4ID09PSBpbmRleCA/IHRvZG8gOiB0b2RvLCk7Ly97aW5kZXg6IHRvZG8uaW5kZXgsIHRpdGxlOiB0b2RvLnRpdGxlLCBjb21wbGV0ZTogdG9kby5jb21wbGV0ZX0gOiB0b2RvLCk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwibGlzdENoYW5nZWRcIixwcm9qZWN0KTtcbiAgIH1cbiAgIHJldHVybiB7Z2V0UHJvamVjdCwgYWRkVG9EbywgZGVsZXRlVG9EbywgdXBkYXRlVG9Eb307XG59KSgpO1xuXG5leHBvcnQge1RvRG9NYW5hZ2VyfTsiLCJjb25zdCBwdWJzdWIgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vIGhvbGRzIGV2ZW50OiBhcnJheW9mY2FsbGJhY2tzIHBhaXJzXG4gICAgY29uc3QgZXZlbnRzID0ge307XG4gIFxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShldmVudCwgaGFuZGxlcikge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIGV2ZW50c1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgICAgIGVsc2UgZXZlbnRzW2V2ZW50XSA9IFtoYW5kbGVyXTtcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIHB1Ymxpc2goZXZlbnQsIGFyZ3MpIHtcbiAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICAgIGZvciAoY29uc3QgaGFuZGxlciBvZiBldmVudHNbZXZlbnRdKSB7XG4gICAgICAgICAgaGFuZGxlcihhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gdW5zdWJzY3JpYmUoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZXZlbnRzW2V2ZW50XS5pbmRleE9mKGhhbmRsZXIpO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCkgZXZlbnRzW2V2ZW50XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgXG4gICAgcmV0dXJuIHsgc3Vic2NyaWJlLCBwdWJsaXNoLCB1bnN1YnNjcmliZSB9O1xuICB9KSgpO1xuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHVic3ViOyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgbmV3SXRlbSBmcm9tIFwiLi9tYWtlVG9Eb3NcIjtcbmltcG9ydCB7IFRvRG9NYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlVG9Eb3NcIjtcbmltcG9ydCB7IFByb2plY3RNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlUHJvamVjdHNcIjtcblxuY29uc3QgcmVuZGVyID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3QgYXBwQm9keSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5hcHBCb2R5Jyk7XG4gICAgXG4gICAgY29uc3QgbmV3VG9Eb0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld1RvRG9CdG4uY2xhc3NMaXN0LmFkZCgnbmV3VG9kb0J0bicpO1xuICAgIG5ld1RvRG9CdG4udGV4dENvbnRlbnQ9J0FkZCBUby1Ebyc7XG5cbiAgICBuZXdUb0RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxtYWtlRm9ybSk7XG5cbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKG5ld1RvRG9CdG4pO1xuXG4gICAgY29uc3QgZGlzcGxheUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXNwbGF5RWxlbS5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5RWxlbScpO1xuICAgIGFwcEJvZHkuYXBwZW5kQ2hpbGQoZGlzcGxheUVsZW0pO1xuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm0oKSB7XG4gICAgICAgIC8vZGlzYWJsaW5nIGFkZCBwcm9qZWN0IGFuZCBhZGQgdG9kbyBidXR0b25zXG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3UHJvamVjdEJ0bicpO1xuICAgICAgICBuZXdQcm9qZWN0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCcnKTtcbiAgICAgICAgbmV3VG9Eb0J0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywnJyk7XG5cbiAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIGNvbnN0IG5ld1RvRG9Gb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBuZXdUb0RvRm9ybS5zZXRBdHRyaWJ1dGUoJ2lkJywnbXlGb3JtJyk7XG4gICAgICAgIGRpc3BsYXlFbGVtLmFwcGVuZENoaWxkKG5ld1RvRG9Gb3JtKTtcbiAgICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ3RleHQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdmb3JtSW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCcnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCdUaXRsZScpO1xuICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtSW5wdXQpO1xuICAgICAgICBjb25zdCBkdWVEYXRlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBkdWVEYXRlSW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywnZGF0ZScpO1xuICAgICAgICBkdWVEYXRlSW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsJ2R1ZURhdGVJbnB1dCcpO1xuICAgICAgICBkdWVEYXRlSW5wdXQuc2V0QXR0cmlidXRlKCdyZXF1aXJlZCcsJycpO1xuICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChkdWVEYXRlSW5wdXQpO1xuICAgICAgICBjb25zdCBwcmlvcml0eUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgcHJpb3JpdHlMYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsJ3ByaW9yaXR5Jyk7XG4gICAgICAgIHByaW9yaXR5TGFiZWwudGV4dENvbnRlbnQ9J1ByaW9yaXR5Oic7XG4gICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKHByaW9yaXR5TGFiZWwpO1xuICAgICAgICBjb25zdCBwcmlvcml0eUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgICAgIHByaW9yaXR5SW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywncHJpb3JpdHknKTtcbiAgICAgICAgcHJpb3JpdHlJbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywncHJpb3JpdHlJbnB1dCcpO1xuICAgICAgICBjb25zdCBvcHRMb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0TG93LnNldEF0dHJpYnV0ZSgndmFsdWUnLCdsb3cnKTtcbiAgICAgICAgb3B0TG93LnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCcnKTtcbiAgICAgICAgb3B0TG93LnRleHRDb250ZW50PSdMb3cnO1xuICAgICAgICBwcmlvcml0eUlucHV0LmFwcGVuZENoaWxkKG9wdExvdyk7XG4gICAgICAgIGNvbnN0IG9wdE1lZGl1bSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRNZWRpdW0uc2V0QXR0cmlidXRlKCd2YWx1ZScsJ21lZGl1bScpO1xuICAgICAgICBvcHRNZWRpdW0udGV4dENvbnRlbnQ9J01lZGl1bSc7XG4gICAgICAgIHByaW9yaXR5SW5wdXQuYXBwZW5kQ2hpbGQob3B0TWVkaXVtKTtcbiAgICAgICAgY29uc3Qgb3B0SGlnaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRIaWdoLnNldEF0dHJpYnV0ZSgndmFsdWUnLCdoaWdoJyk7XG4gICAgICAgIG9wdEhpZ2gudGV4dENvbnRlbnQ9J0hpZ2gnO1xuICAgICAgICBwcmlvcml0eUlucHV0LmFwcGVuZENoaWxkKG9wdEhpZ2gpO1xuICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChwcmlvcml0eUlucHV0KTtcbiAgICAgICAgY29uc3QgZm9ybUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAvL2Zvcm1CdXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywnc3VibWl0Jyk7XG4gICAgICAgIGZvcm1CdXR0b24udGV4dENvbnRlbnQgPSAnU1VCTUlUJztcbiAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUJ1dHRvbik7XG5cbiAgICAgICAgZm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vcmUtZW5hYmxpbmcgYWRkIHByb2plY3QgYW5kIHRvZG8gYnV0dG9uc1xuICAgICAgICAgICAgbmV3UHJvamVjdEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICBuZXdUb0RvQnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWRkSXRlbSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTGlzdEVsZW1lbnQoKSB7XG4gICAgICAgIGNvbnN0IHRvZG9saXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRvZG9saXN0LmNsYXNzTGlzdC5hZGQoJ3RvZG9saXN0Jyk7XG4gICAgICAgIGRpc3BsYXlFbGVtLmFwcGVuZENoaWxkKHRvZG9saXN0KTtcbiAgICB9XG5cblxuICAgIGZ1bmN0aW9uIGFkZEl0ZW0oKSB7XG4gICAgICAgIGNvbnN0IHRvZG8gPSBuZXcgbmV3SXRlbSgpO1xuICAgICAgICB0b2RvLnRpdGxlID0gZm9ybUlucHV0LnZhbHVlO1xuICAgICAgICB0b2RvLmR1ZURhdGUgPSBkdWVEYXRlSW5wdXQudmFsdWU7XG4gICAgICAgIHRvZG8ucHJpb3JpdHkgPSBwcmlvcml0eUlucHV0LnZhbHVlO1xuICAgICAgICBkaXNwbGF5RWxlbS50ZXh0Q29udGVudD0nJztcbiAgICAgICAgbWFrZUxpc3RFbGVtZW50KCk7XG4gICAgICAgIFRvRG9NYW5hZ2VyLmFkZFRvRG8odG9kbyk7XG4gICAgfVxuICAgIFxuICAgIC8vc3Vic2NyaWJlIHRvIHB1YnN1YiBldmVudFxuICAgIHB1YnN1Yi5zdWJzY3JpYmUoXCJsaXN0Q2hhbmdlZFwiLGluaXRpYWxMb2FkKTtcbiAgICBtYWtlTGlzdEVsZW1lbnQoKTtcbiAgICBpbml0aWFsTG9hZChQcm9qZWN0TWFuYWdlci5nZXRDdXJyZW50UHJvamVjdCgpLnByb2plY3RUb2Rvcyk7XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsTG9hZChsaXN0KSB7XG4gICAgICAgIGNvbnN0IHRvZG9saXN0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RvbGlzdCcpO1xuICAgICAgICB0b2RvbGlzdC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBsaXN0LmZvckVhY2goKHRvZG8pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG9FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0b2RvRWxlbS5jbGFzc0xpc3QuYWRkKCd0b2RvJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgIGNoZWNrQm94LnNldEF0dHJpYnV0ZSgndHlwZScsJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICBjaGVja0JveC5jbGFzc0xpc3QuYWRkKCdjaGVja0JveCcpO1xuICAgICAgICAgICAgaWYodG9kby5jb21wbGV0ZSlcbiAgICAgICAgICAgICAgICBjaGVja0JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvZG9FbGVtLmFwcGVuZENoaWxkKGNoZWNrQm94KTtcblxuICAgICAgICAgICAgY2hlY2tCb3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCk9PntcbiAgICAgICAgICAgICAgICB0b2RvLmNvbXBsZXRlID0gIXRvZG8uY29tcGxldGU7XG4gICAgICAgICAgICAgICAgVG9Eb01hbmFnZXIudXBkYXRlVG9Ebyh0b2RvLmluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0b2RvVGl0bGUgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0b2RvVGl0bGUuY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgICAgICAgICAgIHRvZG9UaXRsZS50ZXh0Q29udGVudCA9IHRvZG8udGl0bGU7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZCh0b2RvVGl0bGUpO1xuXG4gICAgICAgICAgICBjb25zdCB0b2RvRHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdG9kb0R1ZURhdGUuY2xhc3NMaXN0LmFkZCgnZHVlRGF0ZScpO1xuICAgICAgICAgICAgdG9kb0R1ZURhdGUudGV4dENvbnRlbnQgPSB0b2RvLmR1ZURhdGU7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZCh0b2RvRHVlRGF0ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRsdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgZGx0QnRuLnRleHRDb250ZW50ID0gJ0RFTEVURSc7XG4gICAgICAgICAgICBkbHRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsJ2RlbGV0ZScpO1xuICAgICAgICAgICAgZGx0QnRuLmlkID0gdG9kby5pbmRleDtcbiAgICAgICAgICAgIHRvZG9FbGVtLmFwcGVuZENoaWxkKGRsdEJ0bik7XG5cbiAgICAgICAgICAgIGRsdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PiB7XG4gICAgICAgICAgICAgICAgVG9Eb01hbmFnZXIuZGVsZXRlVG9Ebyh0b2RvLmluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICBlZGl0QnRuLnRleHRDb250ZW50ID0gJ0VESVQnO1xuICAgICAgICAgICAgZWRpdEJ0bi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnZWRpdCcpO1xuICAgICAgICAgICAgZWRpdEJ0bi5pZCA9IHRvZG8uaW5kZXg7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZChlZGl0QnRuKTtcblxuICAgICAgICAgICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VG9Eb0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uc2V0QXR0cmlidXRlKCdpZCcsJ215Rm9ybScpO1xuICAgICAgICAgICAgICAgIGRpc3BsYXlFbGVtLmFwcGVuZENoaWxkKG5ld1RvRG9Gb3JtKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCd0ZXh0Jyk7XG4gICAgICAgICAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdmb3JtSW5wdXQnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdyZXF1aXJlZCcsJycpO1xuICAgICAgICAgICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywnVGl0bGUnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQudmFsdWU9dG9kby50aXRsZTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtSW5wdXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGR1ZURhdGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgZHVlRGF0ZUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ2RhdGUnKTtcbiAgICAgICAgICAgICAgICBkdWVEYXRlSW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsJ2R1ZURhdGVJbnB1dCcpO1xuICAgICAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgICAgICAgICAgZHVlRGF0ZUlucHV0LnZhbHVlPXRvZG8uZHVlRGF0ZTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChkdWVEYXRlSW5wdXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5TGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCdwcmlvcml0eScpO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5TGFiZWwudGV4dENvbnRlbnQ9J1ByaW9yaXR5Oic7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQocHJpb3JpdHlMYWJlbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpb3JpdHlJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5SW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywncHJpb3JpdHknKTtcbiAgICAgICAgICAgICAgICBwcmlvcml0eUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdwcmlvcml0eUlucHV0Jyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0TG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0TG93LnNldEF0dHJpYnV0ZSgndmFsdWUnLCdsb3cnKTtcbiAgICAgICAgICAgICAgICBvcHRMb3cuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsJycpO1xuICAgICAgICAgICAgICAgIG9wdExvdy50ZXh0Q29udGVudD0nTG93JztcbiAgICAgICAgICAgICAgICBwcmlvcml0eUlucHV0LmFwcGVuZENoaWxkKG9wdExvdyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0TWVkaXVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0TWVkaXVtLnNldEF0dHJpYnV0ZSgndmFsdWUnLCdtZWRpdW0nKTtcbiAgICAgICAgICAgICAgICBvcHRNZWRpdW0udGV4dENvbnRlbnQ9J01lZGl1bSc7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRNZWRpdW0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdEhpZ2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICBvcHRIaWdoLnNldEF0dHJpYnV0ZSgndmFsdWUnLCdoaWdoJyk7XG4gICAgICAgICAgICAgICAgb3B0SGlnaC50ZXh0Q29udGVudD0nSGlnaCc7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRIaWdoKTtcbiAgICAgICAgICAgICAgICBwcmlvcml0eUlucHV0LnZhbHVlID0gdG9kby5wcmlvcml0eTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChwcmlvcml0eUlucHV0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgLy9mb3JtQnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgIGZvcm1CdXR0b24udGV4dENvbnRlbnQgPSAnU1VCTUlUJztcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtQnV0dG9uKTtcblxuICAgICAgICAgICAgICAgIGZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdG9kby50aXRsZSA9IGZvcm1JbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdG9kby5kdWVEYXRlID0gZHVlRGF0ZUlucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0b2RvLnByaW9yaXR5ID0gcHJpb3JpdHlJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgICAgICAgICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICBUb0RvTWFuYWdlci51cGRhdGVUb0RvKHRvZG8uaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRvZG9saXN0LmFwcGVuZENoaWxkKHRvZG9FbGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQge3JlbmRlcn07IiwiY29uc3QgcmVuZGVySGVhZGVyID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3Qgcm9vdEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xuXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcicpO1xuICAgIHJvb3RFbGVtLmFwcGVuZENoaWxkKGhlYWRlcik7XG5cbiAgICBjb25zdCBoZWFkaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICBoZWFkaW5nLmNsYXNzTGlzdC5hZGQoJ2hlYWRpbmcnKTtcbiAgICBoZWFkaW5nLnRleHRDb250ZW50ID0gJ1RvZG8gTGlzdCc7XG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKGhlYWRpbmcpO1xuXG4gICAgY29uc3QgYXBwQm9keSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGFwcEJvZHkuY2xhc3NMaXN0LmFkZCgnYXBwQm9keScpO1xuICAgIHJvb3RFbGVtLmFwcGVuZENoaWxkKGFwcEJvZHkpO1xufSkoKTtcblxuZXhwb3J0IHtyZW5kZXJIZWFkZXJ9OyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgbmV3UHJvamVjdCBmcm9tIFwiLi9tYWtlUHJvamVjdFwiO1xuaW1wb3J0IHsgUHJvamVjdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2VQcm9qZWN0c1wiO1xuXG5jb25zdCByZW5kZXJQcm9qZWN0cyA9ICgoKT0+IHtcblxuICAgIGNvbnN0IGFwcEJvZHkgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuYXBwQm9keScpO1xuXG4gICAgY29uc3QgcHJvamVjdFNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBwcm9qZWN0U2VjdGlvbi5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0U2VjdGlvbicpO1xuICAgIGFwcEJvZHkuYXBwZW5kQ2hpbGQocHJvamVjdFNlY3Rpb24pO1xuXG4gICAgY29uc3QgbmV3UHJvamVjdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld1Byb2plY3RCdG4uY2xhc3NMaXN0LmFkZCgnbmV3UHJvamVjdEJ0bicpO1xuICAgIG5ld1Byb2plY3RCdG4udGV4dENvbnRlbnQ9J0FkZCBQcm9qZWN0JztcbiAgICBwcm9qZWN0U2VjdGlvbi5hcHBlbmRDaGlsZChuZXdQcm9qZWN0QnRuKTtcblxuICAgIG5ld1Byb2plY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtYWtlRm9ybSk7XG5cbiAgICBjb25zdCBkaXNwbGF5UHJvamVjdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXNwbGF5UHJvamVjdHMuY2xhc3NMaXN0LmFkZCgnZGlzcGxheVByb2plY3RzJyk7XG4gICAgcHJvamVjdFNlY3Rpb24uYXBwZW5kQ2hpbGQoZGlzcGxheVByb2plY3RzKTtcblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtKCkge1xuICAgICAgICAvL2Rpc2FibGluZyBhZGQgcHJvamVjdCBhbmQgYWRkIHRvZG8gYnV0dG9uc1xuICAgICAgICBjb25zdCBuZXdUb2RvQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ld1RvZG9CdG4nKTtcbiAgICAgICAgbmV3UHJvamVjdEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywnJyk7XG4gICAgICAgIG5ld1RvZG9CdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsJycpO1xuXG4gICAgICAgIGRpc3BsYXlQcm9qZWN0cy50ZXh0Q29udGVudD0nJztcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIG5ld1Byb2plY3RGb3JtLnNldEF0dHJpYnV0ZSgnaWQnLCdteUZvcm0nKTtcbiAgICAgICAgZGlzcGxheVByb2plY3RzLmFwcGVuZENoaWxkKG5ld1Byb2plY3RGb3JtKTtcbiAgICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ3RleHQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdmb3JtSW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCcnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncGxhY2Vob2xkZXInLCdOYW1lJyk7XG4gICAgICAgIG5ld1Byb2plY3RGb3JtLmFwcGVuZENoaWxkKGZvcm1JbnB1dCk7XG4gICAgICAgIGNvbnN0IGZvcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZm9ybUJ1dHRvbi50ZXh0Q29udGVudCA9ICdTVUJNSVQnO1xuICAgICAgICBuZXdQcm9qZWN0Rm9ybS5hcHBlbmRDaGlsZChmb3JtQnV0dG9uKTtcblxuICAgICAgICBmb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvL3JlLWVuYWJsaW5nIGFkZCBwcm9qZWN0IGFuZCBhZGQgdG9kbyBidXR0b25zXG4gICAgICAgICAgICBuZXdUb2RvQnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIG5ld1Byb2plY3RCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZGRQcm9qZWN0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaXN0RWxlbWVudCgpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcHJvamVjdExpc3QuY2xhc3NMaXN0LmFkZCgncHJvamVjdExpc3QnKTtcbiAgICAgICAgZGlzcGxheVByb2plY3RzLmFwcGVuZENoaWxkKHByb2plY3RMaXN0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQcm9qZWN0KCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gbmV3IG5ld1Byb2plY3QoKTtcbiAgICAgICAgcHJvamVjdC5uYW1lID0gZm9ybUlucHV0LnZhbHVlO1xuICAgICAgICBkaXNwbGF5UHJvamVjdHMudGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICBQcm9qZWN0TWFuYWdlci5hZGRQcm9qZWN0KHByb2plY3QpO1xuICAgIH1cbiAgICAvL2xvYWQgZGVmYXVsdCBwcm9qZWN0XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBtYWtlTGlzdEVsZW1lbnQoKTtcbiAgICAgICAgaW5pdGlhbExvYWQoUHJvamVjdE1hbmFnZXIuZ2V0UHJvamVjdExpc3QoKSk7XG4gICAgfSkoKTtcblxuICAgIC8vc3Vic2NyaWJlIHRvIHB1YnN1YiBldmVudFxuICAgIHB1YnN1Yi5zdWJzY3JpYmUoJ3Byb2plY3RzQ2hhbmdlZCcsaW5pdGlhbExvYWQpO1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbExvYWQocHJvamVjdEFycikge1xuICAgICAgICBjb25zdCBwcm9qZWN0TGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0TGlzdCcpO1xuICAgICAgICBwcm9qZWN0TGlzdC50ZXh0Q29udGVudD0nJztcbiAgICAgICAgcHJvamVjdEFyci5mb3JFYWNoKChwcm9qZWN0KT0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb2pFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwcm9qRWxlbS5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0Jyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2pOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwcm9qTmFtZS5jbGFzc0xpc3QuYWRkKCduYW1lJyk7XG4gICAgICAgICAgICBwcm9qTmFtZS50ZXh0Q29udGVudCA9IHByb2plY3QubmFtZTtcbiAgICAgICAgICAgIHByb2pFbGVtLmFwcGVuZENoaWxkKHByb2pOYW1lKTtcblxuICAgICAgICAgICAgcHJvak5hbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT4ge1xuICAgICAgICAgICAgICAgIFByb2plY3RNYW5hZ2VyLnNlbGVjdFByb2plY3QocHJvamVjdC5pbmRleCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBkbHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGRsdEJ0bi50ZXh0Q29udGVudCA9ICdERUxFVEUnO1xuICAgICAgICAgICAgZGx0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdkZWxldGUnKTtcbiAgICAgICAgICAgIGRsdEJ0bi5pZCA9IHByb2plY3QuaW5kZXg7XG4gICAgICAgICAgICBwcm9qRWxlbS5hcHBlbmRDaGlsZChkbHRCdG4pO1xuXG4gICAgICAgICAgICBkbHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+IHtcbiAgICAgICAgICAgICAgICBQcm9qZWN0TWFuYWdlci5kZWxldGVQcm9qZWN0KHByb2plY3QuaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb2plY3RMaXN0LmFwcGVuZENoaWxkKHByb2pFbGVtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vZGlzYWJsaW5nIGRlbGV0ZSBidXR0b24gb2YgZGVmYXVsdCBwcm9qZWN0XG4gICAgICAgIGNvbnN0IGRlZmF1bHREbHRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdExpc3QgLnByb2plY3Q6Zmlyc3QtY2hpbGQgYnV0dG9uW2lkPVwiMFwiXScpO1xuICAgICAgICBkZWZhdWx0RGx0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCcnKTtcbiAgICB9XG4gICAgXG59KSgpO1xuXG5leHBvcnQge3JlbmRlclByb2plY3RzfTsiLCJjb25zdCBzdG9yYWdlTWFuYWdlciA9IChmdW5jdGlvbigpIHtcblxuICAgIGZ1bmN0aW9uIHNhdmVUb1N0b3JhZ2UocHJvamVjdHMpIHtcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJwcm9qZWN0c1wiLEpTT04uc3RyaW5naWZ5KHByb2plY3RzKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZEZyb21TdG9yYWdlKCkge1xuICAgICAgICBsZXQgcHJvamVjdHMgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInByb2plY3RzXCIpO1xuICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShwcm9qZWN0cyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtzYXZlVG9TdG9yYWdlLGxvYWRGcm9tU3RvcmFnZX07XG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCBzdG9yYWdlTWFuYWdlcjsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHJlbmRlckhlYWRlciB9IGZyb20gXCIuL3JlbmRlckhlYWRlclwiO1xuaW1wb3J0IHsgcmVuZGVyUHJvamVjdHMgfSBmcm9tIFwiLi9yZW5kZXJQcm9qZWN0c1wiO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSBcIi4vcmVuZGVyXCI7XG5cblxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=