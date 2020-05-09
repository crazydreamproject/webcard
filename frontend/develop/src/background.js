/*!
 * WebCard WcBackground class
 */

import _ from 'lodash';
import WcContainer from './container.js';
import WcCard from './card.js';

/*
 * helper functions
 */
function insertAfter(element, value, list) {
    var index = _.indexOf(list, value);
    list.splice(index + 1, 0, element);
}

/*
 * background sub class
 */
function WcBackground(width, height, stack) {
    WcContainer.call(this, WcContainer.type.bg, width, height);
    this.properties.owner = stack;
    // member variables
    // below bgcards array will hold list of bgcards pointing this bg.
    this.bgcards = [];
    // this.current_card = null; // handle current card only in stack.
}
WcBackground.prototype = Object.create(WcContainer.prototype);
WcBackground.prototype.constructor = WcBackground;
WcBackground.prototype.buildUp = function(obj) {
    WcContainer.prototype.buildUp.call(this, obj);
};

WcBackground.prototype.owner = function(val) { return this.accessProperty("owner"); }; // read only

// background public member methods. DO NOT CALL THESE unless from Stack class
WcBackground.prototype.newCard = function() {
    //var prev_card = this.current_card;
    var prevCard = this.owner().currentCard;
    // sanity check
    if (0 < this.bgcards.length) {
        var pos = _.indexOf(this.bgcards, prevCard);
        if (pos < 0) {
            alert("Sanity Check Error: stack's current card is not in this bg.");
        }
    }
    var card = new WcCard(this.width(), this.height(), this);
    insertAfter(card, prevCard, this.bgcards);
    return card;
};

WcBackground.prototype.deleteCard = function() {
    var curr = this.owner().currentCard;
    var idx = _.indexOf(this.bgcards, curr);
    if (idx >= 0) {
        this.bgcards.splice(idx, 1);
    }
}

WcBackground.prototype.numCards = function() {
    var num = this.bgcards.length;
    return num;
};

export default WcBackground;
