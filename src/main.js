let verbose = false;

function init_core(video) {
    const rom = new Uint8Array(files["data/hl4-rom.bin"].slice());
    const ram = new Uint8Array(0x4000);

    function mem_read (addr) {
        if (addr < 0x4000) {
            return rom[addr & 0x3fff];
        } else if (addr < 0x8000) {
            return ram[addr & 0x3fff];
        } else if (addr < 0xe000) {
            return 0;
        } else if (addr < 0xf000) {
            const poke = addr & 0x80;
            addr &= 0x7f;
            if (verbose) {
                let keyb = addr.toString(16);
                console.log("keyb", keyb);
            }
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
                addr = addr.toString(16);
                // if (!poke) { console.log("mem_read IO", addr) };
                return 0x0f; // TODO: keyboard input
            }
        } else {
            addr &= 0x07ff;
            return video.vram[addr];
        }
    };

    function mem_write(addr, val) {
        if (addr < 0x4000) {
        } else if (addr < 0x8000) {
            ram[addr & 0x3fff] = val;
        } else if (addr < 0xe000) {
        } else if (addr < 0xf000) {
            addr &= 0x7f;

            // addr = addr.toString(16);
            // val = val.toString(16);
            // console.log("mem_write IO", {addr, val});
        } else {
            addr &= 0x07ff;
            video.vram[addr] = val;
        }
    };

    function io_read(port) {
        port &= 0xff;
        
        // port = port.toString(16);
        // console.log("io_read", port);
        return 0;
    }

    function io_write(port, val) {
        port &= 0xff;
        
        // port = port.toString(16);
        // val = val.toString(16);
        // console.log("io_write", { port, val });
    };

    return {
        mem_read,
        mem_write,
        io_read,
        io_write
    };
}

const vram = new Uint8Array(0x0800);
const video = function(vram) {
    let locked = false;

    function lock() {
        locked = true;
    };

    function unlock() {
        locked = false;
    };
    
    function drawing() {
        return locked;
    }
    return { lock, unlock, drawing, vram };
}(vram);

const core = init_core(video);
const cpu = Z80(core);

const fps = 50;
const cpu_freq = 4 * 1000 * 1000;

function test() {
    for (let i = 0; i < 3 * fps; ++i)
    {
        console.log("frame", i);

        video.unlock();
        run(cpu_freq / fps / 2);

        video.lock();
        run(cpu_freq / fps / 2);
    }
}

function run(lim, trace) {
    let cnt = 0;
    while (true) {
        cnt += cpu.run_instruction();
        if (trace) {
            const pc = cpu.getState().pc.toString(16);
            console.log(pc);
        }
        
        if (cnt > lim)
            break;
    }
}

// test(); video.unlock(); verbose=true;run(5000, true);
