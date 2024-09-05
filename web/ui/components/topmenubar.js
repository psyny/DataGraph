export {createTopMenuBar}

function createTopMenuBar(size = "small") {   
    var menuDiv = document.createElement("div");
    menuDiv.classList.add("uiTopMenuBar");
    menuDiv.classList.add(size);

    var menuDivLeft = document.createElement("div");
    menuDivLeft.classList.add("leftDiv");
    menuDiv.appendChild(menuDivLeft);


    var menuDivRight = document.createElement("div");
    menuDivRight.classList.add("rightDiv");
    menuDiv.appendChild(menuDivRight);

    return {
        "main": menuDiv,
        "left": menuDivLeft,
        "right": menuDivRight
    }
}