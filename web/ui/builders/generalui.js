export {buildGeneralUI}

import { ElementsController } from "../controllers/elements.js";
import { NotificationsController } from "../controllers/notifications.js";
import { NavigationController } from "../controllers/navigation.js";

import { buildMainLeftMenu } from "./mainleftmenu.js";
import { buildMainTopMenu } from "./maintopmenu.js";

import { GenericModal } from "../components/genericmodal.js";
import { SmallTooltip } from "../components/smalltooltip.js";
import { Notifications } from "../../modules/notifications/notifications.js";
import { NotificationBar } from "../components/notificationsbar.js";


function buildGeneralUI () {
    collectFixedElementsData();

    buildUIelements();
    linkBehaviors();
    createTooltips();
    linkClicks();      
}


function collectFixedElementsData() {
    ElementsController.fixedElements = {};

    ElementsController.fixedElements["mainContainer"] = {};
    ElementsController.fixedElements["mainContainer"]["container"] = document.getElementById("uiMainContainer");    

    ElementsController.fixedElements["topMainMenu"] = {};
    ElementsController.fixedElements["topMainMenu"]["container"] = document.getElementById("uiTopMainMenuBarContainer");

    ElementsController.fixedElements["leftMainMenu"] = {};
    ElementsController.fixedElements["leftMainMenu"]["container"] = document.getElementById("uiLeftMainMenuBarContainer");    

    ElementsController.fixedElements["genericModal"] = {};
    ElementsController.fixedElements["genericModal"]["container"] = document.getElementById("uiModalLayer");
}


function toggleHidden(element) {
    element.classList.toggle("hidden");
}


function buildUIelements() {
    var topMainMenuElements = buildMainTopMenu(ElementsController.fixedElements["topMainMenu"]["container"]);
    ElementsController.fixedElements["topMainMenu"]["elements"] = topMainMenuElements;

    var leftMainMenuElements = buildMainLeftMenu(ElementsController.fixedElements["leftMainMenu"]["container"]);
    ElementsController.fixedElements["leftMainMenu"]["elements"] = leftMainMenuElements;

    ElementsController.fixedElements["genericModal"]["object"] = new GenericModal(ElementsController.fixedElements["genericModal"]["container"]);

    ElementsController.fixedElements["notificationBar"] = {};
    ElementsController.fixedElements["notificationBar"]["object"] = new NotificationBar(ElementsController.fixedElements["mainContainer"]["container"]);
}


function linkBehaviors() {
    // Link notifications obj to notifications bar
    const showNotifications = (notification) => {
        const notificationBar = ElementsController.fixedElements["notificationBar"]["object"];
        notificationBar.showNotification(notification);       
    };
    NotificationsController.notifications.registerListener( showNotifications, Notifications.SEVERITY.HIGH );
    NotificationsController.notifications.registerListener( showNotifications, Notifications.SEVERITY.MEDIUM );
    NotificationsController.notifications.registerListener( showNotifications, Notifications.SEVERITY.LOW );

    var i = 0;
    const sendNotifications = () => {
        i+= 1;
        const notificationObj = NotificationsController.notifications;
        notificationObj.addNotification( "Test sender", "CLICK" + i , Notifications.SEVERITY.HIGH);     
    };       
    ElementsController.fixedElements["topMainMenu"]["elements"]["projectsIcon"].addEventListener("click", sendNotifications );  
}


function createTooltips() {
    var smallToopTip = new SmallTooltip();
    smallToopTip.registerToElement(ElementsController.fixedElements["topMainMenu"]["elements"]["notificationsIcon"], "notifications", "bottom");
    smallToopTip.registerToElement(ElementsController.fixedElements["topMainMenu"]["elements"]["settingsIcon"], "settings", "bottom");
    smallToopTip.registerToElement(ElementsController.fixedElements["topMainMenu"]["elements"]["projectsIcon"], "project", "bottom");
    smallToopTip.registerToElement(ElementsController.fixedElements["topMainMenu"]["elements"]["menuIcon"], "main menu", "right");
}


function linkClicks() {
    // Show Hide Left Menu
    const toggleLeftMenu = () => {
        toggleHidden(ElementsController.fixedElements["leftMainMenu"]["elements"]["main"]);
    };
    ElementsController.fixedElements["topMainMenu"]["elements"]["menuIcon"].addEventListener("click", toggleLeftMenu );        

    // Open Settings
    ElementsController.fixedElements["topMainMenu"]["elements"]["settingsIcon"].addEventListener("click", NavigationController.openSettingsModal );  

    // Open Notifications 
    ElementsController.fixedElements["topMainMenu"]["elements"]["notificationsIcon"].addEventListener("click", NavigationController.openNotificationsModal );  
    ElementsController.fixedElements["notificationBar"]["object"].messageElement.addEventListener("click", NavigationController.openNotificationsModal );
}