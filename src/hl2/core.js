const core = (() => {
    const memmap = memory_map(hl2_memory_map(video, keystate, deck));

    return {
        mem_read: memmap.mem_read,
        mem_write: memmap.mem_write,
        io_read: (port) => 0x00,
        io_write: (port) => {}
    };
})();
