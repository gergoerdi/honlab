const charset = new Uint8Array(files["data/ac-charset.bin"].slice());

function ac_render(vram) {
    let ptr = 0;

    for (let row = 0; row < 25; ++row) {
        for (let subrow = 0; subrow < 8; ++subrow) {
            for (let col = 0; col < 40; ++col) {
                const c = vram[1 + row * 40 + col];

                let glyphLine = charset[subrow << 8 | c];
                for (let j = 0; j < 8; ++j) {
                    let glyphPixel = glyphLine & 0x80;
                    ptr = setPixel(ptr, glyphPixel);
                    glyphLine <<= 1;
                }
            }
        }
    }

    ctx.putImageData(buf, 0, 0);
}
