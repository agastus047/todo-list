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



const ProjectManager = (()=> {
    let projectList = [];

    let defaultProject = new _makeProject__WEBPACK_IMPORTED_MODULE_1__["default"]('Default');

    let currentProject = defaultProject;
    addProject(defaultProject);

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
    }
    //check condition when current project is deleted
    //or make sure current project is never deleted
    function deleteProject(index) {
        projectList = projectList.filter((project) => project.index !== index);
        for(let i=0;i<projectList.length;i++){
          projectList[i].index = i;
        }
        currentProject = defaultProject;
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('currentProjectChanged',currentProject);
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish("projectsChanged",projectList);
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
        _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].publish('projectsChanged',projectList)

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




const render = (function() {

    const rootElem = document.querySelector('#content');
    
    const newToDoBtn = document.createElement('button');
    newToDoBtn.classList.add('newTodoBtn');
    newToDoBtn.textContent='Add To-Do';

    newToDoBtn.addEventListener('click',makeForm);

    const header = document.querySelector('.header');
    header.appendChild(newToDoBtn);

    const displayElem = document.createElement('div');
    displayElem.classList.add('displayElem');
    rootElem.appendChild(displayElem);

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
/* harmony import */ var _makeProject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./makeProject */ "./src/makeProject.js");
/* harmony import */ var _manageProjects__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./manageProjects */ "./src/manageProjects.js");
/* harmony import */ var _pubsub__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./pubsub */ "./src/pubsub.js");




const renderProjects = (()=> {

    const rootElem = document.querySelector('#content');

    const projectSection = document.createElement('div');
    projectSection.classList.add('projectSection');
    rootElem.appendChild(projectSection);

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
        const project = new _makeProject__WEBPACK_IMPORTED_MODULE_0__["default"]();
        project.name = formInput.value;
        displayProjects.textContent='';
        makeListElement();
        _manageProjects__WEBPACK_IMPORTED_MODULE_1__.ProjectManager.addProject(project);
    }
    //load default project
    (function() {
        makeListElement();
        initialLoad(_manageProjects__WEBPACK_IMPORTED_MODULE_1__.ProjectManager.getProjectList());
    })();

    //subscribe to pubsub event
    _pubsub__WEBPACK_IMPORTED_MODULE_2__["default"].subscribe('projectsChanged',initialLoad);

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
                _manageProjects__WEBPACK_IMPORTED_MODULE_1__.ProjectManager.selectProject(project.index);
            })

            const dltBtn = document.createElement('button');
            dltBtn.textContent = 'DELETE';
            dltBtn.setAttribute('class','delete');
            dltBtn.id = project.index;
            projElem.appendChild(dltBtn);

            dltBtn.addEventListener('click', ()=> {
                _manageProjects__WEBPACK_IMPORTED_MODULE_1__.ProjectManager.deleteProject(project.index);
            });

            projectList.appendChild(projElem);
        });
        //disabling delete button of default project
        const defaultDltBtn = document.querySelector('.projectList .project:first-child button[id="0"]');
        defaultDltBtn.setAttribute('disabled','');
    }
    
})();



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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFhOztBQUViO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7OztVQzVHRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7Ozs7QUNOOEM7QUFDSTtBQUNoQiIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYWtlUHJvamVjdC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbWFrZVRvRG9zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYW5hZ2VQcm9qZWN0cy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbWFuYWdlVG9Eb3MuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3B1YnN1Yi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcmVuZGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9yZW5kZXJIZWFkZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3JlbmRlclByb2plY3RzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBuZXdQcm9qZWN0KG5hbWUpIHtcbiAgICB0aGlzLm5hbWU9bmFtZTtcbiAgICB0aGlzLmluZGV4O1xuICAgIHRoaXMucHJvamVjdFRvZG9zPVtdO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ld1Byb2plY3Q7IiwiZnVuY3Rpb24gbmV3SXRlbSh0aXRsZSxkZXNjcmlwdGlvbixkdWVEYXRlLHByaW9yaXR5KSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLmNvbXBsZXRlID0gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ld0l0ZW07IiwiaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCBuZXdQcm9qZWN0IGZyb20gXCIuL21ha2VQcm9qZWN0XCI7XG5cbmNvbnN0IFByb2plY3RNYW5hZ2VyID0gKCgpPT4ge1xuICAgIGxldCBwcm9qZWN0TGlzdCA9IFtdO1xuXG4gICAgbGV0IGRlZmF1bHRQcm9qZWN0ID0gbmV3IG5ld1Byb2plY3QoJ0RlZmF1bHQnKTtcblxuICAgIGxldCBjdXJyZW50UHJvamVjdCA9IGRlZmF1bHRQcm9qZWN0O1xuICAgIGFkZFByb2plY3QoZGVmYXVsdFByb2plY3QpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFByb2plY3QoKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50UHJvamVjdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHByb2plY3RMaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb2plY3QobmV3cHJvaikge1xuICAgICAgICBuZXdwcm9qLmluZGV4ID0gcHJvamVjdExpc3QubGVuZ3RoO1xuICAgICAgICBwcm9qZWN0TGlzdC5wdXNoKG5ld3Byb2opO1xuICAgICAgICBwdWJzdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2VkJyxwcm9qZWN0TGlzdCk7XG4gICAgfVxuICAgIC8vY2hlY2sgY29uZGl0aW9uIHdoZW4gY3VycmVudCBwcm9qZWN0IGlzIGRlbGV0ZWRcbiAgICAvL29yIG1ha2Ugc3VyZSBjdXJyZW50IHByb2plY3QgaXMgbmV2ZXIgZGVsZXRlZFxuICAgIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdExpc3QgPSBwcm9qZWN0TGlzdC5maWx0ZXIoKHByb2plY3QpID0+IHByb2plY3QuaW5kZXggIT09IGluZGV4KTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxwcm9qZWN0TGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICBwcm9qZWN0TGlzdFtpXS5pbmRleCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFByb2plY3QgPSBkZWZhdWx0UHJvamVjdDtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgICAgICBwdWJzdWIucHVibGlzaChcInByb2plY3RzQ2hhbmdlZFwiLHByb2plY3RMaXN0KTtcbiAgIH1cblxuICAgZnVuY3Rpb24gc2VsZWN0UHJvamVjdChpbmRleCkge1xuICAgICAgICBjdXJyZW50UHJvamVjdCA9IHByb2plY3RMaXN0W2luZGV4XTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgfVxuXG4gICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgIHB1YnN1Yi5zdWJzY3JpYmUoJ2xpc3RDaGFuZ2VkJyx1cGRhdGVDdXJyZW50UHJvamVjdCk7XG5cbiAgIGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnRQcm9qZWN0KG5ld0xpc3QpIHtcbiAgICAgICAgY3VycmVudFByb2plY3QucHJvamVjdFRvZG9zID0gbmV3TGlzdDtcbiAgICAgICAgcHJvamVjdExpc3QgPSBwcm9qZWN0TGlzdC5tYXAoKHByb2plY3QpPT4gcHJvamVjdC5pbmRleCA9PT0gY3VycmVudFByb2plY3QuaW5kZXggPyBjdXJyZW50UHJvamVjdDogcHJvamVjdCk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZWQnLHByb2plY3RMaXN0KVxuXG4gICB9XG5cbiAgIHJldHVybiB7Z2V0UHJvamVjdExpc3QsIGdldEN1cnJlbnRQcm9qZWN0LCBhZGRQcm9qZWN0LCBkZWxldGVQcm9qZWN0LCBzZWxlY3RQcm9qZWN0fTtcbn0pKCk7XG5cbmV4cG9ydCB7UHJvamVjdE1hbmFnZXJ9OyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgeyBQcm9qZWN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZVByb2plY3RzXCI7XG5cbmNvbnN0IFRvRG9NYW5hZ2VyID0gKCgpPT4ge1xuICAgIGxldCBwcm9qZWN0ID0gUHJvamVjdE1hbmFnZXIuZ2V0Q3VycmVudFByb2plY3QoKS5wcm9qZWN0VG9kb3M7XG5cbiAgICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgICAgcHVic3ViLnN1YnNjcmliZSgnY3VycmVudFByb2plY3RDaGFuZ2VkJyxzZWxlY3RQcm9qZWN0KTtcblxuICAgICBmdW5jdGlvbiBzZWxlY3RQcm9qZWN0KGN1cnJlbnRQcm9qZWN0KSB7XG4gICAgICAgICAgcHJvamVjdCA9IGN1cnJlbnRQcm9qZWN0LnByb2plY3RUb2RvcztcbiAgICAgICAgICBwdWJzdWIucHVibGlzaCgnbGlzdENoYW5nZWQnLHByb2plY3QpO1xuICAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICAgIHJldHVybiBwcm9qZWN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRUb0RvKG5ld1RvRG8pIHtcbiAgICAgICAgbmV3VG9Eby5pbmRleCA9IHByb2plY3QubGVuZ3RoO1xuICAgICAgICBwcm9qZWN0LnB1c2gobmV3VG9Ebyk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwibGlzdENoYW5nZWRcIixwcm9qZWN0KTtcbiAgICB9XG5cbiAgIGZ1bmN0aW9uIGRlbGV0ZVRvRG8oaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdCA9IHByb2plY3QuZmlsdGVyKCh0b2RvKSA9PiB0b2RvLmluZGV4ICE9PSBpbmRleCk7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8cHJvamVjdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICBwcm9qZWN0W2ldLmluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgICAgICBwdWJzdWIucHVibGlzaChcImxpc3RDaGFuZ2VkXCIscHJvamVjdCk7XG4gICB9XG5cbiAgIGZ1bmN0aW9uIHVwZGF0ZVRvRG8oaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdCA9IHByb2plY3QubWFwKCh0b2RvKT0+IHRvZG8uaW5kZXggPT09IGluZGV4ID8gdG9kbyA6IHRvZG8sKTsvL3tpbmRleDogdG9kby5pbmRleCwgdGl0bGU6IHRvZG8udGl0bGUsIGNvbXBsZXRlOiB0b2RvLmNvbXBsZXRlfSA6IHRvZG8sKTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJsaXN0Q2hhbmdlZFwiLHByb2plY3QpO1xuICAgfVxuICAgcmV0dXJuIHtnZXRQcm9qZWN0LCBhZGRUb0RvLCBkZWxldGVUb0RvLCB1cGRhdGVUb0RvfTtcbn0pKCk7XG5cbmV4cG9ydCB7VG9Eb01hbmFnZXJ9OyIsImNvbnN0IHB1YnN1YiA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gaG9sZHMgZXZlbnQ6IGFycmF5b2ZjYWxsYmFja3MgcGFpcnNcbiAgICBjb25zdCBldmVudHMgPSB7fTtcbiAgXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkgZXZlbnRzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuICAgICAgZWxzZSBldmVudHNbZXZlbnRdID0gW2hhbmRsZXJdO1xuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gcHVibGlzaChldmVudCwgYXJncykge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBoYW5kbGVyIG9mIGV2ZW50c1tldmVudF0pIHtcbiAgICAgICAgICBoYW5kbGVyKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiB1bnN1YnNjcmliZShldmVudCwgaGFuZGxlcikge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBldmVudHNbZXZlbnRdLmluZGV4T2YoaGFuZGxlcik7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSBldmVudHNbZXZlbnRdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICBcbiAgICByZXR1cm4geyBzdWJzY3JpYmUsIHB1Ymxpc2gsIHVuc3Vic2NyaWJlIH07XG4gIH0pKCk7XG4gIFxuICBleHBvcnQgZGVmYXVsdCBwdWJzdWI7IiwiaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCBuZXdJdGVtIGZyb20gXCIuL21ha2VUb0Rvc1wiO1xuaW1wb3J0IHsgVG9Eb01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2VUb0Rvc1wiO1xuXG5jb25zdCByZW5kZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCByb290RWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50Jyk7XG4gICAgXG4gICAgY29uc3QgbmV3VG9Eb0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld1RvRG9CdG4uY2xhc3NMaXN0LmFkZCgnbmV3VG9kb0J0bicpO1xuICAgIG5ld1RvRG9CdG4udGV4dENvbnRlbnQ9J0FkZCBUby1Ebyc7XG5cbiAgICBuZXdUb0RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxtYWtlRm9ybSk7XG5cbiAgICBjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyJyk7XG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKG5ld1RvRG9CdG4pO1xuXG4gICAgY29uc3QgZGlzcGxheUVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXNwbGF5RWxlbS5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5RWxlbScpO1xuICAgIHJvb3RFbGVtLmFwcGVuZENoaWxkKGRpc3BsYXlFbGVtKTtcblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtKCkge1xuICAgICAgICAvL2Rpc2FibGluZyBhZGQgcHJvamVjdCBhbmQgYWRkIHRvZG8gYnV0dG9uc1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm5ld1Byb2plY3RCdG4nKTtcbiAgICAgICAgbmV3UHJvamVjdEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywnJyk7XG4gICAgICAgIG5ld1RvRG9CdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsJycpO1xuXG4gICAgICAgIGRpc3BsYXlFbGVtLnRleHRDb250ZW50PScnO1xuICAgICAgICBjb25zdCBuZXdUb0RvRm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbmV3VG9Eb0Zvcm0uc2V0QXR0cmlidXRlKCdpZCcsJ215Rm9ybScpO1xuICAgICAgICBkaXNwbGF5RWxlbS5hcHBlbmRDaGlsZChuZXdUb0RvRm9ybSk7XG4gICAgICAgIGNvbnN0IGZvcm1JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCd0ZXh0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywnZm9ybUlucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywnVGl0bGUnKTtcbiAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUlucHV0KTtcbiAgICAgICAgY29uc3QgZHVlRGF0ZUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgZHVlRGF0ZUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ2RhdGUnKTtcbiAgICAgICAgZHVlRGF0ZUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdkdWVEYXRlSW5wdXQnKTtcbiAgICAgICAgZHVlRGF0ZUlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCcnKTtcbiAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZHVlRGF0ZUlucHV0KTtcbiAgICAgICAgY29uc3QgcHJpb3JpdHlMYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xhYmVsJyk7XG4gICAgICAgIHByaW9yaXR5TGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCdwcmlvcml0eScpO1xuICAgICAgICBwcmlvcml0eUxhYmVsLnRleHRDb250ZW50PSdQcmlvcml0eTonO1xuICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChwcmlvcml0eUxhYmVsKTtcbiAgICAgICAgY29uc3QgcHJpb3JpdHlJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgICBwcmlvcml0eUlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsJ3ByaW9yaXR5Jyk7XG4gICAgICAgIHByaW9yaXR5SW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsJ3ByaW9yaXR5SW5wdXQnKTtcbiAgICAgICAgY29uc3Qgb3B0TG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdExvdy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywnbG93Jyk7XG4gICAgICAgIG9wdExvdy5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywnJyk7XG4gICAgICAgIG9wdExvdy50ZXh0Q29udGVudD0nTG93JztcbiAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRMb3cpO1xuICAgICAgICBjb25zdCBvcHRNZWRpdW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0TWVkaXVtLnNldEF0dHJpYnV0ZSgndmFsdWUnLCdtZWRpdW0nKTtcbiAgICAgICAgb3B0TWVkaXVtLnRleHRDb250ZW50PSdNZWRpdW0nO1xuICAgICAgICBwcmlvcml0eUlucHV0LmFwcGVuZENoaWxkKG9wdE1lZGl1bSk7XG4gICAgICAgIGNvbnN0IG9wdEhpZ2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgb3B0SGlnaC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywnaGlnaCcpO1xuICAgICAgICBvcHRIaWdoLnRleHRDb250ZW50PSdIaWdoJztcbiAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRIaWdoKTtcbiAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQocHJpb3JpdHlJbnB1dCk7XG4gICAgICAgIGNvbnN0IGZvcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgLy9mb3JtQnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgICAgICBmb3JtQnV0dG9uLnRleHRDb250ZW50ID0gJ1NVQk1JVCc7XG4gICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKGZvcm1CdXR0b24pO1xuXG4gICAgICAgIGZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvL3JlLWVuYWJsaW5nIGFkZCBwcm9qZWN0IGFuZCB0b2RvIGJ1dHRvbnNcbiAgICAgICAgICAgIG5ld1Byb2plY3RCdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgbmV3VG9Eb0J0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFkZEl0ZW0oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUxpc3RFbGVtZW50KCkge1xuICAgICAgICBjb25zdCB0b2RvbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0b2RvbGlzdC5jbGFzc0xpc3QuYWRkKCd0b2RvbGlzdCcpO1xuICAgICAgICBkaXNwbGF5RWxlbS5hcHBlbmRDaGlsZCh0b2RvbGlzdCk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBhZGRJdGVtKCkge1xuICAgICAgICBjb25zdCB0b2RvID0gbmV3IG5ld0l0ZW0oKTtcbiAgICAgICAgdG9kby50aXRsZSA9IGZvcm1JbnB1dC52YWx1ZTtcbiAgICAgICAgdG9kby5kdWVEYXRlID0gZHVlRGF0ZUlucHV0LnZhbHVlO1xuICAgICAgICB0b2RvLnByaW9yaXR5ID0gcHJpb3JpdHlJbnB1dC52YWx1ZTtcbiAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICBUb0RvTWFuYWdlci5hZGRUb0RvKHRvZG8pO1xuICAgIH1cbiAgICBcbiAgICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgICBwdWJzdWIuc3Vic2NyaWJlKFwibGlzdENoYW5nZWRcIixpbml0aWFsTG9hZCk7XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsTG9hZChsaXN0KSB7XG4gICAgICAgIGNvbnN0IHRvZG9saXN0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RvbGlzdCcpO1xuICAgICAgICB0b2RvbGlzdC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBsaXN0LmZvckVhY2goKHRvZG8pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG9FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0b2RvRWxlbS5jbGFzc0xpc3QuYWRkKCd0b2RvJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgIGNoZWNrQm94LnNldEF0dHJpYnV0ZSgndHlwZScsJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICBjaGVja0JveC5jbGFzc0xpc3QuYWRkKCdjaGVja0JveCcpO1xuICAgICAgICAgICAgaWYodG9kby5jb21wbGV0ZSlcbiAgICAgICAgICAgICAgICBjaGVja0JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvZG9FbGVtLmFwcGVuZENoaWxkKGNoZWNrQm94KTtcblxuICAgICAgICAgICAgY2hlY2tCb3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCk9PntcbiAgICAgICAgICAgICAgICB0b2RvLmNvbXBsZXRlID0gIXRvZG8uY29tcGxldGU7XG4gICAgICAgICAgICAgICAgVG9Eb01hbmFnZXIudXBkYXRlVG9Ebyh0b2RvLmluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0b2RvVGl0bGUgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0b2RvVGl0bGUuY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgICAgICAgICAgIHRvZG9UaXRsZS50ZXh0Q29udGVudCA9IHRvZG8udGl0bGU7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZCh0b2RvVGl0bGUpO1xuXG4gICAgICAgICAgICBjb25zdCB0b2RvRHVlRGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdG9kb0R1ZURhdGUuY2xhc3NMaXN0LmFkZCgnZHVlRGF0ZScpO1xuICAgICAgICAgICAgdG9kb0R1ZURhdGUudGV4dENvbnRlbnQgPSB0b2RvLmR1ZURhdGU7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZCh0b2RvRHVlRGF0ZSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGRsdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgZGx0QnRuLnRleHRDb250ZW50ID0gJ0RFTEVURSc7XG4gICAgICAgICAgICBkbHRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsJ2RlbGV0ZScpO1xuICAgICAgICAgICAgZGx0QnRuLmlkID0gdG9kby5pbmRleDtcbiAgICAgICAgICAgIHRvZG9FbGVtLmFwcGVuZENoaWxkKGRsdEJ0bik7XG5cbiAgICAgICAgICAgIGRsdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PiB7XG4gICAgICAgICAgICAgICAgVG9Eb01hbmFnZXIuZGVsZXRlVG9Ebyh0b2RvLmluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCBlZGl0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICBlZGl0QnRuLnRleHRDb250ZW50ID0gJ0VESVQnO1xuICAgICAgICAgICAgZWRpdEJ0bi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnZWRpdCcpO1xuICAgICAgICAgICAgZWRpdEJ0bi5pZCA9IHRvZG8uaW5kZXg7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZChlZGl0QnRuKTtcblxuICAgICAgICAgICAgZWRpdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PiB7XG4gICAgICAgICAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgICAgICAgICAgY29uc3QgbmV3VG9Eb0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uc2V0QXR0cmlidXRlKCdpZCcsJ215Rm9ybScpO1xuICAgICAgICAgICAgICAgIGRpc3BsYXlFbGVtLmFwcGVuZENoaWxkKG5ld1RvRG9Gb3JtKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCd0ZXh0Jyk7XG4gICAgICAgICAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdmb3JtSW5wdXQnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdyZXF1aXJlZCcsJycpO1xuICAgICAgICAgICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywnVGl0bGUnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQudmFsdWU9dG9kby50aXRsZTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtSW5wdXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGR1ZURhdGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgZHVlRGF0ZUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ2RhdGUnKTtcbiAgICAgICAgICAgICAgICBkdWVEYXRlSW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsJ2R1ZURhdGVJbnB1dCcpO1xuICAgICAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgICAgICAgICAgZHVlRGF0ZUlucHV0LnZhbHVlPXRvZG8uZHVlRGF0ZTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChkdWVEYXRlSW5wdXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5TGFiZWwuc2V0QXR0cmlidXRlKCdmb3InLCdwcmlvcml0eScpO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5TGFiZWwudGV4dENvbnRlbnQ9J1ByaW9yaXR5Oic7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQocHJpb3JpdHlMYWJlbCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcHJpb3JpdHlJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5SW5wdXQuc2V0QXR0cmlidXRlKCduYW1lJywncHJpb3JpdHknKTtcbiAgICAgICAgICAgICAgICBwcmlvcml0eUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdwcmlvcml0eUlucHV0Jyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0TG93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0TG93LnNldEF0dHJpYnV0ZSgndmFsdWUnLCdsb3cnKTtcbiAgICAgICAgICAgICAgICBvcHRMb3cuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsJycpO1xuICAgICAgICAgICAgICAgIG9wdExvdy50ZXh0Q29udGVudD0nTG93JztcbiAgICAgICAgICAgICAgICBwcmlvcml0eUlucHV0LmFwcGVuZENoaWxkKG9wdExvdyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3B0TWVkaXVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0TWVkaXVtLnNldEF0dHJpYnV0ZSgndmFsdWUnLCdtZWRpdW0nKTtcbiAgICAgICAgICAgICAgICBvcHRNZWRpdW0udGV4dENvbnRlbnQ9J01lZGl1bSc7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRNZWRpdW0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdEhpZ2ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgICAgICBvcHRIaWdoLnNldEF0dHJpYnV0ZSgndmFsdWUnLCdoaWdoJyk7XG4gICAgICAgICAgICAgICAgb3B0SGlnaC50ZXh0Q29udGVudD0nSGlnaCc7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRIaWdoKTtcbiAgICAgICAgICAgICAgICBwcmlvcml0eUlucHV0LnZhbHVlID0gdG9kby5wcmlvcml0eTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChwcmlvcml0eUlucHV0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgLy9mb3JtQnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgIGZvcm1CdXR0b24udGV4dENvbnRlbnQgPSAnU1VCTUlUJztcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtQnV0dG9uKTtcblxuICAgICAgICAgICAgICAgIGZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdG9kby50aXRsZSA9IGZvcm1JbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdG9kby5kdWVEYXRlID0gZHVlRGF0ZUlucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICB0b2RvLnByaW9yaXR5ID0gcHJpb3JpdHlJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgICAgICAgICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICBUb0RvTWFuYWdlci51cGRhdGVUb0RvKHRvZG8uaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRvZG9saXN0LmFwcGVuZENoaWxkKHRvZG9FbGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQge3JlbmRlcn07IiwiY29uc3QgcmVuZGVySGVhZGVyID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3Qgcm9vdEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xuXG4gICAgY29uc3QgaGVhZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgaGVhZGVyLmNsYXNzTGlzdC5hZGQoJ2hlYWRlcicpO1xuICAgIHJvb3RFbGVtLmFwcGVuZENoaWxkKGhlYWRlcik7XG5cbiAgICBjb25zdCBoZWFkaW5nID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaDEnKTtcbiAgICBoZWFkaW5nLmNsYXNzTGlzdC5hZGQoJ2hlYWRpbmcnKTtcbiAgICBoZWFkaW5nLnRleHRDb250ZW50ID0gJ1RvZG8gTGlzdCc7XG4gICAgaGVhZGVyLmFwcGVuZENoaWxkKGhlYWRpbmcpO1xufSkoKTtcblxuZXhwb3J0IHtyZW5kZXJIZWFkZXJ9OyIsImltcG9ydCBuZXdQcm9qZWN0IGZyb20gXCIuL21ha2VQcm9qZWN0XCI7XG5pbXBvcnQgeyBQcm9qZWN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZVByb2plY3RzXCI7XG5pbXBvcnQgcHVic3ViIGZyb20gXCIuL3B1YnN1YlwiO1xuXG5jb25zdCByZW5kZXJQcm9qZWN0cyA9ICgoKT0+IHtcblxuICAgIGNvbnN0IHJvb3RFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKTtcblxuICAgIGNvbnN0IHByb2plY3RTZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcHJvamVjdFNlY3Rpb24uY2xhc3NMaXN0LmFkZCgncHJvamVjdFNlY3Rpb24nKTtcbiAgICByb290RWxlbS5hcHBlbmRDaGlsZChwcm9qZWN0U2VjdGlvbik7XG5cbiAgICBjb25zdCBuZXdQcm9qZWN0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgbmV3UHJvamVjdEJ0bi5jbGFzc0xpc3QuYWRkKCduZXdQcm9qZWN0QnRuJyk7XG4gICAgbmV3UHJvamVjdEJ0bi50ZXh0Q29udGVudD0nQWRkIFByb2plY3QnO1xuICAgIHByb2plY3RTZWN0aW9uLmFwcGVuZENoaWxkKG5ld1Byb2plY3RCdG4pO1xuXG4gICAgbmV3UHJvamVjdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1ha2VGb3JtKTtcblxuICAgIGNvbnN0IGRpc3BsYXlQcm9qZWN0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpc3BsYXlQcm9qZWN0cy5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5UHJvamVjdHMnKTtcbiAgICBwcm9qZWN0U2VjdGlvbi5hcHBlbmRDaGlsZChkaXNwbGF5UHJvamVjdHMpO1xuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm0oKSB7XG4gICAgICAgIC8vZGlzYWJsaW5nIGFkZCBwcm9qZWN0IGFuZCBhZGQgdG9kbyBidXR0b25zXG4gICAgICAgIGNvbnN0IG5ld1RvZG9CdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmV3VG9kb0J0bicpO1xuICAgICAgICBuZXdQcm9qZWN0QnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCcnKTtcbiAgICAgICAgbmV3VG9kb0J0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywnJyk7XG5cbiAgICAgICAgZGlzcGxheVByb2plY3RzLnRleHRDb250ZW50PScnO1xuICAgICAgICBjb25zdCBuZXdQcm9qZWN0Rm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbmV3UHJvamVjdEZvcm0uc2V0QXR0cmlidXRlKCdpZCcsJ215Rm9ybScpO1xuICAgICAgICBkaXNwbGF5UHJvamVjdHMuYXBwZW5kQ2hpbGQobmV3UHJvamVjdEZvcm0pO1xuICAgICAgICBjb25zdCBmb3JtSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywndGV4dCcpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsJ2Zvcm1JbnB1dCcpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdyZXF1aXJlZCcsJycpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsJ05hbWUnKTtcbiAgICAgICAgbmV3UHJvamVjdEZvcm0uYXBwZW5kQ2hpbGQoZm9ybUlucHV0KTtcbiAgICAgICAgY29uc3QgZm9ybUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBmb3JtQnV0dG9uLnRleHRDb250ZW50ID0gJ1NVQk1JVCc7XG4gICAgICAgIG5ld1Byb2plY3RGb3JtLmFwcGVuZENoaWxkKGZvcm1CdXR0b24pO1xuXG4gICAgICAgIGZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vcmUtZW5hYmxpbmcgYWRkIHByb2plY3QgYW5kIGFkZCB0b2RvIGJ1dHRvbnNcbiAgICAgICAgICAgIG5ld1RvZG9CdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgbmV3UHJvamVjdEJ0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGFkZFByb2plY3QoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUxpc3RFbGVtZW50KCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwcm9qZWN0TGlzdC5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0TGlzdCcpO1xuICAgICAgICBkaXNwbGF5UHJvamVjdHMuYXBwZW5kQ2hpbGQocHJvamVjdExpc3QpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb2plY3QoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBuZXcgbmV3UHJvamVjdCgpO1xuICAgICAgICBwcm9qZWN0Lm5hbWUgPSBmb3JtSW5wdXQudmFsdWU7XG4gICAgICAgIGRpc3BsYXlQcm9qZWN0cy50ZXh0Q29udGVudD0nJztcbiAgICAgICAgbWFrZUxpc3RFbGVtZW50KCk7XG4gICAgICAgIFByb2plY3RNYW5hZ2VyLmFkZFByb2plY3QocHJvamVjdCk7XG4gICAgfVxuICAgIC8vbG9hZCBkZWZhdWx0IHByb2plY3RcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICBpbml0aWFsTG9hZChQcm9qZWN0TWFuYWdlci5nZXRQcm9qZWN0TGlzdCgpKTtcbiAgICB9KSgpO1xuXG4gICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICAgcHVic3ViLnN1YnNjcmliZSgncHJvamVjdHNDaGFuZ2VkJyxpbml0aWFsTG9hZCk7XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsTG9hZChwcm9qZWN0QXJyKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RMaXN0Jyk7XG4gICAgICAgIHByb2plY3RMaXN0LnRleHRDb250ZW50PScnO1xuICAgICAgICBwcm9qZWN0QXJyLmZvckVhY2goKHByb2plY3QpPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvakVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHByb2pFbGVtLmNsYXNzTGlzdC5hZGQoJ3Byb2plY3QnKTtcblxuICAgICAgICAgICAgY29uc3QgcHJvak5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHByb2pOYW1lLmNsYXNzTGlzdC5hZGQoJ25hbWUnKTtcbiAgICAgICAgICAgIHByb2pOYW1lLnRleHRDb250ZW50ID0gcHJvamVjdC5uYW1lO1xuICAgICAgICAgICAgcHJvakVsZW0uYXBwZW5kQ2hpbGQocHJvak5hbWUpO1xuXG4gICAgICAgICAgICBwcm9qTmFtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PiB7XG4gICAgICAgICAgICAgICAgUHJvamVjdE1hbmFnZXIuc2VsZWN0UHJvamVjdChwcm9qZWN0LmluZGV4KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IGRsdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgZGx0QnRuLnRleHRDb250ZW50ID0gJ0RFTEVURSc7XG4gICAgICAgICAgICBkbHRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsJ2RlbGV0ZScpO1xuICAgICAgICAgICAgZGx0QnRuLmlkID0gcHJvamVjdC5pbmRleDtcbiAgICAgICAgICAgIHByb2pFbGVtLmFwcGVuZENoaWxkKGRsdEJ0bik7XG5cbiAgICAgICAgICAgIGRsdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT4ge1xuICAgICAgICAgICAgICAgIFByb2plY3RNYW5hZ2VyLmRlbGV0ZVByb2plY3QocHJvamVjdC5pbmRleCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvamVjdExpc3QuYXBwZW5kQ2hpbGQocHJvakVsZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy9kaXNhYmxpbmcgZGVsZXRlIGJ1dHRvbiBvZiBkZWZhdWx0IHByb2plY3RcbiAgICAgICAgY29uc3QgZGVmYXVsdERsdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0TGlzdCAucHJvamVjdDpmaXJzdC1jaGlsZCBidXR0b25baWQ9XCIwXCJdJyk7XG4gICAgICAgIGRlZmF1bHREbHRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsJycpO1xuICAgIH1cbiAgICBcbn0pKCk7XG5cbmV4cG9ydCB7cmVuZGVyUHJvamVjdHN9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcmVuZGVySGVhZGVyIH0gZnJvbSBcIi4vcmVuZGVySGVhZGVyXCI7XG5pbXBvcnQgeyByZW5kZXJQcm9qZWN0cyB9IGZyb20gXCIuL3JlbmRlclByb2plY3RzXCI7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9yZW5kZXJcIjtcblxuXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==