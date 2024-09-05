export {getModelHubFromModel, getModelHubFromModelObject}

function getModelHubFromModel(model, modelManager) {
    return getModelHubFromModelObject(model, null, modelManager);
}

function getModelHubFromModelObject(model, modelObject, modelManager) {
    model = modelManager.unrefModel(model);

    var modelHubNode = {
        "model": null,
        "value": null,
        "parentModelHub": null,
        "modelForm": {
            "containerElement": null,
            "contentElement": null,
            "valueElement": null,
            "labelElement": null,  
            "removeElement": null, 
            "removeModeContainer": null,     
        },
    };

    // Get value
    var value;
    var defaultValue = model["defaultValue"];

    switch (model["type"]) {
        case "number":
            value = modelObject ? modelObject : defaultValue ? defaultValue : 0;
            break;

        case "text":
            value = modelObject ? modelObject : defaultValue ? defaultValue : "";
            break;      
            
        case "boolean":
            value = modelObject ? modelObject : defaultValue ? defaultValue : false;
            break;               

        case "object":
            value = {};
            for (var subModel of model["properties"]) {
                subModel = modelManager.unrefModel(subModel);
                var fieldName = subModel["name"];
                var subModelObject = modelObject ? modelObject[fieldName] : null;
                var subModelHub = getModelHubFromModelObject(subModel, subModelObject, modelManager);
                value[fieldName] = subModelHub;
            }
            break;

        case "select":   
            value = modelObject ? modelObject : defaultValue ? defaultValue : model["options"][0];
            break;

        case "list":
            value = [];
            if (modelObject !== null) {
                var subModel = model["subModel"];
                subModel = modelManager.unrefModel(subModel);
                for (var subModelObject of modelObject) {
                    var subModelHub = getModelHubFromModelObject(subModel, subModelObject, modelManager);
                    subModelHub["parentModelHub"] = modelHubNode;
                    value.push(subModelHub);
                }
            }            
            break;  
            
        case "switch":
            value = null;

            if (modelObject !== null) {
                var subModelName = modelObject["model"];
                var subModel = model["canBeMap"][subModelName];
                subModel = modelManager.unrefModel(subModel);
                var subModelObject = modelObject["value"];

                value = getModelHubFromModelObject(subModel, subModelObject, modelManager);
            }
            break;

        case "logic":
            value = {
                "operator": null,
                "operands": [],
            }

            if (modelObject === null) {
                value["operator"] = "and";
            } else  {
                value["operator"] = modelObject["operator"];

                var subModel;
                var operands = value["operands"];

                for (var subModelObject of modelObject["operands"]) {
                    if (subModelObject["operator"]) {
                        subModel = model;
                    } else {
                        subModel = model["subModel"];
                    }
                    subModel = modelManager.unrefModel(subModel);

                    var subModelHub = getModelHubFromModelObject(subModel, subModelObject, modelManager);
                    subModelHub["parentModelHub"] = modelHubNode;
                    operands.push(subModelHub);
                }
            }            
            break;               
    }

    // Base model gate data
    modelHubNode["model"] = model;
    modelHubNode["value"] = value;

    return modelHubNode;
}