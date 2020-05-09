/*!
 * WebCard Option palette manipulation
 */

import interact from 'interactjs';
import 'jquery-form-validator';
import listener from './listener.js';
import WcPaint from './paint.js';
import WcTool from './tool.js';
import DomOp from './dom.js';

function makeDraggable(paletteId) {
    interact(paletteId)
        .draggable({
            inertia: true,
            //autoScroll: true,
            restrict: { restriction: "parent" }, // endOnly:true, elementRect: {left:1,right:0,top:1,bottom:0}
            ignoreFrom: 'input',
            //onmove: dragMoveListener,
            //onend: dragEndListner
            onmove: listener.dragMove
        });
}

function setupOptionsPalette(title, form, onSetup, onOK) {
    $(optionsPaletteIdDict.paletteId).find(".card-title").text(title);
    $(optionsPaletteIdDict.formId).empty().append(form);
    // use the default layout.js footer element
    // optionsPalette.find(".panel-footer").empty().append(footer);
    if (onSetup) {
        onSetup();
    }
    // setup validator
    $.validate({
        form : optionsPaletteIdDict.formId,
        onError : function($form) {
            //alert("validation of form " + $form.attr('id') + " failed...");
            return false;
        },
        onSuccess : function($form) {
            if (onOK) {
                onOK();
            }
        },
        onValidate : function($form) {
            //console.log("onValidate:");
            //console.log($form);
            return;
        }/*,
        onElementValidate : function(valid, $el, $form, erroMsg) {
            //console.log("Input: " + $el.attr('id') + ' is ' + ( valid ? 'VALID':'INVALID'));
        }*/
    });        
}

// common funcs for stroke
function strokeOptionsForm(size, style) {
var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optStrokeSize"}).text("Stroke Size: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optStrokeSize", "data-validation": "number", "data-validation-allowing": "range[1;128]", "value": size }))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optStrokeColor"}).text("Stroke Color: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optStrokeColor" }))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optStrokeStyle"}).text("Stroke Style: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<select>', { "class": "form-control", "id": "optStrokeStyle" })
                .append($('<option>', { "id": "optSolidStroke", "value": "solid"}).text("Solid Stroke"))
                .append($('<option>', { "id": "optDashedStroke", "value": "dash"}).text("Dashed Stroke"))
        )))
    .append($('<div>', { "class": "form-group row", "id": "optDashDistance" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optStrokeDash"}).text("Dash Distance: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optStrokeDash", "value": style.dist }))))
    .append($('<div>', { "class": "form-group row", "id": "optDashOffset" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optStrokeDashOffset"}).text("Dash Offset: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optStrokeDashOffset", "value": style.offset }))))
    ;
    return form;
}
function setupStrokeOptions() {
    var stroke = WcPaint.getStrokeStyle();
    if (stroke.style !== "solid") {
        $('#optDashDistance').show();
        $('#optDashOffset').show();
    } else {
        $('#optDashDistance').hide();
        $('#optDashOffset').hide();
    }
    $('#optStrokeColor').spectrum({
        color: WcPaint.getStrokeColor(),
        showInput: true,
        showInitial: true,
        showAlpha: true,
        showPalette: true,
        clickoutFiresChange: true,
        preferredFormat: "hex3",
        change: function(color) {
            var tiny2Rgba = function(c) {
                return "rgba(" +
                    Math.round(c._r) + ',' +
                    Math.round(c._g) + ',' +
                    Math.round(c._b) + ',' +
                    (c._a) + ")";
            };
            var rgba = tiny2Rgba(color);
            WcTool.setStrokeColor(rgba);
            WcPaint.setStrokeColor(rgba);
        }
    });
    $('#optStrokeStyle').change(function() {
        var style = $(this).val();
        if (style === "solid") {
            $('#optDashDistance').hide();
            $('#optDashOffset').hide();
        }
        if (style === "dash") {
            $('#optDashDistance').show();
            $('#optDashOffset').show();
        }
    });
    $('#optStrokeStyle').val(stroke.style);
}
function submitStrokeOptions() {
    var size = $('#optStrokeSize').val();
    // var color = $('#optStrokeColor').val(); // set via spectrum.change()
    var style = $('#optStrokeStyle').val();
    var dist = $('#optStrokeDash').val();
    var offset = $('#optStrokeDashOffset').val();
    WcPaint.setStrokeWidth(size);
    WcPaint.setStrokeStyle(style, dist, offset);
}

// common funcs for fill
function fillOptionsForm() {
var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optFillColor"}).text("Fill Color: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optFillColor" }))))
    ;
    return form;
}
function setupFillOptions() {
    $('#optFillColor').spectrum({
        color: WcPaint.getFillColor(),
        showInput: true,
        showInitial: true,
        showAlpha: true,
        showPalette: true,
        clickoutFiresChange: true,
        preferredFormat: "hex3",
        change:function(color) {
            var tiny2Rgba = function(c) {
                return "rgba(" +
                    Math.round(c._r) + ',' +
                    Math.round(c._g) + ',' +
                    Math.round(c._b) + ',' +
                    (c._a) + ")";
            };
            var rgba = tiny2Rgba(color);
            WcTool.setFillColor(rgba);
            WcPaint.setFillColor(rgba);
        }
    });
}
function submitFillOptions() {
    // TBD : gradient, pattern settings in ctx.fillStyle
    // TBD : "nonzero" "evenodd" settings in ctx.fill()
}

function textAttrOptionsForm(attr) {
var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optFontColor"}).text("Font Color: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optFontColor" }))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optFontSize"}).text("Font Size: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optFontSize", "data-validation": "number", "data-validation-allowing": "range[1;128],float", "value": parseFloat(attr.size()) }))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optFontFamily"}).text("Font Family: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optFontFamily", "data-validation": "length", "data-validation-length": "3-128", "value": attr.family() }))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optFontStyle"}).text("Font Style: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<select>', { "class": "form-control", "id": "optFontStyle" })
                .append($('<option>', { "value": "normal"}).text("Normal"))
                .append($('<option>', { "value": "italic"}).text("Italic"))
                .append($('<option>', { "value": "oblique"}).text("Oblique")))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optFontWeight"}).text("Font Weight: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<select>', { "class": "form-control", "id": "optFontWeight" })
                .append($('<option>', { "value": "normal"}).text("Normal"))
                .append($('<option>', { "value": "bold"}).text("Bold"))
                .append($('<option>', { "value": "lighter"}).text("Lighter")))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optFontStretch"}).text("Font Stretch: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<select>', { "class": "form-control", "id": "optFontStretch" })
                .append($('<option>', { "value": "normal"}).text("Normal"))
                .append($('<option>', { "value": "condensed"}).text("Condensed"))
                .append($('<option>', { "value": "expanded"}).text("Expanded")))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optTextAlign"}).text("Text Align: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<select>', { "class": "form-control", "id": "optTextAlign" })
                .append($('<option>', { "value": "start"}).text("Start"))
                .append($('<option>', { "value": "end"}).text("End"))
                .append($('<option>', { "value": "left"}).text("Left"))
                .append($('<option>', { "value": "center"}).text("Center"))
                .append($('<option>', { "value": "right"}).text("Right")))))
    .append($('<div>', { "class": "form-group row" })
        .append($('<label>', { "class": "col-form-label col-5", "for": "optLineHeight"}).text("Line Height: "))
        .append($('<div>', { "class": "col-7" })
            .append($('<input>', { "class": "form-control", "type": "text", "id": "optLineHeight", "data-validation": "number", "data-validation-allowing": "range[1;128],float", "value": parseFloat(attr.lineHeight()) }))))
    ;
    return form;
}

var optTextAttr;
function setupTextAttrOptions() {
    var attr = optTextAttr;
    $('#optFontStyle').val(attr.style());
    $('#optFontWeight').val(attr.weight());
    $('#optFontStretch').val(attr.stretch());
    $('#optTextAlign').val(attr.textAlign());
    $('#optFontColor').spectrum({
        color: attr.color(),
        showInput: true,
        showInitial: true,
        showAlpha: true,
        showPalette: true,
        clickoutFiresChange: true,
        preferredFormat: "hex3",
        change: function(color) {
            $('#' + this.id).val(color);
            attr.color(color);
        }
    });
}
function submitTextAttrOptions() {
    var attr = optTextAttr;
    var style = $('#optFontStyle').val();
    var weight = $('#optFontWeight').val();
    var stretch = $('#optFontStretch').val();
    var size = $('#optFontSize').val();
    var lineHeight = $('#optLineHeight').val();
    var family = $('#optFontFamily').val();
    var align = $('#optTextAlign').val();
    var color = $('#optFontColor').val();
    size = (size) ? size + 'px' : '16px';
    lineHeight = (lineHeight) ? lineHeight + 'px' : '18px';
    attr.style(style);
    attr.weight(weight);
    attr.stretch(stretch);
    attr.size(size);
    attr.lineHeight(lineHeight);
    attr.family(family);
    attr.textAlign(align);
    attr.color(color);
}


var optionsPaletteIdDict;
// singleton to manipulate tool palette
var optionsPaletteInstance;
function WcOptions() {
    if (typeof optionsPaletteInstance === 'object') {
        return optionsPaletteInstance;
    }
    optionsPaletteInstance = this;
}
WcOptions.prototype = {
    constructor : WcOptions,
    setup: function(idDict) {
        optionsPaletteIdDict = idDict;
        $(optionsPaletteIdDict.paletteId)
            .css('left', '140px') //! todo fix adhoc magic number
            .hide()
            ;
        makeDraggable(optionsPaletteIdDict.paletteId);
        $(optionsPaletteIdDict.closeBtnId).click(function(){
            optionsPaletteInstance.hideOptionsPalette();
        });
        // prevent page reload when submit button is pressed
        $(optionsPaletteIdDict.formId).submit(function(e) {
            e.preventDefault();
            return false;
        });
    },
    setupPencilTool: function() {
        var title = "Pencil Options";
        var size = WcPaint.getStrokeWidth();
        var style = WcPaint.getStrokeStyle();
        var form = strokeOptionsForm(size, style);
        setupOptionsPalette(title, form, setupStrokeOptions, submitStrokeOptions);
    },
    setupBrushTool: function() {
        var title = "Brush Options";
        var size = WcPaint.getStrokeWidth();
        var style = WcPaint.getStrokeStyle();
        var form = strokeOptionsForm(size, style);
        setupOptionsPalette(title, form, setupStrokeOptions, submitStrokeOptions);
    },
    setupLineTool: function() {
        var title = "Line Options";
        var size = WcPaint.getStrokeWidth();
        var style = WcPaint.getStrokeStyle();
        var form = strokeOptionsForm(size, style);
        form.append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-5", "for": "optLineStyle"}).text("Line Ends: "))
                .append($('<div>', { "class": "col-7" })
                    .append($('<select>', { "class": "form-control", "id": "optLineStyle" })
                        .append($('<option>', { "id": "optLineEndsRound", "value": "round"}).text("Round"))
                        .append($('<option>', { "id": "optLineEndsSquare", "value": "square"}).text("Square"))
                )))
        var onSetup = function() {
            setupStrokeOptions();
            $('#optLineStyle').val(WcPaint.getLineStyle());
        };
        var onSubmit = function() {
            submitStrokeOptions();
            var style = $('#optLineStyle').val();
            WcPaint.setLineStyle(style);
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);
    },
    //setupPatternTool: function() {},
    setupEraserTool: function() {
        var title = "Eraser Options";
        var size = WcPaint.getStrokeWidth();
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-5", "for": "optStrokeSize"}).text("Stroke Size: "))
                .append($('<div>', { "class": "col-7" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "optStrokeSize", "data-validation": "number", "data-validation-allowing": "range[1;128]", "value": size }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-5", "for": "optEraserStyle"}).text("Line Ends: "))
                .append($('<div>', { "class": "col-7" })
                    .append($('<select>', { "class": "form-control", "id": "optEraserStyle" })
                        .append($('<option>', { "id": "optLineEndsRound", "value": "round"}).text("Round"))
                        .append($('<option>', { "id": "optLineEndsSquare", "value": "square"}).text("Square")))))
            ;
        var onSetup = function() {
            $('#optEraserStyle').val(WcPaint.getEraserStyle());
        };
        var onSubmit = function() {
            var size = $("#optStrokeSize").val();
            WcPaint.setStrokeWidth(size);
            var style = $('#optEraserStyle').val();
            WcPaint.setEraserStyle(style);
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);
    },
    setupSelectTool: function() {
        var title = "Select Options";
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-6", "for": "optSelectBg"}).text("Background: "))
                .append($('<div>', { "class": "col-6" })
                    .append($('<select>', { "class": "form-control", "id": "optSelectBg" })
                        .append($('<option>', { "id": "optSelectBgTrans", "value": "trans"}).text("Transparent"))
                        .append($('<option>', { "id": "optSelectBgWhite", "value": "white"}).text("White")))))
            ;
        var onSetup = function() {
            $('#optSelectBg').val(WcPaint.getSelectBgType());
        };
        var onSubmit = function() {
            var type = $('#optSelectBg').val();
            WcPaint.setSelectBgType(type);
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);
    },
    //setupCropTool: function() {},
    setupBucketTool: function() {
        var title = "Bucket Options";
        var tolerance = WcPaint.getBucketTolerance();
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-5", "for": "optBucketTolerance"}).text("Tolerance: "))
                .append($('<div>', { "class": "col-7" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "optBucketTolerance",
                     "data-validation": "number", "data-validation-allowing": "range[0.0;1.0],float", "value": tolerance }))))
            ;
        form.append(
            fillOptionsForm()
        );
        var onSetup = function() {
            setupFillOptions();
        };
        var onSubmit = function() {
            var tol = $('#optBucketTolerance').val();
            WcPaint.setBucketTolerance(tol);
            submitFillOptions();
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);                
    },
    setupEyedropTool: function() {
        var title = "Eyedrop Options";
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-6", "for": "optEyedropPickup"}).text("Pickup: "))
                .append($('<div>', { "class": "col-6" })
                    .append($('<select>', { "class": "form-control", "id": "opteyedropPickup" })
                        .append($('<option>', { "id": "optEyedropStroke", "value": "stroke"}).text("Stroke Color"))
                        .append($('<option>', { "id": "optEyedropFill", "value": "fill"}).text("Fill Color")))))
            ;
        var onSetup = function() {
            $('#optEyedropPickup').val(WcPaint.getEyedropPickup());
        };
        var onSubmit = function() {
            var to = $('#optEyedropPickup').val();
            WcPaint.setEyedropPickup(to);
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);                
    },
    setupPolygonTool: function() {
        //var title = "Polygon Options";
        var title = "Rectangle Options";
        var size = WcPaint.getStrokeWidth();
        var style = WcPaint.getStrokeStyle();
        var form = strokeOptionsForm(size, style);
        form.append(fillOptionsForm());
        var onSetup = function() {
            setupStrokeOptions();
            setupFillOptions();
        };
        var onSubmit = function() {
            submitStrokeOptions();
            submitFillOptions();
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);
    },
    setupOvalTool: function() {
        var title = "Oval Options";
        var size = WcPaint.getStrokeWidth();
        var style = WcPaint.getStrokeStyle();
        var form = strokeOptionsForm(size, style);
        form.append(fillOptionsForm());
        var onSetup = function() {
            setupStrokeOptions();
            setupFillOptions();
        };
        var onSubmit = function() {
            submitStrokeOptions();
            submitFillOptions();
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);
    },
    //setupArrowsTool: function() {},
    setupTextTool: function() {
        var title = "Text Options";
        optTextAttr = WcPaint.getTextAttr();
        var form = textAttrOptionsForm(optTextAttr);
        var onSetup = setupTextAttrOptions;
        var onSubmit = function() {
            submitTextAttrOptions();
            WcPaint.setTextAttr(optTextAttr); // need this? above might do.
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);
    },
    setupPartsTextAttr: function(parts) {
        var title = "Text Style Options";
        optTextAttr = parts.textAttr();
        var form = textAttrOptionsForm(optTextAttr);
        var onSetup = setupTextAttrOptions;
        var onSubmit = function() {
            submitTextAttrOptions();
            $(optionsPaletteIdDict.paletteId).hide();
            DomOp.sync();
        };
        setupOptionsPalette(title, form, onSetup, onSubmit);
        this.showOptionsPalette(); // force to appear
    },
    setStrokeColor: function(rgba) {
        $('#optStrokeColor').spectrum("set", rgba);
    },
    setFillColor: function(rgba) {
        $('#optFillColor').spectrum("set", rgba);
    },
    hideOptionsPalette: function() {
        $(optionsPaletteIdDict.paletteId).hide();
    },
    showOptionsPalette: function() {
        $(optionsPaletteIdDict.paletteId).show();
    },
    toggleOptionsPalette: function() {
        if ($(optionsPaletteIdDict.paletteId).is(":visible")) {
            this.hideOptionsPalette();
        } else {
            this.showOptionsPalette();
        }
    }
};

optionsPaletteInstance = new WcOptions();

export default optionsPaletteInstance;
