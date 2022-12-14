import pubsub from "./pubsub";
import { ProjectManager } from "./manageProjects";

const ToDoManager = (()=> {
    let project = ProjectManager.getCurrentProject().projectTodos;

    //subscribe to pubsub event
     pubsub.subscribe('currentProjectChanged',selectProject);

     function selectProject(currentProject) {
          project = currentProject.projectTodos;
          pubsub.publish('listChanged',project);
     }

    function getProject() {
          return project;
    }
    function addToDo(newToDo) {
        newToDo.index = project.length;
        project.push(newToDo);
        pubsub.publish("listChanged",project);
    }

   function deleteToDo(index) {
        project = project.filter((todo) => todo.index !== index);
        for(let i=0;i<project.length;i++){
          project[i].index = i;
        }
        pubsub.publish("listChanged",project);
   }

   function updateToDo(index) {
        project = project.map((todo)=> todo.index === index ? todo : todo,);//{index: todo.index, title: todo.title, complete: todo.complete} : todo,);
        pubsub.publish("listChanged",project);
   }
   return {getProject, addToDo, deleteToDo, updateToDo};
})();

export {ToDoManager};