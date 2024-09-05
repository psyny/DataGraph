export {buildMainTopMenu}

import { createIcon } from "../../modules/iconic/iconic.js";
import { createTopMenuBar } from "../components/topmenubar.js";

function buildMainTopMenu(containerEle) {
    var menuElements = createTopMenuBar("large");

    var menuMain = menuElements["main"];
    var menuDivLeft = menuElements["left"];
    var menuDivRight = menuElements["right"];

    var ele;

    /*
    --------------------------- ELEMENTS
    */

    // Menu Icon
    var menuIcon = createIcon("hlines1", 30);
    menuIcon.classList.add("clickable");
    menuDivLeft.appendChild(menuIcon);
    menuElements["menuIcon"] = menuIcon;

    // Projects ICon
    var projectsIcon = createIcon("folder1", 22);
    projectsIcon.classList.add("clickable");
    menuDivRight.appendChild(projectsIcon);
    menuElements["projectsIcon"] = projectsIcon;

    ele = createItemDiv()
    menuDivRight.appendChild(ele);

    // Settings Icon
    var settingsIcon = createIcon("gear3", 25);
    settingsIcon.classList.add("clickable");
    menuDivRight.appendChild(settingsIcon);
    menuElements["settingsIcon"] = settingsIcon;

    ele = createItemDiv()
    menuDivRight.appendChild(ele);

    // Notifications Icon
    var notificationsIcon = createIcon("bell1", 25);
    notificationsIcon.classList.add("clickable");
    menuDivRight.appendChild(notificationsIcon);
    menuElements["notificationsIcon"] = notificationsIcon;

    /*
    --------------------------- Attach    
    */
    containerEle.appendChild(menuMain);

    return menuElements;
}

function createItemDiv() {
    var ele = document.createElement("div");
    ele.classList.toggle("itemdiv");

    return ele;
}


function createSpacer(width = 20) {
    var ele = document.createElement("div");
    ele.classList.toggle("hspacer");

    ele.style.width = "" + width + "px";

    return ele;
}
