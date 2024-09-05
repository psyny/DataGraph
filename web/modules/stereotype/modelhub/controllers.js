export {addSubModelToModelHub}

import {getModelHubFromModel} from './parsers.js'

function addSubModelToModelHub(parentModelHub, modelToAdd, typeSpecifics, modelManager) {
    const refModelName = modelToAdd["ref"];
    if (refModelName) {
        refModel = modelManager.getModel(refModelName);
        return addSubModelToModelHub(parentModelHub, refModel, typeSpecifics, modelManager);
    }

    var parentModel = parentModelHub["model"];
    var subModelHub;

    switch(modelToAdd["type"]) {
        case "number":
            break;

        case "text":
            break;      
            
        case "boolean":
            break;               

        case "object":
            break;

        case "list":   
            break;  
            
        case "switch":    
            subModelHub = getModelHubFromModel(modelToAdd, modelManager);
            subModelHub["parentModelHub"] = parentModelHub;

            var switchSubModelHub = addSubModelToModelHub(subModelHub, typeSpecifics["selection"], typeSpecifics, modelManager);         
            break;

        case "logic":                  
            break;               
    }    

    switch(parentModel["type"]) {
        case "number":
            break;

        case "text":
            break;      
            
        case "boolean":
            break;               

        case "object":
            break;

        case "list":  
            if(!subModelHub) {
                subModelHub = getModelHubFromModel(modelToAdd, modelManager);
            }            
            subModelHub["parentModelHub"] = parentModelHub;
            parentModelHub["value"].push(subModelHub);
            break;  
            
        case "switch":    
            if(!subModelHub) {
                subModelHub = getModelHubFromModel(modelToAdd, modelManager);
            }        
            subModelHub["parentModelHub"] = parentModelHub;
            parentModelHub["value"] = subModelHub;      
            break;

        case "logic":        
            if(!subModelHub) {
                subModelHub = getModelHubFromModel(modelToAdd, modelManager);
            }           
            subModelHub["parentModelHub"] = parentModelHub;
            parentModelHub["value"]["operands"].push(subModelHub);            
            break;               
    }

    return subModelHub;
}
