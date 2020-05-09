// piano roll view sequencer for audio.html

import Tone from 'tone';
import WebAudioFont from 'webaudiofont';

// some helpers
var audioCtx = Tone.context;

var pianoKeyRange; // array range from 'C0', ... to 'B6'
(function createPianoKeyRange() {
    var keys = "C,C#,D,D#,E,F,F#,G,G#,A,A#,B";
    var octaves = 7;
    var range = Array.apply(null, {length: octaves}).map(Number.call, Number).map(function(oct) {
        return keys.split(',').map(function(key) { return key + oct; });
    });
    pianoKeyRange = [].concat.apply([], range);
})();


// note class c.f.: https://github.com/Tonejs/Tone.js/wiki/Time
// offset: string, from start, in BAR:QUARTER:16TH eg: "4:3:2" (see Tone.js Transport Time)
// pitch: string, in pitch-octave notation, eg: 'C4'
// duration: string, Tone.Time value (like Tone.Time("4n") for a quarter note) 

function WcNote(offset, pitch, duration) {
    this.offset_ = offset;
    this.pitch_ = pitch;
    this.duration_ = duration;
    // velocity
}
WcNote.prototype = {
    constructor: WcNote,
    // get, set
    offset: function(val) {
        if (!val) {
            return this.offset_;
        } else {
            this.offset_ = val;
        }
    },
    pitch: function(val) {
        if (!val) {
            return this.pitch_;
        } else {
            this.pitch_ = val;
        }
    },
    duration: function(val) {
        if (!val) {
            return this.duration_;
        } else {
            this.duration_ = val;
        }
    }
};

var wafPlayer = new WebAudioFontPlayer();
// key: string, variable in WebAudioFont, in instrumentKeys()/drumKeys() element. e.g: '0000_Aspirin_sf2_file'
function WcInstrument(key, name, color) {
    this.name = name;
    this.color = color;
    this.variable = key; // here, "_tone_" or "_drum_" prefix is omitted (i.e. can't use directly in wafPlayer.loader)
    this.preset = null;
}
WcInstrument.prototype = {
    constructor: WcInstrument,
    // get, set
    variable: function(val) {
        if (!val) {
            return this.variable;
        } else {
            this.variable = val;
        }
    },
    info: function() {
        if (!this.variable) {
            return null;
        }
        var instList = wafPlayer.loader.instrumentKeys();
        var idx = instList.indexOf(this.variable);
        if (idx !== -1) {
            return wafPlayer.loader.instrumentInfo(idx);
        }
        var drumList = wafPlayer.loader.drumKeys();
        idx = drumList.indexOf(this.variable);
        if (idx !== -1) {
            return wafPlayer.loader.drumInfo(idx);
        }
        // todo: should not reach here. variable not found. internal error.
        return null;
    },
    load: function() {
        if (!this.variable) {
            return;
        }
        var data = this.info();
        if (!data) {
            return;
        }
        wafPlayer.loader.startLoad(audioCtx, data.url, data.variable);
        var me = this;
        wafPlayer.loader.waitLoad(function(){
            me.preset = window[data.variable];
        });
    },
    loaded: function() {
        // simpler way
        return (this.preset) ? true: false;
        //return wafPlayer.loader.loaded(this.info().variable);
    },
    play: function(pitch) { // simple ver for checking sound
        console.log(pitch);
    }
};

function drawPianoKeys(ctx, width, height, pianoKeys) {
    var keyWidth = width;
    var keyHeight = height;
    var keys = ctx.canvas.height / keyHeight;
    var highestKey = 64; // todo fixme: ad-hoc value.
    ctx.save();
    for (var y = 0; y < keys; y++) {
        var keyName = pianoKeyRange[highestKey - y];
        var isWhiteKey = !(keyName.match(/#/)); // not containing sharp char
        // draw sequence lane area
        ctx.save();
        var laneWidth = ctx.canvas.width - keyWidth;
        ctx.strokeStyle = 'gray';
        ctx.setLineDash([4,2]);
        ctx.strokeRect(keyWidth + 1, y * keyHeight, laneWidth, keyHeight);
        ctx.fillStyle = isWhiteKey ? 'white' : 'whitesmoke';
        ctx.fillRect(keyWidth + 1, y * keyHeight, laneWidth, keyHeight);
        ctx.restore();
        // draw piano key area
        ctx.strokeStyle = 'black';
        ctx.strokeRect(0, y*keyHeight, keyWidth, keyHeight);
        ctx.fillStyle = isWhiteKey ? 'white' : 'black';
        ctx.fillRect(0, y*keyHeight, keyWidth, keyHeight);
        // update key info
        pianoKeys.push({
            key: keyName,
            rect: {
                x: 0, y: y*keyHeight, width: keyWidth, height: keyHeight
            }
        });
        // only put key text on white key
        if (isWhiteKey) {
            ctx.fillStyle = 'black';
            ctx.font = '6px Arial';
            ctx.fillText(keyName, keyWidth - 20, (y+1)*keyHeight - 2);
        }
    }
    ctx.restore();
}

function xyInRect(x, y, rect) {
    var left = rect.x;
    var right = left + rect.width;
    if (x < left || x > right) {
        return false;
    }
    var top = rect.y;
    var bottom = top + rect.height;
    if (y < top || y > bottom) {
        return false;
    }
    return true;
}
// todo: think of using getBoundingClientRect
function canvasMouseDown(ev) {
    var rect = this.getBoundingClientRect();
    var x = parseInt(ev.pageX - rect.left);
    var y = parseInt(ev.pageY - rect.top);

    console.log('x:' + x + ',y:' + y);
//    console.log(ev.data);
    // play key if in piano key area
    var keys = ev.data.pianoKeyRects;
    for (var i = 0; i < keys.length; i++) {
        if (xyInRect(x,y,keys[i].rect)) {
            console.log("inside key" + keys[i].key);
            //break;
            return;
        }
    }
    // prepare to draw notes in lane area
    ev.data.isMousePressed = true;
}
function canvasMouseMove(ev) {
    if (!ev.data.isMousePressed) {
        return;
    }
    var rect = this.getBoundingClientRect();
    var x = parseInt(ev.pageX - rect.left);
    var y = parseInt(ev.pageY - rect.top);
    console.log("moving: x:" + x + ',y:' + y);
}
function canvasMouseUp(ev) {
    console.log("up");
    ev.data.isMousePressed = false;
}
function canvasMouseEnter(ev) {
    console.log("enter");
}
function canvasMouseLeave(ev) {
    console.log("leave");
    ev.data.isMousePressed = false;
}
function canvasMouseOver(ev) {
    // do nothing. mouseenter will do.
}
function canvasMouseOut(ev) {
    // do nothing. mouseleave will do.
}
// visual piano roll for one track
function WcPianoRoll() {
    this.canvas = $('<canvas>'/*, {'width': 640, 'height': 240}*/);
    this.canvas.css({'background-color': 'white' /*, 'width': '640px', 'height': '240px' */});
    this.context = this.canvas[0].getContext('2d');
    this.pianoKeyWidth = 48;
    this.pianoKeyHeight = 10;
    this.pianoKeyRects = [];
    this.isMousePressed = false;
    this.setEvents();
}
WcPianoRoll.prototype = {
    constructor: WcPianoRoll,
    resize: function(w,h) {
        //this.canvas.attr('width', w);
        //this.canvas.attr('height', h);
        this.canvas[0].width = w;
        this.canvas[0].height = h;
        this.canvas.css({width: w + 'px', height: h + 'px', display: 'block' /*, 'image-rendering':'crisp-edges' */});
        this.context.clearRect(0, 0, w, h);
        this.draw();
    },
    draw: function() {
        // draw dotted rects
        var ctx = this.context;
        /*tests
        ctx.save();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(128,128,128,1.0)';
        ctx.setLineDash([4,2,1,2]);
        ctx.lineDashOffset = 0;
        ctx.strokeRect(0,0,31,31);
        ctx.setLineDash([]);
        ctx.strokeRect(64,2,1,1);
        ctx.strokeRect(0,64,64,10);
        ctx.restore();
        */
        // empty array first
        this.pianoKeyRects.splice(0, this.pianoKeyRects.length);
        drawPianoKeys(ctx, this.pianoKeyWidth, this.pianoKeyHeight, this.pianoKeyRects);
    },
    setEvents: function() {
        this.canvas.mousedown(this, canvasMouseDown);
        this.canvas.mouseup(this, canvasMouseUp);
        this.canvas.mousemove(this, canvasMouseMove);
        this.canvas.mouseenter(this, canvasMouseEnter);
        this.canvas.mouseleave(this, canvasMouseLeave);
        this.canvas.mouseover(this, canvasMouseOver);
        this.canvas.mouseout(this, canvasMouseOut);
    },
    view: function() {
        return this.canvas;
    }
};

// track class, to hold one instrument and a sequence of note
function WcTrack(width, height) {
    this.width = width;
    this.height = height;
    this.instrument = null; // one of instrument in sequencer.instruments
    this.notes = [];
    this.roll = new WcPianoRoll();
    this.roll.resize(width, height);
}
WcTrack.prototype = {
    constructor: WcTrack,
    instrument: function(val) {
        if (!val) {
            return this.instrument;
        } else {
            this.instrument = val;
        }
    },
    resize: function(w, h) {
        this.width = w;
        this.height = h;
        this.roll.resize(w, h);
    },
    view: function() {
        return this.roll.view();
    },
    notes: function(val) {
        if (!val) {
            return this.notes;
        } else {
            this.notes = val; // todo: be sure it is array
        }
    }
};

function WcSequencer() {
    // setup default values
    this.bpm = 120;
    this.tracks = [];
    this.instruments = [];
    this.trackWidth = 640;
    this.trackHeight = 240;
}
WcSequencer.prototype = {
    constructor: WcSequencer,
    setup: function(args) {
        //wafPlayer = new WebAudioFontPlayer();
        if (!args) return;
        this.bpm = (args['bpm']) ? args['bpm'] : this.bpm;
        this.trackWidth = (args['width']) ? args['width'] : this.trackWidth;
        this.trackHeight = (args['height']) ? args['height'] : this.trackHeight;
    },
    addTrack: function() {
        var track = new WcTrack(this.trackWidth, this.trackHeight);
        this.tracks.push(track);
    },
    getTracks: function() {
        return this.tracks;
    },
    delTrack: function(track) {
        var idx = this.tracks.indexOf(track);
        if (idx < 0) {
            return;
        }
        this.tracks.splice(idx, 1);
    },
    resizeTracks: function(width, height) {
        this.trackWidth = width;
        this.trackHeight = height;
        // adjust current track width/height
        for (var i = 0; i < this.tracks.length; i++) {
            var track = this.tracks[i];
            track.resize(width, height);
        }
    },
    addInstrument: function(variable, name, color) {
        var inst = new WcInstrument(variable, name, color);
        inst.load();
        this.instruments.push(inst);
    },
    getInstruments: function() {
        return this.instruments;
    },
    delInstrument: function(inst) {
        var idx = this.instruments.indexOf(inst);
        if (idx < 0) {
            return;
        }
        this.instruments.splice(idx, 1);
    },
    setInstrument: function(inst, track) { // both args should be element of this tracks/instruments
        track.instrument = inst;
    },
    bpm: function(val) {
        if (!val) {
            return this.bpm;
        } else {
            this.bpm = val;
        }
    },
    view: function() {
        var frame = $('<div>');
        //frame.css({width: '100%', height: '100%'});
        for (var i = 0; i < this.tracks.length; i++) {
            var track = this.tracks[i];
            frame.append(track.view());
        }
        return frame;
    },
};

export default WcSequencer;