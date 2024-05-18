const core = (() => {
    const memmap = memory_map(hl2_memory_map(video, keystate, deck));

    return {
        cpu: undefined,
        mem_read: (addr) => memmap.mem_read(addr, cpu),
        mem_write: memmap.mem_write,
        io_read: (port) => 0x00,
        io_write: (port) => {}
    };
})();
