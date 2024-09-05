export {ElementsController}

import { buildGeneralUI } from "../builders/generalui.js";

class ElementsController {
    static fixedElements;

    static async init() {
        buildGeneralUI();
    }
}