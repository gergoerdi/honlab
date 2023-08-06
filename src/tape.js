const deck = (() => {
    let tape = null;

    return {
        get_cnt: () => tape.get_cnt(),
        load_tape: (new_tape) => { tape = new_tape; },
        tick: (dcnt) => { if (tape) tape.tick(dcnt); },
        read: () => tape && tape.read(),
    };
})();
