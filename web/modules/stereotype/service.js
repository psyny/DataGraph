export { getStereotypeService, setStereotypeService};

import { createFullModelForm, createModelFormSelectors, createModelFormActions } from './modelform/modelformcontrols.js';
import { createModelFormForModelHub } from './modelform/modelform.js';
import { getModelHubFromModel, getModelHubFromModelObject } from './modelhub/parsers.js';
import { getModelObjectFromModelHub } from './modelobject/parsers.js';

// Singleton to control stereotype global operations
var singleton;

function getStereotypeService() {
    return singleton;
}

function setStereotypeService(modelsManager, databaseControler = null) {
    return singleton = new Stereotype(modelsManager, databaseControler);
}



class Stereotype {
    constructor(modelsManager, databaseControler = null) {
        this._modelsManager = modelsManager;
        this._databaseControler = databaseControler;
    }
    
    getModelForm(modelName, modelObject = null, actionCallbacks = {}, formOptions = {}) {
        // Options
        var hasSelector = formOptions["hasSelector"] || false;
        var hasDatabaseActions = formOptions["hasDatabaseActions"] || false;

        // ---------------------------------------------------------

        // Get Model
        var model = this._modelsManager.getModel(modelName);
        if(!model) {
            return null;
        }

        // Starting Model Hub
        var modelHub = null;
        if (hasDatabaseActions === false) {
            if (modelObject !== null) {
                modelHub = getModelHubFromModelObject(model, modelObject, this._modelsManager);
            } else {
                modelHub = getModelHubFromModel(model, this._modelsManager);
            }
        }

        // Create form areas
        // Database selection
        // Model Form
        // Actions

        // Create Form: Selector
        var formSelectorData = null;
        if (hasSelector === true) {
            formSelectorData = createModelFormSelectors();
        }

        // Create Form: Model Form
        var formModelData = null;
        if (modelHub !== null) {
            formModelData = createModelFormForModelHub(modelHub, this._modelsManager);
        }

        // Create Form: Actions
        var formActionsData = null;
        formActionsData = createModelFormActions(); 

        // Register Callbacks
        if (actionCallbacks["save"]) {

        }
        formActionsData["btnSaveElement"].addEventListener("click", () => {
            var a = getModelObjectFromModelHub(modelHub, model, this._modelsManager);
            console.log("SAVE CLICKED")
            console.log(a)
        });   
        

        // Create full model form
        var fullFormData = createFullModelForm(formSelectorData, formModelData, formActionsData);

        return fullFormData["mainElement"];
    }

    getModelForm_NoDatabase(modelName, modelObject = null, actionCallbacks = {}, formOptions = {}) {
        formOptions["hasDatabaseActions"] = false;
        formOptions["hasSelector"] = false;

        return this.getModelForm(modelName, modelObject, actionCallbacks, formOptions);
    }
}