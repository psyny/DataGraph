import { Transactions } from "./controllers/transactions.js";
import { ElementsController } from "./controllers/elements.js";
import { NotificationsController } from "./controllers/notifications.js";
import { LoadFeedbackController } from "./controllers/loadfeedback.js";
import { NavigationController } from "./controllers/navigation.js";

window.addEventListener("load", init );

async function init() {    
    NotificationsController.init();
    ElementsController.init();

    const loadId = LoadFeedbackController.activateOverlay(
        ElementsController.fixedElements["mainContainer"]["container"], 
        "Loading Default Settings", 
        100);    
    var defaultSettings = await Transactions.getAppSettings();
    console.log(defaultSettings);    
    LoadFeedbackController.deactivateOverlay(loadId);

    if (Transactions.isError(defaultSettings)) {
        NavigationController.openSettingsModal();
    }
}
