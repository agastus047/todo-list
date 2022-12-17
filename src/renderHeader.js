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

export {renderHeader};