const cpu = Z80(core);

const machine = ((cpu, video, deck) => ({
    step: () => {
        let cnt = cpu.run_instruction();
        deck.tick(cnt);
        return cnt;
    },
    start_frame: () => { if (video.is_running()) cpu.interrupt(true); },
    render: (renderer) => video.render(renderer)
}))(cpu, video, deck);
