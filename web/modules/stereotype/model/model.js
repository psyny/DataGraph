export { ModelsManager }

import { getModelHubFromModel } from "../modelhub/parsers.js";
import { getModelObjectFromModelHub } from "../modelobject/parsers.js";

class ModelsManager {
    constructor() {
        this._models = {};
    }

    addModel(model) {
        var innerModel = JSON.parse(JSON.stringify(model));
        this._expandModel(innerModel);
        this._models[innerModel["name"]] = innerModel;
    }

    addModels(modelList) {
        for(var model of modelList) {
            this.addModel(model);
        }
    }

    _expandModel(model) {
        if (model["ref"]) {
            return;
        }

        switch (model["type"]) {
            case "number":
                break;
    
            case "text":
                break;      
                
            case "boolean":
                break;               
    
            case "object":
                for (var fieldModel of model["properties"]) {
                    this._expandModel(fieldModel);
                }   
                break;
    
            case "list":
                this._expandModel(model["subModel"]);
                break;             
    
            case "switch":
                var modelMap = {};
                model["canBeMap"] = modelMap;
    
                for (var canBeModel of model["canBe"]) {
                    modelMap[canBeModel["name"]] = canBeModel;
                    this._expandModel(canBeModel);
                }         
                break;
    
            case "logic":
                break;                
        }
    }    

    getModel(modelName) {
        return this._models[modelName];
    }

    unrefModel(model) {
        const modelRefName = model["ref"]
        if (modelRefName) {
            return this.unrefModel(this.getModel(modelRefName));
        } else {
            return model;
        }
    }

    getModelObject(modelName) {
        const model = this.getModel(modelName);
        const modelHub = getModelHubFromModel(model, this);
        return getModelObjectFromModelHub(modelHub, model, this);
    }
}