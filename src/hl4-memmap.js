const unconnected = {
    read: (addr) => 0x00,
    write: (addr, val) => {}
};

const mk_ram = (buf) => ({
    read: (addr) => buf[addr],
    write: (addr, val) => { buf[addr] = val; }
});

const mk_rom = (buf) => ({
    read: (addr) => buf[addr],
    write: (addr, val) => {}
});

function hl4_memory_map(video) {
    const rom = new Uint8Array(files["data/hl4-rom.bin"].slice());
    const ram = new Uint8Array(0x4000);

    const peripherals = function(){
        function read(addr) {
            const poke = addr & 0x80;
            addr &= 0x1f;

            switch (addr) {
            case 0x02:
                if (video.drawing()) {
                    // console.log("video sync");
                    return 0x00 | 0x0e;
                } else {
                    return 0x01 | 0x0e;
                }
            case 0x03:
                return 0x0f; // TODO: tape
            default:
                // addr = addr.toString(16);
                // if (!poke) { console.log("mem_read IO", addr) };
                return 0x0f; // TODO: keyboard input
            }
        };

        function write(addr, val) {
        };

        return { read, write };
    }();

    return [
        { lim: 0x4000, unit: mk_rom(rom) },
        { lim: 0x8000, unit: mk_ram(ram) },
        { lim: 0xe000, unit: unconnected },
        { lim: 0xe800, unit: peripherals },
        { lim: 0xf000, unit: peripherals },
        { lim: 0xf800, unit: mk_ram(video.vram) },
        { unit: mk_ram(video.vram) }
    ];
}
