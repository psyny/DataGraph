export {buildMainLeftMenu}

import { createLeftMenuBar} from "../components/leftmenubar.js"

function buildMainLeftMenu(containerEle) {
    var menuElements = createLeftMenuBar();

    var menuMain = menuElements["main"];

    var ele;

    /*
    --------------------------- Attach    
    */
    containerEle.appendChild(menuMain);

    return menuElements;
}