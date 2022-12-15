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

export {renderHeader};