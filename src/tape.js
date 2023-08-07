const deck = (() => {
    let tape = null;
    let playing = false;

    let tick_cb = () => {};
    let load_cb = () => {};
    let play_cb = () => {};
    
    return {
        load_tape: (new_tape) => { tape = new_tape; playing = false; play_cb(); load_cb(); },

        play: (new_playing) => { playing = tape && new_playing; play_cb(); },
        rewind: () => { playing = false; if (tape) tape.rewind(); play_cb(); tick_cb(); },
        is_playing: () => playing,

        get_cnt: () => tape ? tape.get_cnt() : 0,
        get_size: () => tape ? tape.get_size() : 0,

        tick: (dcnt) => { if (playing && tape) { tape.tick(dcnt); tick_cb(); }; },
        read: () => tape && tape.read(),

        on_tick: (cb) => { tick_cb = cb; },
        on_load: (cb) => { load_cb = cb; },
        on_play: (cb) => { play_cb = cb; },
    };
})();

async function tape_from_file(url) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();

    const response = await fetch(url);
    const buf = await audioCtx.decodeAudioData(await response.arrayBuffer());

    const ratio = cpu_freq / buf.sampleRate;
    const len = buf.length;
    const chan = buf.getChannelData(0);

    let cnt = 0;
    let sample = 0.0;

    return {
        get_cnt: () => cnt,
        get_size: () => len * ratio,

        tick: (dcnt) => {
            cnt = cnt + dcnt;
            const i = Math.min(len, Math.floor(cnt / ratio));
            sample = chan[i] > 0.03;
        },
        read: () => sample,
        rewind: () => { cnt = 0; },
    };
};
