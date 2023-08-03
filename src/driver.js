const fps = 50;
const cpu_freq = 4 * 1000 * 1000;

function setupAnim(cpu, video) {
    const frame_cnt = cpu_freq / fps;
    const draw_cnt = frame_cnt * 0.6;
    const blank_cnt = frame_cnt - draw_cnt;

    function emulate() {
        let cnt = 0;
        
        video.unlock();
        cnt = 0;
        while (cnt < blank_cnt) {
            cnt += cpu.run_instruction();
        }

        video.lock();
        cnt = 0;
        while (cnt < draw_cnt) {
            cnt += cpu.run_instruction();
        }
    }
    
    function animate(t) {
        requestAnimationFrame(animate);
        video.render();
    }

    setInterval(emulate, 20);
    requestAnimationFrame(animate);
}
