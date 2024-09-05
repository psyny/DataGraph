export {Notifications}

class Notifications {
    static SEVERITY = {
        HIGH: 0,
        MEDIUM: 1,
        LOW: 2,
    }

    constructor() {
        this.notifications = [];  
        
        this.alert = {};
        for(var severity in Object.keys(Notifications.SEVERITY)) {
            this.alert[severity] = false;
        }

        this.listeners = {};
        for(var severity in Object.keys(Notifications.SEVERITY)) {
            this.listeners[severity] = [];
        }
    }

    setAlertForSeverity(severity, alert = true ) {
        this.alert[severity] = alert;
    }

    registerListener(listenerFunc, severity) {
        this.listeners[severity].push(listenerFunc);
    }    

    addNotification(sender, message, severity) {
        var notification = {
            sender: sender,
            message: message,
            severity: severity,
            timestamp: new Date(),
        };

        if (this.alert[severity] === true) {
            for(var listenerFunc of this.listeners[severity]) {
                listenerFunc(notification);
            }
        }

        this.notifications.push(notification);        
    }
}