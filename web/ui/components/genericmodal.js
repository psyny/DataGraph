export { GenericModal }

import { createTopMenuBar } from "./topmenubar.js";
import { createIcon } from "../../modules/iconic/iconic.js";

class GenericModal {

    constructor(modalContainerDiv) {
        this.containerElement = modalContainerDiv;
        this.maskElement;
        this.frameElement;
        this.contentElement;

        this.topMenuMain;
        this.topMenuLeft;
        this.topMenuRight;

        // Build Modal Main Structure
        this.containerElement.classList.add("uiGenericModalContainer");
        this.containerElement.classList.add("hidden");

        this.maskElement = document.createElement("div");
        this.maskElement.classList.add("uiGenericModalMask");
        this.containerElement.appendChild(this.maskElement);

        this.frameElement = document.createElement("div");
        this.frameElement.classList.add("uiGenericModalFrame");
        this.maskElement.appendChild(this.frameElement);

        // Build Modal Frame Internal Structure
        var menuElements = createTopMenuBar("small");

        this.topMenuMain = menuElements["main"];
        this.topMenuLeft = menuElements["left"];
        this.topMenuRight = menuElements["right"];
        this.frameElement.appendChild(this.topMenuMain);

        // Build Content Frame
        this.contentElement = document.createElement("div");
        this.contentElement.classList.add("modalContent");
        this.frameElement.appendChild(this.contentElement);
        
    }

    show() {
        this.containerElement.classList.remove("hidden");
    }
    
    hide() {
        this.containerElement.classList.add("hidden");
    }  
    
    clear() {
        this.topMenuLeft.textContent = '';
        this.topMenuRight.textContent = '';
        this.contentElement.textContent = '';        
    }    

    createCloseIcon() {
        var closeIcon = createIcon("x1", 20);
        closeIcon.classList.add("clickable");
        this.topMenuRight.appendChild(closeIcon);

        return closeIcon;
    }

    setTitle(titleStr) {
        this.topMenuLeft.textContent = titleStr;
    }

    setDimensions(dimensions) {
        if (!dimensions) {
            dimensions = {
                "width": 800,
                "height": 600,
            }
        }

        for (var styleName in dimensions) {
            var styleValue = dimensions[styleName];
            this.frameElement.style[styleName] = typeof styleValue === "string" ? styleValue :  "" + styleValue + "px";
        }

    }
}

//this.frameElement.style.width = typeof width === "string" ? width :  "" + width + "px";
//this.frameElement.style.height = typeof height === "string" ? height :  "" + height + "px";