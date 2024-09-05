export { LoadFeedbackController }

import { createIcon } from "../../modules/iconic/iconic.js";


class LoadFeedbackController {
    static activeDivs = {};
    static _nextId = 0;

    static activateOverlay(targetDiv, message, iconSize = 20) {
        // Create elements
        const loadfeedbackBG = document.createElement("div");
        loadfeedbackBG.classList.add("uiLoadFeedback");

        const iconEle = createIcon("load1", iconSize);
        iconEle.classList.add("rotating");
        
        const loadfeedbackIconEle = document.createElement("div");
        loadfeedbackIconEle.classList.add("loadIcon");
        loadfeedbackIconEle.appendChild(iconEle);
        loadfeedbackBG.appendChild(loadfeedbackIconEle);

        if (message) {
            const loadfeedbackMessageEle = document.createElement("div");
            
            loadfeedbackMessageEle.classList.add("loadText");
            loadfeedbackMessageEle.innerText = message;
            loadfeedbackBG.appendChild(loadfeedbackMessageEle);
        }

        // Register elements
        targetDiv.appendChild(loadfeedbackBG);

        const id = LoadFeedbackController._getId();
        LoadFeedbackController.activeDivs[id] = {
            "parent": targetDiv,
            "overlay": loadfeedbackBG,
        };

        return id;
    }

    static deactivateOverlay(id) {
        const divData = LoadFeedbackController.activeDivs[id];
        const parentDiv = divData["parent"];
        const overlayDiv = divData["overlay"];
        const cid = id;
        overlayDiv.classList.add("hidden");

        const removeFunc = () => {
            parentDiv.removeChild(overlayDiv);
            delete LoadFeedbackController.activeDivs[cid];
        };
        setTimeout(removeFunc, 500);
    }

    static _getId() {
        var id = LoadFeedbackController._nextId;
        LoadFeedbackController._nextId += 1;
        return id;
    }
}