/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/makeToDos.js":
/*!**************************!*\
  !*** ./src/makeToDos.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function newItem(title,description,dueDate,priority,complete) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
    this.complete = complete;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (newItem);

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


const ToDoManager = (()=> {
    let project = [];

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
        project = project.map((todo)=> todo.index === index ? {index: todo.index, title: todo.title, complete: !todo.complete} : todo,);
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


const render = (function() {
    _pubsub__WEBPACK_IMPORTED_MODULE_0__["default"].subscribe("listChanged",initialLoad);

    function initialLoad(list) {
        list.forEach((todo) => {
            //console.log(todo.title);
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
/* harmony import */ var _render__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./render */ "./src/render.js");
/* harmony import */ var _makeToDos__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./makeToDos */ "./src/makeToDos.js");
/* harmony import */ var _manageToDos__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./manageToDos */ "./src/manageToDos.js");




let todo1 = new _makeToDos__WEBPACK_IMPORTED_MODULE_1__["default"]();
todo1.title = "Todo 1";
todo1.complete = false;
let todo2 = new _makeToDos__WEBPACK_IMPORTED_MODULE_1__["default"]();
todo2.title = "Todo 2";
let todo3 = new _makeToDos__WEBPACK_IMPORTED_MODULE_1__["default"]();
todo3.title = "Todo 3";

_manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.addToDo(todo1);

_manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.addToDo(todo2);

_manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.addToDo(todo3);
//console.log(ToDoManager.getProject());
_manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.deleteToDo(todo2.index);
//console.log(ToDoManager.getProject());
_manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.updateToDo(todo1.index);
console.log(_manageToDos__WEBPACK_IMPORTED_MODULE_2__.ToDoManager.getProject());





})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFQUFlLE9BQU87Ozs7Ozs7Ozs7Ozs7OztBQ1JROztBQUU5QjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsdURBQWM7QUFDdEI7O0FBRUE7QUFDQTtBQUNBLG9CQUFvQixpQkFBaUI7QUFDckM7QUFDQTtBQUNBLFFBQVEsdURBQWM7QUFDdEI7O0FBRUE7QUFDQSwrREFBK0QsZ0VBQWdFO0FBQy9ILFFBQVEsdURBQWM7QUFDdEI7QUFDQSxXQUFXO0FBQ1gsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQzNCRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsR0FBRztBQUNIO0FBQ0EsRUFBRSxpRUFBZSxNQUFNOzs7Ozs7Ozs7Ozs7Ozs7QUMzQk87O0FBRTlCO0FBQ0EsSUFBSSx5REFBZ0I7O0FBRXBCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLENBQUM7Ozs7Ozs7O1VDVkQ7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7Ozs7Ozs7Ozs7O0FDTmtDO0FBQ0E7QUFDVTs7QUFFNUMsZ0JBQWdCLGtEQUFPO0FBQ3ZCO0FBQ0E7QUFDQSxnQkFBZ0Isa0RBQU87QUFDdkI7QUFDQSxnQkFBZ0Isa0RBQU87QUFDdkI7O0FBRUEsNkRBQW1COztBQUVuQiw2REFBbUI7O0FBRW5CLDZEQUFtQjtBQUNuQjtBQUNBLGdFQUFzQjtBQUN0QjtBQUNBLGdFQUFzQjtBQUN0QixZQUFZLGdFQUFzQiIsInNvdXJjZXMiOlsid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9tYWtlVG9Eb3MuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL21hbmFnZVRvRG9zLmpzIiwid2VicGFjazovL3RvZG8tbGlzdC8uL3NyYy9wdWJzdWIuanMiLCJ3ZWJwYWNrOi8vdG9kby1saXN0Ly4vc3JjL3JlbmRlci5qcyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vdG9kby1saXN0L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly90b2RvLWxpc3Qvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly90b2RvLWxpc3QvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbmV3SXRlbSh0aXRsZSxkZXNjcmlwdGlvbixkdWVEYXRlLHByaW9yaXR5LGNvbXBsZXRlKSB7XG4gICAgdGhpcy50aXRsZSA9IHRpdGxlO1xuICAgIHRoaXMuZGVzY3JpcHRpb24gPSBkZXNjcmlwdGlvbjtcbiAgICB0aGlzLmR1ZURhdGUgPSBkdWVEYXRlO1xuICAgIHRoaXMucHJpb3JpdHkgPSBwcmlvcml0eTtcbiAgICB0aGlzLmNvbXBsZXRlID0gY29tcGxldGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ld0l0ZW07IiwiaW1wb3J0IHB1YnN1YiBmcm9tIFwiLi9wdWJzdWJcIjtcblxuY29uc3QgVG9Eb01hbmFnZXIgPSAoKCk9PiB7XG4gICAgbGV0IHByb2plY3QgPSBbXTtcblxuICAgIGZ1bmN0aW9uIGdldFByb2plY3QoKSB7XG4gICAgICAgICAgcmV0dXJuIHByb2plY3Q7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGFkZFRvRG8obmV3VG9Ebykge1xuICAgICAgICBuZXdUb0RvLmluZGV4ID0gcHJvamVjdC5sZW5ndGg7XG4gICAgICAgIHByb2plY3QucHVzaChuZXdUb0RvKTtcbiAgICAgICAgcHVic3ViLnB1Ymxpc2goXCJsaXN0Q2hhbmdlZFwiLHByb2plY3QpO1xuICAgIH1cblxuICAgZnVuY3Rpb24gZGVsZXRlVG9EbyhpbmRleCkge1xuICAgICAgICBwcm9qZWN0ID0gcHJvamVjdC5maWx0ZXIoKHRvZG8pID0+IHRvZG8uaW5kZXggIT09IGluZGV4KTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxwcm9qZWN0Lmxlbmd0aDtpKyspe1xuICAgICAgICAgIHByb2plY3RbaV0uaW5kZXggPSBpO1xuICAgICAgICB9XG4gICAgICAgIHB1YnN1Yi5wdWJsaXNoKFwibGlzdENoYW5nZWRcIixwcm9qZWN0KTtcbiAgIH1cblxuICAgZnVuY3Rpb24gdXBkYXRlVG9EbyhpbmRleCkge1xuICAgICAgICBwcm9qZWN0ID0gcHJvamVjdC5tYXAoKHRvZG8pPT4gdG9kby5pbmRleCA9PT0gaW5kZXggPyB7aW5kZXg6IHRvZG8uaW5kZXgsIHRpdGxlOiB0b2RvLnRpdGxlLCBjb21wbGV0ZTogIXRvZG8uY29tcGxldGV9IDogdG9kbywpO1xuICAgICAgICBwdWJzdWIucHVibGlzaChcImxpc3RDaGFuZ2VkXCIscHJvamVjdCk7XG4gICB9XG4gICByZXR1cm4ge2dldFByb2plY3QsIGFkZFRvRG8sIGRlbGV0ZVRvRG8sIHVwZGF0ZVRvRG99O1xufSkoKTtcblxuZXhwb3J0IHtUb0RvTWFuYWdlcn07IiwiY29uc3QgcHVic3ViID0gKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBob2xkcyBldmVudDogYXJyYXlvZmNhbGxiYWNrcyBwYWlyc1xuICAgIGNvbnN0IGV2ZW50cyA9IHt9O1xuICBcbiAgICBmdW5jdGlvbiBzdWJzY3JpYmUoZXZlbnQsIGhhbmRsZXIpIHtcbiAgICAgIGlmIChldmVudHMuaGFzT3duUHJvcGVydHkoZXZlbnQpKSBldmVudHNbZXZlbnRdLnB1c2goaGFuZGxlcik7XG4gICAgICBlbHNlIGV2ZW50c1tldmVudF0gPSBbaGFuZGxlcl07XG4gICAgfVxuICBcbiAgICBmdW5jdGlvbiBwdWJsaXNoKGV2ZW50LCBhcmdzKSB7XG4gICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgICBmb3IgKGNvbnN0IGhhbmRsZXIgb2YgZXZlbnRzW2V2ZW50XSkge1xuICAgICAgICAgIGhhbmRsZXIoYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIFxuICAgIGZ1bmN0aW9uIHVuc3Vic2NyaWJlKGV2ZW50LCBoYW5kbGVyKSB7XG4gICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGV2ZW50KSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IGV2ZW50c1tldmVudF0uaW5kZXhPZihoYW5kbGVyKTtcbiAgICAgICAgaWYgKGluZGV4ID49IDApIGV2ZW50c1tldmVudF0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIFxuICAgIHJldHVybiB7IHN1YnNjcmliZSwgcHVibGlzaCwgdW5zdWJzY3JpYmUgfTtcbiAgfSkoKTtcbiAgXG4gIGV4cG9ydCBkZWZhdWx0IHB1YnN1YjsiLCJpbXBvcnQgcHVic3ViIGZyb20gXCIuL3B1YnN1YlwiO1xuXG5jb25zdCByZW5kZXIgPSAoZnVuY3Rpb24oKSB7XG4gICAgcHVic3ViLnN1YnNjcmliZShcImxpc3RDaGFuZ2VkXCIsaW5pdGlhbExvYWQpO1xuXG4gICAgZnVuY3Rpb24gaW5pdGlhbExvYWQobGlzdCkge1xuICAgICAgICBsaXN0LmZvckVhY2goKHRvZG8pID0+IHtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2codG9kby50aXRsZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0pKCk7XG5cbmV4cG9ydCB7cmVuZGVyfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsImltcG9ydCB7IHJlbmRlciB9IGZyb20gXCIuL3JlbmRlclwiO1xuaW1wb3J0IG5ld0l0ZW0gZnJvbSBcIi4vbWFrZVRvRG9zXCI7XG5pbXBvcnQgeyBUb0RvTWFuYWdlciB9IGZyb20gXCIuL21hbmFnZVRvRG9zXCI7XG5cbmxldCB0b2RvMSA9IG5ldyBuZXdJdGVtKCk7XG50b2RvMS50aXRsZSA9IFwiVG9kbyAxXCI7XG50b2RvMS5jb21wbGV0ZSA9IGZhbHNlO1xubGV0IHRvZG8yID0gbmV3IG5ld0l0ZW0oKTtcbnRvZG8yLnRpdGxlID0gXCJUb2RvIDJcIjtcbmxldCB0b2RvMyA9IG5ldyBuZXdJdGVtKCk7XG50b2RvMy50aXRsZSA9IFwiVG9kbyAzXCI7XG5cblRvRG9NYW5hZ2VyLmFkZFRvRG8odG9kbzEpO1xuXG5Ub0RvTWFuYWdlci5hZGRUb0RvKHRvZG8yKTtcblxuVG9Eb01hbmFnZXIuYWRkVG9Ebyh0b2RvMyk7XG4vL2NvbnNvbGUubG9nKFRvRG9NYW5hZ2VyLmdldFByb2plY3QoKSk7XG5Ub0RvTWFuYWdlci5kZWxldGVUb0RvKHRvZG8yLmluZGV4KTtcbi8vY29uc29sZS5sb2coVG9Eb01hbmFnZXIuZ2V0UHJvamVjdCgpKTtcblRvRG9NYW5hZ2VyLnVwZGF0ZVRvRG8odG9kbzEuaW5kZXgpO1xuY29uc29sZS5sb2coVG9Eb01hbmFnZXIuZ2V0UHJvamVjdCgpKTtcblxuXG5cblxuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9