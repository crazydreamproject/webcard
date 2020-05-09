/*!
 * WebCard menu
 */

import StackOp from './stack.js';
import WcMode from './mode.js';
import WcLayer from './layer.js';
import WcModal from './modal.js';
import WcTool from './tool.js';
import WcOptions from './options.js';
import WcPaint from './paint.js';
import WcStorage from './storage.js';
import DomOp from './dom.js';
import WcEvent from './event.js';
import WcResource from './resource.js';

var menuFrameId;
var menuComponent = [];
function setupDefaultMenu() {
    // clear menu
    menuComponent.length = 0;
    // add "File" menu
    var fileBar = {
        id: "FileBar", name: "File", callback: undefined,
        menuItem: [
            { id: "NewStack", name: "New Stack...", callback: WcModal.newStack },
            { id: "OpenStack", name: "Open Stack...", kbd: ["Ctrl", "O"], callback: WcModal.openStack },
            { id: "CloseStack", name: "Close Stack", kbd: ["Ctrl", "W"], callback: WcModal.closeStack },
            { id: "SaveCopy", name: "Save a Copy...", callback: WcModal.saveStack },
            { type: "separator", name: "divider" },
            { id: "CompactStack", name: "Compact Stack", callback: StackOp.compactStack },
            { id: "ProtectStack", name: "Protect Stack...", callback: StackOp.protectStack },
            { id: "DeleteStack", name: "Delete Stack...", callback: WcModal.deleteStack },
            { type: "separator", name: "divider" },
            { id: "PageSetup", name: "Page Setup...", callback: undefined },
            { id: "PrintField", name: "Print Field...", callback: undefined },
            { id: "PrintCard", name: "Print Card", kbd: ["Ctrl", "P"], callback: undefined },
            { id: "PrintStack", name: "Print Stack...", callback: undefined },
            { id: "PrintReport", name: "Print Report...", callback: undefined },
            { type: "separator" },
            { id: "Quit", name: "Quit", kbd: ["Ctrl", "Q"], callback: function(){ alert("you can not quit!");} }
        ]
    };
    menuInstance.addMenuBar(fileBar);
    // add "Edit" menu
    var editBar = {
        id: "EditBar", name: "Edit", callback: undefined,
        menuItem: [
            { id: "Undo", name: "Undo", kbd: ["Ctrl", "Z"], callback: undefined },
            { type: "separator", name: "divider" },
            { id: "Cut", name: "Cut", kbd: ["Ctrl", "X"], callback: undefined },
            { id: "Copy", name: "Copy", kbd: ["Ctrl", "C"], callback: function() {
                if (WcMode.getMode() === WcMode.modes.paint) {
                    var img = WcPaint.getSelectedImage();
                    if (img) {
                        WcStorage.local.save(WcStorage.keys.copyPaste, img.src);
                    }
                }
            } },
            //! todo: need to toggle paste and paste card...
            // { id: "Paste", name: "Paste", kbd: ["Ctrl", "V"], callback: undefined },
            { id: "PasteCard", name: "Paste Card", kbd: ["Ctrl", "V"], callback: function(){ StackOp.pasteCard(); DomOp.update(); } },
            { id: "Clear", name: "Clear", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "NewCard", name: "New Card", kbd: ["Ctrl", "N"], callback: function(){ StackOp.newCard(); DomOp.update(); } },
            { id: "DeleteCard", name: "Delete Card", callback: function(){ StackOp.deleteCard(); DomOp.update(); } },
            { id: "CutCard", name: "Cut Card", callback: function(){ StackOp.cutCard(); DomOp.update(); } },
            { id: "CopyCard", name: "Copy Card", callback: function(){ StackOp.copyCard(); } },
            { type: "separator", name: "divider" },
            { id: "TextStyle", name: "Text Style", kbd: ["Ctrl", "T"], callback: undefined },
            { id: "BackgroundMenuItem", name: "Background", kbd: ["Ctrl", "B"], callback: function() {
                // do this savePicture() before changing layer!
                StackOp.currentLayer().savePicture();
                if (WcLayer.getLayer() !== WcLayer.layers.background) {
                    WcLayer.setLayer(WcLayer.layers.background);
                    //! fixme: ad hoc impl. to be handled in updateMenuUI with hidden check area
                    $('#BackgroundMenuItem').prepend($('<i>', { "class": "fa fa-check" }));
                } else {
                    WcLayer.setLayer(WcLayer.layers.card);
                    $('#BackgroundMenuItem').find('i').remove();
                }
                DomOp.update();
            } },
            { id: "Icon", name: "Icon...", kbd: ["Ctrl", "I"], callback: function() {
                WcResource.editIcon();
            } },
            { type: "separator", name: "divider" },
            { id: "Audio", name: "Audio...", callback: function() {
                // todo: check setup local storage needed here
                var wnd = window.open('audio.html', null, 'top=100, left=100, width=800, height=600, menubar=no, toolbar=no, location=no, status=no, resizable=yes, scrollbars=no');
                
            } },
            { id: "AudioHelp", name: "Audio Help", callback: undefined }
        ]
    };
    menuInstance.addMenuBar(editBar);
    // add "Go" menu
    var goBar = {
        id: "GoBar", name: "Go", callback: undefined,
        menuItem: [
            { id: "Back", name: "Back", kbd: ["Ctrl", "~"], callback: undefined },
            { id: "Home", name: "Home", kbd: ["Ctrl", "H"], callback: undefined },
            { id: "Help", name: "Help", kbd: ["Ctrl", "?"], callback: function(){ WcEvent.fire(WcEvent.systemMessages.help); } },
            { id: "Recent", name: "Recent", kbd: ["Ctrl", "R"], callback: undefined },
            { type: "separator", name: "divider" },
            { id: "First", name: "First", kbd: ["Ctrl", "1"], callback: function(){ StackOp.goFirst(); DomOp.update(); } },
            { id: "Prev", name: "Prev", kbd: ["Ctrl", "2"], callback: function(){ StackOp.goPrev(); DomOp.update(); } },
            { id: "Next", name: "Next", kbd: ["Ctrl", "3"], callback: function(){ StackOp.goNext(); DomOp.update(); } },
            { id: "Last", name: "Last", kbd: ["Ctrl", "4"], callback: function(){ StackOp.goLast(); DomOp.update(); } },
            { type: "separator", name: "divider" },
            { id: "Find", name: "Find...", kbd: ["Ctrl", "F"], callback: undefined },
            { id: "Message", name: "Message", kbd: ["Ctrl", "M"], callback: WcEvent.message.open },
            { id: "Scroll", name: "Scroll", kbd: ["Ctrl", "Z"], disabled: true, callback: undefined },
            { id: "NextWindow", name: "Next Window", kbd: ["Ctrl", "L"], disabled: true, callback: undefined },    
        ]
    };
    menuInstance.addMenuBar(goBar);
    // add "Palette" menu (formerly Tool menu)
    var paletteBar = {
        id: "PaletteBar", name: "Palettes", callback: undefined,
        menuItem: [
            { id: "ToolsMenu", name: "Tools", callback: function(){ WcTool.toggleToolPalette(); }},
            { id: "OptionsMenu", name: "Options", callback: function() { WcOptions.toggleOptionsPalette(); }}
        ]
    };
    menuInstance.addMenuBar(paletteBar);
    // add "Objects" menu
    var objectsBar = {
        id: "ObjectsBar", name: "Objects", callback: undefined,
        menuItem: [
            { id: "ButtonInfo", name: "Button Info...", callback: WcModal.buttonInfo },
            { id: "FieldInfo", name: "Field Info...", callback: WcModal.fieldInfo },
            { id: "CardInfo", name: "Card Info...", callback: WcModal.cardInfo },
            { id: "BkgndInfo", name: "Bkgnd Info...", callback: WcModal.backgroundInfo },
            { id: "StackInfo", name: "Stack Info...", callback: WcModal.stackInfo },
            { type: "separator", name: "divider" },
            { id: "BringCloser", name: "Bring Closer", kbd: ["Ctrl", "+"], callback: undefined },
            { id: "BringFarther", name: "Bring Farther", kbd: ["Ctrl", "-"], callback: undefined },
            { type: "separator", name: "divider" },
            { id: "newButton", name: "New Button", callback: function(){ StackOp.newButton(); DomOp.update(); } },
            { id: "newField", name: "New Field", callback: function(){ StackOp.newField(); DomOp.update(); } },
            { id: "newBackground", name: "New Background", callback: function(){ StackOp.newBackground(); DomOp.update(); } },
        ]
    };
    menuInstance.addMenuBar(objectsBar);

    var paintBar = {
        id: "paintBar", name: "Paint", hidden: true, callback: undefined,
        menuItem: [
            { id: "select", name: "Select", kbd: ["Ctrl", "S"], callback: undefined },
            { id: "selectAll", name: "Select All...", kbd: ["Ctrl", "A"], callback: undefined },
            { type: "separator", name: "divider" },
            { id: "fill", name: "Fill", callback: undefined },
            { id: "invert", name: "Invert", callback: undefined },
            { id: "pickup", name: "Pickup", callback: undefined },
            { id: "darken", name: "Darken", callback: undefined },
            { id: "lighten", name: "Lighten", callback: undefined },
            { id: "trace_edges", name: "Trace Edges", callback: undefined },
            { id: "rotate_left", name: "Rotate Left", callback: undefined },
            { id: "rotate_right", name: "Rotate Right", callback: undefined },
            { id: "flip_vertical", name: "Flip Vertical", callback: undefined },
            { id: "flip_horizontal", name: "Flip Horizontal", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "opaque", name: "Opaque", callback: undefined },
            { id: "transparent", name: "Transparent", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "keep", name: "Keep", kbd: ["Ctrl", "K"], callback: undefined },
            { id: "revert", name: "Revert", callback: undefined },
        ]
    };
    menuInstance.addMenuBar(paintBar);

    var optionsBar = {
        id: "optionsBar", name: "Options", hidden: true, callback: undefined,
        menuItem: [
            { id: "grid", name: "Grid", callback: undefined },
            { id: "fatbits", name: "FatBits", callback: undefined },
            { id: "powerkeys", name: "Power Keys", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "lineSize", name: "Stroke Size", callback: undefined },
            { id: "brushShape", name: "Brush Shape", callback: undefined },
            { id: "editPattern", name: "Edit Pattern", callback: undefined },
            { id: "polygonSides", name: "Polygon Sides", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "drawFilled", name: "Draw Filled", callback: undefined },
            { id: "drawCentered", name: "Draw Centered", callback: undefined },
            { id: "drawMultiple", name: "Draw Multiple", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "Rotate", name: "Rotate", callback: undefined },
            { id: "slant", name: "Slant", callback: undefined },
            { id: "distort", name: "Distort", callback: undefined },
            { id: "perspective", name: "Perspective", callback: undefined },
        ]
    };
    menuInstance.addMenuBar(optionsBar);
    
    var patternsBar = {
        id: "patternsBar", name: "Patterns", hidden: true, callback: undefined };
    menuInstance.addMenuBar(patternsBar);

    // todo: fontBar and styleBar to be integrated to reflect WcTextAttr
    var fontBar = {
        id: "fontBar", name: "Font", callback: undefined,
        menuItem: [
            { id: "chicago", name: "Chicago", callback: undefined },
            { id: "courier", name: "Courier", callback: undefined },
            { id: "geneva", name: "Geneva", callback: undefined },
            { id: "helvetica", name: "Helvetica", callback: undefined },
            { id: "osaka", name: "Osaka", callback: undefined },
            { id: "times", name: "Times", callback: undefined },
        ]
    };
    menuInstance.addMenuBar(fontBar);

    var styleBar = {
        id: "styleBar", name: "Style", callback: undefined,
        menuItem: [
            { id: "plain", name: "Plain", callback: undefined },
            { id: "bold", name: "Bold", callback: undefined },
            { id: "italic", name: "Italic", callback: undefined },
            { id: "underline", name: "Underline", callback: undefined },
            { id: "outline", name: "Outline", callback: undefined },
            { id: "shadow", name: "Shadow", callback: undefined },
            { id: "condense", name: "Condense", callback: undefined },
            { id: "extend", name: "Extend", callback: undefined },
            { id: "group", name: "Group", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "9", name: "9", callback: undefined },
            { id: "10", name: "10", callback: undefined },
            { id: "12", name: "12", callback: undefined },
            { id: "14", name: "14", callback: undefined },
            { id: "18", name: "18", callback: undefined },
            { id: "24", name: "24", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "other", name: "Other...", callback: undefined },
        ]
    };
    menuInstance.addMenuBar(styleBar);

    var debugBar = {
        id: "debugBar", name: "Debug", hidden: true, callback: undefined,
        menuItem: [
            { id: "step", name: "Step", kbd: ["Ctrl", "S"], callback: undefined },
            { id: "stepInto", name: "Step Into", kbd: ["Ctrl", "S"], callback: undefined },
            { id: "trace", name: "Trace", callback: undefined },
            { id: "traceInto", name: "Trace Into", kbd: ["Ctrl", "T"], callback: undefined },
            { id: "debugGo", name: "Go", callback: undefined },
            { type: "separator", name: "divider" },
            { id: "traceDelay", name: "Trace Delay...", callback: undefined },
            { id: "setCheckpoint", name: "Set Checkpoint", kbd: ["Ctrl", "D"], callback: undefined },
            { id: "abort", name: "Abort", kbd: ["Ctrl", "A"], callback: undefined },
            { type: "separator", name: "divider" },
            { id: "variableWatcher", name: "Variable Watcher", callback: undefined },
            { id: "messageWatcher", name: "Message Watcher", callback: undefined },
        ]
    };
    menuInstance.addMenuBar(debugBar);

    var helpBar = {
        id: "helpBar", name: "Help", disabled: true, callback: undefined };
    menuInstance.addMenuBar(helpBar);

    updateMenuUI();
}

function searchMenuBar(key, value) {
    for (var i in menuComponent) {
        var barInfo = menuComponent[i];
        if ((key in barInfo) && (barInfo[key] === value)) {
            return barInfo;
        }
    }
    return null;
}

function searchMenuItem(key, value) {
    for (var i in menuComponent) {
        var barInfo = menuComponent[i];
        for (var j in barInfo.menuItem) {
            var menuInfo = barInfo.menuItem[j];
            if ((key in menuInfo) && (menuInfo[key] === value)) {
                return menuInfo;
            }
        }
    }
    return null;
}

function updateMenuUI() {
    // clear entire menu first!
    $(menuFrameId).empty();
    for (var i in menuComponent) {
        var barInfo = menuComponent[i];
        // add bar itself
        var bar = $('<div>', { "class": "nav-item", "id": barInfo.id });
        var barName = ($('<a>', { "class": "nav-link", "role": "button" }).text(barInfo.name ? barInfo.name: " "));
        if ('callback' in barInfo) {
            barName.click(barInfo.callback);
        }
        if (barInfo.disabled) {
            barName.addClass('disabled');
            //barName.prop({ 'disabled': true }); // not really necessary since its not a link.
            barName.attr('disabled', true);
        }
        if (barInfo.hidden) {
            //bar.addClass("hidden"); // NG: does not work
            //bar.addClass("invisible"); // NG: adds empty space in menu
            //bar.css({ "display": "none"});
            bar.hide(); // easier to toggle with hide() / show()
        }
        // add each menuitem in menubar
        if ('menuItem' in barInfo) {
            bar.addClass("dropdown");
            bar.append($('<div>', { "class": "dropdown-menu" }));
            barName.addClass("dropdown-toggle");
            barName.attr({ role: "button", "data-toggle": "dropdown" });
            //barName.append($('<span>', { "class": "carret" }));
            for (var j in barInfo.menuItem) {
                var menuInfo = barInfo.menuItem[j];
                var menuItem;
                if (menuInfo.type === 'separator') {
                    menuItem = $('<div>', { "class": "dropdown-divider"});
                } else {
                    //menuItem = $('<a>', { "class": "dropdown-item", "id": menuInfo.id, "href": "#" }).text(menuInfo.name);
                    menuItem = $('<button>', { "class": "dropdown-item", "id": menuInfo.id, "type": "button" }).text(menuInfo.name);
                    menuItem.css({ "position": "relative", "padding-right": "100px" });
                    menuItem.click(menuInfo.callback);
                }
                if (menuInfo.disabled) {
                    menuItem.addClass('disabled');
                    menuItem.prop({ 'disabled': true });
                }
                if (menuInfo.hidden) {
                    menuItem.hide();
                }
                if ('kbd' in menuInfo && menuInfo.kbd instanceof Array) {
                    var kbdtop = $('<kbd>');
                    kbdtop.css({ "position": "absolute", "right": "20px", "top": "3px" });
                    //for (var i = 0; i < menuInfo.kbd.length; i++) {
                    for (var i in menuInfo.kbd) {
                        if (i > 0) { kbdtop.append(" + "); }
                        kbdtop.append($('<kbd>').text(menuInfo.kbd[i]));
                    }
                    menuItem.append(kbdtop);
                }
                bar.find(".dropdown-menu").append(menuItem);
            }
        }
        bar.append(barName);
        $(menuFrameId).append(bar);
    }
}

// singleton to manipulate menu
var menuInstance;
function WcMenu() {
    if (typeof menuInstance === 'object') {
        return menuInstance;
    }
    menuInstance = this;
}
WcMenu.prototype = {
    constructor: WcMenu,
    // only add new menu bar to menu system. call updateUI() from caller
    addMenuBar: function(barInfo) {
        // add to internal representation only
        var bar = {
            id: barInfo.id,
            name: barInfo.name,
            callback: barInfo.callback,
//            menuItem: [],
            disabled: barInfo.disabled,
            hidden: barInfo.hidden
        };
        if ('menuItem' in barInfo) {
            bar.menuItem = [];
        }
        menuComponent.push(bar);
        if ("menuItem" in barInfo) {
            for (var i in barInfo.menuItem) {
                this.addMenuItem(barInfo.id, barInfo.menuItem[i]);
            }
        }
    },
    // only add new menu item in menu bar. call updateUI() from caller
    addMenuItem: function(barId, menuInfo) {
        // add to internal representation only
        for (var i in menuComponent) {
            if (menuComponent[i].id === barId) {
                menuComponent[i].menuItem.push({
                    id: menuInfo.id,
                    name: menuInfo.name,
                    callback: menuInfo.callback,
                    type: menuInfo.type,
                    disabled: menuInfo.disabled,
                    hidden: menuInfo.hidden,
                    kbd: menuInfo.kbd,
                });
                break;
            }
        }
    },
    // at least provide id or name key in obj.
    setMenuBar: function(barInfo) {
        var bar;
        if ('id' in barInfo) {
            bar = searchMenuBar('id', barInfo.id);
        } else if ('name' in barInfo) {
            bar = searchMenuBar('name', barInfo.name);
        }
        if (bar) {
            for (var key in barInfo) {
                bar[key] = barInfo[key];
            }
            updateMenuUI();
        }
    },
    setMenuItem: function(menuInfo) {
        var item;
        if ('id' in menuInfo) {
            item = searchMenuItem('id', menuInfo.id);
        } else if ('name' in menuInfo) {
            item = searchMenuItem('name', menuInfo.name);
        }
        if (item) {
            for (var key in menuInfo) {
                item[key] = menuInfo[key];
            }
            updateMenuUI();
        }
    },
    getMenuBar: function (key, value) {
        return searchMenuBar(key, value);
    },
    getMenuItem: function (key, value) {
        return searchMenuItem(key, value);
    },
    numMenuBar: function() {
        return menuComponent.length;
    },
    removeMenuBar: function(key, value) {
        var bar = searchMenuBar(key, value);
        if (!bar) return;
        var index = menuComponent.indexOf(bar);
        if (index > -1) {
            menuComponent.splice(index, 1);
            updateMenuUI();
        }
    },
    removeMenuItem: function(key, value) {
        var item = searchMenuItem(key, value);
        if (!item) return;
        for (var i in menuComponent) {
            var menuItem = menuComponent[i].menuItem;
            var index = menuItem.indexOf(item);
            if (index > -1) {
                menuItem.splice(index, 1);
                updateMenuUI();
            }
        }
    },
    updateUI: function() {
        updateMenuUI();
    },
    show: function() {
        $('#navbarTop').show(); //! fixme : ad-hoc
    },
    hide: function() {
        $('#navbarTop').hide(); //! fixme : ad-hoc
    },
    setup: function(menuId) {
        menuFrameId = menuId;
        setupDefaultMenu();
        //this.setMenuBar({ 'name': "File", disabled: true }); // test
        //this.setMenuItem({ 'name': "Quit", disabled: true }); // test
        //this.removeMenuBar('id', 'FileBar'); // test
        //this.removeMenuItem('id', 'Quit'); // test
        //this.addMenuBar({id: 'PaintBar', name: "Paint" });
        //this.setMenuBar({ id: 'PaintBar', menuItem: []});
        //this.addMenuItem('PaintBar', { id: 'hoge', name: "HOGE" });
        //this.updateUI();
    },
};

menuInstance = new WcMenu();

export default menuInstance;
