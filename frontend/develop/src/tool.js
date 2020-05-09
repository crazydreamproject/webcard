/*!
 * WebCard Tool palette manipulation
 */

import _ from 'lodash';
import 'spectrum-colorpicker';
import interact from 'interactjs';
import listener from './listener.js';
import WcMode from './mode.js';
import WcPaint from './paint.js';
import WcOptions from './options.js';
import WcEvent from './event.js';

function makeDraggable(paletteId) {
    interact(paletteId)
        .draggable({
            inertia: true,
            //autoScroll: true,
            restrict: { restriction: "parent" }, // endOnly:true, elementRect: {left:1,right:0,top:1,bottom:0}
            ignoreFrom: 'button',
            //onmove: dragMoveListener,
            //onend: dragEndListner
            onmove: listener.dragMove
        });
}

function tiny2Rgba(c) {
    return "rgba(" +
        Math.round(c._r) + ',' +
        Math.round(c._g) + ',' +
        Math.round(c._b) + ',' +
        (c._a) + ")";
}

// callback functions when tool palette button is pressed
function browseClicked(e) {
    WcMode.setMode(WcMode.modes.browse);
}

function editClicked(e) {
    WcMode.setMode(WcMode.modes.edit);
}

var paintTools;
function paintClicked(e) {
    WcMode.setMode(WcMode.modes.paint);
    var id = e.currentTarget.id;

    var paint = _.find(paintTools, function (elem) { return elem.id == id;});
    if (paint.tool === WcPaint.tool.text) {
        $("#card_canvas").css('cursor', 'text');
    } else {
        $("#card_canvas").css('cursor', 'crosshair');
    }
    WcPaint.setPaintTool(paint.tool);
    if (paint.options) {
        paint.options();
    }

}

var eventFired = false;

var toolPaletteIdDict;
/* dict keys are:
        paletteId,
        closeBtnId,
        modeGroupId,
        paintGroupId,
        strokeColorId,
        fillColorId,
*/
// singleton to manipulate tool palette
var toolPaletteInstance;
function WcTool() {
    if (typeof toolPaletteInstance === 'object') {
        return toolPaletteInstance;
    }
    toolPaletteInstance = this;
}
WcTool.prototype = {
    constructor : WcTool,
    setup: function(idDict) {
        toolPaletteIdDict = idDict;
        makeDraggable(toolPaletteIdDict.paletteId);
        $(toolPaletteIdDict.closeBtnId).click(function(){
            toolPaletteInstance.hideToolPalette();
        });
        // setup mode buttons (browse and edit btn)
        var modeTools = [
            { group: toolPaletteIdDict.modeGroupId, id:"Browse_Tool", icon:'<i class="fa fa-hand-pointer-o"></i>', callback: browseClicked },
            { group: toolPaletteIdDict.modeGroupId, id:"Edit_Tool", icon:'<i class="fa fa-gear"></i>', callback: editClicked }
        ];
        for (var i = 0; i < modeTools.length; i++) {
            this.addTool(modeTools[i]);
        }

        // setup paint buttons (pencil, brush, etc...)
        /* var */ paintTools = [
            { group: toolPaletteIdDict.paintGroupId, id:"Pencil_Tool", icon:'<i class="fa fa-pencil"></i>',
                tool: WcPaint.tool.pencil, callback: paintClicked, options: WcOptions.setupPencilTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Brush_Tool", icon:'<i class="fa fa-paint-brush"></i>',
                tool: WcPaint.tool.brush, callback: paintClicked, options: WcOptions.setupBrushTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Pattern_Tool", icon:'<i class="material-icons">format_paint</i>', disabled: true, //not yet implemented
                tool: WcPaint.tool.pattern, callback: paintClicked },
//            { group: toolPaletteIdDict.paintGroupId, id:"Line_Tool", icon:'<i class="fa fa-minus"></i>',
            { group: toolPaletteIdDict.paintGroupId, id:"Line_Tool", icon:'<i class="material-icons">trending_flat</i>',
                tool: WcPaint.tool.line, callback: paintClicked, options: WcOptions.setupLineTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Eraser_Tool", icon:'<i class="fa fa-eraser"></i>',
                tool: WcPaint.tool.eraser, callback: paintClicked, options: WcOptions.setupEraserTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Select_Tool", icon:'<i class="material-icons">select_all</i>',
                tool: WcPaint.tool.select, callback: paintClicked, options: WcOptions.setupSelectTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Crop_Tool", icon:'<i class="fa fa-crop"></i>', disabled: true, //not yet implemented
                tool: WcPaint.tool.crop, callback: paintClicked },
            { group: toolPaletteIdDict.paintGroupId, id:"Bucket_Tool", icon:'<i class="material-icons">format_color_fill</i>',
                tool: WcPaint.tool.bucket, callback: paintClicked, options: WcOptions.setupBucketTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Eyedrop_Tool", icon:'<i class="fa fa-eyedropper"></i>',
                tool: WcPaint.tool.eyedrop, callback: paintClicked, options: WcOptions.setupEyedropTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Rect_Tool", icon:'<i class="fa fa-square-o"></i>',
//            { group: toolPaletteIdDict.paintGroupId, id:"Polygon_Tool", icon:'<i class="material-icons">crop_square</i>',
                tool: WcPaint.tool.polygon, callback: paintClicked, options: WcOptions.setupPolygonTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Oval_Tool", icon:'<i class="fa fa-circle-thin"></i>', 
                tool: WcPaint.tool.oval, callback: paintClicked, options: WcOptions.setupOvalTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Scroll_Tool", icon:'<i class="fa fa-arrows"></i>', disabled: true, //not yet implemented
                tool: WcPaint.tool.arrows, callback: paintClicked },
            { group: toolPaletteIdDict.paintGroupId, id:"Text_Tool", icon:'<i class="fa fa-font"></i>',
                tool: WcPaint.tool.text, callback: paintClicked, options: WcOptions.setupTextTool },
            { group: toolPaletteIdDict.paintGroupId, id:"Magic Wand_Tool", icon:'<i class="fa fa-magic"></i>', disabled: true, //not yet implemented
                tool: WcPaint.tool.magic, callback: paintClicked }
            // !todo: tools that are missing: lasso, spray, round rect, curve, polygon, regpoly (regular polygon)
        ];
        for (i = 0; i < paintTools.length; i++) {
            this.addTool(paintTools[i]);
        }

        // setup color palettes
        var strokeColor = 'rgba(0,0,0,1.0)'; // black
        var fillColor = 'rgba(255,255,255,1.0)'; // white
        $(toolPaletteIdDict.strokeColorId).spectrum({
            //color:"black",
            color: strokeColor,
            showInput: true,
            showInitial: true,
            showAlpha: true,
            showPalette: true,
            clickoutFiresChange: true,
            preferredFormat: "hex3",
            change: function(color) {
                var rgba = tiny2Rgba(color);
                WcPaint.setStrokeColor(rgba);
                WcOptions.setStrokeColor(rgba);            }
        });
        $(toolPaletteIdDict.fillColorId).spectrum({
            //color:"white",
            color: fillColor,
            showInput: true,
            showInitial: true,
            showAlpha: true,
            showPalette: true,
            clickoutFiresChange: true,
            preferredFormat: "hex3",
            change: function(color) {
                var rgba = tiny2Rgba(color);
                WcPaint.setFillColor(rgba);
                WcOptions.setFillColor(rgba);            }
        });
        WcPaint.setStrokeColor(strokeColor);
        WcPaint.setFillColor(fillColor);

        // select initial mode
        switch(WcMode.getMode()) {
            case WcMode.modes.browse:
                this.selectTool("#Browse_Tool");
                break;
            case WcMode.modes.edit:
                this.selectTool("#Edit_Tool");
                break;
            default:
                alert("Internal Error: Default mode not browse nor edit.");
                break;
        }

        // setup mode callbacks
        WcMode.register(WcMode.modes.browse, function() {
            toolPaletteInstance.selectTool("#Browse_Tool");
        });
        WcMode.register(WcMode.modes.edit, function() {
            toolPaletteInstance.selectTool("#Edit_Tool");
        });
        //WcMode.register(WcMode.modes.paint, ); // !todo: !fixme: hummm... currently does not have param to see which paint tool...

    },
    addTool: function(toolinfo) {
        var name = toolinfo.id.replace(/_.*/, '');
        var btn = $('<button type="button" class="btn btn-outline-secondary" data-toggle="tooltip" title="' + name +
            '" style="font-size:18px" id="' + toolinfo.id + '"></button>');
        btn.append(toolinfo.icon);
        if (toolinfo.disabled === true) {
            btn.prop('disabled', true);
        }
        btn.click(function(e) {
            if (eventFired === false) {
                $('#' + this.id).blur();
                var param = toolPaletteInstance.makeChooseParam({tool: this.id.replace(/_.*/, '')});
                WcEvent.fire(WcEvent.systemMessages.choose, param);
                // will trampoline to clickTool().
            } else {
                toolPaletteInstance.selectTool("#" + this.id);
                toolinfo.callback(e);
                eventFired = false; // reset it.
            }
        });
        btn.dblclick(function(e) {
            WcOptions.showOptionsPalette();
        });
        // locate to dom tree
        var group = toolinfo.group;
        $(group).append(btn);
    },
    selectTool: function(toolId) { // Id as in id of element
        // first, clear enabled and then select it.
        $(toolPaletteIdDict.paletteId + " .btn").removeClass('active');
        $(toolId).addClass('active').blur();
    },
    selectedTool: function() {
        return $(toolPaletteIdDict.paletteId + " .btn.active")[0].id.replace(/_.*/, '');
    },
    clickTool: function(toolId) { // Id as in id of element
        eventFired = true;
        var btn = $(toolPaletteIdDict.paletteId).find(toolId);
        // click at it
        if (btn.length > 0) {
            btn.click();
        }
        return;
    },
    makeChooseParam(args) {
        var param = {name:"", number: 0};
        if ('tool' in args) {
            param.name = args.tool; // !todo: check grammer of args
            switch(args.tool) {
                case 'Browse': param.number = 1; break;
                case 'Edit': param.number = 2; break;
                default:
                    param.number = _.findIndex(paintTools, function(p) {
                        return p.id == args.tool + '_Tool';
                    });
                    param.number = param.number + 3; // add above 2. +1 more since posInt start with 1.
                    break;
            }
        }
        if ('toolId' in args) {
            param.number = args.toolId;
            switch(args.toolId) {
                case 1: param.name = 'Browse'; break;
                case 2: param.name = 'Edit'; break;
                default:
                    param.name = paintTools[args.toolId - 3].id;
                    param.name = param.name.replace(/_.*/, '');
            }
        }
        // make into array so jQuery .trigger can handle.
        return [param.name, param.number];
    },
    setStrokeColor: function(rgba) {
        $(toolPaletteIdDict.strokeColorId).spectrum("set", rgba);
    },
    setFillColor: function(rgba) {
        $(toolPaletteIdDict.fillColorId).spectrum("set", rgba);
    },
    hideToolPalette: function() {
        $(toolPaletteIdDict.paletteId).hide();
    },
    showToolPalette: function() {
        $(toolPaletteIdDict.paletteId).show();
    },
    toggleToolPalette: function() {
        if ($(toolPaletteIdDict.paletteId).is(":visible")) {
            this.hideToolPalette();
        } else {
            this.showToolPalette();
        }
    }
};

toolPaletteInstance = new WcTool();

export default toolPaletteInstance;
