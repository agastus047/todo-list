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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw0QkFBNEIsb0RBQVU7QUFDdEM7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzRUFBeUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsMEVBQTZCO0FBQ2pELEtBQUs7O0FBRUw7QUFDQSxJQUFJLHlEQUFnQjs7QUFFcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZ0JBQWdCLHlFQUE0QjtBQUM1QyxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxnQkFBZ0IseUVBQTRCO0FBQzVDLGFBQWE7O0FBRWI7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7Ozs7Ozs7O1VDOUZEO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7O1dDdEJBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EseUNBQXlDLHdDQUF3QztXQUNqRjtXQUNBO1dBQ0E7Ozs7O1dDUEE7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdEOzs7Ozs7Ozs7Ozs7O0FDTmtEO0FBQ2hCIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21ha2VQcm9qZWN0LmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYWtlVG9Eb3MuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21hbmFnZVByb2plY3RzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYW5hZ2VUb0Rvcy5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvcHVic3ViLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9yZW5kZXIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3JlbmRlclByb2plY3RzLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3RvZG8tbGlzdC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBuZXdQcm9qZWN0KG5hbWUpIHtcbiAgICB0aGlzLm5hbWU9bmFtZTtcbiAgICB0aGlzLmluZGV4O1xuICAgIHRoaXMucHJvamVjdFRvZG9zPVtdO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ld1Byb2plY3Q7IiwiZnVuY3Rpb24gbmV3SXRlbSh0aXRsZSxkZXNjcmlwdGlvbixkdWVEYXRlLHByaW9yaXR5KSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLmNvbXBsZXRlID0gZmFsc2U7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ld0l0ZW07IiwiaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCBuZXdQcm9qZWN0IGZyb20gXCIuL21ha2VQcm9qZWN0XCI7XG5cbmNvbnN0IFByb2plY3RNYW5hZ2VyID0gKCgpPT4ge1xuICAgIGxldCBwcm9qZWN0TGlzdCA9IFtdO1xuXG4gICAgbGV0IGRlZmF1bHRQcm9qZWN0ID0gbmV3IG5ld1Byb2plY3QoJ2RlZmF1bHQnKTtcblxuICAgIGxldCBjdXJyZW50UHJvamVjdCA9IGRlZmF1bHRQcm9qZWN0O1xuICAgIGFkZFByb2plY3QoZGVmYXVsdFByb2plY3QpO1xuXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFByb2plY3QoKSB7XG4gICAgICAgIHJldHVybiBjdXJyZW50UHJvamVjdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0TGlzdCgpIHtcbiAgICAgICAgcmV0dXJuIHByb2plY3RMaXN0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb2plY3QobmV3cHJvaikge1xuICAgICAgICBuZXdwcm9qLmluZGV4ID0gcHJvamVjdExpc3QubGVuZ3RoO1xuICAgICAgICBwcm9qZWN0TGlzdC5wdXNoKG5ld3Byb2opO1xuICAgICAgICBwdWJzdWIucHVibGlzaCgncHJvamVjdHNDaGFuZ2VkJyxwcm9qZWN0TGlzdCk7XG4gICAgfVxuICAgIC8vY2hlY2sgY29uZGl0aW9uIHdoZW4gY3VycmVudCBwcm9qZWN0IGlzIGRlbGV0ZWRcbiAgICAvL29yIG1ha2Ugc3VyZSBjdXJyZW50IHByb2plY3QgaXMgbmV2ZXIgZGVsZXRlZFxuICAgIGZ1bmN0aW9uIGRlbGV0ZVByb2plY3QoaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdExpc3QgPSBwcm9qZWN0TGlzdC5maWx0ZXIoKHByb2plY3QpID0+IHByb2plY3QuaW5kZXggIT09IGluZGV4KTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxwcm9qZWN0TGlzdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICBwcm9qZWN0TGlzdFtpXS5pbmRleCA9IGk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudFByb2plY3QgPSBkZWZhdWx0UHJvamVjdDtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgICAgICBwdWJzdWIucHVibGlzaChcInByb2plY3RzQ2hhbmdlZFwiLHByb2plY3RMaXN0KTtcbiAgIH1cblxuICAgZnVuY3Rpb24gc2VsZWN0UHJvamVjdChpbmRleCkge1xuICAgICAgICBjdXJyZW50UHJvamVjdCA9IHByb2plY3RMaXN0W2luZGV4XTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goJ2N1cnJlbnRQcm9qZWN0Q2hhbmdlZCcsY3VycmVudFByb2plY3QpO1xuICAgfVxuXG4gICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgIHB1YnN1Yi5zdWJzY3JpYmUoJ2xpc3RDaGFuZ2VkJyx1cGRhdGVDdXJyZW50UHJvamVjdCk7XG5cbiAgIGZ1bmN0aW9uIHVwZGF0ZUN1cnJlbnRQcm9qZWN0KG5ld0xpc3QpIHtcbiAgICAgICAgY3VycmVudFByb2plY3QucHJvamVjdFRvZG9zID0gbmV3TGlzdDtcbiAgICAgICAgcHJvamVjdExpc3QgPSBwcm9qZWN0TGlzdC5tYXAoKHByb2plY3QpPT4gcHJvamVjdC5pbmRleCA9PT0gY3VycmVudFByb2plY3QuaW5kZXggPyBjdXJyZW50UHJvamVjdDogcHJvamVjdCk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKCdwcm9qZWN0c0NoYW5nZWQnLHByb2plY3RMaXN0KVxuXG4gICB9XG5cbiAgIHJldHVybiB7Z2V0UHJvamVjdExpc3QsIGdldEN1cnJlbnRQcm9qZWN0LCBhZGRQcm9qZWN0LCBkZWxldGVQcm9qZWN0LCBzZWxlY3RQcm9qZWN0fTtcbn0pKCk7XG5cbmV4cG9ydCB7UHJvamVjdE1hbmFnZXJ9OyIsImltcG9ydCBwdWJzdWIgZnJvbSBcIi4vcHVic3ViXCI7XG5pbXBvcnQgeyBQcm9qZWN0TWFuYWdlciB9IGZyb20gXCIuL21hbmFnZVByb2plY3RzXCI7XG5cbmNvbnN0IFRvRG9NYW5hZ2VyID0gKCgpPT4ge1xuICAgIGxldCBwcm9qZWN0ID0gUHJvamVjdE1hbmFnZXIuZ2V0Q3VycmVudFByb2plY3QoKS5wcm9qZWN0VG9kb3M7XG5cbiAgICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgICAgcHVic3ViLnN1YnNjcmliZSgnY3VycmVudFByb2plY3RDaGFuZ2VkJyxzZWxlY3RQcm9qZWN0KTtcblxuICAgICBmdW5jdGlvbiBzZWxlY3RQcm9qZWN0KGN1cnJlbnRQcm9qZWN0KSB7XG4gICAgICAgICAgcHJvamVjdCA9IGN1cnJlbnRQcm9qZWN0LnByb2plY3RUb2RvcztcbiAgICAgICAgICBwdWJzdWIucHVibGlzaCgnbGlzdENoYW5nZWQnLHByb2plY3QpO1xuICAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9qZWN0KCkge1xuICAgICAgICAgIHJldHVybiBwcm9qZWN0O1xuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRUb0RvKG5ld1RvRG8pIHtcbiAgICAgICAgbmV3VG9Eby5pbmRleCA9IHByb2plY3QubGVuZ3RoO1xuICAgICAgICBwcm9qZWN0LnB1c2gobmV3VG9Ebyk7XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwibGlzdENoYW5nZWRcIixwcm9qZWN0KTtcbiAgICB9XG5cbiAgIGZ1bmN0aW9uIGRlbGV0ZVRvRG8oaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdCA9IHByb2plY3QuZmlsdGVyKCh0b2RvKSA9PiB0b2RvLmluZGV4ICE9PSBpbmRleCk7XG4gICAgICAgIGZvcihsZXQgaT0wO2k8cHJvamVjdC5sZW5ndGg7aSsrKXtcbiAgICAgICAgICBwcm9qZWN0W2ldLmluZGV4ID0gaTtcbiAgICAgICAgfVxuICAgICAgICBwdWJzdWIucHVibGlzaChcImxpc3RDaGFuZ2VkXCIscHJvamVjdCk7XG4gICB9XG5cbiAgIGZ1bmN0aW9uIHVwZGF0ZVRvRG8oaW5kZXgpIHtcbiAgICAgICAgcHJvamVjdCA9IHByb2plY3QubWFwKCh0b2RvKT0+IHRvZG8uaW5kZXggPT09IGluZGV4ID8gdG9kbyA6IHRvZG8sKTsvL3tpbmRleDogdG9kby5pbmRleCwgdGl0bGU6IHRvZG8udGl0bGUsIGNvbXBsZXRlOiB0b2RvLmNvbXBsZXRlfSA6IHRvZG8sKTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJsaXN0Q2hhbmdlZFwiLHByb2plY3QpO1xuICAgfVxuICAgcmV0dXJuIHtnZXRQcm9qZWN0LCBhZGRUb0RvLCBkZWxldGVUb0RvLCB1cGRhdGVUb0RvfTtcbn0pKCk7XG5cbmV4cG9ydCB7VG9Eb01hbmFnZXJ9OyIsImNvbnN0IHB1YnN1YiA9IChmdW5jdGlvbiAoKSB7XG4gICAgLy8gaG9sZHMgZXZlbnQ6IGFycmF5b2ZjYWxsYmFja3MgcGFpcnNcbiAgICBjb25zdCBldmVudHMgPSB7fTtcbiAgXG4gICAgZnVuY3Rpb24gc3Vic2NyaWJlKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkgZXZlbnRzW2V2ZW50XS5wdXNoKGhhbmRsZXIpO1xuICAgICAgZWxzZSBldmVudHNbZXZlbnRdID0gW2hhbmRsZXJdO1xuICAgIH1cbiAgXG4gICAgZnVuY3Rpb24gcHVibGlzaChldmVudCwgYXJncykge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgZm9yIChjb25zdCBoYW5kbGVyIG9mIGV2ZW50c1tldmVudF0pIHtcbiAgICAgICAgICBoYW5kbGVyKGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiB1bnN1YnNjcmliZShldmVudCwgaGFuZGxlcikge1xuICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShldmVudCkpIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSBldmVudHNbZXZlbnRdLmluZGV4T2YoaGFuZGxlcik7XG4gICAgICAgIGlmIChpbmRleCA+PSAwKSBldmVudHNbZXZlbnRdLnNwbGljZShpbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuICBcbiAgICByZXR1cm4geyBzdWJzY3JpYmUsIHB1Ymxpc2gsIHVuc3Vic2NyaWJlIH07XG4gIH0pKCk7XG4gIFxuICBleHBvcnQgZGVmYXVsdCBwdWJzdWI7IiwiaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcbmltcG9ydCBuZXdJdGVtIGZyb20gXCIuL21ha2VUb0Rvc1wiO1xuaW1wb3J0IHsgVG9Eb01hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2VUb0Rvc1wiO1xuXG5jb25zdCByZW5kZXIgPSAoZnVuY3Rpb24oKSB7XG5cbiAgICBjb25zdCByb290RWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50Jyk7XG4gICAgXG4gICAgY29uc3QgbmV3VG9Eb0J0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgIG5ld1RvRG9CdG4uY2xhc3NMaXN0LmFkZCgnbmV3VG9kb0J0bicpO1xuICAgIG5ld1RvRG9CdG4udGV4dENvbnRlbnQ9J0FkZCBUby1Ebyc7XG5cbiAgICBuZXdUb0RvQnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJyxtYWtlRm9ybSk7XG5cbiAgICByb290RWxlbS5hcHBlbmRDaGlsZChuZXdUb0RvQnRuKTtcblxuICAgIGNvbnN0IGRpc3BsYXlFbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGlzcGxheUVsZW0uY2xhc3NMaXN0LmFkZCgnZGlzcGxheUVsZW0nKTtcbiAgICByb290RWxlbS5hcHBlbmRDaGlsZChkaXNwbGF5RWxlbSk7XG5cbiAgICBmdW5jdGlvbiBtYWtlRm9ybSgpIHtcbiAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIGNvbnN0IG5ld1RvRG9Gb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICBuZXdUb0RvRm9ybS5zZXRBdHRyaWJ1dGUoJ2lkJywnbXlGb3JtJyk7XG4gICAgICAgIGRpc3BsYXlFbGVtLmFwcGVuZENoaWxkKG5ld1RvRG9Gb3JtKTtcbiAgICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ3RleHQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdmb3JtSW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCcnKTtcbiAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUlucHV0KTtcbiAgICAgICAgY29uc3QgZm9ybUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAvL2Zvcm1CdXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywnc3VibWl0Jyk7XG4gICAgICAgIGZvcm1CdXR0b24udGV4dENvbnRlbnQgPSAnU1VCTUlUJztcbiAgICAgICAgbmV3VG9Eb0Zvcm0uYXBwZW5kQ2hpbGQoZm9ybUJ1dHRvbik7XG5cbiAgICAgICAgZm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGFkZEl0ZW0oKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUxpc3RFbGVtZW50KCkge1xuICAgICAgICBjb25zdCB0b2RvbGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0b2RvbGlzdC5jbGFzc0xpc3QuYWRkKCd0b2RvbGlzdCcpO1xuICAgICAgICBkaXNwbGF5RWxlbS5hcHBlbmRDaGlsZCh0b2RvbGlzdCk7XG4gICAgfVxuXG5cbiAgICBmdW5jdGlvbiBhZGRJdGVtKCkge1xuICAgICAgICBjb25zdCB0b2RvID0gbmV3IG5ld0l0ZW0oKTtcbiAgICAgICAgdG9kby50aXRsZSA9IGZvcm1JbnB1dC52YWx1ZTtcbiAgICAgICAgZGlzcGxheUVsZW0udGV4dENvbnRlbnQ9Jyc7XG4gICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICBUb0RvTWFuYWdlci5hZGRUb0RvKHRvZG8pO1xuICAgIH1cbiAgICBcbiAgICAvL3N1YnNjcmliZSB0byBwdWJzdWIgZXZlbnRcbiAgICBwdWJzdWIuc3Vic2NyaWJlKFwibGlzdENoYW5nZWRcIixpbml0aWFsTG9hZCk7XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsTG9hZChsaXN0KSB7XG4gICAgICAgIGNvbnN0IHRvZG9saXN0PWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50b2RvbGlzdCcpO1xuICAgICAgICB0b2RvbGlzdC50ZXh0Q29udGVudCA9ICcnO1xuICAgICAgICBsaXN0LmZvckVhY2goKHRvZG8pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRvZG9FbGVtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0b2RvRWxlbS5jbGFzc0xpc3QuYWRkKCd0b2RvJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IGNoZWNrQm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgIGNoZWNrQm94LnNldEF0dHJpYnV0ZSgndHlwZScsJ2NoZWNrYm94Jyk7XG4gICAgICAgICAgICBjaGVja0JveC5jbGFzc0xpc3QuYWRkKCdjaGVja0JveCcpO1xuICAgICAgICAgICAgaWYodG9kby5jb21wbGV0ZSlcbiAgICAgICAgICAgICAgICBjaGVja0JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIHRvZG9FbGVtLmFwcGVuZENoaWxkKGNoZWNrQm94KTtcblxuICAgICAgICAgICAgY2hlY2tCb3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKCk9PntcbiAgICAgICAgICAgICAgICB0b2RvLmNvbXBsZXRlID0gIXRvZG8uY29tcGxldGU7XG4gICAgICAgICAgICAgICAgVG9Eb01hbmFnZXIudXBkYXRlVG9Ebyh0b2RvLmluZGV4KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBjb25zdCB0b2RvVGl0bGUgID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0b2RvVGl0bGUuY2xhc3NMaXN0LmFkZCgndGl0bGUnKTtcbiAgICAgICAgICAgIHRvZG9UaXRsZS50ZXh0Q29udGVudCA9IHRvZG8udGl0bGU7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZCh0b2RvVGl0bGUpO1xuXG4gICAgICAgICAgICBjb25zdCBkbHRCdG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGRsdEJ0bi50ZXh0Q29udGVudCA9ICdERUxFVEUnO1xuICAgICAgICAgICAgZGx0QnRuLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCdkZWxldGUnKTtcbiAgICAgICAgICAgIGRsdEJ0bi5pZCA9IHRvZG8uaW5kZXg7XG4gICAgICAgICAgICB0b2RvRWxlbS5hcHBlbmRDaGlsZChkbHRCdG4pO1xuXG4gICAgICAgICAgICBkbHRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT4ge1xuICAgICAgICAgICAgICAgIFRvRG9NYW5hZ2VyLmRlbGV0ZVRvRG8odG9kby5pbmRleCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgY29uc3QgZWRpdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgZWRpdEJ0bi50ZXh0Q29udGVudCA9ICdFRElUJztcbiAgICAgICAgICAgIGVkaXRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsJ2VkaXQnKTtcbiAgICAgICAgICAgIGVkaXRCdG4uaWQgPSB0b2RvLmluZGV4O1xuICAgICAgICAgICAgdG9kb0VsZW0uYXBwZW5kQ2hpbGQoZWRpdEJ0bik7XG5cbiAgICAgICAgICAgIGVkaXRCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCgpPT4ge1xuICAgICAgICAgICAgICAgIGRpc3BsYXlFbGVtLnRleHRDb250ZW50PScnO1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1RvRG9Gb3JtID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZm9ybScpO1xuICAgICAgICAgICAgICAgIG5ld1RvRG9Gb3JtLnNldEF0dHJpYnV0ZSgnaWQnLCdteUZvcm0nKTtcbiAgICAgICAgICAgICAgICBkaXNwbGF5RWxlbS5hcHBlbmRDaGlsZChuZXdUb0RvRm9ybSk7XG4gICAgICAgICAgICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywndGV4dCcpO1xuICAgICAgICAgICAgICAgIGZvcm1JbnB1dC5zZXRBdHRyaWJ1dGUoJ2lkJywnZm9ybUlucHV0Jyk7XG4gICAgICAgICAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCcnKTtcbiAgICAgICAgICAgICAgICBmb3JtSW5wdXQudmFsdWU9dG9kby50aXRsZTtcbiAgICAgICAgICAgICAgICBuZXdUb0RvRm9ybS5hcHBlbmRDaGlsZChmb3JtSW5wdXQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZvcm1CdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgICAgICAvL2Zvcm1CdXR0b24uc2V0QXR0cmlidXRlKCd0eXBlJywnc3VibWl0Jyk7XG4gICAgICAgICAgICAgICAgZm9ybUJ1dHRvbi50ZXh0Q29udGVudCA9ICdTVUJNSVQnO1xuICAgICAgICAgICAgICAgIG5ld1RvRG9Gb3JtLmFwcGVuZENoaWxkKGZvcm1CdXR0b24pO1xuXG4gICAgICAgICAgICAgICAgZm9ybUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKT0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICB0b2RvLnRpdGxlID0gZm9ybUlucHV0LnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBkaXNwbGF5RWxlbS50ZXh0Q29udGVudD0nJztcbiAgICAgICAgICAgICAgICAgICAgbWFrZUxpc3RFbGVtZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIFRvRG9NYW5hZ2VyLnVwZGF0ZVRvRG8odG9kby5pbmRleCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdG9kb2xpc3QuYXBwZW5kQ2hpbGQodG9kb0VsZW0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbn0pKCk7XG5cbmV4cG9ydCB7cmVuZGVyfTsiLCJpbXBvcnQgbmV3UHJvamVjdCBmcm9tIFwiLi9tYWtlUHJvamVjdFwiO1xuaW1wb3J0IHsgUHJvamVjdE1hbmFnZXIgfSBmcm9tIFwiLi9tYW5hZ2VQcm9qZWN0c1wiO1xuaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcblxuY29uc3QgcmVuZGVyUHJvamVjdHMgPSAoKCk9PiB7XG5cbiAgICBjb25zdCByb290RWxlbSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNjb250ZW50Jyk7XG5cbiAgICBjb25zdCBuZXdQcm9qZWN0QnRuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgbmV3UHJvamVjdEJ0bi5jbGFzc0xpc3QuYWRkKCduZXdQcm9qZWN0QnRuJyk7XG4gICAgbmV3UHJvamVjdEJ0bi50ZXh0Q29udGVudD0nQWRkIFByb2plY3QnO1xuICAgIHJvb3RFbGVtLmFwcGVuZENoaWxkKG5ld1Byb2plY3RCdG4pO1xuXG4gICAgbmV3UHJvamVjdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG1ha2VGb3JtKTtcblxuICAgIGNvbnN0IGRpc3BsYXlQcm9qZWN0cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpc3BsYXlQcm9qZWN0cy5jbGFzc0xpc3QuYWRkKCdkaXNwbGF5UHJvamVjdHMnKTtcbiAgICByb290RWxlbS5hcHBlbmRDaGlsZChkaXNwbGF5UHJvamVjdHMpO1xuXG4gICAgZnVuY3Rpb24gbWFrZUZvcm0oKSB7XG4gICAgICAgIGRpc3BsYXlQcm9qZWN0cy50ZXh0Q29udGVudD0nJztcbiAgICAgICAgY29uc3QgbmV3UHJvamVjdEZvcm0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmb3JtJyk7XG4gICAgICAgIG5ld1Byb2plY3RGb3JtLnNldEF0dHJpYnV0ZSgnaWQnLCdteUZvcm0nKTtcbiAgICAgICAgZGlzcGxheVByb2plY3RzLmFwcGVuZENoaWxkKG5ld1Byb2plY3RGb3JtKTtcbiAgICAgICAgY29uc3QgZm9ybUlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsJ3RleHQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgnaWQnLCdmb3JtSW5wdXQnKTtcbiAgICAgICAgZm9ybUlucHV0LnNldEF0dHJpYnV0ZSgncmVxdWlyZWQnLCcnKTtcbiAgICAgICAgbmV3UHJvamVjdEZvcm0uYXBwZW5kQ2hpbGQoZm9ybUlucHV0KTtcbiAgICAgICAgY29uc3QgZm9ybUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICBmb3JtQnV0dG9uLnRleHRDb250ZW50ID0gJ1NVQk1JVCc7XG4gICAgICAgIG5ld1Byb2plY3RGb3JtLmFwcGVuZENoaWxkKGZvcm1CdXR0b24pO1xuXG4gICAgICAgIGZvcm1CdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLChlKT0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGFkZFByb2plY3QoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbWFrZUxpc3RFbGVtZW50KCkge1xuICAgICAgICBjb25zdCBwcm9qZWN0TGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBwcm9qZWN0TGlzdC5jbGFzc0xpc3QuYWRkKCdwcm9qZWN0TGlzdCcpO1xuICAgICAgICBkaXNwbGF5UHJvamVjdHMuYXBwZW5kQ2hpbGQocHJvamVjdExpc3QpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFkZFByb2plY3QoKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3QgPSBuZXcgbmV3UHJvamVjdCgpO1xuICAgICAgICBwcm9qZWN0Lm5hbWUgPSBmb3JtSW5wdXQudmFsdWU7XG4gICAgICAgIGRpc3BsYXlQcm9qZWN0cy50ZXh0Q29udGVudD0nJztcbiAgICAgICAgbWFrZUxpc3RFbGVtZW50KCk7XG4gICAgICAgIFByb2plY3RNYW5hZ2VyLmFkZFByb2plY3QocHJvamVjdCk7XG4gICAgfVxuICAgIC8vbG9hZCBkZWZhdWx0IHByb2plY3RcbiAgICAoZnVuY3Rpb24oKSB7XG4gICAgICAgIG1ha2VMaXN0RWxlbWVudCgpO1xuICAgICAgICBpbml0aWFsTG9hZChQcm9qZWN0TWFuYWdlci5nZXRQcm9qZWN0TGlzdCgpKTtcbiAgICB9KSgpO1xuXG4gICAgLy9zdWJzY3JpYmUgdG8gcHVic3ViIGV2ZW50XG4gICAgcHVic3ViLnN1YnNjcmliZSgncHJvamVjdHNDaGFuZ2VkJyxpbml0aWFsTG9hZCk7XG5cbiAgICBmdW5jdGlvbiBpbml0aWFsTG9hZChwcm9qZWN0QXJyKSB7XG4gICAgICAgIGNvbnN0IHByb2plY3RMaXN0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RMaXN0Jyk7XG4gICAgICAgIHByb2plY3RMaXN0LnRleHRDb250ZW50PScnO1xuICAgICAgICBwcm9qZWN0QXJyLmZvckVhY2goKHByb2plY3QpPT4ge1xuICAgICAgICAgICAgY29uc3QgcHJvakVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHByb2pFbGVtLmNsYXNzTGlzdC5hZGQoJ3Byb2plY3QnKTtcblxuICAgICAgICAgICAgY29uc3QgcHJvak5hbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICAgIHByb2pOYW1lLmNsYXNzTGlzdC5hZGQoJ25hbWUnKTtcbiAgICAgICAgICAgIHByb2pOYW1lLnRleHRDb250ZW50ID0gcHJvamVjdC5uYW1lO1xuICAgICAgICAgICAgcHJvakVsZW0uYXBwZW5kQ2hpbGQocHJvak5hbWUpO1xuXG4gICAgICAgICAgICBwcm9qTmFtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsKCk9PiB7XG4gICAgICAgICAgICAgICAgUHJvamVjdE1hbmFnZXIuc2VsZWN0UHJvamVjdChwcm9qZWN0LmluZGV4KTtcbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICAgIGNvbnN0IGRsdEJ0biA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgZGx0QnRuLnRleHRDb250ZW50ID0gJ0RFTEVURSc7XG4gICAgICAgICAgICBkbHRCdG4uc2V0QXR0cmlidXRlKCdjbGFzcycsJ2RlbGV0ZScpO1xuICAgICAgICAgICAgZGx0QnRuLmlkID0gcHJvamVjdC5pbmRleDtcbiAgICAgICAgICAgIHByb2pFbGVtLmFwcGVuZENoaWxkKGRsdEJ0bik7XG5cbiAgICAgICAgICAgIGRsdEJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpPT4ge1xuICAgICAgICAgICAgICAgIFByb2plY3RNYW5hZ2VyLmRlbGV0ZVByb2plY3QocHJvamVjdC5pbmRleCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJvamVjdExpc3QuYXBwZW5kQ2hpbGQocHJvakVsZW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgLy9kaXNhYmxpbmcgZGVsZXRlIGJ1dHRvbiBvZiBkZWZhdWx0IHByb2plY3RcbiAgICAgICAgY29uc3QgZGVmYXVsdERsdEJ0biA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0TGlzdCAucHJvamVjdDpmaXJzdC1jaGlsZCBidXR0b25baWQ9XCIwXCJdJyk7XG4gICAgICAgIGRlZmF1bHREbHRCdG4uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsJycpO1xuICAgIH1cbiAgICBcbn0pKCk7XG5cbmV4cG9ydCB7cmVuZGVyUHJvamVjdHN9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgcmVuZGVyUHJvamVjdHMgfSBmcm9tIFwiLi9yZW5kZXJQcm9qZWN0c1wiO1xuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSBcIi4vcmVuZGVyXCI7XG5cblxuXG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=