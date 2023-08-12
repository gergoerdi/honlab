const fps = 50;
const cpu_freq = 4_000_000;

function setupAnim(machine) {
    const frame_cnt = cpu_freq / fps;
    const blank_ms = 1.6;
    const blank_cnt = cpu_freq / 1_000 * blank_ms;
    const line_cnt = 256; // TODO: calculate this from PAL timings
    // const draw_cnt = frame_cnt - blank_cnt;

    function emulate() {
        let cnt = 0;
        while (cnt < blank_cnt)
            cnt += machine.step();
        machine.start_frame();
        while (cnt < frame_cnt)
            cnt += machine.step();
    }

    function animate(t) {
        requestAnimationFrame(animate);
        machine.render(renderer);
    }

    setInterval(emulate, 1000 / fps);
    requestAnimationFrame(animate);
}
