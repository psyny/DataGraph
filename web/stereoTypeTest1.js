
import {getModelHubFromModel, getModelHubFromModelObject} from './modules/stereotype/modelhub/parsers.js'
import {getModelObjectFromModelHub} from './modules/stereotype/modelobject/parsers.js'
import {createModelFormForModelHub} from './modules/stereotype/modelform/modelform.js'

import { ModelsManager } from './modules/stereotype/model/model.js'
import { getStereotypeService, setStereotypeService } from './modules/stereotype/service.js'

import { Requests } from './modules/network/requests.js'

// Models to test
var models;

models = [
    {
        "name": "Root Model 1",
        "label": "Root Model 1",
        "type": "object",
        "properties": [
            {
                "name": "text field",
                "label": "text field",
                "type": "text",
            },
            {
                "name": "number field",
                "label": "number field",
                "type": "number",
            },
            {
                "name": "boolean field",
                "label": "boolean field",
                "trueLabel": "valid",
                "type": "boolean",
            },
            {
                "name": "object field",
                "label": "",
                "layout": "column",
                "type": "object",
                "properties": [
                    {
                        "name": "object field a",
                        "label": "object field a",
                        "type": "object",
                        "properties": [
                            {
                                "name": "text field 1",
                                "label": "text field 1",
                                "type": "text",
                            },
                            {
                                "name": "text field 2",
                                "label": "text field 2",
                                "type": "text",
                            },
                        ],
                    },
                    {
                        "name": "object field b",
                        "label": "object field b",
                        "type": "object",
                        "properties": [
                            {
                                "name": "text field 1",
                                "label": "text field 1",
                                "type": "text",
                            },
                            {
                                "name": "text field 2",
                                "label": "text field 2",
                                "type": "text",
                            },
                        ],
                    },
                ]
            },
            {
                "name": "list field",
                "label": "list field",
                "type": "list",
                "subModel": {
                    "name": "text field",
                    "label": "text field",
                    "type": "text",
                    "labelOnlyWhenEmpty": true,
                },
            },
            {
                "name": "list field 2",
                "label": "list field 2",
                "type": "list",
                "subModel": {
                    "name": "switch field",
                    "label": "switch field",
                    "type": "switch",
                    "canBe": [
                        {
                            "name": "text field",
                            "label": "text field",
                            "type": "text",
                        },
                        {
                            "name": "number field",
                            "label": "number field",
                            "type": "number",
                        },
                    ]
                },
            },
            {
                "name": "switch field 2",
                "label": "switch field 2",
                "type": "switch",
                "canBe": [
                    {
                        "name": "text field",
                        "label": "text field",
                        "type": "text",
                    },
                    {
                        "name": "number field",
                        "label": "number field",
                        "type": "number",
                    },
                ]
            },
            {
                "name": "logic field",
                "label": "logic field",
                "type": "logic",
                "subModel": {
                    "name": "text field",
                    "label": "text field",
                    "type": "text",
                },
            },
        ],
    },
]

// -------------------------------------------------------- Models Manager
const modelsManager = new ModelsManager();
modelsManager.addModels(models);

// -------------------------------------------------------- Database Controller
const dbController = null;

// -------------------------------------------------------- Stereo Type Service
var stereotypeService = setStereotypeService(modelsManager, dbController);

// -----------
var targetModel = modelsManager.getModel("Root Model 1");
console.log("Model:")
console.log(targetModel);

// -----------

console.log("Resulting Model Gate:")
var modelHub = getModelHubFromModel(targetModel, modelsManager);
console.log(modelHub);

// -----------

console.log("Resulting Model Object:");
var modelObject = getModelObjectFromModelHub(modelHub, targetModel, modelsManager);

modelObject["number field"] = 999;

modelObject["list field"].push("ele 1");
modelObject["list field"].push("ele 2");
modelObject["list field"].push("ele 3");

modelObject["switch field 2"] = {
    "model": "text field",
    "value": "text value",
}

modelObject["logic field"]["operator"] = "and";
modelObject["logic field"]["operands"].push("text 1");
modelObject["logic field"]["operands"].push("text 2");
var subLogic = {
    "operator": "or",
    "operands": [],
};
subLogic["operands"].push("sub text A");
subLogic["operands"].push("sub text B");

modelObject["logic field"]["operands"].push(subLogic);
modelObject["logic field"]["operands"].push("text 3");
modelObject["logic field"]["operands"].push("text 4");

console.log(modelObject);

// -----------

console.log("Resulting Model Gate 2:")
var modelHub2 = getModelHubFromModelObject(targetModel, modelObject, modelsManager);
console.log(modelHub2);

// -----------

console.log("Resulting Model Object 2:");
var modelObject2 = getModelObjectFromModelHub(modelHub2, targetModel, modelsManager);
console.log(modelObject2);

// -----------


var modelDiv = document.getElementById("modelsDiv");
var formElementData = createModelFormForModelHub(modelHub2, modelsManager);

modelDiv.appendChild(formElementData["mainElement"]);

const responseData = await Requests.post("postEndpointExample", { "Psyny": "Rafael" });

console.log(responseData);