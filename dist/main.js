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

    let defaultProject = new _makeProject__WEBPACK_IMPORTED_MODULE_1__["default"]('default');

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
        displayElem.textContent='';
        const newToDoForm = document.createElement('form');
        newToDoForm.setAttribute('id','myForm');
        displayElem.appendChild(newToDoForm);
        const formInput = document.createElement('input');
        formInput.setAttribute('type','text');
        formInput.setAttribute('id','formInput');
        formInput.setAttribute('required','');
        newToDoForm.appendChild(formInput);
        const formButton = document.createElement('button');
        //formButton.setAttribute('type','submit');
        formButton.textContent = 'SUBMIT';
        newToDoForm.appendChild(formButton);

        formButton.addEventListener('click',(e) => {
            e.preventDefault();
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
                formInput.value=todo.title;
                newToDoForm.appendChild(formInput);
                const formButton = document.createElement('button');
                //formButton.setAttribute('type','submit');
                formButton.textContent = 'SUBMIT';
                newToDoForm.appendChild(formButton);

                formButton.addEventListener('click', (e)=> {
                    e.preventDefault();
                    todo.title = formInput.value;
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
        displayProjects.textContent='';
        const newProjectForm = document.createElement('form');
        newProjectForm.setAttribute('id','myForm');
        displayProjects.appendChild(newProjectForm);
        const formInput = document.createElement('input');
        formInput.setAttribute('type','text');
        formInput.setAttribute('id','formInput');
        formInput.setAttribute('required','');
        newProjectForm.appendChild(formInput);
        const formButton = document.createElement('button');
        formButton.textContent = 'SUBMIT';
        newProjectForm.appendChild(formButton);

        formButton.addEventListener('click',(e)=> {
            e.preventDefault();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsb0RBQVU7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzRUFBeUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMEVBQTZCO0FBQ2pELEtBQUs7O0FBRUw7QUFDQSxJQUFJLHlEQUFnQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHlFQUE0QjtBQUM1QyxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IseUVBQTRCO0FBQzVDLGFBQWE7O0FBRWI7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDQUFDOzs7Ozs7OztVQzFGRDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7Ozs7Ozs7OztBQ05rRDtBQUNoQiIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYWtlUHJvamVjdC5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbWFrZVRvRG9zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYW5hZ2VQcm9qZWN0cy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvbWFuYWdlVG9Eb3MuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3B1YnN1Yi5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcmVuZGVyLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9yZW5kZXJQcm9qZWN0cy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbmV3UHJvamVjdChuYW1lKSB7XG4gICAgdGhpcy5uYW1lPW5hbWU7XG4gICAgdGhpcy5pbmRleDtcbiAgICB0aGlzLnByb2plY3RUb2Rvcz1bXTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXdQcm9qZWN0OyIsImZ1bmN0aW9uIG5ld0l0ZW0odGl0bGUsZGVzY3JpcHRpb24sZHVlRGF0ZSxwcmlvcml0eSkge1xuICAgIHRoaXMudGl0bGUgPSB0aXRsZTtcbiAgICB0aGlzLmRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb247XG4gICAgdGhpcy5kdWVEYXRlID0gZHVlRGF0ZTtcbiAgICB0aGlzLnByaW9yaXR5ID0gcHJpb3JpdHk7XG4gICAgdGhpcy5jb21wbGV0ZSA9IGZhbHNlO1xufVxuXG5leHBvcnQgZGVmYXVsdCBuZXdJdGVtOyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgbmV3UHJvamVjdCBmcm9tIFwiLi9tYWtlUHJvamVjdFwiO1xuXG5jb25zdCBQcm9qZWN0TWFuYWdlciA9ICgoKT0+IHtcbiAgICBsZXQgcHJvamVjdExpc3QgPSBbXTtcblxuICAgIGxldCBkZWZhdWx0UHJvamVjdCA9IG5ldyBuZXdQcm9qZWN0KCdkZWZhdWx0Jyk7XG5cbiAgICBsZXQgY3VycmVudFByb2plY3QgPSBkZWZhdWx0UHJvamVjdDtcbiAgICBhZGRQcm9qZWN0KGRlZmF1bHRQcm9qZWN0KTtcblxuICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRQcm9qZWN0KCkge1xuICAgICAgICByZXR1cm4gY3VycmVudFByb2plY3Q7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdExpc3QoKSB7XG4gICAgICAgIHJldHVybiBwcm9qZWN0TGlzdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQcm9qZWN0KG5ld3Byb2opIHtcbiAgICAgICAgbmV3cHJvai5pbmRleCA9IHByb2plY3RMaXN0Lmxlbmd0aDtcbiAgICAgICAgcHJvamVjdExpc3QucHVzaChuZXdwcm9qKTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ3Byb2plY3RzQ2hhbmdlZCcscHJvamVjdExpc3QpO1xuICAgIH1cbiAgICAvL2NoZWNrIGNvbmRpdGlvbiB3aGVuIGN1cnJlbnQgcHJvamVjdCBpcyBkZWxldGVkXG4gICAgLy9vciBtYWtlIHN1cmUgY3VycmVudCBwcm9qZWN0IGlzIG5ldmVyIGRlbGV0ZWRcbiAgICBmdW5jdGlvbiBkZWxldGVQcm9qZWN0KGluZGV4KSB7XG4gICAgICAgIHByb2plY3RMaXN0ID0gcHJvamVjdExpc3QuZmlsdGVyKChwcm9qZWN0KSA9PiBwcm9qZWN0LmluZGV4ICE9PSBpbmRleCk7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8cHJvamVjdExpc3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgcHJvamVjdExpc3RbaV0uaW5kZXggPSBpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0ID0gZGVmYXVsdFByb2plY3Q7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKCdjdXJyZW50UHJvamVjdENoYW5nZWQnLGN1cnJlbnRQcm9qZWN0KTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJwcm9qZWN0c0NoYW5nZWRcIixwcm9qZWN0TGlzdCk7XG4gICB9XG5cbiAgIGZ1bmN0aW9uIHNlbGVjdFByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgY3VycmVudFByb2plY3QgPSBwcm9qZWN0TGlzdFtpbmRleF07XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKCdjdXJyZW50UHJvamVjdENoYW5nZWQnLGN1cnJlbnRQcm9qZWN0KTtcbiAgIH1cblxuICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICBwdWJzdWIuc3Vic2NyaWJlKCdsaXN0Q2hhbmdlZCcsdXBkYXRlQ3VycmVudFByb2plY3QpO1xuXG4gICBmdW5jdGlvbiB1cGRhdGVDdXJyZW50UHJvamVjdChuZXdMaXN0KSB7XG4gICAgICAgIGN1cnJlbnRQcm9qZWN0LnByb2plY3RUb2RvcyA9IG5ld0xpc3Q7XG4gICAgICAgIHByb2plY3RMaXN0ID0gcHJvamVjdExpc3QubWFwKChwcm9qZWN0KT0+IHByb2plY3QuaW5kZXggPT09IGN1cnJlbnRQcm9qZWN0LmluZGV4ID8gY3VycmVudFByb2plY3Q6IHByb2plY3QpO1xuICAgICAgICBwdWJzdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2VkJyxwcm9qZWN0TGlzdClcblxuICAgfVxuXG4gICByZXR1cm4ge2dldFByb2plY3RMaXN0LCBnZXRDdXJyZW50UHJvamVjdCwgYWRkUHJvamVjdCwgZGVsZXRlUHJvamVjdCwgc2VsZWN0UHJvamVjdH07XG59KSgpO1xuXG5leHBvcnQge1Byb2plY3RNYW5hZ2VyfTsiLCJpbXBvcnQgcHVic3ViIGZyb20gXCIuL3B1YnN1YlwiO1xuaW1wb3J0IHsgUHJvamVjdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2VQcm9qZWN0c1wiO1xuXG5jb25zdCBUb0RvTWFuYWdlciA9ICgoKT0+IHtcbiAgICBsZXQgcHJvamVjdCA9IFByb2plY3RNYW5hZ2VyLmdldEN1cnJlbnRQcm9qZWN0KCkucHJvamVjdFRvZG9zO1xuXG4gICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICAgIHB1YnN1Yi5zdWJzY3JpYmUoJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsc2VsZWN0UHJvamVjdCk7XG5cbiAgICAgZnVuY3Rpb24gc2VsZWN0UHJvamVjdChjdXJyZW50UHJvamVjdCkge1xuICAgICAgICAgIHByb2plY3QgPSBjdXJyZW50UHJvamVjdC5wcm9qZWN0VG9kb3M7XG4gICAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2xpc3RDaGFuZ2VkJyxwcm9qZWN0KTtcbiAgICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0UHJvamVjdCgpIHtcbiAgICAgICAgICByZXR1cm4gcHJvamVjdDtcbiAgICB9XG4gICAgZnVuY3Rpb24gYWRkVG9EbyhuZXdUb0RvKSB7XG4gICAgICAgIG5ld1RvRG8uaW5kZXggPSBwcm9qZWN0Lmxlbmd0aDtcbiAgICAgICAgcHJvamVjdC5wdXNoKG5ld1RvRG8pO1xuICAgICAgICBwdWJzdWIucHVibGlzaChcImxpc3RDaGFuZ2VkXCIscHJvamVjdCk7XG4gICAgfVxuXG4gICBmdW5jdGlvbiBkZWxldGVUb0RvKGluZGV4KSB7XG4gICAgICAgIHByb2plY3QgPSBwcm9qZWN0LmZpbHRlcigodG9kbykgPT4gdG9kby5pbmRleCAhPT0gaW5kZXgpO1xuICAgICAgICBmb3IobGV0IGk9MDtpPHByb2plY3QubGVuZ3RoO2krKyl7XG4gICAgICAgICAgcHJvamVjdFtpXS5pbmRleCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJsaXN0Q2hhbmdlZFwiLHByb2plY3QpO1xuICAgfVxuXG4gICBmdW5jdGlvbiB1cGRhdGVUb0RvKGluZGV4KSB7XG4gICAgICAgIHByb2plY3QgPSBwcm9qZWN0Lm1hcCgodG9kbyk9PiB0b2RvLmluZGV4ID09PSBpbmRleCA/IHRvZG8gOiB0b2RvLCk7Ly97aW5kZXg6IHRvZG8uaW5kZXgsIHRpdGxlOiB0b2RvLnRpdGxlLCBjb21wbGV0ZTogdG9kby5jb21wbGV0ZX0gOiB0b2RvLCk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwibGlzdENoYW5nZWRcIixwcm9qZWN0KTtcbiAgIH1cbiAgIHJldHVybiB7Z2V0UHJvamVjdCwgYWRkVG9EbywgZGVsZXRlVG9EbywgdXBkYXRlVG9Eb307XG59KSgpO1xuXG5leHBvcnQge1RvRG9NYW5hZ2VyfTsiLCJjb25zdCBwdWJzdWIgPSAoZnVuY3Rpb24gKCkge1xuICAgIC8vIGhvbGRzIGV2ZW50OiBhcnJheW9mY2FsbGJhY2tzIHBhaXJzXG4gICAgY29uc3QgZXZlbnRzID0ge307XG4gIFxuICAgIGZ1bmN0aW9uIHN1YnNjcmliZShldmVudCwgaGFuZGxlcikge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIGV2ZW50c1tldmVudF0ucHVzaChoYW5kbGVyKTtcbiAgICAgIGVsc2UgZXZlbnRzW2V2ZW50XSA9IFtoYW5kbGVyXTtcbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIHB1Ymxpc2goZXZlbnQsIGFyZ3MpIHtcbiAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICAgIGZvciAoY29uc3QgaGFuZGxlciBvZiBldmVudHNbZXZlbnRdKSB7XG4gICAgICAgICAgaGFuZGxlcihhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gdW5zdWJzY3JpYmUoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gZXZlbnRzW2V2ZW50XS5pbmRleE9mKGhhbmRsZXIpO1xuICAgICAgICBpZiAoaW5kZXggPj0gMCkgZXZlbnRzW2V2ZW50XS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgXG4gICAgcmV0dXJuIHsgc3Vic2NyaWJlLCBwdWJsaXNoLCB1bnN1YnNjcmliZSB9O1xuICB9KSgpO1xuICBcbiAgZXhwb3J0IGRlZmF1bHQgcHVic3ViOyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgbmV3SXRlbSBmcm9tIFwiLi9tYWtlVG9Eb3NcIjtcbmltcG9ydCB7IFRvRG9NYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlVG9Eb3NcIjtcblxuY29uc3QgcmVuZGVyID0gKGZ1bmN0aW9uKCkge1xuXG4gICAgY29uc3Qgcm9vdEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xuICAgIFxuICAgIGNvbnN0IG5ld1RvRG9CdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICBuZXdUb0RvQnRuLmNsYXNzTGlzdC5hZGQoJ25ld1RvZG9CdG4nKTtcbiAgICBuZXdUb0RvQnRuLnRleHRDb250ZW50PSdBZGQgVG8tRG8nO1xuXG4gICAgbmV3VG9Eb0J0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsbWFrZUZvcm0pO1xuXG4gICAgcm9vdEVsZW0uYXBwZW5kQ2hpbGQobmV3VG9Eb0J0bik7XG5cbiAgICBjb25zdCBkaXNwbGF5RWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpc3BsYXlFbGVtLmNsYXNzTGlzdC5hZGQoJ2Rpc3BsYXlFbGVtJyk7XG4gICAgcm9vdEVsZW0uYXBwZW5kQ2hpbGQoZGlzcGxheUVsZW0pO1xuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm0oKSB7XG4gICAgICAgIGRpc3BsYXlFbGVtLnRleHRDb250ZW50PScnO1xuICAgICAgICBjb25zdCBuZXdUb0RvRm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgbmV3VG9Eb0Zvcm0uc2V0QXR0cmlidXRlKCdpZCcsJ215Rm9ybScpO1xuICAgICAgICBkaXNwbGF5RWxlbS5hcHBlbmRDaGlsZChuZXdUb0RvRm9ybSk7XG4gICAgICAgIGNvbnN0IGZvcm1JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCd0ZXh0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywnZm9ybUlucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKGZvcm1JbnB1dCk7XG4gICAgICAgIGNvbnN0IGZvcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgLy9mb3JtQnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgICAgICBmb3JtQnV0dG9uLnRleHRDb250ZW50ID0gJ1NVQk1JVCc7XG4gICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKGZvcm1CdXR0b24pO1xuXG4gICAgICAgIGZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBhZGRJdGVtKCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaXN0RWxlbWVudCgpIHtcbiAgICAgICAgY29uc3QgdG9kb2xpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdG9kb2xpc3QuY2xhc3NMaXN0LmFkZCgndG9kb2xpc3QnKTtcbiAgICAgICAgZGlzcGxheUVsZW0uYXBwZW5kQ2hpbGQodG9kb2xpc3QpO1xuICAgIH1cblxuXG4gICAgZnVuY3Rpb24gYWRkSXRlbSgpIHtcbiAgICAgICAgY29uc3QgdG9kbyA9IG5ldyBuZXdJdGVtKCk7XG4gICAgICAgIHRvZG8udGl0bGUgPSBmb3JtSW5wdXQudmFsdWU7XG4gICAgICAgIGRpc3BsYXlFbGVtLnRleHRDb250ZW50PScnO1xuICAgICAgICBtYWtlTGlzdEVsZW1lbnQoKTtcbiAgICAgICAgVG9Eb01hbmFnZXIuYWRkVG9Ebyh0b2RvKTtcbiAgICB9XG4gICAgXG4gICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICAgcHVic3ViLnN1YnNjcmliZShcImxpc3RDaGFuZ2VkXCIsaW5pdGlhbExvYWQpO1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbExvYWQobGlzdCkge1xuICAgICAgICBjb25zdCB0b2RvbGlzdD1kb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcudG9kb2xpc3QnKTtcbiAgICAgICAgdG9kb2xpc3QudGV4dENvbnRlbnQgPSAnJztcbiAgICAgICAgbGlzdC5mb3JFYWNoKCh0b2RvKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB0b2RvRWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdG9kb0VsZW0uY2xhc3NMaXN0LmFkZCgndG9kbycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBjaGVja0JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICBjaGVja0JveC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCdjaGVja2JveCcpO1xuICAgICAgICAgICAgY2hlY2tCb3guY2xhc3NMaXN0LmFkZCgnY2hlY2tCb3gnKTtcbiAgICAgICAgICAgIGlmKHRvZG8uY29tcGxldGUpXG4gICAgICAgICAgICAgICAgY2hlY2tCb3guY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZChjaGVja0JveCk7XG5cbiAgICAgICAgICAgIGNoZWNrQm94LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsICgpPT57XG4gICAgICAgICAgICAgICAgdG9kby5jb21wbGV0ZSA9ICF0b2RvLmNvbXBsZXRlO1xuICAgICAgICAgICAgICAgIFRvRG9NYW5hZ2VyLnVwZGF0ZVRvRG8odG9kby5pbmRleCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgdG9kb1RpdGxlICA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICAgICAgdG9kb1RpdGxlLmNsYXNzTGlzdC5hZGQoJ3RpdGxlJyk7XG4gICAgICAgICAgICB0b2RvVGl0bGUudGV4dENvbnRlbnQgPSB0b2RvLnRpdGxlO1xuICAgICAgICAgICAgdG9kb0VsZW0uYXBwZW5kQ2hpbGQodG9kb1RpdGxlKTtcblxuICAgICAgICAgICAgY29uc3QgZGx0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICBkbHRCdG4udGV4dENvbnRlbnQgPSAnREVMRVRFJztcbiAgICAgICAgICAgIGRsdEJ0bi5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywnZGVsZXRlJyk7XG4gICAgICAgICAgICBkbHRCdG4uaWQgPSB0b2RvLmluZGV4O1xuICAgICAgICAgICAgdG9kb0VsZW0uYXBwZW5kQ2hpbGQoZGx0QnRuKTtcblxuICAgICAgICAgICAgZGx0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKT0+IHtcbiAgICAgICAgICAgICAgICBUb0RvTWFuYWdlci5kZWxldGVUb0RvKHRvZG8uaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGVkaXRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGVkaXRCdG4udGV4dENvbnRlbnQgPSAnRURJVCc7XG4gICAgICAgICAgICBlZGl0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdlZGl0Jyk7XG4gICAgICAgICAgICBlZGl0QnRuLmlkID0gdG9kby5pbmRleDtcbiAgICAgICAgICAgIHRvZG9FbGVtLmFwcGVuZENoaWxkKGVkaXRCdG4pO1xuXG4gICAgICAgICAgICBlZGl0QnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoKT0+IHtcbiAgICAgICAgICAgICAgICBkaXNwbGF5RWxlbS50ZXh0Q29udGVudD0nJztcbiAgICAgICAgICAgICAgICBjb25zdCBuZXdUb0RvRm9ybSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zvcm0nKTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5zZXRBdHRyaWJ1dGUoJ2lkJywnbXlGb3JtJyk7XG4gICAgICAgICAgICAgICAgZGlzcGxheUVsZW0uYXBwZW5kQ2hpbGQobmV3VG9Eb0Zvcm0pO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ3RleHQnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCdpZCcsJ2Zvcm1JbnB1dCcpO1xuICAgICAgICAgICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgICAgICAgICAgZm9ybUlucHV0LnZhbHVlPXRvZG8udGl0bGU7XG4gICAgICAgICAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUlucHV0KTtcbiAgICAgICAgICAgICAgICBjb25zdCBmb3JtQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICAgICAgLy9mb3JtQnV0dG9uLnNldEF0dHJpYnV0ZSgndHlwZScsJ3N1Ym1pdCcpO1xuICAgICAgICAgICAgICAgIGZvcm1CdXR0b24udGV4dENvbnRlbnQgPSAnU1VCTUlUJztcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtQnV0dG9uKTtcblxuICAgICAgICAgICAgICAgIGZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSk9PiB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgdG9kby50aXRsZSA9IGZvcm1JbnB1dC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgICAgICAgICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICAgICAgICAgICAgICBUb0RvTWFuYWdlci51cGRhdGVUb0RvKHRvZG8uaW5kZXgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRvZG9saXN0LmFwcGVuZENoaWxkKHRvZG9FbGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59KSgpO1xuXG5leHBvcnQge3JlbmRlcn07IiwiaW1wb3J0IG5ld1Byb2plY3QgZnJvbSBcIi4vbWFrZVByb2plY3RcIjtcbmltcG9ydCB7IFByb2plY3RNYW5hZ2VyIH0gZnJvbSBcIi4vbWFuYWdlUHJvamVjdHNcIjtcbmltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5cbmNvbnN0IHJlbmRlclByb2plY3RzID0gKCgpPT4ge1xuXG4gICAgY29uc3Qgcm9vdEVsZW0gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjY29udGVudCcpO1xuXG4gICAgY29uc3QgbmV3UHJvamVjdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld1Byb2plY3RCdG4uY2xhc3NMaXN0LmFkZCgnbmV3UHJvamVjdEJ0bicpO1xuICAgIG5ld1Byb2plY3RCdG4udGV4dENvbnRlbnQ9J0FkZCBQcm9qZWN0JztcbiAgICByb290RWxlbS5hcHBlbmRDaGlsZChuZXdQcm9qZWN0QnRuKTtcblxuICAgIG5ld1Byb2plY3RCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBtYWtlRm9ybSk7XG5cbiAgICBjb25zdCBkaXNwbGF5UHJvamVjdHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXNwbGF5UHJvamVjdHMuY2xhc3NMaXN0LmFkZCgnZGlzcGxheVByb2plY3RzJyk7XG4gICAgcm9vdEVsZW0uYXBwZW5kQ2hpbGQoZGlzcGxheVByb2plY3RzKTtcblxuICAgIGZ1bmN0aW9uIG1ha2VGb3JtKCkge1xuICAgICAgICBkaXNwbGF5UHJvamVjdHMudGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIGNvbnN0IG5ld1Byb2plY3RGb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBuZXdQcm9qZWN0Rm9ybS5zZXRBdHRyaWJ1dGUoJ2lkJywnbXlGb3JtJyk7XG4gICAgICAgIGRpc3BsYXlQcm9qZWN0cy5hcHBlbmRDaGlsZChuZXdQcm9qZWN0Rm9ybSk7XG4gICAgICAgIGNvbnN0IGZvcm1JbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCd0ZXh0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywnZm9ybUlucHV0Jyk7XG4gICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ3JlcXVpcmVkJywnJyk7XG4gICAgICAgIG5ld1Byb2plY3RGb3JtLmFwcGVuZENoaWxkKGZvcm1JbnB1dCk7XG4gICAgICAgIGNvbnN0IGZvcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgZm9ybUJ1dHRvbi50ZXh0Q29udGVudCA9ICdTVUJNSVQnO1xuICAgICAgICBuZXdQcm9qZWN0Rm9ybS5hcHBlbmRDaGlsZChmb3JtQnV0dG9uKTtcblxuICAgICAgICBmb3JtQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywoZSk9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBhZGRQcm9qZWN0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIG1ha2VMaXN0RWxlbWVudCgpIHtcbiAgICAgICAgY29uc3QgcHJvamVjdExpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgcHJvamVjdExpc3QuY2xhc3NMaXN0LmFkZCgncHJvamVjdExpc3QnKTtcbiAgICAgICAgZGlzcGxheVByb2plY3RzLmFwcGVuZENoaWxkKHByb2plY3RMaXN0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQcm9qZWN0KCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0ID0gbmV3IG5ld1Byb2plY3QoKTtcbiAgICAgICAgcHJvamVjdC5uYW1lID0gZm9ybUlucHV0LnZhbHVlO1xuICAgICAgICBkaXNwbGF5UHJvamVjdHMudGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICBQcm9qZWN0TWFuYWdlci5hZGRQcm9qZWN0KHByb2plY3QpO1xuICAgIH1cbiAgICAvL2xvYWQgZGVmYXVsdCBwcm9qZWN0XG4gICAgKGZ1bmN0aW9uKCkge1xuICAgICAgICBtYWtlTGlzdEVsZW1lbnQoKTtcbiAgICAgICAgaW5pdGlhbExvYWQoUHJvamVjdE1hbmFnZXIuZ2V0UHJvamVjdExpc3QoKSk7XG4gICAgfSkoKTtcblxuICAgIC8vc3Vic2NyaWJlIHRvIHB1YnN1YiBldmVudFxuICAgIHB1YnN1Yi5zdWJzY3JpYmUoJ3Byb2plY3RzQ2hhbmdlZCcsaW5pdGlhbExvYWQpO1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbExvYWQocHJvamVjdEFycikge1xuICAgICAgICBjb25zdCBwcm9qZWN0TGlzdCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0TGlzdCcpO1xuICAgICAgICBwcm9qZWN0TGlzdC50ZXh0Q29udGVudD0nJztcbiAgICAgICAgcHJvamVjdEFyci5mb3JFYWNoKChwcm9qZWN0KT0+IHtcbiAgICAgICAgICAgIGNvbnN0IHByb2pFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwcm9qRWxlbS5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0Jyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHByb2pOYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICBwcm9qTmFtZS5jbGFzc0xpc3QuYWRkKCduYW1lJyk7XG4gICAgICAgICAgICBwcm9qTmFtZS50ZXh0Q29udGVudCA9IHByb2plY3QubmFtZTtcbiAgICAgICAgICAgIHByb2pFbGVtLmFwcGVuZENoaWxkKHByb2pOYW1lKTtcblxuICAgICAgICAgICAgcHJvak5hbWUuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT4ge1xuICAgICAgICAgICAgICAgIFByb2plY3RNYW5hZ2VyLnNlbGVjdFByb2plY3QocHJvamVjdC5pbmRleCk7XG4gICAgICAgICAgICB9KVxuXG4gICAgICAgICAgICBjb25zdCBkbHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGRsdEJ0bi50ZXh0Q29udGVudCA9ICdERUxFVEUnO1xuICAgICAgICAgICAgZGx0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdkZWxldGUnKTtcbiAgICAgICAgICAgIGRsdEJ0bi5pZCA9IHByb2plY3QuaW5kZXg7XG4gICAgICAgICAgICBwcm9qRWxlbS5hcHBlbmRDaGlsZChkbHRCdG4pO1xuXG4gICAgICAgICAgICBkbHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKT0+IHtcbiAgICAgICAgICAgICAgICBQcm9qZWN0TWFuYWdlci5kZWxldGVQcm9qZWN0KHByb2plY3QuaW5kZXgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByb2plY3RMaXN0LmFwcGVuZENoaWxkKHByb2pFbGVtKTtcbiAgICAgICAgfSk7XG4gICAgfVxufSkoKTtcblxuZXhwb3J0IHtyZW5kZXJQcm9qZWN0c307IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyByZW5kZXJQcm9qZWN0cyB9IGZyb20gXCIuL3JlbmRlclByb2plY3RzXCI7XG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tIFwiLi9yZW5kZXJcIjtcblxuXG5cblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9