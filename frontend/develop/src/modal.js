/*!
 * WebCard modal to prompt
 */

import 'jquery-form-validator';
import 'spectrum-colorpicker';
import StackOp from './stack.js';
import DomOp from './dom.js';
import WcPart from './part.js';
import WcButton from './button.js';
import WcField from './field.js';
import WcOptions from './options.js';
import WcCrypto from './crypto.js';
import WcResource from './resource.js';
import WcStorage from './storage.js';
import WcUser from './user.js';

var modalFrameId;
var modalFormId;
function setupModal(title, form, onOK, footerBtns) {
    var ele = $(modalFrameId);
    ele.find(".modal-title").text(title);
    $(modalFormId).empty().append(form);
    var modalFooter = ele.find(".modal-footer").empty();
    if (footerBtns) {
        for (var i = 0; i < footerBtns.length; i++) {
            modalFooter.append(footerBtns[i]);
        }
    } else {
        modalFooter
            .append($('<button>', { "class": "btn btn-secondary", "type": "button", "data-dismiss": "modal" }).text("Cancel"))
            .append($('<button>', { "class": "btn btn-primary", "type": "submit", "form": "modalForm"}).text("OK"))
        ;
    }
    //ele.find(".modal-footer").empty().append(footer); // use the default layout.js footer elements.
    // setup validator
    $.validate({
    //validator({
        form: modalFormId,
        onError: function($form) {
            // alert("validation of form " + $form.attr('id') + " failed...");
            return false;
        },
        onSuccess: function($form) {
            onOK();
            // hide modal when onSuccess func is done.
            $(modalFrameId).modal('hide');
        },
        onValidate: function($form) {
            // console.log($form);
        },
        onElementValidate: function(valid, $el, $form, erroMsg)  {
            //console.log("input: " + $el.attr('name') + " is " + (valid ? "VALID" : "INVALID"));
        }
    });
    // show modal
    ele.modal({
        backdrop: true,
        keyboard: true,
        focus: true,
        show: true
    });
}

var modalInstance;
function WcModal() {
    if (typeof modalInstance === 'object') {
        return modalInstance;
    }
    modalInstance = this;
}
WcModal.prototype = {
    constructor: WcModal,
    setup: function(idDict) {
        modalFrameId = idDict.modalId;
        modalFormId = idDict.formId;
        // prevent page reload when submit button is pressed
        $(modalFormId).submit(function(e) {
            e.preventDefault();
            return false;
        });
    },
    newStack: function() {
        var title = "New Stack";
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3", "for": "stackName"}).text("Stack Name: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "stackName", "data-validation": "length", "data-validation-length": "1-128", "value": "New Stack" }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3", "for": "stackWidth"}).text("Stack Width: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "stackWidth", "data-validation": "number", "data-validation-allowing": "range[1;4096]", "value": "640" }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3", "for": "stackHeight"}).text("Stack Height: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "stackHeight", "data-validation": "number", "data-validation-allowing": "range[1;2160]", "value": "480" }))));
        var onOk = function() {
            var name = $("#stackName").val();
            var width = $("#stackWidth").val();
            var height = $("#stackHeight").val();
            StackOp.newStack(name, width, height);
            DomOp.update();
        };
        // setup form
        setupModal(title, form, onOk);
    },
    openStack: function() {
        var title = "Open Stack";
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Location: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<select>', { "class": "form-control", "id": "saveLocation", })
                        .append($('<option>', { "id": "saveLocationLocal", "value": "localStorage", "selected": true }).text("Local Storage"))
                        .append($('<option>', { "id": "saveLocationRemote", "value": "remoteStorage" }).text("Server Storage")))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Stack: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<select>', { "class": "form-control", "id": "openStackName", }))));
        var sel = form.find('#openStackName');
        var stacks = JSON.parse(WcStorage.local.load(WcStorage.keys.localStacks));
        function updateStackNames(sel, stacks) {
            stacks = (stacks) ? stacks : [];
            sel.empty();
            for (var i = 0; i < stacks.length; i++) {
                var stk = stacks[i];
                sel.append($('<option>', { "value": stk }).text(stk));
            }
            if (stacks.length === 0) {
                sel.append($('<option>', { "value": "" }).text("--- None found ---"));
            }
        }
        // default select to local, so set options for select openStackName
        updateStackNames(sel, stacks);
        function localSelected() {
            var stacks = JSON.parse(WcStorage.local.load(WcStorage.keys.localStacks));
            var sel = $('#openStackName');
            updateStackNames(sel, stacks);
        }
        function remoteSelected() {
            if (WcUser.getStatus() === WcUser.status.login) {
                WcStorage.remote.load(false, function(stacks){ // async.
                    // getting stacks as null is some error, but just treat as 0 stacks returned
                    stacks = (stacks) ? stacks : [];
                    var sel = $('#openStackName');
                    updateStackNames(sel, stacks);
                });
            } else {
                alert("Need to Sign in first!");
            }
        }
        form.find('#saveLocation').change(function(){
            var location = $(this).val();
            if (location === "localStorage") {
                localSelected();
            } else if (location === "remoteStorage") {
                remoteSelected();
            } else {
                console.error("ERROR: Unknown value in Save Location");
            }
        });
        var onOk = function() {
            var name = $("#openStackName").val();
            var location = $('#saveLocation').val();
            StackOp.openStack(name, location);
            DomOp.update();
        };
        // setup form
        setupModal(title, form, onOk);
    },
    closeStack: function() {
        // TBD
    },
    saveStack: function() {
        var title = "Save Stack";
        var name = StackOp.currentStack.name();
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Location: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<select>', { "class": "form-control", "id": "saveLocation", })
                        .append($('<option>', { "id": "saveLocationLocal", "value": "localStorage", "selected": true }).text("Local Storage"))
                        .append($('<option>', { "id": "saveLocationRemote", "value": "remoteStorage" }).text("Server Storage")))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3", "for": "saveStackName"}).text("Save As: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "saveStackName", "data-validation": "length", "data-validation-length": "3-128", "value": name }))));
        var onOk = function() {
            var name = $("#saveStackName").val();
            var location = $('#saveLocation').val();
            StackOp.saveAs(name, location);
        };
        // setup form
        setupModal(title, form, onOk);
    },
    deleteStack: function() {
        var title = "Delete Stack";
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Location: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<select>', { "class": "form-control", "id": "saveLocation", })
                        .append($('<option>', { "id": "saveLocationLocal", "value": "localStorage", "selected": true }).text("Local Storage"))
                        .append($('<option>', { "id": "saveLocationRemote", "value": "remoteStorage" }).text("Server Storage")))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Stack: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<select>', { "class": "form-control", "id": "deleteStackName", }))));
        var sel = form.find('#deleteStackName');
        var stacks = JSON.parse(WcStorage.local.load(WcStorage.keys.localStacks));
        function updateStackNames(sel, stacks) {
            stacks = (stacks) ? stacks : [];
            sel.empty();
            for (var i = 0; i < stacks.length; i++) {
                var stk = stacks[i];
                sel.append($('<option>', { "value": stk }).text(stk));
            }
            if (stacks.length === 0) {
                sel.append($('<option>', { "value": "" }).text("--- None found ---"));
            }
        }
        // default select to local, so set options for select openStackName
        updateStackNames(sel, stacks);
        function localSelected() {
            var stacks = JSON.parse(WcStorage.local.load(WcStorage.keys.localStacks));
            var sel = $('#deleteStackName');
            updateStackNames(sel, stacks);
        }
        function remoteSelected() {
            if (WcUser.getStatus() === WcUser.status.login) {
                WcStorage.remote.load(false, function(stacks){ // async.
                    // getting stacks as null is some error, but just treat as 0 stacks returned
                    stacks = (stacks) ? stacks : [];
                    var sel = $('#deleteStackName');
                    updateStackNames(sel, stacks);
                });
            } else {
                alert("Need to Sign in first!");
            }
        }
        form.find('#saveLocation').change(function(){
            var location = $(this).val();
            if (location === "localStorage") {
                localSelected();
            } else if (location === "remoteStorage") {
                remoteSelected();
            } else {
                console.error("ERROR: Unknown value in Save Location");
            }
        });

        var onOk = function() {
            var name = $("#deleteStackName").val();
            var location = $('#saveLocation').val();
            StackOp.deleteStack(name, location);
            //DomOp.update();
        };
        // setup form
        setupModal(title, form, onOk);
    },
    cardInfo: function() {
        var title = "Card Info";
        var card = StackOp.currentCard();
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3", "for": "cardName"}).text("Name: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "cardName", "data-validation": "length", "data-validation-length": "0-128", "value": card.name() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Width, Height: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": card.width() + ', ' + card.height() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("ID: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": card.id() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Buttons: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": card.numButtons() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Fields: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": card.numFields() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "cardScript" }).text("Script")))
            ;
        form.find('#cardScript').click(function() {
            var name = $("#cardName").val();
            StackOp.currentCard().name(name);
            // hide modal when going to edit script
            $(modalFrameId).modal('hide');
            var card = StackOp.currentCard();
            card.script().edit();
        });
        var onOk = function() {
            var name = $("#cardName").val();
            StackOp.currentCard().name(name);
        };
        // setup form
        setupModal(title, form, onOk);
    },
    backgroundInfo: function() {
        var title = "Background Info";
        var bg = StackOp.currentBg();
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3", "for": "bgName"}).text("Name: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "bgName", "data-validation": "length", "data-validation-length": "0-128", "value": bg.name() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Width, Height: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": bg.width() + ', ' + bg.height() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("ID: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": bg.id() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Buttons: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": bg.numButtons() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Fields: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": bg.numFields() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Cards: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": bg.numCards() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "bgScript" }).text("Script")))
            ;
        form.find('#bgScript').click(function() {
            var name = $("#bgName").val();
            StackOp.currentBg().name(name);
            // hide modal when going to edit script
            $(modalFrameId).modal('hide');
            var bg = StackOp.currentBg();
            bg.script().edit();
        });
        var onOk = function() {
            var name = $("#bgName").val();
            StackOp.currentBg().name(name);
        };
        // setup form
        setupModal(title, form, onOk);
    },
    stackInfo: function() {
        var title = "Stack Info";
        var stack = StackOp.currentStack;
        var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3", "for": "stackName"}).text("Name: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control", "type": "text", "id": "stackName", "data-validation": "length", "data-validation-length": "1-128", "value": stack.name() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Width, Height: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": stack.width() + ', ' + stack.height() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("ID: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": stack.id() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Backgrounds: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": stack.numBackgrounds() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label col-3" }).text("Cards: "))
                .append($('<div>', { "class": "col-9" })
                    .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": stack.numCards() }))))
            .append($('<div>', { "class": "form-group row" })
                .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "stackScript" }).text("Script")))
            ;
        form.find('#stackScript').click(function() {
            var name = $("#stackName").val();
            StackOp.currentStack.name(name);
            // hide modal when going to edit script
            $(modalFrameId).modal('hide');
            var stk = StackOp.currentStack;
            stk.script().edit();
        });
        var onOk = function() {
            var name = $("#stackName").val();
            StackOp.currentStack.name(name);
        };
        // setup form
        setupModal(title, form, onOk);
    },
    buttonInfo: function() {
        var part = StackOp.currentStack.focusedPart;
        if (part && part.partType() === WcPart.type.button) {
            var title = "Button Info";
            var btn = part;
            var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-3", "for": "btnName"}).text("Name: "))
                    .append($('<div>', { "class": "col-9" })
                        .append($('<input>', { "class": "form-control", "type": "text", "id": "btnName", "data-validation": "length", "data-validation-length": "0-128", "value": btn.name() }))))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-1" }).text("ID: "))
                    .append($('<div>', { "class": "col-2" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": btn.id() })))
                    .append($('<label>', { "class": "col-form-label col-1" }).text("Num: "))
                    .append($('<div>', { "class": "col-2" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": btn.number() })))
                    .append($('<label>', { "class": "col-form-label col-3" }).text("Part Num: "))
                    .append($('<div>', { "class": "col-2" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": btn.partNumber() }))))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-3" }).text("Rect: "))
                    .append($('<div>', { "class": "col-9" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": btn.left() + ', ' + btn.top() + ', ' + btn.right() + ', ' + btn.bottom() }))))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-3" }).text("Style: "))
                    .append($('<div>', { "class": "col-9" })
                        .append($('<select>', { "class": "form-control", "id": "btnStyle" })))) // option elements to be setup after
                .append($('<div>', { "class": "form-group row" })
                    .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "btnScript" }).text("Script"))
                    .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "btnTextStyle" }).text("Text Style"))
                    .append($('<label>', { "class": "col-form-label col-2" }).text("Color: "))
                    .append($('<div>', { "class": "col-2" })
                        .append($('<input>', { "class": "col-2", "type": "text", "id": "buttonBackgroundColor" }))))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "btnIcon" }).text("Icon"))
                    .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "disabled": true, "data-dismiss": "modal", "id": "btnContents" }).text("Contents"))
                    .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "disabled": true, "data-dismiss": "modal", "id": "btnTasks" }).text("Contents")))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<div>', { "class": "form-check form-check-inline col-4" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "btnShowName", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "btnShowName"}).text("Show Name")))
                    .append($('<div>', { "class": "form-check form-check-linine col-3" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "btnAutoHilite", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "btnAutoHilite"}).text("Auto Hilite"))) // TBD
                    .append($('<div>', { "class": "form-check form-check-linine offset-1" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "btnEnabled", "value": "" })))
                        .append($('<label>', { "class": "form-check-label", "for": "btnEnabled"}).text("Enabled")));
            var sel = form.find("#btnStyle");
            var style = WcButton.style;
            for (var key in style) {
                var check = (btn.style() === style[key]);
                var opt_html = '<option id="' + key + '" value="' + key + '">' + style[key] + '</option>';
                var opt = $(opt_html);
                if (check) {
                    opt.prop("selected", true);
                }
                sel.append(opt);
            }
            form.find("#buttonBackgroundColor").spectrum({
                color: (btn.bgColor()) ? btn.bgColor() : 'white',
                showInput: true,
                showInitial: true,
                showAlpha: true,
                showPalette: true,
                clickoutFiresChange: true,
                preferredFormat: "hex3",
                change: function(color) {
                    $('#' + this.id).val(color);
                }
            });
            form.find('#btnScript').click(function() {
                // onOK() could not called... copying ... 
                var btn = StackOp.currentStack.focusedPart;
                var style = WcButton.style;
                btn.name($("#btnName").val());
                btn.style(style[$("#btnStyle").val()]);
                var c = $('#buttonBackgroundColor').val();
                if (c) { btn.bgColor(c); }
                btn.showName($('#btnShowName').is(':checked'));
                btn.autoHilite($('#btnAutoHilite').is(':checked'));
                btn.enabled($('#btnEnabled').is(':checked'));

                // hide modal when going to edit script
                $(modalFrameId).modal('hide');
                btn.script().edit();
            });
            form.find("#btnTextStyle").click(function() {
                // onOK() could not called... copying ... 
                var btn = StackOp.currentStack.focusedPart;
                var style = WcButton.style;
                btn.name($("#btnName").val());
                btn.style(style[$("#btnStyle").val()]);
                var c = $('#buttonBackgroundColor').val();
                if (c) { btn.bgColor(c); }
                btn.showName($('#btnShowName').is(':checked'));
                btn.autoHilite($('#btnAutoHilite').is(':checked'));
                btn.enabled($('#btnEnabled').is(':checked'));

                WcOptions.setupPartsTextAttr(btn);
            });
            form.find('#btnIcon').click(function() {
                // onOK() could not called... copying ... 
                var btn = StackOp.currentStack.focusedPart;
                var style = WcButton.style;
                btn.name($("#btnName").val());
                btn.style(style[$("#btnStyle").val()]);
                var c = $('#buttonBackgroundColor').val();
                if (c) { btn.bgColor(c); }
                btn.showName($('#btnShowName').is(':checked'));
                btn.autoHilite($('#btnAutoHilite').is(':checked'));
                btn.enabled($('#btnEnabled').is(':checked'));

                // hide modal when going to edit script
                $(modalFrameId).modal('hide');
                WcResource.editIcon(btn);
            });
            form.find("#btnShowName").prop('checked', btn.showName());
            form.find("#btnAutoHilite").prop('checked', btn.autoHilite());
            form.find("#btnEnabled").prop('checked', btn.enabled());
            var onOk = function() {
                var btn = StackOp.currentStack.focusedPart;
                var style = WcButton.style;
                btn.name($("#btnName").val());
                btn.style(style[$("#btnStyle").val()]);
                var c = $('#buttonBackgroundColor').val();
                if (c) { btn.bgColor(c); }
                btn.showName($('#btnShowName').is(':checked'));
                btn.autoHilite($('#btnAutoHilite').is(':checked'));
                btn.enabled($('#btnEnabled').is(':checked'));
                DomOp.sync();
            };
            // setup form
            setupModal(title, form, onOk);
        } else {
            alert("No Button selected");
        }
    },
    fieldInfo: function() {
        var part = StackOp.currentStack.focusedPart;
        if (part && part.partType() === WcPart.type.field) {
            var title = "Field Info";
            var fld = part;
            var form = $('<div>', { "class": "justAWrapperOfForm" }) //! fixme any way to do insertAfter() ?
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-3", "for": "fldName"}).text("Name: "))
                    .append($('<div>', { "class": "col-9" })
                        .append($('<input>', { "class": "form-control", "type": "text", "id": "fldName", "data-validation": "length", "data-validation-length": "0-128", "value": fld.name() }))))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-3" }).text("ID: "))
                    .append($('<div>', { "class": "col-1" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": fld.id() })))
                    .append($('<label>', { "class": "col-form-label col-2" }).text("Number: "))
                    .append($('<div>', { "class": "col-1" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": fld.number() })))
                    .append($('<label>', { "class": "col-form-label col-3" }).text("Part Number: "))
                    .append($('<div>', { "class": "col-1" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": fld.partNumber() }))))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-3" }).text("Rect: "))
                    .append($('<div>', { "class": "col-9" })
                        .append($('<input>', { "class": "form-control-plaintext", "type": "text", "readonly": true, "value": fld.left() + ', ' + fld.top() + ', ' + fld.right() + ', ' + fld.bottom() }))))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<label>', { "class": "col-form-label col-3" }).text("Style: "))
                    .append($('<div>', { "class": "col-9" })
                        .append($('<select>', { "class": "form-control", "id": "fldStyle" })))) // option elements to be setup after
                .append($('<div>', { "class": "form-group row" })
                    .append($('<div>', { "class": "form-check form-check-inline col-4" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldLockText", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "fldLockText"}).text("Lock Text")))
                    .append($('<div>', { "class": "form-check form-check-linine col-3" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldDontWrap", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "fldDontWrap"}).text("Don't Wrap")))
                    .append($('<div>', { "class": "form-check form-check-linine offset-1" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldAutoSelect", "value": "" })))
                        .append($('<label>', { "class": "form-check-label", "for": "fldAutoSelect"}).text("Auto Select")))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<div>', { "class": "form-check form-check-inline col-4" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldMultiLines", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "fldMultiLines"}).text("Multiple Lines")))
                    .append($('<div>', { "class": "form-check form-check-linine col-3" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldWideMargins", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "fldWideMargins"}).text("Wide Margins")))
                    .append($('<div>', { "class": "form-check form-check-linine offset-1" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldFixedLineHeight", "value": "" })))
                        .append($('<label>', { "class": "form-check-label", "for": "fldFixedLineHeight"}).text("Fixed Line Height")))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<div>', { "class": "form-check form-check-inline col-4" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldShowLines", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "fldShowLines"}).text("Show Lines")))
                    .append($('<div>', { "class": "form-check form-check-linine col-3" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldAutoTab", "value": "" }))
                        .append($('<label>', { "class": "form-check-label", "for": "fldAutoTab"}).text("Auto Tab")))
                    .append($('<div>', { "class": "form-check form-check-linine offset-1" })
                        .append($('<input>', { "class": "form-check-input", "type": "checkbox", "id": "fldDontSearch", "value": "" })))
                        .append($('<label>', { "class": "form-check-label", "for": "fldDontSearch"}).text("Don't Search")))
                .append($('<div>', { "class": "form-group row" })
                    .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "fldScript" }).text("Script"))
                    .append($('<button>', { "type": "button", "class": "btn btn-outline-secondary offset-1 col-3", "data-dismiss": "modal", "id": "fldTextStyle" }).text("Text Style"))
                    .append($('<label>', { "class": "col-form-label col-2" }).text("Color: "))
                    .append($('<div>', { "class": "col-2" })
                        .append($('<input>', { "class": "col-2", "type": "text", "id": "fieldBackgroundColor" }))));
            var sel = form.find("#fldStyle");
            var style = WcField.style;
            for (var key in style) {
                var check = (fld.style() === style[key]);
                var opt_html = '<option id="' + key + '" value="' + key + '">' + style[key] + '</option>';
                var opt = $(opt_html);
                if (check) {
                    opt.prop("selected", true);
                }
                sel.append(opt);
            }
            form.find("#fieldBackgroundColor").spectrum({
                color: (fld.bgColor()) ? fld.bgColor() : 'white',
                showInput: true,
                showInitial: true,
                showAlpha: true,
                showPalette: true,
                clickoutFiresChange: true,
                preferredFormat: "hex3",
                change: function(color) {
                    $('#' + this.id).val(color);
                }
            });
            form.find("#fldLockText").prop('checked', fld.lockText());
            form.find("#fldDontWrap").prop('checked', fld.dontWrap());
            form.find("#fldAutoSelect").prop('checked', fld.autoSelect());
            form.find("#fldMultiLines").prop('checked', fld.multipleLines());
            form.find("#fldWideMargins").prop('checked', fld.wideMargines());
            form.find("#fldFixedLineHeight").prop('checked', fld.fixedLineHeight());
            form.find("#fldShowLines").prop('checked', fld.showLines());
            form.find("#fldAutoTab").prop('checked', fld.autoTab());
            form.find("#fldDontSearch").prop('checked', fld.dontSearch());
            form.find('#fldScript').click(function() {
                // onOK could not called ... copying ...
                var fld = StackOp.currentStack.focusedPart;
                var style = WcField.style;
                fld.name($("#fldName").val());
                fld.style(style[$("#fldStyle").val()]);
                var c = $('#fieldBackgroundColor').val();
                if (c) { fld.bgColor(c); }
                fld.lockText($('#fldLockText').is(':checked'));
                fld.dontWrap($('#fldDontWrap').is(':checked'));
                fld.autoSelect($('#fldAutoSelect').is(':checked'));
                fld.multipleLines($('#fldMultiLines').is(':checked'));
                fld.wideMargines($('#fldWideMargins').is(':checked'));
                fld.fixedLineHeight($('#fldFixedLineHeight').is(':checked'));
                fld.showLines($('#fldShowLines').is(':checked'));
                fld.autoTab($('#fldAutoTab').is(':checked'));
                fld.dontSearch($('#fldDontSearch').is(':checked'));

                // hide modal when going to edit script
                $(modalFrameId).modal('hide');
                fld.script().edit();
            });
            form.find("#fldTextStyle").click(function() {
                // onOK could not called ... copying ...
                var fld = StackOp.currentStack.focusedPart;
                var style = WcField.style;
                fld.name($("#fldName").val());
                fld.style(style[$("#fldStyle").val()]);
                var c = $('#fieldBackgroundColor').val();
                if (c) { fld.bgColor(c); }
                fld.lockText($('#fldLockText').is(':checked'));
                fld.dontWrap($('#fldDontWrap').is(':checked'));
                fld.autoSelect($('#fldAutoSelect').is(':checked'));
                fld.multipleLines($('#fldMultiLines').is(':checked'));
                fld.wideMargines($('#fldWideMargins').is(':checked'));
                fld.fixedLineHeight($('#fldFixedLineHeight').is(':checked'));
                fld.showLines($('#fldShowLines').is(':checked'));
                fld.autoTab($('#fldAutoTab').is(':checked'));
                fld.dontSearch($('#fldDontSearch').is(':checked'));

                WcOptions.setupPartsTextAttr(fld);
            });
            
            var onOk = function() {
                var fld = StackOp.currentStack.focusedPart;
                var style = WcField.style;
                fld.name($("#fldName").val());
                fld.style(style[$("#fldStyle").val()]);
                var c = $('#fieldBackgroundColor').val();
                if (c) { fld.bgColor(c); }
                fld.lockText($('#fldLockText').is(':checked'));
                fld.dontWrap($('#fldDontWrap').is(':checked'));
                fld.autoSelect($('#fldAutoSelect').is(':checked'));
                fld.multipleLines($('#fldMultiLines').is(':checked'));
                fld.wideMargines($('#fldWideMargins').is(':checked'));
                fld.fixedLineHeight($('#fldFixedLineHeight').is(':checked'));
                fld.showLines($('#fldShowLines').is(':checked'));
                fld.autoTab($('#fldAutoTab').is(':checked'));
                fld.dontSearch($('#fldDontSearch').is(':checked'));
                DomOp.sync();
            };
            // setup form
            setupModal(title, form, onOk);
        } else {
            alert("No Field selected");
        }
    },
    answer: function(text, choices) {
        var title = "Please Answer";
        var form = $('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label"}).text(text));
        var onOk = function() {
//            DomOp.update();
        };
        var footerBtns = [];
        for (var i = 0; i < choices.length; i++) {
            var btn = $('<button>', { "class": "btn btn-primary", "type": "submit", "form": "modalForm"}).text(choices[i]);
            btn.click(function() {
                WcInterpreter.it = $(this).text();
            });
            footerBtns.push(btn);
        }
        // setup form
        setupModal(title, form, onOk, footerBtns);
    },
    ask: function(text, defo) {
        var title = "Asking";
        var form = $('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label"}).text(text))
                //.append($('<div>', { "class": "col-9" })
                .append($('<input>', { "class": "form-control", "type": "text", "id": "askanswer", "data-validation": "length", "data-validation-length": "0-128", "value": defo }))
                ;
        var onOk = function() {
            var ans = $("#askanswer").val();
            WcInterpreter.it = ans;
        };
        // just show OK button
        var footerBtns = $('<button>', { "class": "btn btn-primary", "type": "submit", "form": "modalForm"}).text("OK");
        // setup form
        setupModal(title, form, onOk, footerBtns);
    },
    askPassword: function(text, defo, plainText) {
        var title = "Password";
        var form = $('<div>', { "class": "form-group row" })
                .append($('<label>', { "class": "col-form-label"}).text(text))
                // bcrypt only the first 72 chars are used
                .append($('<input>', { "class": "form-control", "type": "password", "id": "askpassword", "data-validation": "length", "data-validation-length": "1-72", "value": defo }))
                ;
        var onOk = function() {
            var ans = $("#askpassword").val();
            if (!plainText) {
                ans = WcCrypto.encrypt(ans);
            }
            WcInterpreter.it = ans;
        };
        // just show OK button
        var footerBtns = $('<button>', { "class": "btn btn-primary", "type": "submit", "form": "modalForm"}).text("OK");
        // setup form
        setupModal(title, form, onOk, footerBtns);
    },
};

modalInstance = new WcModal();

export default modalInstance;
