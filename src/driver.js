const fps = 50;
const cpu_freq = 4_000_000;

function setupAnim(cpu, video) {
    const frame_cnt = cpu_freq / fps;
    const draw_cnt = 48_000;
    const blank_cnt = 32_000;

    function emulate() {
        let cnt = 0;
        
        video.unlock(cpu);
        cnt = 0;
        while (cnt < blank_cnt) {
            cnt += cpu.run_instruction();
        }

        video.lock(cpu);
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
