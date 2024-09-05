export {createFullModelForm, createModelFormSelectors, createModelFormActions}

import { createIconLabelButton } from './common.js';

function createFullModelForm(selectors, modelForm, actions) {
    var formContainerEle = document.createElement("div");
    formContainerEle.classList.add("stereotypeformcontainer");

    if(selectors) {
        formContainerEle.append(selectors["mainElement"]); 
    }

    if(modelForm) {
        formContainerEle.append(modelForm["mainElement"]);
    }
    
    if(actions) {
        formContainerEle.append(actions["mainElement"]);
    }
    
    return {
        "mainElement": formContainerEle,
    }    
}

function createModelFormSelectors() {
    var selectorsEle = document.createElement("div");
    selectorsEle.classList.add("formSelectors");

    var selectEle = document.createElement("select");
    selectEle.classList.toggle("input");

    selectorsEle.appendChild(selectEle);
    
    return {
        "mainElement": selectorsEle,
        "selectElement": selectEle,
    }
}

function createModelFormActions() {
    // Create elements
    var actionsEle = document.createElement("div");
    actionsEle.classList.add("formActions");

    var specialDivEle = document.createElement("div");
    specialDivEle.classList.add("stereotypespecial");
    actionsEle.appendChild(specialDivEle);

    var saveButton = createIconLabelButton("Save");
    specialDivEle.appendChild(saveButton["containerElement"]);

    return {
        "mainElement": actionsEle,
        "btnNewElement": null,
        "btnSaveElement": saveButton["containerElement"],
        "btnDeleteElement": null,
    }
}
