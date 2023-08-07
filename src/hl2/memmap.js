function hl2_memory_map(video, keystate, deck) {
    const rom = new Uint8Array(files["data/hl2/rom.bin"].slice());
    const ram = new Uint8Array(0x4000);

    const highio = function(){
        const read = (addr) => {
            console.log(addr.toString(16));
            return 0x00;
        };
        const write = (addr, val) => {
            console.log(addr.toString(16));
        };
        return {read, write};
    }();

    const keyboard = function(){
        const read = (addr) => keyboard_byte(keystate, addr);
        const write = (addr, val) => {};
        return {read, write};
    }();

    const video_on = {
        read: (addr) => { return 0x00; },
        write: (addr, val) => { video.on(); }
    };

    const video_off = {
        read: (addr) => { return 0x00; },
        write: (addr, val) => { video.off(); }
    };

    const tape_in = {
        read: (addr) =>
            video.is_running() ? 0xff :
            deck.read() ? 0x37 :
            0x00,
        write: (addr, val) => {}
    };

    return [
        { lim: 0x2000, unit: mk_rom(rom) },
        { lim: 0x3800, unit: unconnected(0xff) },
        { lim: 0x3a00, unit: trace_mem("hw-3800", unconnected(0x00), false) }, // TODO: reset key
        { lim: 0x3b00, unit: keyboard },
        { lim: 0x3e00, unit: trace_mem("hw-3b00", unconnected(0x00), false) }, // TODO
        { lim: 0x3f00, unit: video_off },
        { lim: 0x4000, unit: video_on },
        { lim: 0x8000, unit: mk_ram(ram) },
        { lim: 0xc000, unit: unconnected(0xff) },
        { lim: 0xc400, unit: video.vram },
        { lim: 0xe000, unit: trace_mem("hw-c400", unconnected(0xff), false) },
        { unit: tape_in },
    ];
}
