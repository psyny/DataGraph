import {Definitions} from '../definitions/definitions.js'

export { Requests }

let backenddefinitions = Definitions.getDefinitions();

class Requests {
    static async post(partialPath, jsBody, jsHeader = {}) {
        return await Requests._request(partialPath, "POST", jsBody, jsHeader);
    }

    static async get(partialPath, jsBody, jsHeader = {}) {  
        return await Requests._request(partialPath, "GET", jsBody, jsHeader);
    }

    static async _request(partialPath, method, jsBody, jsHeader) {
        const requestParam = getRequestParameters(jsHeader, jsBody);
        const fullPath = getFullPath(partialPath);
        var responseObject;
        var fallbackObject;

        await fetch(
            fullPath,
            {
                method: method,
                headers: requestParam["header"],
                body: requestParam["body"],
            },
        ).then(
            (response) => {
                responseObject = response;
            }
        ).catch(
            (error) => {
                fallbackObject = {
                    "status": 404,
                    "statusText": error,
                    "url": fullPath,
                }
            }
        );


        if (responseObject) {
            return await getResponseData(responseObject);
        } else {
            return fallbackObject;
        }
    }

    static async test() {
        console.log("TEST")
    } 
}


function getFullPath(partialPath) {
    return "http://" + backenddefinitions["host"] + ":" + backenddefinitions["port"] + '/' + partialPath;
}

function getRequestParameters(header, body) {
    var modHeader;
    if (!header) {
        modHeader = {};
    } else {
        modHeader = header;
    }

    if (!modHeader["Content-Type"]) {
        modHeader["Content-Type"] = "application/json";
    }

    var modBody;
    switch (modHeader["Content-Type"]) {
        case "application/json":
            modBody = JSON.stringify(body);
            break;

        default:
            modBody = body;
    }

    return {
        "header": modHeader,
        "body": modBody
    }
}

async function getResponseData(response) {
    const responseData = {};

    // Basic response data
    responseData["status"] = response["status"];
    responseData["statusText"] = response["statusText"];
    responseData["url"] = response["url"];
    responseData["redirected"] = response["redirected"];
    responseData["type"] = response["type"];

    // Build a header map
    var headersMap = {};
    for (var headerTuple of response.headers) {
        headersMap[headerTuple[0].toLowerCase()] = headerTuple[1];
    }
    responseData["headers"] = headersMap;

    // Body processing
    var body;
    switch (responseData["headers"]["content-type"]) {
        case "application/json":
            body = await response.json();
            break;

        default:
            // TODO: solve. Ref: https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Using_readable_streams
            body = await response.body;
    }
    responseData["body"] = body;

    return responseData;
}