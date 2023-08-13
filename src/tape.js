const deck = (() => {
    let tape = null;
    let playing = false;
    let recording = false;

    let tick_cb = () => {};
    let load_cb = () => {};
    let play_cb = () => {};
    let record_cb = () => {};

    return {
        load_tape: (new_tape) => { tape = new_tape; playing = false; play_cb(); load_cb(new_tape); },

        play: (new_playing) => { playing = tape && new_playing; play_cb(); },
        record: (new_recording) => { recording = (tape && new_recording); record_cb(); },
        rewind: () => { playing = false; if (tape) tape.rewind(); play_cb(); tick_cb(); },
        is_playing: () => playing,
        is_recording: () => recording,

        get_cnt: () => tape ? tape.get_cnt() : 0,
        get_size: () => tape ? tape.get_size() : 0,

        tick: (dcnt) => { if (playing && tape) { tape.tick(dcnt, recording); tick_cb(); }; },
        read: () => tape && tape.read(),
        write: () => { if (tape && recording) tape.write() },

        on_tick: (cb) => { tick_cb = cb; },
        on_load: (cb) => { load_cb = cb; },
        on_play: (cb) => { play_cb = cb; },
        on_record: (cb) => { record_cb = cb; },
    };
})();

const tape_from_file = async (url) => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();

    const response = await fetch(url);
    const buf = await audioCtx.decodeAudioData(await response.arrayBuffer());

    const ratio = cpu_freq / buf.sampleRate;
    const len = buf.length;
    const chan = buf.getChannelData(0);

    let cnt = 0;
    let sample = false;

    return {
        get_cnt: () => cnt,
        get_size: () => len * ratio,

        tick: (dcnt, recording) => {
            cnt = Math.min(len * ratio, cnt + dcnt);
            const i = Math.floor(cnt / ratio);
            sample = chan[i] > 0.03;
        },
        write: () => { }, // TODO
        read: () => sample,
        rewind: () => { cnt = 0; },
    };
};

const empty_tape = () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();

    const sample_rate = 48_000;
    const ratio = cpu_freq / sample_rate;

    let len = 0;
    let cnt = 0;
    let ringing = false;

    let buf = new Uint8Array(128);
    let sample = false;

    console.log(ratio);

    return {
        get_cnt: () => cnt,
        get_size: () => len * ratio ,
        rewind: () => { cnt = 0; },

        render: () => {
            const abuf = audioCtx.createBuffer(1, buf.length, sample_rate);
            const chan = abuf.getChannelData(0);

            for (let i = 0; i < buf.length; ++i)
            {
                chan[i] = buf[i] ? 0.9 : -0.1;
            }

            return audioBufferToWav(abuf);
        },

        read: () => sample,

        write: () => {
            ringing = ratio;
        },

        tick: (dcnt, recording) => {
            const prev_cnt = cnt;

            cnt += dcnt;
            if (recording)
                len = Math.max(len, Math.floor(cnt / ratio));
            else
                cnt = Math.min(len * ratio, cnt);

            const i = Math.floor(cnt / ratio);
            sample = (i < buf.length) ? (buf[i] != 0) : false;

            if (ringing) {
                if (i >= buf.length) {
                    const new_buf = new Uint32Array(Math.max(buf.length * 2, i + 1));
                    new_buf.set(buf, 0);
                    buf = new_buf;
                }

                const ringing_len = Math.min(ringing, dcnt);
                for (let dt = 0; dt < ringing_len; ++dt) {
                    const j = Math.floor((prev_cnt + dt) / ratio);
                    buf[j] = 0xff;
                }
                ringing -= ringing_len;
            }
        },

    };
};
