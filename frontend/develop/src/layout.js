/*
 * layout.js: Set components to body
 */

import './tool.css';
import WcTool from './tool.js';
import WcOptions from './options.js';
import WcLayer from './layer.js';
import WcMenu from './menu.js';
import WcModal from './modal.js';
import StackOp from './stack.js';
import DomOp from './dom.js';
// not really related to layout... maybe move to index.js ?
import WcStorage from './storage.js';
import WcInterpreter from './interpreter.js';
import WcSound from './sound.js';

function setupElements() {
    // add main menu bar using bootstrap's navigation bar
    $('body')
    .append($('<nav>', { "class": "navbar navbar-expand-lg navbar-light bg-light sticky-top", "id": "navbarTop", "style": "position: relative; z-index:auto;" })
        .append($('<a>', { "class": "navbar-brand", href: "#"}).text("WebCard Editor"))
        .append($('<button>', { "class": "navbar-toggler", "type": "button", "data-toggle": "collapse", "data-target": "#navbarCollapse" })
            .append($('<span>', { "class": "navbar-toggler-icon" }))
        )
        .append($('<div>', { "class": "collapse navbar-collapse", "id": "navbarCollapse" })
            .append($('<div>', { "class": "navbar-nav", "id": "navbarNav" }))
        )
    );

    // add modal
    $('body')
    .append($('<div>', { "class": "modal fade", "tabindex": "-1", "role": "dialog", "id": "modalTop" })
        .append($('<div>', { "class": "modal-dialog", "role": "document" })
            .append($('<div>', { "class": "modal-content" })
                .append($('<div>', { "class": "modal-header" })
                    .append($('<h5>', { "class": "modal-title" }).text("Modal title"))
                    .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "modal", "aria-label": "Close" })
                        .append($('<span>', { "aria-hidden": "true" }).html("&times;"))
                    )
                )
                .append($('<div>', { "class": "modal-body" })
                    .append($('<div>', { "class": "container-fluid" })
                        .append($('<form>', { "id": "modalForm" })
                            .append($('<div>', { "class": "form-group row"}) // this is just a sample. will be overwritten.
                                .append($('<label>', { "class": "col-3 col-form-label", "for": "inputName"}).text("Name"))
                                .append($('<input>', { "class": "col-9 form-control", "id": "inputName"}).text("your name here"))
                            )
                        )
                    )
                )
                .append($('<div>', { "class": "modal-footer" })
                    .append($('<button>', { "class": "btn btn-secondary", "type": "button", "data-dismiss": "modal" }).text("Cancel"))
                    .append($('<button>', { "class": "btn btn-primary", "type": "submit", "form": "modalForm"}).text("OK"))
                )
            )
        )
    );

    // add Tools palette
    $('body')
    .append($('<div>', { "class": "card", "id": "toolPalette", "style": "position:fixed; z-index:1; box-shadow: 4px 4px 4px 4px gray;" })
        .append($('<h5>', { "class": "card-header" }).text("Tools")
            .append($('<button>', { "class": "close", "id": "toolPaletteClose", "type": "button", "data-dismiss": "modal", "aria-label": "Close" })
                .append($('<span>', { "aria-hidden": "true" }).html("&times;"))
            )
        )
        .append($('<div>', { "class": "card-body" })
            .append($('<div>', { "class": "btn-group btn-matrix", "id": "toolPaletteModes", "role": "group" }))
            .append($('<hr>'))
            .append($('<div>', { "class": "btn-group btn-matrix", "id": "toolPalettePaints", "role": "group" }))
            .append($('<div>', { "class": "card-body", "style": "position: relative; top: 18px; height: 90px;"})
                .append($('<span>', { "class": "card-text", "style": "position:absolute; left:0px; top:0px"})
                    .append($('<i>', { "class": "material-icons"}).text("palette"))
                )
                .append($('<div>', { "style": "position:absolute; left:28px; top:0px" })
                    .append($('<input>', { "type": "text", "id": "strokeColorPalette" }))
                )
                .append($('<span>', { "class": "card-text", "style": "position:absolute; left:0px; top:32px"})
                    .append($('<i>', { "class": "material-icons"}).text("format_color_fill"))
                )
                .append($('<div>', { "style": "position:absolute; left:28px; top:32px" })
                    .append($('<input>', { "type": "text", "id": "fillColorPalette" }))
                )

            )
        )
    );

    // add Options Palette
    $('body')
    .append($('<div>', { "class": "card", "id": "optionsPalette", "style": "position: fixed; z-index:2; box-shadow: 4px 4px 4px 4px gray;" })
        .append($('<h5>', { "class": "card-header" })
            .append($('<span>', { "class": "card-title" }).text("Options"))
            .append($('<button>', { "class": "close", "id": "optionsPaletteClose", "type": "button", "data-dismiss": "modal", "aria-label": "Close" })
                .append($('<span>', { "aria-hidden": "true" }).html("&times;"))
            )
        )
        .append($('<div>', { "class": "card-body" })
            .append($('<div>', { "class": "container-fluid" })
                .append($('<form>', { "id": "optionsForm" })
                    .append($('<div>', { "class": "form-group row"}) // this is just a sample. will be overwritten.
                        .append($('<p>').text("Choose paint tool"))
                    )
                )
            )
        )
        .append($('<div>', { "class": "card-footer text-right" })
            .append($('<button>', { "class": "btn btn-primary", "type": "submit", "form": "optionsForm"}).text("Apply"))
        )
    );

    // add webcard's main screen
    $('body')
    .append($('<div>', { "class": "container-fluid", "id": "wcMainFrame", "style": "position: relative; width:642px; height:482px; padding: 0px; border: 1px dashed gray;" })
//        .append($('<div>', { "id": "wcMainFrame", "style": "width:640px; height:480px; border: 1px dashed green; position:relative;" }))
//        .append($('<canvas/>', { id: "wcCardCanvas", "tabindex": "1", width: 640, height: 480, "style": "position:absolute; cursor: crosshair;" }))
        // above <canvas> append with style does not work (width/height not reflected... bug?)
//        .append($('<canvas/>', {id:'wcCardCanvas', width: 640, height:480}).css({'cursor': 'crosshair', 'position': 'absolute'}))
    );

    // tests

    //$('body')
    //.append($('<button>', { "class": "btn btn-primary", "type": "button", "data-toggle": "modal", "data-target": "#modalTop" }).text("Launch modal")
    //);

    //$('body')
    //   .append($('<div>', { "style": "background-color: yellow; width: 100px; height: 100px; left:10px; position: relative;" }).text("DIV L1")
    //        .append($('<div>', { "style": "background-color: blue; width: 100px; height: 100px; left:10px; position: relative;" }).text("DIV L2")
    //            .append($('<div>', { "style": "background-color: green; width: 100px; height: 100px; left:10px; position: relative;" }).text("DIV L3")
    //            )
    //        )
    //    );

    //var canvas1 = $('<canvas/>', { id: 'mycanvasId', height: 500, width: 500});
    //$('body').append(canvas1);
    //$('body')
    //.append($('<canvas/>', {id:'mycanvas1', height: 500, width:500 }));

    //$("body").append($('<button class="btn btn-primary">').text("Push Me!!").click(function() {
    //    $("body").append($('<button class="btn btn-outline-danger">').text("another!").click(function(){
    //        $("body").append($('<h2>').text("blah"));
    //    }));
    //}));
}

function setup() {
    setupElements();
    WcTool.setup({
        paletteId: '#toolPalette',
        closeBtnId: '#toolPaletteClose',
        modeGroupId: '#toolPaletteModes',
        paintGroupId: '#toolPalettePaints',
        strokeColorId: '#strokeColorPalette',
        fillColorId: '#fillColorPalette'
    });
    WcOptions.setup({
        paletteId: '#optionsPalette',
        closeBtnId: '#optionsPaletteClose',
        formId: '#optionsForm'
    })
    WcModal.setup({
        modalId: '#modalTop',
        formId: '#modalForm'
    });
    WcLayer.setup("#navbarTop");
    WcMenu.setup('#navbarNav');
    StackOp.setup("<Playground Stack>", $('#wcMainFrame').width(), $('#wcMainFrame').height());
    DomOp.setup('#wcMainFrame');
    WcStorage.setup();
    // WcStorage.local.clear(); // debug
    WcInterpreter.setup('#wcMainFrame');
    WcSound.setup();
}

export default {
    setup: setup,
};
