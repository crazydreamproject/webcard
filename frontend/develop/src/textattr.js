/*!
 * WebCard WcTextAttr class
 */

function WcTextAttr() {
    // mimic default settings of css
    this.font = {
        // in order of font short hand spec
        style: WcTextAttr.style.normal,
        weight: WcTextAttr.weight.normal,
        stretch: WcTextAttr.stretch.normal,
        variant: 'normal', // not to be used for now
        kerning: 'auto', // not to be used for now
        size: '16px', // the default size if not set.
        lineHeight: '18px', // normal value (1.14)
        family: 'sans-serif'
    };
    this._textAlign = WcTextAttr.textAlign.start;
    this._textBaseline = WcTextAttr.textBaseline.alphabetic;
    this._color = 'rgba(0,0,0,1.0)'; // black
    this._maxWidth = undefined; // not to be used for now
}
WcTextAttr.style = {
    normal: 'normal', italic: 'italic', oblique: 'oblique'
};
WcTextAttr.weight = {
    normal: 'normal', bold: 'bold', bolder: 'bolder', lighter: 'lighter'
};
WcTextAttr.stretch = {
    normal: 'normal', condensed: 'condensed', expanded: 'expanded'
};
WcTextAttr.textAlign = {
    start: 'start', end: 'end', left: 'left', center: 'center', right: 'right'
};
WcTextAttr.textBaseline = {
    alphabetic: 'alphabetic', top: 'top', hanging: 'hanging', middle: 'middle', ideographic: 'ideographic', bottom: 'bottom'
};
WcTextAttr.prototype = {
    constructor: WcTextAttr,
    _attrAssign: function(obj, old, val) {
        var ret = old;
        if (typeof val === 'string') {
            var set = false;
            for (var key in obj) {
                if (key === val) {
                    ret = obj[key];
                    set = true;
                    break;
                }
            }
            if (set === false) {
                alert(val + ": not keyword of " + obj);
            }
        }
        return ret;
    },
    buildUp: function(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                switch(key) {
                    case 'font': {
                        for (var prop in obj.font) {
                            if (obj.font.hasOwnProperty(prop)) {
                                this.font[prop] = obj.font[prop];
                            }
                        }
                        break;
                    }
                    default: {
                        this[key] = obj[key];
                    }
                }
            }
        }
    },
    style: function(val) {
        return (this.font.style = this._attrAssign(WcTextAttr.style, this.font.style, val));
    },
    weight: function(val) {
        return (this.font.weight = this._attrAssign(WcTextAttr.weight, this.font.weight, val));
    },
    stretch: function(val) {
        return (this.font.stretch = this._attrAssign(WcTextAttr.stretch, this.font.stretch, val));
    },
    size: function(val) {
        return (this.font.size = val ? val : this.font.size);
    },
    lineHeight: function(val) {
        return (this.font.lineHeight = val ? val : this.font.lineHeight);
    },
    family: function(val) {
        return (this.font.family = val ? val : this.font.family);
    },
    textAlign: function(val) {
        return (this._textAlign = this._attrAssign(WcTextAttr.textAlign, this._textAlign, val));
    },
    textBaseline: function(val) {
        return (this._textBaseline = this._attrAssign(WcTextAttr.textBaseline, this._textBaseline, val));
    },
    color: function(val) {
        return (this._color = val ? val : this._color);
    },
    fontCss: function() {
        return this.font.style + ' ' + this.font.weight + ' ' + this.font.stretch + ' ' + // this.font.kerning + ' ' : kerning not working?
            this.font.size + '/' + this.font.lineHeight + ' ' +
            this.font.family; // todo: double quote for font family name having space?
    },
    reset: function() {
        this.font.style = WcTextAttr.style.normal;
        this.font.weight = WcTextAttr.weight.normal;
        this.fonts.tretch = WcTextAttr.stretch.normal;
        this.font.variant = 'normal';
        this.font.kerning = 'auto';
        this.font.size = '16px';
        this.font.lineHeight = '18px';
        this.font.family = 'sans-serif';
        this._textAlign = WcTextAttr.textAlign.start;
        this._textBaseline = WcTextAttr.textBaseline.alphabetic;
        this._color = 'rgba(0,0,0,1.0)'; // black
        this._maxWidth = undefined; // not to be used for now
    }
};

export default WcTextAttr;
