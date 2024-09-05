export { buildNotificationsModal }

import { NotificationsController } from "../controllers/notifications.js";
import { Notifications } from "../../modules/notifications/notifications.js";

function buildNotificationsModal(genericModalObj) {
    genericModalObj.clear();

    // Close Icon
    var closeIcon = genericModalObj.createCloseIcon(); 
    closeIcon.addEventListener("click", () => { genericModalObj.hide()} );

    // Modal Config
    genericModalObj.setDimensions();

    // Title
    genericModalObj.setTitle("Notifications");

    // Content
    var notificationsList = document.createElement("div");
    notificationsList.classList.add("notificationsList");

    genericModalObj.contentElement.appendChild(notificationsList);


    for(var notification of NotificationsController.notifications.notifications ) {
        var notiContainer = createNotificationElement(notification);
        notificationsList.appendChild(notiContainer);
    }

    notificationsList.scrollTop = notificationsList.scrollHeight;
}



function createNotificationElement(notification) {
    var notiContainer = document.createElement("div");
    notiContainer.classList.add("notificationContainer");

    var notiSeverityClass = "high";
    switch(notification["severity"]) {
        case Notifications.SEVERITY.HIGH:
            notiSeverityClass = "high";
            break;
        case Notifications.SEVERITY.MEDIUM:
            notiSeverityClass = "mid";
            break;
        case Notifications.SEVERITY.LOW:
            notiSeverityClass = "low";
            break;
    }
    notiContainer.classList.add(notiSeverityClass);

    var senderEle = document.createElement("div");
    senderEle.classList.add("header");
    senderEle.textContent = notification["sender"];
    notiContainer.appendChild(senderEle);

    var messageEle = document.createElement("div");
    messageEle.classList.add("message");
    messageEle.textContent = notification["message"];
    notiContainer.appendChild(messageEle);

    var footerEle = document.createElement("div");
    footerEle.classList.add("footer");
    footerEle.textContent = notification["timestamp"].toISOString();
    notiContainer.appendChild(footerEle);    

    return notiContainer;
}