const tape_btn_play = document.getElementById("tape-btn-play");
const tape_btn_rewind = document.getElementById("tape-btn-rewind");
const tape_btn_eject = document.getElementById("tape-btn-eject");
const tape_btn_record = document.getElementById("tape-btn-record");
const tape_range =  document.getElementById("tape-range");
const tape_monitor = document.getElementById("tape-monitor");

const setupTape = (deck) => {
    const set_enable = (enable, tape_loaded) => {
        tape_btn_eject.disabled = !enable;

        const size = deck.get_size();
        for (let ctl of [tape_btn_play, tape_btn_rewind, tape_btn_record]) {
            ctl.disabled = !(enable && tape_loaded);
        }
    };

    tape_filesel.addEventListener("tape_selected", async (e) => {
        const tape = e.detail;

        set_enable(false);
        deck.load_tape(tape);
    });

    const eject = async () => {
        tape_filesel.showModal();
    };

    deck.on_play(() => {
        const icon = document.createElement("i");
        icon.classList.add("bi");
        icon.classList.add(deck.is_playing() ? "bi-pause-fill" : "bi-play-fill");

        tape_btn_play.replaceChildren(icon);
    });
    deck.on_record(() => {
        tape_btn_record.checked = deck.is_recording();
    })

    tape_btn_play.onclick = () => {
        deck.play(!deck.is_playing());
        if (!deck.is_playing())
            deck.record(false);
    };

    tape_btn_rewind.onclick = () => {
        deck.rewind();
    };

    tape_btn_eject.onclick = () => {
        eject();
    };
    tape_btn_record.onchange = () => {
        deck.record(tape_btn_record.checked);
    }

    tape_range.min = 0;

    const load_cb = (tape) => {
        set_enable(true, tape != null);
    };
    deck.on_load(load_cb);
    load_cb(null);

    let tape_bit = false;
    const blinkTape = (t) => {
        requestAnimationFrame(blinkTape);

        tape_range.max = deck.get_size();
        tape_range.value = deck.get_cnt();

        const red = "#dc3545";
        const orange="#fd7e14";
        const teal="#20c997";
        const green = "#198754";

        const recording = deck.is_recording();
        const color1 = recording ? red : green;
        const color2 = recording ? orange : teal;

        tape_monitor.style.background = deck.read() ? color1 : color2;
    };
    requestAnimationFrame(blinkTape);
};
