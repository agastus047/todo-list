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

export default storageManager;