export {createModelFormForModelHub}

import { addSubModelToModelHub } from '../modelhub/controllers.js'
import { createIconLabelButton } from './common.js';

function createModelFormForModelHub(modelHub, modelManager) {
    // Create From
    var mainElementData = createElementForModelHub(modelHub, null, modelManager);
    return mainElementData;
}

function createElementForModelHub(modelHub, parentElement, modelManager) {
    var model = modelHub["model"];

    var createdElementData;
    var typeSpecifics;

    function auxCreateElement(model, modelHub, specifics = {}) {
        return createElement(modelHub, modelManager, model["type"], modelHub["value"], model["label"], model["layout"], specifics);
    }

    function addPossibleSubmodels(subModels, model) {
        switch(model["type"]) {
            case "logic":
                subModels.push(
                    { 
                        "model": model,
                        "selection": model,
                
                    }
                );
        }

        switch(model["subModel"]["type"]) {
            case "switch":
                for(var canBeModel of model["subModel"]["canBe"]) {
                    if (canBeModel["type"] !== "switch") {
                        subModels.push(
                            { 
                                "model": model["subModel"],
                                "selection": canBeModel,
                        
                            }
                        );
                    } 
                }
                break;

            default:
                subModels.push(
                    { 
                        "model": model["subModel"],
                        "selection": model["subModel"],
                
                    }
                );
                break;
        }
    }

    switch(model["type"]) {
        case "text":
            typeSpecifics = {
                "labelOnlyWhenEmpty": model["labelOnlyWhenEmpty"],
            }            
            createdElementData = auxCreateElement(model, modelHub, typeSpecifics);
            break;

        case "number":
            typeSpecifics = {
                "labelOnlyWhenEmpty": model["labelOnlyWhenEmpty"],
            }               
            createdElementData = auxCreateElement(model, modelHub, typeSpecifics);
            break;

        case "boolean":
            typeSpecifics = {
                "trueLabel": model["trueLabel"],
            }
            createdElementData = auxCreateElement(model, modelHub, typeSpecifics);
            break;              

        case "list":
            var subModels = [];
            addPossibleSubmodels(subModels, model);

            typeSpecifics = {
                "subModels": subModels,
            }

            createdElementData = auxCreateElement(model, modelHub, typeSpecifics);

            for (var addButtonElement of createdElementData["addButtonElements"]) {
                const modelToAdd = addButtonElement["model"];
                const specifics = {
                    "selection": addButtonElement["selection"]
                };
                var addEventList = (e) => {addNewListItem(modelHub, modelToAdd, specifics, modelManager)}
                addButtonElement["element"].addEventListener("click", addEventList);
            }

            var removeModeListener = (e) => {toggleRemoveMode(modelHub)}
            createdElementData["removeModeContainer"].addEventListener("click", removeModeListener);   
            break; 
            
        case "select":
            var options = [];
            if (model["options"]) {
                for (var optionLabel of model["options"] ) {
                    options.push({
                        "value": "" + optionLabel,
                        "label": "" + optionLabel,
                    });
                }
            }

            typeSpecifics = {
                "selectOptions": options,
            }               

            createdElementData = auxCreateElement(model, modelHub, typeSpecifics);
            break;

        case "object":
            createdElementData = auxCreateElement(model, modelHub);
            break;  
            
        case "logic":
            var subModels = [];
            addPossibleSubmodels(subModels, model);

            typeSpecifics = {
                "subModels": subModels,
                "selectOptions": [
                    {"value": "and"},
                    {"value": "xor"},
                    {"value": "or"},
                ],
            }
            createdElementData = auxCreateElement(model, modelHub, typeSpecifics);

            for (var addButtonElement of createdElementData["addButtonElements"]) {
                const modelToAdd = addButtonElement["model"];
                var addEventList = (e) => {addNewListItem(modelHub, modelToAdd, {}, modelManager)}
                addButtonElement["element"].addEventListener("click", addEventList);
            }            

            var removeModeListener = (e) => {toggleRemoveMode(modelHub)}
            createdElementData["removeModeContainer"].addEventListener("click", removeModeListener);             

            break;  

        case "switch":   
            var subModelHub = modelHub["value"];       
            createdElementData = auxCreateElement(subModelHub["model"], subModelHub);
            break;           
    }

    // Fill Elements data on ModelForm
    var modelForm = modelHub["modelForm"];
    modelForm["containerElement"] = createdElementData["mainElement"];
    modelForm["contentElement"] = createdElementData["contentElement"];
    modelForm["valueElement"] = createdElementData["valueElement"];
    modelForm["labelElement"] = null;
    modelForm["removeElement"] = createdElementData["removeButtonElement"];
    modelForm["removeModeContainer"] = createdElementData["removeModeContainer"];

    // Process Parent Data
    var parentModelHub = modelHub["parentModelHub"];
    if (parentModelHub) {
        switch(parentModelHub["model"]["type"]) {
            case "text":
                break;
    
            case "number":
                break;
    
            case "boolean":
                break;              
    
            case "logic":
            case "list":
                // Add remove button clicked listener
                const containingModelHub = parentModelHub;
                const contentModelHub = modelHub;
                var removeEventList = (e) => {removeListItem(containingModelHub, contentModelHub)};
                contentModelHub["modelForm"]["removeElement"].addEventListener("click", removeEventList);     
                break;  
    
            case "object":
                break;  
                
            case "switch":
                break;           
        }
    }    

    // Link created element
    const eleMainContainer = createdElementData["mainElement"];

    if(parentElement) {
        parentElement.appendChild(eleMainContainer);   
    }

    return createdElementData;
}

function createElement(modelHub, modelManager, modelType, value, label, layout, typeSpecifics) {
    var divDirectionClass = "col";
    var divChildContainerDirectionClass = divDirectionClass;

    const eleMainContainer = document.createElement("div");
    eleMainContainer.classList.toggle("stereotypecontainer");

    const eleTitleContainer = document.createElement("div");
    eleTitleContainer.classList.toggle("title");

    const eleDefinitionsContainer = document.createElement("div");
    eleDefinitionsContainer.classList.toggle("controls");

    const eleContentContainer = document.createElement("div");
    eleContentContainer.classList.toggle("content");

    const eleControlsContainer = document.createElement("div");
    eleControlsContainer.classList.toggle("controls");    

    var tempElement;

    // Delete Element Button
    const eleDeleteElementContainer = document.createElement("div");  
    var eleDeleteElementButton = null;  

    var parentModelType = modelHub["parentModelHub"] ? modelHub["parentModelHub"]["model"]["type"] : null;
    if (parentModelType) {
        switch(parentModelType) {
            case "list":
            case "logic":
            case "switch":
                eleDeleteElementContainer.classList.toggle("deleteElementContainer");           
                var tempElementData = createSpecialElement("removeElementButton", {"label": ""});            
                eleDeleteElementButton = tempElementData["mainElement"];
                eleDeleteElementButton.classList.toggle("hidden");
                eleDeleteElementContainer.appendChild(eleDeleteElementButton); 
            break;
        } 
    }

    // Initial Steup 
    eleMainContainer.appendChild(eleTitleContainer);
    eleMainContainer.appendChild(eleDefinitionsContainer);
    eleMainContainer.appendChild(eleContentContainer);
    eleMainContainer.appendChild(eleControlsContainer);
    eleMainContainer.appendChild(eleDeleteElementContainer);


    // Label Morph functions
    function labelMorphCheck(inputEle, labelEle, onEmptyOnly) {
        if (document.activeElement === inputEle || (inputEle.value && inputEle.value.length > 0)) {
            if (onEmptyOnly==true) {
                labelEle.classList.add("hidden");
            } else {
                labelEle.classList.add("filled");
            }
            labelEle.classList.remove("empty");
        } else {
            labelEle.classList.add("empty");
            labelEle.classList.remove("filled");
            labelEle.classList.remove("hidden");
        }
    }  

    function listerAddLabelMorphListeners(inputEle, labelEle, onEmptyOnly) {
        var listFunction = () =>  labelMorphCheck(inputEle, labelEle, onEmptyOnly);

        inputEle.addEventListener("input", listFunction); 
        inputEle.addEventListener("focus", listFunction); 
        inputEle.addEventListener("blur", listFunction); 
        labelMorphCheck(inputEle, labelEle, onEmptyOnly);
    }

    // Setup based on model type
    var labelEle;  

    function addLabelDiv(tileContainer, labelText) {
        var labelDiv = document.createElement("div");
        labelDiv.classList.toggle("label");

        var labelTextNode = document.createTextNode(labelText); 
        labelDiv.appendChild(labelTextNode);

        tileContainer.appendChild(labelDiv);

        return labelDiv;
    }

    function setGroupContainer_aux_addCosmeticElement(mainButton, cosmeticClass) {
        var cosmeticEle = document.createElement("div");
        cosmeticEle.classList.add(cosmeticClass);
        mainButton.appendChild(cosmeticEle);
    }

    function setGroupContainer(group=true) {
        if (group===true) {
            eleTitleContainer.classList.add("group");
            eleMainContainer.classList.add("group");
            eleDeleteElementContainer.classList.add("group");

            setGroupContainer_aux_addCosmeticElement(eleMainContainer, "groupBorderA");
            setGroupContainer_aux_addCosmeticElement(eleMainContainer, "groupBorderB");
            setGroupContainer_aux_addCosmeticElement(eleMainContainer, "groupBorderC");
            setGroupContainer_aux_addCosmeticElement(eleMainContainer, "groupBorderD");
        } else {
            eleTitleContainer.classList.add("primitive");
            eleMainContainer.classList.add("primitive");
            eleDeleteElementContainer.classList.add("primitive");
        }
    }

    function createInputContainer() {
        var inputContainer = document.createElement("div");
        inputContainer.classList.add("inputContainer");

        var markerEle; 
        
        markerEle = document.createElement("div");
        markerEle.classList.add("idleSelectMarker");
        inputContainer.appendChild(markerEle);

        markerEle = document.createElement("div");
        markerEle.classList.add("focusSelectMarker");    
        inputContainer.appendChild(markerEle);            
        
        return inputContainer;
    }

    var valueElement = null;
    var addButtonElements = [];
    var removeModeElement = null;
    var secondaryValueElement = null;
    var inputContainerElement = null;
    switch(modelType) {
        case "text":
            labelEle = addLabelDiv(eleTitleContainer, label);
            setGroupContainer(false);

            inputContainerElement = createInputContainer();
            eleContentContainer.appendChild(inputContainerElement);

            tempElement = document.createElement("input");
            valueElement = tempElement;
            tempElement.setAttribute("value", value);
            tempElement.setAttribute("type", "text");
            tempElement.classList.toggle("input");
            listerAddLabelMorphListeners(tempElement, labelEle, typeSpecifics["labelOnlyWhenEmpty"] || false);
            inputContainerElement.appendChild(tempElement);
            break;

        case "number":
            labelEle = addLabelDiv(eleTitleContainer, label);
            setGroupContainer(false);

            inputContainerElement = createInputContainer();
            eleContentContainer.appendChild(inputContainerElement);            

            tempElement = document.createElement("input");
            tempElement.setAttribute("value", value);
            tempElement.setAttribute("type", "number");
            valueElement = tempElement;
            tempElement.classList.toggle("input");  
            listerAddLabelMorphListeners(tempElement, labelEle, typeSpecifics["labelOnlyWhenEmpty"] || false);                    
            inputContainerElement.appendChild(tempElement);
            break;

        case "boolean":
            addLabelDiv(eleTitleContainer, label);
            setGroupContainer(false);

            divChildContainerDirectionClass = "row";

            tempElement = document.createElement("input");
            tempElement.setAttribute("type", "checkbox");
            if (value) {
                tempElement.toggleAttribute("checked");
            }
            valueElement = tempElement;
            eleContentContainer.appendChild(tempElement);

            tempElement = document.createTextNode(typeSpecifics["trueLabel"] || ""); 
            eleContentContainer.appendChild(tempElement);
            break;   
            
        case "select":
            labelEle = addLabelDiv(eleTitleContainer, label);
            setGroupContainer(false);

            inputContainerElement = createInputContainer();
            eleContentContainer.appendChild(inputContainerElement);              

            tempElement = document.createElement("select");
            tempElement.classList.toggle("input");  
            valueElement = tempElement;

            var first = true;
            for (var selectOption of typeSpecifics["selectOptions"]) {
                if (first === true) {
                    first = false;
                } else {
                    
                }    

                var optionElement = document.createElement("option");

                var optionValue = selectOption["value"];
                optionElement.setAttribute("value", optionValue);
                if (optionValue === value) {
                    optionElement.setAttribute("selected", true);
                }

                var optionLabel = selectOption["label"] ? selectOption["label"] : optionValue;
                var labelElement = document.createTextNode(optionLabel); 
                optionElement.appendChild(labelElement);
                tempElement.appendChild(optionElement);
            }

            inputContainerElement.appendChild(tempElement);
            break;            

        case "list":
            addLabelDiv(eleTitleContainer, label);
            setGroupContainer(true);
            
            if (layout && layout === "column") {
                divChildContainerDirectionClass = "row";
            } else {
                divChildContainerDirectionClass = "col";
            }          

            // List Elements
            for (var childModelHub of value) {
                createElementForModelHub(childModelHub, eleContentContainer, modelManager);                 
            }

            var createdElementData;
            // Spacer
            var spacerEle = createSpecialElement("spacer");
            eleControlsContainer.appendChild(spacerEle["mainElement"]);

            // Buttons Tray
            var btnTray = createSpecialElement("buttonTray");
            var btnTrayBtns = btnTray["appendElement"];
            eleControlsContainer.appendChild(btnTray["mainElement"]);   

            // Remove button
            createdElementData = createSpecialElement("removeButton");         
            removeModeElement = createdElementData["mainElement"];
            btnTrayBtns.appendChild(removeModeElement);                

            // Add button(s)            
            for (var subModel of typeSpecifics["subModels"]) {
                createdElementData = createSpecialElement("addButton", {"label": "add " + subModel["selection"]["name"]});              
                btnTrayBtns.appendChild(createdElementData["mainElement"]);   
                addButtonElements.push({
                        "model": subModel["model"],
                        "selection": subModel["selection"],
                        "element": createdElementData["clickElement"],                        
                    }
                    );
            }
            break;  

        case "object":
            if (label.length > 0 ) {
                addLabelDiv(eleTitleContainer, label);
            }
            
            setGroupContainer(true);

            if (layout && layout === "column") {
                divChildContainerDirectionClass = "row";
            } else {
                divChildContainerDirectionClass = "col";
            }
            
            var modelHubFields = value;
            for (var childModelFieldName in modelHubFields) {
                var childModelHub = modelHubFields[childModelFieldName];
                createElementForModelHub(childModelHub, eleContentContainer, modelManager);
            }

            break;  
            
        case "logic":
            addLabelDiv(eleTitleContainer, label);
            setGroupContainer(true);

            // Logic operator
            var operatorElement = createElement(modelHub, modelManager, "select", value["operator"], "operator", "column", typeSpecifics);
            eleDefinitionsContainer.appendChild(operatorElement["mainElement"]);
            valueElement = operatorElement["valueElement"];

            var spacerEle = createSpecialElement("spacer");
            eleDefinitionsContainer.appendChild(spacerEle["mainElement"]);            

            // Logic Operands
            if (layout && layout === "column") {
                divChildContainerDirectionClass = "row";
            } else {
                divChildContainerDirectionClass = "col";
            }          
            
            for (var childModelHub of value["operands"]) {
                createElementForModelHub(childModelHub, eleContentContainer, modelManager);
            }

            var createdElementData;
            // Spacer
            var spacerEle = createSpecialElement("spacer");
            eleControlsContainer.appendChild(spacerEle["mainElement"]);

            // Button Tray
            var btnTray = createSpecialElement("buttonTray");
            var btnTrayBtns = btnTray["appendElement"];
            eleControlsContainer.appendChild(btnTray["mainElement"]);               

            // Remove button
            createdElementData = createSpecialElement("removeButton");         
            removeModeElement = createdElementData["mainElement"];
            btnTrayBtns.appendChild(removeModeElement);  

            // Add button(s)        
            for (var subModel of typeSpecifics["subModels"]) {
                createdElementData = createSpecialElement("addButton", {"label": "add " + subModel["selection"]["name"]});              
                btnTrayBtns.appendChild(createdElementData["mainElement"]);   
                addButtonElements.push({
                        "model": subModel["model"],
                        "selection": subModel["selection"],
                        "element": createdElementData["clickElement"],                        
                    }
                    );
            }              
            break;       
            
        case "switch":
            break;
    } 

    // Div Inner Layout Direction
    eleContentContainer.classList.toggle(divChildContainerDirectionClass);    
        
    return {
        "mainElement": eleMainContainer,
        "contentElement": eleContentContainer,
        "valueElement": valueElement,
        "secondaryValueElement": secondaryValueElement,
        "addButtonElements": addButtonElements,
        "removeButtonElement": eleDeleteElementButton,
        "removeModeContainer": removeModeElement,
    }
}

function createSpecialElement(type, typeSpecifics = {}) {
    var mainEle;
    var valueEle;
    var clickEle;
    var appendEle;

    mainEle = document.createElement("div"); 
    mainEle.classList.toggle("stereotypespecial");

    switch(type) {
        case "spacer":
            var spacerEle = document.createElement("div");
            mainEle.appendChild(spacerEle);

            spacerEle.classList.toggle("spacer");

            var height = typeSpecifics["height"] ? typeSpecifics["height"] : "10px";
            spacerEle.style.height = height;

            valueEle = null;
            break;

        case "separator":
            var separatorEle = document.createElement("div");
            mainEle.appendChild(separatorEle);

            separatorEle.classList.toggle("separator");

            var lineWidth = typeSpecifics["width"] ? typeSpecifics["width"] : "1px";
            var lineStyle = typeSpecifics["style"] ? typeSpecifics["style"] : "solid";
            var height = typeSpecifics["height"] ? typeSpecifics["height"] : "0px";

            separatorEle.style.height = height;
            separatorEle.style.borderBottomStyle = lineStyle;
            separatorEle.style.borderBottomWidth = lineWidth;

            valueEle = null;
            break;   
            
        case "buttonTray":
            mainEle.classList.add("buttontraycontainer");

            appendEle = document.createElement("div");
            appendEle.classList.add("buttontraybuttons");

            mainEle.appendChild(appendEle);
            break;
            
        case "addButton":
            var iconLabel = typeSpecifics["label"] ? typeSpecifics["label"] : "add";
            var buttonElementData = createIconLabelButton(iconLabel, null, "generalB");
            var buttonContainerElement = buttonElementData["containerElement"];
            mainEle.appendChild(buttonContainerElement);
            clickEle = buttonContainerElement;
            break;

        case "removeButton":
            var iconLabel = typeSpecifics["label"] ? typeSpecifics["label"] : "remove mode";
            var buttonElementData = createIconLabelButton(iconLabel, null, "negativeB");
            var buttonContainerElement = buttonElementData["containerElement"];
            mainEle.appendChild(buttonContainerElement);
            clickEle = buttonContainerElement;
            break;      
            
        case "removeElementButton":
            var buttonElementData = createIconLabelButton("X", null, "negativeC");
            var buttonContainerElement = buttonElementData["containerElement"];
            mainEle.appendChild(buttonContainerElement);
            clickEle = buttonContainerElement;
            break;              
    }

    return {
        "mainElement": mainEle,
        "appendElement": appendEle,
        "valueElement": valueEle,
        "clickElement": clickEle,
    };
}

function addNewListItem(modelHubToAddInto, modelToAdd, typeSpecifics = {}, modelManager) { 
    toggleRemoveMode();

    // Call Parent model gate to create the new modelHub element
    var addedModelHub = addSubModelToModelHub(modelHubToAddInto, modelToAdd, typeSpecifics, modelManager);

    // Create the form for this new model gate element
    var parentElement = modelHubToAddInto["modelForm"]["contentElement"];
    createElementForModelHub(addedModelHub, parentElement, modelManager);
}

function removeListItem(modelHubToRemoveFrom, modeGateToBeRemoved) {    
    // Delete form from DOM
    var elementToRemove = modeGateToBeRemoved["modelForm"]["containerElement"];
    var parentElement = modelHubToRemoveFrom["modelForm"]["contentElement"];
    parentElement.removeChild(elementToRemove);

    // Delete from modelHub
    var listToRemoveFrom;
    switch(modelHubToRemoveFrom["model"]["type"]) {
        case "list":
            listToRemoveFrom =  modelHubToRemoveFrom["value"];
            break;

        case "logic":
            listToRemoveFrom =  modelHubToRemoveFrom["value"]["operands"];
            break;

    }

    var indexToRemove = listToRemoveFrom.indexOf(modeGateToBeRemoved);
    delete listToRemoveFrom[indexToRemove];
}


function getSubModelHubs(modelHub) {
    var subModelHubs;
    switch(modelHub["model"]["type"]) {
        case "list":
            subModelHubs =  modelHub["value"];
            break;

        case "logic":
            subModelHubs =  modelHub["value"]["operands"];
            break;

    }
    return subModelHubs;
}

var removeModeData = {
    "activeModelHub": null,
}
function toggleRemoveMode(modelHub = null) {
    var activeModelHub = removeModeData["activeModelHub"];

    var modelHubToActivate = null;
    var modelHubToDeactivate = null;

    if (modelHub === null) {
        if (activeModelHub === null) {
            return;
        } else {
            modelHubToDeactivate = activeModelHub;
        }
    } else {
        if (activeModelHub !== modelHub) {
            modelHubToActivate = modelHub;
        }        
        if (activeModelHub !== null) {
            modelHubToDeactivate = activeModelHub;
        } 
    }

    if (modelHubToDeactivate) {
        var subModelHubs = getSubModelHubs(modelHubToDeactivate);
        for(var subModelHub of subModelHubs) {
            if (!subModelHub) continue;
            subModelHub["modelForm"]["removeElement"].classList.add("hidden");
        }
    }      

    if (modelHubToActivate) {
        var subModelHubs = getSubModelHubs(modelHubToActivate);
        for(var subModelHub of subModelHubs) {
            if (!subModelHub) continue;
            subModelHub["modelForm"]["removeElement"].classList.remove("hidden");
        }
    }
    removeModeData["activeModelHub"] = modelHubToActivate;
    
    
}