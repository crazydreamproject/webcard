/**
 * class to manipulate audio, icon and picture resource
 */

import _ from 'lodash';
import WcStorage from './storage.js';
import DomOp from './dom.js';

var iconKey = WcStorage.keys.icon;
var iconSelectKey = WcStorage.keys.iconSelect;

function WcIcon(obj) {
    this.name = ""; // name must be uniq in WcResource.icons
    this.width = 32;
    this.height = 32;
    this.active = null;
    this.pressed = null;
    this.disabled = null;
    if (obj) {
        this.name = obj.name;
        this.width = obj.width;
        this.height = obj.height;
        // convert obj src to Image class
        var that = this;
        this.active = new Image();
        this.active.src = obj.active;
        this.active.isLoaded = false;
        this.active.onload = function() { that.active.isLoaded = true; };
        this.pressed = new Image();
        this.pressed.src = obj.pressed;
        this.pressed.isLoaded = false;
        this.pressed.onload = function() { that.pressed.isLoaded = true; };
        this.disabled = new Image();
        this.disabled.src = obj.disabled;
        this.disabled.isLoaded = false;
        this.disabled.onload = function() { that.disabled.isLoaded = true; };
    }
}
WcIcon.prototype = {
    constructor: WcIcon,
}

function WcPicture(obj) {
    this.name = ""; // name must be uniq in WcResource.pictures
    this.width = 640;
    this.height = 480;
    this.img = null;
    if (obj) {
        this.name = obj.name;
        this.width = obj.width;
        this.height = obj.height;
        this.img = new Image();
        this.img.src = obj.src;
        this.img.isLoaded = false;
        var that = this;
        this.img.onload = function() { that.img.isLoaded = true; };
    }
}
WcPicture.prototype = {
    constructor: WcPicture,
};

function WcAudio(obj) {
    this.name = "";
    this.color = 'black';
    this.notes = null; // other props TBD
    if (obj) {
        this.name = obj.name;
        this.color = obj.color;
        this.notes = obj.notes;
    }
}
WcAudio.prototype = {
    constructor: WcAudio,
};

// singleton class
var resourceInstance;

function WcResource() {
    if (typeof resourceInstance === 'object') {
        return resourceInstance;
    }
    this.icons = []; // array to hold above WcIcons
    this.pictures = [];
    this.audios = [];
    resourceInstance = this;
}
WcResource.prototype = {
    constructor: WcResource,
    setup: function() {

    },
    buildUp: function(obj) {
        if (!('resource' in obj)) {
            console.error("Internal Error: there must be resource obj.");
            return;
        }
        if (!('icons' in obj.resource)) {
            console.error("Internal Error: resource must have icons list");
            return;
        }
        if (!('pictures' in obj.resource)) {
            console.error("Internal Error: resource must have pictures list");
            return;
        }
        if (!('audios' in obj.resource)) {
            console.error("Internal Error: resource must have audios list");
            return;
        }
        // build up icons
        this.icons.splice(0, this.icons.length); // delete all elems in array first
        var icons = obj.resource.icons;
        for (var i = 0; i < icons.length; i++) {
            var iobj = icons[i];
            var icon = new WcIcon(iobj);
            this.icons.push(icon);
        }
        // build up pictures
        this.pictures.splice(0, this.pictures.length); // delete all elems in array first
        var pics = obj.resource.pictures;
        for (var i = 0; i < pics.length; i++) {
            var pobj = pics[i];
            var pic = new WcPicture(pobj);
            this.pictures.push(pic);
        }
        // build up audios
        this.audios.splice(0, this.audios.length); // delete all elems in array first
        var audios = obj.resource.audios;
        for (var i = 0; i < audios.length; i++) {
            var aobj = audios[i];
            var audio = new WcAudio(aobj);
            this.audios.push(audio);
        }

        return;
    },
    getIcons: function() {
        return this.icons;
    },
    findIcon: function(name) {
        var icon = _.find(this.icons, ['name', name]);
        return icon;
    },
    addIcon: function(icon) {
        //! todo: need validity checking here
        this.icons.push(icon);
    },
    getPictures: function() {
        return this.pictures;
    },
    findPicture: function(name) {
        var pic = _.find(this.pictures, ['name', name]);
        return pic;
    },
    addPicture: function(pic) {
        this.pictures.push(pic);
    },
    getAudios: function() {
        return this.audios;
    },
    editIcon: function(btn) {
        var idxIcon = null;
        // icon to json and save to storage to pass to icon.html window
        var iconsJson = JSON.stringify(this.icons, function(key,value) {
            if (value instanceof Image) {
                return value.src;
            }
            return value;
        });
        WcStorage.local.save(iconKey, iconsJson);

        var callback = function(ev) {
            var oldVal = ev.oldValue;
            var newVal = ev.newValue;
            var sArea = ev.storageArea;
            var key = ev.key;
            var url = ev.url;
            if (key === iconKey) {
                resourceInstance.icons = JSON.parse(newVal, function(key,value) { // todo. set to WcIcon class
//                    if (value instanceof Object && value.class_ == 'WcIcon') {
                    if (value instanceof Object && !(value instanceof Array)) {
                        return new WcIcon(value);
                    }
                    return value;
                });
            }
        };
        idxIcon = WcStorage.local.register(callback);

        var idxSel = null;
        var name = "";
        // set selected icon to btn, if any
        if (btn) {
            name = btn.icon();
            if (!name) {
                name = WcStorage.keys.iconSelectMagic;
            }
            var callback = function(ev) {
                var oldVal = ev.oldValue;
                var newVal = ev.newValue;
                var sArea = ev.storageArea;
                var key = ev.key;
                var url = ev.url;
                if (key === iconSelectKey) {
                    if (newVal !== WcStorage.keys.iconSelectMagic) {
                        var icon = resourceInstance.findIcon(newVal);
                        if (!icon) {
                            console.error("Internal Error: icon not found: " + newVal);
                        }
                        btn.icon(newVal);
                    } else {
                        btn.icon(null);
                    }
                    DomOp.sync();
                }
            };
            idxSel = WcStorage.local.register(callback);
        }
        WcStorage.local.save(iconSelectKey, name);

        var wnd = window.open('icon.html', null, 'top=100, left=100, width=800, height=800, menubar=no, toolbar=no, location=no, status=no, resizable=yes, scrollbars=no');
        //! fixme find a better way to detect child window closed
        var timer = setInterval(function() {
            if (wnd.closed) {
                clearInterval(timer); /*
                WcStorage.local.unregister(idxIcon);
                WcStorage.local.unregister(idxSel);
                WcStorage.local.remove(iconKey);
                WcStorage.local.remove(iconSelectKey); */
                DomOp.sync();
            }
        }, 1000);
        return;
    },
    classes: {
        icon: WcIcon,
        picture: WcPicture,
    },
    toJSON: function() {
        var json = JSON.stringify(this, function(key, value) {
            return value;
        }, " ");
        return json;
    },
};

resourceInstance = new WcResource();

export default resourceInstance;
