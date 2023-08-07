const tape_btn_play = document.getElementById("tape-btn-play");
const tape_btn_rewind = document.getElementById("tape-btn-rewind");
const tape_btn_eject = document.getElementById("tape-btn-eject");
const tape_btn_record = document.getElementById("tape-btn-record");
const tape_range =  document.getElementById("tape-range");
const tape_monitor = document.getElementById("tape-monitor");

async function eject() {
    const filename = "image/hl2/bombazo_a16.wav";
    let tape = await tape_from_file(filename);
    deck.load_tape(tape);
}

const setupTape = (deck) => {

    deck.on_play(() => {
        const icon = document.createElement("i");
        icon.classList.add("bi");
        icon.classList.add(deck.is_playing() ? "bi-pause-fill" : "bi-play-fill");
        
        tape_btn_play.replaceChildren(icon);
    });
    
    tape_btn_play.onclick = () => {
        deck.play(!deck.is_playing());
    };

    tape_btn_rewind.onclick = () => {
        deck.rewind();
    };

    tape_btn_eject.onclick = () => {
        eject();
    };

    tape_range.min = 0;
    tape_range.max = deck.get_size();

    deck.on_load(() => {
        tape_range.max = deck.get_size();
    });
    
    let tape_bit = false;
    function blinkTape(t) {
        requestAnimationFrame(blinkTape);

        tape_range.value = deck.get_cnt();
        
        const red = "#dc3545";
        const orange="#fd7e14";
        const teal="#20c997";
        const green = "#198754";
        
        const recording = false; // tape_btn_record.checked;
        const color1 = recording ? red : green;
        const color2 = recording ? orange : teal;
    
        tape_monitor.style.background = deck.read() ? color1 : color2;
        
    }
    requestAnimationFrame(blinkTape);
};
