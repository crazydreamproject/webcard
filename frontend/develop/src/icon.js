/**
  *  entry for new icon.html window
 */

import _ from 'lodash';
import 'jquery-form-validator';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js';
import 'font-awesome/css/font-awesome.min.css';
import 'material-icons/iconfont/material-icons.css';
import 'spectrum-colorpicker';
import 'spectrum-colorpicker/spectrum.css';
import WcStorage from './storage.js';

function setupElements() {
    $('body')
    .append($('<div>', { "class": "jumbotron jumbotron-fluid" })
    .append($('<div>', { "class": "container container-fluid" })
        .append($('<h3>').text("Icon Editor"))
        .append($('<hr>'))
//        .append($('<p>').text("Icon list: "))
        .append($('<div>', { "class": "border rounded p-3 m-3", "id": "iconList" }))
        .append($('<hr>'))
        .append($('<p>').text(""))
        .append($('<div>', { "class": "row m-3", "id": "iconEditCards" })
            .append($('<div>', { "class": "card-group" })
                .append($('<div>', { "class": "card" })
                    .append($('<div>', { "class": "card-header" }).text("Active"))
                    .append($('<div>', { "class": "card-body m-3", "id": "editIconActiveBody" }))
                    .append($('<div>', { "class": "card-footer", "id": "editIconActiveFooter" }))
                )
                .append($('<div>', { "class": "card" })
                    .append($('<div>', { "class": "card-header" }).text("Pressed"))
                    .append($('<div>', { "class": "card-body m-3", "id": "editIconPressedBody" }))
                    .append($('<div>', { "class": "card-footer", "id": "editIconPressedFooter" }))
                )
                .append($('<div>', { "class": "card" })
                    .append($('<div>', { "class": "card-header" }).text("Disabled"))
                    .append($('<div>', { "class": "card-body m-3", "id": "editIconDisabledBody" }))
                    .append($('<div>', { "class": "card-footer", "id": "editIconDisabledFooter" }))
                )
            )
            .append($('<form>', { "id": "resizeForm", "class": "mt-3"})
                .append($('<div>', { "class": "form-group row ml-3"})
                    .append($('<label>', { "class": "col-form-label mr-1", "for": "resizeWidth"}).text("Width:"))
                    .append($('<input>', { "class": "form-control col-2 mr-3", "type": "text", "id": "resizeWidth", "value": 32,
                                           "data-validation": "number", "data-validation-allowing": "range[1;128]" }))
                    .append($('<label>', { "class": "col-form-label mr-1", "for": "resizeHeight"}).text("Height:"))
                    .append($('<input>', { "class": "form-control col-2 mr-3", "type": "text", "id": "resizeHeight", "value": 32,
                                           "data-validation": "number", "data-validation-allowing": "range[1;128]" }))
                    .append($('<button>', { "class": "btn btn-primary float-right", "type": "submit", "id": "resizeButton" }).text("Resize"))
                    .append($('<span>', { "class": "col-4" })) // to show validation error message at bottom of input tag
                )
            )
        )
        .append($('<hr>'))
        .append($('<div>', { "class": "container m-3" })
            .append($('<form>', { "id": "saveIconForm" })
                .append($('<div>', { "class": "form-group row"})
                    .append($('<label>', { "class": "col-form-label col-2 mr-3", "for": "saveIconName"}).text("Icon Name: "))
                    .append($('<input>', { "class": "form-control col-6 mr-3", "type": "text", "id": "saveIconName", "value": "New Icon Name",
                                           "data-validation": "length", "data-validation-length": "1-128"}))
                    .append($('<button>', { "class": "btn btn-danger mr-3", "type": "button", "id": "deleteIconButton" }).text("Delete").hide())
                    .append($('<button>', { "class": "btn btn-primary float-right", "type": "submit", "id": "saveIconButton" }).text("Save"))
                    .append($('<button>', { "class": "btn btn-primary float-right", "type": "button", "id": "selectIconButton" }).text("Select").hide())
                    .append($('<button>', { "class": "btn btn-primary float-right", "type": "button", "id": "unselectIconButton" }).text("Remove").hide())
                )
            )
            .append($('<div>', { "id": "alertPopupWrapper" }))
        )
    ));
}

function setupForm() {
    $.validate();
}

function Info() {
    return {
        name: null,
        bodyId: null,
        footerId: null,
        canvas: null,
        context: null,
        width: 32,
        height: 32,
        magnify: 1,
        // tools
        color: 'rgba(0,0,0,1)', // black
        mouse: 'up',
        picker: null,
        zoomIn: null,
        zoomOut: null,
        copy: null,
        paste: null,
    }
}

var iconEditorInfo = {
    active: Info(),
    pressed: Info(),
    disabled: Info(),
};
iconEditorInfo.active.name = 'active';
iconEditorInfo.active.bodyId = '#editIconActiveBody';
iconEditorInfo.active.footerId = '#editIconActiveFooter';
iconEditorInfo.pressed.name = 'pressed';
iconEditorInfo.pressed.bodyId = '#editIconPressedBody';
iconEditorInfo.pressed.footerId = '#editIconPressedFooter';
iconEditorInfo.disabled.name = 'disabled';
iconEditorInfo.disabled.bodyId = '#editIconDisabledBody';
iconEditorInfo.disabled.footerId = '#editIconDisabledFooter';

function tiny2Rgba(c) {
    return 'rgba('
            + Math.round(c._r) + ','
            + Math.round(c._g) + ','
            + Math.round(c._b) + ','
            + (c._a) + ')';
}

var testcount = 0;

function updateCanvasInfo(info, src) {
    resizeCanvas(info);
    var ctx = info.context;
    ctx.clearRect(0, 0, info.width, info.height);
    var img = new Image();
    img.src = src;
    img.onload = function() {
        ctx.drawImage(img, 0, 0);
    };
}

function resizeCanvas(info) {
    info.canvas[0].width = info.width;
    info.canvas[0].height = info.height;
    info.canvas.css({ "width": (info.width * info.magnify) + "px", "height": (info.height * info.magnify) + "px" });
}

function createCanvas(info) {
    info.canvas = $('<canvas>', { "id": "canvasId-" + info.name });
    info.canvas.css({ "backgroundColor": "white", "cursor": "crosshair", "border": "dashed lightgray 1px" });
    info.canvas.css({ "image-rendering": "-moz-crisp-edges" });
    info.canvas.css({ "image-rendering": "-webkit-crisp-edges" });
    info.canvas.css({ "image-rendering": "pixelated" });
    info.canvas.css({ "image-rendering": "crisp-edges" });
    resizeCanvas(info);
    info.context = info.canvas[0].getContext('2d');
    info.context.clearRect(0,0, info.width, info.height);
    $(info.bodyId).append(info.canvas);
    // disable smoothing
    if (testcount == 0) {
    info.context.webkitImageSmoothingEnabled = false;
    info.context.mozImageSmoothingEnabled = false;
    info.context.imageSmoothingEnabled = false;
    testcount = 1;
    console.log(info.context);
    }
}

function createTools(info) {

    // copy paste btn
    var copyBtn = $('<button>', { "class": "btn mr-1 mb-1", "data-toggle": "tooltip", "title": "Copy" })
    .click(function(ev){
        var src = info.canvas[0].toDataURL('image/png');
        WcStorage.local.save(WcStorage.keys.copyPaste, src);
    })
    .append($('<i>', { "class": "fa fa-copy" }))
    ;

    var pasteBtn = $('<button>', { "class": "btn mr-1 mb-1", "data-toggle": "tooltip", "title": "Paste" })
    .click(function(ev){
        info.context.clearRect(0, 0, info.width, info.height); // need to check
        var img = new Image();
        img.src = WcStorage.local.load(WcStorage.keys.copyPaste);
        img.onload = function() {
            info.context.drawImage(img, 0, 0);
        };
    })
    .append($('<i>', { "class": "fa fa-paste" }))
    ;

    var clearBtn = $('<button>', { "class": "btn mr-1 mb-1", "data-toggle": "tooltip", "title": "Clear" })
    .click(function(ev){
        info.context.clearRect(0, 0, info.width, info.height);
    })
    .append($('<i>', { "class": "fa fa-eraser" }))
    ;

    // canvas zoom-in info: https://stackoverflow.com/questions/4938346/canvas-width-and-height-in-html5
    // https://developer.mozilla.org/en-US/docs/Games/Techniques/Crisp_pixel_art_look
    // https://devlog.disco.zone/2016/07/22/canvas-scaling/
    var zoomInBtn = $('<button>', { "class": "btn mr-1", "data-toggle": "tooltip", "title": "Zoom-In" })
    .click(function(ev){
        var zoom = info.magnify;
        if (zoom < 16) {
            zoom *= 2;
        }
        info.canvas.css({ "width": (info.width * zoom) + "px", "height": (info.height * zoom) + "px" });
        info.magnify = zoom;
        /*
        info.canvas[0].width = info.width * zoom;
        info.canvas[0].height = info.height * zoom;
        info.context.scale(zoom, zoom);
        info.context.imageSmoothingEnabled = false;
        info.context.mozImageSmoothingEnabled = false;
        */
    })
    .append($('<i>', { "class": "fa fa-search-plus" }))
    ;

    var zoomOutBtn = $('<button>', { "class": "btn mr-1", "data-toggle": "tooltip", "title": "Zoom-Out" })
    .click(function(ev){
        var zoom = info.magnify;
        if (zoom > 1) {
            zoom /= 2;
        }
        info.canvas.css({ "width": (info.width * zoom) + "px", "height": (info.height * zoom) + "px" });
        info.magnify = zoom;
    })
    .append($('<i>', { "class": "fa fa-search-minus" }))
    ;

    $(info.footerId).append(copyBtn).append(pasteBtn).append(clearBtn).append(zoomInBtn).append(zoomOutBtn);

    info.picker = $('<input>', { "type": "text", "class": "none", "data-toggle": "tooltip", "title": "Color Picker" });
    $(info.footerId).append(info.picker);
    info.picker.spectrum({
        color: info.color,
        showInput: true,
        showInitial: true,
        showAlpha: true,
        showPalette: true,
        clickoutFiresChange: true,
        preferredFormat: 'hex3',
        change: function(color) {
            var rgba = tiny2Rgba(color);
            info.color = rgba;
        }
    });
}

var prevPoints;
var dragSrc;
function dragImage(ev) {
    var name = ev.target.id.substring('canvasId-'.length);
    var info = iconEditorInfo[name];
    var rect = $(ev.target).offset();
    var x = parseInt(ev.pageX - rect.left) / info.magnify;
    var y = parseInt(ev.pageY - rect.top) / info.magnify;
    var dx = x - prevPoints[0];
    var dy = y - prevPoints[1];

    var ctx = info.context;
    ctx.clearRect(0, 0, info.width, info.height);
    var img = new Image();
    img.src = dragSrc;
    img.onload = function() {
        ctx.drawImage(img, dx, dy);
    };
}

function drawDot(ev) {
    var name = ev.target.id.substring('canvasId-'.length);
    var info = iconEditorInfo[name];
    var rect = $(ev.target).offset();
    var x = parseInt(ev.pageX - rect.left) / info.magnify;
    var y = parseInt(ev.pageY - rect.top) / info.magnify;

    prevPoints = [x,y];

    var color = info.color;
    var rgba = color.replace(/^rgba\(/,'').replace(/\)$/,'').replace(/\s/g,'').split(',');
    var img = info.context.getImageData(x, y, 1, 1); // 1 pixel data

    // ! todo: blend src with alpha
    img.data[0] = parseInt(rgba[0]);
    img.data[1] = parseInt(rgba[1]);
    img.data[2] = parseInt(rgba[2]);
    img.data[3] = parseInt(255 * rgba[3]);

    info.context.putImageData(img, x, y);
}

function drawLine(ev) {
    var name = ev.target.id.substring('canvasId-'.length);
    var info = iconEditorInfo[name];
    var rect = $(ev.target).offset();
    var x = parseInt(ev.pageX - rect.left) / info.magnify;
    var y = parseInt(ev.pageY - rect.top) / info.magnify;

    var color = info.color;

    // stroke line
    var ctx = info.context;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(prevPoints[0], prevPoints[1]);
    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.closePath();

    prevPoints = [x,y];
}

function canvasMouseDown(ev) {
    var name = ev.target.id.substring('canvasId-'.length);
    var info = iconEditorInfo[name];
    var rect = $(ev.target).offset();
    var x = parseInt(ev.pageX - rect.left) / info.magnify;
    var y = parseInt(ev.pageY - rect.top) / info.magnify;
    if (ev.ctrlKey) {
        info.mouse = 'pick';
        var img = info.context.getImageData(x, y, 1, 1); // 1 pixel data
        var r = img.data[0];
        var g = img.data[1];
        var b = img.data[2];
        var a = img.data[3] / 255; // range: (0..1)
        info.color = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
        info.picker.spectrum("set", info.color);
    } else if (ev.shiftKey) {
        info.mouse = 'drag';
        prevPoints = [x,y];
        dragSrc = info.canvas[0].toDataURL('image/png');
    } else {
        info.mouse = 'down';
        drawDot(ev);
    }
}

function canvasMouseMove(ev) {
    var name = ev.target.id.substring('canvasId-'.length);
    var info = iconEditorInfo[name];
    if (info.mouse == 'down') {
        drawLine(ev);
    } else if (info.mouse == 'drag') {
        dragImage(ev);
    }
}

function canvasMouseUp(ev) {
    var name = ev.target.id.substring('canvasId-'.length);
    var info = iconEditorInfo[name];
    info.mouse = 'up';
    //drawDot(ev);
}

function canvasMouseLeave(ev) {
    var name = ev.target.id.substring('canvasId-'.length);
    var info = iconEditorInfo[name];
    info.mouse = 'up';
}

function setupMouseEvent(info) {
    info.canvas.mousedown(canvasMouseDown);
    info.canvas.mousemove(canvasMouseMove);
    info.canvas.mouseup(canvasMouseUp);
    info.canvas.mouseleave(canvasMouseLeave);
}

function clearImages() {
    iconEditorInfo.active.context.clearRect(0, 0, iconEditorInfo.active.width, iconEditorInfo.active.height);
    iconEditorInfo.pressed.context.clearRect(0, 0, iconEditorInfo.pressed.width, iconEditorInfo.pressed.height);
    iconEditorInfo.disabled.context.clearRect(0, 0, iconEditorInfo.disabled.width, iconEditorInfo.disabled.height);
}

function setupCanvasesTools() {
    createCanvas(iconEditorInfo.active);
    createCanvas(iconEditorInfo.pressed);
    createCanvas(iconEditorInfo.disabled);
    createTools(iconEditorInfo.active);
    createTools(iconEditorInfo.pressed);
    createTools(iconEditorInfo.disabled);
    setupMouseEvent(iconEditorInfo.active);
    setupMouseEvent(iconEditorInfo.pressed);
    setupMouseEvent(iconEditorInfo.disabled);
}

var iconResource;

function setupSaveLoadIcons() {
    // handle delete btn
    $('#deleteIconButton').click(function(){
        var name = $('#saveIconName').val();
        if (name) {
            var idx = _.findIndex(iconResource, ['name', name]);
            if (idx >= 0) {
                iconResource.splice(idx, 1);
                // clearImages();
                var json = JSON.stringify(iconResource);
                WcStorage.local.save(WcStorage.keys.icon, json);
                location.reload();
            }
        }
    });
    // load icons from resource
    var json = WcStorage.local.load(WcStorage.keys.icon);
    if (json) {
        iconResource = JSON.parse(json);
    } else {
        iconResource = [];
    }
    // put them to visual list
    var $list = $('#iconList');
    $list.empty();
    for (var i = 0; i < iconResource.length; i++) {
        var ico = iconResource[i];
        var img = new Image();
        img.src = ico.active;
        var $img = $(img);
        //$img.addClass("img-fluid img-thumbnail mr-1");
        $img.attr("id", "iconId-"+i);
        $img.attr("title", ico.name);
        $img.addClass("img-fluid mr-1");
        $img.css({ border: 'solid 1px gray'});
        $img.click(function(ev){
            var id = parseInt(ev.target.id.substring("iconId-".length));
            var icon = iconResource[id];
            var name = icon.name;
            $('#saveIconName').val(name).prop('disabled', true);
            $('#resizeWidth').val(icon.width);
            $('#resizeHeight').val(icon.height);
            if (iconEditMode === 'edit') {
                $('#deleteIconButton').show();
            } else {
                $('#selectIconButton').show();
                $('#unselectIconButton').hide();
            }

            iconEditorInfo.active.width = iconEditorInfo.pressed.width = iconEditorInfo.disabled.width = icon.width;
            iconEditorInfo.active.height = iconEditorInfo.pressed.height = iconEditorInfo.disabled.height = icon.height;
            updateCanvasInfo(iconEditorInfo.active, icon.active);
            updateCanvasInfo(iconEditorInfo.pressed, icon.pressed);
            updateCanvasInfo(iconEditorInfo.disabled, icon.disabled);

        });
        $img.mousedown(function(ev){
            var id = parseInt(ev.target.id.substring("iconId-".length));
            var icon = iconResource[id];
            if (ev.shiftKey) {
                this.src = icon.disabled;
            } else {
                this.src = icon.pressed;
            }
        });
        $img.mouseup(function(ev){
            var id = parseInt(ev.target.id.substring("iconId-".length));
            var icon = iconResource[id];
            this.src = icon.active;
        });
        $img.mouseleave(function(ev){
            var id = parseInt(ev.target.id.substring("iconId-".length));
            var icon = iconResource[id];
            this.src = icon.active;
        });

        $list.append($img);
    }

    // create new icon button
    $list.append($('<button>', { "class": "btn btn-outline-secondary", "id": "createNewIcon", "title": "Create New Icon" })
        .click(function(){
            $('#saveIconName')
            .prop('disabled', false) // enable input
            .val("New Icon Name") // default
            ;
            $('#deleteIconButton').hide();
            // clear contexts
            clearImages();
        })
        .append($('<i>', { "class": "fa fa-plus" }))
    );

    // save
    $('#saveIconForm').submit(function(e){
        // e.preventDefault(); // do reload!
        var name = $('#saveIconName').val();
        $('.alert').remove();
        if (!name) {
            $('#alertPopupWrapper')
            .append($('<div>', { "class": "alert alert-danger alert-dismissible fade show", "role": "alert" })
                .text("You must enter icon name to Save!")
                .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "alert" })
                    .append($('<span>').html('&times'))
                )
            );
            return false;
        }
        var exist = _.find(iconResource, ['name', name]);
        var isNewName = !$('#saveIconName').is('[disabled=disabled]');
        if (isNewName) {
            // check there is no same name in list
            if (exist) {
                $('#alertPopupWrapper')
                .append($('<div>', { "class": "alert alert-danger alert-dismissible fade show", "role": "alert" })
                    .text("Icon name already exists. Try other name")
                    .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "alert" })
                        .append($('<span>').html('&times'))
                    )
                );
                return false;
            }
        }

        // check through icon list
        if (exist) {
            // over-write
            exist.active = iconEditorInfo.active.canvas[0].toDataURL('image/png');
            exist.pressed = iconEditorInfo.pressed.canvas[0].toDataURL('image/png');
            exist.disabled = iconEditorInfo.disabled.canvas[0].toDataURL('image/png');
            exist.width = iconEditorInfo.active.width;
            exist.height = iconEditorInfo.active.height;
        } else {
            // new icon to push
            var ico = {
                name: name,
                active: iconEditorInfo.active.canvas[0].toDataURL('image/png'),
                pressed: iconEditorInfo.pressed.canvas[0].toDataURL('image/png'),
                disabled: iconEditorInfo.disabled.canvas[0].toDataURL('image/png'),
                width: iconEditorInfo.active.width,
                height: iconEditorInfo.active.height,
            };
            // store and save it
            iconResource.push(ico);
        }
        var json = JSON.stringify(iconResource);
        WcStorage.local.save(WcStorage.keys.icon, json);

        return true;
    });

}

function setupResize() {
    $('#resizeForm').submit(function(ev){
        ev.preventDefault();
        var width = parseInt($('#resizeWidth').val());
        var height = parseInt($('#resizeHeight').val());
        // change Info and canvas size
        iconEditorInfo.active.width = iconEditorInfo.pressed.width = iconEditorInfo.disabled.width = width;
        iconEditorInfo.active.height = iconEditorInfo.pressed.height = iconEditorInfo.disabled.height = height;
        updateCanvasInfo(iconEditorInfo.active, iconEditorInfo.active.canvas[0].toDataURL('image/png'));
        updateCanvasInfo(iconEditorInfo.pressed, iconEditorInfo.pressed.canvas[0].toDataURL('image/png'));
        updateCanvasInfo(iconEditorInfo.disabled, iconEditorInfo.disabled.canvas[0].toDataURL('image/png'));
        return false;
    });
}

function setupSelectIcon() {
    $('#selectIconButton').click(function(ev){
        var name = $('#saveIconName').val();
        $('.alert').remove();
        if (!name) {
            $('#alertPopupWrapper')
            .append($('<div>', { "class": "alert alert-danger alert-dismissible fade show", "role": "alert" })
                .text("You must click one of above icon name to select to button!")
                .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "alert" })
                    .append($('<span>').html('&times'))
                )
            );
            return false;
        }
        WcStorage.local.save(WcStorage.keys.iconSelect, name);
        // close window
        window.open('about:blank', '_self').close();
    });
    $('#unselectIconButton').click(function(ev){
        WcStorage.local.save(WcStorage.keys.iconSelect, WcStorage.keys.iconSelectMagic);
        // close window
        window.open('about:blank', '_self').close();
    });
}

var iconEditMode = "edit";
function setupMode() {
    var select = WcStorage.local.load(WcStorage.keys.iconSelect);
    if (select === "") { // its edit mode
        return;
    }
    iconEditMode = "select";
    $('#createNewIcon').hide();
    $('#iconEditCards').hide();
    $('#saveIconButton').hide();
    $('#saveIconName').val("").prop('disabled', true);
//    $('#selectIconButton').show(); // shown in icon list btn click event
    if (select != WcStorage.keys.iconSelectMagic) {
        $('#unselectIconButton').show();
    }
}

function setup() {
    WcStorage.setup();
    // add elements
    setupElements();
    setupCanvasesTools();
    setupSaveLoadIcons();
    setupResize();
    setupSelectIcon();
    setupMode();
    setupForm();
}

// entry point
setup();
console.log("setup icon html done.");
