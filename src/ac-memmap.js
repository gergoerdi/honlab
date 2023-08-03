function ac_memory_map(video, keystate) {
    const rom = new Uint8Array(files["data/ac-rom.bin"].slice());
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
        const read = (addr) => 0xff;
        const write = (addr, val) => {};
        return {read, write};
    }();

    return [
        { lim: 0x2000, unit: mk_rom(rom) },
        { lim: 0x3800, unit: unconnected(0xff) },
        { lim: 0x3a00, unit: unconnected(0x00) }, // TODO
        { lim: 0x3b00, unit: keyboard },
        { lim: 0x4000, unit: unconnected(0x00) }, // TODO
        { lim: 0x8000, unit: mk_ram(ram) },
        { lim: 0xc000, unit: unconnected(0xff) },
        { lim: 0xc400, unit: mk_ram(video.vram) },
        { unit: unconnected(0xff) },
    ];
}
