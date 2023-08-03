let verbose = false;

function init_core(video) {
    const memmap = memory_map(hl4_memory_map(video, keystate));
    
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

setupAnim(cpu, video);
