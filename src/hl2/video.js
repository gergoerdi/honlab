const charset = new Uint8Array(files["data/hl2/charset.bin"].slice());

const video = (() => {
    const vram = new Uint8Array(0x0400);
    let running = true;
    let dirty = true;

    const render = () => {
        let ptr = 0;

        for (let row = 0; row < 25; ++row) {
            for (let subrow = 0; subrow < 8; ++subrow) {
                for (let col = 0; col < 40; ++col) {
                    const c = vram[1 + row * 40 + col];

                    let glyphLine = charset[subrow << 8 | c];
                    for (let j = 0; j < 8; ++j) {
                        let glyphPixel = glyphLine & 0x80;
                        ptr = renderer.setPixel(ptr, glyphPixel);
                        glyphLine <<= 1;
                    }
                }
            }
        }
    };

    return {
        vram,
        on: () => { running = true; },
        off: () => { running = false; },
        is_running: () => running,
        start_frame: (cpu) => { if (running) cpu.interrupt(true); },
        vram: mk_ram(vram),
        render: () => {
            if (true || running)
                render();
            else
                renderer.clear();
            renderer.paint();
        }
    };
})();
