/*!
 * WebCard WcButton class
 */

import WcPart from './part.js';
import WcCommon from './common.js';

/*
 * button sub class
 */
function WcButton(number, partNumber, left, top, right, bottom, depth, owner) {
    WcPart.call(this, WcPart.type.button, number, partNumber, left, top, right, bottom, depth, owner);
    // encapsle into properties object
    this.properties.style = WcButton.style.standard;
    this.properties.showName = true;
    this.properties.autoHilite = false;
    this.properties.enabled = true;
    this.properties.family = 0;
    this.properties.hilite = false;
    this.properties.icon = null;
}
WcButton.style = {
    checkbox : "Check Box",
    opaque : "Opaque",
    oval : "Oval",
    popup : "Popup",
    radio : "Radio",
    rectangle : "Rectangle",
    roundrect : "Round Rect",
    shadow : "Shadow",
    standard : "Standard",
    transparent : "Transparent"
};
WcButton.prototype = Object.create(WcPart.prototype);
WcButton.prototype.constructor = WcButton;
WcButton.prototype.buildUp = function(obj) {
    WcPart.prototype.buildUp.call(this, obj);
    // copy properties of WcButton only
    for (var prop in obj.properties) {
        if (obj.properties.hasOwnProperty(prop)) {
            // set only properties of WcButton
            switch(prop) {
                case 'style': // fall through
                case 'showName': // fall through
                case 'autoHilite': // fall through
                case 'enabled': // fall through
                case 'family': // fall through
                case 'hilite': // fall through
                case 'icon': // fall through
                {
                    this[prop](obj.properties[prop]);
                    break;
                }
            }
        }
    }
};

WcButton.prototype.style = function(val) {
    if (val) {
        var style = WcButton.style;
        for (var key in style) {
            if (val === style[key]) {
                this.properties.style = style[key];
            }
        }
    }
    return this.accessProperty("style");
};
WcButton.prototype.showName = function(val) { return this.accessProperty("showName", WcCommon.toBoolean(val)); };
WcButton.prototype.autoHilite = function(val) { return this.accessProperty("autoHilite", WcCommon.toBoolean(val)); };
WcButton.prototype.enabled = function(val) { return this.accessProperty("enabled", WcCommon.toBoolean(val)); };
WcButton.prototype.family = function(val) { return this.accessProperty("family", parseInt(val)); };
WcButton.prototype.hilite = function(val) { return this.accessProperty("hilite", WcCommon.toBoolean(val)); };
WcButton.prototype.icon = function(val) { return this.accessProperty("icon", val); };

export default WcButton;
