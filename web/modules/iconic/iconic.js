import definitions from './icons.json' assert { type: 'json' };

export {createIcon}

function createIcon(iconName, size = 20) {
    var iconDiv = document.createElement("div");
    iconDiv.classList.toggle("iconic");

    iconDiv.style.width = "" + size + "px";
    iconDiv.style.height = "auto";

    // Get Icon MetaData
    var iconData = definitions[iconName];
    if (iconData === null) {
        return iconDiv;
    }

    // SVG Element
    var svgEle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    iconDiv.appendChild(svgEle);

    for (var svgAttr in iconData["svg"]) {
        svgEle.setAttribute(svgAttr, iconData["svg"][svgAttr]);
    }

    // Path Elements
    var pathEle;    

    for (var pathData of iconData["paths"]) {
        pathEle = document.createElementNS('http://www.w3.org/2000/svg', "path");
        svgEle.appendChild(pathEle);

        for (var pathAttr in pathData) {
            pathEle.setAttribute(pathAttr, pathData[pathAttr]);
        }
    }

    return iconDiv
}