export {createLeftMenuBar}

function createLeftMenuBar() {   
    var menuDiv = document.createElement("div");
    menuDiv.classList.add("uiLeftMenuBar");

    return {
        "main": menuDiv,
    }
}