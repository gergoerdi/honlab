const video = (() => {
    const vram = new Uint8Array(0x0400);
    let running = true;
    let dirty = true;

    return {
        vram,
        on: () => { running = true; },
        off: () => { running = false; },
        start_frame: (cpu) => { if (running) cpu.interrupt(true); },
        vram,
        render: () => {
            if (running)
                hl2_render(vram, renderer.setPixel);
            else
                renderer.clear();
            renderer.paint();
        }
    };
})();

const core = (() => {
    const memmap = memory_map(hl2_memory_map(video, keystate));

    return {
        mem_read: memmap.mem_read,
        mem_write: memmap.mem_write,
        io_read: (port) => 0x00,
        io_write: (port) => {}
    };
})();

const cpu = Z80(core);

setupAnim(cpu, video);
