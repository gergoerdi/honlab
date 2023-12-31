const charset = new Uint8Array(files["data/hl2/charset.bin"].slice());

const video = (() => {
    const vram = new Uint8Array(0x0400);
    let running = false;
    let dirty = true;
    let stalling = false;

    const render = (renderer) => {
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
        wait_line: () => { stalling = true; },
        is_stalling: () => { const tmp = stalling; stalling = false; return tmp; },
        on: () => { running = true; },
        off: () => { running = false; },
        is_running: () => running,
        vram: mk_ram(vram),
        render: (renderer) => {
            if (true || running)
                render(renderer);
            else
                renderer.clear();
            renderer.paint();
        }
    };
})();
