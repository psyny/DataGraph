export {NotificationBar}

import { Notifications } from "../../modules/notifications/notifications.js";
import { createIcon } from "../../modules/iconic/iconic.js";

class NotificationBar {
    constructor(containerDiv, timeoutSeconds = 5) {
        this.displayTimer;
        this.timeoutSeconds = timeoutSeconds;

        // Build sub elements
        this.barElement = document.createElement("div");
        this.barElement.classList.add("uiNotificationsBar");

        this.messageElement = document.createElement("div");
        this.messageElement.classList.add("messageElement");
        this.barElement.appendChild(this.messageElement);

        this.controlsElement = document.createElement("div");
        this.controlsElement.classList.add("controlsElement");
        this.barElement.appendChild(this.controlsElement);   
        
        // Close Icon
        var closeIcon = createIcon("x1", 20);
        closeIcon.classList.add("clickable");
        const thisObj = this;
        closeIcon.addEventListener("click", () => { thisObj.hideNotifications()} );
        this.controlsElement.appendChild(closeIcon);

        containerDiv.appendChild(this.barElement);
    }

    showNotification(notification) {
        this.messageElement.textContent = notification["sender"] + ": " + notification["message"];
        
        switch(notification["severity"]) {
            case Notifications.SEVERITY.HIGH:
                this.barElement.classList.add("high");
                break;

            case Notifications.SEVERITY.MEDIUM:
                this.barElement.classList.add("mid");
                break;
                    
            case Notifications.SEVERITY.HIGH:
                this.barElement.classList.add("low");
                break;                    
        }

        // Set timeout for notification
        if (this.displayTimer) {
            clearTimeout(this.displayTimer);
        }

        const thisObj = this;
        const displayFunction = () => {
            thisObj.hideNotifications();
        }
        this.displayTimer = setTimeout(displayFunction, this.timeoutSeconds * 1000);
    }

    hideNotifications() {
        this.messageElement.textContent = '';
        this.barElement.classList.remove("high");
        this.barElement.classList.remove("mid");
        this.barElement.classList.remove("low");
    }
}