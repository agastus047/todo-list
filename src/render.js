import pubsub from "./pubsub";

const render = (function() {
    pubsub.subscribe("listChanged",initialLoad);

    function initialLoad(list) {
        list.forEach((todo) => {
            //console.log(todo.title);
        });
    }
})();

export {render};