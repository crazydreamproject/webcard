/*!
 * WebCard WcSound class
 */

import Tone from 'tone';

var synth, gain;

// singleton
var soundInstance;
function WcSound() {
    if (typeof soundInstance === "object") {
        return soundInstance;
    }
    soundInstance = this;
}
WcSound.prototype = {
    constructor: WcSound,
    setup: function() {
        synth = new Tone.Synth().toMaster();
        gain =  new Tone.Gain();
        gain.toMaster();
        synth.connect(gain);
    },
    volume: function(vol) {
        //gain.gain = vol;
        // use Tone.Volume
    },
    beep: function(count) {
        var notes = [];
        // create melody data
        for (var i = 0; i < count; i++) {
            notes.push('C4');
        }
        // maybe close to beep sound? need check if there is better one.
        synth.oscillator.type = 'amtriangle';
        var seq = new Tone.Sequence(function(time, note) {
            synth.triggerAttackRelease(note, '4n', time);
        }, notes, '2n');
        seq.loop = false;
        seq.start();
        Tone.Transport.start();
        return;
    }
}

soundInstance = new WcSound;

export default soundInstance;
