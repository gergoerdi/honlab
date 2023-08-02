const ctx = crt.getContext("2d");
const buf = ctx.createImageData(512, 256);
const charset = new Uint8Array(files["data/hl4-charset.bin"].slice());

crt.style.imageRendering = "pixelated";

function render(vram) {
    let ptr = 0;
    
    for (let row = 0; row < 32; ++row) {
        for (let subrow = 0; subrow < 8; ++subrow) {
            for (let col = 0; col < 64; ++col) {
                const c = vram[row * 64 + col];
                
                let glyphLine = charset[subrow << 8 | c];
                for (let j = 0; j < 8; ++j) {
                    let glyphPixel = glyphLine & 0x80;
                    
                    let [r, g, b] = glyphPixel ? [0xff, 0xff, 0xff] : [0x00, 0x00, 0x00];
                    buf.data[ptr++] = r;
                    buf.data[ptr++] = g;
                    buf.data[ptr++] = b;
                    buf.data[ptr++] = 0xff;

                    glyphLine <<= 1;
                }
            }
        }
    }

    ctx.putImageData(buf, 0, 0);
}
