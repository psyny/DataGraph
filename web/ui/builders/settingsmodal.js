export { buildSettingsModal }

import { ModelsManager } from "../../modules/stereotype/model/model.js";
import { setStereotypeService } from "../../modules/stereotype/service.js";

const settingsModel = {
    "name": "appSettings",
    "label": "App Settings",
    "type": "object",
    "properties": [
        {
            "name": "serverAddress",
            "label": "Server Address",                
            "type": "text",
        },               
    ]
};

function buildSettingsModal(genericModalObj) {
    genericModalObj.clear();

    // Close Icon
    var closeIcon = genericModalObj.createCloseIcon(); 
    closeIcon.addEventListener("click", () => { genericModalObj.hide()} );

    // Modal Config
    genericModalObj.setDimensions({
        "width": 800,
        "height": 600,
    });    

    // Title
    genericModalObj.setTitle("Settings");

    // Content ----------------------------------------
    // settings area
    var settingsArea = document.createElement("div");
    settingsArea.classList.add("settingsArea");
    genericModalObj.contentElement.appendChild(settingsArea);
    

    // Model 
    const modelsManager = new ModelsManager();
    modelsManager.addModels([settingsModel]);
    const targetModelName = settingsModel["name"];

    const dbController = null;
    var stereotypeService = setStereotypeService(modelsManager, dbController);
    var formElemenet = stereotypeService.getModelForm_NoDatabase(targetModelName, null);

    settingsArea.appendChild(formElemenet);

}