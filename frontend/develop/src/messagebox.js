// entry for new msgbox.html window
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/lib/codemirror.css';
import WcStorage from './storage.js';
import WcParser from './talk.js';

var msgKey = WcStorage.keys.msg;
function setupElements() {
    $('body')
        .append($('<div>', { "class": "jumbotron jumbotron-fluid" })
            .append($('<div>', { "class": "container" })
                .append($('<form>', { "id": "messageBoxInputForm" })
                    .append($('<div>', { "class": "form-group row" })
                        .append($('<div>', { "class": "input-group" })
                            .append($('<input>', { "class": "form-control", "type": "text", "id": "messageBoxInput", "value": WcStorage.local.load(msgKey) }))
                            /* hide for now...
                            .append($('<div>', { "class": "input-group-append" })
                                .append($('<button>', { "class": "btn btn-outline-secondary", "id": "msgboxInputCheck", "type": "button" }).text("Check"))
                                .append($('<button>', { "class": "btn btn-outline-secondary", "id": "msgboxInputRun", "type": "submit" }).text("Run"))
                            )
                            */
                        )
                    )
                    .append($('<div>', { "id": "alertPopupWrapper", "class": "form-group" }))
                    )));
}

function checkInput(showOK) {
    // append dummy function name entry to make it a valid script
    var content = 'function f\n' + $('#messageBoxInput').val() + '\nend f';
    var result = WcParser.parser.parse(content);
    $('.alert').remove();
    if ('type' in result && result.type === "error") {
        $('#alertPopupWrapper')
            .append($('<div>', { "class": "alert alert-danger alert-dismissible fade show", "role": "alert" })
                    // remove error line, of 'function messagebox' line. since it's one liner, remove line error
                    .text(result.text.replace(/ line:.*,/, ''))
                .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "alert" })
                    .append($('<span>').html('&times'))))
    } else {
        if (showOK) {
            $('#alertPopupWrapper')
                .append($('<div>', { "class": "alert alert-success alert-dismissible fade show", "role": "alert" }).text("Parse OK")
                    .append($('<button>', { "class": "close", "type": "button", "data-dismiss": "alert" })
                        .append($('<span>').html('&times'))))
        }
    }
}

function sendInput() {
    var content = $('#messageBoxInput').val();
    checkInput(false);
    WcStorage.local.save(msgKey, content);
}

function setup() {
    setupElements();
    WcStorage.setup();

    $('#messageBoxInput').focus();
    $('#messageBoxInputForm').submit(function(e){
        sendInput();
        e.preventDefault();
        return false;
    });
    var callback = function(ev) {
        var oldVal = ev.oldValue;
        var newVal = ev.newValue;
        var sArea = ev.storageArea;
        var key = ev.key;
        var url = ev.url;
        if (key === msgKey) {
            $('#messageBoxInput').val(newVal);
            // clear error popup
            $('.alert').remove();
        }
    };
    WcStorage.local.register(callback);

    $('#msgboxInputCheck').click(function(){
        checkInput(true);
    });

    $('#msgboxInputRun').click(function(){
        $('#messageBoxInputForm').trigger('submit');
    });

}

// entry point
setup();
