const fps = 50;
const cpu_freq = 4_000_000;

function setupAnim(cpu, video) {
    const frame_cnt = cpu_freq / fps;
    const blank_ms = 2.5;
    const blank_cnt = cpu_freq / 1_000 * blank_ms;
    const draw_cnt = frame_cnt - blank_cnt;

    let cnt = 0;
    function step(dcnt) {
        const new_cnt = cnt + dcnt;
        const trigger = cnt < blank_cnt && new_cnt >= blank_cnt;

        cnt = new_cnt;
        if (cnt > frame_cnt)
            cnt -= frame_cnt;

        return trigger;
    }

    function run_for(lim) {
        let subcnt = 0;
        while (subcnt < lim) {
            let dcnt = cpu.run_instruction();
            subcnt += dcnt;
            if (step(dcnt))
                video.start_frame(cpu);
        }
    };

    function emulate() {
        run_for(frame_cnt / 5);
    }

    function animate(t) {
        requestAnimationFrame(animate);
        video.render();
    }

    setInterval(emulate, 20 / 5);
    requestAnimationFrame(animate);
}
