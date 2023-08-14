const cpu = Z80(core);
core.cpu = cpu;

const machine = ((cpu, video, deck) => {
    let cnt = 0;

    return {
        step: () => {
            const new_cnt = clock.run(cnt, () => {
                clock.tick(cpu.run_instruction());
            });
            const dcnt = new_cnt - cnt;
            cnt = new_cnt;

            deck.tick(dcnt);
            return cnt;
        },
        start_frame: () => { if (video.is_running()) cpu.interrupt(true); },
        render: (renderer) => video.render(renderer)
    }})(cpu, video, deck);
