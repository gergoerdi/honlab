let verbose = false;

function init_core(video) {
    const memmap = memory_map(ac_memory_map(video, keystate));
    
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
        mem_read: memmap.mem_read,
        mem_write: memmap.mem_write,
        io_read,
        io_write
    };
}

const vram = new Uint8Array(0x0400);
const video = function(vram) {
    let running = true;

    const on = () => { running = true; };
    const off = () => { running = false; };

    const lock = (cpu) => {
        if (running) {
            // console.log("interrupting");
            cpu.interrupt(true);
        }
    };

    const unlock = (cpu) => {
    };
    
    const drawing = () => locked;

    return { on, off, lock, unlock, drawing, vram, render: () => ac_render(vram) };
}(vram);

const core = init_core(video);
const cpu = Z80(core);

setupAnim(cpu, video);
