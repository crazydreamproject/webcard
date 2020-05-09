/*!
 * WebCard WcCommon class
 */
import WcTextAttr from './textattr.js';

// hold helper funcs used in many place

// singleton
var commonInstance;

function WcCommon() {
    if (typeof commonInstance === 'object') {
        return commonInstance;
    }
    commonInstance = this;
}
WcCommon.prototype = {
    constructor: WcCommon,
    toBoolean: function(val) {
        switch(typeof val) {
            case 'boolean': return val;
            case 'string': return (val.toLowerCase() === 'true'); // or just this is enough?
            case 'number': return (val != 0);
            case 'undefined': return val; // dont change type, since arg is not specified in caller.
            default: // object or function...
                console.error("passing type of " + typeof val + " to convert to boolean");
                return false;
        }
    },
    // textAttr getter/setter interpreting script desc.
    textAlign: function(textattr, val) {
        return textattr.textAlign(val);
    },
    textFont: function(textattr, val) {
        return textattr.family(val);
    },
    textHeight: function(textattr, val) {
        if (val) {
            val = parseFloat(val);
            if (isNaN(val)) return textattr.lineHeight();
            return textattr.lineHeight(val + 'px');
        } else {
            return textattr.lineHeight();
        }
    },
    textSize: function(textattr, val) {
        if (val) {
            val = parseFloat(val);
            if (isNaN(val)) return textattr.size();
            return textattr.size(val + 'px');
        } else {
            return textattr.size();
        }
    },
    // style comes in csv. i.e. "bold,italic, extend"
    textStyle: function(textattr, val) {
        var styles;
        if (val) {
            styles = val.split(',');
            for (var style in styles) {
                style = style.trim(); // chop whitespace at both ends
                switch(style) {
                    case 'normal': {
                        textattr.reset();
                        break;
                    }
                    default: { // should hit one of these
                        textattr.style(style);
                        textattr.weight(style);
                        textattr.stretch(style);
                        textattr.textBaseline(style);
                    }
                }
            }
        }
        styles = "";
        styles += (textattr.style() === WcTextAttr.style.normal) ? "" : textattr.style();
        styles += (textattr.weight() === WcTextAttr.weight.normal) ? "" : textattr.weight();
        styles += (textattr.stretch() === WcTextAttr.stretch.normal) ? "" : textattr.stretch();
        styles = (styles === "") ? "normal" : styles;
        return styles;
    },
};

commonInstance = new WcCommon();

export default commonInstance;
