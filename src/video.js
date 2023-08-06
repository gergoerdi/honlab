const renderer = (function () {
    const ctx = crt.getContext("2d");
    const buf = ctx.createImageData(crt.width, crt.height);

    const setPixel = (ptr, pixel) => {
            buf.data[ptr++] = pixel ? 0xff : 0x00;
            buf.data[ptr++] = pixel ? 0xff : 0x00;
            buf.data[ptr++] = pixel ? 0xff : 0x00;
            buf.data[ptr++] = 0xff;

            return ptr;
    };

    return {
        setPixel,

        clear: () => {
            let ptr = 0;
            while (ptr < buf.data.length) {
                ptr = setPixel(ptr, false);
            }
        },

        paint: () => ctx.putImageData(buf, 0, 0)
    };
})();
