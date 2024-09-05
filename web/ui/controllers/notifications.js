export { NotificationsController }

import { Notifications } from "../../modules/notifications/notifications.js"

class NotificationsController {
    static notifications;

    static init() {
        NotificationsController.notifications = new Notifications();
        NotificationsController.notifications.setAlertForSeverity(Notifications.SEVERITY.HIGH);
    }
}