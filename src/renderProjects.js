import newProject from "./makeProject";
import { ProjectManager } from "./manageProjects";
import pubsub from "./pubsub";

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
        const project = new newProject();
        project.name = formInput.value;
        displayProjects.textContent='';
        makeListElement();
        ProjectManager.addProject(project);
    }
    //load default project
    (function() {
        makeListElement();
        initialLoad(ProjectManager.getProjectList());
    })();

    //subscribe to pubsub event
    pubsub.subscribe('projectsChanged',initialLoad);

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
                ProjectManager.selectProject(project.index);
            })

            const dltBtn = document.createElement('button');
            dltBtn.textContent = 'DELETE';
            dltBtn.setAttribute('class','delete');
            dltBtn.id = project.index;
            projElem.appendChild(dltBtn);

            dltBtn.addEventListener('click', ()=> {
                ProjectManager.deleteProject(project.index);
            });

            projectList.appendChild(projElem);
        });
    }
})();

export {renderProjects};