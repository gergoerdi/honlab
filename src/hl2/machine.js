const cpu = Z80(core);
core.cpu = cpu;

const machine = ((cpu, video, deck) => {
    const line_cnt = 256; // TODO: calculate this from PAL timings

    let cnt = 0;

    return {
        step: () => {
            let dcnt = cpu.run_instruction();
            cnt = (cnt + dcnt) % line_cnt;

            if (video.is_stalling()) {
                dcnt = dcnt + (line_cnt - 1 - cnt);
                cnt = 0;
            }

            deck.tick(dcnt);
            return dcnt;
        },
        start_frame: () => { if (video.is_running()) cpu.interrupt(true); },
        render: (renderer) => video.render(renderer)
    }})(cpu, video, deck);
