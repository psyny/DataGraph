export {SmallTooltip}

class SmallTooltip {
    constructor() {
        this.arrowSize = 7.5;

        this.container;
        this.frame;
        this.arrow;
        this.content;    

        this.visible = false;
        this.onMouse = false;
        this.targetElement = null;
        this.targetPosition = "bottom";
        this.targetExtraSpacing;
        
        this.showTimer;
        this.hideTimer;
        this.updateTime;

        // ------------------------
        this.container = document.createElement("div");
        this.container.classList.add("uiSmallToolTip"); 
        this.container.classList.add("container");  

        this.frame = document.createElement("div");
        this.frame.classList.add("uiSmallToolTip"); 
        this.frame.classList.add("frame");                 
        this.container.appendChild(this.frame);    

        this.arrow = document.createElement("div");
        this.arrow.classList.add("uiSmallToolTip");  
        this.arrow.classList.add("arrow");  
        this.container.appendChild(this.arrow);    

        document.body.appendChild(this.container);

        this.show();

        // --------------
        const obj = this;
        const fun = () => {
            obj._updatePosition();
        }
        setInterval(fun, 1000);
    }

    showTimeout() {
        const obj = this;
        const fun = () => {
            obj.show();
        }
        this.showTimer = setTimeout(fun, 500);
    }
    
    show() {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = null;
        }        

        this.container.classList.remove("hidden");
        this._updatePosition();
    }

    hide() {
        if (this.showTimer) {
            clearTimeout(this.showTimer);
            this.showTimer = null;
        }   

        this.container.classList.add("hidden");
    }

    registerToElement(element, content, position = "bottom", extraSpacing = 10) {
        const toolTipObj = this;
        const cElement = element;
        const cContent = content;
        const cPosition = position;
        const cExtraSpacing = extraSpacing;

        this.hide();

        const showFunc = () => {
            toolTipObj.setContent(cContent);
            toolTipObj.attachToElement(cElement, cPosition, cExtraSpacing);
            toolTipObj.showTimeout();
        };

        element.addEventListener("mouseover", showFunc);

        const hideFunc = () => {
            toolTipObj.hide();
        };

        element.addEventListener("mouseout", hideFunc);
    }

    setContent(txt) {
        this.frame.innerText = '';
        this.frame.innerHTML = txt;
    }

    _updatePosition() {
        if (this.targetElement) {
            // Gather Base Data
            const gap = this.arrowSize + this.targetExtraSpacing;
            const viewportW = getWidth();
            const viewportH = getHeight();
            const viewportGap = 10;
            const frameDims =  this.frame.getBoundingClientRect();

            // Get target element center
            var targetEleDims = this.targetElement.getBoundingClientRect();        
                
            const centerX = (targetEleDims.x + (targetEleDims.width * 0.5));
            const centerY = (targetEleDims.y + (targetEleDims.height * 0.5));
    
            // Anchor based on tooltip desired relative position
            var anchorX;
            var anchorY;

            switch(this.targetPosition) {
                case "bottom":
                    anchorX = centerX;
                    anchorY = targetEleDims.bottom + gap;
                    break;

                case "top":
                    anchorX = centerX;
                    anchorY = targetEleDims.top - gap;
                    break;

                case "right":
                    anchorX = targetEleDims.right + gap;
                    anchorY = centerY;
                    break;    
                    
                case "left":
                    anchorX = targetEleDims.left - gap;
                    anchorY = centerY;
                    break;                       
            }

            // Positioning Vars
            var leftPos;
            var halfWidth;
            var topPos;
            var halfHeight;

            // Tooltip arrow positioning
            switch(this.targetPosition) {
                case "bottom":
                    leftPos = anchorX + "px";
                    topPos = anchorY - (this.arrowSize * 2.0) + "px";
                    break;

                case "top":
                    leftPos = anchorX + "px";
                    topPos = anchorY + "px";
                    break;

                case "left":
                    leftPos = anchorX + "px";
                    topPos = anchorY + "px";
                    break;

                case "right":
                    leftPos = anchorX - (this.arrowSize * 2) + "px";
                    topPos = anchorY + "px";
                    break;
            }            
            this.arrow.style.top = topPos;
            this.arrow.style.left = leftPos;

            // Tooltip frame positioning        
            halfWidth = (frameDims.width * 0.5);
            halfHeight = (frameDims.height * 0.5);
            
            switch(this.targetPosition) {
                case "bottom":
                case "top":
                    if (anchorX + halfWidth > viewportW ) {
                        leftPos = viewportW - frameDims.width - viewportGap;
                    } else if (anchorX - halfWidth < 0) {
                        leftPos = viewportGap;
                    } else {
                        leftPos = anchorX - halfWidth;
                    }
        
                    if (anchorY + frameDims.height > viewportH ) {
                        if (this.targetPosition === "bottom") {
                            this.targetPosition = "top";
                        }
                        topPos = anchorY;
                    } else if (anchorY - frameDims.height < 0) {
                        if (this.targetPosition === "top") {
                            this.targetPosition = "bottom";
                        }
                        topPos = anchorY - frameDims.height;
                    } else {
                        if (this.targetPosition === "bottom") {
                            topPos = anchorY;
                        } else {
                            topPos = anchorY - frameDims.height;
                        }
                    }
                    break;

                case "left":
                case "right":
                    if (anchorX + frameDims.width > viewportW ) {
                        if (this.targetPosition === "right") {
                            this.targetPosition = "left";
                        }                        
                        leftPos = anchorX - frameDims.width;
                    } else if (anchorX - frameDims.width < 0) {
                        if (this.targetPosition === "left") {
                            this.targetPosition = "right";
                        }                        
                        leftPos = anchorX;
                    } else {
                        if (this.targetPosition === "left") {
                            leftPos = anchorX - frameDims.width;
                        } else {
                            leftPos = anchorX;
                        }
                    }

                    if (anchorY + halfHeight > viewportH ) {
                        topPos = viewportH - frameDims.height - viewportGap;
                    } else if (anchorY - halfHeight < 0) {
                        topPos = viewportGap;
                    } else {
                        topPos = anchorY - halfHeight;
                    }
                    break;
            }            

            this.frame.style.left = leftPos + "px";
            this.frame.style.top = topPos + "px";            
        }
    }

    attachToElement(element, position = "bottom", extraSpacing = 5) {
        this.arrow.classList.remove(this.targetPosition);

        this.targetElement = element;
        this.targetPosition = position;
        this.targetExtraSpacing = extraSpacing;

        this.arrow.classList.add(position);      
    }
}



function getWidth() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}
  
function getHeight() {
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}
