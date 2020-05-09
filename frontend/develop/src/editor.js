// entry for new editor.html window
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import WcStorage from './storage.js';
import WcParser from './talk.js';

var editKey = WcStorage.keys.edit;
var codeMirrorEditor;
function setupElements() {
    $('body')
        .append($('<div>', { "class": "jumbotron jumbotron-fluid" })
            .append($('<div>', { "class": "container" })
                .append($('<form>', { "id": "editorInputForm" })
                    .append($('<div>', { "class": "form-group row" })
                        .append($('<label>', { "class": "col-form-label col-4", "for": "editorLanguage" }).text("Language: "))
                        .append($('<div>', { "class": "offset-2 col-6" })
                            .append($('<select>', { "class": "form-control", "id": "editorLanguage" })
                                .append($('<option>', { "value": "js"}).text("JavaScript (for debug)"))
                                .append($('<option>', { "value": "talk", "selected": true }).text("CommandTalk")))))
                    .append($('<div>', { "class": "form-group"})
                        .append($('<label>', { "class": "col-form-label", "for": "editorScriptContent" }).text("Script of: " + WcStorage.local.load(WcStorage.keys.editObject)))
                        .append($('<textarea>', {
                            "class": "form-control",
                            "id": "editorScriptContent",
                            "autocomplete": "off",
                            "style": "overflow: scroll;",
                            "maxlength": 65535, //! fixme adhoc magic number...
                            "rows": 16,  //! fixme another magic number...
                            })
                                /* no need. use codemirror instead
                                .keydown(function(e) { // enable tab input
                                    var elem, start, end, value;
                                    if (e.keyCode === 9) {
                                        if (e.preventDefault) {
                                            e.preventDefault();
                                        }
                                        elem = e.target;
                                        start = elem.selectionStart;
                                        end = elem.selectionEnd;
                                        value = elem.value;
                                        elem.value = "" + (value.substring(0, start)) + '\t' + (value.substring(end));
                                        elem.selectionStart = elem.selectionEnd = start + 1;
                                        return false;
                                    }
                                }
                            )*/
                        )
                    )
                    .append($('<div>', { "id": "alertPopupWrapper", "class": "form-group" }))
                    .append($('<div>', { "class": "form-row" })
                        .append($('<button>', { "class": "offset-7 btn btn-secondary mr-2", "id": "editorBtnCheck", "type": "button" }).text("Check"))
                        .append($('<button>', { "class": " btn btn-secondary mr-2", "id": "editorBtnSave", "type": "button" }).text("Save"))
                        .append($('<button>', { "class": " btn btn-secondary", "id": "editorBtnClose", "type": "button" }).text("Close")))
                    )));
}

function setup() {
    // add elements
    setupElements();
    WcStorage.setup();

    $('#editorScriptContent').text(WcStorage.local.load(editKey));

    codeMirrorEditor = CodeMirror.fromTextArea(document.getElementById('editorScriptContent'), {
        lineNumbers: true,
        indentUnit: 4,
        lineWrapping: true,
        mode: "javascript", //! todo: create CommandTalk syntax hilighting for codemirror
    });

    $('#editorBtnCheck').click(function(){
        codeMirrorEditor.save();
        var content = $('#editorScriptContent').val();
        var result = WcParser.parser.parse(content);
        $('.alert').remove();
        if ('type' in result && result.type === "error") {
            $('#alertPopupWrapper')
                .append($('<div>', { "class": "alert alert-danger alert-dismissible fade show", "role": "alert" }).text(result.text)
                    .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "alert" })
                        .append($('<span>').html('&times'))))
        } else {
            $('#alertPopupWrapper')
                .append($('<div>', { "class": "alert alert-success alert-dismissible fade show", "role": "alert" }).text("Parse OK")
                    .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "alert" })
                        .append($('<span>').html('&times'))))
        }
    });

    $('#editorBtnSave').click(function() {
        codeMirrorEditor.save();
        var content = $('#editorScriptContent').val();
        WcStorage.local.save(editKey, content);
    });

    $('#editorBtnClose').click(function(){
        //window.close();
        window.open('about:blank', '_self').close();
    });
}

// entry point
setup();
