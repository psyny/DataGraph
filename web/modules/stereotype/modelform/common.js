export { createIconLabelButton }

function createIconLabelButton(label, icon,  colors = "generalB", shape = "typeA") {
    // General Area
    var buttonMain = document.createElement("div");
    buttonMain.classList.add("buttoniconlabel");
    buttonMain.classList.add(shape);
    buttonMain.classList.add(colors);

    // Build Cosmetic Parts
    createIconLabelButton_aux_addCosmeticElement(buttonMain, "cosmeticA");
    createIconLabelButton_aux_addCosmeticElement(buttonMain, "cosmeticB");
    createIconLabelButton_aux_addCosmeticElement(buttonMain, "cosmeticC");
    createIconLabelButton_aux_addCosmeticElement(buttonMain, "cosmeticD");

    // Text Area
    if (label) {
        var labelMain = document.createElement("div"); 
        labelMain.classList.toggle("label");
        var labelEle = document.createTextNode(label); 
        labelMain.appendChild(labelEle);            
        buttonMain.appendChild(labelMain);
    }

    // Icon Area
    if (icon) {
    }

    return {
        "containerElement": buttonMain,
    }
}

function createIconLabelButton_aux_addCosmeticElement(mainButton, cosmeticClass) {
    var cosmeticEle = document.createElement("div");
    cosmeticEle.classList.add(cosmeticClass);

    mainButton.appendChild(cosmeticEle);
}