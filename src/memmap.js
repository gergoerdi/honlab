function memory_map(table) {
    function find_unit(addr) {
        let offset = 0;
        for (elem of table) {
            if (!elem.lim || addr < elem.lim) {
                return [elem.unit, addr - offset];
            }
            offset = elem.lim;
        }
    }

    return {
        mem_read: (addr, extra) => {
            const [unit, unit_addr] = find_unit(addr);
            return unit.read(unit_addr, extra);
        },
        mem_write: (addr, val, extra) => {
            const [unit, unit_addr] = find_unit(addr);
            return unit.write(unit_addr, val, extra);
        }};
}

const unconnected = (val) => ({
    read: (addr) => val,
    write: (addr, val) => {}
});

const mk_ram = (buf) => ({
    read: (addr) => buf[addr],
    write: (addr, val) => { buf[addr] = val; }
});

const mk_rom = (buf) => ({
    read: (addr) => buf[addr],
    write: (addr, val) => {}
});

const trace_mem_fun = (f, unit) => ({
    read: (addr) => { f(addr); return unit.read(addr); },
    write: (addr, val) => { f(addr, val); unit.write(addr, val); }
});

const trace_mem = (name, unit, verbose = true) => {
    const f = (addr, val) => {
        if (!verbose) return;
        if (val != undefined)
            console.log("write " + name, addr.toString(16), val.toString(16));
        else
            console.log("read " + name, addr.toString(16));
    };

    return trace_mem_fun(f, unit);
};
