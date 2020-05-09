/*!
 * WebCard DOM manipulation
 */

import _ from 'lodash';
import interact from 'interactjs';
import listener from './listener.js';
import WcMode from './mode.js';
import WcModal from './modal.js';
import WcPaint from './paint.js';
import StackOp from './stack.js';
import WcLayer from './layer.js';
import WcPart from './part.js';
import WcField from './field.js';
import WcButton from './button.js';
import WcEvent from './event.js';
import WcResource from './resource.js';

var elemIds = {
    stack: {
        frame: 'DomStackFrameDivId',
        parts: 'DomStackPartsDivId',
        canvas: 'DomStackCanvasId',
    },
    bg: {
        frame: 'DomBgFrameDivId',
        parts: 'DomBgPartsDivId',
        canvas: 'DomBgCanvasId',
    },
    card: {
        frame: 'DomCardFrameDivId',
        parts: 'DomCardPartsDivId',
        canvas: 'DomCardCanvasId',
    },
    toIds: function() { //! maybe more elegant way than this
        this.stack.frame = '#' + this.stack.frame;
        this.stack.parts = '#' + this.stack.parts;
        this.stack.canvas = '#' + this.stack.canvas;
        this.bg.frame = '#' + this.bg.frame;
        this.bg.parts = '#' + this.bg.parts;
        this.bg.canvas = '#' + this.bg.canvas;
        this.card.frame = '#' + this.card.frame;
        this.card.parts = '#' + this.card.parts;
        this.card.canvas = '#' + this.card.canvas;
    }
};

function dragEndListener (event) {
    // update pos to model data
    var idnum = parseInt(event.target.id.split('-')[1]);
    var part = StackOp.currentLayer().getPartById(idnum);
    var dx = parseInt(event.pageX - event.x0);
    var dy = parseInt(event.pageY - event.y0);
    if (part) {
        part.left(part.left() + dx);
        part.top(part.top() + dy);
        part.right(part.right() + dx);
        part.bottom(part.bottom() + dy);
    }
}

function resizeEndListener (event) {
    var elem = $('#' + event.target.id);
    var width = parseInt(elem.css('width'));
    var height = parseInt(elem.css('height'));
    // update inner input element
    elem.find(":first-child").css({
        width: width + 'px',
        height: height + 'px'
    });
    // update pos to model data
    var idnum = parseInt(event.target.id.split('-')[1]);
    var part = StackOp.currentLayer().getPartById(idnum);
    if (part) {
        part.right(part.left() + width);
        part.bottom(part.top() + height);
    }
}

// filter out button type checkbox and radio
function filterResizable(child) {
    var type = child.attr("type");
    var check = ((type == "radio") || (type == "checkbox"));
    return !check;
}

function makeDraggableResizable(partId) {
    if (WcMode.getMode() === WcMode.modes.browse)
        return;
    interact(partId).set();
    interact(partId)
        .draggable({
            inertia: true,
            autoScroll: true,
            restrict: { restriction: "parent" }, // endOnly:true, elementRect: {left:1,right:0,top:1,bottom:0}
            //ignoreFrom: 'textarea',
            onmove: listener.dragMove,
            onend: dragEndListener
        });
    if (filterResizable($(partId).find(":first-child"))) {
        //$(partId).find(":first-child").attr('type') === "button") {
        interact(partId)
        .resizable({
            inertia: true,
            autoScroll: true,
            invert: 'reposition',
            // restrict: { restriction: "parent" },
            edges: { left: false, top: false, right: true, bottom: true },
            onmove: listener.resizeMove, //Listener,
            onend: resizeEndListener
        });
    }
}

function editElement(elem) {
    // set focus to me to inner element of div when clicked (for specifying in btn info, etc.)
    elem
        .click(function(event) {
            /*
            if (WcMode.getMode() === WcMode.modes.browse)
                return;
            */
            $(this).focus();
            $(this).find(":first-child").focus();
        })
        .dblclick(function(event) {
            if (WcMode.getMode() === WcMode.modes.browse)
                return;
            var idnum = parseInt($(this).attr('id').split('-')[1]);
            var part = StackOp.currentLayer().getPartById(idnum);
            if (part && part.partType() === WcPart.type.button) {
                WcModal.buttonInfo();
            }
            if (part && part.partType() === WcPart.type.field) {
                WcModal.fieldInfo();
            }
        })
        .focus(function(event){
            /* 
            if (WcMode.getMode() === WcMode.modes.browse)
                return;
            */
            var idnum = parseInt($(this).attr('id').split('-')[1]);
            var part = StackOp.currentLayer().getPartById(idnum);
            StackOp.currentStack.focusedPart = part;
        })
        .blur(function(event) {
            // focusedPart will never get back to null, otherwise, btn/fild info cant perform... really?
            // webCard.stack.current_stack.focusedPart = null;
        })
        ;
}

function createWcButtonChildElement(btn) {
    var name = _.escape(btn.name());
    if (!btn.showName()) {
        name = '';
    }
    var inputs = {
        checkbox: [
            '  <input class="checkbox-inline" type="checkbox" autocomplete="off" value="' + name + '"><span>' + name + '</span></input>',
        ].join(""),
        opaque: [
            '  <input class="btn" type="button" autocomplete="off" value="' + name + '"></input>',
        ].join(""),
        oval: [ // not really an oval...
            '  <input class="btn" type="button" autocomplete="off" style="border-radius: 999px" value="' + name + '"></input>',
        ].join(""),
        popup: [
            '  <select class="form-control" autocomplete="off" value="' + name + '"></select>',
        ].join(""),
        radio: [
            '  <input class="radio-inline" type="radio" autocomplete="off" value="' + name + '"><span>' + name + '</span></input>',
        ].join(""),
        rectangle: [
            '  <input class="btn" type="button" autocomplete="off" style="border-radius: 0" value="' + name + '"></input>',
        ].join(""),
        roundrect: [
            '  <input class="btn" type="button" autocomplete="off" style="border-radius: 8px" value="' + name + '"></input>',
        ].join(""),
        shadow: [
            '  <input class="btn" type="button" autocomplete="off" style="box-shadow: 4px 4px 0 0 rgba(0,0,0,0.4)" value="' + name + '"></input>',
        ].join(""),
        standard: [
            '  <input class="form-control btn btn-outline-secondary" type="button" autocomplete="off" value="' + name + '"></input>',
        ].join(""),
        transparent: [
            //'<input class="btn" style="background: transparent; border:solid 1px;" value="' + name + '"></input>',
            '<input class="btn" type="button" style="background: transparent;" value="' + name + '"></input>',
        ].join(""),
    };
    var input_html = inputs.standard;
    var style = WcButton.style;
    for (var key in style) {
        if (btn.style() === style[key]) {
            input_html = inputs[key];
        }
    }
    var child = $(input_html);
    if (!btn.enabled()) {
        child.addClass('disabled');
        child.css({'pointer-events': 'none'});
    }
    return child;
}

function createWcFieldChildElement(fld) {
    var text = _.escape(fld.text());
    var inputs = { // not using input tag, but just followed naming of button...
        opaque: [
            '  <textarea class="form-control" autocomplete="off" style="overflow: hidden; border-radius: 4px;">' + text + '</textarea>',
        ].join(""),
        rectangle: [
            '  <textarea class="form-control" autocomplete="off" style="overflow: hidden; border-radius: 0px;">' + text + '</textarea>',
        ].join(""),
        scrolling: [
            '  <textarea class="form-control" autocomplete="off" style="overflow: scroll; border-radius: 0px;">' + text + '</textarea>',
        ].join(""),
        shadow: [
            '  <textarea class="form-control" autocomplete="off" style="overflow: hidden; border-radius: 0px; box-shadow: 4px 4px 0 0 rgba(0,0,0,0.4);">' + text + '</textarea>',
        ].join(""),
        transparent: [ // setting form-control class would result in upper shadow effect...
            '  <textarea class="" autocomplete="off" style="overflow: hidden; background: transparent; border: none;">' + text + '</textarea>',
        ].join(""),
    };
    var input_html = inputs.scrolling;
    var style = WcField.style;
    for (var key in style) {
        if (fld.style() === style[key]) {
            input_html = inputs[key];
        }
    }
    var child = $(input_html);
    // setup event callback to retrieve text back to model
    child.
        // @todo ! append current keycode and use keypress for simplicity.
        blur(function(event) { // handle new_card also
            saveFieldText($(this));
        })
        .keydown(function(event) { // handle arrowKey also.
            saveFieldText($(this));
        })
        ;
    return child;
}

function setWcPartChildElement(frameId, elem, child, part, partId) {
//    elem.append(child);
    elem.css({
        position: 'absolute',
        left: part.left(),
        top: part.top(),
        transform: 'translate(0px, 0px)',
    });
    elem.attr("data-x", "0");
    elem.attr("data-y", "0");
    child.css({
        font: part.textAttr().fontCss(),
        textAlign: part.textAttr().textAlign(),
        //lineHeight: part.textAttr().lineHeight(),
        color: part.textAttr().color()
    });
    child.attr('id', partId + '-child');
    if (part.bgColor()) {
        child.css('background-color', part.bgColor());
    }
    // filter out button type checkbox and radio
    if (filterResizable(child)) {
        child.css({
            width: (part.right() - part.left()),
            height: (part.bottom() - part.top())
        });
    }
    // special handing of icon button
    if (part.partType() === WcPart.type.button) {
        var icon = WcResource.findIcon(part.icon()); // btn will only hold name of icon
        if (icon) {
            if (part.enabled()) {
                var img = new Image();
                img.src = icon.active.src;
                child = $(img);
            } else {
                var img = new Image();
                img.src = icon.disabled.src;
                child = $(img);
                child.addClass('disabled');
                child.css({'pointer-events': 'none'});
            }
            child.attr('id', partId + '-child'); // set again
            child.css({ width: icon.width, height: icon.height });
            //! todo: display name (of button) below this icon
            //! todo: not to fire mouse event when disabled.
            child.on('mousedown.icon', function(ev){
                if (WcMode.getMode() === WcMode.modes.browse) {
                    console.log("icon mousedown");
                    var id = parseInt(ev.target.id.substring('btn-'.length));
                    var part = StackOp.currentLayer().getPartById(id);
                    if (part.enabled()) {
                        this.src = WcResource.findIcon(part.icon()).pressed.src;
                    //this = part.icon().pressed; // compile error
                    }
                }
            });
            child.on('mouseup.icon', function(ev){
                if (WcMode.getMode() === WcMode.modes.browse) {
                    console.log("icon mouseup");
                    var id = parseInt(ev.target.id.substring('btn-'.length));
                    var part = StackOp.currentLayer().getPartById(id);
                    if (part.enabled()) {
                        this.src = WcResource.findIcon(part.icon()).active.src;
                    }
                }
            });
            child.on('mouseleave.icon', function(ev){
                if (WcMode.getMode() === WcMode.modes.browse) {
                    var id = parseInt(ev.target.id.substring('btn-'.length));
                    var part = StackOp.currentLayer().getPartById(id);
                    if (part.enabled()) {
                        this.src = WcResource.findIcon(part.icon()).active.src;
                    }
                }
            });
        }
    }
    elem.append(child);

    editElement(elem);
    $(frameId).append(elem);
    if (part.visible()) {
        elem.show();
    } else {
        elem.hide();
    }
    makeDraggableResizable('#' + partId);
    part.script().bindHandlers('#' + partId);
}

function syncWcPartElement(frameId, child, part, partId) {
    var elem = $(frameId).find('#' + partId);
    elem.empty(); // remove inner dom and create again.
    setWcPartChildElement(frameId, elem, child, part, partId);
}

// common part of button and field to DOM.
function createWcPartElement(frameId, child, part, partId) {
    // wrap part by div
    var elem = $('<div id="' + partId + '" style="display: inline-height;" tabindex="' + part.id() + '"></div>');
    setWcPartChildElement(frameId, elem, child, part, partId);
}

// create element for WcButton
function createWcButtonElement(frameId, btn) {
    var btnId = "btn-" + btn.id();
    var child = createWcButtonChildElement(btn);
    createWcPartElement(frameId, child, btn, btnId);
}

function saveFieldText(fld) {
    // id is held by parent wrapper element.
    var idnum = parseInt(fld.parent().attr('id').split('-')[1]);
    var part = StackOp.currentLayer().getPartById(idnum);
    if (part && part.partType() === WcPart.type.field) {
        var text = fld.val();
        part.text(text);
    }
}

// create element for WcField
function createWcFieldElement(frameId, fld) {
    var fldId = "fld-" + fld.id();
    var child = createWcFieldChildElement(fld);
    createWcPartElement(frameId, child, fld, fldId);
}

// helper function to create parts
function createParts(frameId, btns, flds) {
    var parts = btns.concat(flds);
    // sort according to depth, increasing order (closer to further)
    parts.sort(function(a,b) {
        return a.depth() - b.depth();
    });
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        if (part.partType() === WcPart.type.button) {
            createWcButtonElement(frameId, part);
        } else if (part.partType() === WcPart.type.field) {
            createWcFieldElement(frameId, part);
        } else {
            alert("Internal Error: unknown part type. should not reach here.");
        }
    }
}

function syncParts(frameId, btns, flds) {
    var parts = btns.concat(flds);
    parts.sort(function(a,b) {
        return a.depth() - b.depth();
    });
    for (var i = 0; i < parts.length; i++) {
        var part = parts[i];
        var child;
        var partId;
        if (part.partType() === WcPart.type.button) {
            child = createWcButtonChildElement(part);
            partId = 'btn-' + part.id();
        } else if (part.partType() === WcPart.type.field) {
            child = createWcFieldChildElement(part);
            partId = 'fld-' + part.id();
        } else {
            alert("Internal Error: unknown part type. should not reach here..");
        }
        syncWcPartElement(frameId, child, part, partId);
    }
}

function createContainerParts(container, containerIds) {
    // we are going to add all parts and canvas elems into card frame.
    $(containerIds.frame).width(container.width()).height(container.height());
    $(elemIds.card.frame)
        .append($('<canvas>', {"id": containerIds.canvas.substr(1), "style": "position: absolute; cursor: crosshair" })
    );
    // load picture directly to above <canvas>
    var canvas = $(containerIds.canvas);
    if (container.picture) {
        var pic = WcResource.findPicture(container.picture);
        var img = pic.img;
        var context = canvas[0].getContext('2d');
        context.canvas.width = pic.width;
        context.canvas.height = pic.height;
        context.drawImage(img, 0, 0);
        img.onload = function() {
            context.drawImage(img, 0, 0);
        };
    }
    if (container.showPict()) {
        canvas.show();
    } else {
        canvas.hide();
    }
    createParts(elemIds.card.frame, container.buttons, container.fields);
}

// create element for WcCard
function createWcCardElement() {
    var card = StackOp.currentCard();
    createContainerParts(card, elemIds.card);
    return;
}

// create element for WcBackground
function createWcBackgroundElement() {
    var bg = StackOp.currentBg();
    createContainerParts(bg, elemIds.bg);
    return;
}

// create element for WcStack
function createWcStackElement() {
    var stk = StackOp.currentStack;
    createContainerParts(stk, elemIds.stack);
    return;
}

function setPaintCanvas(container, canvasId) {
    WcPaint.setup(canvasId);
    WcPaint.resizeCanvas(container.width(), container.height());
    container.loadPicture();
}

function setContainerScript() {
    var stk = StackOp.currentStack;
    var bg = StackOp.currentBg();
    var card = StackOp.currentCard();
    stk.script().bindHandlers(elemIds.stack.frame);
    bg.script().bindHandlers(elemIds.bg.frame);
    card.script().bindHandlers(elemIds.card.frame);
}

function syncContainerParts(container, containerIds) {
    $(containerIds.frame).width(container.width()).height(container.height());
    // sync container showPict property here.
    var canvas = $(containerIds.canvas);
    if (container.showPict()) {
        canvas.show();
    } else {
        canvas.hide();
    }
    syncParts(elemIds.card.frame, container.buttons, container.fields);
}

// sync parts dom with model
function syncDom() {
    setContainerScript();
    syncContainerParts(StackOp.currentStack, elemIds.stack);
    if (WcLayer.getLayer() === WcLayer.layers.stack) {
        return;
    }
    syncContainerParts(StackOp.currentBg(), elemIds.bg);
    if (WcLayer.getLayer() === WcLayer.layers.background) {
        return;
    }
    syncContainerParts(StackOp.currentCard(), elemIds.card);
}

// update dom inside frame element
function updateDom() {
    setContainerScript();
    // setup dom with respect to current stack
    // all parts and canvas of stk/bg/card container will be added to card frame
    $(elemIds.card.frame).empty();
    createWcStackElement();
    if (WcLayer.getLayer() === WcLayer.layers.stack) {
        setPaintCanvas(StackOp.currentStack, elemIds.stack.canvas);
        return;
    }
    createWcBackgroundElement();
    if (WcLayer.getLayer() === WcLayer.layers.background) {
        setPaintCanvas(StackOp.currentBg(), elemIds.bg.canvas);
        return;
    }
    createWcCardElement();
    setPaintCanvas(StackOp.currentCard(), elemIds.card.canvas);
}

function disablePointerEvent() {
    $(elemIds.stack.canvas).css({'pointer-events': 'none', 'cursor': 'auto'});
    $(elemIds.bg.canvas).css({'pointer-events': 'none', 'cursor': 'auto'});
    $(elemIds.card.canvas).css({'pointer-events': 'none', 'cursor': 'auto'});
}

function enablePointerEvent() {
    $(elemIds.stack.canvas).css({'pointer-events': 'auto', 'cursor': 'crosshair'});
    $(elemIds.bg.canvas).css({'pointer-events': 'auto', 'cursor': 'crosshair'});
    $(elemIds.card.canvas).css({'pointer-events': 'auto', 'cursor': 'crosshair'});
}

function disableDraggableResizable() {
    $(elemIds.card.frame).find('div').each(function() {
        interact('#' + this.id).unset();
    });
}

function enableDraggableResizable() {
    $(elemIds.card.frame).find('div').each(function() {
        makeDraggableResizable('#' + this.id);
    });
}

var containerFrameId;
// singleton manager class of dom
var domManagerInstance;
function DomManager() {
    if (typeof domManagerInstance === "object") {
        return domManagerInstance;
    }
    this.lockScreen_ = false;
    domManagerInstance = this;
}
DomManager.getInstance = function() { return new DomManager(); };
DomManager.prototype = {
    constructor: DomManager,
    setup: function(frameId) {
        containerFrameId = frameId;
        var frame = $(containerFrameId);
        var width = frame.width(),
            height = frame.height();

        // add canvas element to dom tree
        $(containerFrameId)
            .append($('<div>', { "id": elemIds.stack.frame, "style": "position: relative;" })
                .append($('<div>', { "id": elemIds.bg.frame, "style": "position: relative;" })
                    .append($('<div>', { "id": elemIds.card.frame, "style": "position: relative;" })
                        .append($('<canvas>', {"id":elemIds.stack.canvas, "style": "position: absolute;" }))
                        .append($('<canvas>', {"id": elemIds.bg.canvas, "style": "position: absolute;" }))
                        .append($('<canvas>', {"id": elemIds.card.canvas, "style": "position: absolute;" }))
                    )
                )
            );
        elemIds.toIds();

        WcPaint.setup(elemIds.card.canvas);
        WcPaint.resizeCanvas(width, height);

        WcEvent.setup(elemIds.card.frame);

        // pass through mouse events grabbed by canvas to parts under it on browse mode.
        WcMode.register(WcMode.modes.browse, disablePointerEvent);
        WcMode.register(WcMode.modes.browse, disableDraggableResizable);

        WcMode.register(WcMode.modes.edit, enablePointerEvent);
        WcMode.register(WcMode.modes.edit, enableDraggableResizable);

        WcMode.register(WcMode.modes.paint, enablePointerEvent);
        WcMode.register(WcMode.modes.paint, enableDraggableResizable);

        // test
        function br() {
            console.log("now in browse mode"); }
        function ed() { 
            console.log("now in edit mode"); }
        WcMode.register(WcMode.modes.browse, br);
        WcMode.register(WcMode.modes.edit, ed);
        this.update();

    },
    getPartElement: function(part) {
        var id = "";
        switch(part.partType()) {
            case WcPart.type.button: id = "btn-"; break;
            case WcPart.type.field: id = "fld-"; break;
            default:
                return console.error("Unknown part type: " + part.partType());
        }
        id = id + part.id();
        var elem = $(elemIds.card.frame).find('#' + id);
        return elem;
    },
    sync: function() {
        syncDom();
    },
    update: function() {
        if (!domManagerInstance.lockScreen_) {
            updateDom();
        }
        // consume stack/bg/card open events here
        if (StackOp.events.openStack === true) {
            WcEvent.fire(WcEvent.systemMessages.openStack);
            StackOp.events.openStack = false;
        }
        if (StackOp.events.openBackground === true) {
            WcEvent.fire(WcEvent.systemMessages.openBackground);
            StackOp.events.openBackground = false;
        }
        if (StackOp.events.openCard === true) {
            WcEvent.fire(WcEvent.systemMessages.openCard);
            StackOp.events.openCard = false;
        }
    },
    lockScreen: function() {
        domManagerInstance.lockScreen_ = true;
    },
    unlockScreen: function(vis) {
        domManagerInstance.lockScreen_ = false;
        this.update();
    },
};

domManagerInstance = new DomManager();

export default domManagerInstance;
