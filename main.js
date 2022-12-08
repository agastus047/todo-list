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

    rootElem.appendChild(newToDoBtn);

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

    const newProjectBtn = document.createElement('button');
    newProjectBtn.classList.add('newProjectBtn');
    newProjectBtn.textContent='Add Project';
    rootElem.appendChild(newProjectBtn);

    newProjectBtn.addEventListener('click', makeForm);

    const displayProjects = document.createElement('div');
    displayProjects.classList.add('displayProjects');
    rootElem.appendChild(displayProjects);

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
/* harmony import */ var _renderProjects__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./renderProjects */ "./src/renderProjects.js");
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./render */ "./src/render.js");






})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTmtEO0FBQ2hCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21ha2VQcm9qZWN0LmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYWtlVG9Eb3MuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21hbmFnZVByb2plY3RzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYW5hZ2VUb0Rvcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcHVic3ViLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3JlbmRlclByb2plY3RzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBuZXdQcm9qZWN0KG5hbWUpIHtcbiAgICB0aGlzLm5hbWU9bmFtZTtcbiAgICB0aGlzLmluZGV4O1xuICAgIHRoaXMucHJvamVjdFRvZG9zPVtdO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ld1Byb2plY3Q7IiwiZnVuY3Rpb24gbmV3SXRlbSh0aXRsZSxkZXNjcmlwdGlvbixkdWVEYXRlLHByaW9yaXR5KSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLmNvbXBsZXRlID0gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ld0l0ZW07IiwiaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCBuZXdQcm9qZWN0IGZyb20gXCIuL21ha2VQcm9qZWN0XCI7XG5cbmNvbnN0IFByb2plY3RNYW5hZ2VyID0gKCgpPT4ge1xuICAgIGxldCBwcm9qZWN0TGlzdCA9IFtdO1xuXG4gICAgbGV0IGRlZmF1bHRQcm9qZWN0ID0gbmV3IG5ld1Byb2plY3QoJ0RlZmF1bHQnKTtcblxuICAgIGxldCBjdXJyZW50UHJvamVjdCA9IGRlZmF1bHRQcm9qZWN0O1xuICAgIGFkZFByb2plY3QoZGVmYXVsdFByb2plY3QpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFByb2plY3QoKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50UHJvamVjdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHByb2plY3RMaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb2plY3QobmV3cHJvaikge1xuICAgICAgICBuZXdwcm9qLmluZGV4ID0gcHJvamVjdExpc3QubGVuZ3RoO1xuICAgICAgICBwcm9qZWN0TGlzdC5wdXNoKG5ld3Byb2opO1xuICAgICAgICBwdWJzdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2VkJyxwcm9qZWN0TGlzdCk7XG4gICAgfVxuICAgIC8vY2hlY2sgY29uZGl0aW9uIHdoZW4gY3VycmVudCBwcm9qZWN0IGlzIGRlbGV0ZWRcbiAgICAvL29yIG1ha2Ugc3VyZSBjdXJyZW50IHByb2plY3QgaXMgbmV2ZXIgZGVsZXRlZFxuICAgIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdExpc3QgPSBwcm9qZWN0TGlzdC5maWx0ZXIoKHByb2plY3QpID0+IHByb2plY3QuaW5kZXggIT09IGluZGV4KTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxwcm9qZWN0TGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICBwcm9qZWN0TGlzdFtpXS5pbmRleCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFByb2plY3QgPSBkZWZhdWx0UHJvamVjdDtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgICAgICBwdWJzdWIucHVibGlzaChcInByb2plY3RzQ2hhbmdlZFwiLHByb2plY3RMaXN0KTtcbiAgIH1cblxuICAgZnVuY3Rpb24gc2VsZWN0UHJvamVjdChpbmRleCkge1xuICAgICAgICBjdXJyZW50UHJvamVjdCA9IHByb2plY3RMaXN0W2luZGV4XTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgfVxuXG4gICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgIHB1YnN1Yi5zdWJzY3JpYmUoJ2xpc3RDaGFuZ2VkJyx1cGRhdGVDdXJyZW50UHJvamVjdCk7XG5cbiAgIGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnRQcm9qZWN0KG5ld0xpc3QpIHtcbiAgICAgICAgY3VycmVudFByb2plY3QucHJvamVjdFRvZG9zID0gbmV3TGlzdDtcbiAgICAgICAgcHJvamVjdExpc3QgPSBwcm9qZWN0TGlzdC5tYXAoKHByb2plY3QpPT4gcHJvamVjdC5pbmRleCA9PT0gY3VycmVudFByb2plY3QuaW5kZXggPyBjdXJyZW50UHJvamVjdDogcHJvamVjdCk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZWQnLHByb2plY3RMaXN0KVxuXG4gICB9XG5cbiAgIHJldHVybiB7Z2V0UHJvamVjdExpc3QsIGdldEN1cnJlbnRQcm9qZWN0LCBhZGRQcm9qZWN0LCBkZWxldGVQcm9qZWN0LCBzZWxlY3RQcm9qZWN0fTtcbn0pKCk7XG5cbmV4cG9ydCB7UHJvamVjdE1hbmFnZXJ9OyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgeyBQcm9qZWN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZVByb2plY3RzXCI7XG5cbmNvbnN0IFRvRG9NYW5hZ2VyID0gKCgpPT4ge1xuICAgIGxldCBwcm9qZWN0ID0gUHJvamVjdE1hbmFnZXIuZ2V0Q3VycmVudFByb2plY3QoKS5wcm9qZWN0VG9kb3M7XG5cbiAgICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgICAgcHVic3ViLnN1YnNjcmliZSgnY3VycmVudFByb2plY3RDaGFuZ2VkJyxzZWxlY3RQcm9qZWN0KTtcblxuICAgICBmdW5jdGlvbiBzZWxlY3RQcm9qZWN0KGN1cnJlbnRQcm9qZWN0KSB7XG4gICAgICAgICAgcHJvamVjdCA9IGN1cnJlbnRQcm9qZWN0LnByb2plY3RUb2RvcztcbiAgICAgICAgICBwdWJzdWIucHVibGlzaCgnbGlzdENoYW5nZWQnLHByb2plY3QpO1xuICAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICAgIHJldHVybiBwcm9qZWN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRUb0RvKG5ld1RvRG8pIHtcbiAgICAgICAgbmV3VG9Eby5pbmRleCA9IHByb2plY3QubGVuZ3RoO1xuICAgICAgICBwcm9qZWN0LnB1c2gobmV3VG9Ebyk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwibGlzdENoYW5nZWRcIixwcm9qZWN0KTtcbiAgICB9XG5cbiAgIGZ1bmN0aW9uIGRlbGV0ZVRvRG8oaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdCA9IHByb2plY3QuZmlsdGVyKCh0b2RvKSA9PiB0b2RvLmluZGV4ICE9PSBpbmRleCk7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8cHJvamVjdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICBwcm9qZWN0W2ldLmluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgICAgICBwdWJzdWIucHVibGlzaChcImxpc3RDaGFuZ2VkXCIscHJvamVjdCk7XG4gICB9XG5cbiAgIGZ1bmN0aW9uIHVwZGF0ZVRvRG8oaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdCA9IHByb2plY3QubWFwKCh0b2RvKT0+IHRvZG8uaW5kZXggPT09IGluZGV4ID8gdG9kbyA6IHRvZG8sKTsvL3tpbmRleDogdG9kby5pbmRleCwgdGl0bGU6IHRvZG8udGl0bGUsIGNvbXBsZXRlOiB0b2RvLmNvbXBsZXRlfSA6IHRvZG8sKTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJsaXN0Q2hhbmdlZFwiLHByb2plY3QpO1xuICAgfVxuICAgcmV0dXJuIHtnZXRQcm9qZWN0LCBhZGRUb0RvLCBkZWxldGVUb0RvLCB1cGRhdGVUb0RvfTtcbn0pKCk7XG5cbmV4cG9ydCB7VG9Eb01hbmFnZXJ9OyIsImNvbnN0IHB1YnN1YiA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gaG9sZHMgZXZlbnQ6IGFycmF5b2ZjYWxsYmFja3MgcGFpcnNcbiAgICBjb25zdCBldmVudHMgPSB7fTtcbiAgXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkgZXZlbnRzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuICAgICAgZWxzZSBldmVudHNbZXZlbnRdID0gW2hhbmRsZXJdO1xuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gcHVibGlzaChldmVudCwgYXJncykge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBoYW5kbGVyIG9mIGV2ZW50c1tldmVudF0pIHtcbiAgICAgICAgICBoYW5kbGVyKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiB1bnN1YnNjcmliZShldmVudCwgaGFuZGxlcikge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBldmVudHNbZXZlbnRdLmluZGV4T2YoaGFuZGxlcik7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSBldmVudHNbZXZlbnRdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICBcbiAgICByZXR1cm4geyBzdWJzY3JpYmUsIHB1Ymxpc2gsIHVuc3Vic2NyaWJlIH07XG4gIH0pKCk7XG4gIFxuICBleHBvcnQgZGVmYXVsdCBwdWJzdWI7IiwiaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCBuZXdJdGVtIGZyb20gXCIuL21ha2VUb0Rvc1wiO1xuaW1wb3J0IHsgVG9Eb01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2VUb0Rvc1wiO1xuXG5jb25zdCByZW5kZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCByb290RWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50Jyk7XG4gICAgXG4gICAgY29uc3QgbmV3VG9Eb0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld1RvRG9CdG4uY2xhc3NMaXN0LmFkZCgnbmV3VG9kb0J0bicpO1xuICAgIG5ld1RvRG9CdG4udGV4dENvbnRlbnQ9J0FkZCBUby1Ebyc7XG5cbiAgICBuZXdUb0RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxtYWtlRm9ybSk7XG5cbiAgICByb290RWxlbS5hcHBlbmRDaGlsZChuZXdUb0RvQnRuKTtcblxuICAgIGNvbnN0IGRpc3BsYXlFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGlzcGxheUVsZW0uY2xhc3NMaXN0LmFkZCgnZGlzcGxheUVsZW0nKTtcbiAgICByb290RWxlbS5hcHBlbmRDaGlsZChkaXNwbGF5RWxlbSk7XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybSgpIHtcbiAgICAgICAgLy9kaXNhYmxpbmcgYWRkIHByb2plY3QgYW5kIGFkZCB0b2RvIGJ1dHRvbnNcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXdQcm9qZWN0QnRuJyk7XG4gICAgICAgIG5ld1Byb2plY3RCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsJycpO1xuICAgICAgICBuZXdUb0RvQnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCcnKTtcblxuICAgICAgICBkaXNwbGF5RWxlbS50ZXh0Q29udGVudD0nJztcbiAgICAgICAgY29uc3QgbmV3VG9Eb0Zvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIG5ld1RvRG9Gb3JtLnNldEF0dHJpYnV0ZSgnaWQnLCdteUZvcm0nKTtcbiAgICAgICAgZGlzcGxheUVsZW0uYXBwZW5kQ2hpbGQobmV3VG9Eb0Zvcm0pO1xuICAgICAgICBjb25zdCBmb3JtSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywndGV4dCcpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsJ2Zvcm1JbnB1dCcpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdyZXF1aXJlZCcsJycpO1xuICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsJ1RpdGxlJyk7XG4gICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKGZvcm1JbnB1dCk7XG4gICAgICAgIGNvbnN0IGR1ZURhdGVJbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGR1ZURhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdkYXRlJyk7XG4gICAgICAgIGR1ZURhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywnZHVlRGF0ZUlucHV0Jyk7XG4gICAgICAgIGR1ZURhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKGR1ZURhdGVJbnB1dCk7XG4gICAgICAgIGNvbnN0IHByaW9yaXR5TGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICBwcmlvcml0eUxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywncHJpb3JpdHknKTtcbiAgICAgICAgcHJpb3JpdHlMYWJlbC50ZXh0Q29udGVudD0nUHJpb3JpdHk6JztcbiAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQocHJpb3JpdHlMYWJlbCk7XG4gICAgICAgIGNvbnN0IHByaW9yaXR5SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICAgICAgcHJpb3JpdHlJbnB1dC5zZXRBdHRyaWJ1dGUoJ25hbWUnLCdwcmlvcml0eScpO1xuICAgICAgICBwcmlvcml0eUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdwcmlvcml0eUlucHV0Jyk7XG4gICAgICAgIGNvbnN0IG9wdExvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBvcHRMb3cuc2V0QXR0cmlidXRlKCd2YWx1ZScsJ2xvdycpO1xuICAgICAgICBvcHRMb3cuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsJycpO1xuICAgICAgICBvcHRMb3cudGV4dENvbnRlbnQ9J0xvdyc7XG4gICAgICAgIHByaW9yaXR5SW5wdXQuYXBwZW5kQ2hpbGQob3B0TG93KTtcbiAgICAgICAgY29uc3Qgb3B0TWVkaXVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdE1lZGl1bS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywnbWVkaXVtJyk7XG4gICAgICAgIG9wdE1lZGl1bS50ZXh0Q29udGVudD0nTWVkaXVtJztcbiAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRNZWRpdW0pO1xuICAgICAgICBjb25zdCBvcHRIaWdoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgIG9wdEhpZ2guc2V0QXR0cmlidXRlKCd2YWx1ZScsJ2hpZ2gnKTtcbiAgICAgICAgb3B0SGlnaC50ZXh0Q29udGVudD0nSGlnaCc7XG4gICAgICAgIHByaW9yaXR5SW5wdXQuYXBwZW5kQ2hpbGQob3B0SGlnaCk7XG4gICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKHByaW9yaXR5SW5wdXQpO1xuICAgICAgICBjb25zdCBmb3JtQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIC8vZm9ybUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdzdWJtaXQnKTtcbiAgICAgICAgZm9ybUJ1dHRvbi50ZXh0Q29udGVudCA9ICdTVUJNSVQnO1xuICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtQnV0dG9uKTtcblxuICAgICAgICBmb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy9yZS1lbmFibGluZyBhZGQgcHJvamVjdCBhbmQgdG9kbyBidXR0b25zXG4gICAgICAgICAgICBuZXdQcm9qZWN0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIG5ld1RvRG9CdG4ucmVtb3ZlQXR0cmlidXRlKCdkaXNhYmxlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBhZGRJdGVtKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaXN0RWxlbWVudCgpIHtcbiAgICAgICAgY29uc3QgdG9kb2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdG9kb2xpc3QuY2xhc3NMaXN0LmFkZCgndG9kb2xpc3QnKTtcbiAgICAgICAgZGlzcGxheUVsZW0uYXBwZW5kQ2hpbGQodG9kb2xpc3QpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gYWRkSXRlbSgpIHtcbiAgICAgICAgY29uc3QgdG9kbyA9IG5ldyBuZXdJdGVtKCk7XG4gICAgICAgIHRvZG8udGl0bGUgPSBmb3JtSW5wdXQudmFsdWU7XG4gICAgICAgIHRvZG8uZHVlRGF0ZSA9IGR1ZURhdGVJbnB1dC52YWx1ZTtcbiAgICAgICAgdG9kby5wcmlvcml0eSA9IHByaW9yaXR5SW5wdXQudmFsdWU7XG4gICAgICAgIGRpc3BsYXlFbGVtLnRleHRDb250ZW50PScnO1xuICAgICAgICBtYWtlTGlzdEVsZW1lbnQoKTtcbiAgICAgICAgVG9Eb01hbmFnZXIuYWRkVG9Ebyh0b2RvKTtcbiAgICB9XG4gICAgXG4gICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICAgcHVic3ViLnN1YnNjcmliZShcImxpc3RDaGFuZ2VkXCIsaW5pdGlhbExvYWQpO1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbExvYWQobGlzdCkge1xuICAgICAgICBjb25zdCB0b2RvbGlzdD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kb2xpc3QnKTtcbiAgICAgICAgdG9kb2xpc3QudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgbGlzdC5mb3JFYWNoKCh0b2RvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b2RvRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdG9kb0VsZW0uY2xhc3NMaXN0LmFkZCgndG9kbycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjaGVja0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICBjaGVja0JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdjaGVja2JveCcpO1xuICAgICAgICAgICAgY2hlY2tCb3guY2xhc3NMaXN0LmFkZCgnY2hlY2tCb3gnKTtcbiAgICAgICAgICAgIGlmKHRvZG8uY29tcGxldGUpXG4gICAgICAgICAgICAgICAgY2hlY2tCb3guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZChjaGVja0JveCk7XG5cbiAgICAgICAgICAgIGNoZWNrQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpPT57XG4gICAgICAgICAgICAgICAgdG9kby5jb21wbGV0ZSA9ICF0b2RvLmNvbXBsZXRlO1xuICAgICAgICAgICAgICAgIFRvRG9NYW5hZ2VyLnVwZGF0ZVRvRG8odG9kby5pbmRleCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdG9kb1RpdGxlICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdG9kb1RpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJyk7XG4gICAgICAgICAgICB0b2RvVGl0bGUudGV4dENvbnRlbnQgPSB0b2RvLnRpdGxlO1xuICAgICAgICAgICAgdG9kb0VsZW0uYXBwZW5kQ2hpbGQodG9kb1RpdGxlKTtcblxuICAgICAgICAgICAgY29uc3QgdG9kb0R1ZURhdGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHRvZG9EdWVEYXRlLmNsYXNzTGlzdC5hZGQoJ2R1ZURhdGUnKTtcbiAgICAgICAgICAgIHRvZG9EdWVEYXRlLnRleHRDb250ZW50ID0gdG9kby5kdWVEYXRlO1xuICAgICAgICAgICAgdG9kb0VsZW0uYXBwZW5kQ2hpbGQodG9kb0R1ZURhdGUpO1xuXG4gICAgICAgICAgICBjb25zdCBkbHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGRsdEJ0bi50ZXh0Q29udGVudCA9ICdERUxFVEUnO1xuICAgICAgICAgICAgZGx0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdkZWxldGUnKTtcbiAgICAgICAgICAgIGRsdEJ0bi5pZCA9IHRvZG8uaW5kZXg7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZChkbHRCdG4pO1xuXG4gICAgICAgICAgICBkbHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT4ge1xuICAgICAgICAgICAgICAgIFRvRG9NYW5hZ2VyLmRlbGV0ZVRvRG8odG9kby5pbmRleCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgZWRpdEJ0bi50ZXh0Q29udGVudCA9ICdFRElUJztcbiAgICAgICAgICAgIGVkaXRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsJ2VkaXQnKTtcbiAgICAgICAgICAgIGVkaXRCdG4uaWQgPSB0b2RvLmluZGV4O1xuICAgICAgICAgICAgdG9kb0VsZW0uYXBwZW5kQ2hpbGQoZWRpdEJ0bik7XG5cbiAgICAgICAgICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT4ge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlFbGVtLnRleHRDb250ZW50PScnO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RvRG9Gb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICAgICAgICAgIG5ld1RvRG9Gb3JtLnNldEF0dHJpYnV0ZSgnaWQnLCdteUZvcm0nKTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5RWxlbS5hcHBlbmRDaGlsZChuZXdUb0RvRm9ybSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywndGV4dCcpO1xuICAgICAgICAgICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywnZm9ybUlucHV0Jyk7XG4gICAgICAgICAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCcnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdwbGFjZWhvbGRlcicsJ1RpdGxlJyk7XG4gICAgICAgICAgICAgICAgZm9ybUlucHV0LnZhbHVlPXRvZG8udGl0bGU7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUlucHV0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBkdWVEYXRlSW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgICAgICAgICAgICAgIGR1ZURhdGVJbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdkYXRlJyk7XG4gICAgICAgICAgICAgICAgZHVlRGF0ZUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdkdWVEYXRlSW5wdXQnKTtcbiAgICAgICAgICAgICAgICBkdWVEYXRlSW5wdXQuc2V0QXR0cmlidXRlKCdyZXF1aXJlZCcsJycpO1xuICAgICAgICAgICAgICAgIGR1ZURhdGVJbnB1dC52YWx1ZT10b2RvLmR1ZURhdGU7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZHVlRGF0ZUlucHV0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmlvcml0eUxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGFiZWwnKTtcbiAgICAgICAgICAgICAgICBwcmlvcml0eUxhYmVsLnNldEF0dHJpYnV0ZSgnZm9yJywncHJpb3JpdHknKTtcbiAgICAgICAgICAgICAgICBwcmlvcml0eUxhYmVsLnRleHRDb250ZW50PSdQcmlvcml0eTonO1xuICAgICAgICAgICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKHByaW9yaXR5TGFiZWwpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHByaW9yaXR5SW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICAgICAgICAgICAgICBwcmlvcml0eUlucHV0LnNldEF0dHJpYnV0ZSgnbmFtZScsJ3ByaW9yaXR5Jyk7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHlJbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywncHJpb3JpdHlJbnB1dCcpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdExvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG9wdExvdy5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywnbG93Jyk7XG4gICAgICAgICAgICAgICAgb3B0TG93LnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCcnKTtcbiAgICAgICAgICAgICAgICBvcHRMb3cudGV4dENvbnRlbnQ9J0xvdyc7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHlJbnB1dC5hcHBlbmRDaGlsZChvcHRMb3cpO1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wdE1lZGl1bSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIG9wdE1lZGl1bS5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywnbWVkaXVtJyk7XG4gICAgICAgICAgICAgICAgb3B0TWVkaXVtLnRleHRDb250ZW50PSdNZWRpdW0nO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5SW5wdXQuYXBwZW5kQ2hpbGQob3B0TWVkaXVtKTtcbiAgICAgICAgICAgICAgICBjb25zdCBvcHRIaWdoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICAgICAgb3B0SGlnaC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywnaGlnaCcpO1xuICAgICAgICAgICAgICAgIG9wdEhpZ2gudGV4dENvbnRlbnQ9J0hpZ2gnO1xuICAgICAgICAgICAgICAgIHByaW9yaXR5SW5wdXQuYXBwZW5kQ2hpbGQob3B0SGlnaCk7XG4gICAgICAgICAgICAgICAgcHJpb3JpdHlJbnB1dC52YWx1ZSA9IHRvZG8ucHJpb3JpdHk7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQocHJpb3JpdHlJbnB1dCk7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9ybUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgICAgIC8vZm9ybUJ1dHRvbi5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdzdWJtaXQnKTtcbiAgICAgICAgICAgICAgICBmb3JtQnV0dG9uLnRleHRDb250ZW50ID0gJ1NVQk1JVCc7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUJ1dHRvbik7XG5cbiAgICAgICAgICAgICAgICBmb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIHRvZG8udGl0bGUgPSBmb3JtSW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHRvZG8uZHVlRGF0ZSA9IGR1ZURhdGVJbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgdG9kby5wcmlvcml0eSA9IHByaW9yaXR5SW5wdXQudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXlFbGVtLnRleHRDb250ZW50PScnO1xuICAgICAgICAgICAgICAgICAgICBtYWtlTGlzdEVsZW1lbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgVG9Eb01hbmFnZXIudXBkYXRlVG9Ebyh0b2RvLmluZGV4KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB0b2RvbGlzdC5hcHBlbmRDaGlsZCh0b2RvRWxlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufSkoKTtcblxuZXhwb3J0IHtyZW5kZXJ9OyIsImltcG9ydCBuZXdQcm9qZWN0IGZyb20gXCIuL21ha2VQcm9qZWN0XCI7XG5pbXBvcnQgeyBQcm9qZWN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZVByb2plY3RzXCI7XG5pbXBvcnQgcHVic3ViIGZyb20gXCIuL3B1YnN1YlwiO1xuXG5jb25zdCByZW5kZXJQcm9qZWN0cyA9ICgoKT0+IHtcblxuICAgIGNvbnN0IHJvb3RFbGVtID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI2NvbnRlbnQnKTtcblxuICAgIGNvbnN0IG5ld1Byb2plY3RCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBuZXdQcm9qZWN0QnRuLmNsYXNzTGlzdC5hZGQoJ25ld1Byb2plY3RCdG4nKTtcbiAgICBuZXdQcm9qZWN0QnRuLnRleHRDb250ZW50PSdBZGQgUHJvamVjdCc7XG4gICAgcm9vdEVsZW0uYXBwZW5kQ2hpbGQobmV3UHJvamVjdEJ0bik7XG5cbiAgICBuZXdQcm9qZWN0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgbWFrZUZvcm0pO1xuXG4gICAgY29uc3QgZGlzcGxheVByb2plY3RzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGlzcGxheVByb2plY3RzLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXlQcm9qZWN0cycpO1xuICAgIHJvb3RFbGVtLmFwcGVuZENoaWxkKGRpc3BsYXlQcm9qZWN0cyk7XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybSgpIHtcbiAgICAgICAgLy9kaXNhYmxpbmcgYWRkIHByb2plY3QgYW5kIGFkZCB0b2RvIGJ1dHRvbnNcbiAgICAgICAgY29uc3QgbmV3VG9kb0J0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXdUb2RvQnRuJyk7XG4gICAgICAgIG5ld1Byb2plY3RCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsJycpO1xuICAgICAgICBuZXdUb2RvQnRuLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLCcnKTtcblxuICAgICAgICBkaXNwbGF5UHJvamVjdHMudGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBuZXdQcm9qZWN0Rm9ybS5zZXRBdHRyaWJ1dGUoJ2lkJywnbXlGb3JtJyk7XG4gICAgICAgIGRpc3BsYXlQcm9qZWN0cy5hcHBlbmRDaGlsZChuZXdQcm9qZWN0Rm9ybSk7XG4gICAgICAgIGNvbnN0IGZvcm1JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCd0ZXh0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywnZm9ybUlucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3BsYWNlaG9sZGVyJywnTmFtZScpO1xuICAgICAgICBuZXdQcm9qZWN0Rm9ybS5hcHBlbmRDaGlsZChmb3JtSW5wdXQpO1xuICAgICAgICBjb25zdCBmb3JtQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgIGZvcm1CdXR0b24udGV4dENvbnRlbnQgPSAnU1VCTUlUJztcbiAgICAgICAgbmV3UHJvamVjdEZvcm0uYXBwZW5kQ2hpbGQoZm9ybUJ1dHRvbik7XG5cbiAgICAgICAgZm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgLy9yZS1lbmFibGluZyBhZGQgcHJvamVjdCBhbmQgYWRkIHRvZG8gYnV0dG9uc1xuICAgICAgICAgICAgbmV3VG9kb0J0bi5yZW1vdmVBdHRyaWJ1dGUoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICBuZXdQcm9qZWN0QnRuLnJlbW92ZUF0dHJpYnV0ZSgnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgYWRkUHJvamVjdCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWtlTGlzdEVsZW1lbnQoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RMaXN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHByb2plY3RMaXN0LmNsYXNzTGlzdC5hZGQoJ3Byb2plY3RMaXN0Jyk7XG4gICAgICAgIGRpc3BsYXlQcm9qZWN0cy5hcHBlbmRDaGlsZChwcm9qZWN0TGlzdCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gYWRkUHJvamVjdCgpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdCA9IG5ldyBuZXdQcm9qZWN0KCk7XG4gICAgICAgIHByb2plY3QubmFtZSA9IGZvcm1JbnB1dC52YWx1ZTtcbiAgICAgICAgZGlzcGxheVByb2plY3RzLnRleHRDb250ZW50PScnO1xuICAgICAgICBtYWtlTGlzdEVsZW1lbnQoKTtcbiAgICAgICAgUHJvamVjdE1hbmFnZXIuYWRkUHJvamVjdChwcm9qZWN0KTtcbiAgICB9XG4gICAgLy9sb2FkIGRlZmF1bHQgcHJvamVjdFxuICAgIChmdW5jdGlvbigpIHtcbiAgICAgICAgbWFrZUxpc3RFbGVtZW50KCk7XG4gICAgICAgIGluaXRpYWxMb2FkKFByb2plY3RNYW5hZ2VyLmdldFByb2plY3RMaXN0KCkpO1xuICAgIH0pKCk7XG5cbiAgICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgICBwdWJzdWIuc3Vic2NyaWJlKCdwcm9qZWN0c0NoYW5nZWQnLGluaXRpYWxMb2FkKTtcblxuICAgIGZ1bmN0aW9uIGluaXRpYWxMb2FkKHByb2plY3RBcnIpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdExpc3QgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJvamVjdExpc3QnKTtcbiAgICAgICAgcHJvamVjdExpc3QudGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIHByb2plY3RBcnIuZm9yRWFjaCgocHJvamVjdCk9PiB7XG4gICAgICAgICAgICBjb25zdCBwcm9qRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcHJvakVsZW0uY2xhc3NMaXN0LmFkZCgncHJvamVjdCcpO1xuXG4gICAgICAgICAgICBjb25zdCBwcm9qTmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgcHJvak5hbWUuY2xhc3NMaXN0LmFkZCgnbmFtZScpO1xuICAgICAgICAgICAgcHJvak5hbWUudGV4dENvbnRlbnQgPSBwcm9qZWN0Lm5hbWU7XG4gICAgICAgICAgICBwcm9qRWxlbS5hcHBlbmRDaGlsZChwcm9qTmFtZSk7XG5cbiAgICAgICAgICAgIHByb2pOYW1lLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKT0+IHtcbiAgICAgICAgICAgICAgICBQcm9qZWN0TWFuYWdlci5zZWxlY3RQcm9qZWN0KHByb2plY3QuaW5kZXgpO1xuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgY29uc3QgZGx0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICBkbHRCdG4udGV4dENvbnRlbnQgPSAnREVMRVRFJztcbiAgICAgICAgICAgIGRsdEJ0bi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnZGVsZXRlJyk7XG4gICAgICAgICAgICBkbHRCdG4uaWQgPSBwcm9qZWN0LmluZGV4O1xuICAgICAgICAgICAgcHJvakVsZW0uYXBwZW5kQ2hpbGQoZGx0QnRuKTtcblxuICAgICAgICAgICAgZGx0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCk9PiB7XG4gICAgICAgICAgICAgICAgUHJvamVjdE1hbmFnZXIuZGVsZXRlUHJvamVjdChwcm9qZWN0LmluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcm9qZWN0TGlzdC5hcHBlbmRDaGlsZChwcm9qRWxlbSk7XG4gICAgICAgIH0pO1xuICAgICAgICAvL2Rpc2FibGluZyBkZWxldGUgYnV0dG9uIG9mIGRlZmF1bHQgcHJvamVjdFxuICAgICAgICBjb25zdCBkZWZhdWx0RGx0QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RMaXN0IC5wcm9qZWN0OmZpcnN0LWNoaWxkIGJ1dHRvbltpZD1cIjBcIl0nKTtcbiAgICAgICAgZGVmYXVsdERsdEJ0bi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJywnJyk7XG4gICAgfVxuICAgIFxufSkoKTtcblxuZXhwb3J0IHtyZW5kZXJQcm9qZWN0c307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyByZW5kZXJQcm9qZWN0cyB9IGZyb20gXCIuL3JlbmRlclByb2plY3RzXCI7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9yZW5kZXJcIjtcblxuXG5cbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==