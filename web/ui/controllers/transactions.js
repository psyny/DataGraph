export { Transactions }

import { Requests } from "../../modules/network/requests.js"
import { NotificationsController } from "./notifications.js";
import { Notifications } from "../../modules/notifications/notifications.js";


class Transactions {
    static async getAppSettings() {
        var defaultSettings = await Requests.post("getDefaultSettings", {});

        if (Transactions.isError(defaultSettings)) {
            processError(defaultSettings);
        }

        return defaultSettings;
    }

    static isError(responseStructure) {
        if (responseStructure["status"] >= 300) {
            return true;
        }
        return false;
    }
}


function processError(response) {
    var message = "Could not reach the server: " + response["url"];
    NotificationsController.notifications.addNotification("Requests", message, Notifications.SEVERITY.HIGH );
}