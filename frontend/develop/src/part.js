/*!
 * WebCard WcPart class
 */

import WcObject from './object.js';
import WcScript from './script.js';
import WcTextAttr from './textattr.js';
import WcCommon from './common.js';

/*
 * part base class, a subclass of WcObject.
 */
function WcPart(type, number, partNumber, left, top, right, bottom, depth, owner) {
    WcObject.call(this);
    this.number(number);
    // encapsle into properties object
    // 1:1 properties with models.py WcPart class
    this.properties.partType = type; // button or field
    this.properties.partNumber = partNumber; // incremented num in one container
    // rect of this part
    this.properties.left = left;
    this.properties.top = top;
    this.properties.right = right;
    this.properties.bottom = bottom;
    this.properties.visible = true;
    // bigger, the further
    this.properties.depth = depth;
    // below 3 properties is in sub class on models.py but for JS, stick it here.
    this.properties.owner = owner;
    this.properties.script = new WcScript(this);
    this.properties.textAttr = new WcTextAttr();
    if (this.properties.partType === WcPart.type.button) {
        this.properties.textAttr.textAlign('center');
    }
    this.properties.bgColor = null;
}
WcPart.type = {
    button : "Button Part Type",
    field : "Field Part Type"
};
WcPart.prototype = Object.create(WcObject.prototype);
WcPart.prototype.constructor = WcPart;
WcPart.prototype.buildUp = function(obj) {
    // copy properties of WcPart only
    for (var prop in obj.properties) {
        if (obj.properties.hasOwnProperty(prop)) {
            // set only properties of WcPart and WcObject
            switch(prop) {
                case 'name': // fall through
                case 'number': // fall through
                case 'id': // fall through
                case 'partType': // fall through
                case 'partNumber': // fall through
                case 'left': // fall through
                case 'top': // fall through
                case 'right': // fall through
                case 'bottom': // fall through
                case 'visible': // fall through
                case 'depth': // fall through
                case 'bgColor': // fall through
                {
                    this[prop](obj.properties[prop]);
                    break;
                }
                case 'script': {
                    this.script().setScript(obj.properties.script);
                    break;
                }
                case 'textAttr': {
                    this.textAttr().buildUp(obj.properties.textAttr);
                    break;
                }
            }
        }
    }
};

// Access to properties
WcPart.prototype.partType = function(val) { return this.accessProperty("partType"); }; // read only
WcPart.prototype.partNumber = function(val) { return this.accessProperty("partNumber", parseInt(val)); };
WcPart.prototype.left = function(val) { return this.accessProperty("left", parseInt(val)); };
WcPart.prototype.top = function(val) { return this.accessProperty("top", parseInt(val)); };
WcPart.prototype.right = function(val) { return this.accessProperty("right", parseInt(val)); };
WcPart.prototype.bottom = function(val) { return this.accessProperty("bottom", parseInt(val)); };
WcPart.prototype.visible = function(val) { return this.accessProperty("visible", WcCommon.toBoolean(val)); };
WcPart.prototype.depth = function(val) { return this.accessProperty("depth", parseInt(val)); };
WcPart.prototype.owner = function(val) { return this.accessProperty("owner"); }; // read only
WcPart.prototype.script = function(val) { return this.accessProperty("script"); };
WcPart.prototype.textAttr = function(val) { return this.accessProperty("textAttr"); }; // read only
WcPart.prototype.textAlign = function(val) { return WcCommon.textAlign(this.accessProperty("textAttr"), val); };
WcPart.prototype.textFont = function(val) { return WcCommon.textFont(this.accessProperty("textAttr"), val); };
WcPart.prototype.textHeight = function(val) { return WcCommon.textHeight(this.accessProperty("textAttr"), val); };
WcPart.prototype.textSize = function(val) {  return WcCommon.textSize(this.accessProperty("textAttr"), val); };
WcPart.prototype.textStyle = function(val) {  return WcCommon.textStyle(this.accessProperty("textAttr"), val); };
WcPart.prototype.bgColor = function(val) { return this.accessProperty("bgColor", val); }; //! fixme: parser does not have this property
// properties which needs handling
WcPart.prototype.width = function(val) {
    var left = parseInt(this.accessProperty("left"));
    var right = parseInt(this.accessProperty("right"));
    var width = right - left;
    if (val) {
        var tmp = parseInt(val);
        if (!isNaN(tmp)) {
            width = tmp;
            this.accessProperty("right", left + width); // expand right to set width
        }
    }
    return width;
};
WcPart.prototype.height = function(val) {
    var top = parseInt(this.accessProperty("top"));
    var bottom = parseInt(this.accessProperty("bottom"));
    var height = bottom - top;
    if (val) {
        var tmp = parseInt(val);
        if (!isNaN(tmp)) {
            height = tmp;
            this.accessProperty("bottom", top + height); // expand bottom to set height
        }
    }
    return height;
};
WcPart.prototype.loc = function(val) {
    if (val) { // val should be in form of "<locX>,<locY>"
        if (val.indexOf(',') > 0) { // check comma exists
            var xNew = parseInt(val.split(',')[0]);
            var yNew = parseInt(val.split(',')[1]);
            if (!isNaN(xNew) && !isNaN(yNew)) { // check this is number
                var left = this.accessProperty("left");
                var right = this.accessProperty("right");
                var top = this.accessProperty("top");
                var bottom = this.accessProperty("bottom");
                var halfW = (right - left) / 2;
                var halfH = (bottom - top) / 2;
                this.accessProperty("left", xNew - halfW);
                this.accessProperty("right", xNew + halfW);
                this.accessProperty("top", yNew - halfH);
                this.accessProperty("bottom", yNew + halfH);
            }
        }
    }
    var locX = parseInt((this.accessProperty("left") + this.accessProperty("right")) / 2);
    var locY = parseInt((this.accessProperty("top") + this.accessProperty("bottom")) / 2);
    return locX + ',' + locY;
};
WcPart.prototype.topLeft = function(val) {
    var top = parseInt(this.accessProperty("top"));
    var left = parseInt(this.accessProperty("left"));
    if (val) { // val should be in form of "<locX>,<locY>"
        if (val.indexOf(',') > 0) { // check comma exists
            left = parseInt(val.split(',')[0]);
            top = parseInt(val.split(',')[1]);
            if (!isNaN(top) && !isNaN(left)) { // check this is number
                this.accessProperty("top", top);
                this.accessProperty("left", left);
            }
        }
    }
    return left + ',' + top; // humm, name is topLeft, but returns <left>,<top>... its x,y format.
};
WcPart.prototype.bottomRight = function(val) {
    var bottom = parseInt(this.accessProperty("bottom"));
    var right = parseInt(this.accessProperty("right"));
    if (val) { // val should be in form of "<locX>,<locY>"
        if (val.indexOf(',') > 0) { // check comma exists
            right = parseInt(val.split(',')[0]);
            bottom = parseInt(val.split(',')[1]);
            if (!isNaN(bottom) && !isNaN(right)) { // check this is number
                this.accessProperty("bottom", bottom);
                this.accessProperty("right", right);
            }
        }
    }
    return right + ',' + bottom; // humm, name is bottomRight, but returns <right>,<bottom>... its x,y format.
};
WcPart.prototype.rect = function(val) {
    var top = parseInt(this.accessProperty("top"));
    var left = parseInt(this.accessProperty("left"));
    var bottom = parseInt(this.accessProperty("bottom"));
    var right = parseInt(this.accessProperty("right"));
    if (val) { // val should be in form of "<locX>,<locY>"
        if (val.indexOf(',') > 0) { // check comma exists
            left = parseInt(val.split(',')[0]);
            top = parseInt(val.split(',')[1]);
            right = parseInt(val.split(',')[2]);
            bottom = parseInt(val.split(',')[3]);
            if (!isNaN(top) && !isNaN(left) && !isNaN(bottom) && !isNaN(right)) { // check this is number
                this.accessProperty("top", top);
                this.accessProperty("left", left);
                this.accessProperty("bottom", bottom);
                this.accessProperty("right", right);
            }
        }
    }
    return left + ',' + top + ',' + right + ',' + bottom;
};


export default WcPart;
