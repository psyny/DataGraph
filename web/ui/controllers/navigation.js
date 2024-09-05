export { NavigationController }

import { ElementsController } from "./elements.js"

import { buildNotificationsModal } from "../builders/notificationsmodal.js";
import { buildSettingsModal } from "../builders/settingsmodal.js";

class NavigationController {
    static genericModal;

    static _getGenericModal() {
        if (!NavigationController.genericModal) {
            NavigationController.genericModal = ElementsController.fixedElements["genericModal"]["object"];
        }

        return NavigationController.genericModal;
    }
    
    /*
        ----------------------------------------------- Generic Modal
    */
    static closeGenericModal() {
        const gModal = NavigationController._getGenericModal();
        gModal.hide()
    }

    static openNotificationsModal() {
        const gModal = NavigationController._getGenericModal();
        buildNotificationsModal(gModal);
        gModal.show();      
    }
    
    static openSettingsModal() {
        const gModal = NavigationController._getGenericModal();
        buildSettingsModal(gModal);
        gModal.show();      
    }


}
