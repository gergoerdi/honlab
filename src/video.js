const renderer = (function () {
    const ctx = crt.getContext("2d");
    const buf = ctx.createImageData(crt.width, crt.height);

    return {
        setPixel: (ptr, pixel) => {
            buf.data[ptr++] = pixel ? 0xff : 0x00;
            buf.data[ptr++] = pixel ? 0xff : 0x00;
            buf.data[ptr++] = pixel ? 0xff : 0x00;
            buf.data[ptr++] = 0xff;
        
            return ptr;
        },

        paint: () => ctx.putImageData(buf, 0, 0)
    };
})();
