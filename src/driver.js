const fps = 50;
const cpu_freq = 4 * 1000 * 1000;

function setupAnim(cpu, video) {
    const frame_cnt = cpu_freq / fps;
    const draw_cnt = frame_cnt * 0.8;
    const blank_cnt = frame_cnt - draw_cnt;

    let cnt = 0;
    let blank_end = 0;
    let frame_end = 0;

    function animate(t) {
        requestAnimationFrame(animate);
        
        const lim = cpu_freq / 1000 * t;

        while (cnt < lim) {
            video.unlock();
            while (cnt < blank_end) {
                cnt += cpu.run_instruction();
                if (cnt >= lim) return;
            }

            video.lock();
            while (cnt < frame_end) {
                cnt += cpu.run_instruction();
                if (cnt >= lim) return;
            }
        
            render(video.vram);
            blank_end = cnt + blank_cnt;
            frame_end = cnt + frame_cnt;
        }
    }

    requestAnimationFrame(animate);
}
