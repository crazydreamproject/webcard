/*!
 * WebCard WcStack class
 */

import _ from 'lodash';
import WcLayer from './layer.js';
import WcContainer from './container.js';
import WcBackground from './background.js';
import WcButton from './button.js';
import WcField from './field.js';
import WcPart from './part.js';
import WcMode from './mode.js';
import WcStorage from './storage.js';
import WcResource from './resource.js';
import WcObject from './object.js';
import WcCard from './card.js';
import WcEvent from './event.js';
//import WcLayout from './layout.js';
import DomOp from './dom.js';

/*
 * helper functions
 */
function insertAfter(element, value, list) {
    var index = _.indexOf(list, value);
    list.splice(index + 1, 0, element);
}

/*
 * stack sub class
 */
function WcStack(name, width, height) {
    WcContainer.call(this, WcContainer.type.stack, width, height);
    // 1:1 properties with models.py WcContainer class
    this.name(name);
    //webCard.classes.WcObject.setName.call(this, name); // humm, this does not work... why?
    this.properties.freeSize = 0;
    this.properties.size = 0;
    // member variables
    // backgrounds of this stack
    this.backgrounds = [];
    this.currentBg = null;
    // all cards list of above all background
    // "go next card" will be performed based on this
    this.cards = [];
    this.currentCard = null;
    // btn or field in focus. used in e.g. button info menu.
    this.focusedPart = null;
}
WcStack.prototype = Object.create(WcContainer.prototype);
WcStack.prototype.constructor = WcStack;
WcStack.prototype.buildUp = function(obj) {
    WcContainer.prototype.buildUp.call(this, obj);
    // copy properties of WcStack only
    for (var prop in obj.properties) {
        if (obj.properties.hasOwnProperty(prop)) {
            // set only properties of WcStack
            switch(prop) {
                case 'freeSize': // fall through
                case 'size': // fall through
                {
                    this[prop](obj.properties[prop]);
                    break;
                }
            }
        }
    }
//    this.backgrounds = [];
    this.currentBg = _.find(this.backgrounds, function(b){ return b.id() === obj.currentBg; });
//    this.cards = [];
    for (var i = 0; i < obj.cards.length; i++) {
        var cd = null;
        var cid = obj.cards[i];
        for (var j = 0; j < this.backgrounds.length; j++) {
            var bg = this.backgrounds[j];
            cd = _.find(bg.bgcards, function(c){ return c.id() === cid; });
            if (cd) {
                break;
            }
        }
        if (cd) {
            this.cards.push(cd);
        } else {
            console.error("Internal Error: card id: " + cid + " not found in bg card lists");
        }

    }
    
    this.currentCard = _.find(this.cards, function(c){ return c.id() === obj.currentCard; });
    // check current card's btn, fld
    this.focusedPart = this.currentCard.getPartById(obj.focusedPart);
    if (!(this.focusedPart)) {
        // else current layer was bg.
        this.focusedPart = this.currentBg.getPartById(obj.focusedPart);
    } else {
        this.focusedPart = null;
    }
};

WcStack.prototype.freeSize = function(val) { return this.accessProperty("freeSize"); }; // read only
WcStack.prototype.size = function(val) { return this.accessProperty("size"); }; // read only

// helper func
WcStack.prototype.currentLayer = function () {
    switch(WcLayer.getLayer()) {
        case WcLayer.layers.stack:
            return this;
        case WcLayer.layers.background:
            return this.currentBg;
        case WcLayer.layers.card:
            return this.currentCard;
        default:
            console.error("Layer unknown: " + WcLayer.getLayer());
            return null;
    }
}

// stack public member methods
WcStack.prototype.newBackground = function() {
    var prevBg = this.currentBg;
    this.currentBg = new WcBackground(this.width(), this.height(), this);
    //this.backgrounds.push(this.currentBg);
    insertAfter(this.currentBg, prevBg, this.backgrounds);
    // also create new card for this brand new bg.
    this.newCard();
};

WcStack.prototype.newCard = function() {
    if (!this.currentBg) {
        console.error("INTERNAL ERROR: no current background!");
    }
    // also add to card list in stack
    var prevCard = this.currentCard;
    if (prevCard) {
        prevCard.savePicture();
    }
    this.currentCard = this.currentBg.newCard();
    insertAfter(this.currentCard, prevCard, this.cards);
};

WcStack.prototype.deleteCard = function() {
    if (this.cards.length <= 1) { // there should be at least one card left.
        return;
    }
    this.currentBg.deleteCard(); // delete from bg first
    if (this.currentBg.bgcards.length === 0) { // remove if empty bg
        var idx = _.indexOf(this.backgrounds, this.currentBg);
        this.backgrounds.splice(idx, 1);
    }

    // update stack card info
    var pos = _.indexOf(this.cards, this.currentCard);
    this.cards.splice(pos, 1); // remove this card in list
    // now point to prev card (or next)
    pos = (pos) ? pos - 1 : 1; // if first, set to next
    this.currentCard = this.cards[pos];
    this.currentBg = this.currentCard.owner();
}

WcStack.prototype.newButton = function() {
    // we setup new button to current card new button to bg is TBD.
    var layer = this.currentLayer();
    layer.savePicture();
//    var card = this.currentCard;
    var numButtons = layer.buttons.length;
    var numFields = layer.fields.length;
    var numParts = numButtons + numFields;
    var midX = layer.width() / 2;
    var midY = layer.height() / 2;
    var midW = 100;
    var midH = 26;
    var maxDepth = 0;
    for (var i = 0; i < numButtons; i++) {
        maxDepth = (layer.buttons[i].depth() > maxDepth) ? layer.buttons[i].depth() : maxDepth;
    }
    for (var j = 0; j < numFields; j++) {
        maxDepth = (layer.fields[j].depth() > maxDepth) ? layer.fields[j].depth() : maxDepth;
    }
    var btn = new WcButton(numButtons + 1, numParts + 1,
        parseInt(midX - midW), parseInt(midY - midH), parseInt(midX + midW), parseInt(midY + midH),
        maxDepth + 1, layer);
    // test
    btn.name("<new button>");
    layer.buttons.push(btn);
};

WcStack.prototype.newField = function() {
    // we setup new field to current card
    // @todo merge similar code with newButton func.
    var layer = this.currentLayer();
    layer.savePicture();
//    var card = this.currentCard;
    var numButtons = layer.buttons.length;
    var numFields = layer.fields.length;
    var numParts = numButtons + numFields;
    var midX = layer.width() / 2;
    var midY = layer.height() / 2;
    var midW = 100;
    var midH = 50;
    var maxDepth = 0;
    for (var i = 0; i < numButtons; i++) {
        maxDepth = (layer.buttons[i].depth() > maxDepth) ? layer.buttons[i].depth() : maxDepth;
    }
    for (var j = 0; j < numFields; j++) {
        maxDepth = (layer.fields[j].depth() > maxDepth) ? layer.fields[j].depth() : maxDepth;
    }
    var fld = new WcField(numFields + 1, numParts + 1,
        parseInt(midX - midW), parseInt(midY - midH), parseInt(midX + midW), parseInt(midY + midH),
        maxDepth + 1, layer);
    // test
    fld.name("<new field>");
    layer.fields.push(fld);
};

WcStack.prototype.firstCard = function() {
    return _.first(this.cards);
};

WcStack.prototype.prevCard = function() {
    var pos = _.indexOf(this.cards, this.currentCard);
    pos = (pos) ? pos - 1 : this.cards.length - 1; // if first, set to last
    return this.cards[pos];
};

WcStack.prototype.nextCard = function() {
    var pos = _.indexOf(this.cards, this.currentCard);
    pos = (pos != this.cards.length -1) ? pos + 1 : 0; // if last, set to first
    return this.cards[pos];
};

WcStack.prototype.lastCard = function() {
    return _.last(this.cards);
};

WcStack.prototype.findCardName = function(name) {
    var card = _.find(this.cards, function(o){ return o.properties.name === name; });
    // save case where name is number
    if (!card) {
        var num = parseInt(name);
        if (0 < num && num <= this.cards.length) {
            card = this.cards[num - 1]; // card num starts from 1, not 0.
        }
    }
    return card;
};

WcStack.prototype.findCardId = function(id) {
    var card = _.find(this.cards, function(o){ return o.properties.id === parseInt(id)});
    return card;
};

WcStack.prototype.firstBg = function() {
    return _.first(this.backgrounds);
};

WcStack.prototype.prevBg = function() {
    var pos = _.indexOf(this.backgrounds, this.currentBg);
    pos = (pos) ? pos - 1 : this.backgrounds.length - 1; // if first, set to last
    return this.backgrounds[pos];
};

WcStack.prototype.nextBg = function() {
    var pos = _.indexOf(this.backgrounds, this.currentBg);
    pos = (pos != this.backgrounds.length -1) ? pos + 1 : 0; // if last, set to first
    return this.backgrounds[pos];
};

WcStack.prototype.lastBg = function() {
    return _.last(this.backgrounds);
};

WcStack.prototype.findBgName = function(name) {
    var bg = _.find(this.backgrounds, { 'name': name });
    // save case where name is number
    if (!bg) {
        var num = parseInt(name);
        if (0 < num && num <= this.backgrounds.length) {
            bg = this.backgrounds[num - 1]; // bg num starts from 1, not 0.
        }
    }
    return bg;
};

WcStack.prototype.findBgId = function(id) {
    var bg = _.find(this.backgrounds, { 'id': id });
    return bg;
};

WcStack.prototype.numBackgrounds = function() {
    return this.backgrounds.length;
};

WcStack.prototype.numCards = function() {
    var num = 0;
    for (var i = 0; i < this.backgrounds.length; i++) {
        num += this.backgrounds[i].bgcards.length;
    }
    // or this.cards.length should return same value.
    var check = this.cards.length;
    if (check != num) {
        alert("Sanity Check Error: cards number mismatch");
    }
    return num;
};

function namedNewStack(name, width, height) {
    var stack = new WcStack(name, width, height);
    stack.newBackground();
    // stack.new_card(); // new card created at new_background.
    // setDocumentTitle(name);
    document.title = "WebCard Editor : " + name;
    return stack;
}

// default stack obj. there will always be some sort of stack, default or user defined.
// or should fixed width height value be used, like 1280x720 or so?...
// !todo to add menu to resize stack (to current window or specified value)
//console.log(WcLayout);
//var defaultStack = namedNewStack("<Playground Stack>", WcLayout.width(), WcLayout.height());

// singleton manager class of stack (and hence bg and card.)
var stackManagerInstance;
function StackManager() {
    if (typeof stackManagerInstance === "object") {
        return stackManagerInstance;
    }
    // handle just one stack for now...
    // this.stacks = [];
    //this.currentStack = defaultStack;
    this.currentStack = undefined;
    this.pushedFrames = [];
    this.events = {
        openCard: false,
        openBackground: false,
        openStack: false
    };
    // set singleton instance
    stackManagerInstance = this;
}
StackManager.getInstance = function() { return new StackManager(); };
StackManager.prototype = {
    constructor : StackManager,
    setup: function(name, width, height) {
        this.currentStack = namedNewStack(name, width, height);
        // do auto save stack data on mode change to browse
        WcMode.register(WcMode.modes.browse, this.autoSave);
        // load auto save data on (re-) load page
        this.autoLoad();
        // clear cut/copy/paste card local storage
        WcStorage.local.remove(WcStorage.keys.copyCard);
    },
    buildSaveData: function() {
        this.currentLayer().savePicture();
        var stacks = [this.currentStack]; // currently, only one stack available
        var res = WcResource;
//        var saveData = { stacks: stacks }; //, resource: res };
        var saveData = { stacks: stacks, resource: { icons: res.getIcons(), pictures: res.getPictures(), audios: res.getAudios() } };
        var json = JSON.stringify(saveData, function(key, value) {
            switch (key) {
                case 'script': return value.script;
                case 'owner': return value.id();
                case 'currentCard': return value.id();
                case 'currentBg': return value.id();
                case 'focusedPart': return (value) ? value.id() : value;
                case 'cards': { // just list array of ids instead of whole contents (which is dup of bgcards)
                    return _.map(value, function(card) { return card.id(); });
                }
                case 'icon': { return value; } // icon only hold name, img is in WcResource.icons.[active,pressed,disabled], as below
                case 'picture': { return value; } // picture only hold name, img is in WcResource.pictures, as below
                case 'img': { return value.src; } // picture img, changing key from "img" to "src" at below split + join.
                case 'active': { return value.src; } // icon img
                case 'pressed': { return value.src; } // icon img
                case 'disabled': { return value.src; } // icon img
            }
            return value;
        }, " ").split('"img":').join('"src":');
        return json;
    },
    localSave: function(key) {
        var data = this.buildSaveData();
        WcStorage.local.save(key, data);
    },
    remoteSave: function(title) {
        var data = this.buildSaveData();
        WcStorage.remote.save(title, data);
    },
    jsonLoad: function(json) {
        var jsonObj = JSON.parse(json);
        WcResource.buildUp(jsonObj);
        this.currentStack = this.buildUp(jsonObj)[0]; // currently, there are only one stack.
        document.title = "WebCard Editor : " + this.currentStack.name();
    },
    localLoad: function(key) {
        var json = WcStorage.local.load(key);
        if (!json) {
            console.error("Internal Error: json of key: " + key + " not found");
            return;
        }
        this.jsonLoad(json);
    },
    remoteLoad: function(title) {
        WcStorage.remote.load(title, function(json) {
            // check json
            if (!json) { // no data with this title
                var errtxt = "JSON Data not found in server of title: " + title;
                console.error(errtxt);
                alert(errtxt); // ! TODO: to use bootstrap alert style later
                return false;
            }

            if (!("stacks" in json) || !($.isArray(json.stacks)) || !("properties" in json.stacks[0]) //) {
                || !("name" in json.stacks[0].properties)
                || !(json.stacks[0].properties.name === title)) {
                    // loosen name check
                console.log(son.stacks[0].properties.name);
                console.log(title);
                var errtxt = "JSON Data for title: " + title + " format is wrong, name: " + json.stacks[0].properties.name;
                console.error(errtxt);
                alert(errtxt); // ! TODO: to use bootstrap alert style later
                return false;
            }

            // OK json data is correct. first convert to string to pass to jsonLoad
            stackManagerInstance.jsonLoad(JSON.stringify(json));
            // since it is async, DomOp.update() in modal.js openStack misses. call it here
            DomOp.update();
        });
    },
    buildUp: function(jsonObj) {
        // convert jsonObj to WcXxxx classes
        var stks = [];
        var stacks = jsonObj.stacks;
        if (!stacks) {
            console.error("jsonObj does not contain stacks obj to build up.");
        }
        WcObject.monotonicId = 0; // reset monotonic id
        for (var s = 0; s < stacks.length; s++) { // currently, there are only one stack limitation...
            var stkObj = stacks[s];
            var stk = new WcStack(stkObj.properties.name, stkObj.properties.width, stkObj.properties.height);
            for (var b = 0; b < stkObj.backgrounds.length; b++) {
                var bgObj = stkObj.backgrounds[b];
                var bg = new WcBackground(bgObj.properties.width, bgObj.properties.height, stk);
                stk.backgrounds.push(bg);
                for (var c = 0; c < bgObj.bgcards.length; c++) {
                    var cdObj = bgObj.bgcards[c];
                    var cd = new WcCard(cdObj.properties.width, cdObj.properties.height, bg);
                    bg.bgcards.push(cd);
                    cd.buildUp(cdObj);
                }
                bg.buildUp(bgObj);
            }
            stk.buildUp(stkObj);
            stks.push(stk);
        }
        return stks;
    },
    autoSave: function() {
        var key = WcStorage.keys.autoSave;
        var mgr = stackManagerInstance; // note: since called from WcMode register, 'this' points to document.
        mgr.localSave(key);
    },
    autoLoad: function() {
        var key = WcStorage.keys.autoSave;
        var json = WcStorage.local.load(key);
        if (json) {
            this.localLoad(key);
        } // else. brand new opening will not have autoSave data.
    },
    currentCard : function() { return this.currentStack.currentCard; },
    currentBg : function() { return this.currentStack.currentBg; },
    currentLayer: function() { return this.currentStack.currentLayer(); },
    gotoCard: function(card) {
        // fire closeCard of prev card here
        WcEvent.fire(WcEvent.systemMessages.closeCard);
        this.events.openCard = true; // will be consumed in DomOp update
        // check bg change
        if (card.owner() != this.currentBg()) {
            WcEvent.fire(WcEvent.systemMessages.closeCard);
            this.events.openBackground = true; // will be consumed in DomOp update
        }
        var stk = this.currentStack;
        stk.currentCard.savePicture();
        stk.currentCard = card;
        // card.loadPicture(); // handled in dom update
        stk.currentBg = card.owner();
    },
    gotoBackground: function(bg) {
        // fire closeBg of prev card here
        WcEvent.fire(WcEvent.systemMessages.closeBackground);
        this.events.openBackground = true; // will be consumed in DomOp update
        var stk = this.currentStack;
        //! todo: ad-hoc. revisit
        stk.currentCard.savePicture();
        stk.currentBg.savePicture();
        stk.currentBg = bg;
        stk.currentCard = bg.bgcards[0];

        return;

        // find the bg in traversing cards
        var idx = _.find(stk.cards, function(c) { return c === stk.currentCard; });
        var nextBg = null;
        var nextCard = null;
        return;
        // below is bug... if next card is same bg, it just goes to next card, not bg
        // start traversing from next card
        for (var i = idx + 1; i < stk.cards.length; i++) {
            if (stk.cards[i].owner === bg) {
                nextBg = stk.cards[i].owner;
                nextCard = stk.cards[i];
                break;
            }
        }
        if (!nextBg) {
            for (var i = 0; i <= idx; i++) {
                if (stk.cards[i].owner === bg) {
                    nextBg = stk.cards[i].owner;
                    nextCard = stk.cards[i];
                    break;
                }
            }
        }
        if (!nextBg) {
            console.error("Unknown bg to go to bg id: " + bg.id + ', idx: ' + idx);
            return;
        }
        stk.currentCard.savePicture();
        stk.currentBg.savePicture();
        stk.currentBg = nextBg;
        stk.currentCard = nextCard;
    },
    gotoStack: function(stk) {
        alert('not yet implemented');
    },
    // funcs for menu
    newStack : function(name, width, height) {
        // fire closeStack of prev card here
        WcEvent.fire(WcEvent.systemMessages.closeStack);
        this.currentStack = namedNewStack(name, width, height);
        //this.stacks.push(this.current_stack);
    },
    openStack : function(name, location) {
        // fire closeStack of prev card here
        WcEvent.fire(WcEvent.systemMessages.closeStack);
        this.events.openStack = true; // will be consumed in DomOp update
        if (!name) {
            alert("No Stack title name selected");
            return;
        }
        if (location === 'localStorage') {
            this.localLoad(name);
        } else if (location === 'remoteStorage') {
            this.remoteLoad(name);
        }
    },
    closeStack : function() {
        // fire closeStack of prev card here
        WcEvent.fire(WcEvent.systemMessages.closeStack);
        alert("Not yet implemented (close_stack).");
        // close and release resources
        //this.status = StackManager.statusType.STACK_NONE;
    },
    checkSaveName: function(name) {
        for (var key in WcStorage.keys) {
            if (name === WcStorage.keys[key]) {
                alert("Stack name: " + name + " is a reserverd name, Use other name.");
                return false;
            }
        }
        return true;
    },
    saveAs : function(name, location) {
        // check name is valid
        if (! this.checkSaveName) {
            return;
        }
        if (location === 'localStorage') {
            // save to local storage
            // update file list
            var files = WcStorage.local.load(WcStorage.keys.localStacks);
            var arr;
            if (files) {
                arr = JSON.parse(files); // should give me array of file names.
                if (!($.isArray(arr))) {
                    console.error("Internal Error: saved file lists is not Array");
                }
            } else {
                arr = [];
            }
            if (!_.includes(arr, name)) {
                arr.push(name);
            }
            var json = JSON.stringify(arr);
            WcStorage.local.save(WcStorage.keys.localStacks, json);
            this.localSave(name);
        } else if (location === 'remoteStorage') {
            // save to server
            this.remoteSave(name);
        }
        this.currentStack.name(name); // set name of stack to saveAs name
    },
    compactStack : function() {
        // clean up and garbage collection
        alert("Not yet implemented (compact_stack).");
    },
    protectStack : function() {
        // clean up and garbage collection
        alert("Not yet implemented (protect_stack).");
    },
    deleteStack : function(name, location) {
        if (location === 'localStorage') {
            // update file list
            var files = WcStorage.local.load(WcStorage.keys.localStacks);
            if (!files) {
                console.error("Internal Error: empty localStacks list, but trying to delete!");
                return;
            }
            var arr = JSON.parse(files);
            _.remove(arr, function(elem){ return elem === name; });
            var json = JSON.stringify(arr);
            WcStorage.local.save(WcStorage.keys.localStacks, json);
            WcStorage.local.remove(name);
        } else if (location === 'remoteStorage') {
            WcStorage.remote.remove(name);
        }
    },
    stackInfo : function() {
        // show stack name, number, id, etc...
        //alert("Not yet implemented (stack_info).");
        return this.currentStack;
    },
    newCard : function() {
        this.currentStack.newCard();
    },
    deleteCard : function() {
        this.currentStack.deleteCard();
    },
    // helper func to store card into local storage
    storeCard: function(card) {
        var json = JSON.stringify(card, function(key, value){
            switch (key) {
                case 'script': return value.script;
                case 'owner': return value.id();
                // anything else ?
            }
            return value;
        }, " ");
        WcStorage.local.save(WcStorage.keys.copyCard, json);
    },
    cutCard: function() {
        this.storeCard(this.currentCard());
        this.deleteCard();
    },
    copyCard: function() {
        this.storeCard(this.currentCard());
    },
    pasteCard: function() {
        var json = WcStorage.local.load(WcStorage.keys.copyCard);
        if (!json) {
            // empty. do cut/copy card before paste card
            return;
        }
        var jsonObj = JSON.parse(json);
        this.newCard();
        // note: need to change id so not to duplicate id of copied card id. (revisit)
        // note: this means script like "put id of me" will change in pasted card
        var id = this.currentCard().id();
        this.currentCard().buildUp(jsonObj);
        this.currentCard().id(id);
    },
    newButton : function() {
        this.currentStack.newButton();
    },
    newField : function() {
        this.currentStack.newField();
    },
    newBackground : function() {
        this.currentStack.newBackground();
    },
    goFirst : function() {
        var card = this.currentStack.firstCard();
        this.gotoCard(card);
    },
    goPrev : function() {
        var card = this.currentStack.prevCard();
        this.gotoCard(card);
    },
    goNext : function() {
        var card = this.currentStack.nextCard();
        this.gotoCard(card);
    },
    goLast : function() {
        var card = this.currentStack.lastCard();
        this.gotoCard(card);
    },
    // funcs for scripting
    getPartFrame: function(json) {
        var frame = this.currentCard(); // default to search part in current card.
        if ('owner' in json) {
            switch (json.owner) {
                case 'card': frame = this.currentCard(); break;
                case 'background': frame = this.currentBg(); break;
                case 'stack': frame = this.currentStack; break;
                default: console.error("Unknown owner: " + json.owner); return null;
            }
        }
        if ('frame' in json) {
            frame = this.getFrame(json.frame);
        }
        return frame;
    },
    getButton: function(json) {
        var btn = null;
        var frame = this.getPartFrame(json);
        if (!frame) {
            return null;
        }
        if ('id' in json) {
            btn = frame.getButtonById(json.id);
        }
        if ('expr' in json) {
            btn = frame.getButtonByName(json.expr);
        }
        if (!btn) {
            btn = frame.getButtonByNumber(json.expr);
        }
        return btn;
    },
    getField: function(json) {
        var fld = null;
        var frame = this.getPartFrame(json);
        if (!frame) {
            return null;
        }
        if ('id' in json) {
            fld = frame.getFieldById(json.id);
        }
        if ('expr' in json) {
            fld = frame.getFieldByName(json.expr);
        }
        if (!fld) {
            fld = frame.getFieldByNumber(json.expr);
        }
        return fld;
    },
    getPart: function(json) {
        var part = null;
        if ('part' in json) {
            switch (json.part) {
                case 'button': part = this.getButton(json); break;
                case 'field': part = this.getField(json); break;
                default:
                    console.error("Unknown part: " + json.part);
            }
        } else {
            console.error('No part member found in json: ' + JSON.stringify(json));
        }
        return part;
    },
    deleteButton: function(btn) {
        btn.owner().deleteButton(btn);
        return;
    },
    deleteField: function(fld) {
        fld.owner().deleteField(fld);
        return;
    },
    deletePart: function(part) {
        switch(part.partType()) {
            case WcPart.type.button: return this.deleteButton(part);
            case WcPart.type.field: return this.deleteField(part);
            default:
                return console.error("Unknown part type: " + part.partType());
        }
    },
    getFrame: function(json) {
        var frame = json.frame;
        //! todo: handle ofbg and ofstk (like go card 2 of bg 2)
        var ofbg = ('background' in json) ? json.background : null;
        var ofstk = ('stack' in json) ? json.stack : null;
        if (frame === 'card' && !ofbg) {
            // frame pointer handling
            if ('pointer' in json) {
                switch(json.pointer) {
                    case 'first': return this.currentStack.firstCard();
                    //! todo : cards[i] might not exist. need checking here?
                    case 'second': return this.currentStack.cards[1];
                    case 'third': return this.currentStack.cards[2];
                    case 'fourth': return this.currentStack.cards[3];
                    case 'fifth': return this.currentStack.cards[4];
                    case 'sixth': return this.currentStack.cards[5];
                    case 'seventh': return this.currentStack.cards[6];
                    case 'eighth': return this.currentStack.cards[7];
                    case 'ninth': return this.currentStack.cards[8];
                    case 'tenth': return this.currentStack.cards[9];
                    case 'last': return this.currentStack.lastCard();
                    case 'prev': return this.currentStack.prevCard();
                    case 'next': return this.currentStack.nextCard();
                    case 'this': return this.currentCard();
                    default:
                        console.error("Unknown pointer: " + json.pointer);
                }
            }
            // expr handling
            if ('expr' in json) {
                return this.currentStack.findCardName(json.expr);
            }
            if ('id' in json) {
                return this.currentStack.findCardId(json.id);
            }
        }
        if (frame === 'background' && !ofstk) {
            // frame pointer handling
            if ('pointer' in json) {
                switch(json.pointer) {
                    case 'first': return this.currentStack.firstBg();
                    //! todo : backgrounds[i] might not exist. need checking here?
                    case 'second': return this.currentStack.backgrounds[1];
                    case 'third': return this.currentStack.backgrounds[2];
                    case 'fourth': return this.currentStack.backgrounds[3];
                    case 'fifth': return this.currentStack.backgrounds[4];
                    case 'sixth': return this.currentStack.backgrounds[5];
                    case 'seventh': return this.currentStack.backgrounds[6];
                    case 'eighth': return this.currentStack.backgrounds[7];
                    case 'ninth': return this.currentStack.backgrounds[8];
                    case 'tenth': return this.currentStack.backgrounds[9];
                    case 'last': return this.currentStack.lastBg();
                    case 'prev': return this.currentStack.prevBg();
                    case 'next': return this.currentStack.nextBg();
                    case 'this': return this.currentBg();
                    default:
                        console.error("Unknown pointer: " + json.pointer);
                }
            }
            // expr handling
            if ('expr' in json) {
                return this.currentStack.findBgName(json.expr);
            }
            if ('id' in json) {
                return this.currentStack.findBgId(json.id);
            }
        }
        if (frame === 'stack') {
            return this.currentStack;
        }
    },
    gotoFrame: function(frame) {
        switch(frame.containerType()) {
            case WcContainer.type.card: return this.gotoCard(frame);
            case WcContainer.type.bg: return this.gotoBackground(frame);
            case WcContainer.type.stack: return this.gotoStack(frame);
            default:
                return console.error("Unknown frame type: " + frame.containerType());
        }
    },
    pushFrame: function(frame) {
        this.pushedFrames.push(frame);
    },
    popFrame: function() {
        return this.pushedFrames.pop();
    }
};

stackManagerInstance = new StackManager();

export default stackManagerInstance;
