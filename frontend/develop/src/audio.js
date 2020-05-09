// entry for new audio.html window
import 'jquery-form-validator';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'popper.js';
import 'font-awesome/css/font-awesome.min.css';
import 'material-icons/iconfont/material-icons.css';
import 'spectrum-colorpicker';
import 'spectrum-colorpicker/spectrum.css';
import Tone from 'tone';
import Recorder from 'recorderjs';
import webaudiofont from 'webaudiofont';
import WcStorage from './storage.js';
import WcSequencer from './sequencer.js';

var modalFrameId = '#modalTop';
var modalFormId = '#modalForm';
var audioKey = WcStorage.keys.audio;
var wafPlayer = new WebAudioFontPlayer();

var instruments = [];
// instrument class to be added into above array
function WcSynthInstrument(name, color, synth, osc) {
    this.name = name;
    this.color = color;
    this.synth = new Tone[synth]({
        oscillator: osc
    }).toMaster();
}
WcSynthInstrument.prototype = {
    constructor: WcSynthInstrument,
    play: function(note) {
        note = (note) ? note : 'C4';
        this.synth.triggerAttackRelease(note, '4n');
    },
    width: function(width) {
        // check oscillator is pulse
        if (this.synth.oscillator.type === 'pulse') {
            this.synth.oscillator.width = width;
        }
    }
}
instruments.push(new WcSynthInstrument("Sine", "red", 'Synth', { type: "sine" }));
instruments.push(new WcSynthInstrument("Square", "orange", 'Synth', { type: "square" }));
instruments.push(new WcSynthInstrument("Triangle", "yellow", 'Synth', { type: "triangle" }));
instruments.push(new WcSynthInstrument("Triangle", "green", 'Synth', { type: "sawtooth" }));
instruments.push(new WcSynthInstrument("Triangle", "blue", 'Synth', { type: "pulse" }));
instruments.push(new WcSynthInstrument("Triangle", "indigo", 'Synth', { type: "pwm" }));

function setupElements() {
    $('body')
        // add modal
        .append($('<div>', {"class": "modal fade", "tabindex": "-1", "role": "dialog", "id": modalFrameId.substr(1)})
            .append($('<div>', {"class": "modal-dialog", "role": "document"})
                .append($('<div>', {"class": "modal-content"})
                    .append($('<div>', {"class": "modal-header"})
                        .append($('<h5>', {"class": "modal-title"}).text("Create Instrument"))
                        .append($('<button>', {"class": "close", "type": "button", "data-dismiss": "modal", "aria-label": "Close"})
                            .append($('<span>', {"aria-hidden": "true"}).html("&times;"))
                        )
                    )
                    .append($('<div>', {"class": "modal-body"})
                        .append($('<div>', {"class": "container-fluid"})
                            .append($('<form>', {"id": modalFormId.substr(1)})
                                .append($('<div>', {"class": "form-group row"})
                                    .append($('<label>', {"class": "col-3 col-form-label", "for": "inputName"}).text("Name"))
                                    .append($('<input>', {"class": "col-9 form-control", "type": "text", "id": "inputName",
                                            "data-validation": "length", "data-validation-length": "1-128", "value": "New Instrument Name"})))
                                .append($('<div>', {"class": "form-group row", "id": "inputScale"})
                                    .append($('<label>', {"class": "col-3 col-form-label"}).text("Scale"))
                                    .append($('<div>', {"class": "col-3 form-check form-check-inline"})
                                        .append($('<input>', {"class": "form-check-input", "type": "radio", "name": "inputScaleBool", "id": "inputScaleTrue", "value": "true", "checked": true}))
                                        .append($('<label>', {"class": "form-check-label", "for": "inputScaleTrue"}).text("Tone")))
                                    .append($('<div>', {"class": "col-3 form-check form-check-inline"})
                                        .append($('<input>', {"class": "form-check-input", "type": "radio", "name": "inputScaleBool", "id": "inputScaleFalse", "value": "false"}))
                                        .append($('<label>', {"class": "form-check-label", "for": "inputScaleFalse"}).text("Drum")))
                                )
                                .append($('<div>', {"class": "form-group row"})
                                    .append($('<label>', {"class": "col-3 col-form-label", "for": "instSelectFamily"}).text("Family"))
                                    .append($('<div>', {"class": "col-9"})
                                        .append($('<select>', {"class": "form-control", "id": "instSelectFamily"}) // append options dynamic w.r.t. scale
                                )))
                                .append($('<div>', {"class": "form-group row"})
                                    .append($('<label>', {"class": "col-3 col-form-label", "for": "instSelect"}).text("Instrument"))
                                    .append($('<div>', {"class": "col-9"})
                                        .append($('<select>', {"class": "form-control", "id": "instSelect"}) // append options dynamic w.r.t. scale
                                )))
                                .append($('<div>', {"class": "form-group row"})
                                    .append($('<label>', { "class": "col-form-label col-3" }).text("Color "))
                                    .append($('<div>', { "class": "col-3" })
                                        .append($('<input>', { "class": "col-3", "type": "text", "id": "instColor" }))))                                
                                )))
                    .append($('<div>', {"class": "modal-footer"})
                        .append($('<button>', {"class": "btn btn-secondary", "type": "button", "data-dismiss": "modal"}).text("Cancel"))
                        .append($('<button>', {"class": "btn btn-primary", "type": "submit", "form": "modalForm"}).text("OK"))
                    )
                )
            )
        )
        /*
        .append($('<div>', {"class": "modal fade", "tabindex": "-1", "role": "dialog", "id": modalFrameId.substr(1)})
            .append($('<div>', {"class": "modal-dialog", "role": "document"})
                .append($('<div>', {"class": "modal-content"})
                    .append($('<div>', {"class": "modal-header"})
                        .append($('<h5>', {"class": "modal-title"}).text("Create Instrument"))
                        .append($('<button>', {"class": "close", "type": "button", "data-dismiss": "modal", "aria-label": "Close"})
                            .append($('<span>', {"aria-hidden": "true"}).html("&times;"))
                        )
                    )
                    .append($('<div>', {"class": "modal-body"})
                        .append($('<div>', {"class": "container-fluid"})
                            .append($('<form>', {"id": modalFormId.substr(1)})
                                .append($('<div>', {"class": "form-group row"})
                                    .append($('<label>', {"class": "col-3 col-form-label", "for": "inputName"}).text("Name"))
                                    .append($('<input>', {"class": "col-9 form-control", "type": "text", "id": "inputName",
                                            "data-validation": "length", "data-validation-length": "1-128", "value": "New Instrument Name"})))
                                .append($('<div>', {"class": "form-group row"})
                                    .append($('<label>', {"class": "col-3 col-form-label", "for": "instSelectType"}).text("Type"))
                                    .append($('<div>', {"class": "col-9"})
                                        .append($('<select>', {"class": "form-control", "id": "instSelectType"})
                                            .append($('<option>', { "value": "AMSynth" }).text("AM Synth")) // fixme: not understood...
                                            .append($('<option>', { "value": "DuoSynth" }).text("Duo Synth")) // fixme: not understood...
                                            .append($('<option>', { "value": "FMSynth" }).text("FM Synth")) // fixme: not understood...
                                            .append($('<option>', { "value": "MembraneSynth" }).text("Membrane Synth"))
                                            .append($('<option>', { "value": "MetalSynth" }).text("Metal Synth"))
                                            .append($('<option>', { "value": "MonoSynth" }).text("Mono Synth"))
                                            .append($('<option>', { "value": "NoiseSynth" }).text("Noise Synth"))
                                            .append($('<option>', { "value": "Synth", "selected": true }).text("Simple Synth"))
                                            .append($('<option>', { "value": "Player" }).text("Player")) // need URL for AudioBuffer param ...
                                )))
                                .append($('<div>', {"class": "form-group row"}) // !fixme: !todo: need dup of this for FM, AM, FAT, PWM, Pulse oscillator
                                    .append($('<label>', {"class": "col-3 col-form-label", "for": "shapeSelectType"}).text("Shape"))
                                    .append($('<div>', {"class": "col-9"})
                                        .append($('<select>', {"class": "form-control", "id": "shapeSelectType"})
                                            .append($('<option>', { "value": "sine", "selected": true }).text("Sine Wave"))
                                            .append($('<option>', { "value": "square" }).text("Square Wave"))
                                            .append($('<option>', { "value": "triangle" }).text("Triangle Wave"))
                                            .append($('<option>', { "value": "sawtooth" }).text("Sawtooth Wave"))
                                            .append($('<option>', { "value": "pwm" }).text("PWM Wave"))
                                            .append($('<option>', { "value": "pulse" }).text("Pulse Wave")) // !todo: need width settings
                                )))
                                .append($('<div>', {"class": "form-group row"})
                                    .append($('<label>', { "class": "col-form-label col-3" }).text("Color "))
                                    .append($('<div>', { "class": "col-3" })
                                        .append($('<input>', { "class": "col-3", "type": "text", "id": "instColor" }))))                                
                                )))
                    .append($('<div>', {"class": "modal-footer"})
                        .append($('<button>', {"class": "btn btn-secondary", "type": "button", "data-dismiss": "modal"}).text("Cancel"))
                        .append($('<button>', {"class": "btn btn-primary", "type": "submit", "form": "modalForm"}).text("OK"))
                    )
                )
            )
        )
        */
        // add audio functionalities
        .append($('<div>', {"class": "jumbotron jumbotron-fluid"})
            .append($('<div>', {"class": "container"})
                // !todo: think of making these upload/record/type into tabs.
                .append($('<form>', {"id": "audioEditorForm"})
                    .append($('<div>', {"class": "form-group row"})
                        .append($('<div>', {"class": "input-group"})
                            .append($('<i>', {"class": "fa fa-2x fa-upload mr-2"}))
                            // .append($('<i>', {"class": "fas fa-2x fa-file-upload mr-2"})) // need font-awesome 5
                            .append($('<input>', {"class": "form-control", "type": "file", "accept": "audio/*", "capture": true, "id": "audioInput", "value": "test"}))
                            .append($('<audio>', {"id": "audioPlayer", "controls": true })))
                    .append($('<div>', {"class": "form-group row"})
                        .append($('<div>', {"class": "input-group"})
                            .append($('<i>', {"class": "fa fa-2x fa-microphone mr-2"}))
                            .append($('<button>', {"class": "btn btn-secondary mr-2", "type": "button", "id": "startRecord"}).text("Start"))
                            .append($('<button>', {"class": "btn btn-secondary mr-2", "type": "button", "id": "stopRecord"}).text("Stop"))
                    ))))
                .append($('<hr>'))
                .append($('<div>', {"class": "container"})
                    // use pagination to add instruments
                    .append($('<nav aria-label="Instrument list">')
                        .append($('<ul>', {"class": "pagination", "id": "instrumentList"})
                            .append($('<li>', {"class": "page-item", "id": "addInstrument", "data-toggle": "tooltip", "title": "Add Instrument"})
                                    .append($('<a>', {"class": "page-link"})
                                        .append($('<i>', {"class": "material-icons"}).text('library_music').css({"color": "red"}))))
                            .append($('<li>', {"class": "page-item"})
                                    .append($('<a>', {"class": "page-link"})
                                        .append($('<i>', {"class": "material-icons"}).text('music_note'))))
                            .append($('<li>', {"class": "page-item"})
                                    .append($('<a>', {"class": "page-link"})
                                        .append($('<i>', {"class": "material-icons"}).text('music_note'))))
                            .append($('<li>', {"class": "page-item"})
                                    .append($('<a>', {"class": "page-link"})
                                        .append($('<i>', {"class": "material-icons"}).text('music_note'))))
                    ))
                //.append($('<canvas>', {"id": "pianoRollCanvas"}))
                .append($('<div>', {"id": "sequencerDiv"}))
                )));
}

function setSelectSoundFontFamily(isScalable) {
    var $select = $("#instSelectFamily");
    $select.empty();
    if (isScalable) {
        $select
            .append($('<option>', {"value": "Aspirin_sf2_file"}).text("Aspirin"))
            .append($('<option>', {"value": "Chaos_sf2_file"}).text("Chaos"))
            .append($('<option>', {"value": "FluidR3_GM_sf2_file"}).text("FluidR3 GM"))
            .append($('<option>', {"value": "GeneralUserGS_sf2_file"}).text("GeneralUserGS"))
            .append($('<option>', {"value": "JCLive_sf2_file"}).text("JCLive"))
            .append($('<option>', {"value": "SBLive_sf2"}).text("SBLive"))
            .append($('<option>', {"value": "SoundBlasterOld_sf2"}).text("SoundBlasterOld"))
        ;
    } else {
        $select
            .append($('<option>', {"value": "0_SBLive_sf2_file"}).text("SBLive"))
            .append($('<option>', {"value": "12_JCLive_sf2_file"}).text("JCLive 12"))
            .append($('<option>', {"value": "16_JCLive_sf2_file"}).text("JCLive 16"))
            .append($('<option>', {"value": "18_JCLive_sf2_file"}).text("JCLive 18"))
            .append($('<option>', {"value": "4_Chaos_sf2_file"}).text("Chaos"))
        ;
    }
}

function setSelectInstrument(isScalable) {
    var titles = (isScalable) ? wafPlayer.loader.instrumentTitles() : wafPlayer.loader.drumTitles();
    var $select = $("#instSelect");
    $select.empty();
    var init = (isScalable) ? 0 : 35;
    var pad = "000";
    for (var i = init; i < titles.length; i++) {
        var val = "" + i;
        if (isScalable) {
            val = pad.substring(0, pad.length - val.length) + val + '0';
        }
        $select.append($('<option>', {"value": val}).text(titles[i]));
    }
}

function inputScaleChange(ev) {
    var scalable = (this.value === "true") ? true : false;
    setSelectSoundFontFamily(scalable);
    setSelectInstrument(scalable);
}

function addInstClick() {
    $('#addInstrument').click(function(){
        $("#instColor").spectrum({
            color: 'black',
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
        $("#inputScaleTrue")[0].checked = true;
        $("#inputScaleTrue").change(inputScaleChange);
        $("#inputScaleFalse").change(inputScaleChange);
        setSelectSoundFontFamily(true);
        setSelectInstrument(true);
        $.validate({
            form: modalFormId,
            onError: function($form) {
                // alert("validation of form " + $form.attr('id') + " failed...");
                return false;
            },
            onSuccess: function($form) {
                var name = $('#inputName').val();
                var num = $('#instSelect').val();
                var family = $('#instSelectFamily').val();
                //var scale = $('inputScaleBool');
                var scale = $('#inputScaleTrue')[0].checked;
                var color = $('#instColor').val();
                //instruments.push(new WcSynthInstrument(name, color, inst, {'type': shape}));
                console.log("family: " + family + ", num: " + num + ", scale: " + scale + ", name: " + name + ", color: " + color);
                var variable = num + '_' + family;
                console.log(variable);
                musicSequencer.addInstrument(variable, name, color);
                // hide modal when onSuccess func is done.
                $(modalFrameId).modal('hide');
                updateInstIcons();
            },
            onValidate: function($form) {
                // console.log($form);
            },
            onElementValidate: function(valid, $el, $form, erroMsg)  {
                //console.log("input: " + $el.attr('name') + " is " + (valid ? "VALID" : "INVALID"));
            }
        });
        $(modalFrameId).modal({
            backdrop: true,
            keyboard: true,
            focus: true,
            show: true
        });
    });
}


function updateInstIcons() {
    $('#instrumentList').empty() // clear and add first add inst button on list
        .append($('<li>', {"class": "page-item", "id": "addInstrument", "data-toggle": "tooltip", "title": "Add Instrument"})
            .append($('<a>', {"class": "page-link"})
                .append($('<i>', {"class": "material-icons"}).text('library_music'))));
    addInstClick();
    var insts = musicSequencer.getInstruments();
    for (var i = 0; i < insts.length; i++) {
        var inst = insts[i];
        $('#instrumentList')
            .append($('<li>', {"class": "page-item", "id": "instNumber" + i, "data-toggle": "tooltip", "title": inst.name})
                .append($('<a>', {"class": "page-link"})
                    .append($('<i>', {"class": "material-icons"}).css({'color': inst.color}).text('music_note'))));
            $('#instNumber' + i).click(function(){
                var idx = this.id.substr('#instNumber'.length - 1);
                var inst = musicSequencer.getInstruments()[idx];
                inst.play('C4');
            });
    }
    // enable tooltips
    $('[data-toggle="tooltip"]').tooltip();
}

function setupFileUpdator() {
    $('#audioInput').change(function(ev) {
        var file = ev.target.files[0];
        if (!(file instanceof File)) {
            console.error("Not a file: " + file);
        } else if (file.type.indexOf('audio') === -1) {
            console.error("Not an audio file: " + file);
        } else {
            var src = window.URL.createObjectURL(file);
            $('#audioPlayer').attr("src", src);
        }
    });
}

// Hey, Tone.js has UserMedia. think of using that...
var audioCtx;
var recorder;
function setupRecording() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
        window.URL = window.URL || window.webkitURL;
        audioCtx = new AudioContext;
    } catch(e) {
        alert("No web audio support available in this browser..");
    }
    navigator.getUserMedia({audio: true},
        function(stream) { // success callback
            var src = audioCtx.createMediaStreamSource(stream);
            recorder = Recorder(src);
        },
        function(ev) { // error callback
            console.error("No live audio input: " + ev);
        }
    );

    $('#startRecord').click(function(){
        if (!recorder) {
            return;
        }
        recorder.record();
        // toggle disabled
        $(this).addClass("disabled").attr("disabled", true);
        $('#stopRecord').attr("disabled", false).removeClass("disabled");
    });

    $('#stopRecord').click(function(){
        if (!recorder) {
            return;
        }
        recorder.stop();
        recorder.exportWAV(function(blob) {
            var url = URL.createObjectURL(blob);
            console.log(url);
            // Recorder.forceDownload(blob, filename)
        });
        // or use recorder.getBuffer() to pass data to storage ?
        recorder.clear();
        // toggle disabled
        $(this).addClass("disabled").attr("disabled", true);
        $('#startRecord').attr("disabled", false).removeClass("disabled");
//        $('#downloadRecord').show();
    });

    // disable Stop button
    $('#stopRecord').addClass("disabled").attr("disabled", true);

}

function setupInstrument() {
    // updateInstIcons();
    // dont reload page when OK is pressed in modal dialog
    $(modalFormId).submit(function(e) {
        e.preventDefault();
        return false;
    });
}

var player;
var instMidi;
function setupSoundFont() {
    player = new WebAudioFontPlayer();
    if (!audioCtx) {
        // better get it through Tone...
        //var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
        //audioCtx = new AudioContextFunc();
        audioCtx = Tone.context;
    }
    //player.loader.decodeAfterLoading(audioCtx, '_tone_0060_SoundBlasterOld_sf2');
    var ikeys = player.loader.instrumentKeys();
    //console.log(ikeys);
    var dkeys = player.loader.drumKeys();
    //console.log(dkeys);
    //var iinfo = player.loader.instrumentInfo(777); // flute pipe
    var iinfo = player.loader.instrumentInfo(1); // piano
    console.log(iinfo);
    player.loader.startLoad(audioCtx, iinfo.url, iinfo.variable);
    player.loader.waitLoad(function() {
        instMidi = window[iinfo.variable];
        console.log("variable in window:");
        console.log(instMidi);
        //console.log(instMidi.zones[0].sample);
        //console.log(atob(instMidi.zones[0].sample).length);

        var zone = instMidi.zones[0];
        var pitch = 60;
        var baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune;
        //console.log("baseDetune: " + baseDetune + ", ex: " + ((100.0 * pitch - baseDetune) / 1200.0));
        var playbackRate = 1.0 * Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0);
        //console.log("playbackRate: " + playbackRate);
        //console.log("pow(2,3): " + Math.pow(2,3));

        var origKey = 89; // piano 89th key, "C8"

        if (false) {
        player.cancelQueue(audioCtx);
        //player.queueWaveTable(audioCtx, audioCtx.destination, instMidi, 1, 60, 1, 0.9);
        player.queueWaveTable(audioCtx, audioCtx.destination, instMidi, 1, pitch, 1, 0.9);
        } else {
            // use Tone.js
            var urls = {};
            for (var idx in instMidi.zones) {
                urls[parseInt(instMidi.zones[idx].originalPitch / 100)] = instMidi.zones[idx].buffer;
            }
            console.log(urls);
            var envelope = new Tone.Envelope({
                'attack': 0.05,
                'decay' : 0.1,
                'sustain': 0.7,
                'release': 1,
                'attackCurve': 'linear',
                'releaseCurve': 'exponential'
            });
//            console.log(envelope);
            var inst = new Tone.Sampler(urls, {
                'onload': function() { console.log(inst); },  // undefined ? why?
                'attack': 0.005,
                'release': 2, // humm, not working?
            });
//            inst.connect(envelope);
//            envelope.toMaster();
            inst.toMaster();
            console.log(inst);
            //inst.triggerAttackRelease('C4'); // humm, cut off happens... emvelope? slicing ?
            // maybe this: https://github.com/Tonejs/Tone.js/issues/373 ?
            inst.triggerAttackRelease('C4', 10, Tone.now(), 0.9);


            var synth = new Tone.Synth().toMaster();
            console.log(synth);
            //synth.triggerAttackRelease('C4'); // OK
        }
    });

}

var musicSequencer;
function setupSequencer() {
    musicSequencer = new WcSequencer();
    musicSequencer.setup();
    musicSequencer.addTrack();
    // add default harpsichord, flute
    musicSequencer.addInstrument('0060_FluidR3_GM_sf2_file', "Harpsichord", "#f00");
    musicSequencer.addInstrument('0730_Aspirin_sf2_file', "Flute", "#ff8000");
    var div = musicSequencer.view();
    $('#sequencerDiv').append(div);
    updateInstIcons();
}

function setup() {
    // add elements
    setupElements();
    WcStorage.setup();
    setupFileUpdator();
    //setupRecording(); // get error GET recorderWorker.js not found...
    setupInstrument();
    setupSoundFont();
    setupSequencer();

}

// entry point
setup();
console.log("setup audio html done.");
