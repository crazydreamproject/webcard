/*!
 * WebCard WcContainer class
 */

import _ from 'lodash';
import WcObject from './object.js';
import WcScript from './script.js';
import WcPaint from './paint.js';
import WcCommon from './common.js';
import WcResource from './resource.js';
import WcButton from './button.js';
import WcField from './field.js';

/*
 * container base class, a subclass of WcObject.
 */
function WcContainer(type, width, height) {
    WcObject.call(this);
    this.properties.containerType = type;
    // 1:1 properties with models.py WcContainer class
    this.properties.cantAbort = false;
    this.properties.cantDelete = false;
    this.properties.cantModify = false;
    this.properties.cantPeek = false;
    this.properties.showPict = true;
    this.properties.width = width;
    this.properties.height = height;
    // below 3 properties is in sub class on models.py but for JS, stick it here.
    this.properties.script = new WcScript(this);
    this.picture = null; // picture will only hold name, img is held at WcResources. !todo: picture is property, move to this.properties.
//    this.next = null; // not used...
    // part object
    this.buttons = [];
    this.fields = [];
}
WcContainer.type = {
    card: "Card Container Type",
    bg: "Background Container Type",
    stack: "Stack Container Type"
};
WcContainer.prototype = Object.create(WcObject.prototype);
WcContainer.prototype.constructor = WcContainer;
WcContainer.prototype.numButtons = function() {
    return this.buttons.length;
};
WcContainer.prototype.numFields = function() {
    return this.fields.length;
};
WcContainer.prototype.getButtonById = function(idnum) {
//  var btn = _.find(this.buttons, function(o){ return o.accessProperty("id") == parseInt(idnum)}); // accessProperty() func is dropped...
    var btn = _.find(this.buttons, function(o){ return o.properties.id === parseInt(idnum)});
    return btn;
};
WcContainer.prototype.getFieldById = function(idnum) {
    var fld = _.find(this.fields, function(o){ return o.properties.id === parseInt(idnum); });
    return fld;
};
WcContainer.prototype.getPartById = function(idnum) {
    var part = this.getButtonById(idnum);
    if (!part) {
        part = this.getFieldById(idnum);
    }
    return part;
};
WcContainer.prototype.getButtonByName = function(name) {
    var btn = _.find(this.buttons, function(o){ return o.properties.name === name; });
    return btn;
};
WcContainer.prototype.getFieldByName = function(name) {
    var fld = _.find(this.fields, function(o){ return o.properties.name === name; });
    return fld;
};
WcContainer.prototype.getPartByName = function(name) {
    var part = this.getButtonByName(name);
    if (!part) {
        part = this.getFieldByName(name);
    }
    return part;
};
WcContainer.prototype.getButtonByNumber = function(number) {
    var btn = _.find(this.buttons, function(o){ return o.properties.number === number; });
    return btn;
};
WcContainer.prototype.getFieldByNumber = function(number) {
    var fld = _.find(this.fields, function(o){ return o.properties.number === number; });
    return fld;
};
WcContainer.prototype.getPartByNumber = function(number) {
    var part = this.getButtonByNumber(number);
    if (!part) {
        part = this.getFieldByNumber(number);
    }
    return part;
};
WcContainer.prototype.deleteButton = function(btn) {
    var idx = this.buttons.indexOf(btn);
    this.buttons.splice(idx, 1); // remove this btn
    return;
};
WcContainer.prototype.deleteField = function(fld) {
    var idx = this.fields.indexOf(fld);
    this.fields.splice(idx, 1); // remove this fld
    return;
};
WcContainer.prototype.savePicture = function() {
//    this.picture = WcPaint.getCanvasImage();
    var name;
    switch(this.containerType()) {
        case WcContainer.type.card: { name = 'Card'; break; }
        case WcContainer.type.bg: { name = 'Bg'; break; }
        case WcContainer.type.stack: { name = 'Stack'; break; }
        default: { console.error("Internal Error: no such container type: " + this.type); name = 'ERROR'; break; }
    }
    name += ' ID ' + this.id() + ' picture (Reserved)';
    var img = WcPaint.getCanvasImage();
    var pic = WcResource.findPicture(name);
    if (pic) {
        pic.img = img;
    } else { // not found. create and add to resource
        pic = new WcResource.classes.picture({
            name: name,
            width: this.width(),
            height: this.height(),
            src: img.src,
        });
        WcResource.addPicture(pic);
    };
    this.picture = name;
};
WcContainer.prototype.loadPicture = function() {
    if (this.picture) {
        var pic = WcResource.findPicture(this.picture);
        if (pic) {
            WcPaint.setCanvasImage(pic.img);
        } else {
            console.error("Internal Error: picture: " + this.picture)
        }
    }
};

WcContainer.prototype.buildUp = function(obj) {
    // copy properties
    for (var prop in obj.properties) {
        if (obj.properties.hasOwnProperty(prop)) {
            // set only properties of WcContainer and WcObject
            switch(prop) {
                case 'name': // fall through
                case 'number': // fall through
                case 'id': // fall through
                case 'containerType': // fall through
                case 'cantAbort': // fall through
                case 'cantDelete': // fall through
                case 'cantModify': // fall through
                case 'cantPeek': // fall through
                case 'showPict': // fall through
                case 'width': // fall through
                case 'height': // fall through
                {
                    this[prop](obj.properties[prop]);
                    break;
                }
                case 'script': {
                    this.script().setScript(obj.properties.script);
                    break;
                }
            }
        }
    }
    this.picture = obj.picture;

    for (var i = 0; i < obj.buttons.length; i++) {
        var b = obj.buttons[i];
        var btn = new WcButton(0,0,0,0,0,0,0,this); // put dummy since its set in buildUp
        btn.buildUp(b);
        this.buttons.push(btn);
    }

    for (var i = 0; i < obj.fields.length; i++) {
        var f = obj.fields[i];
        var fld = new WcField(0,0,0,0,0,0,0,this); // put dummy since its set in buildUp
        fld.buildUp(f);
        this.fields.push(fld);
    }
};


WcContainer.prototype.containerType = function(val) { return this.accessProperty("containerType"); }; // read only
WcContainer.prototype.cantAbort = function(val) { return this.accessProperty("cantAbort", WcCommon.toBoolean(val)); };
WcContainer.prototype.cantDelete = function(val) { return this.accessProperty("cantDelete", WcCommon.toBoolean(val)); };
WcContainer.prototype.cantModify = function(val) { return this.accessProperty("cantModify", WcCommon.toBoolean(val)); };
WcContainer.prototype.cantPeek = function(val) { return this.accessProperty("cantPeek", WcCommon.toBoolean(val)); };
WcContainer.prototype.showPict = function(val) { return this.accessProperty("showPict", WcCommon.toBoolean(val)); };
WcContainer.prototype.width = function(val) { return this.accessProperty("width", parseInt(val)); };
WcContainer.prototype.height = function(val) { return this.accessProperty("height", parseInt(val)); };
WcContainer.prototype.script = function(val) { return this.accessProperty("script"); };
WcContainer.prototype.rect = function(val) { // read only.
    var width = parseInt(this.accessProperty("width"));
    var height = parseInt(this.accessProperty("height"));
    return 0 + ',' + 0 + ',' + width + ',' + height;
};

export default WcContainer;
