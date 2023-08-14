const clock = (() => {
    let cnt_buf = 0;
    let base_buf = 0;
    let wait_buf = 0;

    const cnt = () => cnt_buf;
    const base_cnt = () => base_buf;

    const run = (offset, f) => {
        const saved = [cnt_buf, base_buf, wait_buf];

        cnt_buf = base_buf = offset;
        wait_buf = 0;
        const result = f();
        const cnt = Math.max(cnt_buf, wait_buf);

        [cnt_buf, base_buf, wait_buf] = saved;

        return cnt; // TODO: return result as well?
    }

    const tick = (dt) => { cnt_buf += dt; };
    const wait_until = (t) => { wait_buf = Math.max(wait_buf, t); };

    return { run, tick, wait_until, cnt, base_cnt }
})();
