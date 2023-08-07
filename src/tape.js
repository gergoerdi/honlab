const deck = (() => {
    let tape = null;

    return {
        get_cnt: () => tape.get_cnt(),
        load_tape: (new_tape) => { tape = new_tape; },
        tick: (dcnt) => { if (tape) tape.tick(dcnt); },
        read: () => tape && tape.read(),
    };
})();

async function tape_from_file(url) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();

    const response = await fetch(url);
    const buf = await audioCtx.decodeAudioData(await response.arrayBuffer());

    const ratio = cpu_freq / buf.sampleRate;
    const chan = buf.getChannelData(0);

    let cnt = 0;
    let sample = 0.0;

    return {
        get_cnt: () => cnt,

        tick: (dcnt) => {
            cnt += dcnt;
            const i = Math.floor(cnt / ratio);
            sample = chan[i] > 0.03;
        },
        read: () => sample
    };
};
