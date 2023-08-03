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
        mem_read: (addr) => {
            const [unit, unit_addr] = find_unit(addr);
            return unit.read(unit_addr);
        },
        mem_write: (addr, val) => {
            const [unit, unit_addr] = find_unit(addr);
            return unit.write(unit_addr, val);
        }};
}
