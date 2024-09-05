export {getModelObjectFromModelHub};

function getModelObjectFromModelHub(modelHub, model, modelManager) {    
    // Get Model to be used
    model = model === null ? modelHub["model"] : model;

    const refModelName = model["ref"];
    if (refModelName) {
        const refModel = modelManager.getModel(refModelName);
        return getModelObjectFromModelHub(modelHub, refModel, modelManager);
    }

    // Get Value
    var value = modelHub["value"];

    function getValueElement(modelHub) {
        var modelForm = modelHub["modelForm"];
        if (modelForm) {
            var valueElement = modelForm["valueElement"];
            if (valueElement) {
                return valueElement;
            }
        }
        return null;
    }

    // Build model Object
    var modelObject;
    var modelType = model["type"];
    switch (modelType) {
        case "number":
            var valueElement = getValueElement(modelHub);
            modelObject = valueElement ? parseFloat(valueElement.value) : value;
            break;

        case "text":
            var valueElement = getValueElement(modelHub);
            modelObject = valueElement ? valueElement.value : value;
            break;      
            
        case "boolean":
            var valueElement = getValueElement(modelHub);
            modelObject = valueElement ? valueElement.checked : value;
            break;               

        case "object":
            modelObject = {};
            for (var fieldName in value) {
                var subModelObject = getModelObjectFromModelHub(value[fieldName], null, modelManager);
                modelObject[fieldName] = subModelObject;
            }
            break;

        case "select":
            var valueElement = getValueElement(modelHub);
            modelObject = valueElement ? valueElement.value : value;
            break;    

        case "list":
            modelObject = [];
            for (var subModelHub of value) {
                if(!subModelHub) continue;

                var subModelObject = getModelObjectFromModelHub(subModelHub, null, modelManager);
                modelObject.push(subModelObject);
            }
            break;             

        case "switch":
            modelObject = null;

            if (value !== null) {
                var subModel = value["model"];
                var switchModelName = subModel["name"];
                var switchValue = getModelObjectFromModelHub(value, subModel, modelManager);

                modelObject = {
                    "model": switchModelName,
                    "value": switchValue,
                };                
            }         
            break;

        case "logic":
            var valueElement = getValueElement(modelHub);
            
            modelObject = {
                "operator": valueElement ? valueElement.value : value["operator"],
                "operands": [],
            };
            for (var subModelHub of value["operands"]) {
                if(!subModelHub) continue;

                var subModelObject = getModelObjectFromModelHub(subModelHub, null, modelManager);
                modelObject["operands"].push(subModelObject);
            }
            break;                
    }

    return modelObject;
}

