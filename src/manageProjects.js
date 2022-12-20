import pubsub from "./pubsub";
import newProject from "./makeProject";

const ProjectManager = (()=> {
    let projectList = [];

    let defaultProject = new newProject('Default');

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
        pubsub.publish('projectsChanged',projectList);
    }
    //check condition when default project is deleted
    //or make sure default project is never deleted
    function deleteProject(index) {
        projectList = projectList.filter((project) => project.index !== index);
        for(let i=0;i<projectList.length;i++){
          projectList[i].index = i;
        }
        currentProject = defaultProject;
        pubsub.publish('currentProjectChanged',currentProject);
        pubsub.publish("projectsChanged",projectList);
   }

   function selectProject(index) {
        currentProject = projectList[index];
        pubsub.publish('currentProjectChanged',currentProject);
   }

   //subscribe to pubsub event
   pubsub.subscribe('listChanged',updateCurrentProject);

   function updateCurrentProject(newList) {
        currentProject.projectTodos = newList;
        projectList = projectList.map((project)=> project.index === currentProject.index ? currentProject: project);
        pubsub.publish('projectsChanged',projectList)

   }

   return {getProjectList, getCurrentProject, addProject, deleteProject, selectProject};
})();

export {ProjectManager};