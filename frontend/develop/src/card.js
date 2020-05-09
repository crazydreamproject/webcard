/*!
 * WebCard WcCard class
 */

import WcContainer from './container.js';
import WcCommon from './common.js';

/*
 * card sub class
 */
function WcCard(width, height, background) {
    WcContainer.call(this, WcContainer.type.card, width, height);
    this.properties.marked = false;
    this.properties.owner = background;
}
WcCard.prototype = Object.create(WcContainer.prototype);
WcCard.prototype.constructor = WcCard;
WcCard.prototype.buildUp = function(obj) {
    WcContainer.prototype.buildUp.call(this, obj);
    // copy properties of WcCard only
    for (var prop in obj.properties) {
        if (obj.properties.hasOwnProperty(prop)) {
            // set only properties of WcCard
            switch(prop) {
                case 'marked': // fall through
                {
                    this[prop](obj.properties[prop]);
                    break;
                }
            }
        }
    }
};

WcCard.prototype.marked = function(val) { return this.accessProperty("marked", WcCommon.toBoolean(val)); };
WcCard.prototype.owner = function(val) { return this.accessProperty("owner"); }; // read only

export default WcCard;
