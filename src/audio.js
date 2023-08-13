// Based on https://stackoverflow.com/a/63344988/477476

function audioBufferToWav(abuf) {
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;

    const numOfChan = abuf.numberOfChannels,
          btwLength = abuf.length * numOfChan * bytesPerSample + 44,
          btwArrBuff = new ArrayBuffer(btwLength),
          view = new DataView(btwArrBuff);

    let btwChnls = [],
        btwPos = 0;

    writeString("RIFF");
    writeUint32(btwLength - 8); // file length - 8
    writeString("WAVE");
    writeString("fmt ");
    writeUint32(16); // length = 16
    writeUint16(1); // PCM (uncompressed)
    writeUint16(numOfChan);
    writeUint32(abuf.sampleRate);
    writeUint32(abuf.sampleRate * bytesPerSample * numOfChan); // avg. bytes/sec
    writeUint16(numOfChan); // block-align
    writeUint16(bitDepth); // 16-bit
    writeString("data");
    writeUint32(abuf.length * bytesPerSample); // chunk length

    let btwIndex;
    for (btwIndex = 0; btwIndex < abuf.numberOfChannels; btwIndex++)
        btwChnls.push(abuf.getChannelData(btwIndex));

    let btwOffset = 0;
    while (btwPos < btwLength) {
        for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
            // interleave btwChnls
            let btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
            btwSample =
                (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
            writeInt16(btwSample);
        }
        btwOffset++; // next source sample
    }

    return new Blob([btwArrBuff], { type: "audio/wav" });

    function writeString(s) {
        for (let i = 0; i < s.length; i++) {
            view.setUint8(btwPos++, s.charCodeAt(i))
        }
    }

    function writeUint16(data) {
        view.setUint16(btwPos, data, true);
        btwPos += 2;
    }

    function writeUint32(data) {
        view.setUint32(btwPos, data, true);
        btwPos += 4;
    }

    function writeInt16(data) {
        view.setInt16(btwPos, data, true);
        btwPos += 2;
    }

}
