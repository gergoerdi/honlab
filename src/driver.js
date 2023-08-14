const fps = 50;
const cpu_freq = 4_000_000;

function setupAnim(machine) {
    const frame_cnt = cpu_freq / fps;
    const blank_ms = 1.6;
    const blank_cnt = cpu_freq / 1_000 * blank_ms;
    // const draw_cnt = frame_cnt - blank_cnt;

    let cnt = 0;
    let frame_num = 0;
    
    function emulate() {
        const base_cnt = frame_num * frame_cnt;

        // console.log(cnt, base_cnt + frame_cnt);
        if (cnt < base_cnt + blank_cnt) {
            while (cnt < base_cnt + blank_cnt)
                cnt = machine.step();
            machine.start_frame();
        }
        while (cnt < base_cnt + frame_cnt)
            cnt = machine.step();
        frame_num += 1;
    }

    function animate(t) {
        requestAnimationFrame(animate);
        machine.render(renderer);
    }

    setInterval(emulate, 1000 / fps);
    requestAnimationFrame(animate);
}
